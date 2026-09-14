# When IRR returns zero

The engine reports 0.0000 percent for two situations that could hardly be further apart, and prints the same four characters for both. Neither of them means the project broke even.

{{panel:ec-instrument-explorer}}

## Two guards, one value

The first guard fires when the cash flows never change sign. With nothing negative in the vector there is no root, because the net present value is positive at every rate. The published case `irr_all_positive` is exactly that: engine 0.0000 percent, golden 0.0000, and a net present value of 25.6198 at 10 percent. It has no outlay against which a return could be measured.

The second guard fires when the net present value at a rate of zero is not above zero. The published case `irr_npv0_negative` has flows of -100 then 90, loses money at every rate, and would solve to a negative rate. The engine reports 0.0000 instead, and its net present value at 10 percent is -16.5289.

So one zero means the project never loses and the other means it never wins. A reader who takes 0.0000 for "breaks even exactly" has it backwards in both directions at once.

## Telling them apart

The function gives no clue, so look at the ledger: the sign of total contractor net cash flow over the life, and the net present value at a rate of zero.

| case | net present value at 10 percent | which guard |
| --- | --- | --- |
| irr_all_positive | 25.6198 | no sign change |
| irr_npv0_negative | -16.5289 | only root is negative |

The second kind turns up on real ledgers. The published case with capex of 20000 on the Suite test project reports an internal rate of return of 0.0000 percent, a total contractor net cash flow of -15724.0151 million USD, a net present value of -15453.8510 at 10 percent, a closing unrecovered pool of 15724.0151 and no payback year. Nothing there breaks even.

## The mistake

The mistake is sorting or filtering on the rate column. A comparison in which several regimes report 0.0000 percent has not ranked them, and a filter below a threshold hides the hopeless projects and the ones that never needed capital together. The mirror mistake is treating 0.0000 as missing data and substituting the net present value, which ranks a project worth 25.6198 million USD beside one at -15453.8510.

There is a third way this solver returns a number that is not a root. The case `irr_beyond_bracket`, with flows of -1 then 2000, reports 102400.0000 percent where the true rate is 199900 percent, because 102400 is the top of the doubling search rather than a solution. The Expert tier returns to it.

## What it refuses

The function returns a number and no status, so a guard, a bound and a root are indistinguishable at the call site. It reports nothing about the number of roots. And it will never report a negative internal rate of return, so a genuinely loss-making project cannot be described by this column.

## Exercise

Write the two guards and the published case that fires each, with its net present value at 10 percent. Then say which two ledger numbers you would check before quoting an internal rate of return of 0.0000 percent.
