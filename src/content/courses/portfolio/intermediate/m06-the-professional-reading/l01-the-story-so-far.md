# The story so far

Five modules followed one AFE, OFON-1, from its lines to its S-curve. Every reading came down to a rule, a date or a progress figure that somebody typed.

## An AFE and its lines

OFON-1 is authorised in USD over a window from 2027-02-01 to 2027-11-30. Five cost lines carry a budget of 27050000, commitments of 5000000 and actuals of 15090000, and four invoices dated 2027-02-20 to 2027-07-18 also total 15090000. The metrics read actuals from the lines and the S-curve reads them from the invoices. On OFON-1 the two agree because the field was built that way, and on a live AFE they need not.

## One forecast rule

Each line forecasts its entered forecast when that is positive, flagged when it falls below the money spent and committed, and otherwise the larger of its budget and its actual plus commitment. CSG-02 forecasts 4300000 against a budget of 3900000, CMT-03 forecasts its entered 1400000, and DRL-01, LOG-04 and CMP-05 forecast their budgets. No OFON-1 line is flagged. The EAC is 27600000 and the variance at completion is -550000, an overrun. The dashboard tiles, the Cost Breakdown table, the exports and the Top 5 all use this one rule.

## Earned value

Earned value weights each line's progress by its budget. DRL-01 earns 10224000 at 72.0000 percent, CSG-02 earns its 3900000 at 100.0000 percent although it spent 4300000, and the AFE earns 15231500. CPI, earned value over actuals, is 1.009377. Percent spent is 55.7856 and percent complete 56.3087. None of it is better than the progress column behind it.

## The as-of date

Only time progress, planned value and SPI move with the as-of date. SPI is null before the start and on the start day, 1.141290 on 2027-06-30, 0.872063 on 2027-08-15, and 0.563087 on and after 2027-11-30, where it equals percent complete divided by 100. A date that is not a valid date is refused. An AFE saved without dates falls back to time progress 1, and the Suite labels its SPI unavailable.

## The S-curve

As of 2027-08-15 the curve has 11 points: 10 on the first of each month under labels like Feb 27, and a closing point "30 Nov 27" on the window end. Planned is a straight line in days that reaches the budget of 27050000 on the closing point. Actual comes from invoices and ends at 15090000. Forecast then jumps to 19374834, because past the as-of date it is the EAC spread from the start, and it closes on the EAC of 27600000.

## The sentence the tier ends on

An AFE report is a forecast rule, a date and the progress typed on the lines, and each of its numbers is only as honest as whichever of the three it reads.

## Exercise

Write OFON-1's EAC, variance at completion, earned value and CPI, and say which of them change when the as-of date moves. Then write its SPI as of 2027-01-15, 2027-08-15 and 2028-01-10, and explain each in one sentence.
