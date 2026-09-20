import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H2 Professional final exam, 42 questions over m01 to m06.
# Figures from digest Sections 11 to 15 with Sections 3, 10, 23, 24 and 25, and
# Associate recaps from Sections 4, 6 and 7. ORACLE ONLY items (NIOSH derating
# by type, dual protection, the weekly divisor on a week that is not five days)
# are asked about as such and never keyed as a figure to compute. No capstone
# site, input or answer appears.

# 1
q(3, "How many noise exposure points does the engine report for the whole Figure 26 day?",
 "144.987371 points",
 ["146.115723 points", "93.750000 points", "166.258750 points"],
 "The three task points, 19.764235, 31.473135 and 93.750000, belong to one day whose total the engine reports as 144.987371, printed by the source as 145. 146.115723 points is the EVWRENI eight-hour day and 166.258750 its long day; 93.750000 is the 95 dBA task on its own.")

# 2
q(1, "The EVWRENI crew's 10.500000 hour day is run through `lexEightHourDbA`. What points total does the engine report?",
 "166.258750 points",
 ["146.115723 points", "125.000000 points", "144.987371 points"],
 "More hours at the same sound levels add energy over the same fixed 8 hours, so the long day carries 166.258750 points, which restates its LEX,8h of 87.207845 dBA. 146.115723 points is the same crew's eight-hour day, 125.000000 points is ten hours at 85 dBA, and 144.987371 points is Figure 26.")

# 3
q(0, "A survey sheet lists 86.026852 dBA in the LEX,8h column for the EVWRENI long day. What has the surveyor done?",
 "Averaged the day's energy over the 10.500000 hours worked, which is the LAeq and hides the extra hours.",
 ["Nothing wrong: the engine prints 86.026852 dBA as the long day's LEX,8h.",
  "Applied the weekly divisor of 5 to a single day by mistake.",
  "Left out the quietest task, which lowered the day's energy."],
 "LEX,8h divides by a fixed 8 hours, so the long day's figure is 87.207845 dBA; dividing the same energy by its own hours gives 86.026852 dBA, the equivalent continuous level over the day. No weekly divisor is involved, and dropping a quiet task would barely move either figure.")

# 4
q(2, "In Figure 26, what task LEX does the engine give the 95 dBA task that lasts 45 min?",
 "84.719713 dBA",
 ["77.958800 dBA", "86.613302 dBA", "79.979400 dBA"],
 "A task LEX is the task's own energy term over 8 hours in decibels: three quarters of an hour at 95 dBA is 84.719713 dBA. 77.958800 dBA is the 80 dBA task and 79.979400 dBA the 86 dBA task; 86.613302 dBA is the whole day.")

# 5
q(0, "The EVWRENI eight-hour day's task 3 is 95.400000 dBA for 0.600000 h and carries 82.235865 of the day's 146.115723 points. What does that tell a supervisor?",
 "That one short task carries more than half the day, so it is the one to change first.",
 ["That the task should be dropped from the sheet, because it lasts under an hour.",
  "That the day's total is wrong, since no task under an hour can carry half the points.",
  "That the other three tasks together decide the day, since they take up most of its 8 hours."],
 "Points are energy, and a short loud task carries far more energy than its hours suggest, so the 95.400000 dBA task holds more than half the total. Its duration does not remove it, the total is the engine's own, and hours alone do not decide a share of the energy.")

# 6
q(1, "A points total of 320.000000 is converted with `lexFromExposurePointsDbA`. What LEX,8h results?",
 "90.051500 dBA",
 ["88.010300 dBA", "91.989700 dBA", "95.000000 dBA"],
 "The conversion is 85 plus ten times the base-ten logarithm of the points over 100, and for 320 that lands at 90.051500 dBA. The three wrong levels are real rows of the points table read at the wrong total: 200 points for 88.010300, 500 for 91.989700 and 1000 for 95.000000 dBA.")

