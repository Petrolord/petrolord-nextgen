import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC5 portfolio, advanced tier, The Expert Reading. Reconstructed from the served rows (the applied
# migrations replayed on a local scratch database) with the EC5 engine re-cut applied;
# written by tools/course-waves/portfolio/recut/build.py. Edit the rows there, then re-run it.

q(2,
 "A normal approximation gives the single wildcat (pos 0.300000, npv_p50 300.0000, fail_cost 50.0000) a Low case P90 of -150.5560. What is wrong with it?",
 "It lies below the worst possible outcome of -50.0000, a low case no portfolio can reach; the simulation's P90 is -50.0000, an outcome that can happen.",
 ["It is too optimistic, since the exact low case of a lone wildcat lies further below zero than -150.5560 once the fail cost is risked.",
  "It is right but imprecise, since a normal approximation settles on the exact low case once enough projects are added to the portfolio.",
  "It is right for the method and wrong for the inventory, since the wildcat's fail_cost of 50.0000 was entered as a loss in every year."],
 "The same approximation puts P(loss) at 0.365832 against an exact 0.700000; the engine draws success and failure and reads 0.696100 at seed 20260829 and 10000 iterations.")

q(0,
 "A reviewer raises the correlation on OKONO's 600.0000 set from 0 to 1 and expects its risked value to fall. What moves?",
 "The spread and the loss probability: stdDev widens from 143.8374 to 239.8888 and P(loss) climbs from 0.001800 to 0.059000, while emv stays 402.7500.",
 ["The emv, which falls as projects that fail together drag the expected value down, while stdDev is fixed by the entered spreads.",
  "The funded set, since the optimizer re-solves under the new correlation and swaps projects to diversify the portfolio.",
  "Only the P10, because correlation stretches the upper tail alone on a portfolio whose projects all carry a positive emv."],
 "One average correlation widens the spread and never moves the mean; the optimizer maximises summed risked EMV and correlation plays no part in choosing the set.")

q(3,
 "A capstone split returns valid false with an engine note. What does the expert answer do with the allocation?",
 "Quotes the engine note and bills nobody until the interests are corrected, even though the allocation is still shown.",
 ["Bills the partners on the allocation shown and attaches the note, since the engine still returns an amount for every party in the split.",
  "Scales the interests so that they total 100 percent and bills on the scaled shares, which is the correction the note asks for.",
  "Bills the operator its share and holds only the partners' bills, since only a partner interest can make the split invalid."],
 "In the published case with interests of 70 and 45 the operator share is -15.0000, an amount of -150.00 on a cost of 1000.00, so billing on the allocation bills a negative operator.")

q(1,
 "The capstone order starts with the inputs. Why write one risked EMV by hand, such as OK-3's, before running anything?",
 "A default or a quiet reading changes an input silently, so 0.250000 x 420.0000 - 0.750000 x 85.0000 = 41.2500 confirms the engine read what was typed.",
 ["The engine reports only the summed EMV of the funded set, so a project's own risked EMV exists nowhere unless it is worked out by hand.",
  "OK-3's success-case NPV of 420.0000 is its value, and the hand calculation shows how much of that value the optimizer keeps.",
  "The hand figure is the one the capstone grades, since the engine rounds each project's risked EMV to a whole million USD."],
 "An omitted pos defaults to 1 and a negative fail_cost reads as 0, with no warning; OK-3's risked EMV of 41.2500 is only 0.098214 of its success-case NPV.")

q(2,
 "OKONO at 450.0000 funds OK-1 + OK-3 + OK-4, solveMethod exact with optimalityGap 0.0000. On a run whose solveMethod reads grid-feasible, what must the answer add?",
 "The optimalityGap beside the EMV, the most a better set within the limit could add, since the fallback can fall short.",
 ["Nothing further, because overLimit false on the fallback certifies both that the set fits and that no better set was missed.",
  "The exact optimum, which the engine reports beside the fallback answer whenever the grid is used.",
  "A rerun on a different seed, since a fallback grid is sampled and the funded set moves from one seed to the next."],
 "The published gridUndershootFallback reads X + Y + Z at 660.0000 with optimalityGap 200.0000, where the exact optimum is 860.0000.")

q(0,
 "OKONO's 450.0000 set reads P(loss) 0.123600 and a Low case P90 of -18.3574. What must be written beside them?",
 "The seed 20260829, the 10000 iterations, and the correlation used, stated as one average number.",
 ["The resolution and overLimit of the set, since the simulated numbers are only as good as the grid that chose the set.",
  "The standard error alone, since a seed changes only the order of the draws and cannot move the count of losses.",
  "The exact answer and its z, since the engine prints both beside every loss probability it simulates for a funded set."],
 "Without its seed the same set could read 0.119100 or 0.128500, and at 1000 iterations its standard error is 0.010050.")

q(3,
 "OFON-1 reads SPI 1.141290 as of 2027-06-30 and 0.872063 as of 2027-08-15 on the same lines. Which of its numbers move with the as-of date?",
 "Planned value and SPI; earned value 15231500, CPI 1.009377 and the EAC of 27600000 are read from the lines as entered.",
 ["Planned value, SPI and CPI, since the actuals are counted up to the as-of date the same way the S-curve counts dated invoices.",
  "Earned value and SPI, since progress is prorated to the as-of date before it is weighted by the budget.",
  "SPI and the EAC, since the forecast rule switches a line to actual plus commitment once the as-of date passes its spend."],
 "Planned value is 13345861 at 2027-06-30 and 17466060 at 2027-08-15, so SPI moves while every number built on the lines alone does not; each SPI is right only for its date.")

q(1,
 "OFON-1's EAC is 27600000 by one forecast rule. Which lines forecast something other than their budget?",
 "CSG-02, at its actual plus commitment of 4300000, and CMT-03, at its entered 1400000.",
 ["DRL-01 and LOG-04, whose actual plus commitment of 12400000 and 1250000 sit below budget and so replace the budget as their forecast.",
  "CSG-02 alone, because an entered forecast above the budget is ignored and CMT-03 falls back to its budget of 1250000.",
  "Every line with spend posted, forecast at its actual plus commitment."],
 "The rule takes a positive entered forecast, otherwise the larger of the budget and actual plus commitment; the variance of -550000 is -400000 on CSG-02 and -150000 on CMT-03.")

q(2,
 "A capstone answer quotes OFON-1's CPI of 1.009377, correctly, with nothing beside it. Why does it lose marks?",
 "A CPI needs the actuals total beside it, 15090000 here, the amount earned value was divided by; with nothing spent CPI is null.",
 ["A CPI needs its as-of date beside it, because CPI moves with the date in the same way SPI moved from 1.141290 to 0.872063.",
  "A CPI needs its seed beside it, because every ratio in an expert capstone is simulated and moves from one run to the next.",
  "A CPI above 1 has to be reported as 1, because the engine caps each performance ratio at the budget before it writes the report."],
 "A correct number with its condition missing loses marks: a P90 without a seed, an SPI without an as-of date, a set without its solveMethod, and a CPI without the actuals total.")

q(0,
 "An answer reports OFON-1's EAC as 24949669, read off the Forecast of the S-curve's last monthly point, \"Nov 27\". What has it done?",
 "Turned an overrun into an apparent saving: the closing point and the metrics give the EAC as 27600000, a variance of -550000.",
 ["Reported the EAC correctly as of 2027-08-15, since the curve's Forecast line is the only projection that takes the as-of date into account.",
  "Reported the forecast before commitments, which the metrics add on top of the curve's last value to arrive at the EAC.",
  "Reported the plan in place of the forecast, since the two lines trade places after the as-of date and that point belongs to Planned."],
 "Nov 27 plans 24452483 and forecasts 24949669, both below the budget of 27050000; the closing point, \"30 Nov 27\", carries Planned 27050000 and Forecast 27600000.")

q(3,
 "OKONO at 600.0000 is rerun on a different seed. Which of its results can change?",
 "P(loss), the Low case P90 and the P10, which are simulated; the set, emv 402.7500 and stdDev 143.8374 are not.",
 ["P(loss) and the stdDev of 143.8374, which is the spread of the simulated draws and moves with them.",
  "P(loss) and the funded set as well, because the optimizer breaks ties between sets of equal EMV by a draw on the seed.",
  "None of them, because a seed fixes only the order of the draws, and every order of the same draws yields the same count of losses."],
 "emv and stdDev are closed form, and the optimizer is exact and deterministic; at 450.0000, P(loss) runs from 0.119100 to 0.128500 across seeds 1 to 3.")

q(1,
 "Which question do the portfolio and AFE engines hand over to field development planning?",
 "When a project's capex is spent and when first production arrives, since the portfolio engine takes each NPV as typed and never phases capex.",
 ["Which whole projects to fund under a limit, since the portfolio engine only ranks the projects by EMV per million USD and leaves the set to be chosen by hand.",
  "How widely a funded set's value could fall, since the risk summary is a screening estimate that planning replaces with its own.",
  "How each partner is billed for money spent, since the AFE engine tracks the budget and leaves working interests to planning."],
 "Neither engine shapes a development, chooses a well count or says whether a project should exist; OKONO at 450.0000 is a defensible set only on the NPVs entered.")

q(0,
 "Which sentence reports the P(loss) of OKONO's 450.0000 set the way this tier asks?",
 "P(loss) is 0.123600 at seed 20260829 and 10000 iterations, with a standard error of 0.003291, under a correlation of 0.",
 ["P(loss) is 0.123600 on the default settings, with the standard error of 0.010050 that any probability counted from the draws carries.",
  "P(loss) is 0.142035, what this set's emv and stdDev give once the noise of any one seed is taken out.",
  "P(loss) is 0.123600 to six decimals, a figure the seed makes exact, so that no standard error needs to be printed beside it."],
 "0.010050 is the standard error at 1000 iterations, and 0.003291 the one at 10000; 0.142035 is the normal approximation's figure, a different model.")

q(3,
 "Working the set, an answer places OKONO's 450.0000 optimum beside the ranking by EMV per million USD. What does the comparison show?",
 "The ranking funds OK-1 + OK-4 + OK-5 at 287.7500, while the optimizer funds OK-1 + OK-3 + OK-4 at 291.0000.",
 ["The two agree at 291.0000, since OK-3 ranks last by EMV per million USD and the ranking reaches it once the cheaper projects are funded.",
  "The ranking wins at 291.0000 and the optimizer trails at 287.7500, because the grid charges OK-3 an extra cell that pushes it out.",
  "The ranking funds OK-3 first for its success-case NPV of 420.0000; the optimizer drops it for OK-5."],
 "The ranking spends 420.0000 of the 450.0000; the best set is not the best projects, and OK-3 is funded at 450.0000 and dropped again at 600.0000.")

q(2,
 "Checking OFON-1's inputs before the AFE is read, an answer confirms every progress runs from 0 to 100 percent. Why does that check matter before the report is run?",
 "Because a single line outside it stops the whole report: the engine returns no metrics until that line is corrected.",
 ["A line above 100 percent is accepted and earns value beyond its budget, so it has to be read beside the CPI before the CPI is believed.",
  "Any line at 0 percent is treated as refused progress, and its budget is dropped from planned value.",
  "Any line at 100 percent, such as CSG-02, is clamped and its actual of 4300000 is taken out of CPI."],
 "The published case at 150 percent reads Cost item \"0\" has progress above 100 percent (150 percent); CSG-02 sits at 100.0000 percent, the most a line can earn, with actuals of 4300000 against a budget of 3900000.")

emit(Q, '/root/wt-ec45-recut/tools/course-banks/portfolio/advanced/ec5a_m06.json', expect_n=15)
finish()
