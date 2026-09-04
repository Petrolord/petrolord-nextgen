# The three pressure losses

Two of them are in every outflow number this module produces. The third is not, and knowing which one is missing is the lesson.

{{panel:pd-vlp-explorer}}

## The itemised bill

Required pressure at the node is the wellhead pressure plus the weight of the column plus friction. BONNY-7's floor is 420 psia.

| Rate, stb/d | Gravity term, psi | Friction term, psi | Required bhp, psia |
| --- | --- | --- | --- |
| 4.32 | 2125.489174 | 0.011969 | 2545.501142 |
| 484.34 | 938.222456 | 150.133173 | 1508.355629 |
| 964.35 | 601.970606 | 595.182762 | 1617.153368 |
| 1924.38 | 350.638337 | 2370.067092 | 3140.705429 |
| 4324.44 | 171.562832 | 11968.524642 | 12560.087474 |

FORCADOS-3 does the same on a 960 psia floor: 3333.187930 and 0.001796 psi giving 4293.189726 psia at 4.14 stb/d, and 554.283272 and 1796.138365 psi giving 3310.421637 psia at 4135.95 stb/d.

## Down, up, and flat

The gravity term is bounded by the gravity constant and spends its travel early. The friction term is an unbounded square law spending its travel late, fair as a form because the Moody factor barely moves once turbulent: 0.02174609 at a Reynolds number of 50000 against 0.01476271 at 2000000. The wellhead pressure ignores rate, so it moves the level alone, and BONNY-7's dead column runs 2430, 2500, 2570 and 2640 psia across wellhead pressures of 280, 350, 420 and 490 psia.

## The one that is not there

The classical balance has three losses: hydrostatic, friction and acceleration. The published Cullender and Smith integrand carries an elevation group and a friction group and no third, and neither instrument has one.

The omission is deliberate and it bites where density changes fast, meaning high velocity gas near the top of a string. There the module is low by an amount it never computed and cannot report. Dropping a term and forgetting one look identical in the output.

## The mistake the itemisation prevents

Two rows can share a total and have opposite causes. FORCADOS-3 asks 2552.129651 psia at 1037.09 stb/d, being 1479.196441 psi of weight against 112.933210 of friction, and 2559.300006 psia at 2844.76 stb/d, being 749.572029 against 849.727978.

| BONNY-7 rate, stb/d | Gravity share |
| --- | --- |
| 484.34 | 0.86205504 |
| 964.35 | 0.50283499 |
| 1924.38 | 0.12887773 |
| 4324.44 | 0.01413193 |

At 484.34 stb/d larger tubing buys a friction cure for a gravity problem; at 1924.38 stb/d lighter fluid attacks the smaller half. Friction overtakes gravity at 968.379388 stb/d on BONNY-7 and 2718.933018 stb/d on FORCADOS-3, and neither is the bottom of its curve: those sit at 627.069742 and 1843.619418 stb/d, because a minimum is slopes cancelling, not values matching.

## Exercise

In the panel, read BONNY-7's two terms at 484.34 stb/d and at 1924.38 stb/d with the gravity share beside each.

Then say which of larger tubing or a lighter column helps at each rate, and why the answer changes when the well has not changed.
