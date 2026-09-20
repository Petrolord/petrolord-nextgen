import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H2 Expert m06, From Exposures to a Sampling Decision.
# Figures from digest Section 22 (the teaching crew), Section 15 (the mixture,
# J7, additivity), Section 14 (the IGBOMOTORU records and the STEL), Section 7
# (OBEN under three criteria), Section 16 (the forms, with the section 9.3.2
# label), Section 17 (with the section 8.1 label), Section 23 and Section 25.
# The capstone lesson is read for its field KINDS only; no capstone input,
# condition or graded answer appears.

q(3, "The teaching crew's solvents are toluene 72.500000 ppm, xylene 31.200000 ppm and acetone 385.000000 ppm, with limits adjusted for 10 h shifts and 50 h a week to 140.000000, 70.000000 and 700.000000 ppm. What is the mixture index on the adjusted limits?",
 "1.513571, each concentration over its own adjusted limit and the three terms added",
 ["1.059500, the index on the unadjusted limits, since a reduction factor moves each limit and leaves a mixture alone",
  "0.385000, the largest single term, since the mixture is judged by the component nearest its own limit",
  "1.059500 multiplied by the daily factor of 0.700000, since the schedule scales the index along with the limits"],
 "72.500000 over 140.000000, 31.200000 over 70.000000 and 385.000000 over 700.000000 add to 1.513571. The unadjusted index is 1.059500, which ignores the ten-hour schedule. 0.385000 is acetone's term on its unadjusted limit, and the additive index sums the terms. A lower limit raises each term, so the index is divided by the factor; multiplying moves it the wrong way.")

q(0, "For the teaching crew the adjusted index of 1.513571 equals 1.059500 divided by 0.700000. Why do the two routes agree here?",
 "Every limit takes the same daily factor, since the schedule is one schedule, so every term grows in the same proportion",
 ["The additive index always scales with the reduction factor, whatever adjustment each substance happens to carry",
  "The engine adjusts the index directly when a schedule is given, and it skips adjusting the individual limits",
  "Acetone carries the largest term, and the index follows whichever term is largest when the limits are lowered"],
 "Each term is a concentration over a limit; divide every limit by 0.700000 and every term, and so the sum, grows by 1 over 0.700000. That holds only because all three share the factor. `mixtureExposureIndex` takes concentrations and limits and knows nothing of schedules: the adjustment happens before the call. A sum moves with all of its terms, whichever one is largest.")

q(2, "When would dividing the unadjusted index by one factor give a different answer from summing the adjusted terms?",
 "When one component carries a substance-specific shift adjustment, so the terms scale by different amounts",
 ["When the index on the unadjusted limits is already above 1, since the division then double counts the excess",
  "When the weekly factor governs in place of the daily one, since the two factors cannot share one schedule",
  "When a component's term is below 0.100000, since small terms are rounded away before the division is made"],
 "The two routes agree only while every term is multiplied by the same number. Give one substance its own adjustment and the index must be built term by term. Where the index starts has nothing to do with it; whichever factor governs, it is still one factor for the schedule; and the engine rounds nothing before it sums.")

q(1, "The adjusted mixture index applies each limit's reduction factor and then adds the terms. What must a report say about that?",
 "That the adjustment and the index are each published, and composing them is a judgement stated in the report",
 ["That 29 CFR 1910.1000(d)(2) prints the adjusted index, so the composition is the regulation's own stated method",
  "That the composition is ORACLE ONLY, since no printed value of the adjusted index is known for any mixture",
  "That the composition is TRANSCRIPTION ONLY, since both steps were typed from one OSHA page by the engine"],
 "The daily factor is reproduced by the BC regulation's printed factors, and the additive index by the regulation's own worked example of 0.925000. Neither source prints the combination, so a hygienist who uses it says so. The evidence classes describe doors of the engine, and the composition is a choice the caller makes before calling `mixtureExposureIndex`, which is why it is stated as a judgement.")

q(1, "The teaching mixture's largest single term is 0.385000 while its index is 1.059500. If the three solvents in fact act independently, what does the index mean?",
 "Nothing: each solvent is read against its own limit, and each sits under it",
 ["It understates the hazard, since independent action adds to the combined effect on the one target organ",
  "It still exceeds, since the regulation's formula applies to a mixture whatever the mechanism of action",
  "It should be divided by the number of solvents, since independent terms are averaged and never added"],
 "The additive index assumes the components act on the same organ by the same mechanism. Where they act independently, the sum means nothing and each is compared with its own limit. Understating is the case of components that potentiate each other. The engine computes the additive index only and cannot tell which case applies, so the report says which it assumed. No rule averages the terms.")

