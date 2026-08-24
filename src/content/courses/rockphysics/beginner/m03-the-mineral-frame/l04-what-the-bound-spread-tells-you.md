# What the bound spread tells you

Two numbers came out of the same formula, applied to the same rock, in the same lesson. One of them you can take to a meeting. The other one you cannot. Nothing in the arithmetic tells you which is which. The bound spread does, and learning to read it is the most transferable thing in this module.

## The two spreads

Put the whole frame calculation in one table:

| property | Voigt (upper) | Reuss (lower) | VRH average | bound spread |
| --- | --- | --- | --- | --- |
| K | 31.890000 GPa | 29.868801 GPa | 30.87940062475596 GPa | 1.068x |
| mu | 33.570000 GPa | 16.939444 GPa | 25.25472176759411 GPa | 1.982x |

The spread column is the upper bound divided by the lower bound. For the bulk modulus it is 1.068, meaning the two bounds sit 6.8 percent apart. For the shear modulus it is 1.982, meaning the upper bound is very nearly twice the lower one.

Say what that means in plain terms. Every possible arrangement of 70 percent quartz and 30 percent clay has a bulk modulus within 6.8 percent of every other arrangement. Whatever the clay is doing in this rock, whether it coats the grains or sits in pods or fills the pore throats, the bulk stiffness of the solid material barely notices. The VRH bulk modulus of 30.87940062475596 GPa is therefore a strong claim. You could be completely wrong about the microstructure and still be within a few percent of the right answer.

The shear modulus is a different situation entirely. The arrangement changes the answer by a factor of two, and you do not know the arrangement. The VRH shear modulus of 25.25472176759411 GPa is printed to fourteen significant figures and is worth about one. It is the midpoint of a range that runs from 16.939444 to 33.570000 GPa, and nothing in the calculation tells you where in that range this particular sand sits.

## Why the two behave differently

The cause is in the mineral table, not in the mixing formula.

Quartz and clay have bulk moduli of 36.6 and 20.9 GPa. Those are within a factor of two of each other, so however you average them, arithmetically or harmonically, you land in a narrow band. When the inputs are similar, the choice of averaging rule stops mattering.

Their shear moduli are 45.0 and 6.9 GPa. Quartz is 6.5 times stiffer in shear than clay. Now the averaging rule matters enormously, because an arithmetic average of two widely separated numbers sits near the larger one while a harmonic average sits near the smaller one. The formula did not become unreliable. The inputs became disparate, and disparate inputs are what open the bounds.

That is the general rule, and it holds well beyond mineral mixing. The reliability of a mixture estimate is set by how much the components differ, not by the sophistication of the mixing law. Whenever you see a wide bound spread, the honest response is to go and look at what the end members are, because something in the mixture is far away from everything else in it.

## The consequence you have to live with

The same averaging rule, applied once to each column of the same table, produced a confident number and a weak one. There is no warning in the output. The engine returns both to full precision and neither is flagged. If you carry the pair forward without checking the spreads, you will treat them as equally solid, and one of them is not.

This has a direct effect downstream. Compressional velocity depends on the bulk modulus and the shear modulus together, so it inherits some of the shear uncertainty but is anchored by the well constrained bulk term. Shear velocity depends on the shear modulus alone. Anything you build on shear, including shear impedance, Vp over Vs ratios and the AVO gradient at the Advanced tier, inherits the full width of that 1.982 spread. This is one reason working interpreters trust the intercept more than the gradient, and it starts here, in a mineral table.

## What to do about it

Three habits, in order of value.

Quote the spread with the number. A frame shear modulus of 25.25472176759411 GPa with bounds of 16.939444 and 33.570000 GPa tells the reader everything. The same number on its own misleads.

Propagate the bounds, not the midpoint, wherever the answer matters. Run your workflow at the Voigt shear modulus and again at the Reuss shear modulus and see whether the decision changes. If it does not, the uncertainty is not your problem. If it does, you have found the thing worth spending money to constrain, which is usually core measurement or a shear log.

Round to the confidence you have. Fourteen digits on a number whose bounds differ by a factor of two is a false claim about precision, and it is the kind of thing that survives into a report unchallenged because it looks computed.

The panel below reports both bounds and the VRH average for the frame, so you can compare the two spreads directly.

{{panel:rp-fluid-explorer}}

## Exercise

A colleague sends you the frame moduli for the Ekene sand as two numbers with no other context and asks whether they can both be used in the same workflow with the same weight. Write the reply, using the spreads.

Self check: the answer is no, and the reason is in the bounds. The bulk modulus of 30.87940062475596 GPa sits between 29.868801 and 31.890000 GPa, a spread of 1.068, so it is well constrained whatever the rock geometry turns out to be. The shear modulus of 25.25472176759411 GPa sits between 16.939444 and 33.570000 GPa, a spread of 1.982 that traces back to quartz being 6.5 times stiffer in shear than clay, so it is a midpoint of a wide range rather than a determined value. Use the bulk modulus with confidence, carry the shear modulus with its bounds, and test whether any decision that depends on it survives the full range.
