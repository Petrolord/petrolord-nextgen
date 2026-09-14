# Money left unspent

The optimizer never has to spend the whole limit. When no remaining whole project fits, or when what remains is not worth funding, the difference between the limit and the funded capex stays unspent.

{{panel:ec-capital-explorer}}

## OKONO at 750.0000

| capex limit | funded set | total capex | total risked EMV | unspent |
| --- | --- | --- | --- | --- |
| 600.0000 | OK-1 + OK-2 + OK-4 + OK-5 | 600.0000 | 402.7500 | 0.0000 (derived) |
| 750.0000 | OK-1 + OK-2 + OK-3 + OK-4 + OK-5 | 690.0000 | 444.0000 | 60.0000 (derived) |
| 1000.0000 | OK-1 + OK-2 + OK-3 + OK-4 + OK-5 + OK-6 | 1000.0000 | 588.0000 | 0.0000 (derived) |

At 750.0000 the optimizer funds every project except the satellite tie-back and spends 690.0000. The 60.0000 left over is derived: 750.0000 - 690.0000. No remaining project fits it, because the only project left is OK-6 and it alone costs 310.0000.

Raising the limit from 600.0000 to 750.0000 added OK-3 for 444.0000 - 402.7500 = 41.2500 of risked EMV. The rest of the extra money bought nothing.

## The engine does not report it

The engine returns the limit, the funded set, its total capex and its risked EMV. It does not return an unspent amount; every unspent figure is derived by subtracting. A reader who looks only at the funded set and its risked EMV will not notice that part of the budget sat idle.

## Unspent because nothing fits

The published case `limitBelowEveryProject` has a limit of 30.0000 under every project, so the engine funds nothing, capex 0.0000, risked EMV 0.0000, and all of the limit is left over. The same happens inside a larger budget when the gap left after the best set is smaller than any project outside it.

## Unspent because nothing is worth it

The published case `negativeEmvHugeBudget` sets a limit of 10000.0000 and funds `good + better` for capex 120.0000 and risked EMV 75.0000. The remaining project would fit, but its risked EMV is negative, so the optimizer leaves it and the money out.

## Idle money is not always a sign of a bad set

A list filled greedily by risked EMV per million USD at 450.0000 funds OK-1 + OK-4 + OK-5 for capex 420.0000 and leaves 450.0000 - 420.0000 = 30.0000 unspent, at a risked EMV of 287.7500. The optimizer's set, OK-1 + OK-3 + OK-4, spends all 450.0000 for 291.0000. There the idle money was a symptom. At 750.0000 it is not: 444.0000 is the best whole-project answer, and no set spends more of the limit for more value.

## The mistake

The mistake is treating unspent capital as a defect to be fixed by topping up the set. Adding a negative-EMV project to use the money lowers the expected value. Asking for a smaller budget because 60.0000 went unused ignores that OK-6 becomes affordable at 1000.0000. The engine carries no time value, so it cannot say what idle money earns or whether it can wait for next year.

## Exercise

State OKONO's total capex and unspent amount at 750.0000, and explain why OK-6 cannot use the remainder. Then give the unspent amount of the greedy set at 450.0000 and explain why that idle money signals a worse set while the idle money at 750.0000 does not.