# 7
q(0, "In noise exposure points, where does the EU lower action value of 80.000000 dBA sit?",
 "31.622777 points",
 ["50.000000 points", "25.000000 points", "10.000000 points"],
 "Eight hours at 80 dBA is 31.622777 points, the points figure that restates LEX,8h 80.000000 dBA. 50.000000 points is 81.989700 dBA, 25.000000 points is 78.979400 dBA and 10.000000 points is 75.000000 dBA.")

# 8
q(3, "A spreadsheet averages the five daily LEX,8h values 86.400000, 83.100000, 88.200000, 84.900000 and 81.700000 dBA and reports 84.860000 dBA as the week. What should it report?",
 "85.461288 dBA, the energy average over five days",
 ["84.860000 dBA, since the plain mean is the regulation's weekly level",
  "88.200000 dBA, since the loudest day sets the week",
  "83.414860 dBA, the week once the loud day is discounted"],
 "The weekly noise exposure level energy-averages the days over a fixed five, which lets the loud days weigh what their energy earns: 85.461288 dBA. The plain mean treats every day as one fifth. The loudest day is not the week, and discounting a day that was worked has no basis in the formula.")

# 9
q(2, "Four days of 89.500000, 87.100000, 90.200000 and 86.300000 dBA give a weekly level of 87.600937 dBA, below their arithmetic mean of 88.275000 dBA. How should that result be reported?",
 "As the statutory formula's result on a four-day week, whose divisor of 5 is oracle only.",
 ["As a published and reproduced value, since Figure 26 fixes the weekly formula along with the daily one.",
  "As an error, since an energy average of the same days can never fall below their arithmetic mean.",
  "As the mean of the four days, since the engine divides a four-day week by 4."],
 "J10 divides every week by 5, so four days of energy over a nominal five-day week reads below the days' own mean. On a week that is not five days no printed case is known, so the divisor is ORACLE ONLY and the figure should be reported as arithmetic defended from the written formula. Figure 26 fixes only the daily energy averaging, and the engine never divides by 4.")

# 10
q(1, "A task runs at 100.000000 dBA. After how many hours on its own has it used the whole allowance up to the EU lower action value?",
 "0.080000 h",
 ["0.252982 h", "2.000000 h", "0.400950 h"],
 "Eight hours times ten to the power (80 - 100)/10 is 0.080000 h, under five minutes. 0.252982 h and 0.400950 h aim at 85 and 87 instead of the lower action value. 2.000000 h is what the Associate tier's OSHA criterion allows at 100 dBA for a full noise dose, a different metric with a different decibel exchange rate.")

# 11
q(3, "A 97.000000 dBA task is the only noise on a shift. After how long does the day reach LEX,8h 87?",
 "0.800000 h",
 ["0.504766 h", "3.031433 h", "0.159621 h"],
 "At 97 dBA the hours to 87 are 8 x 10^(-1), 0.800000 h. 0.504766 h is the time to 85 and 0.159621 h the time to 80; 3.031433 h is the OSHA reference duration at 97 dBA, a different criterion on a different relation.")

# 12
q(0, "The OSHA Technical Manual example, 98 dBA and an NRR of 25, gives two estimates. Which one belongs in a decision on engineering controls?",
 "89.000000 dBA, from the field derating",
 ["80.000000 dBA, from Appendix B", "the lower of the two, whichever method gave it", "the mean of the two estimates"],
 "The manual halves the credit when the question is whether protectors may replace reducing the sound at source, so the engineering controls decision uses the field derating's 89.000000 dBA. Appendix B's 80.000000 dBA answers the hearing conservation question. Taking the lower figure picks the generous rule, and a mean of two methods is no method.")

# 13
q(2, "Move the teaching protector's label up to 30.000000 dB. Under `OSHA_FIELD_50`, what level is left on 97.600000 dBA?",
 "86.100000 dBA",
 ["74.600000 dBA", "69.600000 dBA", "82.100000 dBA"],
 "The field derating takes half of (30 - 7) off the level: 86.100000 dBA. 74.600000 dBA is Appendix B at the same label, the full (NRR - 7); 69.600000 dBA adds the dual 5 on top; 82.100000 dBA is the NIOSH earmuff row of the sweep, a different method.")