q(3, "A mixture's index comes out at exactly 1.000000. How does the engine read it, and what does the regulation say?",
 "It passes: the regulation says the index shall not exceed unity, and J7 reads exactly 1 as a pass",
 ["It exceeds, since unity is the limit itself and a mixture at its limit is treated as over it",
  "It refuses the call, since an index on the boundary cannot be read either way by the engine",
  "It is flagged with a warning, since the engine warns at a limit and still reports the index"],
 "Judgement J7: the golden's case at 1.000000 gives exceeds false, and its over-unity case at 1.100000 gives exceeds true. The words \"shall not exceed unity\" make 1 itself acceptable. The engine neither refuses nor warns on a boundary index; no capstone input lands exactly on unity.")

q(0, "The IGBOMOTORU partial record covers 6.750000 hours and gives an 8-hour chemical TWA of 30.125000 ppm, and 35.703704 ppm averaged over its own hours. What can the hygienist say if nothing is known about the unsampled time?",
 "That the true 8-hour figure is 30.125000 ppm or higher; 35.703704 holds only if the gap matched the samples",
 ["That the true 8-hour figure is 35.703704 ppm, since averaging over the hours covered removes the gap",
  "That the true 8-hour figure lies between 30.125000 and 35.703704 ppm, the two ends of the record's possible range",
  "That the 8-hour figure cannot be computed, since the engine refuses a record covering under 8 hours"],
 "Judgement J6 divides by 8 and warns, in the engine's words: \"the periods cover 6.75 h of 8: the remainder counts as zero exposure\". Unsampled time can only add, so 30.125000 ppm is a floor. 35.703704 ppm assumes the missing hours looked like the sampled ones, and they could have been worse, so no upper end is known. The engine computes and warns.")

q(2, "The short STEL record covers 11.000000 minutes of 15 and gives 92.333333 ppm. How should that figure be read?",
 "As a floor on the fifteen-minute average; the four missing minutes set how far above it the true value lies",
 ["As the fifteen-minute average itself, since the engine rescales an eleven-minute record to fifteen minutes",
  "As a ceiling on the fifteen-minute average, since the missing minutes can only dilute what was measured",
  "As an average the engine refused, since a short-term record must cover the whole fifteen-minute window"],
 "The STEL divides by 15 and counts the missing minutes as zero, with a warning. Any real concentration in those minutes adds to the sum, so 92.333333 ppm is the least the true figure can be. The engine does not rescale. Zero is the lowest a concentration can be, so the missing minutes cannot pull the figure down. A short record is warned; a record over 15 minutes is refused.")

q(0, "A dosimeter was left on the OSHA PEL setting at a site whose policy follows the NIOSH noise REL. What puts the record right?",
 "Reading the record again under the right criterion",
 ["Averaging the two noise doses, since the truth for the day lies somewhere between the two criteria",
  "Scaling the noise dose by the ratio of the two criterion levels, 90 dBA over 85 dBA",
  "A new dosimeter day, since a noise dose read under one criterion cannot be re-read under another"],
 "The OBEN day shows the size of the error: 27.748183 percent of the OSHA PEL and 265.610944 percent of the NIOSH noise REL from one record. A dosimeter set to the wrong criterion gives a correct number for the wrong question. The same periods read under the right criterion give the right noise dose, since each criterion is a different reference duration, threshold and decibel exchange rate over one record. An average of two criteria answers neither, a ratio of levels ignores the decibel exchange rate and the threshold, and the periods can be re-read.")

q(3, "Nobody recorded whether a site's WBGT was built through the indoor or the outdoor form. What should happen before the figure is used?",
 "Record which form the instrument used, or take the three readings again and state the form",
 ["Report the lower of the two, since the outdoor form is the one that applies wherever the sun is out",
  "Report the mean of the two forms, since the true index lies between them when the form is unknown",
  "Report the higher of the two as the safe choice"],
 "On the outdoor readings the two forms give 31.410000 C and 32.560000 C, both the NIOSH 2016-106 section 9.3.2 weighting, checked for transcription only, so the form moves the index by more than a degree. Nothing in the arithmetic resolves which form was used; the fix is to find out or re-measure and state the form. The outdoor form is for outdoors with solar load, and whether this site had solar load is what nobody recorded. A mean of two forms is neither form, and a choice made without the facts is a guess.")

