# The case the studio ships with

{{panel:fc-chemistry-explorer}}

{{panel:fc-rate-explorer}}

The studio opens on a case that is already filled in, so the first screen any user sees is this one. Walking it end to end once, with the conversions in view, is the fastest way to connect the five modules you have just read.

The inputs arrive in field units and reach the engine converted. A temperature of 140 F becomes 60.000000 C. A pressure of 725 psig becomes 51.000427 bar. Carbon dioxide at 3 mol% becomes a mole fraction of 0.030000 and hydrogen sulphide at 0.1 mol% becomes 0.001000. The in situ pH is 4.500000. A velocity of 10 ft/s becomes 3.048000 m/s and a line inside diameter of 6 in becomes 0.152400 m. The density of 56 lb/ft3 becomes 897.036000 kg/m3 and the viscosity of 1 cp becomes 1.000000 mPa s. The line is water wet at a water cut of 1.000000, the corrosion inhibitor is 90.000000 percent efficient at 95.000000 percent availability, and the allowance is 3.175000 mm with 0.000000 mm consumed against a design life of 20.000000 yr.

## The chain, one step at a time

The carbon dioxide partial pressure is 1.530013 bar. The fugacity coefficient is 0.878581, so the fugacity the rate runs on is 1.344240 bar. The reaction term is 44.225132 mm/yr, the transport term is 11.701938 mm/yr and their series combination is 9.253475 mm/yr, with transport controlling at a margin of 2.779300.

Then the corrections. The computed film onset is 80.984504 C and the stream is at 60.000000 C, so the film multiplier is 1.000000000000 and no film credit is taken. The pH factor at 4.500000 is 0.562341 against a reference of 4.000000. The water wetting factor is 1.000000. That leaves an uninhibited rate of 5.203611 mm/yr, which the screen also prints as 204.866591 mpy.

Finally the corrosion inhibitor programme. The effective protection is 85.500000 percent, which is 4.500000 percentage points short of the efficiency on the datasheet, and the rate the screen reports is 0.754524 mm/yr, printed beside it as 29.705656 mpy. The band label is high and the engine declares that band held.

## The rest of the screen

The flow side gives a Reynolds number of 416686.8569 on this module's own definition, a turbulent branch for this module's friction factor, a wall shear of 14.408065 Pa and a film risk of low, so no corrosion inhibitor credit is removed here. The line sizing course computes its own friction factor and Reynolds number with a different correlation, and the two will not agree on the same pipe. The hydrogen sulphide partial pressure is 0.051000 bar, above the screening threshold by 1.163506 decades, the ratio is 0.033333333333 and the regime is mixed. The remaining life is 4.207953 yr.

## Exercise

Reproduce three of the conversions yourself from the field units above and check them against the engine's figures. Then take the combined rate of 9.253475 mm/yr, apply the pH factor of 0.562341 and the wetting factor of 1.000000, and see how close you come to the uninhibited rate of 5.203611 mm/yr. Say which remaining step accounts for the distance between that figure and the reported 0.754524 mm/yr.
