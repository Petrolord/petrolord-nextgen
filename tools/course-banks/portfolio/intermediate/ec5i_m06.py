import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC5 portfolio, intermediate tier, The Professional Reading. Reconstructed from the served rows (the applied
# migrations replayed on a local scratch database) with the EC5 engine re-cut applied;
# written by tools/course-waves/portfolio/recut/build.py. Edit the rows there, then re-run it.

q(3,
 "A graded reading of OFON-1 is worked with every calculation right, but the explorer was left on its default as-of date of today instead of 2027-08-15. Which of its metric readings are wrong?",
 "Only time progress, planned value and SPI.",
 ["Every number that depends on the lines, since the explorer recomputes earned value and the EAC for the date it is set to.",
  "Earned value, CPI and SPI, since all three divide by a figure the engine reads on the day the report is run.",
  "None, since the dashboard passes today as the as-of date and a report run today is the current reading of the AFE."],
 "EAC 27600000, variance -550000, earned value 15231500 and CPI 1.009377 are identical at every date, so the answer looks complete while its SPI answers a different question from 0.872063.")

q(1,
 "Working OFON-1 in the order lines, forecast, earned value, date, curve, at which step does an entered forecast that is not positive first become visible?",
 "The forecast step, where the branch each line took is written, because the rule ignores that figure and the line's fallback looks ordinary in the EAC.",
 ["The curve step, where the Forecast line jumps at the as-of date on any line whose entered forecast was ignored by the rule, lifting that line above the Planned line.",
  "The earned value step, where a line with no usable forecast earns nothing on its progress and pulls CPI down.",
  "The date step, since an entered forecast of 0 or less is treated as unplanned work and zeroes that line's planned value."],
 "The published negative forecast case returns EAC 100.0000 and variance 0.0000 with an entered -50, a total that shows nothing, so only the named branch on the line reveals it.")

q(0,
 "OFON-1's variance at completion is -550000. DRL-01, LOG-04 and CMP-05 each show a line variance of 0. What do those three zeros say?",
 "Only that spend and commitment have not yet passed the budget on those lines; with no entered forecast a line can never show a saving, so 0 is the rule's floor, and the whole -550000 is CSG-02's -400000 plus CMT-03's -150000.",
 ["That the three lines are on budget, since the rule forecasts each at the larger of budget and spend and none has gone over.",
  "That the three lines are under budget by their unspent balances, which the rule nets against the overruns on the other two.",
  "That the three lines are complete, since the forecast rule reports a zero variance once a line's progress reaches its budget."],
 "DRL-01 has 12400000 spent and committed against 14200000; its forecast is still 14200000, and any overrun still to come on drilling, logging or completion is not in the -550000.")

q(2,
 "With CMT-03's budget of 1250000 and the 940000 already spent and committed, an entered forecast of 900000 gives an item forecast of 900000, and an entered forecast of 0 gives 1250000. What does the pair show?",
 "Any positive entered forecast is taken as typed, even one below the money already spent and committed (finding EC5-1), while 0 is not positive and falls back to the larger of budget and spend plus commitment.",
 ["The rule floors an entered forecast at the spend plus commitment, and 900000 passed only because it is within tolerance of 940000.",
  "The rule treats 0 as a request to close the line at budget and 900000 as a request to cut scope, so both are honoured.",
  "The rule reads 900000 as a saving to be booked against the budget, which is why the variance on that line becomes positive at once."],
 "The same line with an entered forecast of 1 forecasts 1, so a typing slip passes straight into the EAC, and a forecast of 0 meant as a descope saves nothing on the report.")

q(0,
 "A partner sees OFON-1's cost performance index above 1 on one tile and an overrun of 550000 on another, and suspects one tile is wrong. What should the partner be told?",
 "CPI compares earned value from typed progress with actuals to date, while the EAC applies the forecast rule line by line, so CSG-02's spend and CMT-03's entered 1400000 overrun the budget whatever the index says.",
 ["They cannot both be right, since CPI above 1 means spend is below earned value and the forecast must then finish under the budget.",
  "CPI includes the commitments of 5000000 and the EAC does not, so the index is flattered by money that has not been spent yet.",
  "The EAC is dated at the end of the window and CPI at the as-of date, so the overrun is expected after 2027-08-15 and not before it."],
 "DRL-01, CMT-03 and LOG-04 earn more than they spent and carry CPI over 1, while the EAC of 27600000 comes from each line's branch of the one rule.")

q(3,
 "CSG-02 is 100.0000 percent complete, with a budget of 3900000 and an actual of 4300000. What does it contribute to OFON-1's earned value?",
 "Its budget, 3900000.",
 ["Its actual of 4300000, since a finished line has earned whatever it cost to finish, and its CPI on the line is then exactly 1.",
  "Its forecast of 4300000, since earned value weights progress by the item forecast once the rule's actual plus commitment branch is taken.",
  "Nothing yet, since earned value counts a line only when its invoices match its actuals, and CSG-02 has spent past the authorised sum."],
 "Earned value pays each line what the work was authorised to cost, so CSG-02 is the one line earning less than it spent, 3900000 against 4300000.")

q(1,
 "Write OFON-1's SPI as of 2027-01-15, 2027-08-15 and 2028-01-10. Which triple, with its reasons, is right?",
 "Null before the window opens, where planned value is 0; 0.872063 inside it, earned value 15231500 over planned value 17466060; and 0.563087 after the end, which equals percent complete divided by 100.",
 ["0 before the window opens, since nothing was planned; 0.872063 inside it; and 1.000000 after the end, where the whole plan has been reached.",
  "Null before the window opens; 1.141290 inside it, since the dashboard reads the planned value of the month the date falls in; and null after the end, when the plan is spent.",
  "0.563087 before the window opens, where the engine falls back to percent complete; 0.872063 inside it; and 0.563087 after the end."],
 "Only time progress, planned value and SPI move with the as-of date, so the three SPIs are three readings of the same lines on three days.")

q(3,
 "The published weighted earned value case reports earned value 110.0000, actuals 0.0000 and CPI 1.000000. How should a reader take that CPI?",
 "As undefined: the engine returns CPI 1 whenever actuals are 0.",
 ["As on budget, since the work earned was delivered for nothing and an index of 1 is the cost neutral reading that the engine reports.",
  "As a refusal marker standing in for null.",
  "As the ratio of earned value to planned value, since with no spend the engine substitutes the schedule index for the cost index on that AFE."],
 "The finding is recorded and not repaired, so CPI 1.000000 beside any earned value with no spend, 110.0000 here, is a division the engine declined to do and printed as a neutral number.")

q(2,
 "Why does a graded AFE reading compare the cost lines' actuals with the invoice total before any metric is quoted?",
 "Because the metrics read the lines and the S-curve reads the invoices, so if the totals differ the two describe different money, and that belongs at the top.",
 ["Because the engine refuses to compute CPI until the two totals agree, so a mismatch has to be cleared before the dashboard will load its tiles or export a report.",
  "Because the forecast rule reads actual plus commitment from the invoices, so a mismatch changes the EAC and has to be settled before the forecast branches are named.",
  "Because the invoice total is the audited figure, and the engine replaces line actuals with it on the as-of date whenever they differ."],
 "On OFON-1 both read 15090000 because the field was built that way; on a live AFE an accrual on a line or an invoice booked before the line is updated separates them, and an invoice the engine cannot date is kept off the curve and counted beside it.")

q(0,
 "A reader takes OFON-1's last Forecast point, 24949669, as the money the job will spend, and calls the rest of the EAC of 27600000 a saving. What went wrong?",
 "The curve stops at its Nov 27 point, standing on the first of November, before the end of the window, so the EAC is read from the metrics and only the shape from the curve.",
 ["The reader used the Forecast line where the Actual line applies, since past the as-of date the Actual line carries the committed spend to the end.",
  "The reader ignored the as-of date, since the last Forecast point moves up to the EAC once a report is run after the window's end, when every projected point has become an actual.",
  "Nothing, since the projected line nets the entered forecasts against their budgets and the gap is the saving it has identified."],
 "The last Planned point, 24452483, is short of the budget of 27050000 in the same way, a property of the engine as published; neither gap is money the job will not spend.")

q(3,
 "As of 2027-08-15, which of OFON-1's earned value, CPI and SPI can be rebuilt from the S-curve alone?",
 "None of them.",
 ["SPI, as the Actual at the Aug 27 point over the Planned at the same point, since both are cumulative to that day.",
  "Earned value, as the Forecast at the as-of date, since the curve projects the work done onto the window from the start.",
  "CPI, as the last Actual over the last Planned point, since both lines are drawn on one budget and share its denominator."],
 "The curve plots no earned value, no point stands on the as-of date, and planned value 17466060 falls between Aug 27 and Sep 27, so SPI 0.872063 and CPI 1.009377 come only from the metrics.")

q(2,
 "Two exports of OFON-1 from the repaired Suite agree on an EAC of 27600000 but show different SPIs. Where should the check start?",
 "At the as-of date each export was run for.",
 ["At each line's forecast field, since after EC5-0 the exports still apply different forecast rules and a copied budget changes SPI.",
  "At the invoices, since the S-curve feeds SPI and a late invoice moves the ratio in one export and not in the other.",
  "At the progress column, since progress is the only input SPI reads and the EAC agreeing proves the dates were the same."],
 "After EC5-0 every screen shares one forecast rule, so the EAC agrees; SPI moves with the date, 1.141290 on 2027-06-30 and 0.872063 on 2027-08-15 on identical lines.")

q(1,
 "A manager says OFON-1 is \"55.7856 percent done\" and cites its SPI of 0.563087 after the end as agreement. What has been mixed up?",
 "55.7856 is percent spent, actuals over budget, while 0.563087 after the end is percent complete 56.3087 divided by 100, work recorded as done.",
 ["Nothing, since SPI after the end is actuals over the budget and both numbers describe spend against the approved figure, read on the same basis at the same date.",
  "The manager has quoted CPI as a percentage, since 55.7856 is the cost index scaled by 100 and SPI after the end rounds to it.",
  "The SPI belongs to a report without dates, since an AFE with a window never reports SPI after its end day."],
 "Percent spent and percent complete share the budget as denominator, and dividing one into the other gives CPI 1.009377; spend is not work.")

q(0,
 "The tier ends on the sentence that an AFE report is a forecast rule, a date and the progress typed on the lines. Which pairing of number to input is right?",
 "The EAC rests on the forecast rule, earned value on the typed progress, and SPI on both the typed progress and the as-of date.",
 ["The EAC rests on the as-of date, earned value on the forecast rule, and SPI on the typed progress alone, since the forecast is dated by the report.",
  "The EAC rests on the typed progress, earned value on the as-of date, and SPI on the forecast rule.",
  "The EAC and earned value rest on the forecast rule, and SPI on the as-of date alone, since progress enters neither the EAC nor the schedule index."],
 "EAC 27600000 is the rule's branches summed, earned value 15231500 is progress weighted by budget, and SPI 0.872063 divides that earned value by the planned value of 2027-08-15.")

q(2,
 "A capstone answer gives OFON-1's planned value at the end of its window as 24452483, read off the last Planned point of the S-curve. Where should it have been read?",
 "From the metrics as of 2027-11-30, which give 27050000.",
 ["From the Forecast line's last point, 24949669, since the plan at completion is the EAC once the AFE has overrun its budget.",
  "From the S-curve, which is the plan of record.",
  "From the metrics as of 2027-08-15, since planned value is fixed on the as-of date and is not carried to the end of the window."],
 "The walk stops at the first of November because the next step falls after 2027-11-30, so the chart ends 2597517 short; on the end day time progress is 1 and planned value the whole budget.")

emit(Q, '/root/wt-ec45-recut/tools/course-banks/portfolio/intermediate/ec5i_m06.json', expect_n=15)
finish()
