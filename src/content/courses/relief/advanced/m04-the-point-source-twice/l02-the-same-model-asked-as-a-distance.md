# The same model, asked as a distance

The point source is carried in both directions. One route gives the intensity at a distance. The other gives the distance at which a stated allowable intensity is met. Both are the same relation, and the second is the one a layout decision usually wants.

{{panel:fc-blowdown-explorer}}

## The round trip, and what it proves

Ask the forward route for the intensity at 10.000000 m and it returns 0.795774715459 kW/m2. Hand that intensity back to the inverse route and it returns 10.000000000000 m. Ratio 1.000000000000.

Now read that result carefully, because it is the most misread kind of result there is. A round trip through a function and its own inverse is an identity and proves nothing about the model. It proves the two implementations agree.

They could agree on a wrong solid angle, on an inverse-cube law, or on a transmissivity applied twice. Every one of those would close the round trip perfectly, because the same error is applied and then removed. Exactness here is the least informative outcome available, and a suite that showed only this would be showing you nothing.

## What makes the model itself checked

The validation oracle derives the sphere area by quadrature and the inverse by bisection on that same quadrature. So the checking side is built from an integral rather than from a copy of the formula, and the inverse on the checking side is a search rather than a rearrangement.

That is the pattern worth taking away. A second implementation of a relation checks a transcription. A different derivation of the same quantity checks the relation. When somebody shows you agreement, the question is not how close the two came but how far apart they were to begin with.

The published rows for both directions are re-run in the audit module, and the agreement there is exact to the last bits double precision holds, which is exactly what you should expect when a quadrature and a closed form are two roads to the same sphere.

## Both directions validate the same four inputs

The inverse is not a thinner route than the forward one. It takes the same four inputs and refuses the same bad ones: both refuse a radiated fraction of zero, a transmissivity above one and a negative transmissivity. The audit module runs every one of those.

That symmetry matters more than it sounds. An inverse route bolted on later commonly validates less than the forward one, so a value the forward route would have refused sails through the inverse and comes back as a distance. Checking that the two refuse alike is a cheap test with a real failure mode behind it.

## What the inverse returns

One field, the distance in metres, with no note and no warning.

## Exercise

Record the intensity the forward route gives at 10.000000 m, the distance the inverse gives back and the ratio between the two. Then explain in three sentences why that ratio proves the implementations agree and nothing more. Say what the oracle does on each side instead. Finally, name the three bad inputs both directions refuse alike and say why checking that symmetry is worth doing.