# 14
q(3, "In the NRR sweep, read the row for a 10.000000 dB label. Which level sits in the Appendix B column?",
 "94.600000 dBA",
 ["96.100000 dBA", "84.600000 dBA", "97.600000 dBA"],
 "Appendix B takes (10 - 7) off the A-weighted level: 94.600000 dBA. 96.100000 dBA halves that credit, which is the field derating; 84.600000 dBA is Appendix B read on the 20.000000 dB row; 97.600000 dBA would mean no credit at all, which is what a label of 7 or less gets.")

# 15
q(2, "On the teaching case an NRR of exactly 7.000000 dB is entered under Appendix B. What does the engine return?",
 "97.600000 dBA, a credit of zero with no warning",
 ["92.600000 dBA, the dual-protection row", "97.600000 dBA, with a warning that the credit was floored", "a refusal, since the label is too small"],
 "NRR - 7 is exactly zero, so the estimate equals the level and nothing needs flooring; the floor and its warning apply only when the rule would give a negative attenuation, as an NRR of 5 does. 92.600000 dBA is the dual-protection figure at 7, and a label of zero or more is accepted.")

# 16
q(1, "Which two hearing protector methods does this course class as published and reproduced?",
 "Appendix B and the field derating, whose printed 80.000000 and 89.000000 dBA the engine matches",
 ["The NIOSH derating by type and the dual-protection rule, through the NIOSH criteria document and its tables",
  "Appendix B and the dual-protection rule, both of which subtract 7",
  "All four, since the engine reproduces each of them from its own source"],
 "The manual's example prints 89.000000 dBA under the field derating and 80.000000 dBA under Appendix B, and the engine reproduces both. The NIOSH derating by type and the dual-protection 5 dB agree between engine and oracle with no printed value to catch a shared misreading, so they are ORACLE ONLY.")

# 17
q(3, "A report states: \"NIOSH earmuff estimate 84.350000 dBA, reproduced from NIOSH's printed tables.\" What is wrong with it?",
 "The NIOSH derating by type is oracle only; no printed value is known to set against it, so nothing was reproduced.",
 ["The figure is wrong: the earmuff estimate on the teaching case is 77.600000 dBA.",
  "Nothing, because every protector method in the engine is reproduced against a printed table.",
  "The earmuff factor is licensed, so the figure may not appear in a report."],
 "The engine's earmuff figure on the teaching case is 84.350000 dBA, but it is arithmetic on factors the engine and an independent oracle agree on, with no printed value behind it. The claim of reproduction is what is false. 77.600000 dBA is Appendix B, only two methods are reproduced, and the factors are not licensed.")

# 18
q(0, "The ten-hour IGBOMOTORU record reads 42.156250 ppm as an 8-hour TWA and 33.725000 ppm over the hours worked. Why is the TWA the higher?",
 "The whole ten-hour sum is divided by 8, so the longer shift is charged as a larger chemical exposure.",
 ["The engine adds a penalty of two hours for every shift longer than eight.",
  "The TWA uses the peak sample for the extra hours beyond the eighth.",
  "The engine applies a Brief and Scala factor to the ten-hour record."],
 "1910.1000(d)(1) divides the sum of concentration x time by 8 whatever the shift, so ten hours of chemical exposure over 8 hours reads above the average over the hours worked. There is no penalty term and no peak substitution, and adjusting a limit for an unusual shift is Expert tier material the 8-hour TWA does not apply.")

# 19
q(1, "Which expression is the 8-hour TWA that 29 CFR 1910.1000(d)(1) writes?",
 "E = (C_a T_a + C_b T_b + ... + C_n T_n) / 8",
 ["E = (C_a T_a + C_b T_b + ... + C_n T_n) / (T_a + T_b + ... + T_n)",
  "E = (C_a + C_b + ... + C_n) / n",
  "E = 10 log10( sum( T_i / 8 x 10^(C_i/10) ) )"],
 "The regulation divides the concentration-hours by 8. Dividing by the hours covered is the average over the sampled time, which differs whenever a record is not 8 hours; the plain mean ignores time; and the logarithmic form is the LEX,8h energy average, which has no place in a chemical average.")

