# What moves the duty

The reboiler duty has more parents than the circulation does, and the useful discipline is to separate the two duties the engine reports. One is a duty per gallon and the other is a duty an hour, and different things reach them.

{{panel:fc-water-explorer}}

## What reaches the Btu a gallon

The still temperature, through the sensible term. The absorber temperature, through the same term. The circulation ratio, through how much water a gallon carries. The reflux ratio, through the fraction added to the overhead.

The rate does not reach it. That is the point the rate table made and it is worth repeating here, because the Btu a gallon is the figure most easily mistaken for a result.

| rate, MMscfd | Btu per gallon |
| --- | --- |
| 10.000000 | 1815.8525 |
| 62.000000 | 1815.8525 |
| 250.000000 | 1815.8525 |

## What reaches the MMBtu an hour

Everything above, plus the rate, plus the spec. The duty an hour is the duty a gallon multiplied by the gallons a day and divided by a group factor, so anything that moves either of the two figures in that product moves the duty.

| gal per lb | Btu per gal | reboiler, MMBtu/hr |
| --- | --- | --- |
| 2.000000 | 2073.6650 | 0.497666 |
| 3.200000 | 1815.8525 | 0.697269 |
| 5.000000 | 1661.1650 | 0.996673 |

That table is the one people misread. Raising the ratio lowers the Btu a gallon and raises the MMBtu an hour, both at once, and the two columns go in opposite directions down the same table. Anyone quoting a duty per gallon as a measure of efficiency is quoting a number that improves as the loop gets more expensive to run.

## Why the split is the honest presentation

A single duty figure would hide that. Split, the answer tells you two separate things: what a gallon of this glycol loop costs to regenerate, and how many gallons this plant is regenerating. The first is chemistry and temperature. The second is size.

Two plants with the same MMBtu an hour can have quite different Btu a gallon figures, and the one with the lower figure per gallon is the one circulating more glycol. That is the sort of statement a combined number makes impossible.

## The two terms answer different complaints

A duty that looks too high has two possible remedies and the split says which one applies. If the sensible term dominates, the loop is carrying a lot of solvent for the water it removes, and the remedy is the circulation ratio or the still temperature. If the overhead term dominates, each gallon is heavily loaded with water, and the remedy is more circulation rather than less.

Those remedies point in opposite directions, which is exactly why a combined figure cannot be acted on. On OBIAFU the sensible term is 0.763369 of the total, so this particular loop is mostly paying to warm glycol up.

## The order to read them in

Read the Btu a gallon first and ask whether the loop looks sensible. Then read the gallons a day and ask whether the plant looks the right size. Only then read the MMBtu an hour, which is the product of two judgements you have already made.

## Exercise

List every input that reaches the Btu a gallon and every one that reaches the MMBtu an hour. Then record both columns at 2.000000, 3.200000 and 5.000000 gal per lb, and say in one sentence why they move in opposite directions.
