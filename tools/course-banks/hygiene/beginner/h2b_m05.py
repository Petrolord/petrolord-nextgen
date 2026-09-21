import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H2 Associate m05, Inverse Questions.
# Sources: digest sections 4, 5, 8 and 9 (Associate-owned). Every figure is printed there.

q(1, "A planner asks which steady sound level would use exactly one day's OSHA allowance in 3.000000 h. What does `noiseLevelForReferenceDurationDbA` answer?",
 "97.075187 dBA, the reference duration formula run backwards.",
 ["89.245112 dBA, the NIOSH answer for the same 3 hours of work.",
  "97.000000 dBA, the NIOSH level for half an hour.",
  "95.000000 dBA, the level giving a 4 hour reference duration on OSHA."],
 "Solving T = 8 / 2^((L - 90)/5) for L at 3 hours gives 97.075187 dBA on OSHA. The tempting 89.245112 dBA is the NIOSH answer for the same hours, a stricter criterion. 97.000000 dBA is a NIOSH row for 0.500000 h, and 95.000000 dBA is the OSHA level for 4.000000 h, a longer allowance.")

q(3, "The OSHA level for a 3.000000 h reference duration is 97.075187 dBA. What is the OSHA level for 6.000000 h?",
 "92.075187 dBA, one 5 dB step lower.",
 ["87.075187 dBA, two 5 dB steps lower.",
  "95.000000 dBA, the OSHA level at 4 h.",
  "86.245112 dBA, the NIOSH level at 6 h."],
 "Every doubling of hours lowers the level by one decibel exchange rate, 5 dB on OSHA, so 97.075187 becomes 92.075187 dBA. Two steps, 87.075187 dBA, is the OSHA level for 12 hours, a second doubling. 95.000000 dBA belongs to 4 hours, and 86.245112 dBA is the NIOSH answer for 6 hours.")

q(0, "At 85.000000 dBA the OSHA reference duration is 16.000000 h. What does a period at that sound level add on the OSHA PEL setup?",
 "It adds nothing there, since the PEL counts only periods at 90 dBA or louder.",
 ["It uses half of the PEL allowance for every 8 hours it lasts on the day.",
  "It is integrated at its 16.000000 h reference duration like any period.",
  "It is refused, because a reference duration over 8 hours is invalid."],
 "The formula still returns the level and Table G-16a runs down to 80 dBA, but the PEL integrates nothing below 90, so a period at 85 dBA adds nothing there. It would be integrated by the action level, whose threshold is 80 dBA, at that 16.000000 h reference duration. Nothing is refused for a reference duration longer than a shift.")

q(2, "Asked for the OSHA level at a quarter of an hour, the engine answers 115.000000 dBA. What does a still shorter time give?",
 "The level rises past 115 dBA, above the highest level Table G-16 permits.",
 ["The engine refuses, since no level above 115 dBA can ever be computed by it.",
  "The level stays at 115 dBA, since the formula is capped at Table G-16.",
  "The level falls again, since the formula reverses above a table top."],
 "The formulas have no edge: a shorter time gives a higher level, past the 115 dBA of Table G-16. Under judgement J3 the engine warns above 115 and above 130 dBA and still computes, so nothing is capped or refused. The warning marks where the source stops, and the number rests on the formula alone beyond it.")

q(1, "The level for a reference duration gives exactly 100 percent noise dose. What does that answer assume about the rest of the day?",
 "That the level is held for the whole of those hours and nothing else is on the day.",
 ["That the worker has already used half the allowance before the task being planned begins.",
  "That the day is 8 hours long, whatever reference duration the planner asked the engine for.",
  "That the rest of the day is spent quieter than the action level threshold of 80 dBA."],
 "The answer is a level held steady for the stated hours with nothing else on the day. If part of the allowance is already used, the level for the remaining hours has to be lower, and the right question becomes the time left at a level. Quiet time below a threshold happens to add nothing, but the answer does not depend on assuming it.")

q(3, "A report gives a TWA of 90 dBA and nothing else. What noise dose does `noiseDoseFromTwaPct` give for it on the NIOSH noise REL?",
 "316.227766 percent.",
 ["100.000000 percent.",
  "199.526231 percent.",
  "158.489319 percent."],
 "On NIOSH, 90 dBA is five decibels above the criterion level of 85, so the noise dose is 100 times 10 to the power of 5 over 10.0, which is 316.227766 percent. The tempting 100.000000 percent is the OSHA answer, where 90 is the criterion level itself. 199.526231 and 158.489319 percent are the NIOSH figures at 88 and 87 dBA.")

q(0, "On OSHA a TWA of 95 dBA gives 199.996999 percent, a hair short of 200. Why?",
 "The printed 16.61 is a little larger than exact, so 5 dB buys slightly less than a doubling.",
 ["The PEL threshold of 90 dBA removes a sliver of noise dose from every TWA above it.",
  "Table G-16a rounds the reference duration at 95 dBA, and the TWA inherits that error.",
  "At 95 dBA the engine switches to the exact coefficient, which falls short of a doubling."],
 "With the exact coefficient one decibel exchange rate is exactly a doubling. The printed 16.61 sits slightly above exact, so dividing 5 dB by it gives a little less than log10 2 and the noise dose lands just under 200. That is judgement J1 seen from the other side. The threshold does not enter this door, and presets never switch coefficient.")

