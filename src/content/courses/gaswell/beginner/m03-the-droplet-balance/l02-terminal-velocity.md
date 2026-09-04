# Terminal velocity

Three groups, three exponents, and no fourth thing. The whole balance is a quarter power, a quarter power and a minus one half power.

{{panel:pd-droplet-explorer}}

## The exponents, checked rather than asserted

| Interfacial tension, dyne/cm | Density difference, lbm/ft3 | Gas density, lbm/ft3 | Terminal, ft/s |
| --- | --- | --- | --- |
| 1.0 | 60.0 | 3.0 | 2.5605819862 |
| 16.0 | 60.0 | 3.0 | 5.1211639724 |
| 60.0 | 1.0 | 3.0 | 2.5605819862 |
| 60.0 | 16.0 | 3.0 | 5.1211639724 |
| 60.0 | 60.0 | 1.0 | 12.3434660205 |
| 60.0 | 60.0 | 4.0 | 6.1717330102 |

Sixteen times the tension doubles the velocity, a ratio of exactly 2.0000000000. Sixteen times the density difference doubles it, the same 2.0000000000. Four times the gas density halves it, 0.5000000000. Two fourth roots and one inverse square root. The identical 2.5605819862 ft/s at sigma 1.0 with a density difference of 60.0 and at sigma 60.0 with a density difference of 1.0 is the symmetry between the two groups showing itself, since both enter at the same power.

## Which lever is worth pulling

A quarter power is a flat thing. To move the velocity by a factor of two through the liquid properties you need a factor of sixteen in one of them, and no gas well produces a liquid that varies by anything close to that. The gas density carries the minus one half, and it is the one term of the three a station measures rather than assumes. Loading is a pressure and temperature story, not a fluid chemistry story.

## Coleman is this number

The terminal velocity is what the balance returns. Coleman applies an adjustment of 1.0000, so a Coleman critical velocity is the terminal velocity relabelled: 6.5866393859 ft/s at 1000.0 psia and 540.0 degR is both. Turner applies 1.2000 to the same number and reads 7.9039672631 ft/s at that station. The published table carries both names on every row so the identity cannot be mistaken for an agreement between two methods.

## The mistake

Refining an interfacial tension. Somebody notices that 60.0 dyne/cm is a book value rather than a measurement of this well's brine, and sends a sample away. An error of a factor of two in tension is an error of far less than that in velocity, and it is smaller than the effect of reading the temperature at the wrong hour. The same effort spent on which station the pressure came from moves the answer by more.

## What it refuses

An interfacial tension of 0.0 dyne/cm returns `ok = false` and no velocity, because a liquid with no tension forms no droplet and there is nothing for the Weber condition to size. The balance also refuses to model more than one droplet at a time, so it never says how much liquid is being carried, only whether one droplet of the largest stable size goes up or down.

## Exercise

Reproduce the three ratios 2.0000000000, 2.0000000000 and 0.5000000000 from the six rows, and name the exponent each one demonstrates.

Then say which of the three groups you would spend a day measuring, and why it is not the tension.
