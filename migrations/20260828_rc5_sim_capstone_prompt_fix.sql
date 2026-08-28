-- ============================================================================
-- RC5 FIX: the Professional capstone prompt named the wrong pressure.
--
-- The graded field `correlated_bo_at_pi` expects 1.2292846175634324 rb/stb,
-- which is what Standing returns at Ekene's initial pressure of 3200 psia.
-- The prompt said 2600 psia, which is not a pressure this field uses at all:
-- 2600 was a transcription slip, and the deck's own EQUIL datum pressure and
-- the tier's own lessons (intermediate m03 l01) both say 3200.
--
-- At 2600 psia the correlation returns 1.240398114843257, which is 0.011 from
-- the expected value against a tolerance of 0.0005. A learner who followed the
-- prompt exactly would have failed a field they worked correctly.
--
-- Found 2026-08-28 while deriving the RC6 Fluid Properties truth digest from
-- the same correlation, which is the argument for building the next course on
-- the same engine as the last one.
--
-- SAFE TO APPLY: academy_capstone_attempts holds zero sim rows and the catalog
-- row is still 'coming_soon', so nothing has been graded against the old text.
-- The migration refuses to run if either of those stops being true.
--
-- Only the prompt changes. The answer key, the tolerances and the field list
-- are untouched: the expected value was right and the question was wrong.
-- ============================================================================

do $$
declare
  v_attempts integer;
  v_status   text;
begin
  select count(*) into v_attempts
    from public.academy_capstone_attempts where app_slug = 'sim';
  if v_attempts <> 0 then
    raise exception 'RC5 prompt fix refused: % sim capstone attempts already exist; a graded attempt must not have its question rewritten under it', v_attempts;
  end if;

  select status into v_status from public.academy_apps where slug = 'sim';
  if v_status is distinct from 'coming_soon' then
    raise exception 'RC5 prompt fix refused: sim is already %, so the course is enrollable and this is no longer a pre-launch correction', v_status;
  end if;
end
$$;

update public.academy_capstones
   set prompt = replace(
         prompt,
         'the oil formation volume factor Standing''s correlation returns at the initial pressure of 2600 psia',
         'the oil formation volume factor Standing''s correlation returns at the initial pressure of 3200 psia'
       )
 where app_slug = 'sim'
   and tier = 'intermediate'
   and prompt like '%initial pressure of 2600 psia%';

do $$
declare
  v_fixed integer;
begin
  select count(*) into v_fixed
    from public.academy_capstones
   where app_slug = 'sim' and tier = 'intermediate'
     and prompt like '%initial pressure of 3200 psia%';
  if v_fixed <> 1 then
    raise exception 'RC5 prompt fix failed: % Professional capstones now name 3200 psia, expected 1', v_fixed;
  end if;
  if exists (
    select 1 from public.academy_capstones
     where app_slug = 'sim' and prompt like '%2600 psia%'
  ) then
    raise exception 'RC5 prompt fix failed: a sim capstone still names 2600 psia';
  end if;
end
$$;
