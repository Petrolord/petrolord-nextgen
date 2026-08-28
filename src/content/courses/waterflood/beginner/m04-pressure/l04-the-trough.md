# The trough

The Ekene pressure track is a shallow V. It falls for four months, bottoms out, and then rises for thirty two. This lesson reads that shape carefully, because the shape is the whole diagnostic and the numbers attached to it are small enough that carelessness will lose them.

## The three landmarks

$$p(\text{flood start}) = 2096.0082626669955 \text{ psia}$$
$$p(\text{trough, 2023-04}) = 2088.9530115439275 \text{ psia}$$
$$p(\text{end, 2025-12}) = 2123.4461408278908 \text{ psia}$$

The fall from start to trough is 7.055251123068047 psi. The rise from trough to end is 34.4931292839633 psi. The net gain over the whole flood is 27.437878160895252 psi.

Those are not big numbers. Ekene spent 1103.9917373330045 psi during three years of primary depletion; the flood's first three years bought back two and a half percent of that. Waterfloods on small fields are slow, and the pressure story is one of arresting a decline rather than reversing it.

## Why the trough is where it is

The trough is at month index 3, labelled 2023-04, where the target VRR was 0.97. The previous lesson explains why: break-even is 0.9869719699960521, and 0.97 is below it while the next month's 1.01 is above it. The last month that loses ground is the last month below break-even.

If you had assumed break-even was 1.0, you would have predicted the trough at month index 4, 2023-05, which sits at 2089.156081209666 psia. That is only 0.20306966573843965 psi above the true minimum, so the error is invisible in the pressure and obvious in the date. On a field where you are matching a model against surveys, being off by one month in the timing of a turning point is exactly the kind of disagreement that gets blamed on the data.

## Reading the derivative

The engine also reports $dp/dt$ in psi per month, computed as a central difference on the attached pressures and one-sided at the ends. Three values are worth knowing:

- at 2023-01, one-sided, $-0.14483967829573885$ psi per month
- the most negative value anywhere, $-0.2896793565914777$
- the most positive value anywhere, $1.1940927190132697$

The asymmetry is the shape of the V. The field loses pressure at a quarter of a psi a month and regains it at over a psi a month, because 1.05 is further above break-even than 0.85 was below it and because produced voidage falls as the producers decline.

Note that these derivatives are computed on the INTERPOLATED survey track rather than the closed-form model track. That is deliberate: it is what an engineer with six surveys and no model would actually be able to compute. The next lesson is about the difference.

{{panel:wf-ledger-explorer}}

Watch the amber lines. The bright one is the model track with its sharp V. The faint one is what the surveys interpolate, and its minimum is somewhere else entirely.

## Why a shallow trough is dangerous to read

Seven psi of decline over four months, on a gauge that reads to a psi, against a reservoir whose static pressure varies across the field anyway. That signal is genuinely small, and there are three ways to lose it.

**Resolution.** A survey rounded to the nearest 5 psi cannot see a 7 psi feature at all.

**Cadence.** A survey every six months has two points inside a four-month event, at best. The next lesson shows Ekene's cadence missing it entirely.

**Spatial variation.** A pressure survey is taken in one well. The tank pressure is an average. On a field where the injector side is 50 psi above the producer side, which is entirely normal, a 7 psi field-average feature is buried inside a much larger spatial gradient.

None of those makes the model wrong. They make the model unfalsifiable at this resolution, and an unfalsifiable model deserves to be labelled as such rather than presented as a measurement.

## What a trough is good for

Despite all that, the trough has one very robust use: its EXISTENCE. If the model says the pressure should have stopped falling around month four and the surveys show it still falling in month twelve, that is a large, structural disagreement, not a resolution problem. Something in the balance is wrong: an aquifer, a leak to a neighbouring block, injection going out of zone, or a compartment your injectors do not reach.

Read the trough for its sign and its rough timing. Do not read it for its depth.

## The misconception to avoid

"The pressure recovered, so the flood worked." Recovery of 34.49 psi says the voidage bookkeeping and the pressure agree, which means the tank assumption is holding up. It says nothing about how much oil the water displaced on its way, which is the other half of the job and which pressure cannot see. The Professional and Expert tiers spend their whole length on that half.

## Exercise

First, using the flood-start and trough pressures above, compute the average rate of pressure decline in psi per month over those four months. Compare it with the most negative reported $dp/dt$ of $-0.2896793565914777$ psi per month and note that the model's average decline is roughly six times steeper. Explain which of the two series each number was computed on, and why that explains the whole gap.

Second, you are asked whether a proposed quarterly survey cadence would have resolved the Ekene trough. Answer with a number of surveys that would fall inside the falling limb, and state what you would additionally require of the gauge resolution.
