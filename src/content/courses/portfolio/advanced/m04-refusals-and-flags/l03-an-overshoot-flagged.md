# An overshoot flagged

A refusal stops the engine and returns nothing. A flag returns the answer and marks what is wrong with it. The grid overshoot is flagged: the set still breaks the limit, and the result now says so and by how much.

{{panel:ec-governance-explorer}}

## The published overshoot

The limit of 6000.0000 is above 5000, so each cell is the limit / 2000, a resolution of 3.000000, and each project weighs its capex over 3.000000, rounded to whole cells.

| project | capex | EMV |
| --- | --- | --- |
| A | 4000.0000 | 500.0000 |
| B | 2002.0000 | 300.0000 |
| C | 1995.0000 | 280.0000 |

| result | set | capex | EMV | overLimit | overLimitBy |
| --- | --- | --- | --- | --- | --- |
| engine | A + B | 6002.0000 | 800.0000 | true | 2.0000 |

Rounding drops a fraction of a cell from A and another from B, so A + B fills the grid exactly while its real capex of 6002.0000 sits 2.0000 over the limit. The exact optimum that respects the limit is A + C at 780.0000, and the golden gap is 20.0000. The set with the higher EMV is the one the budget cannot pay for.

## What the flag does and does not do

Before EC5-0 the engine returned A + B with nothing to mark it. The repaired engine returns the same set and adds overLimit true and overLimitBy 2.0000, and the Suite now shows the resolution and the overshoot on screen.

The flag does not re-solve, and it never reports 780.0000. A reader who sees overLimit true must treat the set as infeasible and check the alternatives by hand, where A + C is the answer. A coarse grid is not always harmful: rawDollars and nonIntegerLimit return overLimit false with a gap of 0.0000.

## A flag that never fires

The grid can also undershoot, and that is not flagged (finding D4). In gridUndershoot, projects of capex 1499.0000, 1499.0000, 1499.0000 and 1502.0000 face the same 6000.0000 limit, and rounding makes the four together weigh more cells than the grid holds. The engine funds X + Y + Z at capex 4500.0000 and EMV 660.0000 with overLimit false. The exact optimum funds all four at 860.0000, a gap of -200.0000. overLimit false says nothing about whether a better set was missed.

## Flags on the AFE side

The joint venture split flags rather than refuses. A partner with a negative working interest returns valid false and the engine note, and the allocation is still shown: interests of 30 and -20 on a cost of 1000.00 leave the operator 90.0000 percent, an amount of 900.00. The repaired AFE summary prints the note beside it.

## The mistake

The mistake is reading a flag as decoration. An EMV of 800.0000 beside overLimit true is the value of a set the company cannot fund, and ranking it against a feasible 780.0000 prefers the set that breaks the budget. The opposite mistake is treating overLimit false as a certificate of optimality, which gridUndershoot disproves by a gap of -200.0000.

## Exercise

For gridOvershoot, give the resolution, the engine's set with its capex, EMV, overLimit and overLimitBy, and the exact optimum with its EMV. Explain in one sentence why A + B fits the grid. Then say why overLimit false on gridUndershoot does not mean its set is the best within the limit.
