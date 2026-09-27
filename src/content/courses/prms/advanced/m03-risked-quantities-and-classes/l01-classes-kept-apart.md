# Classes kept apart

{{panel:prms-aggregation-calculator}}

Reserves are discovered, commercial and remaining; Contingent Resources are discovered and yet to become commercial; Prospective Resources are yet to be discovered. A figure that adds all three mixes quantities with very different chances of ever being produced. The engine therefore aggregates one class a call, and every figure it returns says whether it is risked.

## One class a call

The Class (stated) control takes "reserves", "contingent" or "prospective", and the whole call is that class. The engine cites PRMS 4.2.6 in SPE-PRMS 2018 (June 2018; CC BY-NC-ND 4.0), answer 6.9 of the PRMS FAQs (November 2022; copyright SPE) and section 6.4 of the 2011 Application Guidelines, each by number only. In the course's words: each class is reported on its own line, and a total across classes is no reserves figure.

## A chance for each risked class

A risked class carries a stated chance of commerciality on every project. A Contingent project's chance is its chance of development; a Prospective project's is its chance of geologic discovery times its chance of development (EKN-6 at 20.000000 percent). A risked project with no chance is refused, verbatim:

> projects[0].chanceOfCommercialityPct must be a number from 0 to 100; got nothing

Reserves carry none. PRMS 2.1.3.3 treats Reserves as commercial, so the engine holds that no chance figure belongs on them, and a chance stated on a Reserves project is refused, verbatim:

> projects[0].chanceOfCommercialityPct must be left out for Reserves (their chance of commerciality is not a stated figure, PRMS 2.1.3.3); got 100

Classification refuses a chance on Reserves too. A Reserves figure is never risked.

## What the Risked mean tile says

For Reserves the "Risked mean" tile reads "none (Reserves)". For a risked class it prints the sum of each project's chance times its mean, the subject of the next lesson. Every other figure of a risked class is unrisked: it describes the quantities if the projects go ahead.

## "Risked" names its chance

In this course "risked" always means multiplied by a named chance, and every figure says whether it is risked. An unrisked 2C and a risked mean of the same projects are two different figures.

## What stays with the caller

The engine cannot see which class a project belongs to. The class comes from classification, and the caller states it, so the reserves report names the class of every project it adds.

## Exercise

Open the aggregation calculator on the view "Aggregation: arithmetic and probabilistic" and start from "Ekene Reserves at the field level". Read the chance column of the project table and the "Risked mean" tile. Switch to "Ekene Contingent Resources, risked" and read them again. Return to the Reserves start, add the key chanceOfCommercialityPct with a value of 100 to the first project in the box, and read the refusal. Then on the Contingent start, set the first project's chance control to "not stated" and read that refusal.
