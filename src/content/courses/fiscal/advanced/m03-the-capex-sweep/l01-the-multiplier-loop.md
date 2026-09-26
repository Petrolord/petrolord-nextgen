# The multiplier loop

The capex sweep multiplies one number in the project and re-runs everything, and the shape of the answer is not always the shape people expect.

{{panel:ec-comparison-explorer}}

## One lever, eight settings

The sweep walks a multiplier over the project's capex and returns the contractor NPV at each setting. The engine returns eight labels: 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4 and 1.5, each written from a step count so the last one is exactly 1.5. Every capex line moves together, drilling, facilities and subsea, and all of it still lands in year 1, because the sandbox spends capex in year 1 and has no schedule. Total capex on the default project is 500.0000 million USD, so the sweep is asking what happens if that single year 1 outlay is 20 percent smaller or up to 50 percent larger.

All six templates on the default project, contractor NPV in million USD at each swept point:

| regime | x0.8 | x0.9 | x1.0 | x1.1 | x1.2 | x1.3 | x1.4 | x1.5 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Nigeria - PIA (2021) | 499.4700 | 466.1066 | 432.0925 | 397.9011 | 362.8470 | 327.7928 | 291.8238 | 255.8175 |
| Ghana - Deepwater | 195.6257 | 185.0914 | 172.7531 | 160.6465 | 143.3384 | 129.9510 | 107.3627 | 85.7833 |
| Brazil - Concession | 304.7089 | 296.9901 | 287.2804 | 275.6317 | 261.4250 | 244.4347 | 225.4505 | 203.9903 |
| USA - Gulf of Mexico | 457.1975 | 419.6318 | 382.0660 | 343.9464 | 305.6635 | 267.3371 | 228.4023 | 189.4674 |
| Angola - Deepwater PSC | 213.5335 | 218.7874 | 211.3787 | 206.8935 | 189.9459 | 174.9866 | 147.4539 | 124.9212 |
| Generic Royalty/Tax | 465.4141 | 431.2293 | 397.0445 | 362.8597 | 327.8018 | 292.5924 | 257.3831 | 221.3360 |

## The row that goes the wrong way

Angola - Deepwater PSC returns 213.5335 million USD at a multiplier of 0.8 and 218.7874 at 0.9. Spending more capital made the contractor better off. The mechanism is in the template's tax stack: it carries a resource rent tax at 50 percent whose relief is a pool opened once at total capex times one plus the uplift, so a larger capex opens a larger pool and holds the tax off for longer. Brazil - Concession, with a resource rent tax at 40 percent, shows the muted version of the same thing, giving up only the step from 304.7089 to 296.9901 over the first interval. USA - Gulf of Mexico and Generic Royalty/Tax, which carry no resource rent tax and take 100 percent of profit oil, fall in near even steps from 457.1975 to 189.4674 and from 465.4141 to 221.3360. The templates that split profit oil on the R factor fall unevenly instead, because raising capex also raises cumulative cost, which lowers the R factor and holds the contractor in a more generous tranche for longer.

## The mistake

Reading the curve as a straight line is the error, and the published capex cases show why. The nine published runs of the Designer's sample PSC regime move at multipliers of 0.7 to 1.5, returning NPVs of 220.1703, 204.6839, 189.9756, 169.7176, 149.8784, 123.6342, 98.2520, 69.4751 and 41.2671 million USD, with payback stepping 3, 3, 4, 4, 4, 5, 5, 6 and 6 and payout stepping 2, 2, 2, 3, 3, 3, 4, 4 and 4. A capex increase does not just lower NPV. It delays the year the contractor turns positive, delays the R factor through 1.0 and can move a profit split tier with it.

## What it refuses

The multiplier is a single scalar on the whole capital programme. It cannot move drilling without facilities, it cannot reschedule a dollar out of year 1, and it does not touch opex, so a cost overrun that would in reality raise both is modelled as capital only. It also holds price fixed, so nothing in this sweep answers what an overrun costs at a low price.

## Exercise

Give the eight multipliers the engine returns and the contractor NPV at each for Generic Royalty/Tax. Then explain why Angola - Deepwater PSC is worth more at a multiplier of 0.9 than at 0.8.
