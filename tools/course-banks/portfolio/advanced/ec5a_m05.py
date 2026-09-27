import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC5 portfolio, advanced tier, Numbers to Distrust. Reconstructed from the served rows (the applied
# migrations replayed on a local scratch database) with the EC5 engine re-cut applied;
# written by tools/course-waves/portfolio/recut/build.py. Edit the rows there, then re-run it.

q(1,
 "OFON-1 with every actual set to 0 and progress unchanged reports earned value 15231500 and CPI 1.000000. What does that CPI say about cost performance?",
 "Nothing: earned value over zero actuals has no value, and the engine returns 1 whenever actuals are 0, the number an AFE exactly on budget shows.",
 ["That the work done cost exactly what it earned, since earned value is compared with the 5000000 committed when no actual has posted.",
  "That the AFE is on budget to the unit, because with nothing spent no line can yet have overrun its share of the 27050000 budget.",
  "That CPI is capped at 1 until the first invoice posts, so the 1.009377 the lines earned is held back until the costs catch up with the progress."],
 "OFON-1 as entered reads 1.009377 on actuals of 15090000; with actuals at 0 the 15231500 earned is either costs not yet posted or progress typed ahead of the work, and CPI hides both.")

q(3,
 "With every OFON-1 actual set to 0, which of its numbers as of 2027-08-15 still reads what it read before?",
 "SPI 0.872063, because earned value 15231500 never uses actuals and planned value 17466060 comes from the calendar.",
 ["EAC 27600000, because a line with no entered forecast forecasts its budget, and setting the actuals to 0 leaves every budget unchanged.",
  "CPI 1.009377, because CPI is read from progress and budget alone, and the actuals only feed the variance at completion.",
  "Percent spent 55.7856, because percent spent is measured against commitments, and the commitments are untouched when actuals are zeroed."],
 "The forecast rule takes the larger of the budget and actual plus commitment, so CSG-02, which forecast its actual of 4300000, moves with the actuals and the EAC moves with it.")

q(0,
 "The published \"past window, all invoices unpaid: none dated\" case holds an invoice of 100 with no invoice_date field and one of 200 whose invoice_date is null. Its first and last Actual both read 0, and the engine reports 2 undated invoices. Why?",
 "Neither invoice carries a date the engine can read, so neither reaches a bucket, and the count beside the curve names both.",
 ["The null date counts from 1970, which is earlier than every bucket, so the 200 sits in all 12 points while the invoice with no date field never counts.",
  "The curve falls back to the cost lines when no invoice carries a usable date, and the case's single line of budget 1200 has no actual typed on it.",
  "Both invoices are placed at the window start, and the 100 is netted against the 200 as a credit because neither can be put in date order."],
 "At Jan 20 Planned is 0 and Actual 0, and at Dec 20 Actual is still 0 beside Planned 1101: the curve carries no money it cannot date, and the count of 2 says how many invoices it left out.")

q(2,
 "OFON-1's invoice of 5200000 is dated 2027-04-10. At which S-curve point does it first appear, and why?",
 "May 27, where Actual steps from 3100000 to 8300000, because each point counts only invoices dated on or before its own day, the 1st of the month.",
 ["Apr 27, because a label names the month an invoice falls in, and every invoice dated inside that month is summed into its point.",
  "Jun 27, because an invoice is booked one whole month after its date to allow for payment, which is the lag behind every step.",
  "Aug 27, because the S-curve reads actuals from the cost lines, and only the as-of date of 2027-08-15 brings them onto the curve."],
 "Point 0 at Feb 27 reads 0 because nothing is dated before the window opens; an invoice the engine cannot date is left off the curve altogether and reported in the undated count beside it.")

q(1,
 "OFON-1's last Actual on the S-curve, 15090000, equals the actuals on its cost lines. What makes the two agree?",
 "The teaching field was built so: the metrics read the cost lines, the S-curve reads the invoices, and nothing in the engine reconciles them.",
 ["The engine derives each line's actual from the dated invoices, so the metrics and the curve share one source of spend by construction.",
  "The engine refuses an AFE whose invoice total differs from its line actuals, in the same way it refuses a line with negative progress.",
  "The as-of date of 2027-08-15 falls after the last invoice, and from that date on the curve switches its Actual line to the cost lines."],
 "An invoice the engine cannot date leaves the curve behind the lines however its date is missing, while the CPI of 1.009377 is computed from line actuals the curve never uses.")

q(3,
 "OFON-1's window runs 2027-02-01 to 2027-11-30 on a budget of 27050000, and the S-curve's last Planned point is 24452483. Why does the plan end 2597517 short?",
 "Each point sits on the 1st of its month, so the last one is the 1st of November and the rest of the window to 2027-11-30 is never plotted.",
 ["The plan spreads the budget less the 5000000 already committed, since commitments are drawn on the Actual line and cannot be planned twice.",
  "The plan holds back a contingency that is released only when the AFE closes, and the metrics carry that contingency inside the EAC instead.",
  "EC5-0 cut the curve at the as-of date of 2027-08-15 and extended the plan past it from the monthly rate, which loses the last weeks."],
 "The metrics do reach the budget: as of 2027-11-30 time progress is 1.000000 and planned value 27050000, so the chart and the metrics disagree about the same plan.")

q(0,
 "A reader of OFON-1's S-curve alone sees the last Forecast point at 24949669, below the budget of 27050000. What does the AFE actually forecast?",
 "An overrun: an EAC of 27600000 and a variance at completion of -550000, cut short on the chart by the same last bucket that stops the plan.",
 ["A saving, since the Forecast line is the only projection that reads the invoices, while the metrics forecast every unposted line at its full budget.",
  "Exactly the budget, because a line with no entered forecast forecasts its budget and the chart has simply not reached the last day yet.",
  "Both at once, an underrun on the chart and an overrun in the metrics, since the curve forecasts only to the as-of date and the metrics to completion."],
 "After the as-of date the Forecast line is the EAC spread from the start and stops at the last bucket; take the EAC and the variance from the metrics and use the curve for its shape.")

q(2,
 "The published \"future window ending on a bucket\" case has 13 points, and its last point reads Planned 2000 and Forecast 2450, the whole EAC. What decides whether a curve's last point reaches the budget?",
 "Where the end date falls against the month starts: a window ending on the 1st gets a point there, and OFON-1, ending on 2027-11-30, loses almost a month.",
 ["The size of the budget, since each monthly bucket of plan is rounded to whole units of the AFE currency, and a budget as small as 2000 loses nothing to that rounding.",
  "Whether any invoices exist, since a curve with no invoices has no Actual line to cut off and so draws its plan to the end of the window.",
  "The as-of date, since a default as-of date after the window lets the plan run to completion while a dated report stops the plan."],
 "The one-year 2020 case has 12 points and ends at Planned 1101 on Dec 20 against a budget of 1200, and OFON-1's last Planned point is 24452483 against 27050000.")

q(3,
 "On OKONO's 450.0000 set at the default seed, P(loss) reads 0.123600 at 10000 iterations and 0.125975 at 40000. What did quadrupling the iterations buy?",
 "A standard error that fell from 0.003291 to 0.001659, roughly half, and nothing about whether the model of the projects is right.",
 ["A standard error cut to a quarter of its 10000 iteration value, since the error of a counted probability shrinks in step with the number of draws.",
  "A result free of the seed, since at 40000 draws every seed converges on the same P(loss) to the fourth decimal and the seed stops mattering.",
  "A move toward the exact answer of 0.142035, which is the value the simulation converges on for this set as the draws grow."],
 "The standard error is sqrt(p(1 - p) / n), so four times the draws halves it: 0.010050 at 1000 iterations, 0.003291 at 10000 and 0.001659 at 40000.")

q(1,
 "At 10000 iterations OKONO's 450.0000 set reads P(loss) 0.128500 at seed 1, 0.127700 at seed 2 and 0.119100 at seed 3. Is that range wider than sampling alone explains?",
 "No: each run's standard error lies between 0.003239 and 0.003346, and seeds a few standard errors apart are what sampling alone produces.",
 ["Yes: seed 3 draws a stream biased toward success, which is why the engine publishes 20260829 as its calibrated default seed.",
  "Yes: at 10000 iterations every seed should agree to the fourth decimal, so a spread in the second decimal points to a fault in the random draws themselves.",
  "No: the three runs differ only in rounding, since a seed changes the order of the draws and never the count of losses among them."],
 "A seed buys a reproducible number and iterations buy a smaller standard error; neither buys a correct model, and rerunning seeds until P(loss) looks acceptable only picks sampling noise.")

q(0,
 "OKONO's 450.0000 set reads a Low case P90 of -15.1262 at 1000 iterations, -18.3574 at 10000 and -18.8524 at 40000, and -21.8586 to -15.3254 across seeds 1 to 3. What belongs to the set?",
 "That the Low case P90 is below zero, which every run agrees on; its fourth decimal moves with the sample, and the engine prints no standard error for it.",
 ["The value -18.3574 to four decimals, because a percentile is read straight off the sorted draws rather than averaged from them, and so carries no sampling error of its own.",
  "The value -57.1494, because the closed-form formula emv - 1.2816 x stdDev uses no draws at all and so removes the sampling noise that moves every simulated run.",
  "The average of the six runs, because averaging over seeds and iteration counts removes the sampling noise carried by each run."],
 "The Low case P90 is the 10th percentile of simulated portfolio NPV and wobbles by several million USD between runs; -57.1494 is the normal approximation, a different model.")

q(2,
 "The published riskMethod cases carry an exact answer, a standard error and a z. The single wildcat reads 0.696100 against an exact 0.700000, a z of 0.8510, and no case sits further than 1.4289. What does a seeded simulation promise?",
 "Agreement with its own model's exact answer within sampling error, and nothing more than that about the projects.",
 ["Agreement with the true loss probability of the projects within 1.4289 standard errors, whatever inventory is entered.",
  "A loss probability that never exceeds the exact answer, since the z is measured on one side of the exact value only.",
  "Agreement with the normal approximation within sampling error, since both methods rest on the same moments of the projects."],
 "The normal approximation gave the wildcat 0.365832, a different model with a different answer; the simulation's own model still funds whole projects under one average correlation with a normal success spread.")

q(1,
 "OKONO's 600.0000 set reports P(loss) 0.001800 at the optimizer's default correlation of 0. What can a reader conclude about how safe the set is?",
 "That it is safe only under a correlation of 0: the same set reads 0.059000 at rho 1.000000, and one average rho gives every pair of projects the same link.",
 ["That it is safe, because correlation widens the spread but leaves the emv of 402.7500 alone, and a portfolio can only lose money when that mean itself falls below zero.",
  "That it is safe to within its standard error, since P(loss) is counted from 10000 draws on a published seed that anyone can rerun, and a reproducible number is a trustworthy one.",
  "That it is unsafe, since a P(loss) as small as 0.001800 is below what 10000 draws can resolve, so the engine has returned the mark of a failed simulation run."],
 "stdDev widens from 143.8374 to 239.8888 as rho goes from 0 to 1; two projects that share a facility look like two that share nothing, and the model cannot test which is true.")

q(3,
 "A reviewer says the exploration well's lopsided entries, a high case far further from its middle value than its low case, are honoured by every simulated draw. What does the model actually do with them?",
 "As one symmetric normal spread of 191.1747, (700.0000 - 210.0000) / 2.5631, which discards the upward lean of the entered values.",
 ["As two half-normal spreads, one fitted above 420.0000 and one below it, so the upward lean of the entered values is kept in every draw.",
  "As a lognormal fitted through all three entered values, the shape the engine gives any project that carries a success spread.",
  "As the entered values themselves, drawing an outcome between 210.0000 and 700.0000 with an equal chance anywhere in that range."],
 "A normal success spread is a property of the model that no run changes: 700.0000 sits further above 420.0000 than 210.0000 sits below it, and the spread of 191.1747 treats both sides alike.")

q(2,
 "OFON-1 earns 15231500 because DRL-01 is typed at 72.0000 percent and CMT-03 at 55.0000 percent. What does its CPI of 1.009377 measure?",
 "Spending against progress someone typed: the engine checks no progress entry, so the CPI inherits whatever those percentages claim.",
 ["Spending against physical work the engine verifies, since each line's progress is cross-checked against its invoices on the S-curve.",
  "Spending against the calendar, since earned value is the budget times the share of the window elapsed at the as-of date.",
  "Spending against the budget alone, since CPI is the budget over the actuals and the progress entries only feed SPI."],
 "DRL-01 earns 14200000 at 72.0000 percent, 10224000 of the 15231500; the SPI of 0.872063 inherits the same entries, which is why the assumption is named beside the number.")

emit(Q, '/root/wt-ec45-recut/tools/course-banks/portfolio/advanced/ec5a_m05.json', expect_n=15)
finish()
