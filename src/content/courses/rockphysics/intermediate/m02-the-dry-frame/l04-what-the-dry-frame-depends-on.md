# What the dry frame depends on

Inverse Gassmann takes four inputs. One is measured, one is computed from the tier below, and two are assumptions. This lesson measures how much each assumption is worth, because that decides where the effort belongs.

## The four inputs

$K_{sat}$ comes from the log, through the conversion of module one. It is the closest thing here to a measurement, and it is only as good as the velocity and density logs behind it.

$K_{fl}$ is the brine modulus of 2.6978112899395996 GPa from the Associate tier, computed from conditions.

$\phi$, the porosity, is an assumption. It comes from a petrophysical model.

$K_{min}$, the mineral modulus, is an assumption. It comes from a lithology model and a mineral mixing rule.

## The mineral modulus is worth little

Vary it from 35 to 40 GPa, a range wider than any real uncertainty for a quartz rich sand:

| $K_{min}$ (GPa) | $K_{dry}$ (GPa) | gas case $v_p$ (m/s) |
| --- | --- | --- |
| 35 | 7.663073635451325 | 2931.3769460289113 |
| 36 | 7.502336709181605 | 2918.2079145123525 |
| 37 | 7.350343061720982 | 2905.6972280296195 |
| 38 | 7.206489058909676 | 2893.803798693711 |
| 40 | 6.940996568586582 | 2871.716428512792 |

Five GPa of mineral modulus, which is 14 percent, moves the predicted gas velocity by 60 m/s, which is 2 percent. Notice the direction, which is not obvious: a stiffer mineral gives a softer dry frame, because more of the observed saturated stiffness gets attributed to the mineral and less to the frame.

## The porosity is worth a great deal

Vary it across a range that a petrophysical model genuinely could be wrong by:

| $\phi$ | $K_{dry}$ (GPa) | gas case $v_p$ (m/s) | gas case $\rho$ (kg/m3) |
| --- | --- | --- | --- |
| 0.20 | 5.356003950985403 | 2709.6398569624603 | 2080.9683614234577 |
| 0.25 | 7.350343061720982 | 2905.6972280296195 | 2038.7104517793223 |
| 0.30 | 8.545876262672467 | 3033.8186110096503 | 1996.4525421351868 |

Ten porosity units move the predicted velocity by 324 m/s. That is more than five times what the mineral modulus range does, and it is the same size as the entire gas effect the tier is trying to measure.

## Why porosity dominates

Porosity enters the problem three times.

It sets how much fluid there is to remove, in the inverse step. It sets how much fluid there is to add, in the forward step. And it sets how much of the bulk density is fluid, in the density bookkeeping.

The mineral modulus enters once, in a term that is already close to its limiting value. The Biot coefficient of 0.80 is not very sensitive to $K_{min}$ in this range.

## What to do about it

Three things follow, and none of them is to stop doing substitutions.

Quote the porosity you used, every time. A substituted velocity without its assumed porosity is not reproducible.

Carry a porosity range through the substitution rather than a single value, and report the resulting velocity range. At Ekene that is 2710 to 3034 m/s for the gas case, which is a far more honest statement than 2905.697.

And spend the effort where the leverage is. Improving the mineral model from a guess to a careful mixture buys 2 percent. Improving the porosity from a guess to a good petrophysical answer buys ten times that.

## Reading it off the panel

Both assumptions are controls for this reason.

{{panel:rp-substitution-explorer}}

Set the saturation to 0.00 and step the porosity through its three values, then put it back and step the mineral modulus through its five. The velocity tile tells you the whole story in a few seconds, and the dry frame tile tells you where the change is entering.

## Worked example

Report the gas case honestly for a prospect where the porosity is known to plus or minus 0.03.

At a porosity of 0.22 the substitution would sit between the 0.20 and 0.25 rows, near 2790 m/s. At 0.28 it would sit near 2980 m/s.

So the reportable statement is that the gas case velocity is about 2900 m/s with a range of roughly 2790 to 2980, dominated by the porosity uncertainty, and that the mineral modulus contributes about 30 m/s to that range.

That sentence is worth more than the six figure value, because the reader now knows which input to argue about.

## Exercise

State the direction in which the dry frame modulus moves when the assumed mineral modulus is increased, and give the reason.

Self check: it falls, from 7.663 GPa at 35 GPa of mineral modulus to 6.941 GPa at 40. A stiffer assumed mineral means more of the rock's observed saturated stiffness is attributed to the material it is made of, so less has to be attributed to the frame.
