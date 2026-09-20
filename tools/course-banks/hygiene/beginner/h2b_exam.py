import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H2 Associate final exam, 42 questions across m01 to m06.
# Sources: digest sections 1, 3 to 10, 23, 24 and 25 (Associate-owned). Every figure is printed there.
# Figures and angles are chosen to differ from the module banks.

# m01: the dosimeter day
q(2, "At 81.000000 dBA the engine gives an OSHA reference duration of 27.857618 h, and Table G-16a prints 27.900000 h. Which figure does T = 8 / 2^((L - 90)/5) reproduce?",
 "27.857618 h; the printed row is that figure rounded to one decimal.",
 ["27.900000 h; the engine rounds its own answer down to three decimals.",
  "Neither; the row at 81 dBA is an erratum the formula refutes outright.",
  "27.900000 h; the formula is only exact at whole steps of 5 dB like 85."],
 "Putting 81 into the formula gives 27.857618 h, and one decimal of that is the printed 27.900000, 0.042382 h away and inside its printed tolerance. The printed row is the rounding and the engine's figure is the formula. The formula holds at every level, and the one refuted printed row in these tables is on NIOSH Table 1-1.")

q(0, "What reference duration does NIOSH Table 1-1 give at 91.000000 dBA?",
 "2.000000 h, which is 120.000000 minutes.",
 ["6.964405 h, the OSHA figure at that level.",
  "2.519842 h, the NIOSH figure at 90 dBA.",
  "1.587401 h, the NIOSH figure at 92 dBA."],
 "91 dBA is two 3 dB steps above the 85 dBA criterion level, so 8 hours halves twice to 2.000000 h, printed as 120.000000 minutes. The tempting 6.964405 h is the OSHA reference duration at 91 dBA, a different criterion. The 90 and 92 dBA rows sit either side of the answer on the same NIOSH ladder.")

q(3, "At 94.000000 dBA the OSHA reference duration is 4.594793 h and the NIOSH one is 1.000000 h. What does that say about a reference duration?",
 "It belongs to the criterion as much as to the sound level.",
 ["One of the two figures must be a transcription slip in its table.",
  "NIOSH measures the reference duration in minutes and OSHA in hours.",
  "The instrument reads 94 dBA differently under the two criteria."],
 "The same level gives two reference durations because the criteria differ in criterion level and decibel exchange rate. Both figures are reproduced from their published tables. NIOSH Table 1-1 prints hours, minutes and seconds and the golden stores hours, so the unit is no explanation, and the sound level itself is one reading.")

q(1, "The ORONI record has 3.000000 h at 80.000000 dBA. What does that period add to the OSHA action level noise dose?",
 "9.375000 percent, 3 hours over a 32.000000 h reference duration.",
 ["11.811760 percent, which is the NIOSH noise REL share of the period.",
  "Nothing, since 80 dBA sits on the threshold and is left out of it.",
  "25.000000 percent, the share of the 90 dBA period on the same record."],
 "At 80 dBA the OSHA allowance lasts 32.000000 h, so three hours use 9.375000 percent of it. A level exactly on the action level's line is counted, which is the rule the ORONI record exists to show. The NIOSH allowance at the same level lasts 25.398417 h, which is where the larger 11.811760 percent comes from, and 25.000000 percent belongs to the 90 dBA period.")

q(0, "ORONI read against the OSHA hearing conservation trigger: which pair of figures comes back?",
 "34.375000 percent and 82.296991 dBA.",
 ["25.000000 percent and 79.999784 dBA.",
  "91.181812 percent and 84.599082 dBA.",
  "34.375000 percent and 84.599082 dBA."],
 "The action level integrates the 80 dBA and 90 dBA periods, 9.375000 plus 25.000000 percent, which is 34.375000 percent and restates as 82.296991 dBA. The 25.000000 percent and 79.999784 dBA pair is the PEL, which integrates only the 90 dBA period. 91.181812 percent and 84.599082 dBA are the NIOSH noise REL figures of the same record.")

