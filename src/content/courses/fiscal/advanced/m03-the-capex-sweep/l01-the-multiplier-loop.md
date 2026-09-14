# The multiplier loop

The capex sweep multiplies one number in the project and re-runs everything, and the shape of the answer is not always the shape people expect.

{{panel:ec-comparison-explorer}}

## One lever, seven settings

The sweep walks a multiplier over the project's capex and returns the contractor NPV at each setting. The engine returns seven labels: 0.8, 0.9, 1.0, 1.1, 1.2, 1.3 and 1.4. Every capex line moves together, drilling, facilities and subsea, and all of it still lands in year 1, because the sandbox spends capex in year 1 and has no schedule. Total capex on the default project is 500.0000 million USD, so the sweep is asking what happens if that single year 1 outlay is 20 percent smaller or up to 40 percent larger.

All six templates on the default project, contractor NPV in million USD at each swept point:

| regime | x0.8 | x0.9 | x1.0 | x1.1 | x1.2 | x1.3 | x1.4 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Nigeria - PIA (2021) | 176.9424 | 161.3220 | 154.8286 | 132.7266 | 121.6623 | 97.0074 | 79.1811 |
| Ghana - Deepwater | 195.6257 | 185.0914 | 172.7531 | 160.6465 | 143.3384 | 129.9510 | 107.3627 |
| Brazil - Concession | 369.1782 | 367.7987 | 357.8728 | 335.6628 | 318.1476 | 291.3317 | 260.5129 |
| USA - Gulf of Mexico | 457.1975 | 419.6318 | 382.0660 | 343.9464 | 305.6635 | 267.3371 | 228.4023 |
| Angola - Deepwater PSC | 232.3129 | 238.0330 | 223.7100 | 214.0834 | 191.4408 | 174.9866 | 147.4539 |
| Generic Royalty/Tax | 465.4141 | 431.2293 | 397.0445 | 362.8597 | 327.8018 | 292.5924 | 257.3831 |

## The row that goes the wrong way

Angola - Deepwater PSC returns 232.3129 million USD at a multiplier of 0.8 and 238.0330 at 0.9. Spending more capital made the contractor better off. The mechanism is in the template's tax stack: it carries a resource rent tax at 50 percent whose base is the profit share minus an annual uplift computed from total capex, so a larger capex enlarges the deduction in every year of the life. Brazil - Concession, with a resource rent tax at 40 percent, shows the muted version of the same thing, giving up only the step from 369.1782 to 367.7987 over the first interval. USA - Gulf of Mexico and Generic Royalty/Tax, which carry no resource rent tax and take 100 percent of profit oil, fall in near even steps from 457.1975 to 228.4023 and from 465.4141 to 257.3831. The templates that split profit oil on the R factor fall unevenly instead, because raising capex also raises cumulative cost, which lowers the R factor and holds the contractor in a more generous tranche for longer.

## The mistake

Reading the curve as a straight line is the error, and the two published capex case sets show why. The seven published runs of the Designer's production sharing regime move at multipliers of 0.7 to 1.3, returning NPVs of 240.3937, 218.5119, 198.2887, 173.4150, 150.6191, 123.6342 and 98.2520 million USD, with payback stepping 3, 3, 4, 4, 4, 5 and 5 and payout stepping 2, 2, 2, 3, 3, 3 and 4. A capex increase does not just lower NPV. It delays the year the contractor turns positive, delays the R factor through 1.0 and can move a profit split tier with it.

## What it refuses

The multiplier is a single scalar on the whole capital programme. It cannot move drilling without facilities, it cannot reschedule a dollar out of year 1, and it does not touch opex, so a cost overrun that would in reality raise both is modelled as capital only. It also holds price fixed, so nothing in this sweep answers what an overrun costs at a low price.

## Exercise

Give the seven multipliers the engine returns and the contractor NPV at each for Generic Royalty/Tax. Then explain why Angola - Deepwater PSC is worth more at a multiplier of 0.9 than at 0.8.
