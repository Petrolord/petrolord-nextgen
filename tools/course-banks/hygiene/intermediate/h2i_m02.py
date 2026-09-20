import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H2 Professional m02, the week and the time to reach a target.
# Figures from digest Section 12 (the three weeks, the loud day removed, the
# golden's four-day case, the lexAllowedDurationH table), Section 10 (the weekly
# refusals) and Section 11, with an Associate recap from Section 4 for a
# wrong-criterion distractor. The divisor of 5 on a week that is not five days
# is ORACLE ONLY and is taught as such. No capstone site, input or answer.

q(1, "A five-day week has daily LEX,8h values of 86.400000, 83.100000, 88.200000, 84.900000 and 81.700000 dBA. What weekly noise exposure level does the engine return?",
 "85.461288 dBA",
 ["84.860000 dBA", "83.414860 dBA", "88.200000 dBA"],
 "Each day is turned into an energy term, the five terms are added, the sum is divided by 5 and turned back into decibels: 85.461288 dBA. 84.860000 dBA is the arithmetic mean of the five days, which weights a loud day the same as a quiet one; 83.414860 dBA is the week with the loud day removed; 88.200000 dBA is the loudest day read as the week.")

q(3, "The five-day week reads 85.461288 dBA against an arithmetic mean of 84.860000 dBA. Why is the weekly level the higher of the two?",
 "It is an energy average, so the loud days carry more weight than the quiet ones.",
 ["It adds a fixed penalty for every day above the upper action value, which lifts the week.",
  "The mean is computed over seven days of the calendar week, which pulls it down.",
  "The weekly level uses the loudest day as a floor and cannot fall below it."],
 "On the energy scale a day three decibels louder carries about twice the energy, so the loud days pull the energy average above the plain mean. There is no penalty term in the formula, the mean is taken over the same five days, and the weekly level sits well below the 88.200000 dBA loudest day, so that day is no floor.")

q(0, "The engine is given four daily LEX,8h values for a week. By what number does it divide the sum of their energy terms?",
 "5, the nominal five-day week, whatever the number of days given",
 ["4, the number of days actually worked that week",
  "7, the number of days in a calendar week",
  "8, the reference hours of the daily level"],
 "The judgement call J10: the weekly LEX always divides by 5 and accepts at most 7 days, so four days report days 4 and are still divided by 5. Dividing by 4 would average the days worked, dividing by 7 would spread the week over the calendar, and the 8 hour reference belongs inside each daily LEX,8h and never enters the weekly sum.")

q(2, "Four days at 90 dBA give a weekly noise exposure level of 89.030900 dBA. Why does it sit below the level of every day in it?",
 "Four days of energy are charged against a nominal five-day week, so the week carries less energy than five days at 90 dBA.",
 ["The engine drops the loudest day of any week shorter than five days, so only the three remaining days are averaged into the weekly level.",
  "A weekly level is always about one decibel below the daily level, as a fixed allowance the regulation grants for the rest days in a week.",
  "The weekly formula applies the Brief and Scala weekly factor, which lowers the reading for a short week in proportion to the hours missed."],
 "The four energy terms are divided by 5, as the J10 call writes it, so the week reads below 90. That divisor on a week that is not five days is ORACLE ONLY: the engine and an independent oracle agree, and no printed case is known to set against it. No day is dropped, there is no fixed allowance, and Brief and Scala adjust a limit in the Expert tier and never enter the weekly LEX.")

q(0, "What is the evidence class of the weekly LEX on a week of four or six days?",
 "Oracle only: the engine and an independent oracle agree, and no printed case with other than five days is known.",
 ["Published and reproduced, because the L108 Figure 26 example fixes the weekly divisor as well as the energy averaging of the daily one.",
  "Transcription only, because the engine and the oracle copied the divisor from the same figure printed in the regulation's text.",
  "Arithmetic by definition, because a weekly average has no constant other than its window."],
 "Figure 26 reproduces the energy averaging the week shares with the day, and it says nothing about the divisor of 5. The divisor is the statutory formula and no printed case with other than five days is known, so on such a week the result is ORACLE ONLY. Transcription only is the class of constants two files copied from one page, such as the heat stress equation constants. Arithmetic by definition belongs to averages whose only constant is their window, and the weekly divisor of 5 is a statutory choice that the days averaged do not supply.")

q(2, "The weekly LEX has one published case, five equal days at 85 dBA giving 85. Why does that case fix so little?",
 "Any averaging of five equal numbers returns the same number, so it cannot tell the energy average or the divisor apart from anything else.",
 ["It was printed to whole decibels, so it cannot catch an error in the sixth decimal of a weekly level, which is where a wrong divisor would show.",
  "It sits exactly on the upper action value, and a case that lands on a boundary is excluded from the golden, so the suite never checks its value.",
  "It is taken from an ACGIH table, so its value cannot be quoted in this course."],
 "An arithmetic mean, an energy average or a median of five days at 85 dBA all return 85, so the case would pass a wrong method. That is why the divisor of 5 is ORACLE ONLY on weeks that are not five days. The precision of the print is not the weakness, a boundary value does not exclude a case, and no licensed table is involved.")

q(3, "Remove the 88.200000 dBA day from the five-day week and keep the engine's divisor. What weekly noise exposure level results?",
 "83.414860 dBA",
 ["84.860000 dBA", "85.461288 dBA", "81.700000 dBA"],
 "The four remaining days are still divided by 5, so the week loses the loud day's energy and gains nothing: 83.414860 dBA. 84.860000 dBA is the arithmetic mean of all five days and 85.461288 dBA the week with the loud day still in it; 81.700000 dBA is only the quietest day.")

