# Potentials are a spectrum

The second clock of this tier answers the question the first one cannot: how much of this source rock's generative potential has been spent? Its state is a spectrum of potentials on the same twenty-bin energy grid, and this lesson reads the spectra of the three classic kerogen types, because their shapes are the chemistry of this module.

## The Type II spectrum

The golden fixture's kerogen is Type II, standard marine organic matter, oil and gas prone. Its potentials on the 34 to 72 kcal grid are:

0, 0, 0, 0, 0, 0, 0.01, 0.05, 0.11, 0.17, 0.22, 0.19, 0.13, 0.07, 0.03, 0.02, 0, 0, 0, 0.

The first six bins are empty: nothing in a Type II kerogen cracks below 46 kcal/mol. The spectrum rises to a peak of 0.22 at 54 kcal, and falls away to nothing above 64. Unlike the vitrinite weights, these potentials sum exactly to 1, so the transformation ratio read from them is a true fraction of the total potential.

## The three types side by side

Type I, lacustrine, oil prone: potentials from 44 to 60 kcal peaking at 0.25 on 52 kcal. Type III, terrestrial and gas prone: potentials from 50 to 70 kcal peaking at 0.18 on 62 kcal. Line the peaks up: 52, 54, 62. Type I sits lowest on the ladder, Type II just above it, Type III far up the grid.

The placement is the chemistry. Lipid-rich lacustrine kerogen is held together by relatively weak aliphatic bonds that crack early; woody terrestrial material is aromatic and refractory, and its bonds need substantially more energy. Everything the panel will show you about the three types' behaviour, and the 132-fold spread you will meet two lessons from now, is these peak positions plus module 1's arithmetic: adjacent bins differ in rate by a factor of about 15 at 100 degC, so a spectrum sitting four bins higher reacts orders of magnitude more slowly at the same temperature.

## Same grid, same integrator, different policy

The kerogen state advances with exactly the kineticStep of module 2, with one liberty the vitrinite state does not have: the frequency factor may be overridden per type. All three library types in fact use the default $10^{13}$ per second, so in this course the two clocks differ only in their spectra, but the override exists because measured kerogen kinetics from pyrolysis sometimes fit better with a different A.

That is the editing policy from module 1 in concrete form. The library spectra above are honest defaults for the three classic types; a geochemist with laboratory kinetics for an actual source rock replaces them, and the model's TR and every mass computed from it above this tier will honestly reflect the measured chemistry. What no edit can do is move the model's Ro, which stays chained to the fixed vitrinite scheme.

## What the spectrum predicts before any integration

You can read behaviour straight off a spectrum. The lowest occupied bin sets when generation begins: Type II's 46 kcal bin, holding just 0.01, is why early Type II generation is real but slight. The peak position sets where the bulk of conversion happens. The width sets how drawn out generation is: Type II spans ten occupied bins, so its conversion is spread over a long temperature interval, while Type I's narrower spectrum converts over a tighter one. And the high tail sets what survives to the gas window: Type II holds 0.05 at 62 kcal and above, potential that outlasts the oil window entirely.

## Worked example

At 100 degC, which Type II bins are doing the work? From module 2's rates: the 46 kcal bin's survival factor is 0.69777 per Ma, the 48 bin's is 0.97604, the 50 bin's is 0.99843. So over tens of Ma the 46 bin drains completely, the 48 bin drains substantially, the 50 bin barely, and everything higher is inert. The reacting front at 100 degC sits at bins 46 to 50, right at the toe of the Type II spectrum, touching at most 0.17 of the total potential. Hold that picture: it is the entire explanation of the next two lessons.

## Exercise

Sketch or tabulate the three spectra from this lesson and mark each peak. Then answer in a sentence each: why does Type III generate so much later than Type I, and what single number in the Type II spectrum explains why its total conversion at 100 degC can never exceed about a sixth of its potential no matter how long you wait?

As a self check: the peaks sit at 52, 54 and 62 kcal for Types I, II and III, and Type III's spectrum sits eight to ten kcal higher than Type I's, which at geological temperatures is several orders of magnitude of rate, hence far deeper burial before it cracks. The Type II occupancy at or below 50 kcal is 0.01 + 0.05 + 0.11 = 0.17, and at 100 degC the front cannot reach past the 50 kcal bin, so conversion is capped near that fraction regardless of time.
