import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H2 Professional m06, the capstone module: the tier read as one.
# Figures from digest Sections 11 to 15 (the tier's own worked cases), Section
# 23 (what is never graded and why) and Section 25 (scope seams and licensed
# material). The capstone's site, conditions and graded answers are NOT here:
# every figure is one of the tier's teaching cases. No capstone input appears.

q(2, "Every average in this tier divides by a fixed reference. Which pairing of metric and reference is right?",
 "The STEL and 15 minutes",
 ["The weekly LEX and the days worked", "The chemical TWA and the hours sampled", "LEX,8h and the hours of the shift"],
 "The STEL divides by 15 minutes whatever the record covers. The weekly LEX divides by 5 days, the chemical TWA by 8 hours, and LEX,8h by 8 hours, so the long EVWRENI day reads 87.207845 dBA and the partial IGBOMOTORU record 30.125000 ppm. Each wrong pairing replaces the fixed reference with the time actually covered.")

q(3, "Under the fixed-reference pattern of this tier, what happens to a record that covers more time than its reference?",
 "Its figure rises, because the extra time adds to the sum while the divisor stays put.",
 ["Its figure is rescaled back to the reference length, so any extra time on the record changes nothing.",
  "The engine refuses every record longer than its reference.",
  "The figure falls, because the extra time dilutes the average."],
 "More time than the reference raises the figure: ten hours at 85 dBA read LEX,8h 85.969100 dBA and the ten-hour chemical record 42.156250 ppm. Nothing is rescaled, only the STEL refuses a record over its window, and a dilution would need the divisor to grow with the record.")

q(1, "The noise figures of this tier are energy averages and the chemical figures arithmetic ones. What follows for a short, high reading?",
 "A short loud task can decide a LEX,8h; a short high sample moves a chemical TWA only in proportion to its concentration and hours.",
 ["Both behave alike, since both are time weighted averages over 8 hours.",
  "A short high chemical sample decides the TWA, and a short loud task barely moves LEX,8h.",
  "Neither can be moved by a short reading, because both divide by 8 hours."],
 "On a decibel scale three decibels roughly doubles the energy, so the 95 dBA task of Figure 26 carries 93.750000 of its 144.987371 points in 45 minutes. A chemical TWA is a plain time weighted mean of concentrations, where every ppm counts the same. The shared divisor of 8 hours does not make the two scales behave alike.")

q(0, "Which protector estimate does this tier grade, and what fixes it?",
 "The field derating, fixed by the OSHA Technical Manual's printed 89.000000 dBA",
 ["Appendix B, fixed by the manual's printed 80.000000 dBA for the hearing conservation question",
  "The NIOSH earmuff derating, fixed by the NIOSH criteria document",
  "The dual-protection rule, fixed by the 5 dB in 1910.95"],
 "The capstone takes its protector estimate by the field derating, for the engineering controls question, and the manual prints 89.000000 dBA for its worked example, which the engine reproduces. Appendix B is also reproduced, at 80.000000 dBA, and answers the hearing conservation question the capstone does not ask. The NIOSH derating by type and dual protection are ORACLE ONLY, and nothing printed fixes either.")

q(1, "The NIOSH derating by type and the OSHA dual-protection 5 dB are taught and never graded. What is the reason?",
 "They are oracle only: an independent oracle agrees with the engine and no printed value is known to set against either.",
 ["They are licensed material, so their factors cannot be typed into the engine or quoted in any lesson of the course.",
  "They give the same figures as Appendix B on every label, so grading them as well would only duplicate a graded field.",
  "They are Expert tier material and are only previewed in this tier."],
 "The course lists both among the items this course never grades, and gives oracle only as the reason for each: nothing a source prints stands outside the engine and its oracle to check them. Neither is licensed, since the engine holds the factors; they give different figures from Appendix B, 84.350000 dBA for an earmuff against 77.600000 dBA on the teaching case; and both are taught in full in this tier.")

q(2, "The time-to-target door returns 3.184857 hours for one pairing of a steady level and a target LEX,8h. Which pairing?",
 "91.000000 dBA held alone, against a target LEX,8h of 87",
 ["91.000000 dBA held alone, against a target LEX,8h of 85",
  "88.000000 dBA held alone, against a target LEX,8h of 87",
  "94.000000 dBA held alone, against a target LEX,8h of 87"],
 "`lexAllowedDurationH` gives the hours at a level that alone reach the target: 3.184857 h at 91.000000 dBA to 87. The same level reaches 85 in 2.009509 h, and the target of 87 takes 6.354626 h at 88.000000 dBA and 1.596210 h at 94.000000 dBA. Every figure is one row of the same printed table, read at its own level and target.")

q(0, "No capstone input in this tier sits on a judgement call's boundary. Which boundary belongs to J5?",
 "A protector credit reaching the floor at zero",
 ["A mixture index landing exactly on unity",
  "A record that leaves unsampled time undeclared",
  "A sound level sitting exactly on a criterion threshold"],
 "J5 floors protector credit at 0 with a warning and refuses C-weighted data for the field derating. Unity is J7, unsampled time is J6, and a level exactly on a threshold is J2. The calls are taught by name so they can be recognised in a real survey, and the capstone keeps clear of all four.")

