# Choosing wrong

The two models do not merely disagree about net pressure. They disagree about which way it goes.

{{panel:st-frac-explorer}}

## The sweep, again

Same six half-lengths, same held conditions, now reading the net pressures.

| Half-length, m | PKN p_net, MPa | KGD p_net, MPa | PKN / KGD |
| --- | --- | --- | --- |
| 40 | 2.076588 | 1.166434 | 1.780288 |
| 70 | 2.388415 | 0.881741 | 2.708749 |
| 100 | 2.611171 | 0.737718 | 3.539526 |
| 150 | 2.889736 | 0.602344 | 4.797485 |
| 220 | 3.180102 | 0.497369 | 6.393846 |
| 300 | 3.436495 | 0.425921 | 8.068376 |

PKN net pressure rises from 2.076588 MPa to 3.436495 MPa as the fracture lengthens. KGD net pressure falls from 1.166434 MPa to 0.425921 MPa over exactly the same range.

Two models, one input set, opposite signs on the slope.

## Why the signs differ

It is in the compliance term.

PKN divides the width by twice the height, which is fixed, while the width climbs as the half-length to the one quarter. Numerator up, denominator constant, so net pressure rises with length.

KGD divides the width by four times the half-length, and its width climbs only as the half-length to the one half. The denominator grows faster than the numerator, so net pressure falls with length.

A longer PKN fracture is harder to keep open. A longer KGD fracture is easier. Each is consistent inside its own model, and one of them describes your well.

## What you lose by picking the convenient model

**Choosing KGD when PKN is right.** You underestimate net pressure, at the published point by a factor of 4.797485, and you predict a treating pressure of 38.734295 MPa when the answer is 41.021687 MPa. You size pumps and tubulars for a job that never happens. Worse, you expect pressure to fall as the fracture extends, so when the real record rises you read it as a screenout starting or as height growth, and you may cut the job that was working. You also expect 10.463769 mm of average width where there is 4.015982 mm, so you plan proppant concentrations the fracture cannot take.

**Choosing PKN when KGD is right.** You overestimate net pressure and treating pressure and buy horsepower and pressure rating you never use. You predict a narrow fracture, so you overpad, choose a finer proppant than you need and give away conductivity. You then expect a rising trend and read a falling one as a fracture running away in length.

The magnitude error you could calibrate out of. The direction error you cannot, because the diagnostic you would calibrate against is the trend itself.

## Exercise

In the panel, step the half-length through the six values above in each model and sketch the two net pressure trends on one axis.

Then say which single observation from a real treatment would tell you which model the well is following.
