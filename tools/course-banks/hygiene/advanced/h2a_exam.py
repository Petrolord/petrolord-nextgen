import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H2 Expert final exam, 42 questions across all six Expert modules, each on an
# angle the module banks do not take. Figures from digest Sections 1 to 3, 5,
# 9, 11, 13 to 23 and 25, at printed precision. Every WBGT built from
# thermometer readings carries the section 9.3.2 label, every RAL or NIOSH heat
# REL figure the section 8.1 label, and no such figure, margin, verdict or
# weekly factor is keyed as something to compute. No capstone input, condition
# or graded answer appears.

q(2, "The golden's own WBGT hour is an instrument readout of 31.000000 C for 45.000000 minutes and 24.000000 C for 15.000000 minutes. What does `wbgtTwaC` return?",
 "29.250000 C, the readouts weighted by their minutes over 60.000000 minutes",
 ["31.000000 C, the work readout alone",
  "The plain mean of 31.000000 C and 24.000000 C, one value for each of the two periods in the record",
  "29.066667 C, since the door applies the teaching hour's work and rest split of 40 and 20 minutes"],
 "31.000000 times 45.000000 plus 24.000000 times 15.000000, over 60.000000 minutes, gives 29.250000 C. Every period counts by its minutes, however short. A plain mean weights the fifteen minutes like the forty-five. 29.066667 C belongs to the teaching hour's own readouts; the door uses the minutes it is given.")

q(0, "`wbgtOutdoorC` is called with a natural wet bulb and a dry bulb and no globe reading. What does the engine return?",
 "A refusal on `globeC`, in its own words: \"globeC must be a finite temperature in degrees C\"",
 ["An index built from the indoor form, since without a globe the solar term cannot be weighted",
  "An index with the globe taken as equal to the dry bulb, with a warning that the reading was missing",
  "A refusal on `dryBulbC`, the last reading checked"],
 "The outdoor form needs all three readings, and the engine refuses and names the missing one on `globeC`. It never switches forms on its own: the form is fixed by the door that was called, which is why a report can always say which it used. It fills in no missing reading, and `dryBulbC` was given.")

q(3, "Which words belong beside a WBGT of 31.410000 C built from the outdoor thermometer readings?",
 "The NIOSH 2016-106 section 9.3.2 weighting, checked for transcription only",
 ["The NIOSH 2016-106 section 8.1 equation, checked for transcription only",
  "Arithmetic by definition, since the index is a weighted sum of stated readings",
  "Published and reproduced, since NIOSH prints the weights the index is built with"],
 "The course gives a WBGT built from thermometer readings its own label, because it rests on the weights of section 9.3.2, which are checked for transcription only. The section 8.1 label belongs to the RAL and NIOSH heat REL equations and margins against them. A weighted sum is not an average whose only constant is a window: its weights were copied. A printed weight is not a printed index, so nothing is reproduced.")

q(1, "Which of these heat stress figures carries neither the section 9.3.2 label nor the section 8.1 label?",
 "A one-hour average of the WBGT an instrument read out",
 ["A WBGT built from the natural wet bulb and globe readings through the indoor form",
  "The margin between a one-hour WBGT and the NIOSH heat REL at the hour's metabolic rate",
  "The RAL evaluated at the teaching hour's time weighted metabolic rate of 300.000000 W"],
 "A WBGT the instrument read out, and a one-hour average of such readouts, are arithmetic on stated values and pass through no copied constant. A WBGT built from thermometer readings carries the section 9.3.2 label, and a RAL, a NIOSH heat REL or a margin against either carries the section 8.1 label.")

q(0, "Before a NIOSH heat stress assessment three things are checked: each record totals 60 minutes, acclimatisation is typed as true or false, and the time weighted metabolic rate lies in the figure range. Which of them produces a warning instead of a refusal?",
 "A metabolic rate outside 116 to 580 W: the equation is extrapolated with a warning",
 ["A record that does not total 60 minutes, which is averaged over the minutes it holds with a warning",
  "Acclimatisation typed as a word, which the engine reads as true and flags with a warning",
  "None of them, since every one of the three stops the assessment with a refusal"],
 "Judgement J9: both records must total 60 minutes and acclimatized must be a boolean, and either failure is a refusal naming the field. The figure range is the one check that warns and still evaluates. A report that passes all three still carries the section 8.1 status beside every limit.")

