# Two HSE conventions

{{panel:qr-alarp}}

Two HSE sources tell an analyst how to discount a cost benefit comparison, and they disagree. R2P2 (2001) discounts at 6 percent real and uprates benefits by 4 percent a year. The CBA checklist (2003) discounts benefits at no more than 1.5 percent and costs at no less than 3.5 percent. The engine takes all three rates as inputs, a benefit rate, a cost rate and a benefit growth rate, and prefers neither source. This lesson runs the EDIKAN firewall under each convention and reads what moves.

## The firewall under three conventions

| convention | benefit rate | cost rate | benefit growth | present value of the benefit | present value of the cost | cost / benefit | verdict at DF 3 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| undiscounted | 0 | 0 | 0 | 40000.00 | 350000.00 | 8.750000 | GROSSLY_DISPROPORTIONATE |
| the 2003 checklist limits | 0.015 | 0.035 | 0 | 34337.28 | 321062.02 | 9.350247 | GROSSLY_DISPROPORTIONATE |
| R2P2 Appendix 3 | 0.06 | 0.06 | 0.04 | 32946.93 | 307349.61 | 9.328625 | GROSSLY_DISPROPORTIONATE |

Rates are typed as fractions, 0.035 for 3.5 percent, and every one is stated in the row.

## What moves

Discounting lowers both present values. At the checklist limits the benefit falls from 40000.00 to 34337.28, and the cost from 350000.00 to 321062.02. The cost falls by less in proportion, because its capital of 250000 sits at year 0 and is never discounted. So the ratio rises, from 8.750000 to 9.350247. Under R2P2 the benefit is discounted at 6 percent and uprated by 4 percent, so it falls to 32946.93, while the cost falls to 307349.61, and the ratio lands at 9.328625.

For this measure the verdict at DF 3 is the same under all three conventions: GROSSLY_DISPROPORTIONATE. Every ratio is far above 3. For a measure whose ratio sat nearer its DF, the convention could decide the verdict, which is why an ALARP note always states the convention it used.

## The checklist gives limits

The checklist gives a ceiling for the benefit rate and a floor for the cost rate. The row above applies each limit at its edge, 0.015 and 0.035. An analyst who uses other rates within the checklist's limits states them, and the engine computes with whatever is typed. The label "the 2003 checklist limits" belongs to that one pair of rates and to no other. The checklist sets no growth rate, so the row uprates nothing, where R2P2 uprates the benefit by 4 percent a year against its discount rate of 6 percent. The growth rate is the third input, and a note states it even when it is zero.

## Why the engine prefers neither

Both sources are HSE guidance, of different dates, and both are published. The engine could have made one of them a default. It defaults every rate to zero instead and makes the analyst state all three, which keeps the choice visible. A reviewer reading 9.350247 knows the checklist limits were used, because the basis names the rates; one reading 9.328625 knows R2P2's were. The mechanics of discounting belong to the economics courses. The choice of rates for an ALARP comparison belongs to the analyst, together with its source and the reason for preferring it.

## Exercise

Take the three ratios for the firewall: 8.750000 undiscounted, 9.350247 at the checklist limits and 9.328625 under R2P2. Rank them, and say which input in the checklist row explains why its ratio is the highest of the three. Then write two sentences for an ALARP note: one stating which convention you used and its source, and one showing the verdict at DF 3 under the other two.
