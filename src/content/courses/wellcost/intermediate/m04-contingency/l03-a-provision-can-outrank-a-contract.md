# A provision can outrank a contract

Sort the golden estimate by size and the fourth largest number on it is money for what has not happened.

{{panel:wc-afe-explorer}}

## The sorted estimate

At the golden fraction of 0.1 the nine numbers on the page, contingency included, sort like this.

| rank | line | USD |
|---|---|---|
| 1 | Rig dayrate | 1,800,000 |
| 2 | Integrated services spread | 1,080,000 |
| 3 | Casing and accessories | 800,000 |
| 4 | Contingency | 538,000 |
| 5 | Completion services | 500,000 |
| 6 | Mud and consumables | 450,000 |
| 7 | Cementing services | 300,000 |
| 8 | Wellhead | 250,000 |
| 9 | Wireline logging | 200,000 |

Eight of those nine are somebody's contract. One is not. At 0.1 the provision is already 0.29888888888888887 of the rig dayrate, the largest committed line on the well.

## Where it passes each line

The crossing condition is arithmetic. The contingency is f times the base, so it passes a line of amount L when

    f * baseUsd > L,  therefore  f > L / baseUsd

which says the fraction that overtakes a line is that line's own share of the base.

Bisecting on the engine's `afeCosts` output, rather than on the algebra, gives 0.33457249070631967 for the rig dayrate and 0.20074349442379186 for the integrated services spread. The algebraic ratios are 0.3345724907063197 and 0.20074349442379183. The two agree to machine precision, which is the check that the search found a real property of the model and not an artefact of the search.

## The ladder

| contingency fraction | contingency USD | rank among the lines |
|---|---|---|
| 0 | 0 | 9 |
| 0.05 | 269,000 | 7 |
| 0.10 | 538,000 | 4 |
| 0.15 | 807,000 | 3 |
| 0.25 | 1,345,000 | 2 |
| 0.40 | 2,152,000 | 1 |

Between zero and a half the provision climbs from last place to first. At 0.15, a number many operators use without argument, it is already the third largest item on the estimate. At 0.4 it is the largest thing on the well.

## What to take from it

The general rule is the one the algebra gave. A provision outranks a line when the fraction exceeds that line's share of the base, so on a well whose largest contract is a third of the estimate, a third is all it takes.

This is not an error in the model. It is the model telling you something about the estimate: the largest number on a well can be an opinion about the other numbers. When you sort an AFE by size to find what matters, the sort is ranking commitment and uncertainty on the same axis, and they are not the same thing.

## Exercise

In the panel, raise the fraction until the contingency passes the integrated services spread. Confirm the crossing against the ratio 1,080,000 over 5,380,000.

Then predict, before you run it, the fraction at which the contingency passes the casing and accessories line, and check it.