q(2, "`nioshHeatAssessment` averages a WBGT record and a metabolic record and then compares the first with a limit. Which evidence class does the course give it?",
 "TRANSCRIPTION ONLY, since it stands on the section 8.1 equations",
 ["ARITHMETIC BY DEFINITION, since it averages the WBGT and metabolic records over one hour",
  "ORACLE ONLY, since it has oracle-only cases and no published ones in the golden",
  "PUBLISHED, REPRODUCED, since the section 1.1.3 worked example is an assessment the document prints"],
 "The assessment averages two records and then evaluates the RAL or NIOSH heat REL, whose constants were copied from the same page by the engine and the oracle, so the course classes it TRANSCRIPTION ONLY. The averaging inside it is arithmetic, but the door's result is the comparison with the limit. Case counts alone do not set the class, and the worked example is an erratum the engine must miss.")

q(1, "`hearingProtectorEstimate` is classed PUBLISHED, REPRODUCED. For which of its methods is that true?",
 "The OSHA field derating and Appendix B, from the Technical Manual example of 98 dBA with an NRR of 25",
 ["All four methods, since the door reproduces the Technical Manual example and one case covers the door",
  "The NIOSH derating by type and the dual-protection rule, which NIOSH and OSHA print as worked tables",
  "Appendix B only, since the field derating refuses C-weighted data and so cannot be reproduced at all"],
 "The OSHA Technical Manual Appendix E example gives 89.000000 dBA under the field derating and 80.000000 dBA under Appendix B, and the engine reproduces both. The NIOSH derating by type and the dual-protection 5 dB are ORACLE ONLY, and the course never grades them. A class names the strongest part of a door. The field derating refuses C-weighted data by design and is reproduced on A-weighted data.")

q(3, "Why does the NIOSH preset report a TWA a little above a steady level held all shift, 100.051500 dBA for 100 dBA?",
 "The preset restates the noise dose with the printed 10.0, which sits above the exact 9.965784284662",
 ["The 3 dB decibel exchange rate is applied to the reference duration after rounding to the printed Table 1-1",
  "The level lies above 80 dBA, so the threshold adds a fixed allowance to the TWA of every integrated period",
  "The engine adds a margin as the level nears the 115 dBA ceiling"],
 "The noise dose itself is exact. Restating it through 10.0 log10(D/100) + 85 overshoots because 10.0 sits above the exact coefficient, judgement J1's measured cost; read the other way, a TWA of exactly 100 dBA restates only 3162.277660 percent, less than eight hours at 100 dBA carries. On a custom criterion with the exact coefficient the same record gives 100.000000 dBA. The engine computes reference durations from the formula, a threshold decides only which periods count, and the ceiling only warns above 115 dBA.")

q(3, "0 of OSHA Table A-1's 150 rows reject the exact coefficient. What is that result a statement about?",
 "The table's one printed decimal, too coarse to see a 0.000359525563 dB gap",
 ["The exact coefficient, shown to be the table's own",
  "The printed 16.61, which the result proves to be the coefficient the table was computed with",
  "The engine's use of 16.61, now confirmed"],
 "A table can only prove what its printed precision can separate. The two coefficients differ by 0.000359525563 dB, so both reproduce every row and the table cannot choose. What fixes 16.61 is the mandatory Appendix A text. NIOSH Table 1-2 is the contrast: 49 of its 83 rows reject its exact coefficient, a statement about the coefficient itself.")

q(0, "No plausible edit to the engine could bring it near one of the five pinned errata. Which one, and how far out is it?",
 "The 102.0 dBA print at 50000 percent in NIOSH Table 1-2, 199.794001 tolerances out",
 ["The NIOSH heat REL worked example, 6.821223 tolerances away, since a figure reading is the least precise print",
  "The NIOSH Table 1-1 row at 99 dBA, 5.071055 tolerances away, since its unit of one second is the finest",
  "The OSHA Table A-1 row at 115 percent, 1.836177 tolerances away, since its tolerance is the widest of the five"],
 "The transposed digit, 102.0 printed for a formula value of 111.989700 dBA, misses by 9.989700 dB against a tolerance of 0.050000. The heat stress example comes next at 6.821223, then the Table 1-1 row at 5.071055, and the Table A-1 row is the nearest at 1.836177. Its tolerance of 0.050000 is shared by two other errata, so width does not decide the ranking.")

