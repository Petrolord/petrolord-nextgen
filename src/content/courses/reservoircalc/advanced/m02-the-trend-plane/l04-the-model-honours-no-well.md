# The model honours no well

The porosity model was built from the six well values. It reproduces none of them. This lesson puts the numbers on that and argues that it is a feature rather than a fault.

## The residuals

| Well | Measured | Modelled | Residual | As a share of measured |
| --- | --- | --- | --- | --- |
| Ekene-1 | 0.22 | 0.219865 | -0.000135 | 0.1 pct |
| Ekene-2 | 0.19 | 0.195226 | +0.005226 | 2.8 pct |
| Ekene-3 | 0.23 | 0.210691 | -0.019309 | 8.4 pct |
| Ekene-4 | 0.17 | 0.186013 | +0.016013 | 9.4 pct |
| Ekene-5 | 0.21 | 0.227348 | +0.017348 | 8.3 pct |
| Ekene-6 | 0.22 | 0.200857 | -0.019143 | 8.7 pct |

Four of the six wells are missed by more than 8 percent of the value measured there. The residuals sum to $-2.8 \times 10^{-16}$, which is zero.

Only Ekene-1 is close, and it is close by accident: it happens to sit near the centroid of the data, where the fitted plane is pinned.

## What that means in barrels

A miss of 0.019 in porosity is a miss of about 9.5 percent in the pore volume attributed to the rock near that well. If the model is used to book the cells around Ekene-3, it books them at 0.2107 when the only measurement in the neighbourhood says 0.23.

The Associate tier warned that a property map adds invented detail. This is the sharper version: it also removes measured detail. The model is not merely inventing values where there is no data; at four of the six places where there is data, it is overriding it.

## Why this is not a bug

Three arguments, in increasing order of importance.

The first is mechanical. Six points that are not coplanar have no plane through them. Given that the method is a plane, missing the data is not optional.

The second is statistical. Well porosities carry their own uncertainty, typically one to two porosity units from the mineral model and the cutoffs. Residuals of 1.6 to 1.9 porosity units are within shouting distance of that, so the plane is not necessarily disagreeing with the measurements by more than the measurements disagree with the truth. A model that honoured every value exactly would be fitting the measurement error as though it were signal.

The third is about what a model is for. A trend claims that a regional gradient exists and that local departures from it are noise or detail below the resolution of six wells. If you accept that claim, the residuals are exactly what the model says they should be: they are the part of the data the model deliberately declines to explain.

The failure mode is not the residuals. It is not looking at them.

## When the residuals should stop you

Two patterns in a residual set mean the model is wrong rather than modest.

If the residuals are large and one sided in a region, the trend is the wrong shape. Three neighbouring wells all above the plane means there is structure the plane cannot express and a different method is needed.

If one residual dwarfs all the others, either that well is wrong or it is telling you about a feature the model has no way to represent, such as a separate facies.

At Ekene neither pattern is present. The residuals alternate in sign, they are comparable in size, and the largest is only 1.2 times the next. That is what a fair fit of a modest model looks like.

## Reading it off the panel

Set the method to trend and read the well posts.

{{panel:rc-property-explorer}}

Every ring is red and every well carries its miss in brackets. Read the six brackets in order and notice the alternating signs: Ekene-1 low, Ekene-2 high, Ekene-3 low, Ekene-4 high, Ekene-5 high, Ekene-6 low.

Now switch to krige and watch five rings turn green. Kriging honours the data by construction, which looks like an improvement and is really a different trade: the residuals become zero, so they can no longer tell you anything about the model at all.

## Worked example

Quantify the largest local error in barrels.

Ekene-3 sits at an easting of 1400 m and a northing of 2300 m, and the model books the rock there at 0.210691 against a measured 0.23.

Count the oil bearing cells within 300 m of that well and there are 15, with a mean column of 18.7247 m, well above the field mean of 13.1769 m because Ekene-3 sits high on the structure. Those cells hold

$$15 \times 10{,}000 \times 18.7247 = 2.808706 \times 10^6 \ \mathrm{m^3}$$

of gross rock, or 2.246965 million net.

Booked at the model's 0.210691 that is 0.473413 million cubic metres of pore space; booked at the measured 0.23 it would be 0.516802. The difference of 0.043389 million cubic metres carries through the rest of the chain to 0.147822 MMstb.

So the single largest residual is worth about 0.148 MMstb locally, against a whole property model worth 0.656868 MMstb on the field. One well's residual is nearly a quarter of the total effect being modelled, over 15 cells out of 169.

## Exercise

State the two residual patterns that would tell you a trend model is the wrong shape, and say which pattern the Ekene residuals show.

Self check: large one sided residuals across neighbouring wells indicate structure the plane cannot express, and a single residual much larger than the rest indicates either a bad value or a feature outside the model. The Ekene residuals show neither: they alternate in sign and the largest, 0.019309 at Ekene-3, is only slightly bigger than the next, 0.019143 at Ekene-6.