# 20
q(3, "A hygienist knows the worker on the IGBOMOTORU partial record left the area for the unsampled time. Which figure may they accept?",
 "30.125000 ppm, the 8-hour TWA with the unsampled time counted as zero",
 ["35.703704 ppm, the average over the 6.750000 hours the samples actually covered", "32.468750 ppm, the full-shift figure, since the fourth sample settles the question", "42.156250 ppm, the ten-hour figure, since the worker's longer shift must be charged"],
 "If the unsampled time was known to be clean, the regulation's divide-by-8 figure, 30.125000 ppm, states the truth, and the report should still give the 6.750000 hours covered. 35.703704 ppm assumes the missing time looked like the sampled time; 32.468750 and 42.156250 ppm belong to other records.")

# 21
q(0, "The eleven-minute STEL record returns 92.333333 ppm with a warning. What does that warning oblige the report to state?",
 "The minutes covered, since the rest of the window was counted as zero chemical exposure.",
 ["The peak concentration, since the warning flags a sample above the short-term limit.",
  "An unusual shift adjustment of the limit, which the warning recommends for short records.",
  "Nothing, since a warning is informational and changes no figure the engine reports."],
 "The engine's warning is \"the periods cover 11 min of 15: the remainder counts as zero exposure\", so the figure rests on an assumption about four unsampled minutes and the report must say how much of the window was measured. The warning says nothing about a peak, the shift adjustment belongs to the ten-hour TWA warning, and a warning is part of the result.")

# 22
q(2, "The full STEL window holds a five-minute peak of 240.000000 ppm inside a STEL of 153.333333 ppm. Why is the STEL reported beside the 8-hour TWA?",
 "A substance can harm in minutes at a concentration that the eight-hour average dilutes away.",
 ["It restates the 8-hour TWA for a fifteen-minute shift, so the two must always agree.",
  "Because the STEL corrects the 8-hour TWA for the unsampled time that a partial shift record leaves out.",
  "The STEL is always the larger figure and so decides compliance on its own."],
 "Averaged into a shift, five minutes at 240.000000 ppm would barely register; the fifteen-minute window keeps them visible, and each average is compared with its own limit. The STEL is not a restated TWA, corrects nothing, and is compared with a short-term limit, so its size alone decides nothing.")

# 23
q(1, "Why does the chemical TWA accept a ten-hour record with a warning while the STEL refuses a sixteen-minute one?",
 "The TWA's 8 is a normaliser the regulation writes for any shift; the STEL's 15 is the definition of its window.",
 ["Ten hours still fits inside a day, while sixteen minutes breaks the STEL's limit value.",
  "The TWA is published and reproduced, while the STEL is oracle only and so is handled more strictly.",
  "The engine refuses only records whose extra time is under an hour, which it treats as a typing slip."],
 "1910.1000(d)(1) divides by 8 whatever the shift, so a longer record is still inside the rule and is warned. A STEL is sum(C t) over fifteen minutes by definition, and sixteen minutes of samples has no rule for fitting it in, so J6 refuses. A record's length says nothing about a limit value, the STEL is arithmetic by definition, and the engine has no typing-slip rule.")

# 24
q(1, "In the published (d)(2) example, what term does 45.000000 against a limit of 200.000000 give?",
 "0.225000",
 ["0.200000", "0.500000", "0.925000"],
 "45.000000 over 200.000000 is 0.225000. 0.200000 is the term for 40.000000 against the same limit, 0.500000 the term for 500.000000 against 1000.000000, and 0.925000 the index of all three.")