q(2, "What does the golden assert for each of its 5 errata?",
 "That the engine stays OUTSIDE the printed tolerance of the printed value",
 ["That the engine matches the printed value within its tolerance, since a source's print is the reference",
  "That the row is dropped from the golden, so that no check is ever run against a known misprint",
  "That the oracle matches the printed value"],
 "Each erratum is pinned as a case to miss, so an engine edited to agree with the typo turns the suite red. Matching the print would teach the engine the typo. Dropping the row would leave the typo invisible and a future edit free to match it. The oracle computes from the formulas too and has no reason to match a misprint.")

q(1, "An hour's WBGT sits a few tenths of a degree above the NIOSH heat REL equation at 348.900000 W. Why should a report treat that margin with caution?",
 "The document's own two routes, equation and figure, differ there by 0.341061 C",
 ["The instrument reads to one degree, so the margin is lost in it",
  "The equation is extrapolated at 348.900000 W",
  "A margin under one degree is rounded to zero by the engine, so it cannot be told apart from a margin of zero"],
 "At 348.900000 W the section 8.1 equation, checked for transcription only, gives 27.458939 C and the worked example's figure reading prints 27.800000 C. A margin smaller than the disagreement inside the document is inside that disagreement, and the report says which route it used. 348.900000 W lies inside the 116 to 580 W range, the engine rounds nothing, and nothing in the course sets an instrument's resolution.")

q(0, "Table IV-3 prints 80.000000 dBA for a 16.000000 hour shift. Which value does the engine's closed form give there?",
 "79.999784 dBA, from 90 + 16.61 log10(50 / (12.5 x 16))",
 ["80.000000 dBA exactly, since 50 over 12.5 times 16 is a quarter and the coefficient times log10 4 is 10",
  "85.000000 dBA, since the action level stays at 85 dBA whatever the length of the shift",
  "79.999784 dBA for the PEL, with the action level left at the 85 dBA of an eight-hour day"],
 "50 over 12.5 times 16 is a quarter, and 16.61 log10 of a quarter is just over 10, so the result lands at 79.999784 dBA, which Table IV-3 prints as 80.000000. Only the exact coefficient 16.609640474437 makes the product exactly 10. The action level moves on a longer shift, and the PEL is not reduced.")

q(3, "What does the closed form give for a 6.000000 hour shift?",
 "87.075124 dBA, a row Table IV-3 does not print",
 ["87.075187 dBA, the same argument taken with the exact coefficient 16.609640474437 in place of 16.61",
  "92.075187 dBA, the level whose 6 hour reference duration gives a 100 percent noise dose",
  "85.000000 dBA, since the extended-shift form only lowers the action level and never raises it"],
 "50 over 12.5 times 6 is two thirds, and 16.61 log10 of two thirds plus 90 is 87.075124 dBA, the level that held for 6 hours gives 50 percent. 87.075187 dBA is the Associate tier's level for a 12 hour reference duration, which is the same logarithm under the exact coefficient. 92.075187 dBA reaches 100 percent in 6 hours, the PEL's line. A short shift raises the action level, as it does at 4 hours to 90.000000 dBA.")

q(2, "On the PEL setup, what noise dose does the OLOMORO shift of 86.100000, 83.400000, 90.800000 and 78.900000 dBA give?",
 "16.759307 percent, since only the 90.800000 dBA period reaches the PEL's 90 dBA threshold",
 ["57.350093 percent, since the PEL and the action level integrate the same periods on any shift",
  "16.759307 percent rescaled by 8 over 10, since the PEL is written for an eight-hour day",
  "Zero, since the PEL is read against a TWA of 90 dBA and no period sits above 90 dBA for 8 hours"],
 "The PEL setup's threshold is 90 dBA, so three of the four periods are not integrated, and the 90.800000 dBA period contributes 16.759307 percent, the same figure it gives under the action level. 57.350093 percent is the action-level noise dose with its 80 dBA threshold. The noise dose is never rescaled to eight hours, and a period counts by its own time over its reference duration.")