q(2, "A hand-typed criterion arrives with no criterion level. What does the engine return?",
 "A refusal on `criterionLevelDbA`: \"criterionLevelDbA must be a finite number of dBA\".",
 ["A reference duration computed on a default criterion level of 90 dBA, the OSHA figure.",
  "A refusal on `criterion`, since the name of the preset is then unknown.",
  "A reference duration on the NIOSH criterion level of 85 dBA instead."],
 "The golden case ref-criterion-missing refuses on `criterionLevelDbA` with the message quoted in the key, in the engine's own words. A criterion typed by hand must carry a usable criterion level, and the engine supplies no default. The `criterion` field is refused for an unknown preset name, which is a different mistake.")

q(3, "A download's second period has no sound level recorded. Which field does the engine refuse?",
 "`periods[1].levelDbA`, the second period.",
 ["`periods[0].levelDbA`, the first period.",
  "`periods`, the record taken as a whole.",
  "`levelDbA`, with no period named at all."],
 "The golden case dose-missing-level refuses on `periods[1].levelDbA` with \"periods[1].levelDbA must be a finite number\". Positions count from zero, so index 1 is the second period. The field names the row so a hygienist can go straight to it; `periods` is kept for faults in the record as a whole.")

q(1, "What does `noiseDose` return when it is handed an empty list of periods?",
 "A refusal on `periods`: \"periods must be a non-empty array\".",
 ["A noise dose of 0.000000 percent with a TWA of null for the day.",
  "A refusal on `dosePct`, since there is no noise dose to restate.",
  "A warning that the record is empty, and a zero TWA."],
 "The golden case dose-empty refuses on `periods` with the message in the key. A noise dose of zero with a null TWA is what a real record with nothing above the threshold returns, which is a legitimate day with periods in it. `dosePct` is the field of the TWA door, and the engine does not return a TWA of zero.")

q(2, "How many functions and frozen tables does the engine behind this course export?",
 "26 functions and 8 frozen tables, each result naming its criterion or source.",
 ["3 functions, one for each criterion this tier reads the record against.",
  "57 functions, one for each of the refusal cases the vendored golden carries.",
  "26 functions and a licensed limit table for every criterion in use."],
 "Digest section 1: the engine exports 26 functions and 8 frozen tables, and every result names the criterion or source it was computed against. 57 is the number of refusal cases in the golden. The engine embeds no limit table of its own; every exposure limit is an input.")

# m02: noise dose to TWA
q(0, "ORONI's OSHA PEL noise dose of 25.000000 percent restates as a TWA of 79.999784 dBA. Why is that a hair under 80?",
 "Two halvings with 16.61 fall a whisker short; the exact coefficient lands on 80.000000.",
 ["The 90 dBA period sits on the threshold and is counted at slightly less than full weight.",
  "The engine subtracts the threshold of 90 dBA before it takes the logarithm.",
  "The ORONI record is 8.000000 h long, and a TWA always uses a 9 hour normaliser."],
 "Table A-1's 25 percent row gives 79.999784 dBA with 16.61 and 80.000000 dBA with the exact coefficient, and prints 80.000000. A quarter of the allowance is two halvings, so the TWA is two decibel exchange rates below 90 with the exact coefficient and a whisker lower with the printed one. J2 counts the threshold period in full.")

q(3, "Just past one full allowance, at 105.000000 percent, OSHA prints 90.400000 dBA. The printed coefficient gives 90.351954 and the exact one 90.351947. Is that entry evidence for either?",
 "Nothing between the two: both round to the printed figure.",
 ["That 16.61 is right, since its figure is the larger one.",
  "That the exact coefficient is right, since it is smaller.",
  "That the table is in error, being 0.048053 dB too high."],
 "Rounded to one decimal both engine columns give the printed 90.400000 dBA, so the row is consistent with either coefficient, as all 150 rows of Table A-1 are. The gap between the two is in the sixth decimal. The printed figure sits 0.048053 dB above the exact column, which is ordinary one-decimal rounding and inside its tolerance.")

q(1, "At the low end of NIOSH's noise dose table, 20.000000 percent is printed as 78.000000 dBA; 10.0 gives 78.010300 and the exact coefficient 78.034216. Can this entry tell the two apart?",
 "It cannot tell the two coefficients apart, since both round to 78.000000.",
 ["It rejects the exact coefficient, since 78.034216 is further from the print.",
  "It rejects 10.0, since the printed figure sits below both of the columns.",
  "It is an erratum, since neither column matches the printed figure exactly."],
 "Both columns round to the printed one decimal, so this row is among those of Table 1-2 that do not separate the coefficients; 49 of its 83 rows do. Being further from the print decides nothing inside the table's rounding. Neither column is meant to match to six decimals, because the table prints one.")

