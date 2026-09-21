# A fatality prevented, and its value

{{panel:qr-alarp}}

An individual risk in the TOLERABLE region must be reduced as low as reasonably practicable. To decide whether a particular measure is reasonably practicable, its cost is weighed against its benefit, and the benefit starts with the fatalities it prevents. A measure that lowers the potential loss of life by deltaPLL fatalities a year prevents that many fatalities each year on average, and each prevented fatality is given a money value, the value of preventing a fatality, or VPF.

## The yearly benefit

The engine's `costBenefit` writes the yearly benefit as B = deltaPLL x VPF + the sum of expected cases a year times the value per case, the second term covering the injuries and ill health the measure prevents. Over the measure's life the benefit is the present value of B each year, uprated by a growth rate if one is given. This lesson keeps to the first term.

The EDIKAN firewall is the teaching measure for this tier. Its inputs, all stated:

| input | value |
| --- | --- |
| deltaPLL, per year | 2e-3 |
| VPF | 1000000 |
| life, years | 20 |
| capital at year 0 | 250000 |
| annual cost | 5000 |
| DF | 3 |

Undiscounted, the fatality benefit is 2000.00 a year, and over the life the present value of the benefit is 40000.00.

## VPF has no default

The engine invents no VPF. It exports two HSE figures as HSE_ILLUSTRATIVE_VALUES, for illustration only:

| illustrative VPF | source |
| --- | --- |
| 1000000 | R2P2 Appendix 3 paragraph 13, "about GBP 1 000 000 (2001 prices)" |
| 1336800 | the CBA checklist (2003 values), "fatality GBP 1,336,800 (times 2 for cancer)" |

Each is in GBP at its own price year. Current HSE figures were not found on a live page, so neither is a recommendation. A call with no VPF is refused:

> vpf: the value of preventing a fatality is required, above 0; HSE figures are illustrative only (HSE_ILLUSTRATIVE_VALUES)

The analyst states the VPF, its currency and its year, and justifies the choice in the note.

## A published check

R2P2 Appendix 3 paragraph 13 gives a check on the arithmetic: with a VPF of 1000000, a reduction of one in 100,000 in the individual risk of one person is worth about 10. Through the engine, deltaPLL 1e-5 for 1 year gives a benefit of 10.00. The published figure reproduces, and it is one of the two published checks behind the cost benefit arithmetic this tier grades.

## A measure must lower the PLL

deltaPLL is a reduction, so it must be zero or more. A measure that raises the PLL is refused, because there is nothing on the benefit side to weigh:

> deltaPllPerYr: must be the reduction in PLL, 0 or more fatalities per year (a measure that raises risk has no benefit to weigh)

A design change that moves people closer to a hazard is assessed as a new individual risk and a new PLL, run through the earlier tiers.

## Exercise

Take the EDIKAN firewall's yearly fatality benefit of 2000.00 and its stated deltaPLL of 2e-3 and VPF of 1000000. Show that the yearly benefit is their product, then multiply it by the life of 20 years and check that you reach the undiscounted present value of the benefit, 40000.00. Finally, redo the yearly product with the 2003 illustrative VPF of 1336800 and write one sentence on why the note must state which VPF it used.
