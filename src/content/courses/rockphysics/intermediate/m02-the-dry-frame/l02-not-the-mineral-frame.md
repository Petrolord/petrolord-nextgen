# Not the mineral frame

The Associate tier computed a mineral frame bulk modulus of 30.87940062475596 GPa. This tier computes a dry frame bulk modulus of 7.350343061720982 GPa. They differ by a factor of four and they are not the same kind of object. Confusing them is the most common way to get a substitution badly wrong.

## Two different questions

The mineral frame answers: if you took the minerals that make up this rock and welded them into a solid block with no pore space at all, how stiff would that block be?

The dry frame answers: how stiff is this actual rock, with a quarter of its volume empty and its grains touching only where they touch?

The first is a property of a mineral mixture. The second is a property of a rock.

## Why the gap is so large

Two things separate them and both matter.

Porosity removes material. A rock that is 25 percent pore has 25 percent less solid to resist compression than the equivalent solid block.

Grain contacts are the larger effect. In a sandstone, grains touch each other over a tiny fraction of their surface area, and the stiffness of the frame is controlled by those contacts rather than by the bulk of the grains. Squeeze the rock and the grains barely deform; the contacts do. That is why a sandstone at 25 percent porosity is four times softer than quartz rather than a quarter softer.

The consequence is that the dry frame cannot be computed from the mineral composition. It has to be measured, or inferred from a measurement, which is exactly what inverse Gassmann does.

## Where each one is used

Both appear in Gassmann's relation and they appear in different places.

$K_{min}$ enters as the mineral modulus, the stiffness of the solid material. It appears in the term $1 - K_{dry}/K_{min}$, the Biot coefficient, which measures how far the frame is from being solid.

$K_{dry}$ is the frame the fluid is being added to.

Substituting one for the other is not a small error. If you fed 30.88 GPa in where 7.35 GPa belongs, the Biot coefficient would come out near zero and Gassmann would predict that the fluid does almost nothing, which is the opposite of the truth for this rock.

## The Biot coefficient here

$$\alpha = 1 - \frac{K_{dry}}{K_{min}} = 1 - \frac{7.350343061720982}{37} = 0.8013$$

A value near 1 means a compliant frame in a stiff mineral, where the fluid matters a great deal. A value near 0 means a frame nearly as stiff as its mineral, where it does not.

At 0.80 the Ekene sand is firmly in the first category, which is another way of saying what the last lesson said: nearly half its compressional stiffness is brine.

## Worked example

Work out what a carbonate with the same porosity might look like, to see the contrast.

Calcite has a bulk modulus near 71 GPa. A tight, well cemented limestone at 25 percent porosity might have a dry frame around 30 GPa, because cement welds the grains and the contacts stop being the weak link.

Its Biot coefficient would be $1 - 30/71 = 0.577$, and the fluid's share of its saturated stiffness would be far smaller than in the Ekene sand. The same fluid change would move its velocity much less.

That is the general rule and it is worth carrying: the stiffer the frame relative to its mineral, the less a fluid substitution does. Direct hydrocarbon indicators work well in soft young sandstones and poorly in tight cemented rocks, and the Biot coefficient is the number that says which you have.

## Exercise

A colleague's substitution shows almost no velocity change between brine and gas in a 25 percent porosity sandstone. Name the most likely input error and state what the symptom would be in the Biot coefficient.

Self check: they have most likely used the mineral modulus in place of the dry frame modulus. The Biot coefficient would come out near zero, since $K_{dry}$ and $K_{min}$ would be nearly equal, and a near zero Biot coefficient tells Gassmann that the frame is almost as stiff as solid mineral, so the fluid can add almost nothing.