q(1, "What does the engine return for the Brief and Scala weekly factor at 30.000000 hours a week, and what does it keep beside it?",
 "A factor of 1.000000, with the raw 1.437500 kept beside it",
 ["A factor of 1.437500, since the cap applies to the daily factor alone",
  "A refusal on `weeklyHours`, since a week under 40 hours has no adjustment to make",
  "A factor of 0.781250, the value the engine holds for every week below the 48 hour row"],
 "Judgement J8 caps the factor at 1 and keeps `rawRf`, so a 30.000000 hour week returns 1.000000 with a raw 1.437500 behind it. The cap covers both factors: a 40.000000 hour week gives a raw 1.000000 and needs none. A week is refused only at zero hours or above 168, and 0.781250 is the factor at 48.000000 hours.")

q(1, "`briefScalaAdjustedLimit` is given a limit and neither a shift length nor a weekly total. What does it return?",
 "A refusal on `shiftHours`, in the engine's words: \"give shiftHours, weeklyHours or both\"",
 ["The limit unchanged, since with no schedule the factor falls back to its cap of 1",
  "The limit adjusted for an 8 hour shift and a 40 hour week, the defaults the formula is written from",
  "A refusal on `limit`, since a limit with no schedule is treated as a missing limit"],
 "The door needs at least one schedule and names the field it refuses on, `shiftHours`. It assumes nothing: a default schedule would hide the choice that decides the factor. The cap applies to a factor the formula has produced, and the limit itself was given, so it is not the field refused.")

q(0, "When can the ORACLE ONLY weekly factor move a Brief and Scala adjusted limit?",
 "Only when it is the smaller of the two factors, so that it governs",
 ["Always, since both factors multiply the limit",
  "Only when the week passes 60 hours, the point at which the weekly formula takes over from the daily one",
  "Never, since only the daily factor is applied"],
 "The engine applies the smaller factor and reports which governed. Where the daily factor governs by a clear margin, as in the ESTA example at 0.500000 against 0.562500, the weekly formula only decides which factor is used and never enters the result. It can govern: at 10 hour shifts and 70 hours a week the weekly factor is the smaller. No product is taken and no fixed week switches formulas.")

q(3, "The teaching crew's table holds a noise row, five chemical rows and a heat stress row. Which rows stand on formulas a source prints and the engine reproduces?",
 "The noise row and the chemical rows",
 ["The heat stress row alone, since its one-hour WBGT is arithmetic by definition and so is the equation it is read against",
  "Every row, since each figure in the table is a call the engine makes from inputs the crew's record states",
  "The noise row alone, since Brief and Scala and the mixture index are both oracle only in the golden"],
 "The noise row stands on the Appendix A noise dose, and the chemical rows on the Brief and Scala daily factor and the 1910.1000(d)(2) index, each reproduced against printed values. The heat stress row sets a measured average against the NIOSH heat REL equation, checked for transcription only, so it is a screening argument. The adjusted mixture index composes two published steps, a judgement the report states. Being computed by the engine is not the same as being reproduced from a print, and the daily factor and the index are both published.")

q(2, "`wbgtIndoorC` is given a natural wet bulb of -300 C. What does the engine do?",
 "It refuses on `naturalWetBulbC`: \"naturalWetBulbC is below absolute zero\"",
 ["It returns an index, since the door checks only that each reading is a finite number",
  "It returns an index with a warning, since a reading that cold lies outside the NIOSH figures",
  "It refuses on `globeC`, since the globe is checked against the wet bulb before either is used"],
 "The WBGT doors refuse a temperature that is not finite or that lies below absolute zero, and they name the field. -300 C is below absolute zero, so the natural wet bulb is refused. Short of that the engine judges no plausibility, which is left to the hygienist. The figure range is a range of metabolic rates, and the globe is checked on its own.")