# 25
q(2, "Ranked by their terms, how do the components of the teaching mixture stand?",
 "Acetone 0.385000, toluene 0.362500, xylene 0.312000",
 ["Acetone 0.385000, xylene 0.312000, toluene 0.362500", "Toluene 0.362500, acetone 0.385000, xylene 0.312000", "Xylene 0.312000, toluene 0.362500, acetone 0.385000"],
 "Acetone at 385.000000 ppm over 1000.000000 is 0.385000, toluene at 72.500000 over 200.000000 is 0.362500, and xylene at 31.200000 over 100.000000 is 0.312000, so acetone leads and xylene is last. The other orderings misplace terms that sit close together, which is why no single component explains the excess.")

# 26
q(0, "The golden's over-unity mixture gives an index of 1.100000. Beside the 1.000000 case, what does the pair show about J7?",
 "Exceeds is true only when the index is strictly above 1, so 1.100000 exceeds and 1.000000 does not.",
 ["Both exceed, since the regulation treats reaching unity as exceeding it.",
  "Neither exceeds, since the engine rounds an index to one decimal before comparing.",
  "Only 1.000000 exceeds, since the engine reads unity as the limit itself."],
 "The regulation says the index \"shall not exceed unity\", and J7 reads that as written: an index of exactly 1 passes and 1.100000 is over. The engine does not round an index before comparing, and it does not treat equality as exceeding.")

# 27
q(3, "For the teaching mixture, which reading follows from each component acting on a different organ?",
 "Each term is compared with 1 on its own, so no component is over its limit.",
 ["The index of 1.059500 still applies, since the regulation writes the sum.",
  "The index should be multiplied by three, one allowance per organ.",
  "The mixture cannot be assessed, since the engine refuses independent components."],
 "Where components act independently the sum means nothing, and each term, the largest being 0.385000, is read against 1 alone. The additive index assumes the same organ and mechanism; nothing multiplies it, and the engine computes the additive index whatever the mechanism because it cannot tell which case a mixture is in.")

# 28
q(2, "A mixture is sent to `mixtureExposureIndex` with no components at all. What comes back?",
 "A refusal on `components`: \"components must be a non-empty array\"",
 ["An index of 0.000000 with exceeds false, since nothing was present to add", "A refusal on `components[0].limit`, naming the limit that is missing from the list", "An index of 1.000000, the default the engine returns for an empty mixture list"],
 "An empty mixture has no index, so the engine refuses on the field `components` in its own words. It returns no default index, and the per-component limit refusal applies only when a component is present with a limit of zero.")

# 29
q(0, "The Associate tier's OBEN walkdown has six periods, and the OSHA PEL noise dose integrates 2 of them. How many would a LEX,8h over the same periods include?",
 "All 6, since LEX,8h has no threshold",
 ["2, the same periods the PEL integrates", "5, the periods at or above 80 dBA", "None, since LEX,8h cannot read a dosimeter record"],
 "LEX,8h is an energy average with no floor, so every period counts, including the 76.500000 dBA period no noise dose criterion integrates. 2 is the PEL's count with its 90 dBA threshold and 5 is the count at the 80 dBA threshold of the action level and the NIOSH noise REL.")

# 30
q(1, "A TWA of 85 on the OSHA action-level scale is a noise dose of 50.000750 percent. How does that relate to the EU upper action value of 85?",
 "They are different metrics that share a number: a TWA on a decibel exchange rate of 5 dB with a threshold, and a LEX,8h on the energy relation with none.",
 ["They are the same limit written two ways, so either figure can be quoted for the other.",
  "The EU value is the OSHA action level converted into noise exposure points.",
  "The OSHA value is the EU value after the 7 dB weighting allowance."],
 "The OSHA action level is 85 dBA as a TWA, equivalently a noise dose of fifty percent, built with a decibel exchange rate of 5 dB and an 80 dBA threshold. The EU upper action value is a LEX,8h of 85 dBA, which is 100 points. The 7 dB belongs to protector estimates and has nothing to do with either.")

