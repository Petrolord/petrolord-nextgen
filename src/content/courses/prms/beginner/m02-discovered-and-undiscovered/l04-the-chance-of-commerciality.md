# The chance of commerciality

{{panel:prms-classification-calculator}}

Every class below Reserves carries a chance that its project becomes commercial. For an undiscovered project two things must go right: a well must find petroleum, and the find must then be developed. For a discovered project only the second remains. The engine multiplies the stated chances and prints the working (PRMS 2.1.3.3).

## The rule, class by class

| class | chance of commerciality (engine) | the stated chances it reads |
| --- | --- | --- |
| Prospective Resources | Pc = Pg x Pd | the chance of geologic discovery and the chance of development |
| Contingent Resources | Pc = Pd | the chance of development |
| Reserves | none | none |

Pg is the chance of geologic discovery, Pd the chance of development, and Pc the chance of commerciality. All three are percentages.

## The Ekene figures

| golden input | sub-class | Pg, percent (stated) | Pd, percent (stated) | Pc, percent (engine) |
| --- | --- | --- | --- | --- |
| class-ekn-6 | prospect | 25.000000 | 80.000000 | 20.000000 |
| class-ekn-7 | lead | 15.000000 | 70.000000 | 10.500000 |
| class-play | play | 10.000000 | 50.000000 | 5.000000 |
| class-pg-zero | prospect | 0.000000 | 50.000000 | 0.000000 |

The engine prints the product as a decision line. On Ekene Deep it reads:

> Pc = Pg x Pd = 25% x 80% = 20%

For the discovered Ekene North appraisal, EKN-4, the line is shorter, because only the chance of development applies:

> Pc = Pd = 65%

## A chance of geologic discovery of 0

A stated Pg of 0 gives a Pc of 0.000000, and the project stays Prospective Resources with sub-class "prospect". The engine does not reclassify a prospect because its chance is zero; it reports the chance and leaves the judgement to the reader. A class is set by the facts of discovery and recovery, and a chance is a separate stated figure beside it.

## Chances that do not fit the class

Each class reads only the chances that apply to it, and every other is refused by name. A prospect with its chance of development left out:

> chances.developmentPct must be a number from 0 to 100; got nothing

A chance of geologic discovery stated for a discovered accumulation:

> chances.geologicDiscoveryPct must be left out for a discovered accumulation (the chance of geologic discovery applies to Prospective Resources, PRMS 2.1.3.2); got 50

And any chance stated for Reserves:

> chances must be left out for Reserves (PRMS 2.1.3.3 treats Reserves as near-certain to be commercial, so no chance figure is carried); got {"developmentPct":95}

## Two chances, two judgements

The chance of geologic discovery is a judgement about the rocks: is there a trap, a seal, a reservoir and a charge? The chance of development is a judgement about everything after a find: would it be big enough, could it be sold, would it be approved? Different specialists often state the two, and the engine takes them as separate inputs and multiplies them only at the end.

## What the chance is for

A chance of commerciality says how likely the project is to reach Reserves. It does not shrink the estimates: the 1U, 2U and 3U of a prospect are the quantities if it succeeds. Multiplying estimates by a named chance makes them risked, and the Expert tier takes that question up.

## Exercise

Open the classification calculator, the course's own calculator panel, in the view "The class, the sub-class and the chance of commerciality", and start from "EKN-6 Ekene Deep prospect". Read the Chance of commerciality tile and the decision line. Change the "Chance of development, percent (stated)" control to 50, work out Pc by hand from the product, then run it and compare. Set the same control to "not stated" and read the refusal. Then start from "EKN-4 Ekene North appraisal" and type a chance of geologic discovery into its control, and read which field the engine names.