q(3, "A reviewer asks for a question whose answer is the word \"exceeds\" for the teaching mixture. Why does this course not grade that?",
 "Verdict words are never graded in this course, and the course lists them among what it leaves out.",
 ["The teaching mixture does not exceed, so the word would be false.",
  "A verdict needs a licensed limit, which the course never quotes.",
  "Risk, Change and Learning owns verdicts, so the word belongs there."],
 "The course's list of what it never grades carries any verdict word: exceeds, passes, at or above an action value. The teaching mixture does exceed at an index of 1.059500, its limits are public OSHA values typed as inputs, and the risk matrix is the only thing Risk, Change and Learning owns here.")

q(3, "Where do the exposure limits used in this course come from?",
 "They are typed into the engine as inputs from public OSHA or NIOSH values; no licensed limit is quoted.",
 ["An ACGIH table embedded in the engine supplies them, quoted with permission and updated whenever the table is reissued.",
  "The engine looks them up in its own table by substance name, so the caller only has to type the concentration.",
  "ISO 9612 supplies them, and the engine applies it to every chemical record."],
 "The engine embeds no limit table and never looks one up; every limit is an input, and this course types only public OSHA or NIOSH values. ACGIH TLVs, ISO 9612 and ISO 7243 text are licensed and never quoted, and ISO 9612 is a noise measurement standard in any case.")

q(1, "A learner wants to add the plant's incident rate to a noise exposure report built in this tier. Which course owns incident rates?",
 "Safety Performance Statistics, the first course of this module",
 ["This course, as part of the capstone",
  "The Risk, Change and Learning course, together with the 5x5 matrix",
  "The Separation and Relief courses"],
 "Incident and injury rates belong to Safety Performance Statistics, the first course of this module. The 5x5 risk matrix belongs to Risk, Change and Learning, and flare and pool-fire thermal radiation to Separation and Relief. This course cites them and stops there.")

q(0, "A site manager wants the field derated 87.600000 dBA compared with the EU limit value of 87.000000 dBA. Why does this course refuse that comparison?",
 "The limit value applies at the ear with protection taken into account, and none of the four estimates is that assessment.",
 ["87.000000 dBA is a licensed value from the directive, so the course may not quote it or compare any figure with it.",
  "Every protector estimate is C-weighted while the directive's limit value is A-weighted, so the two can never be set side by side.",
  "The limit value applies only to the weekly noise exposure level, and a protector estimate is a daily figure for one shift."],
 "A field derated figure is a rule applied to a label for the engineering controls question, and the directive's limit value needs a real assessment at the ear with the protector in place, which no door computes. The directive's figures are public and carried by the engine, every estimate here is in dBA, and the limit value covers the day as well as the week.")

q(2, "On the teaching case the field derating leaves 87.600000 dBA and Appendix B 77.600000 dBA. A hygienist quotes 77.600000 dBA to argue that engineering controls are unnecessary. What is the error?",
 "They answered the engineering controls question with the more generous rule; that question belongs to the field derating.",
 ["None, because the lower estimate is the more accurate of the two, and an accurate estimate settles any question put to it.",
  "They should have quoted the dual-protection estimate instead, which is the lowest of all and so the strongest argument available.",
  "They should have averaged the two estimates, so that neither the harsh rule nor the generous one decides the answer alone."],
 "The field derating credits 10.000000 dB where Appendix B credits 20.000000 dB on the same label and the same level, and the course gives each estimate its own question: the field derating answers whether engineering controls are needed. The lower figure answers the other question rather than answering this one more accurately, dual protection is ORACLE ONLY and answers a third, and averaging two methods is no method at all.")

q(1, "Which of these does this course put among its eighteen graded capstone fields?",
 "Chemical averages and indices",
 ["A WBGT built from globe, wet bulb and dry bulb readings",
  "A margin against the NIOSH heat REL at a stated metabolic rate",
  "The Brief and Scala weekly reduction factor taken on its own"],
 "The eighteen graded fields are noise doses and TWAs, LEX values, the OSHA engineering-controls protector estimate, chemical averages and indices, reduction-factor arithmetic, and two one-hour averages of readings the capstone states. The course removes the other three by name: no WBGT built from thermometer readings and no margin against a NIOSH heat stress limit, because those constants are checked for transcription only, and the Brief and Scala weekly factor on its own, because it is oracle only.")

q(0, "Which two figures among the tier's teaching cases come back with a warning that unsampled time counts as zero?",
 "The partial IGBOMOTORU record's 8-hour TWA and the short STEL record",
 ["The long EVWRENI day's LEX,8h and the five-day weekly noise exposure level",
  "The field derated estimate and the mixture index",
  "The full-shift IGBOMOTORU record and the full STEL window"],
 "The partial record covers 6.750000 of 8 hours and the short STEL record 11.000000 of 15 minutes, and each warns that the remainder counts as zero. LEX,8h and the weekly LEX carry no such warning, the protector estimate carries its method, and the full records cover their whole reference.")

q(3, "Before submitting, a learner checks each figure's units. Which slip gives a clean-looking number that answers nothing?",
 "A level typed in the wrong weighting, or a duration typed in minutes where hours are asked for.",
 ["A mixture index quoted without a unit, since every figure in the capstone must carry a unit beside it.",
  "A STEL quoted in ppm, since a fifteen-minute average ought to be quoted in ppm-minutes as it is summed.",
  "A LEX,8h quoted in dBA, since a daily level should be quoted in noise exposure points as the regulation does."],
 "A wrong weighting changes which rule credits a protector, and minutes typed as hours change every time weighted average, and neither is caught by the arithmetic. An index is dimensionless, a STEL is in ppm and a LEX,8h in dBA, so each of those is correct as written.")

emit(Q, '/root/hse-wip-hygiene/banks/h2i_m06.json', expect_n=15)
finish()
