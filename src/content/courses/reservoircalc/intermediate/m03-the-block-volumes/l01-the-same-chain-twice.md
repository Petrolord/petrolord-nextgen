# The same chain twice

The volumetric chain does not change when a field is partitioned. It runs once per block on that block's cells, and the result is two columns of numbers where there was one. This lesson lays those columns out and reads them.

## The two columns

At a fault of 1800 m and a contact of 1560 m in both blocks, the chain gives this.

| Step | West | East | Field |
| --- | --- | --- | --- |
| Oil bearing cells | 117 | 52 | 169 |
| Gross rock volume (10^6 m3) | 18.079852 | 4.189183 | 22.269036 |
| Net volume (10^6 m3) | 14.463882 | 3.351347 | 17.815229 |
| Pore volume (10^6 m3) | 2.892776 | 0.670269 | 3.563046 |
| HCPV (10^6 m3) | 1.880305 | 0.435675 | 2.315980 |
| STOIIP (MMstb) | 9.855617 | 2.283591 | 12.139208 |

Every row of the first two columns adds to the third, to the precision printed. The field column is the Associate tier's booking, unchanged.

## The chain is the same chain

Each column is built by the same four multiplications the Associate tier used, applied to that block's gross rock volume.

Take the west block. Its 117 cells cover 1.17 square kilometres and carry a mean oil column of 15.452865 m, giving

$$117 \times 10{,}000 \times 15.452865 = 18.079852 \times 10^6 \ \mathrm{m^3}$$

of gross rock. Multiply by net to gross 0.8 for 14.463882 million cubic metres of net rock. Multiply by porosity 0.20 for 2.892776 million cubic metres of pore space. Multiply by oil saturation, which is one minus the water saturation of 0.35, for 1.880305 million cubic metres of hydrocarbon pore volume. Divide by the formation volume factor 1.2 to bring the oil to surface conditions and convert at 6.2898 stock tank barrels per cubic metre:

$$\frac{1.880305 \times 10^6}{1.2} \times 6.2898 = 9.855617 \times 10^6 \ \mathrm{stb}$$

which is the west block's booking. The east block runs identically on its own 4.189183 million cubic metres.

## What is genuinely new

Nothing in the arithmetic. What is new is that there are now two answers where the decision maker previously had one, and the two answers are not interchangeable.

The west block's 9.855617 MMstb is oil that a well in the west can drain. The east block's 2.283591 MMstb is oil that it cannot. Adding them is arithmetically correct and, for most decisions, misleading, because the sum describes a tank that does not exist.

This is the sense in which the Professional tier is harder than the Associate tier while using easier mathematics. The calculation got no more difficult. The reporting did.

## Reading it off the panel

Open the panel at the capstone settings and read the six block tiles against the table above.

{{panel:rc-block-explorer}}

The tiles are arranged in pairs so that west and east sit side by side for the same quantity. That arrangement is deliberate: the interesting reading is almost always the comparison rather than either number alone.

Read down the pairs and notice how the ratio between them changes as you go. The cells are in the ratio 2.25 to 1. Every volume row below them is in the ratio 4.32 to 1. The chain multiplies both blocks by the same four constants, so no step below gross rock volume can change the ratio. The whole difference between 2.25 and 4.32 is already present in the gross rock volume, which means it is a fact about the shape of the rock rather than about the properties. The next lesson but one takes that apart.

## Worked example

Check the east block from the field and the west without recomputing it, which is the arithmetic you will do most often when reading somebody else's report.

The field books 12.139208 MMstb and the west block 9.855617. Subtracting gives 2.283591 MMstb for the east, matching the engine.

Do the same for the cells: $169 - 117 = 52$. And for gross rock volume: $22.269036 - 18.079852 = 4.189184$ million cubic metres, which matches the engine's 4.189183 to five decimal places and differs in the sixth.

That last difference is not a mistake in either number. It is what happens when you subtract two rounded figures, and it is a small preview of the next lesson, which asks a more precise version of the same question: do the blocks add up exactly, or only nearly?

## Exercise

A report gives a field STOIIP of 40 MMstb split across three compartments, quoting 22 and 11 MMstb for the first two and omitting the third. It also states that the compartments hold 300, 150 and 100 oil bearing cells on a uniform grid. Compute the third compartment's booking, then state whether the cell counts are consistent with the volumes.

Self check: the third compartment holds $40 - 22 - 11 = 7$ MMstb. The cells split 300 to 150 to 100, so the first holds twice the area of the second while holding twice the barrels, which is consistent. The third holds two thirds of the second's area but well under two thirds of its barrels, so its mean oil column must be lower, which is worth asking about.
