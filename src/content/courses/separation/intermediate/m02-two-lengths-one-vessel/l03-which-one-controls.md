# Which one controls

A horizontal vessel is as long as the larger of its two requirements. On ABANA-2 at 8.000000 ft the liquid asks for 23.270539 ft and the gas asks for 2.396801 ft, so the vessel is 23.270539 ft long and the controlling requirement is liquid.

{{panel:fc-slug-explorer}}

## Both requirements, side by side

| diameter ft | liquid length ft | gas length ft | length ft | controlling |
| --- | --- | --- | --- | --- |
| 5.000000 | 59.572579 | 3.834882 | 59.572579 | liquid |
| 6.000000 | 41.369847 | 3.195735 | 41.369847 | liquid |
| 7.000000 | 30.394173 | 2.739202 | 30.394173 | liquid |
| 8.000000 | 23.270539 | 2.396801 | 23.270539 | liquid |
| 9.000000 | 18.386599 | 2.130490 | 18.386599 | liquid |
| 10.000000 | 14.893145 | 1.917441 | 14.893145 | liquid |

Liquid controls every row, and it controls by a wide margin. The closest the two requirements come on this family is at 10.000000 ft of bore, where 14.893145 ft still stands against 1.917441 ft.

## Why liquid usually wins

The two requirements scale differently. The liquid length is a fixed volume divided by an area, so it falls steeply as the drum widens, from 59.572579 ft to 14.893145 ft across this family. The gas length is a height multiplied by a ratio of two velocities, and it barely moves, from 3.834882 ft to 1.917441 ft across the same range.

A vessel with a real liquid duty on it therefore sits in the region where the liquid number is the large one. The published cases behave the same way: a 6.000000 ft drum on 25000.000000 bpd reports liquid 20.684923 ft against gas 2.496548 ft, and an 8.000000 ft drum on 30000.000000 bpd reports liquid 31.149488 ft against gas 4.157188 ft. Both are controlled by the liquid.

## When gas does control

It happens, and when it does it is a symptom. The published gas-overloaded case runs a 6.000000 ft three-phase vessel with a gas velocity of 2.829421 ft/s against a settling velocity of 0.500000 ft/s. The gas is moving faster than the droplet falls, so a droplet rides a long way before it lands: the gas length comes out at 16.976527 ft against a gas height of 3.000000 ft, and the controlling requirement is gas.

That same vessel reports a margin of 0.176715 and gasCapacityOk false. The gas requirement took control of the length on a vessel that cannot carry its gas at all.

## Reading the pair rather than the label

The useful reading is the gap between the two requirements rather than the name of the winner. On the 8.000000 ft drum, 23.270539 ft against 2.396801 ft says the vessel is entirely a liquid-holding problem, and any effort spent on the gas side of the sizing will not move the length at all. A vessel where the two numbers sit close together is a different animal, because a small change in the level or the duty could hand control to the other requirement.

## The mistake

The mistake is reading the controlling label as a design finding. Controlling says which of two numbers was larger. It says nothing about whether the vessel passed, and a vessel whose length is set by gas has already failed the check that matters. The second mistake is reporting the smaller requirement because it looked like the answer the project wanted.

## Exercise

For the 6.000000 ft and 9.000000 ft drums, give both requirements, the length and the controlling requirement. Explain why the liquid requirement falls so much faster than the gas requirement as the bore widens. Then state what gas control indicated on the published 6.000000 ft case, and give that case's margin.
