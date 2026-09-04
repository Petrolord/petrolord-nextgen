# Two terms pulling opposite ways

The J is not a fact to memorise. It is what you get when you add a falling number to a rising one.

{{panel:pd-vlp-explorer}}

## The construction

One term FALLS with rate, because a faster stream carries more gas and the mixture weighs less. One RISES with the SQUARE of rate. A sum like that cannot be monotone.

## Watch it assemble on BONNY-7

Wellhead 420 psia, gravity constant 2150 psi, lightening constant 375 stb/d, friction constant 0.00064 psi per (stb/d) squared.

| Rate, stb/d | Gravity term, psi | Friction term, psi | Required bhp, psia |
| --- | --- | --- | --- |
| 4.32 | 2125.489174 | 0.011969 | 2545.501142 |
| 484.34 | 938.222456 | 150.133173 | 1508.355629 |
| 964.35 | 601.970606 | 595.182762 | 1617.153368 |
| 1444.36 | 443.149256 | 1335.160735 | 2198.309991 |
| 1924.38 | 350.638337 | 2370.067092 | 3140.705429 |
| 2884.40 | 247.361140 | 5324.664959 | 5992.026100 |
| 4324.44 | 171.562832 | 11968.524642 | 12560.087474 |

Gravity spends its travel early, 2125.489174 to 601.970606 psi by 964.35 stb/d, then only reaches 171.562832 psi across the rest: a rate in a denominator, budget 2150 psi. Friction spends its late, 0.011969 to 11968.524642 psi, unbounded. The sum falls to 1508.355629 psia and climbs to 12560.087474. The J assembled itself from two columns, neither of them J shaped.

## The same construction, different proportions

FORCADOS-3: 960 psia, 3350 psi, 820 stb/d, 0.000105.

| Rate, stb/d | Gravity term, psi | Friction term, psi | Required bhp, psia |
| --- | --- | --- | --- |
| 4.14 | 3333.187930 | 0.001796 | 4293.189726 |
| 1037.09 | 1479.196441 | 112.933210 | 2552.129651 |
| 1811.80 | 1043.770557 | 344.676714 | 2348.447272 |
| 2586.52 | 806.394908 | 702.458741 | 2468.853650 |
| 4135.95 | 554.283272 | 1796.138365 | 3310.421637 |

Gravity is still the larger term through the middle, so this J is shallow where BONNY-7's is violent. Gravity share at the rate bound says it: 0.01413193 against 0.23582291. FORCADOS-3 never reaches a friction dominated state.

## Not where the terms are equal

Friction overtakes gravity at 968.379388 stb/d and 1620.331057 psia on BONNY-7, and at 2718.933018 stb/d and 2512.445319 psia on FORCADOS-3. Both sit RIGHT of the bottoms, 627.069742 and 1843.619418 stb/d, because a minimum is slopes cancelling and not values matching: FORCADOS-3's gravity share at its bottom is still 0.75175383. A loading floor set at the crossover is hundreds of stb/d high.

## Which side, and why it matters

Right of the bottom the tubing demands more as rate rises, so a disturbance is pushed back. Left of it it demands less, so the disturbance grows and the well loads. Which side a well sits on needs the reservoir's curve, and that pairing is not done here. The far right is not a prediction either: BONNY-7's 171.562832 psi of gravity off 2150 psi of dead weight is lighter than any real column carrying liquid.

## Exercise

In the panel, read BONNY-7's two terms at 964.35 stb/d and confirm they are close.

Then read the crossover rate and the minimum rate, and say why the second is smaller.
