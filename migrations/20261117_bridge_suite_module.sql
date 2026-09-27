-- Expert bridge codes carry the Suite module SLUG of the course's Suite app.
--
-- The Expert certificate's Suite discount code (academy_expert_bridge(),
-- 20260715_ng7_advanced_tiers.sql) snapshots academy_apps.module into
-- academy_suite_bridge_codes.suite_module. The Suite's generate-quote
-- applies a code to the apps and modules whose Suite module slug
-- (modules.slug) equals suite_module. Academy module keys and Suite slugs
-- agree for geoscience, reservoir, drilling, production, facilities,
-- economics and assurance, and differ everywhere else:
--
--   Academy module       course(s)                         Suite module slug
--   supply_chain         supply, materials, marine         midstream-downstream
--   commercial_trading   crude, refinery                   midstream-downstream
--   energy_transition    carbon, gasvalue                  midstream-downstream
--   hse                  lopa, consequence, qra            process-safety
--   data_ai              dataqc, mlcore, facies,           data-ai
--                        forecastml, appliedai
--
-- so those Expert codes discounted nothing. This migration:
--   1. adds a nullable academy_apps.suite_module (the Suite module slug of
--      the course's Suite app, where it differs from module);
--   2. has academy_expert_bridge() stamp coalesce(suite_module, module);
--   3. sets suite_module for the courses above;
--   4. re-stamps their UNREDEEMED bridge codes with the Suite slug.
--      Redeemed codes are history and are never touched.
--
-- Left unmapped on purpose (no Suite app; an owner decision): procurement
-- (supply_chain), hygiene and safetystats (hse). Their codes keep the
-- Academy module and still match no Suite module.
--
-- materials (SC3) and marine (SC4) have no academy_apps row until their
-- course migrations run. Step 3 is keyed on slug, so a missing row is a
-- no-op; if a course migration runs after this file, run this file again
-- (idempotent) or set suite_module in that course migration.
--
-- Pair: petrolord-suite generate-quote matches app codes on modules.slug
-- (supabase/functions/_shared/bridge-scope.ts). Order: apply this, then
-- `supabase functions deploy generate-quote`.
--
-- No transaction lines of its own (the runner wraps it). Idempotent.

-- 1. The column. Slug-shaped when set.
alter table public.academy_apps
  add column if not exists suite_module text
    check (suite_module is null or suite_module ~ '^[a-z0-9]+(-[a-z0-9]+)*$');
comment on column public.academy_apps.suite_module is
  'Suite module slug (petrolord-suite modules.slug) of the course''s Suite app, where it differs from module. academy_expert_bridge() stamps coalesce(suite_module, module) on the Expert bridge code; the Suite matches codes on modules.slug.';

-- 2. The trigger function stamps the Suite slug.
create or replace function public.academy_expert_bridge()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_module text;
begin
  if new.tier <> 'expert' then return new; end if;
  select coalesce(suite_module, module) into v_module
    from public.academy_apps where slug = new.app_slug;
  if v_module is null then return new; end if;
  insert into public.academy_suite_bridge_codes
      (user_id, certification_id, app_slug, suite_module, valid_until)
  values (new.user_id, new.id, new.app_slug, v_module, new.valid_until)
  on conflict (certification_id) do nothing;
  return new;
end $$;

-- 3. Courses whose Suite app sits in a module with a different key.
update public.academy_apps a
   set suite_module = m.suite_module
  from (values
    ('supply',      'midstream-downstream'),
    ('materials',   'midstream-downstream'),
    ('marine',      'midstream-downstream'),
    ('crude',       'midstream-downstream'),
    ('refinery',    'midstream-downstream'),
    ('carbon',      'midstream-downstream'),
    ('gasvalue',    'midstream-downstream'),
    ('lopa',        'process-safety'),
    ('consequence', 'process-safety'),
    ('qra',         'process-safety'),
    ('dataqc',      'data-ai'),
    ('mlcore',      'data-ai'),
    ('facies',      'data-ai'),
    ('forecastml',  'data-ai'),
    ('appliedai',   'data-ai')
  ) as m(slug, suite_module)
 where a.slug = m.slug
   and a.suite_module is distinct from m.suite_module;

-- 4. Unredeemed codes already issued for those courses take the Suite slug.
update public.academy_suite_bridge_codes b
   set suite_module = a.suite_module
  from public.academy_apps a
 where a.slug = b.app_slug
   and a.suite_module is not null
   and b.redeemed_at is null
   and b.suite_module is distinct from a.suite_module;