q(1, "The five-day week falls from 85.461288 to 83.414860 dBA when the loud day is taken out. What does the second figure mean under the regulation?",
 "The weekly level of a person who worked the other four days and was away on the loud one.",
 ["An error, because a week without five days cannot be computed.",
  "The weekly level after the loud day has been controlled to the level of the quietest day, 81.700000 dBA.",
  "The arithmetic mean of the four remaining days, as the formula requires once a day is removed."],
 "The divisor stays at 5, so four days of energy over a nominal five-day week is exactly what the regulation computes for someone absent on the loud day. The engine accepts one to seven days, the loud day is removed and not replaced at 81.700000 dBA, and the result is still an energy average.")

q(1, "A crew works six days at 84.200000 dBA each, and the engine reports 84.991812 dBA for the week. What produces the rise?",
 "Six days of energy are divided by 5, so a longer week reads above its daily level.",
 ["The weekly level adds one decibel for every day worked beyond five, as the allowance for a longer week.",
  "The six days are rounded up to the upper action value of 85 before they are averaged into the week.",
  "The engine refuses six days and reports the level of five of them in their place, which reads higher."],
 "J10 keeps the divisor at 5, so a sixth day adds energy without adding to the denominator and the week rises to 84.991812 dBA. That result, on a week that is not five days, is ORACLE ONLY. There is no per-day increment, no rounding to an action value, and the engine accepts up to 7 days.")

q(3, "In the five-day week, which day would you target first for noise control, and why?",
 "The 88.200000 dBA day, because the energy average gives it the largest share of the week.",
 ["The 81.700000 dBA day, because the quietest day is the cheapest to improve and every day weighs one fifth.",
  "Any of them, since each day is one fifth of the weekly level whatever its sound level.",
  "The 84.900000 dBA day, because it sits nearest the upper action value."],
 "The loudest day sits more than six decibels above the quietest and carries several times its energy; removing it alone drops the week from 85.461288 to 83.414860 dBA. Weighting each day as one fifth is the arithmetic mean, and nearness to an action value says nothing about a day's share of the energy.")

q(0, "From `lexAllowedDurationH`, how many hours at 94.000000 dBA alone bring the day to a LEX,8h of 85?",
 "1.007140 h",
 ["0.318486 h", "1.596210 h", "4.594793 h"],
 "The door returns 8 x 10^((85 - 94)/10) hours, 1.007140 h. 0.318486 h is the time at the same level to reach 80, and 1.596210 h the time to reach 87, so each reads the wrong target column. 4.594793 h is the OSHA reference duration at 94 dBA from the Associate tier, a different criterion on a decibel exchange rate of 5 dB.")

q(2, "Why are the hours to reach LEX,8h 85 at 85.000000 dBA exactly 8.000000?",
 "Eight hours at 85 dBA is LEX,8h 85 and 100 points, the pivot of the whole metric.",
 ["85 dBA is the OSHA action level, defined as a TWA over eight hours on a decibel exchange rate of 5 dB.",
  "The door caps every answer at one eight-hour working shift, whatever level and target it is given.",
  "The EU limit value is 87 dBA, two decibels above the target."],
 "The reference duration T0 is 8 hours and the points pivot is 85 dBA, so the level and the target coincide at exactly 8.000000 h. The OSHA action level is a different metric on a different relation, the door caps nothing (it returns 25.298221 h at 82 dBA to 87), and the limit value has no part in this row.")

q(3, "At 82.000000 dBA the door says 25.298221 hours are needed to reach LEX,8h 87. What should you read from that?",
 "The target cannot be reached in a day at that level; the door returns the arithmetic and leaves that reading to you.",
 ["The engine should have refused the request, because no answer above 24 hours can be a daily figure, so the number is an error to report.",
  "The level is under the lower action value, so the result is set to 24 hours.",
  "The figure is in minutes, so the target is reached in under half an hour."],
 "The door answers a level and a target with a number of hours and does not refuse one above a day; noticing that 25.298221 h exceeds 24 is the reader's job. Nothing is capped at 24 hours, and the table is in hours throughout.")

q(0, "At 88.000000 dBA the hours to LEX,8h 85 are 4.009498, and at 91.000000 dBA they are 2.009509. Why is the second close to half the first but not exactly half?",
 "Three decibels roughly doubles the energy, and 3 is a rounding of the exact doubling step.",
 ["The door adds a small margin at higher sound levels to allow for the hearing protector a worker would be wearing.",
  "Every level above 90 dBA is capped by the OSHA table, which bends the curve.",
  "The two figures come from different criteria, each with its own decibel exchange rate, so they cannot halve exactly."],
 "The hours fall by a factor of ten for every ten decibels, so three decibels divides them by a little under two, and each step of three roughly halves the hours. No protector enters the door, no OSHA table applies to the energy relation, and both figures come from the same formula.")

q(1, "A loud task's `lexAllowedDurationH` figure assumes it is the only task. On a real day with other tasks, how do you find the hours left at the loud task?",
 "Subtract the other tasks' noise exposure points from the target's points and convert the remainder into hours at the loud task's level.",
 ["Subtract the other tasks' hours from the table's figure, since time is what the door returns and hours on a day add up whatever the level.",
  "Take the table's figure as it stands, because the door already allows for a full day of other work.",
  "Average the loud task's level with the other tasks' levels and read the table at that average."],
 "Points add, so the allowance left is the target's points less the points already used, converted back into hours at the loud task's sound level. Hours at different levels are not interchangeable, the door answers for one task in isolation, and an average of levels is not an energy quantity.")

emit(Q, '/root/hse-wip-hygiene/banks/h2i_m02.json', expect_n=15)
finish()
