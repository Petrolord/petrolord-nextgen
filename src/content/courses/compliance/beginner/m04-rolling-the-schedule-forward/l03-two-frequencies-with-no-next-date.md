# Two frequencies with no next date

complianceStatus.FREQUENCIES holds seven words: One-off, Monthly, Quarterly, Semi-annual, Annual, Biennial and Other. Five of them are intervals the calendar can step by. Two of them are not, and for those two the engine gives no next date and no period at all.

## What rollForward and periodStart give

From a due date of 2026-08-31, rollForward returns:

| frequency | next due date | days until it |
| --- | --- | --- |
| One-off | none | none |
| Other | none | none |

And for a due date of 2026-10-31, periodStart returns:

| frequency | periodStart | days until the period start |
| --- | --- | --- |
| One-off | none | none |
| Other | none | none |

{{panel:compliance-register-explorer}}

The two words mean different things, and the none means something different for each.

## One-off: there is no next time

A One-off obligation is due once. There is nothing to roll forward to, because the obligation does not recur, and there is no period to step back through. The none from rollForward is the correct answer: after a One-off is discharged, there is no next due date.

The IKORO register carries three One-off rows, read here at the as-of date of 2026-10-15. REG-2026-006, the pipeline right of way consent, was filed on 2026-08-10 and reads Compliant. REG-2026-007, the oil spill contingency plan notification, has not been filed and reads Overdue, 44 days past its due date. REG-2026-009, the original environmental impact approval, is Superseded. The next lesson reads the first two side by side.

## Other: the interval is not one the engine knows

Other is for an obligation whose timing does not fit a fixed interval: something due on an event, or on a schedule the regulator sets case by case. The engine has no interval to step by, so it will not invent a next date. The none from rollForward here means the engine cannot say. The next due date has to be entered by somebody who knows it.

Two IKORO rows are Other. REG-2026-010, the safety case resubmission, is Draft with a due date of 2027-06-30, and its lifecycle takes it out of the countdown. REG-2026-013, the waste consignment register, has no due date and no expiry, and it reads No date set, with the reason "No due date or expiry date has been set, so nothing can fall due."

## What the none leaves on the row

rollForward returns none for One-off and for Other, and periodStart returns none for One-off. The engine writes no next date in place of either none. A row with no due date and no expiry reads No date set, as REG-2026-013 does, and its reason says nothing can fall due. The next due date for such a row has to be entered by somebody who knows it.

## Exercise

Read what rollForward and periodStart return for One-off and for Other. Then read the status of REG-2026-013 and its reason. Say, for each of the two frequencies, what the none means, and what somebody has to do for REG-2026-013 before the register can tell whether it is late.
