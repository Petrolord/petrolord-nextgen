-- NG1 — Well Data Manager Beginner: the geoscience path root
-- (petrolord-suite docs/scope/NextGen-Geoscience-Courses-PLAN.md §2).
--
-- Two things land here:
--
-- 1. THE PREREQUISITE GATE (doctrine, NextGen-Academy-PLAN §1: "WDM
--    Beginner is a hard prerequisite for the other geoscience courses
--    because they all read the well registry; everything else is
--    recommended sequence"). Mechanism: academy_apps.prereq_slug + a
--    BEFORE INSERT trigger on academy_enrollments — ONE server-side
--    enforcement point that covers all four doors and any future door.
--    Learners who already hold an enrollment or a live certification on
--    the target app are unaffected (grandfathered); the documented
--    escape hatch for exceptional cases is a time-boxed instructor
--    override entitlement (N3.1), which does not create an enrollment.
--
-- 2. THE COURSE: capstone for welldata/beginner. The teaching datasets
--    are the six golden LAS files committed with @petrolord/engines
--    (test-data/wells/las); the oracle answer key below is the lasio
--    goldens, independently reproduced from the engine in Node before
--    this migration was written (parseLas over each file reproduces
--    every golden bit-for-bit — see the NG1 pentest doc). Unlike the
--    petrophysics capstone (parameters drive an auto-filled answer),
--    these answers are READ off the QC panel by the learner: the skill
--    being certified is LAS quality control.

-- ------------------------------------------------ prerequisite gate

alter table public.academy_apps
  add column if not exists prereq_slug text references public.academy_apps (slug);
comment on column public.academy_apps.prereq_slug is
  'Hard prerequisite (doctrine: only what the data spine forces). Enrollment requires a live certification on this app; enforced by academy_enforce_prereq on academy_enrollments.';

update public.academy_apps
   set prereq_slug = 'welldata'
 where module = 'geoscience' and slug <> 'welldata';

create or replace function public.academy_enforce_prereq()
returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_prereq text;
  v_name   text;
begin
  select prereq_slug into v_prereq from public.academy_apps
   where slug = new.app_slug;
  if v_prereq is null then
    return new;
  end if;

  -- Grandfather: any prior enrollment or live certification on the
  -- target app (re-enrollment, tier upgrades, pre-gate learners).
  if exists (select 1 from public.academy_enrollments
              where user_id = new.user_id and app_slug = new.app_slug) then
    return new;
  end if;
  if exists (select 1 from public.academy_certifications
              where user_id = new.user_id and app_slug = new.app_slug
                and revoked_at is null and now() < valid_until) then
    return new;
  end if;

  -- The requirement: a live certification (any tier) on the prereq app.
  if not exists (select 1 from public.academy_certifications
                  where user_id = new.user_id and app_slug = v_prereq
                    and revoked_at is null and now() < valid_until) then
    select name into v_name from public.academy_apps where slug = v_prereq;
    raise exception 'prerequisite not met: certify % (Associate) before enrolling in this course',
      coalesce(v_name, v_prereq);
  end if;
  return new;
end $$;

drop trigger if exists academy_enforce_prereq on public.academy_enrollments;
create trigger academy_enforce_prereq
  before insert on public.academy_enrollments
  for each row execute function public.academy_enforce_prereq();

-- ------------------------------------------------------ NG1 capstone

-- Answers are the committed lasio goldens (test-data/wells/goldens/*),
-- reproduced from the engine:
--   basic_20   : 301 samples, GR 8 nulls, GR mean 64.92720... GAPI
--   feet_20    : depth step 2 ft = 0.6096 m exactly (FT_PER_M)
--   nullheavy_20: NPHI is a fully dead curve — 201/201 nulls
--   wrapped_12 : 161 samples across wrapped data lines
insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values (
  'welldata', 'beginner', 'associate',
  'wells/las',
  'LAS quality control across the teaching wells',
  'Load each of the six teaching LAS files in the app and read the QC panel. Report the requested values exactly as the parser shows them: sample and null counts are integers; report the mean GR over finite samples; convert the feet_20 depth step to metres.',
  jsonb_build_array(
    jsonb_build_object('key','basic_n_samples',      'label','basic_20: depth samples',              'unit','count', 'expected',301,     'tol',0),
    jsonb_build_object('key','basic_gr_nulls',       'label','basic_20: GR null samples',            'unit','count', 'expected',8,       'tol',0),
    jsonb_build_object('key','basic_gr_mean',        'label','basic_20: mean GR (finite samples)',   'unit','GAPI',  'expected',64.92719962459895,'tol',0.05),
    jsonb_build_object('key','feet_step_m',          'label','feet_20: depth step, converted',       'unit','m',     'expected',0.6096,  'tol',0.001),
    jsonb_build_object('key','nullheavy_nphi_nulls', 'label','nullheavy_20: NPHI null samples',      'unit','count', 'expected',201,     'tol',0),
    jsonb_build_object('key','wrapped_n_samples',    'label','wrapped_12: depth samples',            'unit','count', 'expected',161,     'tol',0)
  ))
on conflict (app_slug, tier) do nothing;

-- ------------------------------------------------------ catalog flip

update public.academy_apps set status = 'available' where slug = 'welldata';
