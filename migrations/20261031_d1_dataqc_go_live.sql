-- ============================================================================
-- D1 GO-LIVE (HELD): Oilfield Data Quality flips to 'available', the FIRST
-- course of the Data & AI module, at path_order 66.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/dataqc. The 78 lessons, the teaching lab (dataqcLab.js),
-- its three explorer panels and the eight capstone case files ship in the ZIP
-- and NOT in this database, so a flip before the upload puts a live catalogue
-- tile in front of a route that does not exist. This file is written, dry-run
-- and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED THREE WAYS, and none restates the generator:
--
--   1. against the ENGINE LEDGER: the values d1_capstone.mjs returned through
--      the vendored engines/dataai/quality.js when this file was generated, to
--      the last bit, so a capstone row an earlier seed left behind, or a move
--      of one part in 1e7, is refused by name;
--   2. by a SECOND ROUTE IN SQL over the data in the case files: counting,
--      stepping, percentile_cont (the R7 rule), a two-by-two inverse, the chart
--      recursions step by step, and the Grubbs critical value by bisecting
--      Student's t with the closed-form odd-degree tail (A and S 26.7.3), each
--      to 1e-9 relative;
--   3. by the TRAPS the course is built on, each of which must bite on these
--      inputs: the reading a learner who missed the lesson would give is
--      computed and refused if it lands within the field's tolerance.
--
-- THE GRADER IS NUMERIC. academy_submit_capstone casts expected, tol and the
-- answer to numeric and passes abs(answer - expected) <= tol. Every field must
-- carry a positive, non-whole expected value at the six-decimal floor 5e-7
-- with a label and a unit, the six-decimal answer the prompt asks for must
-- pass, and one unit either side of it in the sixth decimal must fail.
--
-- EVERY DENOMINATOR BELOW IS A FLOAT, ON PURPOSE. Postgres divides integer by
-- integer as an integer, and the generator refuses a bare integer denominator.
--
-- EVERY REFUSAL THAT READS A GRADED VALUE NAMES IT as tier/key.
-- ============================================================================

