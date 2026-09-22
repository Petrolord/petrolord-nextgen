# The capstone walkthrough

The capstone asks for six numbers describing two Ekene fault blocks. Its brief states a case of its own: a fault easting and a contact for each block, which you type into the block explorer. This lesson walks the same six numbers on the teaching case, the one the panel opens on, and says what each is testing. The capstone does not grade the teaching values.

## The task

A sealing fault splits the accumulation into a western and an eastern block, and each block is booked against its own contact. Report the cell count, the gross rock volume and the STOIIP for each block.

On the teaching case the fault is at an easting of 1800 m and both contacts are 1560 m, so the two blocks must sum to the field total booked at the Associate tier. That check is built into the teaching case. With two different contacts the blocks no longer describe one tank, and the check becomes a check on each block against its own contact.

## The settings

The panel opens on the teaching case: a fault easting of 1800 m and both contacts at 1560 m. For the capstone, choose the fault easting the brief states and type each block's contact into its box.

{{panel:rc-block-explorer}}

## The six values, on the teaching case

The cell counts are the first tile pair. On the teaching case the west block holds 117 oil bearing cells and the east block 52. Both are counts, so both are graded exactly: there is no tolerance and a count one cell out scores nothing.

The gross rock volumes are the second tile pair, in millions of cubic metres. On the teaching case the west block gives 18.079852294921874 and the east 4.189183349609375. The capstone tolerances are 0.05 and 0.02 respectively, so reading four decimal places off the tile is comfortably enough.

The STOIIP values are the third tile pair, in millions of stock tank barrels. On the teaching case the west block gives 9.85561714769438 and the east 2.2835909598023787, with tolerances of 0.05 and 0.02.

## What each pair is testing

The cell counts test the partition and the contacts together. On the teaching case they add to the 169 cells the tier below booked; a pair that does not means a contact was changed or the labels do not cover the frame. With two contacts, each block's count follows its own contact.

The gross rock volumes test the partition itself, before any property enters. They are the cleanest measure of whether the split was done correctly, because they depend only on the geometry and the labels.

The STOIIP values test the chain applied per block. Since the properties are the same in both blocks, these carry no information the gross rock volumes do not, and they are asked for because they are what a decision maker reads.

## Checking before you submit

Three checks take under a minute and catch almost everything. On the teaching case they are sums against the Associate booking.

Add the cell counts. They must give 169.

Add the gross rock volumes. They must give 22.269036 million cubic metres, the field figure from the Associate tier.

Add the STOIIP values. They must give 12.139208 MMstb to the six decimals the panel prints. If they differ in the sixth decimal, you have read one of them off a different configuration.

On a case with two contacts, run the same checks block by block instead: set both contacts to one block's contact, and that block's tiles must not move when you change the other block's contact.

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

which is the tile value to six figures. The east block runs the same way from 4.189183 million cubic metres to 2.283591 MMstb.

## A common error

The most frequent mistake on this capstone is typing one block's contact into the other block's box. The fault is right, the counts look plausible, and both pairs of volumes are wrong.

Read each contact back against the brief before you read a tile, and run the block by block check above.

## Exercise

Record the six values of the teaching case from the panel, then verify all three sums. State what each sum should be and confirm your readings against it.

Self check: 117 and 52 cells sum to 169; 18.079852 and 4.189183 million cubic metres sum to 22.269036; 9.855617 and 2.283591 MMstb sum to 12.139208. All three match the Associate tier's field booking, which is the confirmation that the partition divided the accumulation rather than recomputing it.
