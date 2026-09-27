import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC5 portfolio, intermediate tier, The S-Curve. Reconstructed from the served rows (the applied
# migrations replayed on a local scratch database) with the EC5 engine re-cut applied;
# written by tools/course-waves/portfolio/recut/build.py. Edit the rows there, then re-run it.

q(2,
 "OFON-1's S-curve as of 2027-08-15 opens on a point labelled \"Feb 27\". What does that label denote?",
 "February 2027, a short month name and a two-digit year, on a point standing on the start date 2027-02-01 with every column cumulative to that day.",
 ["The 27th of February, the monthly billing cut-off to which each point's invoices are summed.",
  "The last day of February 2027, since each point closes its month and carries that month's invoices.",
  "Point 27 of the window, counted in days from the start, which is where the first bucket is closed."],
 "Each point sits on the start date stepped forward by whole months, the 1st on OFON-1, so the invoice of 2027-02-20 shows an Actual of 0 at Feb 27 and first appears at Mar 27.")

q(0,
 "A monthly report reads OFON-1's \"Jul 27\" Actual of 12700000 as spend to the end of July, then flags an August spike of 2390000 at \"Aug 27\". What happened?",
 "The invoice of 2027-07-18 is dated after the 1 July point and first counts at the 1 August point, so the spike is a reading of the labels and no August spending.",
 ["The invoice was billed in July but paid in August, and the curve records invoices when they are paid.",
  "August's point includes the commitments on the lines, which enter the Actual line once a month closes.",
  "The curve lags spend by one bucket by design, so the August point is July's spend delayed to hold accruals out."],
 "Actual at a point counts invoices dated on or before that day, so Jul 27 holds 3100000, 5200000 and 4400000, and 2390000 takes Aug 27 to 15090000.")

q(3,
 "OFON-1's metrics report planned value 17466060 as of 2027-08-15. Where does that number sit on the S-curve drawn at the same as-of date?",
 "On no point: it falls between Aug 27 at 16212086 and Sep 27 at 18988742, since no bucket stands on the as-of date.",
 ["On the Aug 27 point, which the engine moves to the as-of date whenever the date falls inside that month, so the chart and the SPI agree.",
  "On the Forecast line, where planned value is redrawn from the EAC.",
  "On the Sep 27 point, because the curve rounds the as-of date forward to the next bucket so that the plan it shows is never understated."],
 "The buckets are a fixed monthly grid with no point on the as-of date, so the planned value SPI 0.872063 was divided by is not plotted, and earned value 15231500 is not plotted at all.")

q(1,
 "OFON-1's Planned line adds 2687086 into the May 27 point but 2776656 into the Aug 27 point. Why do the steps differ?",
 "The plan is straight in calendar days, so a month with more days adds more plan.",
 ["The plan is phased by cost line, and DRL-01's rig time weights the drilling months more heavily than later ones.",
  "Each step is the budget less the invoices so far spread over the months left, so it changes as invoices arrive.",
  "The engine rounds each point to whole units separately, and the rounding error accumulates into alternating steps."],
 "Planned is the budget of 27050000 times elapsed days over the days in the window; the month into May 27 is shorter than the month into Aug 27, so it adds 2687086 against 2776656.")

q(1,
 "A planner wants OFON-1's Planned line to front-load DRL-01's 14200000 of rig time and hold CMP-05's 5600000 of completion to the end. What does the engine offer?",
 "Nothing: it draws one straight line for the whole AFE, with no plan per line and no phasing to enter, charging every calendar day an equal slice of the budget.",
 ["A phasing field on each line, which reshapes the Planned line once every line carries a start and end month of its own.",
  "An S-shaped plan by default, since the curve's name promises one and the straight line appears only for an AFE with a single line, which the engine bends to the invoices.",
  "A plan per line summed across the window, which the engine builds from each line's progress so that finished work is planned early."],
 "The plan has no shape the user can give it, so an Actual above Planned at Mar 27 and below it at Apr 27 is an invoice date meeting a straight line and not news about the well.")

q(2,
 "At OFON-1's Aug 27 point the Actual is 15090000 and the Planned is 16212086. A reader calls the gap \"behind schedule\". What is the gap?",
 "Spend below a straight budget line, a cost comparison with no progress in it; the schedule measure is SPI 0.872063, earned value over planned value.",
 ["Earned value below planned value on the day of the point, which is the curve's plot of SPI in money in place of a ratio at each of the monthly buckets it draws.",
  "Commitments not yet invoiced, which the Actual line holds back until billing and which the Planned line already includes.",
  "Schedule slippage in money, since planned value and actual cost measured on the same day together form the schedule variance that the curve plots at every point."],
 "SPI divides earned value, 15231500 from the progress column, by planned value; the curve never plots earned value, so no gap on it is a schedule reading.")

q(0,
 "On a live AFE the cost lines' actuals total more than the S-curve's last Actual at or before the as-of date. What is each describing?",
 "Percent spent and CPI describe the actuals typed on the lines, the Actual line describes the dated invoices, and nothing on the screen says which is which, so the difference is a question about accruals, billing or a missing date.",
 ["The same money on two schedules, since the curve converts line actuals into invoices by date and the gap is spend not yet reached by a bucket.",
  "An error in the engine, since it forces the invoices to match the lines and a gap can only mean the curve was drawn from stale data.",
  "Commitments, since the lines carry actual plus commitment and the curve carries the actual alone, and the gap is what is on order."],
 "The metrics sum the actual column and the S-curve sums invoices; on OFON-1 both read 15090000 because the teaching field was written to match, which teaches the wrong habit.")

q(3,
 "A published case bills two invoices over a past window: 100 with no date field and 200 whose date is null. The first and last points both read an Actual of 0. What happened to each invoice?",
 "Neither could be dated, so neither reached the curve, and the engine reported 2 undated invoices beside it.",
 ["The null date was read as a day in 1970 and counted in every bucket of the curve, while the invoice with no date field never counted at all.",
  "The engine refused the missing field and dropped that invoice with a warning, while it booked the null date at the start of the window as an opening balance.",
  "Both counted on the as-of date, the only day an undated invoice can take."],
 "An invoice the engine cannot date reaches no bucket, however its date is missing; the count of undated invoices, 2 here, is reported beside the curve so the money is named.")

q(1,
 "OFON-1's Forecast reads 15090000 at Aug 27 and 19374834 at Sep 27, the first point after the as-of date of 2027-08-15. What is the step?",
 "A change of formula: past the as-of date the Forecast is the EAC spread from the start of the window, ignoring the actuals it follows.",
 ["The spend expected in September, the EAC less the actuals to date spread over the months left in the window.",
  "The commitments of 5000000 falling due in the first month after the report, added onto the last Actual as they are billed by the contractors.",
  "A burn rate taken from the last invoices and carried forward from 15090000, which is why the step repeats at each projected point until the end."],
 "The projection never starts from 15090000 and adds spend still to come; the step's size depends on how far the actuals sit from a straight line, which says nothing about September.")

q(2,
 "Why does OFON-1's Forecast sit above Planned at every projected point, 19374834 against 18988742 at Sep 27 and 24949669 against 24452483 at Nov 27?",
 "It is the Planned line redrawn with the EAC of 27600000 in place of the budget of 27050000.",
 ["It scales the plan by CPI 1.009377, so every projected point is lifted by the cost performance of the work done so far.",
  "It adds the commitments of 5000000 to the plan from the as-of date, since committed money is certain to be spent.",
  "It carries forward the gap between Actual and Planned at the last actual point, holding that gap constant to the end."],
 "The EAC exceeds the budget by a variance at completion of -550000 and the whole projected line carries that ratio; earned value and CPI play no part in the projection.")

q(0,
 "Suppose CSG-02's budget were typed into its forecast field. What would that do to CSG-02 and to OFON-1's Forecast line?",
 "The copy is a positive entered forecast, so the rule takes 3900000 whatever CSG-02 has spent, hiding its line variance of -400000 and settling the Forecast line toward the Planned line.",
 ["Nothing to CSG-02, because the rule compares an entered forecast with actual plus commitment and keeps the larger 4300000.",
  "It would have raised CSG-02's forecast to its actual, since a copied budget is recognised as a default and ignored by the rule.",
  "It would have removed CSG-02 from the EAC, since a forecast equal to the budget carries no variance and the line drops out."],
 "A positive entered forecast wins under the one rule, so a typed 3900000 replaces the 4300000 already spent in the EAC; the engine flags the line forecastBelowCommitted, but the forecast stands.")

q(3,
 "OFON-1's Nov 27 point plans 24452483 against a budget of 27050000. Does the S-curve's plan stop short of the budget?",
 "No. Nov 27 is only the last monthly point; the closing point \"30 Nov 27\" carries Planned 27050000, as the metrics do on the end day.",
 ["Yes, because the curve spreads the budget over the months before the end month and leaves the final month for contingency that is never planned.",
  "Yes, because the engine deducts the 2597517 held for the month the as-of date falls in, and releases it once a later report is run.",
  "No, because the curve rescales its last point to the budget when the chart is drawn, and 24452483 is only the value in the underlying table."],
 "The walk steps from 2027-02-01 by whole months; the next step falls after 2027-11-30, so the curve closes on a point dated the end, adding the last 2597517 of plan.")

q(1,
 "A published window from 2090-01-01 to 2091-01-01 returns 13 points ending \"1 Jan 91\", and OFON-1 returns 11 ending \"30 Nov 27\". Both last points carry the whole EAC. Why is there no separate monthly point on 2091-01-01?",
 "Its end date falls exactly on a monthly step, so the closing point replaces that step and no date appears twice; OFON-1's end is not on a step from 2027-02-01.",
 ["Its window lies wholly in the future, so the whole curve is projection, and the engine drops any monthly point that would only repeat the EAC already printed beside it.",
  "It has no invoices, so no actual needs a point of its own, while OFON-1's four invoices each hold a monthly point open.",
  "It is thirteen months long, and the engine merges the last two points of any window longer than a year so that a chart never carries more than thirteen labels."],
 "Every curve closes on a point dated the window end with Planned the budget and Forecast the EAC. When a monthly step lands on the end, the closing point takes its place; OFON-1's steps land on the first of each month, so Nov 27 is followed by \"30 Nov 27\".")

q(2,
 "The course draws OFON-1's first point as \"Feb 27\". A viewer in America/Los_Angeles opens the same AFE. What does the curve show there?",
 "The same curve: the window, the as-of date, the monthly step, the day count and every label are read in UTC, so the first point is \"Feb 27\" there too.",
 ["The same amounts relabelled, since the Suite converts the month labels into the viewer's local calendar before drawing them.",
  "A later as-of date, since the Planned line is recomputed from today's date in the viewer's time zone.",
  "A first point labelled \"Jan 27\" and every Planned value shifted, since the window is parsed at midnight and west of UTC that midnight falls on the previous evening."],
 "The S-curve is read in UTC, so every zone draws what a UTC machine draws; the published February-start case labels its first point \"Feb 27\" in every zone, and OFON-1's Mar 27 plans 2507947 everywhere.")

q(3,
 "The published window 2020-01-01 to 2020-12-31 with two invoices returns 13 points. Where does the curve end, and what does its last point carry?",
 "On a closing point \"31 Dec 20\" dated the window end, with Planned 1200, the budget, and Actual 350 from the invoices to that day.",
 ["On the as-of date, so a window read after its end draws no point beyond the day of the report.",
  "On the last monthly step, \"Dec 20\", which stands on the first of December, with Planned short of the budget of 1200 by the whole plan for December.",
  "On the twelfth monthly point, since the engine limits every curve to twelve points whatever the window length."],
 "Twelve monthly points from 2020-01-01 are followed by a closing point dated the end, windowEnd true, with Planned 1200 and Forecast 1200; its Actual counts the invoices dated on or before the end, 350.")

emit(Q, '/root/wt-ec45-recut/tools/course-banks/portfolio/intermediate/ec5i_m05.json', expect_n=15)
finish()
