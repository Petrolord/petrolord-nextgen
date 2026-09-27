# On production, approved and justified

{{panel:prms-classification-calculator}}

{{panel:prms-reserves-calculator}}

At Associate you classified a project as Reserves when every commerciality criterion and the firm intention to proceed are met with established technology. This tier asks the next question: how far along is that commercial project? SPE-PRMS 2018 (June 2018; CC BY-NC-ND 4.0, read on 2026-09-27), which this course cites by section only, splits Reserves into three project maturity sub-classes (PRMS 2.1.3.5, Table 1). The engine does not take your word for which one applies. It derives the sub-class from two stated facts and then checks the sub-class you state against it.

## The two facts

The two facts are whether the final investment decision is taken and whether the project is on production. Both sit in the `projectStatus` block of a classification, each a stated true or false with no default. From them the engine reads one of three sub-classes:

| golden input | final investment decision (stated) | on production (stated) | sub-class (engine) |
| --- | --- | --- | --- |
| class-ekn-1 | true | true | on-production |
| class-ekn-2 | true | false | approved-for-development |
| class-justified | false | false | justified-for-development |

The engine records each decision with its section. On the Ekene infill wells it reads, verbatim:

> approved-for-development: final investment decision taken; production yet to start

## Three sub-classes in words

On production: the project is selling petroleum to market. Ekene Main waterflood (EKN-1, synthetic) is the course's example. Its reserves status is stated as developed-producing.

Approved for development: the investment decision is taken and the money is committed, and production has yet to start. Ekene infill wells (EKN-2, synthetic) sit here, with a reserves status of undeveloped.

Justified for development: every commerciality criterion is met and the firm intention to proceed is stated, and the investment decision is still to come. The golden input class-justified states such a project.

The three lie along one path. A justified project becomes approved when the decision is taken, and an approved project becomes on production when its first sales begin. The class stays Reserves the whole way; only the maturity moves.

## What the sub-class leaves alone

The sub-class moves no quantity. The categories 1P, 2P and 3P are read from the estimates, so class, sub-class and category answer three separate questions. A sub-class carries no chance either: Reserves carry no chance of commerciality at all (PRMS 2.1.3.3), and a stated chance is refused.

## The same view in two calculators

The classification calculator from Associate and this tier's reserves calculator both run the same classification through the same vendored engine. The reserves calculator's view "Sub-classes and the commerciality criteria" starts on the cases this tier teaches, with the approved Ekene infill wells first.

## Exercise

Work in the course's own calculators.

1. In the reserves calculator, open the view "Sub-classes and the commerciality criteria" and start from "EKN-2 Ekene infill wells (approved)". Read the Class and Sub-class tiles and the sub-class decision with its section.
2. Start from "Justified for development". Read the sub-class, then set "Final investment decision taken (stated, Reserves)" to true. Read what the engine now says about the stated sub-class, and name the sub-class it asks for.
3. Start from "EKN-1 on production" and read the reserves status beside the sub-class.
4. In the classification calculator, start from "EKN-1 Ekene Main waterflood" and confirm the same class and sub-class. Write one sentence naming the fact that moved the sub-class in step 2.
