# Gas formation volume factor

The gas counterpart of Bo, and much simpler, because a gas has an equation of state that fits on one line.

{{panel:fluid-correlation-explorer}}

## The definition

Bg is the volume that one standard cubic foot of gas occupies at reservoir conditions.

Unlike Bo, no correlation is needed. It follows directly from the ideal gas law with z in it:

$$B_g = 0.005035 \frac{z T_R}{p}$$

with Bg in reservoir barrels per standard cubic foot, T in degrees Rankine and p in psia. The constant carries the standard conditions and the conversion from cubic feet to barrels.

## What the form tells you

**Inverse in pressure.** Double the pressure and Bg halves, at fixed z. Gas is compressible in a way oil is not, which is the whole reason gas expansion is a strong drive mechanism and oil expansion is a weak one.

**Linear in absolute temperature.** On the 459.67 offset.

**Proportional to z.** Everything the z factor carries flows straight through.

## Ekene at initial pressure

At 3200 psia, 180 F, on the Hall-Yarborough z of 0.8577529684232971:

$$B_g = 0.0008633118643757966 \text{ rb/scf}$$

Small numbers, which is why gas volumes are often quoted the other way up, as an expansion factor in scf/rb. One reservoir barrel of this gas is about 1158 standard cubic feet.

## Ekene has no free gas

Worth stating. The reservoir is undersaturated at 3200 psia against a bubble point of 2000, so there is no free gas phase in place and Bg does not enter the oil in place calculation at all.

It matters for two other things: gas produced with the oil at surface, and what would happen if the reservoir were depleted below its bubble point. The material balance course carried Bg for exactly those reasons.

## The constant, and why there are two of them

The engine has a second function with the same name in its compositional module, and it carries a different constant: the exact standard-conditions form built from 14.696 psia, 519.67 degrees Rankine and 5.614583 cubic feet per barrel, which works out near 0.0050368.

The black-oil side uses the rounded textbook 0.005035. The two differ by a fixed 0.0356 percent, and they take their arguments in a different ORDER.

Neither is wrong. Importing the wrong one is, and reversing the arguments is worse. The engine pins the difference with a test so that nobody harmonizes one into the other without deciding to.

That is the same class of trap the material balance course found with two different values of a constant in two implementations of the same aquifer model. Name which one your number came from.

## The units to keep straight

Bg in rb/scf is a very small number, of order 1e-3. Bg in rb/Mscf is a thousand times larger and looks more like Bo. Both appear in practice.

A Bg near one is in rb/Mscf. A Bg near 0.001 is in rb/scf. A Bg near 0.2 is probably ft3/scf, which is a third convention.

## The misconception to avoid

"Bg needs a correlation like Bo does." It needs a z factor, which needs a correlation, and then it is arithmetic. All the uncertainty in Bg is inherited from z, so a third of a percent of disagreement in z is a third of a percent of disagreement in Bg and nothing else is added.

## Exercise

First, compute Bg for Ekene at 3200 psia on the Hall-Yarborough z, then invert it to give the expansion factor in standard cubic feet per reservoir barrel.

Second, the two Bg functions in the engine differ by 0.0356 percent and take their arguments in different orders. Say what each of those two differences would do to a calculation if the wrong function were imported.