q(2, "For 700000.000000 percent the printed NIOSH figure is 123.500000 dBA. With 10.0 the engine reaches 123.450980, and with the exact coefficient 123.319418. Which coefficient survives?",
 "10.0, since only its column rounds to the printed figure.",
 ["The exact one, since it is the more precise value of the two.",
  "Neither, since both columns miss the printed figure by a margin.",
  "Both alike, since the two columns differ by only one decimal."],
 "At one decimal 123.450980 rounds to the printed 123.500000 and 123.319418 does not, so the row rejects the exact coefficient and supports 10.0. That is judgement J1 made visible: at a noise dose that large, the 0.034215715338 dB gap in the coefficient is multiplied by a big logarithm and moves the printed decimal.")

q(0, "How does the engine measure the TWA coefficient each preset carries?",
 "It asks for the TWA of a 1000 percent noise dose and subtracts the criterion level.",
 ["It reads the coefficient from the source text and stores it without ever checking it.",
  "It fits a line through the rows of Table A-1 and takes the slope of that fitted line.",
  "It asks for the level giving a 4 hour reference duration and divides by log10 2."],
 "Digest section 3: the coefficient is measured as the TWA of a 1000 percent noise dose less the criterion level, since log10 of 10 is one. That returns 16.610000000000 for both OSHA presets and 10.000000000000 for NIOSH, each pinned against a literal. The 4 hour question measures the decibel exchange rate.")

q(3, "What TWA does the last row of OSHA Table A-1, a noise dose of 999.000000 percent, give with 16.61?",
 "106.602783 dBA.",
 ["105.000325 dBA.",
  "134.030900 dBA.",
  "106.602423 dBA."],
 "The engine gives 106.602783 dBA at 999.000000 percent with the printed coefficient, and the table prints 106.600000. 106.602423 dBA is the same row with the exact coefficient. 105.000325 dBA is the 800.000000 percent row, and 134.030900 dBA belongs to NIOSH Table 1-2 at 8000000.000000 percent.")

q(1, "On NIOSH Table 1-2 a noise dose of 200.000000 percent gives 88.010300 dBA with 10.0. What does doubling the noise dose do to a NIOSH TWA?",
 "It adds about one decibel exchange rate, 3 dB.",
 ["It adds 5 dB, as a doubling does on the OSHA scale.",
  "It doubles the TWA, from 85 to 170 dBA.",
  "It adds 10 dB, the size of the coefficient."],
 "Doubling adds the coefficient times log10 2, which is the decibel exchange rate: exactly 3 dB with the exact coefficient, giving 88.000000, and slightly more with 10.0, giving 88.010300 dBA. 5 dB is the OSHA step. A TWA is a logarithm of the noise dose, so doubling the noise dose never doubles the level.")

q(2, "Handed a noise dose below zero, what does the engine's TWA door do?",
 "The same refusal on `dosePct` a noise dose of zero gets.",
 ["A negative TWA, below the criterion's threshold of integration.",
  "The TWA of the absolute value of the noise dose, sign dropped.",
  "A null TWA with a warning, as `noiseDose` gives."],
 "Golden case twa-dose-negative: the door refuses on `dosePct` and reuses the zero message word for word, since below zero is as impossible as zero for a logarithm. Dropping the sign would repair the input silently, which the engine never does. A null TWA is what `noiseDose` reports for a day with nothing integrated, a different door.")

# m03: three criteria, one record
q(0, "The NIOSH noise REL limit noise dose is measured at 100.000000000001 percent. Why not exactly 100?",
 "It is found by bisection on `exceedsLimit`, and the literal is 100.",
 ["NIOSH publishes its limit a trillionth above 100 on purpose.",
  "The printed 10.0 adds that excess to every limit it touches.",
  "It is rounded up from the NIOSH ceiling of 115 dBA each time."],
 "Digest section 3 measures each limit noise dose by bisecting on `exceedsLimit` over one 8 hour period, so the measured figure carries the bisection's last-place error. The literal it is pinned against is 100.000000000000 and the relative difference is 6.679e-15. The coefficient affects TWAs and never the limit, and the ceiling is a level.")