q(1, "The teaching crew's action-level noise dose is 57.350093 percent against 50, and its adjusted mixture index 1.513571 against 1. Which should the next sampling day go to, and why?",
 "The noise dose, since it sits near enough its line that the record's weaknesses could close the margin",
 ["The mixture, since its index is the larger number and so carries the greater share of the crew's risk",
  "The mixture, since a composed index rests on a judgement and every judgement needs fresh sampling",
  "Neither, since both sit above their lines already and the control decision no longer needs data"],
 "What to measure next is decided by which reading is least certain and nearest its line. 1.513571 sits far enough above 1 that resampling would change the argument only if additivity itself were wrong, while 57.350093 percent is within reach of 50. Comparing a noise dose with an index as numbers means nothing. A control chosen on a weak record may address the wrong hazard, so sampling comes first.")

q(2, "Why does the course give the teaching crew no single combined figure across noise, chemical and heat stress?",
 "A noise dose, a mixture index and a WBGT use different criteria and units, so a sum would mean nothing",
 ["The engine has no door that combines hazards, although the three ratios could be added by hand",
  "A combined figure is owned by the Risk, Change and Learning course, which ranks each hazard on its matrix",
  "The heat stress row is transcription only, and without it the other two could be summed as ratios"],
 "The crew's record is three readings, each against its own line, each with its own evidence, and a report lists them side by side. Adding a noise dose to an index is meaningless whatever door computes it. The risk matrix ranks hazards and never adds them. The noise and chemical rows are measured in different units against different criteria even without the heat stress row.")

q(1, "A reviewer asks to rank the teaching crew's three hazards on a 5x5 risk matrix and to add its incident rates. Where does this course send each request?",
 "The matrix to Risk, Change and Learning, the incident rates to Safety Performance Statistics",
 ["Both to this course's last module, since a sampling decision is where hazards are ranked and counted",
  "The matrix to Safety Performance Statistics and the incident rates to Risk, Change and Learning",
  "Both to Gas Processing, which treats BTEX"],
 "Both requests sit across a seam this course cites and leaves to its neighbours. Ranking hazards on the 5x5 matrix is taught in Risk, Change and Learning; counting incidents and injuries per hour worked is taught in Safety Performance Statistics, the module's opening course. Gas Processing is where glycol-unit BTEX emissions are handled, which is a separate question from a crew's solvents.")

q(0, "The heat stress row compares the crew's one-hour WBGT of 29.066667 C with the NIOSH heat REL equation at 300.000000 W, 28.213106 C, the NIOSH 2016-106 section 8.1 equation, checked for transcription only. How does a report carry that row?",
 "As a screening argument: a measured average set against an equation checked for transcription only",
 ["As a verified exceedance, since the time weighted WBGT is arithmetic by definition and so is the limit",
  "As a published comparison, since the NIOSH heat REL is reproduced from the section 1.1.3 worked example",
  "Left out, since a transcription-only limit cannot be quoted"],
 "The course reads the heat stress row as a screening argument, and the report labels it so. The average is arithmetic, and the limit is not: its constants were copied twice from one page. The worked example disagrees with the equation, which is why the example is an erratum and nothing is reproduced by it. The equation is still quoted, with its status beside it.")

q(2, "The Expert capstone grades six numbers. Which of them would move if the RAL constants 59.9 and 14.1 had been copied wrongly?",
 "None of them, since no graded field passes through the RAL or the NIOSH heat REL",
 ["The one-hour WBGT average, since it is read against the RAL",
  "The one-hour metabolic average, since the RAL is a function of it",
  "The adjusted mixture index, since the adjusted limits come from the same NIOSH criteria document"],
 "The capstone's two heat stress fields are one-hour averages of stated readings, arithmetic by definition, and neither is evaluated against any limit. The metabolic average is the input M to the equations and is computed before either equation is touched. The chemical fields rest on Brief and Scala and on 1910.1000(d)(2), neither of which is a NIOSH heat stress document.")

emit(Q, '/root/hse-wip-hygiene/banks/h2a_m06.json', expect_n=15)
finish()
