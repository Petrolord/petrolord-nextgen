# The method spec

Seven choices, named, so that two implementations can agree.

## What a method spec is

A statement of every modelling choice a calculation makes, precise enough that two people can implement it independently and get the same numbers.

Without one, two hydraulics packages given the same inputs will differ by percent, and neither will be wrong.

## The seven this course's goldens name

**Local n prime and K prime.** The Herschel-Bulkley model is evaluated at each element's shear rate to give a local power law, rather than one global pair for the whole well.

**A generalised Reynolds number.** The definition that makes a shear-thinning fluid transition at roughly the same value a Newtonian one does.

**16 over Re in a pipe and 24 over Re in an annulus** for laminar flow. Exact results for the two geometries.

**A Bourgoyne a over Re to the b** for turbulent flow, with a and b functions of the local flow behaviour index. An empirical correlation.

**A linear blend over the 800 Reynolds numbers above the critical value.** A numerical convention with no physics in it.

**A Burkhardt clinging constant of 0.45** for surge and swab. An empirical constant.

**Schiller-Naumann drag** for the cuttings slip velocity. A published correlation.

## Which of the seven are derived and which are chosen

**Derived:** the 16 and the 24, which fall out of solving the flow exactly in the two geometries.

**Correlations:** the Bourgoyne turbulent form and the Schiller-Naumann drag. Both are fits to experiment, both are published, and both have stated ranges of validity.

**Conventions:** the local power law approach, the generalised Reynolds number definition, the blend width and the clinging constant. Every one of them could reasonably be done differently.

Four of the seven are conventions. That is the honest count.

## Why the count matters

Because agreement between two implementations of the same spec proves they implemented it correctly, and says nothing about the four conventions.

Two implementations of a DIFFERENT spec would disagree, and neither would be wrong.

## Where the conventions bite hardest

The blend width, because the annulus often sits inside the transition band, and the annulus is what sets the equivalent circulating density.

The clinging constant, because surge and swab are proportional to it and 0.45 is one published value among several.

## The practical consequence

Comparing a hydraulics answer from one package against another is only meaningful if both specs are known.

That is the same discipline the survey course demands around an error model and the torque and drag course demands around a friction factor: a computed number needs the method that produced it.

## Exercise

For each of the seven, say whether changing it would move the pump pressure, the equivalent circulating density, the transport ratio, the surge pressure, or more than one.

Two of the seven affect only one of the four outputs.