q(0, "On the IGBOMOTORU ten-hour record `chemicalTwa8h` divides by 8 and warns. What does its warning point the hygienist to?",
 "An unusual shift adjustment of the limit, such as Brief and Scala, made as a step of its own",
 ["Averaging over the 10.000000 hours covered, which gives the 33.725000 ppm the regulation intends for long shifts",
  "Dropping the last 2 hours of samples, so that the record fits the 8 hour window the door is written for",
  "A STEL on the loudest two hours, since a long shift is judged on its peak concentration"],
 "The engine's words end: \"consider an unusual shift adjustment of the limit\". The TWA of 42.156250 ppm stands as 1910.1000(d)(1) writes it, dividing by 8, judgement J6, and a longer shift is handled by lowering the LIMIT, which is what this tier's Brief and Scala lessons do. 33.725000 ppm is the average over the hours covered, a different quantity. Dropping samples discards measured chemical exposure, and a STEL is a fifteen-minute average of a concentration.")

q(1, "No heat stress limit is graded in this course. How does the course still teach the RAL and the NIOSH heat REL?",
 "As published, evaluated by the engine, with the section 8.1 status beside every figure",
 ["As band values from Table 5-1, since a band is the published summary of the equation",
  "As worked example values from section 1.1.3, since those are the figures NIOSH prints",
  "It leaves them out, since a figure that cannot be graded cannot be taught either"],
 "What is taught instead is the equations as published, evaluated by the engine, with \"the NIOSH 2016-106 section 8.1 equation, transcription only\" beside every figure. Bands and the worked example are taught as what they are, a summary and a figure reading, and each differs from the equation. Being ungraded removes a figure from the capstone and leaves it in the lessons.")

q(2, "The course teaches judgement calls J2, J5, J6, J7, J8 and J10 by name. Why does no capstone input sit on the boundary of one?",
 "A boundary input would grade a convention the sources leave open, which the engine settled one way",
 ["The engine refuses every input that sits on a judgement boundary, so no capstone could use one",
  "The golden holds no cases at those boundaries, so no key could be checked against a reproduced value",
  "The boundaries are licensed text, and a capstone may carry no licensed figure as one of its inputs"],
 "The course calls J1 to J10 decisions the sources leave open. A learner who reasoned the other way at a threshold, a floor, unity, the cap or the weekly divisor would be marked on the engine's choice. The engine accepts boundary inputs and returns an answer, the golden does carry boundary cases such as index 1.000000, and a judgement boundary is an engine decision with nothing licensed in it.")

q(3, "Why does no graded field in this course carry a verdict word such as exceeds or passes?",
 "The graded fields are numbers, and a verdict is read from a number against a line",
 ["Verdict words are licensed wording from ACGIH, which the course never quotes",
  "The engine returns no verdicts, so there would be nothing to grade a word against",
  "Verdicts are published and reproduced, so grading them would test the source and never the learner"],
 "The course lists any verdict word among the things never graded. A number graded at its precision tests the method; a yes or no would let a wrong number on the right side of a line score the mark. The engine does return flags such as `exceeds`, and lessons show them. Nothing about a verdict word is licensed.")

q(0, "At 10 hour shifts and 50 hours a week the teaching crew's daily factor of 0.700000 governs over a weekly factor of 0.737500. What part does the ORACLE ONLY weekly formula play in the crew's adjusted limits of 140.000000, 70.000000 and 700.000000 ppm?",
 "It only decided which factor applied; none of the three limits contains it",
 ["Each limit is the product of the two factors, so the weekly formula scales all three by 0.737500",
  "It sets the chemical exposure limits for the week, and the daily factor is applied within each day",
  "It governs the acetone limit, since the largest limit is the one the week is expected to constrain"],
 "The engine applies the smaller factor, so each unadjusted limit is multiplied by 0.700000 and nothing else: 200.000000, 100.000000 and 1000.000000 ppm become 140.000000, 70.000000 and 700.000000. The weekly formula enters only the comparison that picks the governing factor. No product is taken, and one schedule gives every substance the same governing factor.")

q(3, "A reviewer wants the teaching crew's toluene figure compared with a glycol unit's BTEX emission. How does this course answer?",
 "A personal air sample and an 8-hour TWA measure a different quantity; BTEX as an emission belongs to Gas Processing",
 ["The two can be compared directly once both are converted to ppm, since BTEX includes toluene",
  "The emission should be read against the toluene limit adjusted by Brief and Scala for the crew's schedule",
  "The comparison belongs to the 5x5 risk matrix, which the Risk, Change and Learning course applies to both"],
 "Section 25 puts BTEX from a glycol unit with the Gas Processing course. A personal air sample read as an 8-hour TWA measures what a worker breathed, and an emission rate measures what left a unit, so the two figures answer different questions even where they share a substance and a unit. The 5x5 matrix ranks hazards and takes no part in this comparison.")

