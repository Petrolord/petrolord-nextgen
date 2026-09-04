# A verdict on a margin

The engine prints multipointing true at stage 5 of a published design. The number underneath that word is 0.124769727 psi.

{{panel:pd-unloading-explorer}}

## The margin runs out slowly, then all at once

At each multipointing stage of midDecrementKnifeEdge exactly one upper valve is still open, and the margin keeping it open shrinks every stage.

| Stage | Valve still open | Margin at valve depth, psi | Margin at surface, psi |
| --- | --- | --- | --- |
| 2 | 1 | 26.872512516 | 25.095008888 |
| 3 | 2 | 16.655174226 | 14.817497268 |
| 4 | 3 | 7.797010459 | 6.683175235 |
| 5 | 4 | 0.149791635 | 0.124769727 |

Two roads, two numbers, one verdict at every row. The oracle margin is the acting pressure at valve depth against the dome at valve temperature, 1247.212879022 psia against 1247.063087387 psia on valve 4 at stage 5. The engine margin is the stage casing at surface against the closing surface pressure, 1057.7000 psia against 1057.575230273 psia.

## The scale that margin sits on

That design runs at 1164.7000 psia at surface and 1279.335785 psia at valve 4. The stage 5 verdict, the single most consequential boolean the design function emits, is decided by a fraction of a psi on a system carrying over a thousand.

## The warning says none of this

The engine raises four warnings on this case and they are worded identically apart from the numbers of the stage and the valve: at stage 5, valve 4 is still open, the string will inject at two depths. The stage 2 warning at 26.872512516 psi of margin and the stage 5 warning at 0.149791635 psi read the same. Nothing in the output attaches a distance to a boolean, so a design review sees four warnings and no indication that one of them is a coin toss and three are not.

## The mistake

Trusting the flag because everything around it carries nine digits. Precision in the report is not stability in the answer. The quantity worth reading is the closing margin, and the flag is a sign test applied to it. A margin of 0.149791635 psi and the -59.034480503 psi that valve 1 shows at the same stage produce outputs of exactly the same shape, one true and one false, with no distance in either.

## What it refuses

There is no tolerance band on the verdict and no uncertainty on it. The engine will not tell you that a stage is marginal, because it does not carry the margin into its output at all: the closing margins live in the goldens, cut by the oracle, and not in what the design function returns. Reading a boolean without going back for the number behind it is the whole failure this lesson is about.

## Exercise

Read the four multipointing stages in the panel and write down the closing margin at each, at valve depth and at surface.

Then rank the four warnings by how close they are to flipping, and say what in the engine output would have let you do that ranking.