q(3, "Which measurement pins the PEL threshold at 90.000000000000 dBA and the other two at 80.000000000000?",
 "By bisecting on its `belowThreshold` flag.",
 ["By reading the lowest row of the table.",
  "By subtracting 10 dB from the criterion level.",
  "By bisecting on the `exceedsLimit` flag."],
 "Digest section 3: thresholds are bisected on `belowThreshold`, giving 90.000000000000 dBA for the PEL and 80.000000000000 for the action level and the NIOSH noise REL. Subtracting 10 dB would give 80 on the PEL, which is wrong. `exceedsLimit` is the flag bisected for the limit noise dose.")

q(1, "One period at 117 dBA, scored against NIOSH's recommendation: which figures and warning count come back?",
 "2156.290550 percent and 98.337073 dBA, with 1 warning.",
 ["52.780316 percent and 85.390260 dBA, with 1 warning.",
  "13083.161045 percent and 106.167127 dBA, with 2 warnings.",
  "A refusal, since the level is above the 115 dBA ceiling."],
 "At 117 dBA NIOSH gives 2156.290550 percent and a TWA of 98.337073 dBA, with the single ceiling warning, and still integrates under judgement J3. 52.780316 percent is the same period on the OSHA PEL. 13083.161045 percent is the 132 dBA period on NIOSH, which also passes the top of Table G-16a and so carries 2 warnings.")

q(2, "The engine exports `OSHA_TABLE_G16A_MAX_DBA` and `OSHA_TABLE_G16_MAX_DBA`. What are they?",
 "130 marks where Table G-16a ends; 115 is Table G-16's maximum permitted level.",
 ["115 marks where Table G-16a ends; 130 is Table G-16's maximum permitted level.",
  "130 and 115, the ceilings of the NIOSH noise REL and of the OSHA PEL.",
  "90 and 80, the PEL threshold and the action level threshold in dBA."],
 "Digest section 8: `OSHA_TABLE_G16A_MAX_DBA` is 130 and `OSHA_TABLE_G16_MAX_DBA` is 115. The swapped pairing is the tempting slip; above 130 the warning says the formula is extrapolated, and above 115 it says the level is above anything Table G-16 permits. The NIOSH ceiling of 115 dBA is a separate warning on the NIOSH noise REL preset.")

q(3, "ORONI's OSHA action level TWA is 82.296991 dBA, under 85. Which noise dose comparison says the same thing?",
 "34.375000 percent against the action level limit noise dose of 50 percent.",
 ["34.375000 percent against 100 percent, the limit noise dose of the PEL.",
  "25.000000 percent against 50 percent, taking the PEL's noise dose of that day.",
  "91.181812 percent against 100 percent, the NIOSH noise REL reading of the day."],
 "A TWA and its noise dose restate one sum on one criterion, so the action level TWA under 85 dBA pairs with the action level noise dose under its own limit of 50 percent; section 1910.95(c)(1) makes a TWA of 85 and half a noise dose the same line. 100 percent is the PEL's limit, 25.000000 percent is the PEL's noise dose from a stricter threshold, and 91.181812 percent belongs to NIOSH.")

q(0, "Where does the NIOSH noise REL criterion come from, and what kind of document is it?",
 "NIOSH 98-126 (1998), a criteria document recommending a standard.",
 ["29 CFR 1910.95 Appendix A, a mandatory regulation from OSHA.",
  "HSE L108, the UK guidance on the Control of Noise at Work Regulations.",
  "A licensed limit table that the engine keeps for this preset."],
 "Digest section 1 names the source: NIOSH 98-126 Criteria for a Recommended Standard: Occupational Noise Exposure (1998), section 1.1 and Appendix. It is a recommendation rather than a regulation. 1910.95 Appendix A is the OSHA text that writes 16.61, and the engine embeds no licensed limit table.")