q(2, "On NIOSH a TWA of 88 dBA gives 199.526231 percent, while on OSHA 95 dBA gives 199.996999. Why is the NIOSH figure further from 200?",
 "Its printed 10.0 sits further above the exact coefficient than 16.61 does.",
 ["The NIOSH scale has a lower criterion level, so its doublings are smaller.",
  "The NIOSH ceiling of 115 dBA compresses every noise dose on its scale.",
  "The 3 dB decibel exchange rate is always rounded before it is applied."],
 "Both shortfalls come from a printed coefficient larger than exact. NIOSH's 10.0 sits 0.034215715338 dB above its exact value and OSHA's 16.61 only 0.000359525563 dB above, so the NIOSH doubling falls further short. The criterion level only shifts where 100 percent sits, and the ceiling is a warning on levels, never a change to the arithmetic.")

q(1, "The OBEN NIOSH TWA of 89.242460 dBA is put back through `noiseDoseFromTwaPct` on the NIOSH noise REL. What comes back?",
 "265.610944 percent, the noise dose it restates.",
 ["316.227766 percent, the noise dose at a TWA of 90 dBA.",
  "72.054478 percent, the OSHA action level figure that day.",
  "100.000000 percent, since it is a daily TWA."],
 "The two doors undo each other when the criterion is held fixed: 89.242460 dBA restates 265.610944 percent on NIOSH, just as 80.752126 dBA restates 27.748183 percent on the OSHA PEL. 316.227766 percent belongs to a TWA of exactly 90. 72.054478 percent is the OSHA action level noise dose of the same day, a different criterion.")

q(3, "A colleague takes the OBEN NIOSH TWA of 89.242460 dBA and puts it into the OSHA formula to get an OSHA noise dose. What is wrong?",
 "The TWA carries the NIOSH level and coefficient, so the result describes no record.",
 ["Nothing at all; a TWA is a sound level, so it can be read on any criterion you choose.",
  "Only the rounding: the TWA must first be taken to one decimal.",
  "The OSHA formula needs the TWA in minutes before the conversion."],
 "A TWA and its noise dose are one fact only while the criterion is fixed. A NIOSH TWA already has the 85 dBA criterion level and the 10.0 coefficient inside it, so feeding it to the OSHA formula mixes two criteria and gives a number that describes no record. To get the OSHA noise dose, run the periods on the OSHA criterion.")

q(0, "What does one decibel on the TWA do to the noise dose on each criterion?",
 "It multiplies the OSHA noise dose by 1.148695 and the NIOSH noise dose by 1.258925.",
 ["It multiplies the OSHA noise dose by 1.258925 and the NIOSH noise dose by 1.148695.",
  "It adds about 1.148695 percent to the OSHA noise dose, whatever the starting TWA.",
  "It multiplies both noise doses by 2, since a decibel is one step of doubling."],
 "The engine measures the ratio of the noise doses at two TWAs one decibel apart: 1.148695 on OSHA, where five decibels double the noise dose, and 1.258925 on NIOSH, where three do. The swapped pairing is the tempting slip. The effect is a ratio, the same at any TWA, and a doubling takes a full decibel exchange rate.")

q(2, "A proposed control would take 3 dB off a TWA. Roughly what does that do to the noise dose on the NIOSH noise REL?",
 "It nearly halves it, since three steps of 1.258925 make close to a doubling.",
 ["It cuts it by about a third, since three steps of 1.148695 compound to that factor.",
  "It cuts it by 3 percent, one percent for each decibel removed.",
  "It halves it exactly, since 3 dB is one full NIOSH step and so an exact doubling."],
 "One decibel multiplies the NIOSH noise dose by 1.258925, and three of those make a factor close to 2, so removing 3 dB nearly halves it. It is near and not exact because the printed 10.0 sits above the exact coefficient. 1.148695 is the OSHA ratio, and a decibel acts on the noise dose as a ratio and never as a fixed percentage.")

q(1, "On the OSHA scale, what noise dose does a TWA of 92 dBA restate?",
 "131.949999 percent.",
 ["501.187234 percent.",
  "100.000000 percent.",
  "199.996999 percent."],
 "D = 100 x 10^((92 - 90)/16.61) gives 131.949999 percent on OSHA. 501.187234 percent is the NIOSH figure at the same TWA, because the NIOSH criterion level is lower and its steps steeper. 100.000000 percent is the OSHA value at 90 dBA and 199.996999 percent at 95 dBA.")

q(0, "Which published table covers a noise dose from 10.000000 to 999.000000 percent in 150 rows?",
 "OSHA Table A-1, noise dose to TWA.",
 ["NIOSH Table 1-2, noise dose to TWA.",
  "OSHA Table G-16a, level to hours.",
  "NIOSH Table 1-1, level to hours."],
 "OSHA Table A-1 runs from 10.000000 to 999.000000 percent in 150 rows. NIOSH Table 1-2 converts the same kind of quantity over 83 rows from 20.000000 to 10000000.000000 percent. Tables G-16a and 1-1 tabulate the reference duration by level, so they cover no noise dose range at all.")

q(3, "A 132 dBA period is integrated on the OSHA PEL setup. What does the engine say about the number it returns for that level?",
 "It warns the formula is extrapolated past 130 dBA, the top of Table G-16a.",
 ["It refuses the level on `levelDbA`, since no table covers 132 dBA.",
  "It caps the period at 130 dBA and integrates it at that level.",
  "It reports nothing, since the noise dose is still under 100 percent."],
 "The engine's own words are \"a level of 132 dBA is above 130 dBA, the top of Table G-16a: the formula is extrapolated there\", and the period is still integrated under judgement J3, giving 84.448506 percent with 2 warnings. Past the top of a table there is no printed row to check against, so the number rests on the formula alone. Nothing is capped or refused.")

emit(Q, '/root/hse-wip-hygiene/banks/h2b_m05.json', expect_n=15)
finish()
