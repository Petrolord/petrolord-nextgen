import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H2 Expert m02, Metabolic Rate and the NIOSH Limits.
# Figures from digest Section 17 (the teaching hour, the RAL and NIOSH heat REL
# equations, the figure range, the assessment both ways, the sixty-minute rule),
# Section 3 (the measured constants), Section 8 (judgement J3) and Section 24.
# Every RAL, NIOSH heat REL or margin figure is quoted with the section 8.1
# label and none is keyed as something to compute.

q(1, "A worker's hour is 380.000000 W for 40.000000 minutes and 140.000000 W for 20.000000 minutes. What does `metabolicRateTwaW` return?",
 "300.000000 W, the minutes-weighted mean of the two rates over the whole hour",
 ["The two rates added and halved, one per period",
  "380.000000 W, the working rate, because the NIOSH limits are written for the hardest work in the hour",
  "348.9 W, the rate the golden carries for the NIOSH worked example, since the door converts to that basis"],
 "The door is a time weighted average: 380.000000 times 40.000000 plus 140.000000 times 20.000000, over 60.000000 minutes, is 300.000000 W. Halving the two rates weights a twenty-minute period like a forty-minute one. NIOSH writes its limits against the one-hour average of work and rest, which is why the door exists. 348.9 W belongs to the section 1.1.3 example and plays no part in this hour.")

q(3, "The NIOSH worked example states its work rate as 300 kcal/h. A learner types 300 into the engine as the metabolic rate. What happens?",
 "The engine takes it as 300 W without complaint, since it accepts watts only and 300 is a plausible rate",
 ["The engine reads the figure as kcal/h and converts it to 348.9 W before it evaluates either equation",
  "The engine refuses on `metabolicRateW`, because a rate typed in kcal/h fails the check for a watts value",
  "The engine warns that 300 lies outside the 116 to 580 W range the NIOSH figures plot"],
 "The engine has no kcal/h input and no way to know which unit a number was read in, so both are plausible positive rates and nothing catches the slip. The golden carries the example's rate as 348.9 W, and the learner has to convert before typing. There is no conversion step inside the engine, and 300 W sits inside the 116 to 580 W figure range, so no warning fires either.")

q(0, "A metabolic record's first period is typed as 0 W. What does `metabolicRateTwaW` do?",
 "It refuses on `periods[0].metabolicRateW` in its own words: \"periods[0].metabolicRateW must be above zero watts\"",
 ["It averages the period in as a rest at zero watts, which lowers the rate for the hour that it returns",
  "It refuses on `metabolicPeriods`, since the NIOSH limits apply to an hour of work at a positive rate",
  "It returns the average with a warning, because 0 W lies below the 116 W bottom of the figure range"],
 "A body at work always has a rate above zero, so a zero rate means a missing entry and the engine names the period that carries it. Treating it as rest would hide the gap inside the average. `metabolicPeriods` is the field the assessment door refuses on when the record is not an hour. The figure range warning belongs to the assessment of the average and never to an input period.")

q(2, "Which pairing of NIOSH 2016-106 section 8.1 equation and worker is the one the document prints?",
 "The RAL, 59.9 less 14.1 log10 M, for unacclimatized workers; the NIOSH heat REL, 56.7 less 11.5 log10 M, for acclimatized workers",
 ["The RAL, 59.9 less 14.1 log10 M, for acclimatized workers; the NIOSH heat REL, 56.7 less 11.5 log10 M, for unacclimatized workers",
  "The RAL, 56.7 less 11.5 log10 M, for unacclimatized workers; the NIOSH heat REL, 59.9 less 14.1 log10 M, for acclimatized workers",
  "Both equations for every worker, the RAL for a one-hour average and the NIOSH heat REL for a full shift of work"],
 "NIOSH 2016-106 section 8.1 prints the RAL, for unacclimatized workers, as 59.9 minus 14.1 log10 M and the NIOSH heat REL, for acclimatized workers, as 56.7 minus 11.5 log10 M, M being the one-hour time weighted metabolic rate in watts. All four constants are the section 8.1 equation, checked for transcription only. Both equations take the same one-hour average, and the choice between them is the worker's acclimatisation.")