# 31
q(3, "The engine measures one of its constants by asking for the LEX,8h of 100 noise exposure points. Which constant is it?",
 "The exposure points pivot, 85.000000000000 dBA",
 ["The reference duration T0, 8.000000000000 hours", "The chemical TWA divisor, 8.000000000000 hours", "The EU limit value, 87.000000000000 dBA"],
 "100 points is LEX,8h 85 by definition, so asking for their level returns the pivot. T0 is measured from the LEX of 4 hours at 90 dBA, the chemical divisor from 10 ppm for one hour, and the EU values are exported rather than measured.")

# 32
q(0, "How does the engine measure the Appendix B subtraction of 7.000000000000 dB?",
 "As 30 less the attenuation Appendix B gives at an NRR of 30",
 ["As the attenuation divided by (NRR less 7) at an NRR of 27, on A-weighted data", "As the credited NRR over 40 on C-weighted data, for an earmuff label", "As the attenuation less (NRR less 7) at an NRR of 30, on A-weighted data"],
 "At NRR 30 Appendix B credits 30 - 7 on A-weighted data, so 30 less that attenuation returns the 7. The attenuation over (NRR - 7) at NRR 27 measures the field derating's 0.500000000000, the credited NRR over 40 measures the NIOSH deratings, and the attenuation less (NRR - 7) measures the dual-protection 5.")

# 33
q(2, "A weekly LEX call is handed eight daily values. What does the engine answer, in its own words?",
 "\"dailyLexDbA holds more than 7 days: a week has 7\"",
 ["\"dailyLexDbA must be a non-empty array of daily exposures\"",
  "\"dailyLexDbA[1] must be a finite number\"",
  "A weekly level with the energy sum divided by 8 in place of 5"],
 "The weekly LEX accepts at most seven days, as J10 records, and refuses an eighth on the field `dailyLexDbA`. The non-empty message is the refusal for a week with no days and the indexed message the refusal for a day that is not a number; the engine never changes its divisor to fit the count.")

# 34
q(1, "A LEX,8h call is given 100.000000 dBA for 0.000000 h beside 85.000000 dBA for 8.000000 h. What does the engine report?",
 "85.000000 dBA, with the zero-length task's own task LEX reported as absent",
 ["100.000000 dBA, since the loudest task on the list sets the level of the whole day", "A refusal on `periods`, since a task of zero hours cannot be entered on a LEX list", "85.969100 dBA, since the loud task still adds a small share of energy to the day"],
 "A task of zero hours carries no energy, so the day is 85.000000 dBA and 100.000000 points exactly as if the loud entry were not there, and its own task LEX has no value to report. Zero hours is accepted, the loudest level does not set a day, and 85.969100 dBA is ten hours at 85 dBA.")

# 35
q(3, "The engine takes concentrations in whatever unit the caller types. What must hold before a mixture term means anything?",
 "The concentration and its limit are in the same unit, since each term is a ratio of the two.",
 ["The concentration is in ppm and the limit in mg/m3, the way OSHA prints them in its own tables.",
  "Nothing, because the engine converts every unit by itself from the substance name it is given.",
  "The limit is in ppm-hours, so that it matches the 8-hour TWA it is later compared with in a report."],
 "A term built from a concentration in one unit and a limit in another is a wrong number that looks like a right one, and the arithmetic gives no warning; this course keeps both in ppm. The engine takes no substance name and converts nothing, and a limit is a concentration, never a concentration-time product.")

# 36
q(0, "A safety case quotes a 5x5 risk matrix beside the tier's noise exposure figures. Which course owns that matrix?",
 "The Risk, Change and Learning course",
 ["This course, in its capstone module", "The Safety Performance Statistics course", "The Separation and Relief courses"],
 "A risk matrix ranks hazards by likelihood and consequence, and it is taught in Risk, Change and Learning; this course only cites it beside its figures. The statistics course owns rates of recordable events, and the relief courses own radiant flux from flares, so neither is the home of the matrix.")