q(1, "The three OBEN TWAs, 80.752126, 87.635749 and 89.242460 dBA, sit much closer together than the three noise doses. Why is it wrong to read them as three estimates of one sound level?",
 "Each restates its own noise dose on its own criterion; the log only compresses them.",
 ["They are three estimates of one sound level, and their mean is the best figure.",
  "The NIOSH TWA is the true level, and the two OSHA TWAs are rounded versions of it.",
  "The TWAs differ only because the three criteria use different decibel meters."],
 "The logarithm compresses the percentages, so the TWAs look close, but each is its own noise dose restated against its own criterion level with its own coefficient. There is no shared quantity for them to estimate, so averaging them means nothing. The instrument record is one and the same in all three.")

q(2, "Which document writes TWA = 16.61 log10(D/100) + 90 and sets the OSHA PEL setup?",
 "29 CFR 1910.95 Appendix A, the mandatory text.",
 ["NIOSH 98-126, the criteria document from 1998.",
  "OSHA Table G-16a, the table of reference hours.",
  "The OSHA Technical Manual chapter on protectors."],
 "Digest section 5: the mandatory Appendix A of 29 CFR 1910.95 writes the formula with 16.61, and the engine uses the coefficient the regulation writes. NIOSH 98-126 is the source of the NIOSH noise REL with 10.0. Table G-16a tabulates reference durations and holds no TWA formula.")

# m04: reading a record
q(3, "The fifth OBEN period lasts 0.200000 h and its NIOSH reference duration at 99.100000 dBA is 0.307786 h. What does it contribute on the NIOSH noise REL?",
 "64.980192 percent.",
 ["8.827030 percent.",
  "91.895868 percent.",
  "27.646683 percent."],
 "0.200000 over 0.307786 h is 64.980192 percent of the NIOSH allowance. 8.827030 percent is the same period on OSHA, where its reference duration is 2.265768 h. 91.895868 and 27.646683 percent are the NIOSH contributions of the 94.600000 and 84.300000 dBA periods.")

q(0, "On the NIOSH noise REL, which OBEN period should a control target first to lower the day's figure most?",
 "The 94.600000 dBA period, which carries 91.895868 percent.",
 ["The 99.100000 dBA period, since it is the loudest one.",
  "The 84.300000 dBA period, since it lasts 2.600000 h.",
  "The 81.200000 dBA period, which carries 9.091664 percent."],
 "The largest contribution is the one a control should reach for first, and on NIOSH that is the third period at 91.895868 percent. The loudest period carries 64.980192 percent and the longest integrated one 27.646683 percent. A control aimed at the 81.200000 dBA period would barely move the total.")

q(1, "Judgement J4 refuses periods that total more than 24 hours. Which records does it cover?",
 "Noise, LEX and chemical records alike.",
 ["Noise dosimeter records alone, and nothing else.",
  "Only records on the OSHA presets, PEL and action level.",
  "Only records with a period over 8 h."],
 "Digest section 1: noise, LEX and chemical periods totalling over 24 hours are refused, on the field `periods`. The rule is about the data being one day, so it does not depend on the criterion or on any single period's length; a shift longer than 8 hours that fits in a day is accepted.")

q(2, "A worker spends exactly the 173.404361 minutes left at 95 dBA after the OBEN day. Where does the OSHA PEL noise dose then stand?",
 "At 100 percent, the whole allowance used exactly.",
 ["At 72.251817 percent, the share that remained.",
  "At 50 percent, the action level's limit reached.",
  "At 173.404361 percent, the minutes read as a share."],
 "The time left is defined as the fraction remaining times the reference duration, so spending all of it adds exactly the 72.251817 percent that remained to the day's 27.748183 percent, which is 100 percent. 72.251817 percent is the addition alone, and 173.404361 is a count of minutes. 50 percent belongs to the action level, a different criterion with its own limit.")

q(3, "After the OBEN day, how does the time left at 90 dBA on the OSHA PEL compare with the 173.404361 minutes at 95 dBA?",
 "It is twice as long, since the reference duration is 8.000000 h.",
 ["It is the same, since the share left is the same at any level.",
  "It is half as long, since 90 dBA is the PEL's criterion level.",
  "It is zero, since 90 dBA is below the PEL threshold of 90 dBA."],
 "The time left is the remaining share times the reference duration, and at 90 dBA the OSHA reference duration is 8.000000 h, twice the 4.000000 h at 95 dBA, so the same share buys twice the time. The PEL threshold is inclusive under J2, so 90 dBA is integrated and has time left to compute.")

