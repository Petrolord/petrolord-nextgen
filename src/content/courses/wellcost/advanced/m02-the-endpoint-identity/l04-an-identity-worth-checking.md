# An identity worth checking

An exact identity is a gift to a reader, because it turns an audit of somebody else's spreadsheet into a single subtraction.

{{panel:wc-risk-explorer}}

## The one line audit

Take the last cell of the cumulative cost column. Take the base subtotal. Subtract.

If the answer is 0, the accrual and the rollup agree. If it is anything else, the two halves of the model have drifted apart and you have found it in about five seconds, without reading a formula.

The same trick works on the time axis. The curve's final elapsed hour should equal the schedule's total hours, error 0. And the gap from the curve endpoint to the AFE total should equal the contingency exactly.

## What a non-zero answer usually means

If the endpoint sits above the base by roughly the provision, contingency has been smeared into the accrual. That is the common one.

If it sits below the base by the value of one line, a lump has been dropped from the accrual while staying in the rollup. This engine will not let that happen quietly. A lump naming an activity that does not exist is refused outright with an error, and a lump naming no activity at all is placed at spud rather than discarded, so the endpoint still lands on the base. A spreadsheet has no such guard.

If it sits below by something with no clean interpretation, look at the per day lines. A per day rate applied over productive hours instead of elapsed hours will land short by exactly the non-productive share, which on the golden case is 48 hours of the 432.

## Why exact beats close enough

A tolerance forces an argument. Is a small drift acceptable on a 5,380,000 USD base? Somebody will say yes, and then somebody will say yes to ten times that, and the check stops being a check.

Zero admits no such conversation. The published sweep of twenty non-productive and contingency combinations returns a maximum absolute error of 0 USD, so the standard you hold a spreadsheet to is the standard the engine already meets.

## Where the check earns its keep

Use it on inherited models, on partner submissions, and on your own work after any edit that touches a cost line or an activity duration. It costs nothing to run and it catches the class of error that is hardest to see by inspection, which is a total that is internally inconsistent rather than merely wrong.

## Exercise

Run the subtraction on the golden case in the panel and write down the result.

Then move one lump line so that it links to no activity, and say what happens to the shape of the curve and what happens to its endpoint.
