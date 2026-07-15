-- NG7 — Advanced tiers (Expert certification) across all six geoscience
-- courses + the Suite bridge (NextGen-Geoscience-Courses-PLAN §2, final
-- phase).
--
-- OWNER Q3 LOCKED 2026-07-15 (Suite-bridge mechanics, decided before
-- the first Expert certificate per the plan):
--   * Shape: earning an Expert certificate AUTO-ISSUES a personal,
--     single-use discount code the learner redeems at Suite
--     subscription checkout. Decoupled: the code lives here (NextGen);
--     the Suite's checkout validates/redeems it server-to-server.
--   * Terms: 50% off, valid 12 months (the code's window equals the
--     certificate's validity window).
--   * Scope: the CERTIFIED MODULE only (academy_apps.module, snapshotted
--     onto the code at issue time; all six geoscience courses map to
--     the Geoscience module).
--
-- Spine wiring is the N3.1 discipline: the code is written by a
-- trigger on certification insert, voided by certification revocation,
-- readable by its owner via RLS (select-own only, zero client write
-- policies), verifiable anonymously by unguessable code (mining
-- resistant, same posture as certificate verification), and redeemable
-- ONLY by the trusted server (service role), because redemption is a
-- commercial state change.
--
-- Then the six Advanced capstones (cert_tier = expert). Every oracle
-- was reproduced from @petrolord/engines in Node before this migration
-- was written (see the NG7 pentest doc). Highlights of the oracle's
-- internal consistency: the three independent Rw estimates (Arps
-- temperature correction of the lab sample, the SP quicklook, and the
-- NG6 Pickett fit) all converge on the typewell's own Rw = 0.05, and
-- the two seismic tuning picks sit one grid sample above their
-- Kallweit-Wood theoretical thicknesses (sqrt(6)/(2*pi*f)).

-- ------------------------------------------------ 1. the Suite bridge

create table if not exists public.academy_suite_bridge_codes (
    id               uuid primary key default gen_random_uuid(),
    user_id          uuid not null references auth.users (id) on delete cascade,
    certification_id uuid not null unique
                     references public.academy_certifications (id) on delete cascade,
    app_slug         text not null,
    suite_module     text not null,        -- snapshot of academy_apps.module
    code             text not null unique
                     default 'PLB-' || upper(substr(md5(gen_random_uuid()::text
                                || clock_timestamp()::text), 1, 10)),
    discount_pct     integer not null default 50
                     check (discount_pct between 1 and 100),
    valid_until      timestamptz not null,  -- equals the certificate's window
    redeemed_at      timestamptz,           -- single use
    redemption_note  text,                  -- Suite-side reference (org/sub id)
    voided_at        timestamptz,           -- set when the cert is revoked
    created_at       timestamptz not null default now()
);
comment on table public.academy_suite_bridge_codes is
    'Owner Q3 (locked 2026-07-15): Expert certification auto-issues a personal single-use 50% discount code for the certified Suite module, valid for the certificate window (12 months). Commercial record: learner SELECT-own only; redemption is service-role only (the Suite checkout calls in server-to-server).';
create index if not exists academy_suite_bridge_codes_user_idx
    on public.academy_suite_bridge_codes (user_id);

-- Expert certification -> bridge code (idempotent per certification;
-- apps missing from the catalog issue nothing, so map new apps' module
-- before selling their Expert tier).
create or replace function public.academy_expert_bridge()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_module text;
begin
  if new.tier <> 'expert' then return new; end if;
  select module into v_module from public.academy_apps where slug = new.app_slug;
  if v_module is null then return new; end if;
  insert into public.academy_suite_bridge_codes
      (user_id, certification_id, app_slug, suite_module, valid_until)
  values (new.user_id, new.id, new.app_slug, v_module, new.valid_until)
  on conflict (certification_id) do nothing;
  return new;
end $$;
drop trigger if exists trg_academy_expert_bridge on public.academy_certifications;
create trigger trg_academy_expert_bridge
  after insert on public.academy_certifications
  for each row execute function public.academy_expert_bridge();

-- Certification revocation voids its unredeemed bridge code (a
-- redeemed code is history, not state to claw back here; commercial
-- follow-up on a redeemed-then-revoked cert is a human decision).
create or replace function public.academy_bridge_revoke()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.revoked_at is not null and old.revoked_at is null then
    update public.academy_suite_bridge_codes
       set voided_at = new.revoked_at
     where certification_id = new.id
       and redeemed_at is null and voided_at is null;
  end if;
  return new;
end $$;
drop trigger if exists trg_academy_bridge_revoke on public.academy_certifications;
create trigger trg_academy_bridge_revoke
  after update on public.academy_certifications
  for each row execute function public.academy_bridge_revoke();

-- Anonymous verification by unguessable code (the Suite checkout's
-- pre-flight and the learner's shareable proof). Mining resistant:
-- keyed on the code, returns no user id, and the table has no anon
-- SELECT policy.
create or replace function public.academy_verify_bridge_code(p_code text)
returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'code', b.code,
    'holder', coalesce(p.display_name, 'Registered learner'),
    'app_slug', b.app_slug,
    'suite_module', b.suite_module,
    'discount_pct', b.discount_pct,
    'certificate_number', c.certificate_number,
    'valid_until', b.valid_until,
    'status', case when b.voided_at is not null then 'voided'
                   when b.redeemed_at is not null then 'redeemed'
                   when now() >= b.valid_until then 'expired'
                   else 'valid' end)
  from public.academy_suite_bridge_codes b
  join public.academy_certifications c on c.id = b.certification_id
  left join public.profiles p on p.id = b.user_id
  where b.code = p_code;
$$;
revoke all on function public.academy_verify_bridge_code(text) from public;
grant execute on function public.academy_verify_bridge_code(text) to anon, authenticated;

-- Redemption: the trusted server only (the Suite checkout applies the
-- discount, then marks the code used). Single use; idempotent to
-- re-calls (reports already_redeemed instead of failing a retry).
create or replace function public.academy_redeem_bridge_code(
    p_code text,
    p_note text default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_row public.academy_suite_bridge_codes;
begin
  if auth.uid() is not null then
    raise exception 'bridge code redemption is server-side only';
  end if;
  select * into v_row from public.academy_suite_bridge_codes
   where code = p_code for update;
  if v_row.id is null then
    return jsonb_build_object('found', false);
  end if;
  if v_row.voided_at is not null then
    return jsonb_build_object('found', true, 'status', 'voided');
  end if;
  if v_row.redeemed_at is not null then
    return jsonb_build_object('found', true, 'status', 'redeemed',
      'already_redeemed', true, 'redeemed_at', v_row.redeemed_at);
  end if;
  if now() >= v_row.valid_until then
    return jsonb_build_object('found', true, 'status', 'expired');
  end if;
  update public.academy_suite_bridge_codes
     set redeemed_at = now(), redemption_note = p_note
   where id = v_row.id;
  return jsonb_build_object('found', true, 'status', 'redeemed',
    'already_redeemed', false,
    'suite_module', v_row.suite_module,
    'discount_pct', v_row.discount_pct,
    'user_id', v_row.user_id);
end $$;
revoke all on function public.academy_redeem_bridge_code(text, text)
  from public, anon, authenticated;
grant execute on function public.academy_redeem_bridge_code(text, text) to service_role;

-- RLS: learners read their own codes; admin/instructor console read;
-- zero client write policies (writes are triggers + the redeem fn).
alter table public.academy_suite_bridge_codes enable row level security;

drop policy if exists "academy_bridge_codes_select_own" on public.academy_suite_bridge_codes;
create policy "academy_bridge_codes_select_own"
    on public.academy_suite_bridge_codes for select using (auth.uid() = user_id);

drop policy if exists "academy_bridge_codes_select_admin" on public.academy_suite_bridge_codes;
create policy "academy_bridge_codes_select_admin"
    on public.academy_suite_bridge_codes for select
    using (public.get_user_role() in ('lecturer','admin','super_admin'));

-- ------------------------------------------- 2. the six capstones

insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'petrophysics', 'advanced', 'expert',
  'petrophysics/typewell + lab sample',
  'Rw triangulation on the typewell',
  'A lab measured the formation water sample at 0.114 ohm.m at 75 degF; formation temperature is 180 degF. The SP quicklook reads SSP = -93 mV with Rmfe = 0.62 ohm.m at formation temperature. Correct the sample with Arps, convert the SSP, and confirm both against the Pickett fit from the Professional tier. Then book SAND_A twice: with the corrected Rw and with the raw sample value, and watch what the wrong Rw does to pay.',
  jsonb_build_array(
    jsonb_build_object('key','rw_arps',                'label','Sample Rw at formation temperature (Arps)','unit','ohm.m','expected',0.049910478128179045,'tol',0.0005),
    jsonb_build_object('key','rwe_ssp',                'label','Rwe from the SP quicklook',                'unit','ohm.m','expected',0.049831180824251246,'tol',0.0005),
    jsonb_build_object('key','sw_waterleg_mean',       'label','Water-leg mean Sw with the Arps Rw',       'unit','v/v',  'expected',0.9991043802143901,  'tol',0.005),
    jsonb_build_object('key','sand_a_net_arps',        'label','SAND_A net pay with the Arps Rw',          'unit','m',    'expected',18,                  'tol',0.01),
    jsonb_build_object('key','sand_a_sw_avg_arps',     'label','SAND_A pay-average Sw with the Arps Rw',   'unit','v/v',  'expected',0.3609390898147585,  'tol',0.005),
    jsonb_build_object('key','sand_a_net_uncorrected', 'label','SAND_A net pay with the raw sample Rw',    'unit','m',    'expected',16.5,                'tol',0.01)
  )
),
(
  'welldata', 'advanced', 'expert',
  'wells/las (all six files)',
  'The six-file import campaign',
  'Run the full import pipeline on every teaching file and read the campaign panel: total curves imported (depth excluded), files needing unit conversion, dead curves detected, files with a uniform depth step, samples parsed from the wrapped LAS 1.2 file, and total flagged nulls in nullheavy_20.',
  jsonb_build_array(
    jsonb_build_object('key','campaign_curves','label','Curves imported across the campaign','unit','count','expected',24, 'tol',0),
    jsonb_build_object('key','converted_files','label','Files needing depth unit conversion','unit','count','expected',1,  'tol',0),
    jsonb_build_object('key','dead_curves',    'label','Dead curves detected',               'unit','count','expected',1,  'tol',0),
    jsonb_build_object('key','uniform_files',  'label','Files with a uniform depth step',    'unit','count','expected',5,  'tol',0),
    jsonb_build_object('key','wrapped_samples','label','Depth samples in wrapped_12',        'unit','count','expected',161,'tol',0),
    jsonb_build_object('key','nullheavy_nulls','label','Flagged nulls in nullheavy_20',      'unit','count','expected',272,'tol',0)
  )
),
(
  'wellcorrelation', 'advanced', 'expert',
  'correlation/ekene-section',
  'Predict the missing TOP_B in Ekene-4',
  'Ekene-4 TDs above TOP_B. Predict the missing pick two ways from the three wells that carry it: project the mean TOP_A to TOP_B interval down from TOP_A (the layer-cake estimate), and the mean TOP_SAND to TOP_B interval down from TOP_SAND. Report both predictions, their spread (that is the growth uncertainty), the two mean intervals, and the structural relief of TOP_B where it is drilled.',
  jsonb_build_array(
    jsonb_build_object('key','a_to_b_mean',      'label','Mean TOP_A to TOP_B interval',      'unit','m','expected',141, 'tol',0.01),
    jsonb_build_object('key','sand_to_b_mean',   'label','Mean TOP_SAND to TOP_B interval',   'unit','m','expected',92,  'tol',0.01),
    jsonb_build_object('key','w4_topb_layercake','label','Ekene-4 TOP_B, layer-cake estimate','unit','m','expected',1671,'tol',0.01),
    jsonb_build_object('key','w4_topb_from_sand','label','Ekene-4 TOP_B, from TOP_SAND',      'unit','m','expected',1682,'tol',0.01),
    jsonb_build_object('key','prediction_spread','label','Spread between the two estimates',  'unit','m','expected',11,  'tol',0.01),
    jsonb_build_object('key','topb_relief',      'label','TOP_B structural relief (3 wells)', 'unit','m','expected',34,  'tol',0.01)
  )
),
(
  'seismolord', 'advanced', 'expert',
  'rockphysics/wedge (RC pair +0.08/-0.08)',
  'Wedge tuning of the SAND reflection pair',
  'Model the SAND top and base as an equal and opposite reflection pair (RC +0.08 / -0.08) in a wedge from 0 to 60 ms at a 2 ms sample rate. Read the tuning panel at 25 Hz and 40 Hz: the tuning thickness and its peak amplitude at each frequency, the isolated-reflector amplitude on the thick end at 25 Hz, and the Kallweit-Wood theoretical tuning thickness sqrt(6)/(2*pi*f) at 25 Hz.',
  jsonb_build_array(
    jsonb_build_object('key','tune25_ms',  'label','Tuning thickness at 25 Hz',              'unit','ms','expected',16,                  'tol',0),
    jsonb_build_object('key','tune25_amp', 'label','Peak amplitude at 25 Hz tuning',         'unit','-', 'expected',0.1155947595834732,  'tol',0.002),
    jsonb_build_object('key','tune40_ms',  'label','Tuning thickness at 40 Hz',              'unit','ms','expected',10,                  'tol',0),
    jsonb_build_object('key','tune40_amp', 'label','Peak amplitude at 40 Hz tuning',         'unit','-', 'expected',0.1155947595834732,  'tol',0.002),
    jsonb_build_object('key','iso25_amp',  'label','Isolated-reflector amplitude at 25 Hz',  'unit','-', 'expected',0.07999999821186066, 'tol',0.002),
    jsonb_build_object('key','theory25_ms','label','Theoretical tuning thickness at 25 Hz',  'unit','ms','expected',15.593936024673521,  'tol',0.05)
  )
),
(
  'mapping', 'advanced', 'expert',
  'mapping/ekene-validation',
  'Validate the Ekene TOP_SAND grid',
  'Cross-validate the TOP_SAND grid by leave-one-out: only wells INSIDE the control hull can be validated (the gridder masks to the hull, so a removed edge well can never see a prediction at its own location). Report how many wells that is and the residual at Ekene-6. Then blind-test the new appraisal well Ekene-7 at (1500, 1500), actual pick 1549 m: the six-well grid prediction there, its residual, and the crest and live node count after regridding with Ekene-7 included.',
  jsonb_build_array(
    jsonb_build_object('key','cross_validatable_wells','label','Wells that can be cross-validated','unit','count','expected',1,                 'tol',0),
    jsonb_build_object('key','loo_resid_e6',           'label','Leave-one-out residual at Ekene-6', 'unit','m',    'expected',9.8438720703125,  'tol',0.1),
    jsonb_build_object('key','pred_at_e7',             'label','Six-well grid prediction at Ekene-7','unit','m',   'expected',1543.3271484375,  'tol',0.1),
    jsonb_build_object('key','blind_residual_e7',      'label','Blind-test residual at Ekene-7',    'unit','m',    'expected',-5.6728515625,    'tol',0.1),
    jsonb_build_object('key','zmin_with_e7',           'label','Crest depth with Ekene-7 included', 'unit','m',    'expected',1540.70556640625, 'tol',0.1),
    jsonb_build_object('key','live_with_e7',           'label','Live nodes with Ekene-7 included',  'unit','count','expected',201,              'tol',0)
  )
),
(
  'reservoircalc', 'advanced', 'expert',
  'reservoircalc/ekene-property-model',
  'Property-model the Ekene SAND',
  'Replace the constant porosity with a per-node property grid: fit a porosity trend surface to the six well values (0.22, 0.19, 0.23, 0.17, 0.21, 0.22 for Ekene-1 to Ekene-6) with the population engine and rerun the volumetrics at the 1560 m contact. Read the panel: the trend porosity at prospect P-1 and its mean over the oil-bearing nodes, the pore volume and HCPV, the STOIIP, and how much the trend model adds over the constant-porosity booking.',
  jsonb_build_array(
    jsonb_build_object('key','phi_at_p1',         'label','Trend porosity at P-1',              'unit','v/v',    'expected',0.20714187889686578,'tol',0.001),
    jsonb_build_object('key','phi_mean_oil',      'label','Mean trend porosity over oil nodes', 'unit','v/v',    'expected',0.20936760570720417,'tol',0.001),
    jsonb_build_object('key','pore_trend_mm3',    'label','Pore volume, trend model',           'unit','10^6 m3','expected',3.7558468705687864, 'tol',0.02),
    jsonb_build_object('key','hcpv_trend_mm3',    'label','HCPV, trend model',                  'unit','10^6 m3','expected',2.4413004882563025, 'tol',0.02),
    jsonb_build_object('key','stoiip_trend_mmstb','label','STOIIP, trend model',                'unit','MMstb',  'expected',12.79607650919541,  'tol',0.05),
    jsonb_build_object('key','stoiip_delta_mmstb','label','STOIIP added over the constant model','unit','MMstb', 'expected',0.656868401698647,  'tol',0.02)
  )
)
on conflict (app_slug, tier) do nothing;
