# Working the capstone

Six numbers from a kick the lessons did not run.

{{panel:wc-killsheet-explorer}}

## What is asked

1. The kill mud density.
2. The formation pressure.
3. The initial circulating pressure.
4. The final circulating pressure.
5. The influx density.
6. The influx height.

## The settings

**The well is the SLANT one**, the 40 degree well to 3000 m with its shoe at 1400 m. Its true vertical depths are the two you computed in the Associate capstone.

**The kick is a new one.** A shut-in drill pipe pressure of 1400000 Pa, a shut-in casing pressure of 2100000 Pa and a pit gain of 2.2 m3.

That is NOT either of the two scenarios the lessons run, and the same new kick is used at the Expert tier as well.

**Everything else** is the fixture's own: mud 1440 kg/m3, pump 0.012 m3 per stroke, slow circulating rate pressure 4500000 Pa, and the annulus capacity at the bit that both wells share.

## The order

Fields 1 and 2 first, from the shut-in drill pipe pressure and the TVD at the bit. They are the same statement twice, once as a pressure and once as a density, so each checks the other.

Field 3 is an addition and needs nothing else.

Field 4 needs field 1: the slow circulating rate pressure times the kill mud over 1440.

Fields 5 and 6 come from the casing pressure and the pit gain, and field 6 has to be computed before field 5 because the density divides by the height.

## The traps

**Field 2 uses TRUE VERTICAL depth**, not the 3000 m of measured depth. The two differ by nearly 500 m on this well and the error is large.

**Field 4 is a scaling, not a sum.** The ICP is a sum and the FCP is a ratio, and using the wrong one gives a plausible number.

**Field 6 uses the annulus capacity at the BIT**, not at the shoe. The two differ by nearly a factor of two and both are plausible heights.

**Field 5 is the influx density, not the mud density less something in pascals.** The units are kg/m3.

**The shut-in casing pressure is 2.1 MPa, not the 2.9 or the 0.9 the lessons used.** Its difference from the drill pipe reading is 700000 Pa.

## What to notice while you work

Field 5 comes out just above 1000 kg/m3, which is close to the liquid threshold of 960. Ask yourself what pit gain error would move it across.

Field 1 is between the two kill mud weights the lessons computed for this well, because the new SIDPP is between the two they used.

## The precision

Full precision, tight tolerances, for the reason every capstone in this series gives.

## Exercise

Before running anything, predict field 1 by interpolating between the two kill mud weights the lessons computed for the slant well.

Then check, and say whether the interpolation was exact and why.
