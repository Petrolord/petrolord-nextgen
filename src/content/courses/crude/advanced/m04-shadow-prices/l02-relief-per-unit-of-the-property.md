# Relief per unit of the property

A planner asks what one more ppm of sulfur allowance would be worth on this cargo. The kernel's dual does not answer that directly. optimiseBlend does, and this lesson follows the conversion on the Apapa sulfur row.

## Why the dual needs scaling

The sulfur row is sum((w_i - L d_i) v_i) <= 0, with w_i = SG x sulfur and d_i = SG on the mass basis. The limit L sits inside every coefficient. Moving L by one unit moves the row by sum(d_i v_i), so a one ppm move of the limit is a move of sum(d_i v_i) units in the row. rowPrice is the change in cost per one unit of the row. Multiplying the two gives the change in cost per one ppm of the limit.

Where the property blends through an index, one more factor enters: the limit is in index units inside the row, so the slope of the index at the limit, dIndex/dL, turns one unit of the property into index units. The next lesson reads that factor on RVP. Sulfur has no index, so here it plays no part.

The engine's rule is price = rowPrice x sum(d_i v_i) x dIndex/dL, turned into money SAVED by one unit of relief. Relief means raising a maximum or lowering a minimum. The price is positive when relief saves money, and it is per whole unit of the property.

## The sulfur row at Apapa

Each piece:

- rowPrice on the Sulfur maximum row: -0.0914.
- The sulfur row's scale, sum(SG x volume) over the recipe: 6037.3872.
- rowPrice x that sum: -551.8026. That is the change in cost per ppm of the limit, dCost/dL.
- The reported value of relief: 551.8026 $ per ppm.

The sign turns because relief on a maximum is the negative of dCost/dL. Raising the maximum lowers the cost, so dCost/dL is negative and the saving is positive.

## The whole price table

| row | price (value of one unit of relief) | per | rowPrice |
| --- | --- | --- | --- |
| Total volume | 87.5108 | bbl | 87.5108 |
| RON minimum | 0.0000 | unit | 0.0000 |
| MON minimum | 0.0000 | unit | 0.0000 |
| Sulfur maximum | 551.8026 | ppm | -0.0914 |
| RVP maximum | 4448.9659 | psi | -0.2569 |
| Density maximum | 0.0000 | kg/l | 0.0000 |
| Density minimum | 0.0000 | kg/l | 0.0000 |

The two binding specifications carry positive prices. The non-binding ones carry 0.0000: relieving a limit the blend does not touch saves nothing. The Total volume row reads the same in both columns, because its right-hand side is already barrels.

## Per whole unit, and why it matters

The price is per whole unit of the property, however large that unit is against the specification. The AGO cargo makes the point. Its binding rows price at 1159.3909 $ per unit of Cetane number and 852453.4687 $ per kg/l of Density. A whole kg/l of density is not a move any planner makes on a diesel specification. The rows behind the two prices:

| row | rowPrice | scale | rowPrice x scale | price (value of one unit of relief) | per |
| --- | --- | --- | --- | --- | --- |
| Cetane number minimum | 0.1932 | 6000.0000 | 1159.3909 | 1159.3909 | unit |
| Density maximum | -142.0756 | 6000.0000 | -852453.4687 | 852453.4687 | kg/l |

Both blend on volume, so each scales by the recipe's 6000.0000 bbl. rowPrice x scale is formed from the unrounded rowPrice. As on sulfur, a maximum's relief is the negative of dCost/dL, so the density row's two figures carry opposite signs.

A rate is also a derivative at the optimum. Lesson five checks what one whole unit of relief actually saves by re-solving, and shows why the two can differ.

{{panel:crude-recipe-explorer}}

In the panel, select the sulfur row and read its rowPrice, its scale and its price side by side.

## Exercise

Read the Apapa sulfur figures: rowPrice -0.0914, scale 6037.3872, rowPrice x scale -551.8026, value of relief 551.8026 $ per ppm. Say what each of the last two measures and what their opposite signs show. Then read the AGO Density price, 852453.4687 $ per kg/l, and say what unit a planner must hold in mind when reading it.
