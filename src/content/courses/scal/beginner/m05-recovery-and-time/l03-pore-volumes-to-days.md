# Pore volumes to days

Everything this course has computed so far lives in dimensionless time. Breakthrough at 0.33077027444818546 pore volumes injected is a statement about the rock and the fluids, true for any injection rate, any pore volume, any calendar. But nobody schedules a rig, a water plant, or a cash flow in pore volumes. The conversion to days is one multiplication and one division, and it is where the displacement theory finally touches the operational world.

## The conversion

At a constant injection rate the calendar time to inject $Q_i$ pore volumes is

$$t = \frac{Q_i \times PV}{i_w}$$

where $PV$ is the pore volume in barrels and $i_w$ the injection rate in barrels of water per day. The engine calls this pvToDays, and its inverse daysToPv, and there is nothing inside either beyond this formula. The physics stays in $Q_i$; the conversion is bookkeeping.

The Ekene pore volume is 22410845.5314109 barrels, carried straight from the locked volumetric booking. At a steady 8000 barrels of water per day, one full pore volume takes

$$\frac{22410845.5314109}{8000} = 2801.3556914263622 \text{ days}$$

about seven and two thirds years. Breakthrough arrives at a third of that:

$$t_{bt} = 0.33077027444818546 \times 2801.3556914263622 = 926.6051908800841 \text{ days}$$

call it two and a half years of clean oil before the water shows up. That breakthrough time at 8000 barrels per day is a graded capstone number, so know its chain: front slope to $Q_i$, $Q_i$ times pore volume, divided by rate.

## Rate changes the clock, not the curve

Run the same conversion at other rates. At 5000 barrels per day, one pore volume takes 4482.16910628218 days and breakthrough arrives at 1482.5683054081346 days. At 10000, one pore volume takes 2241.08455314109 days and breakthrough lands at 741.2841527040673 days. Double the rate from 5000 to 10000 and both times exactly halve; the ratio of breakthrough time to one pore volume time is 0.33077027444818546 in every column.

That invariance is worth stating carefully, because it is a property of this model, not of nature. In the horizontal displacement this course has built, the injection rate appears nowhere in the fractional flow equation, so the saturation history in pore volume time is fixed by the rock and fluids alone, and rate only stretches or compresses the calendar axis. Rate buys schedule. It does not buy recovery.

Hold the caveat alongside it: the engine also carries a gravity term for dipping reservoirs, and in that term the rate genuinely does enter the physics. On a flat Ekene case it is dormant. The Expert tier opens it up.

## Reading a flood schedule

The three numbers an engineer quotes from this arithmetic are worth naming. Fill up time is not modelled here; this displacement assumes the water immediately does displacement work. Breakthrough time, 926.6051908800841 days at the design rate, is when produced water handling must be ready and when the clean oil plateau ends. And the pore volume clock, 2801.3556914263622 days per pore volume at 8000 barrels per day, is the natural unit for everything after breakthrough: the recovery landmarks of lesson one, about 0.534 of the oil displaced at half a pore volume and about 0.565 at one, convert to roughly 1400 and 2800 days on this schedule. Those two are interpolated round number readings, not graded values, but they turn the recovery profile into a decade long production forecast at a glance.

## The misconception to avoid

The tempting error is to believe that injecting faster improves the flood. In this model it cannot: every saturation, every efficiency, every fractional flow value is pinned to pore volume time, and rate is a pure rescaling of the calendar. If a simulation or a field ever shows recovery responding to rate, the cause lives outside this model: gravity working with or against the dip, capillary end effects, unstable viscous fingering, or injectivity limits. Knowing that the ideal displacement is rate blind is exactly what makes rate sensitivity in real data diagnostic.

## Worked example

A planner asks what injection rate delivers breakthrough in exactly two years, taking a year as 365.25 days, so 730.5 days. Invert the conversion:

$$i_w = \frac{Q_i \times PV}{t} = \frac{0.33077027444818546 \times 22410845.5314109}{730.5}$$

The numerator is the breakthrough volume in barrels, which is also 8000 times 926.6051908800841, just over 7.41 million barrels. Dividing by 730.5 days gives roughly 10150 barrels of water per day. Check the answer against the table above: it should sit just above the 10000 barrel per day column, whose breakthrough time of 741.2841527040673 days is indeed slightly longer than two years.

## Exercise

Part one: compute the calendar time, at the 8000 barrel per day design rate, for the flood to go from breakthrough to one full pore volume injected, using only the two graded style numbers in this lesson. Then express that interval as a fraction of the total time to one pore volume and say which side of the flood's life, before or after breakthrough, owns most of the calendar.

Part two: your facilities colleague can only secure 5000 barrels per day of injection water for the first year. Without any new engine runs, explain in two sentences what this does and does not change about the displacement, and which single number in this lesson they should now re-derive for the water handling plan.
