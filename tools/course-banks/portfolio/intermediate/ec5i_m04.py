import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC5 portfolio, intermediate tier, The As-of Date. Reconstructed from the served rows (the applied
# migrations replayed on a local scratch database) with the EC5 engine re-cut applied;
# written by tools/course-waves/portfolio/recut/build.py. Edit the rows there, then re-run it.

q(1,
 "OFON-1 reports SPI 1.141290 as of 2027-06-30 and 0.872063 as of 2027-08-15, with earned value 15231500 in both reports. What moved between them?",
 "Planned value alone, from 13345861 to 17466060, because the budget is spread over more elapsed days while the progress column stood still.",
 ["Earned value, which the engine re-weights by the days elapsed so that the same progress is worth less later in the window, leaving the planned value where it was.",
  "CPI, which fell as invoices arrived between the two dates and took SPI down with it through their shared earned value.",
  "The EAC, which absorbed the overrun of -550000 between the reports and raised the plan that SPI is divided by."],
 "Only time progress, planned value and SPI move with the as-of date; 15231500 over 13345861 gives 1.141290 and over 17466060 gives 0.872063.")

q(3,
 "Which set of OFON-1 numbers is identical in a report dated 2027-01-15 and one dated 2028-01-10?",
 "Earned value 15231500, CPI 1.009377, actuals 15090000 and the EAC of 27600000.",
 ["Time progress and planned value, since both are clamped at the edges of the window and every date outside it reads the same clamp.",
  "SPI and CPI, since both are ratios of numbers read from the lines and a ratio of fixed numbers cannot drift with the calendar.",
  "Planned value and earned value, since both are the budget of 27050000 weighted by a fraction and neither fraction is dated."],
 "The lines as entered carry no date, so earned value, actuals, CPI and EAC read the same on every as-of date, while time progress runs from 0.000000 on the first date to 1.000000 on the second.")

q(2,
 "OFON-1's window opens on 2027-02-01. What SPI does the repaired engine report as of 2027-02-01 itself?",
 "Null, because no whole day has elapsed on the start day, so time progress and planned value are both 0.",
 ["1.000000, because on the start day the job is exactly on schedule.",
  "Infinity, because earned value of 15231500 is divided by a planned value of 0 and the division is carried out as written.",
  "0.563087, because a report on the boundary of the window falls back to percent complete divided by 100 as a report with no window does."],
 "The start day reads exactly as the day before the start: time progress 0.000000, planned value 0, SPI null. Planned value first appears on the day after the start.")

q(0,
 "A portfolio screen sorts AFEs by SPI and counts a null SPI as 0. What does that do to OFON-1 in a report dated 2027-01-15?",
 "It ranks OFON-1 among the worst performers, inventing a reading of nothing earned against a real plan when the engine said no plan existed yet to measure against.",
 ["Nothing that matters, because a null and a 0 both mean no schedule performance, and the sort only separates AFEs that have started.",
  "It ranks OFON-1 as exactly on schedule, since the sort treats the missing ratio as the neutral value of a performance index.",
  "It removes OFON-1 from the sort entirely, because a screen drops rows whose sort key cannot be compared with a number."],
 "Null says the ratio does not exist yet. Counting it as 0 puts every AFE that has not started at the bottom; counting it as 1 hides them among the healthy ones.")

q(1,
 "How does the engine arrive at OFON-1's time progress of 0.645695 as of 2027-08-15?",
 "195 whole days elapsed since 2027-02-01, over the 302 whole days from the start to the end of the window.",
 ["The share of the budget already invoiced, the 15090000 of actuals over the 27050000 budget, read as the fraction of time used.",
  "The whole months elapsed at the first of August over the months in the window, since the plan steps once a month.",
  "The days elapsed since the first invoice on 2027-02-20 over the days to the end, since the plan starts when spending does."],
 "Time progress is elapsed whole days over total days: 195 over 302 gives 0.645695, and 149 over 302 gives the 0.493377 of 2027-06-30.")

q(3,
 "The budget of 27050000 multiplied by the printed time progress 0.493377 lands a few units away from the planned value of 13345861 the engine prints for 2027-06-30. Which figure should a report quote?",
 "13345861, because the engine multiplies the unrounded fraction.",
 ["The product of the budget and the printed fraction, because the printed fraction is the one a reviewer can check by hand.",
  "Either one, because a difference of a few units on a budget of 27050000 is inside the rounding of whole-unit AFE money.",
  "The product of the EAC and the printed fraction, because planned value is recomputed against the forecast once the AFE overruns."],
 "The fraction prints to six decimals while the planned value comes from the full-precision fraction, 149 over 302, so the engine's 13345861 is the number SPI was divided by.")

q(0,
 "OFON-1's SPI is above 1 at 2027-06-30 and below 1 at 2027-08-15. DRL-01's rig time, 14200000 of the budget, is spent early and CMP-05's 5600000 of completion late. What can the two SPIs be, before any slippage is assumed?",
 "The shape of a well measured against a plan that is a straight line in calendar days and knows nothing about which work comes first.",
 ["Proof that the job was ahead in June and fell behind in August, since both readings divide the same earned value by a correct plan for each day.",
  "A phasing error in the plan, since the engine front-loads DRL-01's budget and the plan overshoots the work by August.",
  "The effect of CPI 1.009377, which scales planned value by cost performance and pulls SPI below 1 once spend outruns the plan."],
 "The plan the engine divides by is one straight line for the whole AFE; with earned value fixed at 15231500 the ratio falls from 1.141290 to 0.872063 on the calendar alone.")

q(2,
 "Between OFON-1's reports of 2027-06-30 and 2027-08-15, SPI fell while earned value stayed at 15231500. What can the engine tell you about why?",
 "Nothing that separates the two causes: the work may have stopped for those weeks, or nobody updated the progress column, and the lines look the same either way.",
 ["That the work stopped, because a progress column that was not updated would have raised actuals without raising earned value and moved CPI.",
  "That progress went unrecorded, because a stoppage would also have stopped the plan and left SPI where it stood in June.",
  "That the rig stood idle, because SPI below 1 on the second date is the engine's measure of lost working days against the window."],
 "Planned value grew from 13345861 to 17466060 while earned value stood still, and CPI of 1.009377 on both dates never looks at the calendar, so neither index can choose between the explanations.")

q(1,
 "As of 2028-01-10, after OFON-1's window closed on 2027-11-30, SPI is 0.563087. What does that number measure?",
 "Earned value over the whole budget, which is percent complete 56.3087 divided by 100, so it no longer measures pace against a plan.",
 ["Schedule pace against the window, which will keep falling on each later report as the AFE runs further past its end date and the plan keeps growing.",
  "Earned value over the EAC of 27600000, since after the end the plan is replaced by the forecast of what the work will cost.",
  "The average of the SPIs reported across the window, which the engine carries forward once no further planned value accrues."],
 "From the end day planned value is 27050000 on every date, so 15231500 over 27050000 reads 0.563087 until somebody changes progress on the lines.")

q(3,
 "OFON-1's planned value stops at 27050000 on and after its end day, though its EAC is 27600000. What does that mean for a late AFE that is also overrunning?",
 "It is measured against the approved budget, the smaller number, because the forecast never enters planned value.",
 ["Its SPI is overstated by the overrun, because the engine switches planned value to the EAC after the end and earned value does not follow.",
  "Its overrun of -550000 appears as a schedule loss, because planned value absorbs the variance at completion on the end day.",
  "Nothing, because SPI stops being reported once the window has closed."],
 "Planned value is the budget times time progress, so the most it can be is 27050000; setting planned value against the EAC and calling the overrun a schedule problem is a documented mistake.")

q(2,
 "The published case with no window dates returns time progress 1.000000 and SPI 0.250000. What does the engine do with an AFE saved without a window?",
 "Reports it as though the window had already ended, dividing earned value by the whole budget, a fallback EC5-0 did not change.",
 ["Refuses it with AfeInputError, because planned value cannot be formed without a start date and an end date.",
  "Reports SPI null, as it does before the start, because with no window no day has elapsed inside it.",
  "Measures it against today, treating the report date as the end of the window so that time progress is always 1 on the day it runs."],
 "The fallback to time progress 1 remains in the engine as published, and the repaired Suite labels SPI unavailable for such an AFE; a low SPI there is not a late project.")

q(0,
 "An as-of date of 30 February is passed to an AFE that has no window dates at all. What does the engine return?",
 "A refusal, AfeInputError: \"asOf is not a valid date\", even though the AFE has no window the date could be placed in.",
 ["Time progress 1.000000 and the no-dates SPI, because without a window the as-of date is never read and cannot be wrong.",
  "A report dated the first valid day after the typed one, since the date parser rolls an impossible day forward into March.",
  "SPI null, because an unreadable date is treated as a date before the start, where planned value is 0."],
 "The published refusals cover a string that is not a date, a month 13 and 30 February, and they fire on an AFE with no window as well.")

q(3,
 "Before EC5-0 the AFE wizard asked for no dates. What SPI would a report on OFON-1 have shown on its first day of drilling?",
 "0.563087, the same as on its last day.",
 ["Null, because a report on the first day of drilling falls on the start of the window, where no whole day has elapsed.",
  "Infinity, because the old engine divided earned value by a planned value of 0 whenever it was run before the plan had grown.",
  "1.141290, because the old engine read the clock and the first day of drilling came early in the window, where the plan was small."],
 "With no window, time progress fell back to 1, so SPI equalled percent complete 56.3087 divided by 100 on whatever day the report was opened.")

q(2,
 "A monthly pack labelled as of 2027-08-15 divides OFON-1's earned value of 15231500 by a planned value of 13345861 and prints 1.141290. What went wrong?",
 "The planned value belongs to 2027-06-30, so the pack reports June's SPI under August's date; as of 2027-08-15 planned value is 17466060 and SPI 0.872063.",
 ["Nothing, because earned value and CPI are the same on both dates, so SPI is too and the pack simply chose the more favourable planned value.",
  "The earned value is stale, because earned value as of 2027-08-15 is larger than in June and the numerator should have been updated with it.",
  "The pack used planned value where it should have used actuals of 15090000, which is the August denominator the engine divides by."],
 "Dividing an earned value from one date by a planned value from another is the second form of the undated SPI; the engine's planned value for 2027-08-15 is 17466060.")

q(1,
 "A report dated 2027-01-15, before OFON-1's window opens, shows earned value 15231500 from DRL-01 at 72.0000 percent and CSG-02 at 100.0000 percent. What does the engine make of that?",
 "It reports it without complaint, since it never asks whether progress is plausible for the date, so the reader must suspect the window or the progress column.",
 ["It sets earned value to 0 before the start, since work cannot be earned before a window opens, and reports CPI null beside it.",
  "It flags the AFE invalid, since earned value above planned value of 0 is the case the EC5-0 repair was written to catch.",
  "It reports SPI null and zeroes the progress it cannot schedule, leaving only CSG-02's finished line in earned value."],
 "Before the start SPI is null, but earned value 15231500, CPI 1.009377 and the EAC of 27600000 are all still reported, because they are read from the lines and not from the calendar.")

emit(Q, '/root/wt-ec45-recut/tools/course-banks/portfolio/intermediate/ec5i_m04.json', expect_n=15)
finish()