q(0, "A download spans a night shift and the next day shift, 25 hours in all. What should the hygienist do first?",
 "Split it into days where the work pattern ends a day, then run each.",
 ["Drop the last hour so the record fits in 24 hours, then run it as one.",
  "Run it as one record and divide the noise dose by the number of days.",
  "Run it on the NIOSH noise REL, which accepts records past 24 hours."],
 "The engine refuses the record under J4 because it cannot know which hours belong to which day, and splitting them is a decision for the person who knows the work pattern. If a day boundary falls inside a period, that period is split into two. Trimming or averaging invents an answer, and the refusal applies to every criterion.")

q(1, "One day holds a single period of 16.000000 h at 85 dBA. What share of an allowance does it use on the OSHA action level, and does the engine accept it?",
 "100 percent of one allowance, and yes, since it fits inside 24 hours.",
 ["50 percent of one allowance, and yes, since the action level is half.",
  "Nothing, and yes, since 85 dBA is below the action level threshold.",
  "100 percent of one allowance, but no, since it runs past 8 hours."],
 "The OSHA reference duration at 85 dBA is 16.000000 h, so 16 hours there uses exactly one allowance, and the action level's threshold of 80 dBA lets the period in. A shift longer than 8 hours that fits inside a day is accepted; only records over 24 hours are refused. The action level halves the limit and moves no share.")

# m05: inverse questions
q(2, "Which sound levels give exactly 100 percent noise dose in 12.000000 h?",
 "87.075187 dBA on OSHA and 83.245112 dBA on NIOSH.",
 ["92.075187 dBA on OSHA and 86.245112 dBA on NIOSH.",
  "85.000000 dBA on OSHA and 82.000000 dBA on NIOSH.",
  "83.245112 dBA on OSHA and 87.075187 dBA on NIOSH."],
 "The engine's `noiseLevelForReferenceDurationDbA` gives 87.075187 dBA on OSHA and 83.245112 dBA on NIOSH for 12 hours. The 6 hour row is 92.075187 and 86.245112, and the 16 hour row is 85.000000 and 82.000000. The swapped pair gets the order wrong, since NIOSH gives the lower level at every duration.")

q(3, "For half an hour's allowance, what levels do the two criteria give?",
 "OSHA 110.000000 dBA; NIOSH 97.000000 dBA.",
 ["OSHA 97.000000 dBA; NIOSH 110.000000 dBA.",
  "OSHA 115.000000 dBA; NIOSH 100.000000 dBA.",
  "OSHA 105.000000 dBA; NIOSH 94.000000 dBA."],
 "Half an hour is four halvings of 8 hours: four 5 dB steps above 90 on OSHA give 110.000000 dBA and four 3 dB steps above 85 on NIOSH give 97.000000 dBA. The 115 and 100 dBA pair is the quarter-hour row, one more halving, and 105 and 94 dBA is the one hour row.")

q(0, "A contractor's summary gives only a TWA of 80 dBA. What noise dose does it restate on each criterion?",
 "25.000750 percent on OSHA and 31.622777 percent on NIOSH.",
 ["31.622777 percent on OSHA and 25.000750 percent on NIOSH.",
  "25.000000 percent on both, since 80 dBA is two halvings.",
  "Nothing on OSHA, since 80 dBA is below the PEL threshold."],
 "`noiseDoseFromTwaPct` gives 25.000750 percent on OSHA and 31.622777 percent on NIOSH. The OSHA figure sits a hair above a quarter because of the printed 16.61. The threshold decides which periods count and plays no part in turning a TWA back into a noise dose, which is why a TWA under 90 still restates a noise dose above zero.")

q(1, "Fed a TWA of 100 dBA, what does `noiseDoseFromTwaPct` return on OSHA and on NIOSH?",
 "OSHA 399.987998 percent; NIOSH 3162.277660 percent.",
 ["OSHA 399.987998 percent; NIOSH 1000.000000 percent.",
  "OSHA 3162.277660 percent; NIOSH 399.987998 percent.",
  "OSHA 200.000000 percent; NIOSH 316.227766 percent."],
 "On OSHA 100 dBA is two steps above 90, so about four allowances, 399.987998 percent with the printed coefficient. On NIOSH it is 15 dB above 85, five 3 dB steps, 3162.277660 percent. 1000.000000 percent is the NIOSH figure at 95 dBA, and the pair 200.000000 and 316.227766 percent counts only one step up from each criterion level.")