do $$
declare
  v_structures int; v_questions int; v_capstones int; v_lessons int;
  v_modules int; v_graded int; v_available int; v_soon int; v_n int; i int; j int;
  v_names text; v_prompt text; v_s double precision; v_wrong double precision; v_x double precision;
  v_prev double precision; v_last int; v_med double precision; v_mad double precision;
  v_m double precision; v_sd double precision; v_q1 double precision; v_q3 double precision;
  v_lo double precision; v_hi double precision; v_mid double precision; v_t double precision; v_th double precision;
  v_term double precision; v_sum double precision; v_tail double precision; v_q double precision;
  v_ma double precision; v_mb double precision; v_saa double precision; v_sab double precision; v_sbb double precision;
  v_det double precision; v_da double precision; v_db double precision; v_d2 double precision; v_best double precision;
  v_centre double precision; v_mrbar double precision; v_sigma double precision; v_e double precision;
  v_ws double precision; v_nn double precision;
  v_g_odudu_rhob_completeness double precision;
  v_g_odudu_nphi_coverage double precision;
  v_g_odudu_scada_expected_step_min double precision;
  v_g_odudu_water_cut_day23 double precision;
  v_g_odudu_cumulative_drop_bbl double precision;
  v_g_odudu_phase_sum_allowed_day44_bbl_d double precision;
  v_g_ikoro_core_max_abs_z double precision;
  v_g_ikoro_core_max_abs_modified_z double precision;
  v_g_ikoro_rhob_upper_fence_g_cm3 double precision;
  v_g_ikoro_rhob_hampel_threshold_entry57_g_cm3 double precision;
  v_g_ikoro_core_grubbs_critical double precision;
  v_g_ikoro_max_mahalanobis_d2 double precision;
  v_g_amasiri_phase1_individuals_ucl_psig double precision;
  v_g_amasiri_phase1_mr_ucl_psig double precision;
  v_g_amasiri_ewma_day14_psig double precision;
  v_g_amasiri_ewma_exact_ucl_day2_psig double precision;
  v_g_amasiri_cusum_upper_day18_psi double precision;
  v_g_amasiri_scorecard_total double precision;
  v_od_depth double precision[] := array[6200.0, 6200.5, 6201.0, 6201.5, 6202.0, 6202.5, 6203.0, 6203.5, 6204.0, 6204.5, 6205.0, 6205.5, 6206.0, 6206.5, 6207.0, 6207.5, 6208.0, 6208.5, 6209.0, 6209.5, 6210.0, 6210.5, 6211.0, 6211.5, 6212.0, 6212.5, 6213.0, 6213.5, 6214.0, 6214.5, 6215.0, 6215.5, 6216.0, 6216.5, 6217.0, 6217.5, 6218.0, 6218.5, 6219.0, 6219.5, 6220.0, 6220.5, 6221.0, 6221.5, 6222.0, 6222.5, 6223.0, 6223.5, 6224.0, 6224.5, 6225.0, 6225.5, 6226.0, 6226.5, 6227.0, 6227.5, 6228.0, 6228.5, 6229.0, 6229.5, 6230.0, 6230.5, 6231.0, 6231.5, 6232.0, 6232.5, 6233.0, 6233.5, 6234.0, 6234.5, 6235.0, 6235.5, 6236.0, 6236.5, 6237.0, 6237.5, 6238.0, 6238.5, 6239.0, 6239.5, 6240.0, 6240.5, 6241.0, 6241.5, 6242.0, 6242.5, 6243.0, 6243.5, 6244.0, 6244.5, 6245.0, 6245.5, 6246.0, 6246.5, 6247.0, 6247.5, 6248.0, 6248.5, 6249.0, 6249.5, 6250.0, 6250.5, 6251.0, 6251.5, 6252.0, 6252.5, 6253.0, 6253.5, 6254.0, 6254.5, 6255.0, 6255.5, 6256.0, 6256.5, 6257.0, 6257.5, 6258.0, 6258.5, 6259.0, 6259.5, 6260.0, 6261.0, 6261.5, 6262.0, 6262.5, 6263.0, 6263.5, 6264.0, 6264.5, 6265.0, 6265.5, 6266.0, 6266.5, 6267.0, 6267.5, 6268.0, 6268.5, 6269.0, 6269.5, 6270.0, 6270.5, 6271.0, 6271.5, 6272.0, 6272.5, 6273.0, 6273.5, 6274.0, 6274.5, 6275.0, 6275.5, 6276.0, 6276.5, 6277.0, 6277.5, 6278.0, 6278.5, 6279.0, 6279.5, 6280.0, 6280.5, 6281.0, 6281.5, 6282.0, 6282.5, 6283.0, 6283.5, 6284.0, 6284.5, 6285.0, 6285.5, 6286.0, 6286.5, 6287.0, 6287.5, 6288.0, 6288.5, 6289.0, 6289.5, 6290.0]::double precision[];
  v_od_rhob double precision[] := array[2.439, 2.371, 2.477, 2.347, 2.475, 2.373, 2.347, 2.459, 2.404, 2.501, 2.427, 2.559, 2.372, 2.431, 2.332, 2.446, 2.467, 2.377, 2.402, 2.39, 2.369, 2.407, 2.347, 2.478, 2.442, 2.425, 2.467, 2.436, 2.317, 2.467, 2.292, 2.31, 2.364, 2.47, 2.397, 2.458, 2.329, 2.542, 2.415, 2.36, null, null, null, null, null, null, null, null, null, 2.361, 2.348, 2.396, 2.348, 2.361, 2.397, 2.445, 2.285, 2.418, 2.488, 2.384, 2.49, 2.391, 2.459, 2.445, 2.368, 2.29, 2.349, 2.32, 2.431, 2.511, 2.463, 2.335, 2.307, 2.471, 2.499, 2.385, 2.34, 2.402, 2.374, 2.387, 2.465, 2.39, 2.308, 2.368, 2.443, 2.421, 2.38, 2.395, 2.359, 2.44, 2.406, 2.382, 2.363, 2.452, 2.381, 2.331, 2.472, 2.424, 2.389, 2.323, null, 2.372, 2.431, 2.433, 2.365, 2.529, 2.39, 2.408, 2.432, 2.404, 2.462, 2.32, 2.424, 2.451, 2.416, 2.457, 2.351, 2.437, 2.385, 2.302, 2.372, 2.428, 2.258, 2.47, 2.437, 2.455, 2.408, 2.471, 2.397, 2.458, 2.579, null, 2.377, 2.454, 2.452, 2.474, 2.436, 2.37, 2.458, 2.414, 2.43, 2.44, 2.407, 2.408, 2.346, 2.416, 2.42, 2.438, 2.333, 2.442, 2.477, 2.37, 2.344, 2.472, 2.444, 2.413, 2.408, 2.365, 2.388, 2.411, 2.43, 2.495, 2.42, 2.396, 2.477, 2.461, 2.322, 2.427, 2.459, 2.392, 2.367, 2.4, 2.416, 2.45, 2.336, -999.25, -999.25, -999.25, 2.348, 2.349]::double precision[];
  v_od_nphi double precision[] := array[0.273, 0.249, 0.297, 0.22, 0.322, 0.273, 0.296, 0.319, 0.203, 0.293, 0.305, 0.327, 0.213, 0.335, 0.209, 0.22, 0.227, 0.254, 0.22, 0.252, 0.216, 0.272, 0.29, 0.237, 0.281, 0.335, 0.277, 0.268, 0.289, 0.254, 0.27, 0.297, 0.219, 0.261, 0.297, 0.288, 0.236, 0.29, 0.202, 0.2, 0.287, 0.199, 0.283, 0.263, 0.326, 0.231, 0.308, 0.271, 0.231, 0.401, 0.213, 0.354, 0.292, 0.304, 0.233, 0.248, 0.257, 0.311, 0.244, 0.274, null, null, null, null, 0.348, 0.285, 0.215, 0.318, 0.229, 0.265, 0.314, 0.228, 0.255, 0.23, 0.305, 0.249, 0.249, 0.234, 0.275, 0.241, 0.287, 0.306, 0.318, 0.23, 0.305, 0.214, 0.25, 0.292, 0.18, 0.265, 0.302, 0.254, 0.284, 0.262, 0.221, 0.27, 0.316, 0.266, 0.276, 0.195, 0.21, 0.272, 0.268, 0.251, 0.292, 0.272, 0.275, 0.246, 0.302, 0.268, 0.281, 0.245, 0.234, 0.286, 0.182, 0.327, 0.326, 0.292, 0.214, 0.278, 0.229, 0.283, 0.235, 0.272, 0.229, 0.234, 0.258, 0.234, 0.239, 0.246, 0.293, 0.319, 0.278, 0.27, 0.308, 0.306, 0.293, 0.254, 0.247, 0.232, 0.31, 0.251, 0.275, 0.245, 0.328, 0.223, 0.274, 0.259, 0.291, 0.249, null, 0.266, 0.224, 0.199, 0.252, 0.252, 0.278, 0.305, 0.343, 0.267, 0.282, 0.221, 0.27, 0.212, 0.303, 0.306, 0.251, 0.288, 0.208, 0.351, 0.25, 0.285, 0.216, 0.27, 0.282, 0.252, 0.222, 0.281, 0.364, 0.296]::double precision[];
  v_od_sc double precision[] := array[0.0, 15.1189, 30.2033, 45.1158, 59.9345, 74.8724, 89.8603, 104.9716, 119.9587, 135.1509, 150.0435, 150.0435, 164.974, 179.7836, 194.6579, 209.6998, 224.6932, 239.8488, 269.7043, 284.7409, 299.5935, 314.5125, 329.3923, 344.3527, 359.3032, 374.2185, 389.3987, 404.694, 419.6027, 434.5858, 449.6247, 449.6247, 464.7858, 479.6106, 494.6389, 509.5586, 524.4385, 554.5931, 539.5446, 569.6015, 584.6057, 599.6429, 614.5164, 629.4435, 644.4604, 659.5994, 674.8037, 689.8805, 704.8141]::double precision[];
  v_od_oil double precision[] := array[970.7, 915.2, 935.5, 948.6, 949.4, 930.5, 936.8, 933.0, 947.3, 933.3, 933.5, 922.4, 909.2, 930.1, 929.7, 903.1, 938.8, 895.5, 904.1, 888.1, 892.3, 902.2, 911.0, 885.3, 897.7, 892.4, 880.0, 867.2, 880.0, 876.3, 879.7, 865.1, 839.5, 876.5, 873.9, 865.1, 860.3, 846.3, 857.5, 860.2, 849.4, 860.4, 831.8, 842.7, 833.1, 835.0, 830.4, 821.8, 851.3, 830.9, 819.0, 828.7, 831.7, 815.4, 807.2, 805.0, 792.4, 785.1, 816.8, 799.2]::double precision[];
  v_od_water double precision[] := array[435.8, 419.6, 429.6, 432.8, 439.8, 436.9, 434.8, 453.0, 428.2, 444.9, 440.8, 438.4, 449.1, 483.1, 449.7, 444.5, 454.3, 441.6, 463.0, 436.9, 449.2, 449.5, 466.3, 430.6, 443.0, 441.9, 449.4, 450.4, 460.7, 462.7, 467.8, 454.0, 433.3, 473.8, 469.4, 467.7, 446.4, 443.1, 483.9, 461.9, 467.4, 481.2, 461.2, 476.5, 482.1, 493.0, 466.6, 454.5, 501.7, 472.3, 485.7, 490.2, 501.1, 486.6, 481.4, 483.5, 482.6, 467.2, 471.3, 471.3]::double precision[];
  v_od_gross double precision[] := array[1406.5, 1334.8, 1365.1, 1381.4, 1389.2, 1367.4, 1371.6, 1386.0, 1375.5, 1378.2, 1374.3, 1360.8, 1358.3, 1413.2, 1379.4, 1347.6, 1393.1, 1337.1, 1367.1, 1325.0, 1341.5, 1351.7, 1377.3, 1315.9, 1340.7, 1334.3, 1329.4, 1317.6, 1340.7, 1339.0, 1347.5, 1319.1, 1272.8, 1350.3, 1343.3, 1332.8, 1306.7, 1289.4, 1341.4, 1322.1, 1316.8, 1341.6, 1293.0, 1350.9, 1315.2, 1328.0, 1297.0, 1276.3, 1353.0, 1303.2, 1304.7, 1318.9, 1332.8, 1302.0, 1288.6, 1288.5, 1275.0, 1252.3, 1288.1, 1270.5]::double precision[];
  v_od_wc double precision[] := array[0.3098, 0.3144, 0.3147, 0.3133, 0.3166, 0.3195, 0.317, 0.3268, 0.3113, 0.3228, 0.3207, 0.3222, 0.3306, 0.3418, 0.326, 0.3298, 0.3261, 0.3303, 0.3387, 0.3297, 0.3348, 0.3325, 0.3348, 0.3272, 0.3304, 0.3312, 0.338, 0.3418, 0.3436, 0.3456, 0.3472, 0.3442, 0.3404, 0.3509, 0.3494, 0.3509, 0.3416, 0.3436, 0.3607, 0.3494, 0.355, 0.3587, 0.3567, 0.3612, 0.3666, 0.3712, 0.3598, 0.3561, 0.3708, 0.3624, 0.3723, 0.3717, 0.376, 0.3737, 0.3736, 0.3752, 0.3785, 0.3731, 0.3659, 0.371]::double precision[];
  v_od_cum double precision[] := array[842970.7, 843885.9, 844821.4, 845770.0, 846719.4, 847649.9, 848586.7, 849519.7, 850467.0, 851400.3, 852333.8, 853256.2, 854165.4, 855095.5, 856025.2, 856928.3, 857867.1, 858762.6, 859666.7, 860554.8, 861447.1, 862349.3, 863260.3, 864145.6, 865043.3, 865935.7, 866815.7, 867682.9, 868562.9, 869439.2, 870318.9, 871184.0, 872023.5, 872900.0, 873773.9, 874639.0, 875499.3, null, 868203.1, 878063.3, 878912.7, 879773.1, 880604.9, 881447.6, 882280.7, 883115.7, 883946.1, 884767.9, 885619.2, 886450.1, 887269.1, 888097.8, 888929.5, 889744.9, 890552.1, 891357.1, 892149.5, 892934.6, 893751.4, 894550.6]::double precision[];
  v_ik_core double precision[] := array[0.198, 0.206, 0.169, 0.19, 0.189, 0.206, 0.196, 0.176, 0.187, 0.177, 0.183, 0.246, 0.188, 0.177, 0.171, 0.199, 0.185]::double precision[];
  v_ik_rhob double precision[] := array[2.3562, 2.3965, 2.3584, 2.2975, 2.3605, 2.3022, 2.3458, 2.4102, 2.3409, 2.3189, 2.342, 2.387, 2.3658, 2.3505, 2.3852, 2.3726, 2.3776, 2.3735, 2.4022, 2.3798, 2.3276, 2.3583, 2.3686, 2.3572, 2.3645, 2.381, 2.3034, 2.3619, 2.3206, 2.3606, 2.3045, 2.3522, 2.4042, 2.2472, 2.3747, 2.3525, 2.3743, 2.429, 2.3745, 2.355, 2.3709, 2.3693, 2.4707, 2.3629, 2.2874, 2.4083, 2.3827, 2.3663, 2.3938, 2.3533, 2.3257, 2.336, 2.3452, 2.3023, 2.3427, 2.3207, null, 2.6118, 2.3876, 2.3518, 2.3126, 2.3439, 2.3437, 2.3078, 2.304, 2.3691, 2.347, 2.3532, 2.3511, 2.3802, 2.3743, 2.3385, 2.388, 2.3413, 2.3638, 2.3108, 2.3049, 2.3553, 2.425, 2.3743]::double precision[];
  v_ik_a double precision[] := array[2.296, 2.331, 2.304, 2.274, 2.392, 2.381, 2.38, 2.311, 2.338, 2.303, 2.327, 2.42, 2.24, 2.351, 2.369, 2.273, 2.317, 2.33, 2.241, 2.322, 2.338, 2.339, 2.389, 2.29, 2.303, 2.254, 2.335, 2.271, 2.348, 2.391, 2.299, 2.291, 2.26, 2.345, 2.238, 2.319]::double precision[];
  v_ik_b double precision[] := array[0.253, 0.222, 0.274, 0.268, 0.173, 0.191, 0.214, 0.237, 0.23, 0.214, 0.231, 0.191, 0.277, 0.214, 0.214, 0.239, 0.235, 0.193, 0.29, 0.195, 0.222, 0.203, 0.188, 0.162, 0.234, 0.285, 0.21, 0.257, 0.227, 0.149, 0.249, 0.265, 0.267, 0.225, 0.294, 0.22]::double precision[];
  v_am_p1 double precision[] := array[846.0, 845.1, 853.3, 846.3, 856.8, 846.9, 843.0, 843.4, 849.4, 833.1, 845.7, 831.1, 832.9, 853.4, 840.5, 847.7, 834.7, 850.2, 844.7, 837.4, 855.2, 839.3, 852.0, 842.4, 843.6, 850.7, 858.7, 838.0, 849.2, 845.9, 842.3, 842.7, 840.5, 839.7, 846.5, 840.1]::double precision[];
  v_am_p2 double precision[] := array[841.1, 845.5, 839.9, 841.6, 850.1, 850.1, 835.5, 840.7, 850.8, 845.1, 843.1, 837.5, 856.7, 860.9, 851.5, 853.4, 864.9, 867.3, 852.5, 848.4, 853.4, 851.9, 854.0, 865.6, 860.6, 850.8, 842.8, 857.3, 846.8, 850.5]::double precision[];
  v_sc_checked double precision[] := array[720.0, 702.0, 690.0, 14.0, 702.0]::double precision[];
  v_sc_failed double precision[] := array[18.0, 9.0, 23.0, 2.0, 11.0]::double precision[];
  v_sc_w double precision[] := array[3.0, 2.0, 2.0, 1.0, 1.0]::double precision[];
