# When IRR returns zero

It does not. One value, 0.0000 percent, would stand for two situations that could hardly be further apart, and neither of them means the project has broken even, so the engine names each one instead.

{{panel:ec-instrument-explorer}}

## The two situations

The first is a set of flows that never changes sign. With nothing negative in the vector there is no root, because the present value is positive at every rate. `irr_all_positive_no_sign_change` is exactly that: null with the status no-sign-change, and a present value of 25.6198 million USD at 10 percent. There is no outlay against which a return could be measured.

The second is a project whose only root is negative. `irr_negative_root_reported` has flows of negative 100 then 90 and loses money at every rate. Its root is negative 10.0000 percent, which is inside the band, so the engine reports that rate as the negative rate it is, and its present value at 10 percent is negative 16.5289.

A rule that printed 0.0000 for both would make one zero mean a project that never loses and the other a project that never wins.

## A root the band cannot reach

A root can also fall outside the band altogether. `irr_no_root_below_band` has flows of negative 100 then 0.5 and a root at negative 99.5000 percent, below the band, with a present value negative at both ends: null with the status no-root. The published run with capex of 20000 on the Suite test project carries the same status on a real ledger. Its contractor net cash flow over the life is negative 15724.0151 million USD, its present value at 10 percent negative 15453.8510, its closing unrecovered pool 15724.0151, and it has no payback year at all.

| case | present value at 10 percent | what the engine returns |
| --- | --- | --- |
| irr_all_positive_no_sign_change | 25.6198 | null, no-sign-change |
| irr_negative_root_reported | -16.5289 | -10.0000 percent |
| irr_no_root_below_band | -90.4959 | null, no-root |

Read the status word first and the present value beside it. A null is not a missing number. It is the engine declining to name one, and the word says which reason applies.

## The mistake

The mistake that remains is sorting or filtering on the rate column. A comparison in which several regimes come back null has not ranked them, and a filter set above a threshold rate drops every one of them, the hopeless project and the one that never needed capital together. The mirror mistake is treating a null as a zero and reaching for the present value instead, which ranks a project worth 25.6198 million USD beside one at negative 15453.8510.

## What it refuses

It will not name a rate it cannot make unique inside the band, and it will not report one above 1000 percent or below negative 99. A status is a statement about the shape of a cash flow and never about its worth, so no status on its own says whether a project is any good.

## Exercise

Write the three statuses with the published case that produces each and its present value at 10 percent. Then say what a single zero would hide if it stood for the first two, and name the two ledger numbers you would read before quoting any rate at all.
