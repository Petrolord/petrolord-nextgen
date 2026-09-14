# A negative EMV stays out

A project whose risked EMV is 0 or less is never funded, however much money is available. The optimizer maximises summed risked EMV, and such a project can only lower the sum or leave it where it was.

{{panel:ec-capital-explorer}}

## Three published cases

| case | capex limit | engine set | total capex | total risked EMV |
| --- | --- | --- | --- | --- |
| negativeNeverForced | 200.0000 | good | 50.0000 | 30.0000 |
| zeroEmvExcluded | 500.0000 | good | 50.0000 | 30.0000 |
| negativeEmvHugeBudget | 10000.0000 | good + better | 120.0000 | 75.0000 |

In each case the inventory also holds a project that is not worth doing. In `negativeNeverForced` it has a negative risked EMV and the limit of 200.0000 has room for it; the engine funds `good` alone for 50.0000. In `zeroEmvExcluded` the extra project's risked EMV is exactly zero, and the engine still leaves it out. In `negativeEmvHugeBudget` the limit is 10000.0000, the funded set spends 120.0000, and the negative project stays out although the money to fund it many times over sits unspent.

## How a project goes negative

A negative risked EMV comes from the line itself: pos x npv_p50 - (1 - pos) x fail_cost. The published case `posZero`, with `npv_p50` 80, `fail_cost` 30 and `pos` 0, returns -30.0000. The case `missingNpvIsZero`, with no `npv_p50`, a `fail_cost` of 8 and a `pos` of 0.25, returns -6.0000. Neither would ever be funded. OKONO has no such project: its smallest risked EMV is the workovers' 38.0000, and the exploration well stays positive at 41.2500 because its success branch outweighs its failure branch.

## Zero is out too

Excluding a zero is a deliberate choice. A project with a risked EMV of 0 adds nothing to the objective and still uses capex that another project might need. Leaving it out costs nothing in value, and money may always be left unspent.

## What the rule refuses

The engine has no way to force a project in. There is no must-fund flag for a licence commitment, a safety upgrade or a project a partner has already approved. A mandatory project with a negative risked EMV has to be handled outside the optimizer, by taking its capex off the limit before the run. The engine also does not list the projects it excluded or say why, so a negative project simply never appears in the answer.

## The mistake

The budget-holder's mistake is "use it or lose it": the optimizer leaves money unspent, so the unspent money goes to the next project on the list whatever its value. Funding a project with a negative risked EMV lowers the portfolio's expected value by exactly that negative amount, and the budget being available does not change the sign. The analyst's mistake is reading an excluded project as an input error, when on its own line it is worth less than nothing.

## Exercise

For the three published cases, give the limit, the funded set, its capex and its risked EMV, and say what each case shows. Then write the risked EMV of the `posZero` project by hand and explain why a zero-EMV project is excluded even when the budget has room for it.