q(0, "Between 150.000000 W and 500.000000 W the NIOSH heat REL minus RAL gap grows from 2.457837 C to 3.817322 C, every figure the NIOSH 2016-106 section 8.1 equation, checked for transcription only. Why does it grow?",
 "The RAL falls 14.1 C per decade of M against 11.5 for the NIOSH heat REL, so it drops away faster",
 ["The RAL starts from the larger intercept, 59.9 against 56.7, and the intercept gap widens with the rate",
  "The engine extrapolates both curves above 116 W, and extrapolation spreads them further apart",
  "The NIOSH heat REL rises with M, since acclimatized workers tolerate more heat stress as the work gets harder"],
 "Both limits fall as M rises, and the difference of the two equations grows with log10 M by the difference in slopes, 14.1 less 11.5. The intercept gap is fixed; on its own it would give the same difference at every rate. 116 W is the bottom of the figure range and no extrapolation happens inside it. Neither limit rises with the work rate.")

q(1, "A report cites a NIOSH recommended exposure limit and does not say which hazard it means. Why is that a defect?",
 "The NIOSH noise REL is an 85 dBA criterion for a noise dose, the NIOSH heat REL a WBGT limit for an hour",
 ["The two limits differ only in their averaging window, so the reader has to be told whether it is hours or minutes",
  "NIOSH publishes one recommended exposure limit, and a report citing it has to add the edition year to be clear",
  "The NIOSH recommended exposure limit applies only to acclimatized workers, so the report must name the crew"],
 "The course's vocabulary rules legislate the two names because the acronym is shared by two unrelated limits: one reads a noise dose against an 85 dBA, 3 dB criterion, the other reads a one-hour WBGT against the section 8.1 equation. They share three letters and nothing else. They are two limits, so no edition year settles which, and acclimatisation only selects between the RAL and the NIOSH heat REL.")

q(3, "The course measures the RAL at 1 W as 59.900000000000 and the RAL at 1 W less the RAL at 10 W as 14.100000000000. Why do those two calls return the intercept and the slope?",
 "log10 of 1 is zero, leaving the intercept alone, and log10 of 10 is one, so the difference is the slope",
 ["1 W is the bottom of the NIOSH figure range, where the plotted curve meets the axis at its intercept",
  "The engine stores both constants as a table and returns them unchanged whenever the rate is 1 W or 10 W",
  "The engine differentiates the equation at 1 W and reports that local slope as the drop per decade"],
 "At M of 1 W the term 14.1 log10 M vanishes and 59.9 is what remains; moving to 10 W adds one to log10 M, so the drop is exactly the slope. The equation is linear in log10 M, so a decade is the natural step, and no derivative is taken anywhere. The figure range starts at 116 W, and the engine evaluates the equation at every rate without special cases. The measurement shows the engine holds what the generator holds; it cannot reach the page.")

q(2, "Why does `nioshHeatAssessment` refuse the word yes typed for acclimatized, instead of settling on a default?",
 "Acclimatisation is a fact about the worker that no record carries, and a default would hide the choice",
 ["The engine infers acclimatisation from the metabolic record, so a typed word would overrule a better input",
  "A default of acclimatized is already built in, and the refusal only fires when the input disagrees with it",
  "The word is accepted for the NIOSH heat REL and refused for the RAL, since only the RAL needs the field set"],
 "The engine demands a boolean and refuses anything else on `acclimatized`, in its own words: \"acclimatized must be true (REL) or false (RAL)\". Nothing in a WBGT or metabolic record says whether a body has adapted, and the choice moves the limit by the whole gap between the two equations, so a silent default would carry the most consequential decision in the assessment. The engine infers nothing and holds no default, and the rule is the same whichever limit applies.")

q(1, "The engine's `exceeds` flag reads true on both rows of the teaching hour, assessed acclimatized and unacclimatized. How does this course treat that flag?",
 "As a verdict word shown so a learner sees what the engine returns, and never graded",
 ["As the graded answer for the hour, since a flag is a yes or no that needs no tolerance at all",
  "As a published result, since both limits behind it are reproduced from printed NIOSH values",
  "As a figure to report without its status, since the flag carries the margin's sign and nothing else"],
 "The course removes every verdict word from grading, and the flag is also built on the section 8.1 equation, checked for transcription only, which no printed value reproduces. The graded heat stress fields are the two one-hour averages. A flag reported with the limit behind it still carries that limit's transcription-only status.")

q(0, "On the teaching hour, which choice moves the assessment further: acclimatized or not, or a time weighted WBGT against a plain mean?",
 "Acclimatisation, since the gap between the two limits at 300.000000 W exceeds the averaging gap",
 ["The averaging, since the plain mean moves the WBGT by more than the two NIOSH limits differ",
  "Neither, since the RAL and the NIOSH heat REL coincide at 300.000000 W on the teaching hour",
  "The averaging, because acclimatisation changes only the equation's label and leaves its value alone"],
 "At 300.000000 W the NIOSH heat REL minus RAL gap is 3.240515 C, the section 8.1 equation, checked for transcription only, while the teaching hour's time weighted WBGT of 29.066667 C and its plain mean of 28.200000 C are under a degree apart. So the criterion moves the answer more than the averaging does. The two limits differ at every rate, and each has its own constants.")

