# Voigt and Reuss

The previous lesson ended on a problem. The density of a mineral mixture follows from the volume fractions alone, but the stiffness depends on how the minerals are arranged, and the arrangement inside a real rock is not something you can log. The classical answer is to stop trying to compute the stiffness and to compute its two limits instead. Every possible arrangement of a given set of minerals in given proportions falls between those limits. That is the Voigt bound and the Reuss bound.

## Voigt: the stiff arrangement

The Voigt bound assumes every constituent suffers the same strain. Picture the minerals as layers loaded along the layering, or as parallel columns all squeezed by the same amount. The stiff mineral is forced to deform as much as the soft one, so it carries a disproportionate share of the stress, and the mixture behaves as stiffly as its components allow.

Under that assumption the mixture modulus is the volume-weighted arithmetic average:

$$M_V = \sum_i f_i M_i$$

with $f_i$ the volume fraction and $M_i$ the modulus of each mineral. For the Ekene frame, bulk modulus first:

$$K_V = 0.7 \times 36.6 + 0.3 \times 20.9 = 25.62 + 6.27 = 31.890000 \text{ GPa}$$

and shear modulus the same way:

$$\mu_V = 0.7 \times 45.0 + 0.3 \times 6.9 = 31.5 + 2.07 = 33.570000 \text{ GPa}$$

Both values are in GPa, matching the units of the mineral table. The engine works in Pa internally, so it is holding 3.189e10 Pa and 3.357e10 Pa for the same two numbers.

## Reuss: the compliant arrangement

The Reuss bound assumes the opposite. Every constituent suffers the same stress. Picture the minerals as layers loaded across the layering, or as elements in series. Now the soft mineral takes most of the strain, because it gives way first, and the mixture is as compliant as its components allow.

Under that assumption it is the compliances that add, so the mixture modulus is the volume-weighted harmonic average:

$$\frac{1}{M_R} = \sum_i \frac{f_i}{M_i}$$

For the Ekene frame the bulk modulus bound comes from

$$\frac{1}{K_R} = \frac{0.7}{36.6} + \frac{0.3}{20.9}$$

which inverts to

$$K_R = 29.868801 \text{ GPa}$$

and the shear modulus bound from

$$\frac{1}{\mu_R} = \frac{0.7}{45.0} + \frac{0.3}{6.9}$$

which inverts to

$$\mu_R = 16.939444 \text{ GPa}$$

Notice what the harmonic average does that the arithmetic average does not. It is dominated by the smallest term. In the shear case, 30 percent of a mineral at 6.9 GPa drags the bound down to 16.939444 GPa, less than half of the Voigt value of 33.570000 GPa, because a small compliance in series is a large compliance overall. This is the same mathematics you will meet again in the next module, where Wood's equation applies a Reuss average to the pore fluids and a little gas dominates the result for exactly this reason.

## The four numbers together

| property | Voigt (upper) | Reuss (lower) |
| --- | --- | --- |
| K | 31.890000 GPa | 29.868801 GPa |
| mu | 33.570000 GPa | 16.939444 GPa |

Read those rows against each other. The two bulk moduli almost agree. The two shear moduli do not.

## What a bound is and is not

These are bounds in the strict sense. For an isotropic mixture of the stated minerals in the stated proportions, no arrangement of them can be stiffer than Voigt or softer than Reuss. A real rock must lie between them. If you measure a modulus on core and it falls outside the bounds, the measurement is wrong, or the mineralogy you assumed is wrong, or the sample was not what you thought it was. That is a genuine quality control test and it costs nothing to run.

What the bounds are not is a prediction. Neither arrangement is what a sandstone looks like. Real grains are neither perfectly in parallel nor perfectly in series. The bounds tell you the range that contains the truth without telling you where in that range it sits, and the width of that range is information in its own right. A narrow gap means the arrangement barely matters and any sensible estimate will do. A wide gap means the arrangement matters more than the mineralogy, and any single number you quote is a choice rather than a result.

Tighter bounds exist. The Hashin-Shtrikman bounds narrow the range by assuming the mixture is isotropic at every scale rather than merely on average, and they are what you would reach for in serious work. The engine uses Voigt and Reuss because the pair is transparent, because they bracket the Hashin-Shtrikman pair, and because the point being taught here is the width of the gap rather than the last decimal of its edges.

## Exercise

Take the two shear bounds for the Ekene frame and say which one describes a rock where clay films coat every grain contact, and which describes a rock where clay sits as isolated pods in a welded quartz framework. Give the value that goes with each.

Self check: clay films at the grain contacts put the soft mineral in series with the load path, so the rock tends toward the compliant Reuss arrangement and its shear modulus tends toward 16.939444 GPa. Isolated clay pods in a continuous quartz framework let the quartz carry the load through, which is the stiff Voigt arrangement, tending toward 33.570000 GPa. Both rocks have the same mineralogy, the same 70/30 split and the same density of 2629 kg/m3, which is the whole reason the shear modulus of this frame cannot be quoted as a single confident number.
