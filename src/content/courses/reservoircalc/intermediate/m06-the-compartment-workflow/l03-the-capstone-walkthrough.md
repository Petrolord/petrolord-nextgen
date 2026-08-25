# The capstone walkthrough

The capstone asks for six numbers describing the Ekene fault blocks. This lesson walks through obtaining each one and says what each is testing.

## The task

A sealing fault at an easting of 1800 m splits the accumulation into a western and an eastern block. Both blocks are booked at the 1560 m contact. Report the cell count, the gross rock volume and the STOIIP for each block.

The two blocks must sum to the field total you booked at the Associate tier, which is the check built into the task.

## The settings

Set the panel to a fault easting of 1800 m, a west block contact of 1560 m and an east block contact of 1560 m. That is the default configuration, so if you have not moved anything, you are already there.

{{panel:rc-block-explorer}}

## The six values

The cell counts are the first tile pair. The west block holds 117 oil bearing cells and the east block 52. Both are counts, so both are graded exactly: there is no tolerance and a value of 116 or 118 scores nothing.

The gross rock volumes are the second tile pair, in millions of cubic metres. The west block gives 18.079852294921874 and the east 4.189183349609375. The graded tolerances are 0.05 and 0.02 respectively, so reading four decimal places off the tile is comfortably enough.

The STOIIP values are the third tile pair, in millions of stock tank barrels. The west block gives 9.85561714769438 and the east 2.2835909598023787, with tolerances of 0.05 and 0.02.

## What each pair is testing

The cell counts test whether you partitioned the same 169 cells the tier below booked, rather than recomputing the accumulation. A pair that does not add to 169 means the contact was changed or the labels do not cover the frame.

The gross rock volumes test the partition itself, before any property enters. They are the cleanest measure of whether the split was done correctly, because they depend only on the geometry and the labels.

The STOIIP values test the chain applied per block. Since the properties are the same in both blocks, these carry no information the gross rock volumes do not, and they are asked for because they are what a decision maker reads.

## Checking before you submit

Three checks take under a minute and catch almost everything.

Add the cell counts. They must give 169.

Add the gross rock volumes. They must give 22.269036 million cubic metres, the field figure from the Associate tier.

Add the STOIIP values. They must give 12.139208 MMstb to the six decimals the panel prints. If they differ in the sixth decimal, you have read one of them off a different configuration.

## Worked example

Derive the west block's STOIIP from its gross rock volume by hand, so that the tile is confirmed rather than copied.

The west block's gross rock volume is 18.079852 million cubic metres. Apply net to gross:

$$18.079852 \times 0.8 = 14.463882 \times 10^6 \ \mathrm{m^3}$$

Apply porosity:

$$14.463882 \times 0.20 = 2.892776 \times 10^6 \ \mathrm{m^3}$$

Apply oil saturation, which is $1 - 0.35$:

$$2.892776 \times 0.65 = 1.880305 \times 10^6 \ \mathrm{m^3}$$

Convert to stock tank barrels through the formation volume factor:

$$\frac{1.880305 \times 10^6}{1.2} \times 6.2898 = 9.855617 \times 10^6 \ \mathrm{stb}$$

which is the graded value to six figures. The east block runs the same way from 4.189183 million cubic metres to 2.283591 MMstb.

## A common error

The most frequent mistake on this capstone is reading the block values from a panel whose east contact has been left at 1550 or 1570 m from an earlier module. The west values are then correct and both east values are wrong, and since the west is right the error is easy to miss.

The three sum checks above catch it immediately, which is why they are worth doing every time.

## Exercise

Record the six capstone values from the panel, then verify all three sums. State what each sum should be and confirm your readings against it.

Self check: 117 and 52 cells sum to 169; 18.079852 and 4.189183 million cubic metres sum to 22.269036; 9.855617 and 2.283591 MMstb sum to 12.139208. All three match the Associate tier's field booking, which is the confirmation that the partition divided the accumulation rather than recomputing it.