begin

  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures where app_slug = 'dataqc' and active;
  if v_structures <> 3 then
    raise exception 'D1 go-live refused: dataqc has % active deep structures, expected 3', v_structures;
  end if;
  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'dataqc';
  if v_questions <> 396 then
    raise exception 'D1 go-live refused: dataqc has % quiz questions, expected 396', v_questions;
  end if;
  select count(*) into v_n from (select tier from public.academy_quiz_questions where app_slug = 'dataqc' group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'D1 go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;
  select count(*) into v_n from (select tier, module_key from public.academy_quiz_questions where app_slug = 'dataqc' and scope = 'module' group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'D1 go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;
  select count(*) into v_n from (select tier from public.academy_quiz_questions where app_slug = 'dataqc' and scope = 'final' group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'D1 go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;
  select count(*) into v_n from public.academy_quiz_questions where app_slug = 'dataqc'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'D1 go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;
  select count(*) into v_lessons from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m, lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'dataqc' and s.active;
  if v_lessons <> 78 then
    raise exception 'D1 go-live refused: dataqc carries % lesson keys, expected 78', v_lessons;
  end if;
  select count(*) into v_modules from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'dataqc' and s.active;
  if v_modules <> 18 then
    raise exception 'D1 go-live refused: dataqc carries % modules, expected 18 (six per tier)', v_modules;
  end if;
  select count(*) into v_n from (select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = 'dataqc' and qq.scope = 'module' and not exists (
       select 1 from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m
        where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active and m->>'key' = qq.module_key)) t;
  if v_n <> 0 then
    raise exception 'D1 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;
  select count(*) into v_capstones from public.academy_capstones where app_slug = 'dataqc';
  if v_capstones <> 3 then
    raise exception 'D1 go-live refused: dataqc has % capstones, expected 3', v_capstones;
  end if;
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'dataqc';
  if v_graded <> 18 then
    raise exception 'D1 go-live refused: dataqc has % graded capstone fields, expected 18', v_graded;
  end if;
  select count(*) into v_n from (select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'dataqc' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'D1 go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;
  if not exists (select 1 from public.academy_apps where slug = 'dataqc' and module = 'data_ai' and path_order = 66 and prereq_slug is null) then
    raise exception 'D1 go-live refused: the dataqc catalogue row is not data_ai at path_order 66 with no prerequisite';
  end if;
  if exists (select 1 from public.academy_apps where path_order = 66 and slug <> 'dataqc') then
    raise exception 'D1 go-live refused: another course already holds path_order 66';
  end if;

  -- ------------------------------------------------- the grader is numeric
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'dataqc'
     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'
          or (f->>'expected')::numeric <= 0
          or abs((f->>'expected')::numeric - round((f->>'expected')::numeric)) <= 0.001
          or (f->>'tol')::numeric <> 0.0000005
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception 'D1 go-live refused: % graded field(s) are not a positive non-whole number at tolerance 0.0000005 with a label and a unit: %', v_n, v_names;
  end if;
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'dataqc'
     and (abs(round((f->>'expected')::numeric, 6) - (f->>'expected')::numeric) > (f->>'tol')::numeric
          or abs(round((f->>'expected')::numeric, 6) + 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric
          or abs(round((f->>'expected')::numeric, 6) - 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric);
  if v_n <> 0 then
    raise exception 'D1 go-live refused: % graded field(s) either fail the six-decimal answer the prompt asks for or pass one a unit off in the sixth decimal: %', v_n, v_names;
  end if;

  -- ---------------------------------------- the prompts the learner reads
  select prompt into v_prompt from public.academy_capstones where app_slug = 'dataqc' and tier = 'beginner';
  if v_prompt is null or md5(v_prompt) <> '89c119a229d0d86169b5fbede3ddb5b3' then
    raise exception 'D1 go-live refused: the beginner prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'dataqc' and tier = 'beginner'
                    and cert_tier = 'associate' and dataset = 'ODUDU-2, a density and neutron log, a SCADA time index and sixty days of production, as delivered' and title = 'Whether the data are fit to use') then
    raise exception 'D1 go-live refused: the beginner capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['coverage of the interval 6210 to 6280 ft', 'maxStep of 0.5 ft', 'water cut computed from the rates for day 23', 'odudu2_log.csv', 'odudu2_scada_index.csv', 'odudu2_production.csv']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'D1 go-live refused: % stated setting(s) or case file(s) are not named in the shipped beginner prompt: %', v_n, v_names;
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'dataqc' and tier = 'intermediate';
  if v_prompt is null or md5(v_prompt) <> '95b8de7e850b2b4db7a0ecb6a5156fea' then
    raise exception 'D1 go-live refused: the intermediate prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'dataqc' and tier = 'intermediate'
                    and cert_tier = 'professional' and dataset = 'IKORO-5, core plug porosities, a bulk density interval and a density-neutron cloud' and title = 'Which values stand apart, and by which measure') then
    raise exception 'D1 go-live refused: the intermediate capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['half window of 3 and nSigma 3', 'at alpha 0.05', 'entry 57 of the density interval', 'ikoro5_core_porosity.csv', 'ikoro5_density.csv', 'ikoro5_density_neutron.csv']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'D1 go-live refused: % stated setting(s) or case file(s) are not named in the shipped intermediate prompt: %', v_n, v_names;
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'dataqc' and tier = 'advanced';
  if v_prompt is null or md5(v_prompt) <> '5d6c338914346b575560450bbd080bcc' then
    raise exception 'D1 go-live refused: the advanced prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'dataqc' and tier = 'advanced'
                    and cert_tier = 'expert' and dataset = 'AMASIRI-1, a casing pressure in two phases and a scored data sheet' and title = 'Whether the process has changed, and the score of the sheet') then
    raise exception 'D1 go-live refused: the advanced capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['lambda 0.2 and L 3', 'k 0.5 and h 4 in sigma units', 'sigma as MRbar / 1.128', 'completeness 18 failed of 720 checked', 'validity 9 failed of 702 checked', 'consistency 23 failed of 690 checked', 'uniqueness 2 failed of 14 checked', 'plausibility 11 failed of 702 checked', 'amasiri1_phase_one.csv', 'amasiri1_phase_two.csv']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'D1 go-live refused: % stated setting(s) or case file(s) are not named in the shipped advanced prompt: %', v_n, v_names;
  end if;
  -- No number handed in any capstone text of this course may sit within its
  -- tolerance of any graded value of any tier.
  select count(*), string_agg(g.ftier || '/' || g.k || ' in the ' || h.ctier || ' capstone text', ', ') into v_n, v_names
    from (select c.tier as ctier, m[1]::double precision as x
            from public.academy_capstones c,
                 lateral regexp_matches(c.prompt || ' ' || c.dataset || ' ' || c.title || ' ' ||
                   (select string_agg((f->>'label') || ' ' || (f->>'unit'), ' ') from jsonb_array_elements(c.fields) f),
                   '(-?[0-9]+(?:[.][0-9]+)?)', 'g') m
           where c.app_slug = 'dataqc') h,
         (select c.tier as ftier, f->>'key' as k, (f->>'expected')::double precision as v, (f->>'tol')::double precision as t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'dataqc') g
   where abs(abs(h.x) - abs(g.v)) <= g.t;
  if v_n <> 0 then
    raise exception 'D1 go-live refused: % graded value(s) are handed in capstone text: %', v_n, v_names;
  end if;

  -- --------------------------------------- the eighteen graded values
  select (f->>'expected')::double precision into v_g_odudu_rhob_completeness
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'dataqc' and c.tier = 'beginner' and f->>'key' = 'odudu_rhob_completeness';
  if v_g_odudu_rhob_completeness is null then
    raise exception 'D1 go-live refused: the seeded rows carry no value [graded field: beginner/odudu_rhob_completeness]';
  end if;
  select (f->>'expected')::double precision into v_g_odudu_nphi_coverage
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'dataqc' and c.tier = 'beginner' and f->>'key' = 'odudu_nphi_coverage';
  if v_g_odudu_nphi_coverage is null then
    raise exception 'D1 go-live refused: the seeded rows carry no value [graded field: beginner/odudu_nphi_coverage]';
  end if;
  select (f->>'expected')::double precision into v_g_odudu_scada_expected_step_min
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'dataqc' and c.tier = 'beginner' and f->>'key' = 'odudu_scada_expected_step_min';
  if v_g_odudu_scada_expected_step_min is null then
    raise exception 'D1 go-live refused: the seeded rows carry no value [graded field: beginner/odudu_scada_expected_step_min]';
  end if;
  select (f->>'expected')::double precision into v_g_odudu_water_cut_day23
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'dataqc' and c.tier = 'beginner' and f->>'key' = 'odudu_water_cut_day23';
  if v_g_odudu_water_cut_day23 is null then
    raise exception 'D1 go-live refused: the seeded rows carry no value [graded field: beginner/odudu_water_cut_day23]';
  end if;
  select (f->>'expected')::double precision into v_g_odudu_cumulative_drop_bbl
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'dataqc' and c.tier = 'beginner' and f->>'key' = 'odudu_cumulative_drop_bbl';
  if v_g_odudu_cumulative_drop_bbl is null then
    raise exception 'D1 go-live refused: the seeded rows carry no value [graded field: beginner/odudu_cumulative_drop_bbl]';
  end if;
  select (f->>'expected')::double precision into v_g_odudu_phase_sum_allowed_day44_bbl_d
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'dataqc' and c.tier = 'beginner' and f->>'key' = 'odudu_phase_sum_allowed_day44_bbl_d';
  if v_g_odudu_phase_sum_allowed_day44_bbl_d is null then
    raise exception 'D1 go-live refused: the seeded rows carry no value [graded field: beginner/odudu_phase_sum_allowed_day44_bbl_d]';
  end if;
  select (f->>'expected')::double precision into v_g_ikoro_core_max_abs_z
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'dataqc' and c.tier = 'intermediate' and f->>'key' = 'ikoro_core_max_abs_z';
  if v_g_ikoro_core_max_abs_z is null then
    raise exception 'D1 go-live refused: the seeded rows carry no value [graded field: intermediate/ikoro_core_max_abs_z]';
  end if;
  select (f->>'expected')::double precision into v_g_ikoro_core_max_abs_modified_z
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'dataqc' and c.tier = 'intermediate' and f->>'key' = 'ikoro_core_max_abs_modified_z';
  if v_g_ikoro_core_max_abs_modified_z is null then
    raise exception 'D1 go-live refused: the seeded rows carry no value [graded field: intermediate/ikoro_core_max_abs_modified_z]';
  end if;
  select (f->>'expected')::double precision into v_g_ikoro_rhob_upper_fence_g_cm3
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'dataqc' and c.tier = 'intermediate' and f->>'key' = 'ikoro_rhob_upper_fence_g_cm3';
  if v_g_ikoro_rhob_upper_fence_g_cm3 is null then
    raise exception 'D1 go-live refused: the seeded rows carry no value [graded field: intermediate/ikoro_rhob_upper_fence_g_cm3]';
  end if;
  select (f->>'expected')::double precision into v_g_ikoro_rhob_hampel_threshold_entry57_g_cm3
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'dataqc' and c.tier = 'intermediate' and f->>'key' = 'ikoro_rhob_hampel_threshold_entry57_g_cm3';
  if v_g_ikoro_rhob_hampel_threshold_entry57_g_cm3 is null then
    raise exception 'D1 go-live refused: the seeded rows carry no value [graded field: intermediate/ikoro_rhob_hampel_threshold_entry57_g_cm3]';
  end if;
  select (f->>'expected')::double precision into v_g_ikoro_core_grubbs_critical
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'dataqc' and c.tier = 'intermediate' and f->>'key' = 'ikoro_core_grubbs_critical';
  if v_g_ikoro_core_grubbs_critical is null then
    raise exception 'D1 go-live refused: the seeded rows carry no value [graded field: intermediate/ikoro_core_grubbs_critical]';
  end if;
  select (f->>'expected')::double precision into v_g_ikoro_max_mahalanobis_d2
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'dataqc' and c.tier = 'intermediate' and f->>'key' = 'ikoro_max_mahalanobis_d2';
  if v_g_ikoro_max_mahalanobis_d2 is null then
    raise exception 'D1 go-live refused: the seeded rows carry no value [graded field: intermediate/ikoro_max_mahalanobis_d2]';
  end if;
  select (f->>'expected')::double precision into v_g_amasiri_phase1_individuals_ucl_psig
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'dataqc' and c.tier = 'advanced' and f->>'key' = 'amasiri_phase1_individuals_ucl_psig';
  if v_g_amasiri_phase1_individuals_ucl_psig is null then
    raise exception 'D1 go-live refused: the seeded rows carry no value [graded field: advanced/amasiri_phase1_individuals_ucl_psig]';
  end if;
  select (f->>'expected')::double precision into v_g_amasiri_phase1_mr_ucl_psig
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'dataqc' and c.tier = 'advanced' and f->>'key' = 'amasiri_phase1_mr_ucl_psig';
  if v_g_amasiri_phase1_mr_ucl_psig is null then
    raise exception 'D1 go-live refused: the seeded rows carry no value [graded field: advanced/amasiri_phase1_mr_ucl_psig]';
  end if;
  select (f->>'expected')::double precision into v_g_amasiri_ewma_day14_psig
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'dataqc' and c.tier = 'advanced' and f->>'key' = 'amasiri_ewma_day14_psig';
  if v_g_amasiri_ewma_day14_psig is null then
    raise exception 'D1 go-live refused: the seeded rows carry no value [graded field: advanced/amasiri_ewma_day14_psig]';
  end if;
  select (f->>'expected')::double precision into v_g_amasiri_ewma_exact_ucl_day2_psig
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'dataqc' and c.tier = 'advanced' and f->>'key' = 'amasiri_ewma_exact_ucl_day2_psig';
  if v_g_amasiri_ewma_exact_ucl_day2_psig is null then
    raise exception 'D1 go-live refused: the seeded rows carry no value [graded field: advanced/amasiri_ewma_exact_ucl_day2_psig]';
  end if;
  select (f->>'expected')::double precision into v_g_amasiri_cusum_upper_day18_psi
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'dataqc' and c.tier = 'advanced' and f->>'key' = 'amasiri_cusum_upper_day18_psi';
  if v_g_amasiri_cusum_upper_day18_psi is null then
    raise exception 'D1 go-live refused: the seeded rows carry no value [graded field: advanced/amasiri_cusum_upper_day18_psi]';
  end if;
  select (f->>'expected')::double precision into v_g_amasiri_scorecard_total
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'dataqc' and c.tier = 'advanced' and f->>'key' = 'amasiri_scorecard_total';
  if v_g_amasiri_scorecard_total is null then
    raise exception 'D1 go-live refused: the seeded rows carry no value [graded field: advanced/amasiri_scorecard_total]';
  end if;

  -- ------------------------------------------ 1. against the engine ledger
  if v_g_odudu_rhob_completeness <> 0.9388888888888889 then
    raise exception 'D1 go-live refused: the seeded value is %, and the engine returned 0.9388888888888889 [graded field: beginner/odudu_rhob_completeness]', v_g_odudu_rhob_completeness;
  end if;
  if v_g_odudu_nphi_coverage <> 0.9357142857142857 then
    raise exception 'D1 go-live refused: the seeded value is %, and the engine returned 0.9357142857142857 [graded field: beginner/odudu_nphi_coverage]', v_g_odudu_nphi_coverage;
  end if;
  if v_g_odudu_scada_expected_step_min <> 14.987899999999996 then
    raise exception 'D1 go-live refused: the seeded value is %, and the engine returned 14.987899999999996 [graded field: beginner/odudu_scada_expected_step_min]', v_g_odudu_scada_expected_step_min;
  end if;
  if v_g_odudu_water_cut_day23 <> 0.33856095258839763 then
    raise exception 'D1 go-live refused: the seeded value is %, and the engine returned 0.33856095258839763 [graded field: beginner/odudu_water_cut_day23]', v_g_odudu_water_cut_day23;
  end if;
  if v_g_odudu_cumulative_drop_bbl <> 7296.20000000007 then
    raise exception 'D1 go-live refused: the seeded value is %, and the engine returned 7296.20000000007 [graded field: beginner/odudu_cumulative_drop_bbl]', v_g_odudu_cumulative_drop_bbl;
  end if;
  if v_g_odudu_phase_sum_allowed_day44_bbl_d <> 6.7545 then
    raise exception 'D1 go-live refused: the seeded value is %, and the engine returned 6.7545 [graded field: beginner/odudu_phase_sum_allowed_day44_bbl_d]', v_g_odudu_phase_sum_allowed_day44_bbl_d;
  end if;
  if v_g_ikoro_core_max_abs_z <> 3.0512957006575347 then
    raise exception 'D1 go-live refused: the seeded value is %, and the engine returned 3.0512957006575347 [graded field: intermediate/ikoro_core_max_abs_z]', v_g_ikoro_core_max_abs_z;
  end if;
  if v_g_ikoro_core_max_abs_modified_z <> 3.556454545454542 then
    raise exception 'D1 go-live refused: the seeded value is %, and the engine returned 3.556454545454542 [graded field: intermediate/ikoro_core_max_abs_modified_z]', v_g_ikoro_core_max_abs_modified_z;
  end if;
  if v_g_ikoro_rhob_upper_fence_g_cm3 <> 2.42485 then
    raise exception 'D1 go-live refused: the seeded value is %, and the engine returned 2.42485 [graded field: intermediate/ikoro_rhob_upper_fence_g_cm3]', v_g_ikoro_rhob_upper_fence_g_cm3;
  end if;
  if v_g_ikoro_rhob_hampel_threshold_entry57_g_cm3 <> 0.13610267999999884 then
    raise exception 'D1 go-live refused: the seeded value is %, and the engine returned 0.13610267999999884 [graded field: intermediate/ikoro_rhob_hampel_threshold_entry57_g_cm3]', v_g_ikoro_rhob_hampel_threshold_entry57_g_cm3;
  end if;
  if v_g_ikoro_core_grubbs_critical <> 2.619963639834438 then
    raise exception 'D1 go-live refused: the seeded value is %, and the engine returned 2.619963639834438 [graded field: intermediate/ikoro_core_grubbs_critical]', v_g_ikoro_core_grubbs_critical;
  end if;
  if v_g_ikoro_max_mahalanobis_d2 <> 15.548796422055258 then
    raise exception 'D1 go-live refused: the seeded value is %, and the engine returned 15.548796422055258 [graded field: intermediate/ikoro_max_mahalanobis_d2]', v_g_ikoro_max_mahalanobis_d2;
  end if;
  if v_g_amasiri_phase1_individuals_ucl_psig <> 867.6033096926715 then
    raise exception 'D1 go-live refused: the seeded value is %, and the engine returned 867.6033096926715 [graded field: advanced/amasiri_phase1_individuals_ucl_psig]', v_g_amasiri_phase1_individuals_ucl_psig;
  end if;
  if v_g_amasiri_phase1_mr_ucl_psig <> 28.161540000000038 then
    raise exception 'D1 go-live refused: the seeded value is %, and the engine returned 28.161540000000038 [graded field: advanced/amasiri_phase1_mr_ucl_psig]', v_g_amasiri_phase1_mr_ucl_psig;
  end if;
  if v_g_amasiri_ewma_day14_psig <> 848.7590554998776 then
    raise exception 'D1 go-live refused: the seeded value is %, and the engine returned 848.7590554998776 [graded field: advanced/amasiri_ewma_day14_psig]', v_g_amasiri_ewma_day14_psig;
  end if;
  if v_g_amasiri_ewma_exact_ucl_day2_psig <> 850.5495789401897 then
    raise exception 'D1 go-live refused: the seeded value is %, and the engine returned 850.5495789401897 [graded field: advanced/amasiri_ewma_exact_ucl_day2_psig]', v_g_amasiri_ewma_exact_ucl_day2_psig;
  end if;
  if v_g_amasiri_cusum_upper_day18_psi <> 63.70780141843934 then
    raise exception 'D1 go-live refused: the seeded value is %, and the engine returned 63.70780141843934 [graded field: advanced/amasiri_cusum_upper_day18_psi]', v_g_amasiri_cusum_upper_day18_psi;
  end if;
  if v_g_amasiri_scorecard_total <> 0.9637961832406277 then
    raise exception 'D1 go-live refused: the seeded value is %, and the engine returned 0.9637961832406277 [graded field: advanced/amasiri_scorecard_total]', v_g_amasiri_scorecard_total;
  end if;

  -- ----------------------------------------------- 2. the second route in SQL
  v_s := (select count(x)::double precision / count(*)::double precision from unnest(v_od_rhob) x);
  if v_s is null or abs(v_s - v_g_odudu_rhob_completeness) > 1e-9 * greatest(1.0, abs(v_g_odudu_rhob_completeness)) then
    raise exception 'D1 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/odudu_rhob_completeness]', v_s, v_g_odudu_rhob_completeness;
  end if;
  v_x := 0.0; v_prev := null;
  for i in 1 .. array_length(v_od_depth, 1) loop
    if v_od_nphi[i] is not null then
      if v_prev is not null and v_od_depth[i] - v_prev <= 0.5 then
        v_x := v_x + greatest(0.0, least(v_od_depth[i], 6280.0) - greatest(v_prev, 6210.0));
      end if;
      v_prev := v_od_depth[i];
    end if;
  end loop;
  v_s := v_x / (6280.0 - 6210.0);
  if v_s is null or abs(v_s - v_g_odudu_nphi_coverage) > 1e-9 * greatest(1.0, abs(v_g_odudu_nphi_coverage)) then
    raise exception 'D1 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/odudu_nphi_coverage]', v_s, v_g_odudu_nphi_coverage;
  end if;
  select percentile_cont(0.5) within group (order by d) into v_s
    from (select v_od_sc[g + 1] - v_od_sc[g] as d from generate_series(1, array_length(v_od_sc, 1) - 1) g) t where d > 0.0;
  if v_s is null or abs(v_s - v_g_odudu_scada_expected_step_min) > 1e-9 * greatest(1.0, abs(v_g_odudu_scada_expected_step_min)) then
    raise exception 'D1 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/odudu_scada_expected_step_min]', v_s, v_g_odudu_scada_expected_step_min;
  end if;
  v_s := v_od_water[23] / (v_od_oil[23] + v_od_water[23]);
  if v_s is null or abs(v_s - v_g_odudu_water_cut_day23) > 1e-9 * greatest(1.0, abs(v_g_odudu_water_cut_day23)) then
    raise exception 'D1 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/odudu_water_cut_day23]', v_s, v_g_odudu_water_cut_day23;
  end if;
  v_s := null; v_last := null; v_n := null;
  for i in 1 .. array_length(v_od_cum, 1) loop
    if v_od_cum[i] is not null then
      if v_last is not null and v_s is null and v_od_cum[v_last] - v_od_cum[i] > 0.0 then
        v_s := v_od_cum[v_last] - v_od_cum[i]; v_n := i;
      end if;
      v_last := i;
    end if;
  end loop;
  if v_n is distinct from 39 then
    raise exception 'D1 go-live refused: the second route finds the first fall of the cumulative on day %, and the capstone grades day 39 [graded field: beginner/odudu_cumulative_drop_bbl]', v_n;
  end if;
  if v_s is null or abs(v_s - v_g_odudu_cumulative_drop_bbl) > 1e-9 * greatest(1.0, abs(v_g_odudu_cumulative_drop_bbl)) then
    raise exception 'D1 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/odudu_cumulative_drop_bbl]', v_s, v_g_odudu_cumulative_drop_bbl;
  end if;
  v_s := null; v_n := null;
  for i in 1 .. array_length(v_od_gross, 1) loop
    if v_s is null and v_od_gross[i] is not null and v_od_oil[i] is not null and v_od_water[i] is not null
       and abs(v_od_oil[i] + v_od_water[i] - v_od_gross[i]) > 0.005 * abs(v_od_gross[i]) then
      v_s := 0.005 * abs(v_od_gross[i]); v_n := i;
    end if;
  end loop;
  if v_n is distinct from 44 then
    raise exception 'D1 go-live refused: the second route finds the phase-sum flag on day %, and the capstone grades day 44 [graded field: beginner/odudu_phase_sum_allowed_day44_bbl_d]', v_n;
  end if;
  if v_s is null or abs(v_s - v_g_odudu_phase_sum_allowed_day44_bbl_d) > 1e-9 * greatest(1.0, abs(v_g_odudu_phase_sum_allowed_day44_bbl_d)) then
    raise exception 'D1 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/odudu_phase_sum_allowed_day44_bbl_d]', v_s, v_g_odudu_phase_sum_allowed_day44_bbl_d;
  end if;
  select avg(x), stddev_samp(x) into v_m, v_sd from unnest(v_ik_core) x;
  v_s := (select max(abs((x - v_m) / v_sd)) from unnest(v_ik_core) x);
  if v_s is null or abs(v_s - v_g_ikoro_core_max_abs_z) > 1e-9 * greatest(1.0, abs(v_g_ikoro_core_max_abs_z)) then
    raise exception 'D1 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/ikoro_core_max_abs_z]', v_s, v_g_ikoro_core_max_abs_z;
  end if;
  select percentile_cont(0.5) within group (order by x) into v_med from unnest(v_ik_core) x;
  select percentile_cont(0.5) within group (order by abs(x - v_med)) into v_mad from unnest(v_ik_core) x;
  v_s := (select max(0.6745 * abs(x - v_med) / v_mad) from unnest(v_ik_core) x);
  if v_s is null or abs(v_s - v_g_ikoro_core_max_abs_modified_z) > 1e-9 * greatest(1.0, abs(v_g_ikoro_core_max_abs_modified_z)) then
    raise exception 'D1 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/ikoro_core_max_abs_modified_z]', v_s, v_g_ikoro_core_max_abs_modified_z;
  end if;
  select percentile_cont(0.25) within group (order by x), percentile_cont(0.75) within group (order by x)
    into v_q1, v_q3 from unnest(v_ik_rhob) x where x is not null;
  v_s := v_q3 + 1.5 * (v_q3 - v_q1);
  if v_s is null or abs(v_s - v_g_ikoro_rhob_upper_fence_g_cm3) > 1e-9 * greatest(1.0, abs(v_g_ikoro_rhob_upper_fence_g_cm3)) then
    raise exception 'D1 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/ikoro_rhob_upper_fence_g_cm3]', v_s, v_g_ikoro_rhob_upper_fence_g_cm3;
  end if;
  -- entry 57 counted from 0 is array element 58; its window is 58 +/- the half window, present samples only
  select percentile_cont(0.5) within group (order by v_ik_rhob[g]) into v_med from generate_series(58 - 3, 58 + 3) g where v_ik_rhob[g] is not null;
  select percentile_cont(0.5) within group (order by abs(v_ik_rhob[g] - v_med)) into v_mad from generate_series(58 - 3, 58 + 3) g where v_ik_rhob[g] is not null;
  v_s := 3.0 * 1.4826 * v_mad;
  if v_s is null or abs(v_s - v_g_ikoro_rhob_hampel_threshold_entry57_g_cm3) > 1e-9 * greatest(1.0, abs(v_g_ikoro_rhob_hampel_threshold_entry57_g_cm3)) then
    raise exception 'D1 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/ikoro_rhob_hampel_threshold_entry57_g_cm3]', v_s, v_g_ikoro_rhob_hampel_threshold_entry57_g_cm3;
  end if;
  v_q := 0.05 / (2.0 * 17.0);
  v_lo := 0.0; v_hi := 100.0;
  for j in 1 .. 200 loop
    v_mid := 0.5 * (v_lo + v_hi);
    v_th := atan(v_mid / sqrt(15.0));
    v_term := cos(v_th); v_sum := cos(v_th);
    for i in 1 .. 6 loop
      v_term := v_term * cos(v_th) * cos(v_th) * (2.0 * i) / (2.0 * i + 1.0);
      v_sum := v_sum + v_term;
    end loop;
    v_tail := (1.0 - (2.0 / pi()) * (v_th + sin(v_th) * v_sum)) / 2.0;
    if v_tail > v_q then v_lo := v_mid; else v_hi := v_mid; end if;
  end loop;
  v_t := 0.5 * (v_lo + v_hi);
  v_s := (16.0 / sqrt(17.0)) * sqrt(v_t * v_t / (15.0 + v_t * v_t));
  if v_s is null or abs(v_s - v_g_ikoro_core_grubbs_critical) > 1e-9 * greatest(1.0, abs(v_g_ikoro_core_grubbs_critical)) then
    raise exception 'D1 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/ikoro_core_grubbs_critical]', v_s, v_g_ikoro_core_grubbs_critical;
  end if;
  select avg(a), avg(b) into v_ma, v_mb from unnest(v_ik_a, v_ik_b) as t(a, b);
  select sum((a - v_ma) * (a - v_ma)) / (count(*)::double precision - 1.0),
         sum((a - v_ma) * (b - v_mb)) / (count(*)::double precision - 1.0),
         sum((b - v_mb) * (b - v_mb)) / (count(*)::double precision - 1.0)
    into v_saa, v_sab, v_sbb from unnest(v_ik_a, v_ik_b) as t(a, b);
  v_det := v_saa * v_sbb - v_sab * v_sab;
  v_s := (select max(((a - v_ma) * (a - v_ma) * v_sbb - 2.0 * (a - v_ma) * (b - v_mb) * v_sab + (b - v_mb) * (b - v_mb) * v_saa) / v_det)
            from unnest(v_ik_a, v_ik_b) as t(a, b));
  if v_s is null or abs(v_s - v_g_ikoro_max_mahalanobis_d2) > 1e-9 * greatest(1.0, abs(v_g_ikoro_max_mahalanobis_d2)) then
    raise exception 'D1 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/ikoro_max_mahalanobis_d2]', v_s, v_g_ikoro_max_mahalanobis_d2;
  end if;
  v_centre := (select avg(x) from unnest(v_am_p1) x);
  v_mrbar := (select avg(abs(v_am_p1[g] - v_am_p1[g - 1])) from generate_series(2, array_length(v_am_p1, 1)) g);
  v_sigma := v_mrbar / 1.128;
  v_s := v_centre + 3.0 * v_sigma;
  if v_s is null or abs(v_s - v_g_amasiri_phase1_individuals_ucl_psig) > 1e-9 * greatest(1.0, abs(v_g_amasiri_phase1_individuals_ucl_psig)) then
    raise exception 'D1 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/amasiri_phase1_individuals_ucl_psig]', v_s, v_g_amasiri_phase1_individuals_ucl_psig;
  end if;
  v_s := 3.267 * v_mrbar;
  if v_s is null or abs(v_s - v_g_amasiri_phase1_mr_ucl_psig) > 1e-9 * greatest(1.0, abs(v_g_amasiri_phase1_mr_ucl_psig)) then
    raise exception 'D1 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/amasiri_phase1_mr_ucl_psig]', v_s, v_g_amasiri_phase1_mr_ucl_psig;
  end if;
  v_e := v_centre;
  for i in 1 .. 14 loop
    v_e := 0.2 * v_am_p2[i] + (1.0 - 0.2) * v_e;
  end loop;
  v_s := v_e;
  if v_s is null or abs(v_s - v_g_amasiri_ewma_day14_psig) > 1e-9 * greatest(1.0, abs(v_g_amasiri_ewma_day14_psig)) then
    raise exception 'D1 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/amasiri_ewma_day14_psig]', v_s, v_g_amasiri_ewma_day14_psig;
  end if;
  v_s := v_centre + 3.0 * v_sigma * (sqrt(0.2 / (2.0 - 0.2)) * sqrt(1.0 - (1.0 - 0.2) ^ (2.0 * 2.0)));
  if v_s is null or abs(v_s - v_g_amasiri_ewma_exact_ucl_day2_psig) > 1e-9 * greatest(1.0, abs(v_g_amasiri_ewma_exact_ucl_day2_psig)) then
    raise exception 'D1 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/amasiri_ewma_exact_ucl_day2_psig]', v_s, v_g_amasiri_ewma_exact_ucl_day2_psig;
  end if;
  v_hi := 0.0;
  for i in 1 .. 18 loop
    v_hi := greatest(0.0, v_hi + v_am_p2[i] - v_centre - 0.5 * v_sigma);
  end loop;
  v_s := v_hi;
  if v_s is null or abs(v_s - v_g_amasiri_cusum_upper_day18_psi) > 1e-9 * greatest(1.0, abs(v_g_amasiri_cusum_upper_day18_psi)) then
    raise exception 'D1 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/amasiri_cusum_upper_day18_psi]', v_s, v_g_amasiri_cusum_upper_day18_psi;
  end if;
  v_ws := (select sum(x) from unnest(v_sc_w) x);
  v_s := (select sum((w_ / v_ws) * (1.0 - f / c)) from unnest(v_sc_w, v_sc_failed, v_sc_checked) as t(w_, f, c));
  if v_s is null or abs(v_s - v_g_amasiri_scorecard_total) > 1e-9 * greatest(1.0, abs(v_g_amasiri_scorecard_total)) then
    raise exception 'D1 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/amasiri_scorecard_total]', v_s, v_g_amasiri_scorecard_total;
  end if;

  -- ------------------------------------------------------------ 3. the traps
  v_wrong := (select count(*) filter (where x is not null and x <> -999.25)::double precision / count(*)::double precision from unnest(v_od_rhob) x);
  if v_wrong is null or abs(v_wrong - v_g_odudu_rhob_completeness) <= 5e-07 then
    raise exception 'D1 go-live refused: the sentinel counted as missing gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odudu_rhob_completeness]', v_wrong, v_g_odudu_rhob_completeness;
  end if;
  v_wrong := (select count(*) filter (where x is null)::double precision / count(*)::double precision from unnest(v_od_rhob) x);
  if v_wrong is null or abs(v_wrong - v_g_odudu_rhob_completeness) <= 5e-07 then
    raise exception 'D1 go-live refused: the missing fraction quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odudu_rhob_completeness]', v_wrong, v_g_odudu_rhob_completeness;
  end if;
  v_x := 0.0; v_prev := null;
  for i in 1 .. array_length(v_od_depth, 1) loop
    if v_od_nphi[i] is not null then
      if v_prev is not null and v_od_depth[i] - v_prev <= 1.0 then
        v_x := v_x + greatest(0.0, least(v_od_depth[i], 6280.0) - greatest(v_prev, 6210.0));
      end if;
      v_prev := v_od_depth[i];
    end if;
  end loop;
  v_wrong := v_x / (6280.0 - 6210.0);
  if v_wrong is null or abs(v_wrong - v_g_odudu_nphi_coverage) <= 5e-07 then
    raise exception 'D1 go-live refused: a maxStep of one foot gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odudu_nphi_coverage]', v_wrong, v_g_odudu_nphi_coverage;
  end if;
  v_wrong := (select count(v_od_nphi[g])::double precision / count(*)::double precision from generate_series(1, array_length(v_od_depth, 1)) g where v_od_depth[g] >= 6210.0 and v_od_depth[g] <= 6280.0);
  if v_wrong is null or abs(v_wrong - v_g_odudu_nphi_coverage) <= 5e-07 then
    raise exception 'D1 go-live refused: the fraction of samples present gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odudu_nphi_coverage]', v_wrong, v_g_odudu_nphi_coverage;
  end if;
  v_wrong := (select avg(v_od_sc[g + 1] - v_od_sc[g]) from generate_series(1, array_length(v_od_sc, 1) - 1) g);
  if v_wrong is null or abs(v_wrong - v_g_odudu_scada_expected_step_min) <= 5e-07 then
    raise exception 'D1 go-live refused: the mean of every step gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odudu_scada_expected_step_min]', v_wrong, v_g_odudu_scada_expected_step_min;
  end if;
  v_wrong := (v_od_sc[array_length(v_od_sc, 1)] - v_od_sc[1]) / (array_length(v_od_sc, 1)::double precision - 1.0);
  if v_wrong is null or abs(v_wrong - v_g_odudu_scada_expected_step_min) <= 5e-07 then
    raise exception 'D1 go-live refused: the span over the entries gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odudu_scada_expected_step_min]', v_wrong, v_g_odudu_scada_expected_step_min;
  end if;
  v_wrong := v_od_wc[23];
  if v_wrong is null or abs(v_wrong - v_g_odudu_water_cut_day23) <= 5e-07 then
    raise exception 'D1 go-live refused: the reported value quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odudu_water_cut_day23]', v_wrong, v_g_odudu_water_cut_day23;
  end if;
  v_wrong := v_od_water[23] / v_od_oil[23];
  if v_wrong is null or abs(v_wrong - v_g_odudu_water_cut_day23) <= 5e-07 then
    raise exception 'D1 go-live refused: water over oil gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odudu_water_cut_day23]', v_wrong, v_g_odudu_water_cut_day23;
  end if;
  v_wrong := v_od_oil[23] / (v_od_oil[23] + v_od_water[23]);
  if v_wrong is null or abs(v_wrong - v_g_odudu_water_cut_day23) <= 5e-07 then
    raise exception 'D1 go-live refused: the oil cut gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odudu_water_cut_day23]', v_wrong, v_g_odudu_water_cut_day23;
  end if;
  v_wrong := v_od_cum[36] - v_od_cum[39];
  if v_wrong is null or abs(v_wrong - v_g_odudu_cumulative_drop_bbl) <= 5e-07 then
    raise exception 'D1 go-live refused: a drop measured against day 36 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odudu_cumulative_drop_bbl]', v_wrong, v_g_odudu_cumulative_drop_bbl;
  end if;
  v_wrong := 100.0 * (v_od_cum[37] - v_od_cum[39]) / v_od_cum[37];
  if v_wrong is null or abs(v_wrong - v_g_odudu_cumulative_drop_bbl) <= 5e-07 then
    raise exception 'D1 go-live refused: the drop as a percent of day 37 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odudu_cumulative_drop_bbl]', v_wrong, v_g_odudu_cumulative_drop_bbl;
  end if;
  v_wrong := 0.005 * (v_od_oil[44] + v_od_water[44]);
  if v_wrong is null or abs(v_wrong - v_g_odudu_phase_sum_allowed_day44_bbl_d) <= 5e-07 then
    raise exception 'D1 go-live refused: the tolerance taken on the sum of the parts gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odudu_phase_sum_allowed_day44_bbl_d]', v_wrong, v_g_odudu_phase_sum_allowed_day44_bbl_d;
  end if;
  v_wrong := 0.005 * v_od_oil[44];
  if v_wrong is null or abs(v_wrong - v_g_odudu_phase_sum_allowed_day44_bbl_d) <= 5e-07 then
    raise exception 'D1 go-live refused: the tolerance taken on the oil gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odudu_phase_sum_allowed_day44_bbl_d]', v_wrong, v_g_odudu_phase_sum_allowed_day44_bbl_d;
  end if;
  select avg(x), stddev_pop(x) into v_m, v_sd from unnest(v_ik_core) x;
  v_wrong := (select max(abs((x - v_m) / v_sd)) from unnest(v_ik_core) x);
  if v_wrong is null or abs(v_wrong - v_g_ikoro_core_max_abs_z) <= 5e-07 then
    raise exception 'D1 go-live refused: the population standard deviation gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ikoro_core_max_abs_z]', v_wrong, v_g_ikoro_core_max_abs_z;
  end if;
  v_wrong := (16.0) / sqrt(17.0);
  if v_wrong is null or abs(v_wrong - v_g_ikoro_core_max_abs_z) <= 5e-07 then
    raise exception 'D1 go-live refused: the ceiling quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ikoro_core_max_abs_z]', v_wrong, v_g_ikoro_core_max_abs_z;
  end if;
  select percentile_cont(0.5) within group (order by x) into v_med from unnest(v_ik_core) x;
  select percentile_cont(0.5) within group (order by abs(x - v_med)) into v_mad from unnest(v_ik_core) x;
  v_wrong := (select max((abs(x - v_med) / 1.4826) / v_mad) from unnest(v_ik_core) x);
  if v_wrong is null or abs(v_wrong - v_g_ikoro_core_max_abs_modified_z) <= 5e-07 then
    raise exception 'D1 go-live refused: the reciprocal of 1.4826 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ikoro_core_max_abs_modified_z]', v_wrong, v_g_ikoro_core_max_abs_modified_z;
  end if;
  v_wrong := (select max(0.6745 * abs(x - (select avg(y) from unnest(v_ik_core) y)) / v_mad) from unnest(v_ik_core) x);
  if v_wrong is null or abs(v_wrong - v_g_ikoro_core_max_abs_modified_z) <= 5e-07 then
    raise exception 'D1 go-live refused: the mean in place of the median gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ikoro_core_max_abs_modified_z]', v_wrong, v_g_ikoro_core_max_abs_modified_z;
  end if;
  select percentile_cont(0.25) within group (order by x), percentile_cont(0.75) within group (order by x)
    into v_q1, v_q3 from unnest(v_ik_rhob) x where x is not null;
  v_wrong := v_q3 + 3.0 * (v_q3 - v_q1);
  if v_wrong is null or abs(v_wrong - v_g_ikoro_rhob_upper_fence_g_cm3) <= 5e-07 then
    raise exception 'D1 go-live refused: the outer fence, k of 3 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ikoro_rhob_upper_fence_g_cm3]', v_wrong, v_g_ikoro_rhob_upper_fence_g_cm3;
  end if;
  v_wrong := (select percentile_cont(0.5) within group (order by x) from unnest(v_ik_rhob) x where x is not null) + 1.5 * (v_q3 - v_q1);
  if v_wrong is null or abs(v_wrong - v_g_ikoro_rhob_upper_fence_g_cm3) <= 5e-07 then
    raise exception 'D1 go-live refused: the fence built from the median gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ikoro_rhob_upper_fence_g_cm3]', v_wrong, v_g_ikoro_rhob_upper_fence_g_cm3;
  end if;
  select percentile_cont(0.5) within group (order by v_ik_rhob[g]) into v_med from generate_series(58 - 4, 58 + 4) g where v_ik_rhob[g] is not null;
  select percentile_cont(0.5) within group (order by abs(v_ik_rhob[g] - v_med)) into v_mad from generate_series(58 - 4, 58 + 4) g where v_ik_rhob[g] is not null;
  v_wrong := 3.0 * 1.4826 * v_mad;
  if v_wrong is null or abs(v_wrong - v_g_ikoro_rhob_hampel_threshold_entry57_g_cm3) <= 5e-07 then
    raise exception 'D1 go-live refused: a window one sample wider gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ikoro_rhob_hampel_threshold_entry57_g_cm3]', v_wrong, v_g_ikoro_rhob_hampel_threshold_entry57_g_cm3;
  end if;
  select percentile_cont(0.5) within group (order by v_ik_rhob[g]) into v_med from generate_series(58 - 3, 58 + 3) g where v_ik_rhob[g] is not null;
  select percentile_cont(0.5) within group (order by abs(v_ik_rhob[g] - v_med)) into v_mad from generate_series(58 - 3, 58 + 3) g where v_ik_rhob[g] is not null;
  v_wrong := 3.0 * v_mad;
  if v_wrong is null or abs(v_wrong - v_g_ikoro_rhob_hampel_threshold_entry57_g_cm3) <= 5e-07 then
    raise exception 'D1 go-live refused: no 1.4826 scale on the MAD gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ikoro_rhob_hampel_threshold_entry57_g_cm3]', v_wrong, v_g_ikoro_rhob_hampel_threshold_entry57_g_cm3;
  end if;
  v_wrong := 2.0 * 1.4826 * v_mad;
  if v_wrong is null or abs(v_wrong - v_g_ikoro_rhob_hampel_threshold_entry57_g_cm3) <= 5e-07 then
    raise exception 'D1 go-live refused: two sigma gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ikoro_rhob_hampel_threshold_entry57_g_cm3]', v_wrong, v_g_ikoro_rhob_hampel_threshold_entry57_g_cm3;
  end if;
  v_wrong := (16.0) / sqrt(17.0);
  if v_wrong is null or abs(v_wrong - v_g_ikoro_core_grubbs_critical) <= 5e-07 then
    raise exception 'D1 go-live refused: the ceiling quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ikoro_core_grubbs_critical]', v_wrong, v_g_ikoro_core_grubbs_critical;
  end if;
  v_q := 0.05 / 17.0;
  v_lo := 0.0; v_hi := 100.0;
  for j in 1 .. 200 loop
    v_mid := 0.5 * (v_lo + v_hi);
    v_th := atan(v_mid / sqrt(15.0));
    v_term := cos(v_th); v_sum := cos(v_th);
    for i in 1 .. 6 loop
      v_term := v_term * cos(v_th) * cos(v_th) * (2.0 * i) / (2.0 * i + 1.0);
      v_sum := v_sum + v_term;
    end loop;
    v_tail := (1.0 - (2.0 / pi()) * (v_th + sin(v_th) * v_sum)) / 2.0;
    if v_tail > v_q then v_lo := v_mid; else v_hi := v_mid; end if;
  end loop;
  v_t := 0.5 * (v_lo + v_hi);
  v_wrong := (16.0 / sqrt(17.0)) * sqrt(v_t * v_t / (15.0 + v_t * v_t));
  if v_wrong is null or abs(v_wrong - v_g_ikoro_core_grubbs_critical) <= 5e-07 then
    raise exception 'D1 go-live refused: the one-sided critical value at alpha over N gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ikoro_core_grubbs_critical]', v_wrong, v_g_ikoro_core_grubbs_critical;
  end if;
  v_wrong := sqrt(v_g_ikoro_max_mahalanobis_d2);
  if v_wrong is null or abs(v_wrong - v_g_ikoro_max_mahalanobis_d2) <= 5e-07 then
    raise exception 'D1 go-live refused: the distance not squared gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ikoro_max_mahalanobis_d2]', v_wrong, v_g_ikoro_max_mahalanobis_d2;
  end if;
  v_wrong := v_g_ikoro_max_mahalanobis_d2 * (35.0 / 36.0);
  if v_wrong is null or abs(v_wrong - v_g_ikoro_max_mahalanobis_d2) <= 5e-07 then
    raise exception 'D1 go-live refused: the population covariance gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ikoro_max_mahalanobis_d2]', v_wrong, v_g_ikoro_max_mahalanobis_d2;
  end if;
  v_wrong := v_centre + 3.0 * (select stddev_samp(x) from unnest(v_am_p1) x);
  if v_wrong is null or abs(v_wrong - v_g_amasiri_phase1_individuals_ucl_psig) <= 5e-07 then
    raise exception 'D1 go-live refused: the sample standard deviation for sigma gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/amasiri_phase1_individuals_ucl_psig]', v_wrong, v_g_amasiri_phase1_individuals_ucl_psig;
  end if;
  v_wrong := v_centre + 2.0 * v_sigma;
  if v_wrong is null or abs(v_wrong - v_g_amasiri_phase1_individuals_ucl_psig) <= 5e-07 then
    raise exception 'D1 go-live refused: two-sigma limits gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/amasiri_phase1_individuals_ucl_psig]', v_wrong, v_g_amasiri_phase1_individuals_ucl_psig;
  end if;
  v_wrong := 3.0 * v_mrbar;
  if v_wrong is null or abs(v_wrong - v_g_amasiri_phase1_mr_ucl_psig) <= 5e-07 then
    raise exception 'D1 go-live refused: D4 taken as 3 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/amasiri_phase1_mr_ucl_psig]', v_wrong, v_g_amasiri_phase1_mr_ucl_psig;
  end if;
  v_wrong := 3.267 * v_sigma;
  if v_wrong is null or abs(v_wrong - v_g_amasiri_phase1_mr_ucl_psig) <= 5e-07 then
    raise exception 'D1 go-live refused: D4 times sigma gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/amasiri_phase1_mr_ucl_psig]', v_wrong, v_g_amasiri_phase1_mr_ucl_psig;
  end if;
  v_e := v_am_p2[1];
  for i in 1 .. 14 loop
    v_e := 0.2 * v_am_p2[i] + (1.0 - 0.2) * v_e;
  end loop;
  v_wrong := v_e;
  if v_wrong is null or abs(v_wrong - v_g_amasiri_ewma_day14_psig) <= 5e-07 then
    raise exception 'D1 go-live refused: the EWMA started at the first value gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/amasiri_ewma_day14_psig]', v_wrong, v_g_amasiri_ewma_day14_psig;
  end if;
  v_e := (select avg(x) from unnest(v_am_p2) x);
  for i in 1 .. 14 loop
    v_e := 0.2 * v_am_p2[i] + (1.0 - 0.2) * v_e;
  end loop;
  v_wrong := v_e;
  if v_wrong is null or abs(v_wrong - v_g_amasiri_ewma_day14_psig) <= 5e-07 then
    raise exception 'D1 go-live refused: the target taken from phase two gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/amasiri_ewma_day14_psig]', v_wrong, v_g_amasiri_ewma_day14_psig;
  end if;
  v_wrong := v_centre + 3.0 * v_sigma * sqrt(0.2 / (2.0 - 0.2));
  if v_wrong is null or abs(v_wrong - v_g_amasiri_ewma_exact_ucl_day2_psig) <= 5e-07 then
    raise exception 'D1 go-live refused: the asymptotic limit gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/amasiri_ewma_exact_ucl_day2_psig]', v_wrong, v_g_amasiri_ewma_exact_ucl_day2_psig;
  end if;
  v_wrong := v_centre + 3.0 * v_sigma * (sqrt(0.2 / (2.0 - 0.2)) * sqrt(1.0 - (1.0 - 0.2) ^ 2.0));
  if v_wrong is null or abs(v_wrong - v_g_amasiri_ewma_exact_ucl_day2_psig) <= 5e-07 then
    raise exception 'D1 go-live refused: the exact limit of day 1 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/amasiri_ewma_exact_ucl_day2_psig]', v_wrong, v_g_amasiri_ewma_exact_ucl_day2_psig;
  end if;
  v_hi := 0.0;
  for i in 1 .. 18 loop
    v_hi := v_hi + v_am_p2[i] - v_centre - 0.5 * v_sigma;
  end loop;
  v_wrong := v_hi;
  if v_wrong is null or abs(v_wrong - v_g_amasiri_cusum_upper_day18_psi) <= 5e-07 then
    raise exception 'D1 go-live refused: the CUSUM without its floor at zero gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/amasiri_cusum_upper_day18_psi]', v_wrong, v_g_amasiri_cusum_upper_day18_psi;
  end if;
  v_wrong := (select sum(v_am_p2[g] - v_centre) from generate_series(1, 18) g);
  if v_wrong is null or abs(v_wrong - v_g_amasiri_cusum_upper_day18_psi) <= 5e-07 then
    raise exception 'D1 go-live refused: the plain cumulative sum gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/amasiri_cusum_upper_day18_psi]', v_wrong, v_g_amasiri_cusum_upper_day18_psi;
  end if;
  v_wrong := (select avg(1.0 - f / c) from unnest(v_sc_failed, v_sc_checked) as t(f, c));
  if v_wrong is null or abs(v_wrong - v_g_amasiri_scorecard_total) <= 5e-07 then
    raise exception 'D1 go-live refused: equal weights gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/amasiri_scorecard_total]', v_wrong, v_g_amasiri_scorecard_total;
  end if;
  v_wrong := 1.0 - (select sum(x) from unnest(v_sc_failed) x) / (select sum(x) from unnest(v_sc_checked) x);
  if v_wrong is null or abs(v_wrong - v_g_amasiri_scorecard_total) <= 5e-07 then
    raise exception 'D1 go-live refused: the failures pooled across dimensions gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/amasiri_scorecard_total]', v_wrong, v_g_amasiri_scorecard_total;
  end if;

  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = 'dataqc';
  if not exists (select 1 from public.academy_apps where slug = 'dataqc' and status = 'available') then
    raise exception 'D1 go-live refused: dataqc did not reach status available';
  end if;
  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon from public.academy_apps;
  raise notice 'D1 go-live: dataqc available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;
end $$;
