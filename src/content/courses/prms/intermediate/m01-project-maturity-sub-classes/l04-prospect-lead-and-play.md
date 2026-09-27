# Prospect, lead and play

{{panel:prms-reserves-calculator}}

Prospective Resources are the quantities of an undiscovered accumulation that a project would recover if it were found and developed. Their maturity is split three ways (PRMS 2.1.3.5.9, Table 1), and like the Contingent sub-classes these are stated. The engine checks the stated sub-class is one of the three, and it computes the one figure a Prospective project carries: its chance of commerciality.

## Three sub-classes in the course's words

A prospect is a potential accumulation defined well enough to drill. A lead is a potential accumulation that needs more data before it becomes a prospect. A play is a family of such accumulations in a basin, grouped by the geology they share, before any one of them is mapped.

The order is the order of work. A play is studied, a lead is found in it, and a lead becomes a prospect when the data allow a well to be placed. None of the three has a well that proved an accumulation, so none has met the commerciality test.

## Two chances and their product

An undiscovered project carries two stated chances: the chance of geologic discovery, Pg, and the chance of development if it is found, Pd. Its chance of commerciality is their product, Pc = Pg x Pd (PRMS 2.1.3.3). The engine's line on Ekene Deep, verbatim:

> Pc = Pg x Pd = 25% x 80% = 20%

| golden input | sub-class | Pg, percent (stated) | Pd, percent (stated) | Pc, percent (engine) |
| --- | --- | --- | --- | --- |
| class-ekn-6 | prospect | 25.000000 | 80.000000 | 20.000000 |
| class-ekn-7 | lead | 15.000000 | 70.000000 | 10.500000 |
| class-play | play | 10.000000 | 50.000000 | 5.000000 |
| class-pg-zero | prospect | 0.000000 | 50.000000 | 0.000000 |

A chance of geologic discovery of 0 gives a Pc of 0.000000, and the class is still Prospective Resources: the engine classifies the facts it is given. EKN-6 is the same prospect the farm-out course prices, with the same chance of geologic discovery.

## What a Prospective project may not state

A Prospective project is undiscovered, so the commerciality test does not apply to it, and stating the criteria is refused by name on the field `commerciality`. A sub-class outside the three is refused too, verbatim:

> subClass must be one of "prospect", "lead", "play"; got "development-pending"

And the chance of development must be stated:

> chances.developmentPct must be a number from 0 to 100; got nothing

## Why the sub-class sits beside the chance

The sub-class tells a reader how much is known; the chance tells them how likely the project is to become commercial. A lead with a high Pc and a prospect with a low one can both be honest, and a report states both.

## Exercise

Work in the reserves calculator, in the view "Sub-classes and the commerciality criteria". Its starts are discovered projects, so this exercise builds a prospect in the box.

1. Start from "EKN-4 development pending" and set "Discovery (stated)" to undiscovered. Read the field the refusal names.
2. Replace the whole box with a prospect of your own: `{"discovery":"undiscovered","recoveryProject":"established-technology","subClass":"prospect","chances":{"geologicDiscoveryPct":25,"developmentPct":80}}`. Read the class, the sub-class and the chance of commerciality.
3. Set "Sub-class (stated)" to lead, then to play. Read the sub-class decision each time.
4. Set "Chance of development, percent (stated)" to not stated and read the refusal.