# 37
q(3, "Where do heat stress limits and margins stand in this course, as the Professional tier describes them?",
 "In the Expert tier, never graded, because the equation constants are checked for transcription only",
 ["In this tier, graded through the field derated estimate", "In the Expert tier, graded as margins against the NIOSH heat REL", "Nowhere, since heat stress belongs to the Separation and Relief courses"],
 "Every heat stress limit and margin is taught in the Expert tier and never graded, because the constants are transcription only. The field derating is a hearing protector method, no margin is graded, and flare radiation, which the Separation and Relief courses own, is a radiant flux and a different subject from heat stress.")

# 38
q(2, "Why does this course always write \"NIOSH noise REL\" or \"NIOSH heat REL\" and never the acronym alone?",
 "Two different NIOSH limits, one for noise and one for heat stress, share the acronym, and the qualifier says which is meant.",
 ["The acronym alone is the licensed trade name of a NIOSH document and cannot be quoted in a course.",
  "Because the NIOSH noise REL is withdrawn, and only the heat stress limit is still in force today.",
  "The qualifier tells the reader which decibel exchange rate was used to compute the figure."],
 "Section 24 binds the two qualified forms because the NIOSH recommended exposure limit for noise, met in the Associate tier, and the one for heat stress, met in the Expert tier, share the letters. The acronym names no licensed document, the NIOSH noise REL is a live criterion the engine presets, and a decibel exchange rate is stated on its own beside a figure.")

# 39
q(1, "Why does this course not grade a verdict word such as \"at or above the upper action value\"?",
 "The number is the finding; a flag throws away how close a figure is to its line.",
 ["The engine does not return the action flags at all, only the level itself.",
  "Because the EU action values are licensed text and cannot be named in the course.",
  "Flags are true for every day in the tier's worked cases, so they test nothing."],
 "84.989700 dBA and 0.000000 dBA both read false against the upper action value and share nothing else, so the flag alone hides what matters. The engine does return both action flags, the EU values are exported and not licensed, and the flags differ across the tier's cases.")

# 40
q(0, "Which statement about the engine's limits for chemicals is right?",
 "Every limit is an input the caller types; the engine holds no limit table and compares with no ceiling.",
 ["The engine looks up the OSHA limit for each named substance.",
  "The engine holds a licensed table of TLVs as a fallback.",
  "The engine compares every TWA with a ceiling value automatically."],
 "Every exposure limit is an input, and the engine has no door for a chemical ceiling comparison. It holds no table of any kind, public or licensed; ACGIH TLVs are never quoted in this course.")

# 41
q(3, "Which of these is a judgement call the engine makes where its sources leave the choice open?",
 "J6: the 8-hour chemical TWA always divides by 8 and warns under or over 8 hours",
 ["The NIOSH derating factors being printed values it reproduces from the source's own table", "A mixture index being a product of its terms, so one small term pulls the index down", "LEX,8h carrying an 80 dBA threshold, like the OSHA action level and the NIOSH noise REL"],
 "J6 is the engine's stated choice for the chemical averages, named with J5, J7 and J10 in this tier. The NIOSH factors are ORACLE ONLY with no printed value behind them, the index is a sum, and LEX,8h has no threshold at all.")

# 42
q(2, "Why does the Professional capstone give five days for its weekly LEX?",
 "With five days the divisor of 5 equals the day count, so the oracle-only divisor cannot move the answer.",
 ["The engine refuses a week of any other length.",
  "The weekly LEX is published and reproduced only for weeks at 85 dBA.",
  "Five days make the weekly level equal the arithmetic mean of the days."],
 "The capstone keeps clear of J10's boundary: on five days the statutory divisor and the count agree, so nothing the evidence cannot fix enters the graded figure. The engine accepts one to seven days, the published case happens to be five days at 85 dBA and fixes no divisor, and the five-day week's 85.461288 dBA still differs from its 84.860000 dBA mean.")

emit(Q, '/root/hse-wip-hygiene/banks/h2i_exam.json', expect_n=42)
finish()
