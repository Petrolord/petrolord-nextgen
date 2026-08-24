# From one angle to many

Every reflection coefficient in all three tiers of this course has been a single number per interface: the normal incidence case, the reflection you would get from a wave arriving straight down. This lesson replaces that number with a behaviour across angle, runs it on the two sands from the previous lesson, and marks the boundary of what this course owns.

## What normal incidence leaves out

The formula used throughout, $R = (I_2 - I_1)/(I_2 + I_1)$, involves impedance and nothing else. Shear velocity does not appear in it. That is not an approximation, it is exact, and it holds only at zero angle of incidence.

Real seismic is not acquired at zero angle. A trace on a stacked section is a sum over a range of source to receiver offsets, and each offset corresponds to a different angle at the reflector. If the reflection coefficient varies with that angle, the stack averages the variation away and the variation itself is information that was thrown out.

At non zero angles the reflection depends on both velocities and the density on both sides of the interface, so shear velocity enters. That is what makes angle dependence useful: shear velocity responds to the rock frame and barely to the pore fluid, while compressional velocity responds to both, so the difference between them across angle carries the fluid.

## The two sands across angle

Take the brine sand and the gas sand from the previous lesson, both under the same shale, and compute the exact reflection at the top of the sand from zero to forty degrees.

| Angle | Brine sand | Gas sand |
| --- | --- | --- |
| 0 degrees | +0.058116 | -0.074977 |
| 10 degrees | +0.050028 | -0.086313 |
| 20 degrees | +0.027628 | -0.119455 |
| 30 degrees | -0.002583 | -0.171891 |
| 40 degrees | -0.024140 | -0.239676 |

The brine sand starts as a positive reflection, weakens with angle, passes through zero near 29 degrees and ends up negative. The gas sand starts negative and gets steadily stronger, more than tripling by 40 degrees.

Two sands, the same frame, the same shale, the same geometry, and completely different behaviour across angle. That is what a fluid does when you stop looking at only one angle.

## Intercept and gradient

The standard summary fits a straight line to the reflection against $\sin^2\theta$:

$$R(\theta) \approx A + B\sin^2\theta$$

$A$ is the **intercept**, the reflection at zero angle. $B$ is the **gradient**, how fast it changes.

| | Intercept $A$ | Gradient $B$ | Class |
| --- | --- | --- | --- |
| Brine sand | +0.057942 | -0.288228 | I |
| Gas sand | -0.074925 | -0.468442 | III |

The classification is the Rutherford and Williams scheme. **Class I** is a hard sand with a positive intercept that dims with offset. **Class III** is a soft sand with a negative intercept that brightens with offset, and it is the classic bright spot gas signature.

The pair of numbers is the deliverable. A single stacked amplitude reduces both to one figure and loses the distinction; the whole point of working in angle is to keep them apart.

## Where this collides with tuning

The two effects do not sit in separate boxes, and this is the part that is most often missed.

At normal incidence the top and base of a bed encased in one lithology are exactly opposite, which is the assumption the entire wedge rests on. At angle they are **not**. Running the same calculation at the base of the brine sand gives $-0.058116$ at zero degrees, exactly opposite as required, but $-0.049056$ at 10 degrees against a top of $+0.050028$, and at 30 degrees the top is $-0.002583$ while the base is $+0.009937$, which are not opposite at all.

So the tuning behaviour of a bed is itself angle dependent. The tuning thickness stays where the wavelet puts it, but the amplitude scaling changes with angle in a way that the normal incidence wedge cannot predict, and on a thin bed a measured AVO gradient contains a contribution from tuning that has nothing to do with fluid.

That interaction is real, it is quantifiable, and it is not this course's material. It belongs to the Rock Physics ladder, which owns fluid substitution, angle dependent reflectivity and their combination as its subject rather than as a closing note.

## Where the boundary is

This course owns the tie between a well and a seismic trace, and the wedge that says what that trace can and cannot resolve. It ends where the single normal incidence coefficient ends.

The Rock Physics course takes over there. Its Associate tier already covers the fluid properties used in the previous lesson, from Batzle and Wang, and the mineral mixing that gives the frame. Its higher tiers are where Gassmann and angle dependent reflectivity are developed properly, with their own capstone and their own oracle.

Taking the chain in this course as far as an intercept and a gradient is deliberate: it shows that the chain exists and that each link is a step already run in simpler form. Going further here would be teaching another course's material without its rigour.

## Worked example

The brine sand crosses zero at about 29 degrees. Confirm that from the intercept and gradient.

Setting $A + B\sin^2\theta = 0$ gives $\sin^2\theta = -A/B = 0.057942/0.288228 = 0.201$, so $\sin\theta = 0.448$ and $\theta = 26.6$ degrees. The exact calculation puts the crossing nearer 29 degrees, and the difference is the two term approximation running out of accuracy at large angles, which is the usual reason to keep the exact form for anything past about 30 degrees.

## Exercise

State what a stacked amplitude over the brine sand from 0 to 40 degrees would look like compared with a stack from 0 to 20 degrees, and explain what that implies about comparing amplitude maps made from different offset ranges.

As a self-check: the brine sand's reflection falls from +0.058 to -0.024 across that range and changes sign near 29 degrees, so a 0 to 40 degree stack averages positive and negative contributions and comes out much weaker than a 0 to 20 degree stack, which averages only positive ones. Two amplitude maps of the same horizon made from different offset ranges are therefore not comparable, and a change in mapped brightness between vintages can be entirely an acquisition or processing difference rather than anything in the rock.
