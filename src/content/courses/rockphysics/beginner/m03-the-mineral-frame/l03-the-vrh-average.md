# The VRH average

You have two bounds and you need one number. Gassmann wants a single mineral bulk modulus. An impedance calculation wants a single frame density and a single set of moduli. Nothing downstream accepts a range.

The convention the industry settled on is the Voigt-Reuss-Hill average, usually written VRH. It is the arithmetic mean of the two bounds:

$$M_{VRH} = \frac{M_V + M_R}{2}$$

That is the whole definition. There is no extra physics in it and no fitted constant.

## The working for K

The previous lesson gave the two bulk modulus bounds for the 70/30 quartz and clay frame as 31.890000 GPa for Voigt and 29.868801 GPa for Reuss. Averaging them:

$$K_{VRH} = \frac{31.890000 + 29.868801}{2} = \frac{61.758801}{2} = 30.8794005 \text{ GPa}$$

The engine carries the Reuss bound at full machine precision rather than the six decimal places printed above, so the value it actually returns is

$$K_{VRH} = 30.87940062475596 \text{ GPa}$$

That is the number the capstone grades, with a tolerance of 0.05 GPa. Your hand arithmetic from the rounded bounds lands well inside that tolerance, which is the point of quoting a tolerance in the first place. Keep both facts in view: the engine's value is the reference, and your arithmetic reproducing it to six digits is the check that you did the right operation.

The same average applied to the shear bounds of 33.570000 GPa and 16.939444 GPa gives

$$\mu_{VRH} = 25.25472176759411 \text{ GPa}$$

Both results are in GPa. The engine holds them in Pa, so 30.87940062475596 GPa is 3.087940062475596e10 Pa inside the code. When you carry these into Gassmann at the next tier you will be working in Pa, and mixing a GPa modulus into a Pa formula is a factor of a billion error that produces an answer no sanity check can miss. It is the mistake to watch for.

## Hill's argument, and what it is worth

Hill's contribution was not a derivation. He observed that the arithmetic mean of the Voigt and Reuss bounds is usually a good approximation to the measured modulus of a real aggregate, and that observation has held up well enough over seventy years that the average carries his name.

Take that for what it is. VRH is a pragmatic estimate, not a physical law. Nothing about a rock makes the midpoint of two limiting arrangements the correct answer. There is no arrangement of quartz and clay that the VRH formula describes. It is a defensible choice of a point inside a range you already believed the answer was in, and its defence is empirical.

Two consequences follow, and both matter more than the formula.

The first is that VRH is only as good as the range is narrow. If the bounds nearly coincide, the midpoint is close to the truth because everything in the range is close to the truth. If the bounds are far apart, the midpoint is a coin toss dressed as a calculation. The next lesson is entirely about telling those two cases apart for this frame.

The second is that quoting a VRH modulus without its bounds throws away the only honest part of the calculation. A frame bulk modulus of 30.87940062475596 GPa reads as a precise measurement. It is a midpoint of 31.890000 and 29.868801 GPa, and the reader deserves to know that. Carry the bounds through your reporting, even when you carry a single number through your arithmetic.

There is a third habit worth forming here. Run the sanity check that the average sits between the two bounds, because it always must. If a VRH value comes back above the Voigt bound or below the Reuss bound, something has gone wrong upstream, usually a fraction that does not sum to one or a modulus entered in the wrong unit. The engine throws on fractions that fail to sum to one, but it cannot detect a modulus you typed in MPa when you meant GPa. The bracket test catches that in a second.

## Why it is good enough here

For the Ekene frame the VRH bulk modulus is fit for purpose, and the reason is visible in the two bounds. They sit close together. Whatever the arrangement of quartz and clay in this sand, the bulk modulus of the solid material has to lie between 29.868801 and 31.890000 GPa, and the midpoint of 30.87940062475596 GPa is a safe place to stand inside a range that narrow.

That is not a general licence. It is a statement about this mixture, at this split, for this property, and it comes from looking at the numbers rather than from trusting the method. A different lithology would need the same check run again. Swap the clay for calcite at 76.8 GPa and the two end members are no longer neighbours, so the bounds open out and the midpoint stops being a safe place to stand. The method never changes. The confidence you are entitled to changes with every mixture you put through it. Change the property to shear and the same method on the same rock produces something much weaker, which is what you will read next.

The panel below mixes the frame and reports both bounds alongside the VRH average, so you can watch the gap as well as the answer.

{{panel:rp-fluid-explorer}}

## Exercise

Work out the VRH shear modulus for the Ekene frame from the two bounds in the previous lesson, showing the average. Then state, in one sentence, what the phrase "VRH is not a physical law" means for how you would report that number to a colleague.

Self check: the average of 33.570000 GPa and 16.939444 GPa is 25.254722 GPa to six decimal places, and the engine returns 25.25472176759411 GPa working at full precision. Saying that VRH is not a physical law means the number is a chosen midpoint of a range rather than a modelled property of the rock, so you report it with its bounds attached and you expect a colleague to challenge the midpoint whenever the bounds are far apart.
