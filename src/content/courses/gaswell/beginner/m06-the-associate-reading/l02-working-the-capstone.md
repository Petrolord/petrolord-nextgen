# Working the capstone

Nine steps, in one order. Every one of them is checkable on its own, and a graded answer that is wrong is wrong at a step you can name.

{{panel:pd-droplet-explorer}}

## Step one: fix the station before anything else

Pressure in psia, never psig. Temperature in degR at this module's door. A z, and a gas gravity. Write the four down together, because every number after this belongs to them and to no other station.

## Step two: gas density, then check it

Density is p M over z R T, with R at 10.7316 psia ft3 per lbmol degR. Check the arithmetic against the published spot before trusting it on your own station: 1000.0 psia, 600.0 degR, z 0.88 and gas gravity 0.65 give 3.3226524714 lbm/ft3 as the oracle publishes it and 3.3226453778 lbm/ft3 as the engine returns it.

## Step three: name the fluid explicitly

Interfacial tension and liquid density are inputs, not deductions. Water is 60.0 dyne/cm and 67.0 lbm/ft3, condensate is 20.0 dyne/cm and 45.0 lbm/ft3. An unrecognised fluid id falls back to water rather than refusing, so a default that was never chosen looks identical to a choice.

## Step four: terminal velocity, with its two refusals

The quarter power of the tension, the quarter power of the density difference, one over the square root of the gas density, and the constant 1.5935346111. If the liquid density is below the gas density, or the tension is 0.0 dyne/cm, no velocity is returned. That is a refusal, not a failure, and it means an input is wrong.

## Step five: the correlation, from your own pressure

Compare the pressure to the limit of 1000.0 psia. Strictly below is coleman at 1.000000, at or above is turner at 1.200000. Take the pressure from what you supplied and not from the sentence that prints back: at 999.96 psia the reason renders 1000.0 while the branch still returns coleman.

## Step six: flow area from an inside diameter

The circle of the inside diameter. A 2.441 in string is 0.0324984725 ft2 and 4.67978003 in2. A nominal size is not an inside diameter.

## Step seven: the critical rate, and the round trip

Multiply the critical velocity by the area, by p over z T, and by 3054.38693878 Mscf/d per (ft/s x ft2 x psia / degR). Then run it backwards as a check: 12.0 ft/s through 2.441 in at 900.0 psia, 580.0 degR and z 0.9 gives 2053.715375332 Mscf/d, and that rate returns 12.000000000000 ft/s, a closure of -1.7764e-15 ft/s.

## Steps eight and nine: the actual velocity, then the ratio

Divide the production rate by the same area and the same p over z T. Take the ratio. Below one is loaded, and it is strict: 0.9997870547 reads loaded.

## The traps

**A ratio rounded before it is read.** Take 0.9997870547 to two decimals and it stops being a verdict.

**Two roads in one claim.** The same published row carries a Turner critical rate of 1614.343188395 Mscf/d from the oracle and 1614.343766935 Mscf/d from the engine. Quote either, label it, and never mix them.

**Mixed units.** psia, degR, Mscf/d, ft2, in, dyne/cm, lbm/ft3, ft/s.

## Exercise

Work one station through all nine steps by hand before opening the panel. Then compare: any disagreement is at a step, and the step is the answer.
