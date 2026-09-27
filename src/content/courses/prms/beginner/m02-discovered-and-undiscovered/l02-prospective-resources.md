# Prospective Resources and their sub-classes

{{panel:prms-classification-calculator}}

An undiscovered accumulation with a recovery project that could apply to it is Prospective Resources (PRMS 2.1.0.1, Table 1). Nothing has been found yet, so the quantities rest on geology and on two chances: that a well finds petroleum, and that a find would then be developed. The framework sorts Prospective Resources by how mature the idea is, in three sub-classes.

## Prospect, lead and play

| golden input | sub-class (stated) | chance of geologic discovery, percent (stated) | chance of development, percent (stated) |
| --- | --- | --- | --- |
| class-ekn-6 | prospect | 25.000000 | 80.000000 |
| class-ekn-7 | lead | 15.000000 | 70.000000 |
| class-play | play | 10.000000 | 50.000000 |

In the course's own words (PRMS 2.1.3.5.9, Table 1):

**A prospect** is a potential accumulation defined well enough to drill. Ekene Deep, EKN-6, is one.

**A lead** is a potential accumulation that needs more data, such as more seismic, before it can become a prospect. Ekene Shallow, EKN-7, is one.

**A play** is a family of such accumulations across a basin, sharing the geology that could trap petroleum. The course's small case "A play" states one.

The sub-class is a stated input. The engine cannot see the seismic or judge how mature the mapping is, so it takes what is stated and checks only that it is one of the three.

## A sub-class from another class

A Contingent sub-class stated on an undiscovered project is refused, with the three accepted ones named:

> subClass must be one of "prospect", "lead", "play"; got "development-pending"

The Contingent sub-classes describe a found accumulation waiting on development. They have no meaning before discovery.

## What Prospective Resources do not carry

There is no commerciality test, because there is nothing yet to develop; stating the criteria for an undiscovered project is refused. There is no project status and no reserves status either. What a prospect does carry is a low, a best and a high estimate, labelled 1U, 2U and 3U, which the categories module reads.

## The engine's decisions on EKN-6

The decision table for Ekene Deep holds five rows: the discovery, citing PRMS 2.1.1.1; the recovery project, citing PRMS 2.1.0.1; the class, citing PRMS 2.1.0.1 and Table 1; the sub-class, citing PRMS 2.1.3.5.9 and Table 1 with the outcome "prospect (stated)"; and the chance of commerciality, citing PRMS 2.1.3.3. The word "stated" in the outcome is a reminder that the engine took the sub-class from you and checked it against the list.

## A sub-class is not a chance

A lead is less mature than a prospect, and it often carries lower chances, as EKN-7 does here. The engine does not derive one from the other: the chances are stated separately, and the next lessons multiply them. A well-mapped prospect can still carry a low chance of geologic discovery.

## Exercise

Open the classification calculator, the course's own calculator panel, in the view "The class, the sub-class and the chance of commerciality", and start from "EKN-7 Ekene Shallow lead". Read the decision table and the Sub-class tile. Set the Sub-class control to "development-pending (Contingent)" and read the refusal. Restore "lead (Prospective)". Then start from "A play" and write down, for the play, the lead and the prospect, the sub-class, the two stated chances and the section each decision cites.
