# ED times EA times EV

A waterflood recovery factor is the product of three efficiencies. Each is less than one, each is owned by a different part of the curriculum, and the most common mistake in the whole subject is being unclear about which volume the product is a fraction OF.

## The three

**Displacement efficiency $E_D$.** Of the oil in the rock the water actually passes through, what fraction is removed. Set by the relative permeability curves, the viscosities, and how much water has been injected. Owned by the SCAL and Displacement course. Its ceiling for the Ekene sand is

$$E_{D,\max} = \frac{1 - S_{wc} - S_{or}}{1 - S_{wc}} = \frac{0.4}{0.65} = 0.6153846153846154$$

**Areal sweep $E_A$.** Of the pattern area, what fraction the water has contacted. Set by the pattern geometry and the mobility ratio. The previous two lessons.

**Vertical sweep $E_V$.** Of the column thickness, what fraction the water has contacted. Set by the permeability distribution and the mobility ratio. Module 2.

$$RF = E_D \times E_A \times E_V$$

## A worked product for Ekene

Take the design case at its economic limit: $E_A = 1$ because the areal sweep has saturated, $E_V = 0.5146907350993352$ from the Dykstra-Parsons coverage at first breakthrough, and a displacement efficiency at the end of the run of 0.5545614215589451.

$$RF = 0.5545614215589451 \times 1 \times 0.5146907350993352 = 0.2854276257199057$$

of the oil in place in the pattern element. Under thirty percent.

## The trap

The forecast engine reports a recovery factor of 0.5545614215589451 for that same case, and calls it `recoveryFactorOfFloodedOOIP`.

Both numbers are correct and they differ by a factor of nearly two, because they are fractions of different volumes.

The engine's pattern volume is computed as

$$PV = 7758 \times A \times h \times \phi \times E_V$$

with the vertical sweep multiplier ALREADY APPLIED. So the "flooded oil in place" is the oil in the swept part of the column, not the oil in the element. The recovery factor of that reduced volume does not contain $E_V$ again, because $E_V$ has already been used to define it.

Multiply it in a second time and you have applied the vertical sweep twice.

## How to keep it straight

Write the volume in the name, every time.

- "Recovery factor of the flooded pore volume" = $E_D \times E_A$
- "Recovery factor of the pattern element" = $E_D \times E_A \times E_V$
- "Recovery factor of the field" = the above, times the fraction of the field inside patterns

Three numbers, each smaller than the last, each correct, and only the last one belongs in a sentence beginning "this flood will recover".

Ekene's design case in those terms: 0.5545614215589451 of the flooded pore volume, about 0.285 of the element, and less than that of the field once the out-of-zone injection and the unflooded western part are accounted for.

## Checking the decomposition

You can verify the engine is doing what you think. At the end of the design case the areal sweep is 1, so the reported recovery factor should equal the displacement efficiency alone. Divide:

$$\frac{RF}{E_A} = \frac{0.5545614215589451}{1} = 0.5545614215589451$$

and compare with the displacement ceiling of 0.6153846153846154. The run ended at 90 percent of the maximum displacement efficiency, which is what a run stopped at a water oil ratio of 31 should look like.

That check works because $E_A$ reached exactly 1. Mid-run, when $E_A$ is between $E_{Abt}$ and 1, the same division recovers the instantaneous displacement efficiency and is a useful sanity check on any forecast output.

{{panel:wf-design-explorer}}

Toggle the EV button between 1 and the layer-column value and watch the recovery factor tile. It barely moves, because it is a fraction of a volume that moved with it. The Np tile roughly halves, because that is an absolute volume. Watching those two tiles disagree is the lesson.

## Why the engine does it this way

Because for a screening forecast, the flooded pore volume is the natural unit: it is the volume the displacement calculation applies to. Folding $E_V$ into the volume rather than into the recovery factor keeps the displacement solution clean.

It is a defensible design and it is a trap for a reader who has not checked. The engine's own warning says "vertical sweep applied as a constant multiplier on the flooded volume", which is exactly the information needed, in a string most people will not read.

## The misconception to avoid

"Recovery factors from different sources can be compared." Only if they are fractions of the same volume. A published recovery factor of 55 percent and one of 28 percent can be the same flood. Before comparing two recovery factors, establish the denominator of each, and if you cannot, do not compare them.

## Exercise

First, compute the recovery factor of the pattern element for the design case from the three efficiencies, and then compute what it would be if the areal sweep had stopped at its breakthrough value of 0.6573574366303985 instead of reaching 1.

Second, a report quotes "recovery factor 45 percent" for a waterflood. Write the three questions you would ask, in order, before using that number.
