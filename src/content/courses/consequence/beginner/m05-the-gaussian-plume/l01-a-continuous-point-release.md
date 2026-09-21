# A continuous point release

{{panel:cq-release}}

A sustained release of gas, from a hole, a vent or an evaporating pool, is carried downwind as a plume. The wind carries it along; turbulence spreads it sideways and up. The Gaussian plume describes the result at steady state: the concentration at any receptor, given the release rate, the wind and how fast the plume spreads. It is the second half of this tier's question, where the released gas goes.

## The model, in the engine's words

The basis of `gaussianPlume` reads, verbatim: "continuous point source Gaussian plume, total ground reflection (image source at -h)". Its expression is:

C = Q / (2 pi sy sz u) exp(-y^2 / 2 sy^2) [exp(-(z - h)^2 / 2 sz^2) + exp(-(z + h)^2 / 2 sz^2)]

Q is the release rate, u the wind speed, y the crosswind distance, z the receptor height and h the release height. sy and sz are the crosswind and vertical spreads, sigma_y and sigma_z, which grow with the distance downwind. The two exponentials in the bracket are the plume and its reflection in the ground, which the third lesson of this module reads.

The release is continuous: a steady rate held long enough for the plume to settle. A sudden release of a fixed mass forms a puff instead, and this engine carries no puff model.

## UBIT downwind

UBIT is a sustained carbon monoxide release, a stated teaching input: 2 kg/s in a 3 m/s wind, molar mass 28.01 g/mol. At ground level on the centreline, from a ground level release, class D:

| distance m, stated | sigma_y m | sigma_z m | concentration mg/m3 | concentration ppm |
| --- | --- | --- | --- | --- |
| 100 | 7.960298 | 5.595029 | 4764.608684 | 4161.659226 |
| 200 | 15.842361 | 10.524696 | 1272.709839 | 1111.651553 |
| 500 | 39.036003 | 22.677868 | 239.712839 | 209.377772 |
| 1000 | 76.277007 | 37.947332 | 73.313504 | 64.035861 |
| 2000 | 146.059349 | 60.000000 | 24.214653 | 21.150349 |
| 5000 | 326.598632 | 102.899151 | 6.314409 | 5.515336 |

The concentration falls steeply with distance because both sigmas grow, and the concentration divides by their product. The plume returns mg/m3, and ppm too when a molar mass is given.

## The wind

The concentration is inversely proportional to the wind speed at fixed sigmas. A stronger wind dilutes the release into more air per second. A weaker one concentrates it, and in the limit of still air the expression divides by zero. The plume has no calm air form, and the engine refuses:

> windSpeedMS: must be above 0 m/s: the Gaussian plume divides by the wind speed and has no calm-air form

It also refuses a receptor at the source itself, where both sigmas are zero:

> downwindDistanceM: must be a downwind distance above 0 m: the plume is undefined at the source

## What the model assumes

The Gaussian plume assumes a steady wind in one direction, flat open ground, and a gas that disperses like the air around it. A heavy gas that slumps and spreads along the ground behaves differently, and so does a plume among buildings. This tier uses the model where it applies, and the engine's sigmas are the rural open country set.

## Exercise

Open the plume view with the UBIT defaults and read the concentration at 500 m in class D against the table. Then change the wind speed from 3 m/s to 6 m/s, keeping everything else, and read the concentration again. Write one sentence on how the two readings relate, and name the term in the expression that explains it.