q(1, "What does every one of the golden's 57 refusal cases return?",
 "An `error` and a `field` naming the input refused, with the message in the engine's own words",
 ["A result with every value set to zero and a warning that says which input was out of range",
  "An `error` alone, leaving the caller to find which input caused the refusal",
  "A result computed from a default input, with the refused input reported beside it"],
 "Every function returns a finite result or an object carrying `error` and `field`, the name of the input it refused. The course runs all 57 through the engine and each returns the named field. The engine never substitutes zeros or defaults for a refused input, which would hide the fault inside a number.")

q(2, "Whether a worker is acclimatized is unknown. How should a careful report present the teaching hour's NIOSH heat stress assessment?",
 "Both rows, each with its criterion and the section 8.1 status",
 ["The RAL row alone, since an unknown status must always default to the unacclimatized worker",
  "The NIOSH heat REL row alone, since most crews on site are acclimatized to their work",
  "Neither row, since an assessment cannot be written until acclimatisation has been recorded"],
 "Acclimatisation is a fact about the worker that the engine cannot infer. Where it is unknown, the teaching hour can be assessed both ways and a careful report quotes both, each with the status of the equation behind it, and does not pick the kinder one. Choosing either row silently makes the choice the engine refuses to make. Recording the status for each worker is the fix going forward.")

q(3, "A WBGT record totals 60 minutes and the metabolic record 30 minutes. What does `nioshHeatAssessment` do?",
 "It refuses on `metabolicPeriods`: \"metabolicPeriods total 30 min: the NIOSH limits apply to a 1-hour TWA\"",
 ["It averages the metabolic rate over 30 minutes and assesses the WBGT hour against the resulting limit",
  "It refuses on `wbgtPeriods`, since the two records have to total the same number of minutes",
  "It doubles the 30 minute metabolic record to fill the hour, and warns that the second half was assumed"],
 "Judgement J9 checks each record on its own: both must total 60 minutes. The metabolic record is the short one, so that is the field named. The engine never accepts a shorter window for one input on the strength of the other, never compares totals between records, and never invents minutes.")

q(0, "At which of the four Table 5-1 band rates do the band and the NIOSH heat REL equation sit furthest apart?",
 "349.000000 W, where the band of 28.000000 C sits 0.542492 C above the equation",
 ["233.000000 W, where the band of 30.000000 C sits 0.524593 C above the equation",
  "580.000000 W, where the band of 25.000000 C sits 0.079422 C above the equation",
  "465.000000 W, where the band of 26.000000 C sits 0.024291 C below the equation"],
 "The four band-minus-equation differences are 0.524593, 0.542492, -0.024291 and 0.079422 C, so 349.000000 W is furthest, just ahead of 233.000000 W. The equation values behind them are the NIOSH 2016-106 section 8.1 equation, checked for transcription only. Near the line, that is where the route a report used matters most.")

q(2, "How does the course measure a WBGT weight out of the running engine?",
 "By a unit impulse: one reading at one degree, the others at zero, so the index returned is that weight",
 ["By fitting the weights to the golden's oracle-only cases, then comparing the fit with the page",
  "By reading the weights from the engine's source file and comparing them with the NIOSH page",
  "By passing equal readings to both forms and dividing the two indices returned by each other"],
 "Setting one reading to one degree and the rest to zero leaves only that reading's weight in the sum, so the engine reports 0.700000000000, 0.300000000000 and so on, each set against a literal in the generator. That asks the engine a question whose answer is the constant and nothing else. No fit is involved, source comments are provenance, and equal readings through both forms both return that reading, which gives no weight at all.")

