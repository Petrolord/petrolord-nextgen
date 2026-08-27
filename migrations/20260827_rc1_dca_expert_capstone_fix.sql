-- ============================================================================
-- RC1 fix: replace a mis-positioned field in the DCA EXPERT capstone.
--
-- DEFECT (design error, caught before any Expert content was authored and
-- before the course is enrollable): the Expert capstone graded
-- `snap_over_pct`, the monthly-snapshot overstatement of Ekene-1's primary
-- cumulative. But the PROFESSIONAL tier owns that topic outright: its module
-- m03 is "forecast mechanics" and its lesson l03 is literally
-- "monthly-snapshot-overstatement", which derives the snapshot law and states
-- the figure. Grading it at Expert tests recall of the tier below rather than
-- Expert skill, on a certification that sells at the Expert fee.
--
-- FIX: grade the OIL-versus-GROSS decline instead, which no lower tier
-- teaches. On the SAME post-ramp window the Expert capstone already uses for
-- Ekene-5 (2024-05-01 onward), Ekene-5 carries no water cut and recovers the
-- designed gross decline of 0.00035 per day exactly, while Ekene-6, whose
-- water cut climbs toward 45 percent, declines at 0.0013275893489185155 per
-- day, about 3.79 times faster. The pair makes the Expert point directly: an
-- oil decline is not the reservoir's decline, and you must fit the stream you
-- actually book. Both values are engine-derived from the committed
-- test-data/ekene-dynamic goldens.
--
-- Safe to run because (dca, advanced) is not yet enrollable (the catalog row
-- is still 'coming_soon'), no Expert enrollment exists, and therefore no
-- attempt has ever been graded against the old field.
-- ============================================================================

do $$
declare
  v_attempts integer;
  v_status   text;
begin
  select count(*) into v_attempts
    from public.academy_capstone_attempts
   where app_slug = 'dca' and tier = 'advanced';
  if v_attempts <> 0 then
    raise exception 'RC1 expert capstone fix refused: % attempts already graded against the old key', v_attempts;
  end if;

  select status into v_status from public.academy_apps where slug = 'dca';
  if v_status is distinct from 'coming_soon' then
    raise exception 'RC1 expert capstone fix refused: dca is already %, so a learner could be mid-course', v_status;
  end if;
end
$$;

update public.academy_capstones
   set prompt = 'Refit Ekene-5 on the fully post-ramp window (2024-05-01 onward) and report its fitted nominal decline. On that SAME window, refit Ekene-6, whose water cut is climbing, and report its fitted decline: the two wells share a reservoir and a gross decline, so the difference is the water cut alone. Then book the b = 1.2 EUR at qi 120 stb/d, Di 0.0012 per day and a 10 stb/d limit, with its ratio to the exponential booking of the same data, and compute the field triangle''s P90 and P10 (minimum 380000, mode 461709.132532792, maximum 580000 stb, petroleum convention with P90 low).',
       fields = jsonb_build_array(
         jsonb_build_object('key','e5_late_di',  'label','Ekene-5 post-ramp fitted Di (2024-05-01 on)',        'unit','1/d', 'expected',0.00035,             'tol',0.000005),
         jsonb_build_object('key','e6_oil_di',   'label','Ekene-6 oil decline on the same window',             'unit','1/d', 'expected',0.0013275893489185155,'tol',0.00002),
         jsonb_build_object('key','b12_eur_stb', 'label','EUR at b 1.2 (qi 120, Di 0.0012, limit 10)',         'unit','stb', 'expected',321875.914758613,   'tol',2000),
         jsonb_build_object('key','b_ratio',     'label','b 1.2 EUR over the exponential EUR',                 'unit','-',   'expected',3.5113736155485,     'tol',0.02),
         jsonb_build_object('key','p90_stb',     'label','Field triangle P90 (low)',                           'unit','stb', 'expected',420425.025054486,   'tol',2000),
         jsonb_build_object('key','p10_stb',     'label','Field triangle P10 (high)',                          'unit','stb', 'expected',531360.331525141,   'tol',2000)
       )
 where app_slug = 'dca' and tier = 'advanced';
