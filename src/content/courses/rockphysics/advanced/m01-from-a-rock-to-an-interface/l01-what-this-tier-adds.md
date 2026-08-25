# What this tier adds

The Professional tier produced two rocks: the Ekene sand as it was logged, holding brine, and the same sand holding gas. Both are described by a velocity pair and a density.

A seismic survey does not record any of those. It records reflections, and a reflection is not a property of a rock. It is a property of an interface between two rocks.

This tier puts something above the sand and works out what comes back.

## What goes on top

The Ekene shale, logged at 2743 m/s, 1394 m/s and 2450 kg/m3.

That single choice turns two isolated rocks into two interfaces, and the two interfaces behave completely differently. The headline, which the Associate tier already quoted forward, is that substituting the fluid flips the AVO class from I to III.

## What a reflection depends on

At normal incidence, only on the contrast in acoustic impedance, which the tier below already computed.

Away from normal incidence, on the contrast in all three properties: compressional velocity, shear velocity and density. That is why the shear velocity, which has been carried along untouched through two tiers, finally does something here.

The dependence on angle is the whole subject. A reflection coefficient is not a number, it is a function, and the shape of that function is where the fluid information lives.

## Four things this tier owns

**Intercept and gradient.** The two numbers that summarise the angle dependence, and what each is made of. The gradient turns out to be mostly a shear story, which is not what most people expect.

**The class flip.** What the Rutherford and Williams classes are, why the brine case is class I and the gas case class III, and how far the brine case is from being called something else. The class boundary is a threshold somebody chose, and the Ekene brine case sits only 1.7 times above it.

**Approximation against exact.** Shuey's relation is an approximation. Zoeppritz's solution is exact. This tier measures the gap, and finds that at 30 degrees it is more than twice the tolerance the capstone allows on the approximated values.

**Resolution.** An anomaly has a thickness. Below the tuning thickness the top and base reflections merge and the amplitude stops meaning what it appears to mean.

## What it does not do

It does not process seismic data, invert for impedance, or handle real gathers with their noise, multiples and residual moveout. Everything here is forward modelling: given two rocks, what should the data look like.

That is the right boundary. The forward model is what an interpretation is compared against, and if the forward model is wrong the comparison is meaningless whatever the data quality.

## What it inherits

Every assumption from the tier below, and the inheritance is heavy.

The gas case velocity of 2905.6972280296195 m/s rests on an assumed porosity of 0.25, and a range of plus or minus 0.05 moves it by more than 300 m/s. Both the intercept and the gradient move with it.

The gas case shear velocity of 1890.9758806113214 m/s rests on the shear modulus being fluid blind, which is exact within Gassmann's assumptions and not otherwise.

And the whole exercise rests on the logged point being brine saturated, which is a petrophysical judgement made two tiers ago.

## Worked example

One number is worth having before the tier starts, because it is the tier below's result read as an interface property.

The impedances are 7,200,000 for the brine sand and 5,923,875 for the gas sand, against 2450 times 2743, which is 6,720,350, for the shale.

So the brine sand is harder than the shale and the gas sand is softer. At normal incidence the brine interface gives a positive reflection and the gas interface a negative one, and the sign has changed for a reason that will turn out not to be the obvious one.

## Exercise

Predict, before reading on, whether the gas sand is faster or slower than the shale, and what that implies for the sign of the reflection at normal incidence.

Self check: the gas sand at 2905.70 m/s is faster than the shale at 2743 m/s, by 162.70 m/s. That would on its own give a positive reflection. The reflection is nevertheless negative, because the density falls from 2450 to 2038.71 across the interface and the density contrast outweighs the velocity contrast. That the sign is set by density rather than velocity is one of the results this tier is built on.
