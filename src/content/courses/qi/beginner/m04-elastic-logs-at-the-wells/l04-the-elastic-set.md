# The elastic set

Vp, Vs and density are what the logs measure. `elasticPoint` turns one triple of Vp, Vs and density in SI into the whole elastic set, and the course runs it on the mean of each stated layer at Ekene-1.

## The set

From Vp, Vs and density rho:

- AI (acoustic impedance) = Vp rho, and SI (shear impedance) = Vs rho, both in kg/(m2 s);
- Vp/Vs, and Poisson's ratio (Vp^2 - 2 Vs^2) / (2 (Vp^2 - Vs^2));
- the bulk modulus K = rho (Vp^2 - 4/3 Vs^2) and the shear modulus mu = rho Vs^2;
- lambda-rho = AI^2 - 2 SI^2 and mu-rho = SI^2, after Goodway, Chen and Downton (1997).

The course prints lambda-rho and mu-rho in units of 10^12 kg^2/(m4 s2), which is (GPa)(g/cc).

## Ekene-1, layer by layer

Each layer is the mean of its samples under the course's selections: net sand at Vsh at or below 0.350000, the oil-water contact at 5118.110236 ft, and a cap rock of the 65 ft above the top of the Ekene Sand.

| layer | samples | Vp m/s | Vs m/s | density kg/m3 | AI kg/(m2 s) | Vp/Vs | Poisson's ratio | lambda-rho | mu-rho |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| cap rock (Ogbia Shale) | 130 | 1964.449431 | 673.669215 | 2391.320769 | 4697628.723902 | 2.916045 | 0.433363 | 16.877337 | 2.595190 |
| oil leg | 65 | 2865.750738 | 1638.267785 | 2316.676923 | 6639018.603084 | 1.749257 | 0.257270 | 15.267400 | 14.404584 |
| water leg | 103 | 3149.569660 | 1723.381573 | 2336.452427 | 7358819.677147 | 1.827552 | 0.286320 | 21.725227 | 16.213500 |

The SI column runs 1610959.186341, 3795337.170439 and 4026599.058770 kg/(m2 s) down the same three layers.

## What the columns say

The sand is harder than the shale above it. Both legs carry a higher AI than the cap rock, so the top of the Ekene Sand is an increase in impedance downwards, which the kit's normal polarity shows as a peak. The shale's Vp/Vs of 2.916045 and Poisson's ratio of 0.433363 stand well above either leg: a soft, shear-weak rock over a stiffer sand.

The oil leg is softer than the water leg in AI and in Vp/Vs, and its lambda-rho and mu-rho are both lower.

Part of the gap is still rock. The legs are different net sand: the oil leg's mean porosity is 0.203626 with Vsh 0.178134, and the water leg's 0.197677 with Vsh 0.117854. A comparison of the two legs therefore mixes fluid and rock, and the next module separates them by substituting brine into the same oil-leg rock.

## The mean of a layer

These figures are `elasticPoint` on the layer's mean Vp, Vs and density. The mean of the sample values of AI is a different number, and a study states which it reports. Given a Vs above its Vp, `elasticPoint` does not throw: it returns every field as NaN, AI and Vp/Vs included, and the panel shows the gap where a number would be.

{{panel:qi-feasibility-explorer}}

## Exercise

In the feasibility explorer, set View to "The elastic set" and Data to "Ekene pack: Ekene-1", and check the three rows above. Change "Cap rock thickness above the top, ft (stated)" from 65 to a thinner and a thicker figure and record which columns of the cap-rock row move most. Restore 65. Then switch Data to Ekene-3 and say whether its oil leg is softer than its water leg in AI, in Vp/Vs and in lambda-rho, and whether mu-rho tells the same story.
