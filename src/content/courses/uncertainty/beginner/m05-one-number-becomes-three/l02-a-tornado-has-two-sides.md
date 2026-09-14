# A tornado has two sides

A tornado chart draws each sensitivity row as a bar from its low end to its high end, sorted with the widest bar on top. Each bar has two ends measured separately, and on ISIALA the two ends of a bar are not mirror images.

{{panel:ec-screening-explorer}}

## The bars and their order

The swing is the NPV at 1.3 minus the NPV at 0.7, derived from the two engine values.

| input | NPV at 0.7 | NPV at 1.3 | swing, high minus low (derived) |
| --- | --- | --- | --- |
| Oil Price | -17.3893 | 175.8952 | 193.2845 |
| Production | -17.3893 | 175.8952 | 193.2845 |
| CAPEX | 126.2382 | 32.7547 | -93.4835 |
| OPEX | 85.3696 | 76.7233 | -8.6463 |

Sorted by width, Oil Price and Production tie at 193.2845, CAPEX follows at 93.4835 in width and OPEX sits at the bottom. The sign of the swing records direction: raising capex or opex lowers NPV, so their swings print negative. A chart that sorts on the signed number puts OPEX above CAPEX and both below everything positive, which is the wrong order.

## Why the two sides differ

Draw the base NPV of 81.0464 as the spine. Oil Price runs from -17.3893 on one side to 175.8952 on the other, and the drop below the spine is larger than the rise above it. CAPEX is lopsided the other way: 126.2382 at 0.7 sits closer to the spine than 32.7547 at 1.3.

The ledger explains both. ISIALA pays no tax in 2027 and 2028, and the engine taxes only a positive base and carries no loss forward. Revenue lost in those two years was never going to be taxed, so it costs the full amount, while extra revenue there pushes 2027 into tax and the state takes a share of the gain. Extra capex lands in years that already pay no tax, so it gets no tax relief and hurts in full, while saved capex creates taxable income and is partly taxed away. OPEX, scaled only by 2.5 million USD a year, never flips a year into or out of tax, and its two sides match to within a rounding of the last decimal: 85.3696 and 76.7233 either side of 81.0464.

## The mistake

The careful mistake is to compute one side and mirror it. A reader who runs only the price downside, sees -17.3893, and draws the upside as the same distance above 81.0464 overstates the upside, because part of the upside is taxed in 2027 while the matching part of the downside never was. The second mistake is to read the tie at the top as two independent risks. Production and Oil Price are one lever in this engine, since variable opex does not follow the volume, so the chart counts a single effect twice.

## What it refuses

A tornado keeps the sweep's limits. Every bar spans the same 0.7 to 1.3 regardless of how uncertain the input is, so bar length ranks the engine's arithmetic and says nothing of real likelihood. It moves one input at a time, so the corners where price and capex go wrong together never appear, and it carries no probability: neither end is a percentile of anything.

## Exercise

Write the two ends of ISIALA's Oil Price and CAPEX bars and say, for each, which side lies further from 81.0464. Then explain the Oil Price asymmetry from the tax paid in 2027 and 2028, and say why OPEX is symmetric.
