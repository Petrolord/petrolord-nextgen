# What power costs

Horsepower is not free and it is not proportional to production. On one design the two move in opposite directions.

{{panel:pd-card-explorer}}

## A barrel has a price in horsepower

ODUMA-4 at 10 spm returns 18.955924637 hp and 316.565396142 bbl/d, which the engine reports as 0.059879964 hp per bbl/d. That is the only ratio of its kind in the design, and it belongs to one design at one speed. Nothing about it carries to another well.

## The damping ratio moves the price, and nobody measures it

| Damping ratio | Horsepower, hp | Produced, bbl/d | Converged |
| --- | --- | --- | --- |
| 0.0500 | 15.588073 | 353.253676 | false |
| 0.0600 | 15.970723 | 347.672482 | false |
| 0.0800 | 16.471484 | 322.001024 | true |
| 0.1000 | 18.294800 | 319.059539 | false |
| 0.1200 | 18.955925 | 316.565396 | true |
| 0.1400 | 20.730425 | 314.458437 | true |
| 0.1600 | 21.788343 | 312.673085 | true |
| 0.1800 | 22.921537 | 311.121016 | true |
| 0.2000 | 24.404568 | 309.745554 | true |

Nine contiguous teaching rows on ODUMA-4, one input moved. The horsepower climbs from 15.588073 to 24.404568 hp while the production falls from 353.253676 to 309.745554 bbl/d. More damping means more of the polished rod's work goes into the string and less of the stroke reaches the plunger, so the price of a barrel rises at both ends of the fraction at once.

The engine's own message says field strings sit between about 0.05 and 0.15 of critical, and three of the rows inside that band come back with a notPeriodic warning and converged false.

## Where horsepower is bought back

Plunger size does better. A 1.2500 in plunger on ODUMA-4 takes 14.385581 hp for 171.610889 bbl/d, and a 2.2500 in plunger takes 23.587228 hp for 468.819923 bbl/d, so a plunger under twice the diameter buys well over twice the oil for well under twice the power. The 2.2500 in row comes back with rodOverstressed and a worst section loading of 102.235377 percent, which is what a bigger plunger actually costs.

## The mistake

Buying barrels with speed. Between 6.0 and 12.0 spm the horsepower on ODUMA-4 goes from 8.791354106 to 24.676711395 hp, because the speed enters the power twice: it multiplies the card, and it enlarges the card it multiplies. Speed is the most expensive lever available and the easiest one to turn.

## What it refuses

It refuses to price anything. There is no tariff, no motor efficiency and no cost in the return object, and 0.059879964 hp per bbl/d is a mechanical ratio at one point in the machine. Anything with currency in it is the reader's arithmetic, done outside this engine.

## Exercise

Read the horsepower and the produced rate at damping ratios of 0.0500 and 0.2000 in the panel and write both pairs down.

Then say which of the two columns moved by more in proportion, and what that means for a design sheet that states a horsepower without stating the damping ratio.