q(2, "At 600.000000 W, what does the engine do with the section 8.1 equations?",
 "It evaluates them and warns: \"600 W lies outside the 116 to 580 W range the NIOSH figures plot: the equation is extrapolated\"",
 ["It refuses on `metabolicRateW`, since the equations are published only for rates the NIOSH figures plot",
  "It clamps the rate to 580 W and evaluates the equations there, reporting the clamp as a warning",
  "It returns the Table 5-1 band value for the heaviest work, because the curve stops at the figure's edge"],
 "Judgement J9 warns outside 116 to 580 W and still evaluates, so the report keeps the number and the reader keeps the caution. Refusing would leave heavy work, the case that most needs assessing, with nothing. The engine never moves an input, and a band summary is a different number from the equation at almost every rate.")

q(3, "A report quotes the NIOSH heat REL equation at 600.000000 W as 24.751261 C. Which status does that figure carry?",
 "Both: the section 8.1 equation checked for transcription only, and extrapolated beyond the NIOSH figures",
 ["Extrapolated only, since the transcription status covers the rates inside the 116 to 580 W range",
  "Transcription only, since the extrapolation warning is internal to the engine and stays out of reports",
  "Neither, since the equation is defined for every rate and the engine returns a finite value at 600 W"],
 "The first label is true at every rate: the constants were copied, twice, from one page. The second is true only outside the figure range, where the equation returns a number the figures never drew. A figure at 600.000000 W carries both. The warning is kept in the result precisely so it travels with the number.")

q(0, "Warning outside the figure range and still evaluating follows the same pattern as one Associate-tier judgement call for sound levels. Which one?",
 "J3: above 130 dBA, above 115 dBA and above the NIOSH ceiling the result warns and still integrates",
 ["J4: noise periods totalling over 24 hours are refused on `periods`, because a daily noise dose stops at a day",
  "J2: the threshold is inclusive, so a period sitting exactly on 80 dBA is integrated under the action level",
  "J7: a mixture index of exactly 1 passes, since the regulation says the index shall not exceed unity"],
 "Both J3 and the figure range warning report what the formula gives and tell the reader that the source stops there. J4 refuses outright, the opposite choice. J2 settles which periods count, and J7 settles a boundary of the mixture index, which is a chemical question.")

q(1, "The assessment door refuses a 75 minute metabolic record in the engine's words: \"metabolicPeriods total 75 min: the NIOSH limits apply to a 1-hour TWA\". Why refuse it instead of averaging it?",
 "A longer average smooths a hot hour with a cooler quarter, so it reads below the worst hour inside it",
 ["The engine can hold at most 60 periods in a metabolic record, and a longer record overflows the count",
  "A record over an hour counts the work twice, since each quarter overlaps the next in a rolling average",
  "The NIOSH limits are written for a fifteen-minute window, and 75 minutes is five of those windows"],
 "NIOSH writes its limits for one hour, and the worst hour is the one they are about. An average over 75 minutes dilutes it, so the hygienist chooses which sixty minutes to assess and says so. The engine counts minutes, whatever the number of periods, and it averages no rolling windows. The fifteen-minute window is the chemical STEL.")

q(2, "The chemical STEL counts the missing minutes of a short record as zero and warns. Why does the heat stress assessment refuse a 45 minute WBGT record instead?",
 "A zero concentration is a real reading of clean air; a WBGT of zero degrees says nothing about a missing quarter hour",
 ["The STEL refuses short records as well, and both doors refuse any window that is shorter than their own",
  "A WBGT of zero would put the average below absolute zero, which the WBGT doors already refuse on their inputs",
  "The heat stress assessment needs a whole number of quarter hours, and 45 minutes is only three of them"],
 "Filling missing minutes with zero is a defensible guess for a concentration, because clean air has none; for a WBGT it is an arbitrary temperature, and filling with the average is a guess too. So the assessment door refuses on `wbgtPeriods`. The STEL warns on a short record and refuses only a long one. A zero-degree reading is well above absolute zero, and the rule is simply 60 minutes.")

emit(Q, '/root/hse-wip-hygiene/banks/h2a_m02.json', expect_n=15)
finish()
