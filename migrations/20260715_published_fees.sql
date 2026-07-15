-- Published fees — owner schedule (2026-07-15), replacing the N3.2
-- placeholder amounts (NextGen-Academy-PLAN §5: the spine only needed the
-- shape; the owner sets the levels).
--
-- Fees are per SCHOOL × tier, not flat. Two schools:
--   * Subsurface & Engineering (app-courses): ₦60k / ₦120k / ₦200k
--     (Associate/Beginner, Professional/Intermediate, Expert/Advanced)
--   * Energy Business & Society (courses):     ₦40k / ₦75k  / ₦120k
-- Charge currency is NGN (Paystack). USD is a secondary, approximate
-- display value ("publish as separate price lists reviewed quarterly").
--
-- So the fee schedule gains a `school` dimension: academy_apps.school
-- tags each course's school, and academy_fees is keyed by school × tier.
-- The 6 existing (geoscience) apps are Subsurface & Engineering; the
-- Energy Business fees are seeded ready for those courses to land.
-- The personal registration fee (campus door) stays school-agnostic and
-- is still an owner-tunable placeholder.

-- ------------------------------------------------ school on the catalog

alter table public.academy_apps
  add column if not exists school text not null default 'subsurface'
  check (school in ('subsurface', 'energy_business'));
comment on column public.academy_apps.school is
  'Academy school. Drives per-school pricing (academy_fees). The 6 geoscience apps are Subsurface & Engineering.';

-- (the 6 seeded geoscience apps default to 'subsurface' — correct)

-- ------------------------------------------- restructure fees to school

alter table public.academy_fees add column if not exists school text;
alter table public.academy_fees add column if not exists amount_usd_minor integer;  -- secondary display (cents)
comment on column public.academy_fees.school is
  'School this fee applies to (null = school-agnostic, e.g. the registration fee). App-specific override via app_slug when non-null.';
comment on column public.academy_fees.amount_usd_minor is
  'Approximate USD (cents) for display only — charge currency is NGN. Reviewed quarterly.';

-- Placeholder rows only; zero live payments reference them (verified
-- 2026-07-15). Rebuild the schedule school-based.
delete from public.academy_fees;

alter table public.academy_fees drop constraint if exists academy_fees_pkey;
alter table public.academy_fees alter column app_slug drop not null;

-- one school-default fee per (school, tier, kind); optional per-app override
create unique index if not exists academy_fees_school_key
  on public.academy_fees (school, course_tier, kind) where app_slug is null;
create unique index if not exists academy_fees_app_key
  on public.academy_fees (app_slug, course_tier, kind) where app_slug is not null;

-- Course fees (minor units — NGN kobo; USD cents). Owner schedule.
insert into public.academy_fees
    (school, app_slug, course_tier, kind, amount_minor, amount_usd_minor, currency) values
  ('subsurface',      null, 'beginner',     'course',  6000000,  4000, 'NGN'),  -- ₦60,000  ≈ $40
  ('subsurface',      null, 'intermediate', 'course', 12000000,  8000, 'NGN'),  -- ₦120,000 ≈ $80
  ('subsurface',      null, 'advanced',     'course', 20000000, 13000, 'NGN'),  -- ₦200,000 ≈ $130
  ('energy_business', null, 'beginner',     'course',  4000000,  2700, 'NGN'),  -- ₦40,000  ≈ $27
  ('energy_business', null, 'intermediate', 'course',  7500000,  5000, 'NGN'),  -- ₦75,000  ≈ $50
  ('energy_business', null, 'advanced',     'course', 12000000,  8000, 'NGN');  -- ₦120,000 ≈ $80

-- Campus personal registration fee — school-agnostic, still a PLACEHOLDER
-- (the owner schedule does not set it).
insert into public.academy_fees
    (school, app_slug, course_tier, kind, amount_minor, amount_usd_minor, currency) values
  (null, null, '*', 'registration', 1000000, 700, 'NGN');                       -- ₦10,000 PLACEHOLDER

-- ---------------------------------------------------- school-aware lookup

-- Resolve the effective fee for an app+tier+kind: prefer a per-app
-- override, then the app's school schedule, then a school-agnostic row
-- (registration). Apps default to 'subsurface' if not catalogued.
create or replace function public.academy_fee(p_app text, p_tier text, p_kind text)
returns public.academy_fees
language sql stable security definer set search_path = public as $$
  with sch as (
    select coalesce((select school from public.academy_apps where slug = p_app),
                    'subsurface') as s)
  select f.* from public.academy_fees f, sch
   where f.kind = p_kind and f.active
     and (f.app_slug = p_app or f.app_slug is null)
     and (f.school = sch.s or f.school is null)
     and (f.course_tier = p_tier or f.course_tier = '*')
   order by (f.app_slug is not null and f.app_slug = p_app) desc, -- per-app override wins
            (f.school is not null) desc,          -- school-specific over agnostic
            (f.course_tier = p_tier) desc         -- exact tier over '*'
   limit 1;
$$;