q(1, "Why can the section 1.1.3 worked example not serve as the printed value that would move the section 8.1 equations up to PUBLISHED, REPRODUCED?",
 "It was read off a figure and misses the equation by more than its printed tolerance, so it reproduces nothing",
 ["It states its rate in kcal/h, and a printed value in a unit the engine refuses cannot count as evidence",
  "It is licensed NIOSH text, and a licensed value can never be set against the engine in a golden",
  "It prints only the NIOSH heat REL and no RAL, so it could only ever cover one of the two equations"],
 "The golden records that the example reads 27.8 C off Figure 8-2 and 25 C off Figure 8-1, and the equation gives 27.458939 C and 24.047916 C, the section 8.1 equation, checked for transcription only. Both are outside tolerance, so they are pinned as errata, and no public printed value reproduces the constants at all. The golden carries the rate as 348.9 W, NIOSH text is public, and the example prints both limits.")

q(0, "What does `oshaActionLevelForShiftDbA` need, and what does it not know?",
 "Only the shift hours; it knows nothing of the sound levels in the record",
 ["The shift hours and the periods of the record, so that it can scale the action level to the shift's noise dose",
  "The shift hours and a criterion preset",
  "The shift hours and the weekly hours"],
 "The closed form's only input is the shift length, so the door answers a question about the schedule. The noise dose over the actual record comes from `noiseDose` on the action-level criterion. The PEL is never reduced, so the door serves the action level alone, and the daily and weekly factors are Brief and Scala's, for chemical limits.")

q(1, "What does `metabolicRateTwaW` take, and what constant is there in it?",
 "Periods of watts and minutes, with no constant in it but the length of the window it averages",
 ["Periods of watts and minutes, and the acclimatisation of the worker the rates belong to",
  "Periods in watts or in kcal/h, which the door converts to watts before it averages them",
  "Periods of watts and minutes, with the 116 to 580 W range enforced on each period it is given"],
 "The door takes periods of watts and minutes and returns their time weighted average, which is why the course classes it ARITHMETIC BY DEFINITION: a time weighted average whose only constant is the length of its window. Acclimatisation is an input of the assessment door. The engine takes no kcal/h input, in watts only, and the 116 to 580 W figure range is a range for the equation's rate and warns rather than binds.")

q(2, "A hygienist wants to compare a short peak concentration with a chemical ceiling. What does the engine offer?",
 "No door: chemical ceiling comparisons are among the things it does not provide",
 ["The STEL door, for a peak under 15 minutes",
  "The 8-hour door's limit table",
  "The mixture door, which reads a single component against its ceiling as a one-term index"],
 "The course lists chemical ceiling comparisons among the doors the engine does not have, together with ISO 9612 uncertainty budgets and ISO 7243 adjustments. The STEL is a fifteen-minute average, the 8-hour door carries no limit table, and a one-term mixture index is a ratio to whatever limit is typed, which is not a ceiling comparison.")

q(3, "Why does this course always write heat stress for its subject, never the bare word?",
 "Other courses use the bare word for a thermal duty and for flare radiation",
 ["The bare word is licensed ISO 7243 wording",
  "The engine's doors all carry heat stress in their names, and the course follows the code",
  "Heat stress is the term the NIOSH worked example uses for the section 8.1 equations"],
 "The course's vocabulary rules legislate the collision: the bare word already means a thermal duty in one course and flare radiation in the Separation and Relief courses, so this course writes heat stress. The rule is about collisions between courses in one academy. The door names are `wbgtIndoorC`, `nioshHeatAssessment` and the like, and the worked example is an erratum with nothing to say about vocabulary.")

q(1, "`oshaActionLevelForShiftDbA` holds 6 published cases and 0 oracle-only ones. Why can the extended-shift action level be graded?",
 "It is PUBLISHED, REPRODUCED: its printed Table IV-3 rows are reproduced to their decimal with 16.61",
 ["It is ARITHMETIC BY DEFINITION, since its only constant is the length of the shift it is given",
  "It is ORACLE ONLY, and the absence of any printed row means nothing can contradict the key",
  "It is TRANSCRIPTION ONLY, but the capstone states the coefficient so no copying is involved"],
 "Table IV-3 prints the rows at 8, 9, 10, 12 and 16 hours and the engine reproduces them at the printed decimal. The coefficient is fixed by the mandatory Appendix A text, recorded as a decision because a one-decimal table cannot prove it. The closed form holds 16.61, 50 and 12.5, so it is no average over a window, and a door with printed cases is not oracle only.")