q(2, "On NIOSH, which TWA restates a noise dose of 50.118723 percent?",
 "82 dBA.",
 ["80 dBA.",
  "85 dBA.",
  "88 dBA."],
 "`noiseDoseFromTwaPct` gives 50.118723 percent on NIOSH at a TWA of 82 dBA, one 3 dB step below the 85 dBA criterion level and so close to half an allowance. At 80 dBA it gives 31.622777 percent, at 85 dBA 100.000000 percent and at 88 dBA 199.526231 percent. On OSHA the same 82 dBA gives 32.988490 percent.")

q(3, "Planning a task against both criteria, which gives the stricter level for a given duration, and how does the gap move as the task gets shorter?",
 "NIOSH at every duration, and the gap widens as the time shortens.",
 ["OSHA at every duration, and the gap narrows as the time shortens.",
  "NIOSH at long durations, OSHA at short ones, crossing near 4 hours.",
  "Neither; both give the same level once the time is under one hour."],
 "NIOSH starts lower, 85.000000 against 90.000000 dBA at 8 hours, and climbs 3 dB a halving against OSHA's 5 dB, so the gap grows to 100.000000 against 115.000000 dBA at a quarter of an hour. Two ladders of different slope from two different starting levels never cross in this range.")

q(0, "NIOSH Table 1-1 prints the reference duration from 80 dBA upward. How much of it does the engine reproduce?",
 "It reproduces 49 rows, and one further printed row is refuted by the formula.",
 ["It reproduces all 51 rows, the same count as OSHA Table G-16a.",
  "It reproduces none of them, since NIOSH prints hours and minutes.",
  "It reproduces 83 rows, one for each row of NIOSH Table 1-2."],
 "Digest section 4: 49 rows are reproduced, plus one printed row the formula refutes, which is an erratum in the source and is read in a later tier. 51 is the row count of Table G-16a, and 83 belongs to Table 1-2, the noise dose to TWA table. The golden stores hours, which the engine compares against.")

# m06: the capstone and the words
q(1, "A hygiene report mentions flare radiation near the work area. How does this course treat it?",
 "It cites Separation and Relief, which owns radiant flux in kW/m2.",
 ["It teaches flare radiation as a form of heat stress in this tier.",
  "It converts the radiant flux to a WBGT with the published weights.",
  "It treats it as a noise source, since flares are loud equipment."],
 "Digest section 25: flare and pool-fire thermal radiation, in kW/m2, is owned by the Separation and Relief courses. It is a radiant flux on a surface, and heat stress here is a WBGT index and a body's metabolic load, taught in the Expert tier. The course cites the seam and does not convert one quantity into the other.")

q(2, "In what unit does the engine take the duration of each period of a noise dose record?",
 "Hours, as `durationH` on each period.",
 ["Minutes, as the NIOSH table prints.",
  "Seconds, as a dosimeter logs them.",
  "Percent of an 8 hour shift, as a share."],
 "Digest section 25: durations are in hours for the noise dose, LEX and the 8-hour TWA, and in minutes for the STEL and the averages the Expert tier reads. The refusals name `periods[0].durationH`, the hours of a period. NIOSH Table 1-1 prints hours, minutes and seconds, and the golden stores hours.")

q(3, "The capstone asks for the minutes left at a stated level on the OSHA PEL. Which method gives that field?",
 "The PEL share left, times the reference duration at that level, in minutes.",
 ["The reference duration at the stated level, converted to minutes, in full.",
  "The PEL share already used, times 8 hours, converted into minutes.",
  "The share left on the action level, times its reference duration."],
 "The capstone brief states the method: take the remaining share of the PEL allowance and multiply by the reference duration at the stated level, then convert to minutes, exactly as the OBEN day gives 173.404361 minutes at 95 dBA. The whole reference duration ignores the share the record has used, and the field names the OSHA PEL, so the action level answers another criterion.")

emit(Q, '/root/hse-wip-hygiene/banks/h2b_exam.json', expect_n=42)
finish()