q(0, "What published case stands behind `briefScalaAdjustedLimit`?",
 "The ESTA 12-hour example: a limit of 10.000000 adjusts to 5.000000, the daily factor governing",
 ["The BC regulation's weekly factors at 48.000000 and 60.000000 hours, which the door reproduces exactly",
  "The 1910.1000(d)(2) worked example, since an adjusted limit is part of a mixture index",
  "None: the door is ORACLE ONLY, since the weekly factor enters every adjusted limit"],
 "The golden holds 1 published case and 1 oracle-only case for the door: the ESTA example at 12.000000 hour shifts and 60.000000 hours a week, which the engine reproduces with the daily 0.500000 governing. The BC regulation prints DAILY factors. The mixture example is the index door's case. The weekly factor enters an adjusted limit only when it governs.")

q(2, "Which three doors does the golden class ARITHMETIC BY DEFINITION?",
 "`wbgtTwaC`, `metabolicRateTwaW` and `chemicalStel15Min`",
 ["`wbgtTwaC`, `metabolicRateTwaW` and `chemicalTwa8h`, the three time weighted chemical and heat stress averages",
  "`wbgtIndoorC`, `wbgtOutdoorC` and `wbgtTwaC`, since every WBGT door is a weighted sum of stated readings",
  "`metabolicRateTwaW`, `lexWeeklyDbA` and `chemicalStel15Min`, the three averages over a fixed window"],
 "The course gives the class to the two one-hour averages and the STEL, whose only constant is the window. `chemicalTwa8h` is PUBLISHED, REPRODUCED on the 1910.1000(d)(1) worked example. The WBGT forms are TRANSCRIPTION ONLY because their weights were copied. `lexWeeklyDbA` is PUBLISHED, REPRODUCED on one case with an oracle-only divisor.")

q(3, "The course measures the NIOSH earmuff derating as 0.750000000000 against a literal typed in the generator. Why does the NIOSH derating by type stay ORACLE ONLY?",
 "The measurement ties the engine to a third copy; no printed value sets the method against a source",
 ["The earmuff derating applies to C-weighted data only, which no printed OSHA or NIOSH example uses",
  "The measurement differs from the literal in its last digit, so the class cannot move until the two agree",
  "The derating by type is licensed NIOSH text, so the course may measure it but never cite a printed case"],
 "A constant measured out of the engine and set against a generator literal is a pin against quiet change, and every copy may still share a reading. A class moves up only when a value a source prints is reproduced, and none is known for the NIOSH method, which is why it is never graded. The measured value matches the literal with a relative difference of 0, the method takes C- and A-weighted data alike, and NIOSH text is public.")

q(0, "If the three solvents of the teaching mixture were known to potentiate each other, how should its index of 1.059500 be read?",
 "As understating the hazard, since the additive sum assumes no interaction",
 ["As overstating it, since interacting solvents share one target and should be counted once",
  "As meaning nothing, since each solvent is then read against its own limit",
  "As exact, since the 1910.1000(d)(2) index already includes interaction terms"],
 "Potentiation means one solvent strengthens another's effect, so adding plain ratios counts less than the crew actually carries: 1.059500 is a lower bound on the hazard in that case. Counting once belongs to no rule in 1910.1000(d)(2). Reading each solvent alone is the case of solvents with unrelated effects. The regulation's sum carries no interaction term, and a hygienist who suspects potentiation says so beside the figure.")

q(1, "A report says a crew is over the action value at 85 dBA and cites 29 CFR 1910.95. What is wrong?",
 "It mixes two metrics: the OSHA action level is a TWA of 85 dBA or a 50 percent noise dose, and EU action values are LEX,8h levels",
 ["Nothing, since the OSHA action level and the EU upper exposure action value are both 85 dBA and so they agree",
  "The citation should be 1910.1000, since action values belong to the chemical rules in 29 CFR",
  "The EU action value is 87 dBA, so the report has quoted the OSHA level under the EU name"],
 "By the course's vocabulary rules, the action level is the OSHA hearing-conservation trigger, and the EU action values, lower 80 and upper 85 dBA, are LEX,8h levels, a different metric from a TWA on a 5 dB decibel exchange rate. Sharing the number 85 does not make them the same line. 87 dBA is the EU exposure limit value, and 1910.1000 is the chemical rule.")

emit(Q, '/root/hse-wip-hygiene/banks/h2a_exam.json', expect_n=42)
finish()
