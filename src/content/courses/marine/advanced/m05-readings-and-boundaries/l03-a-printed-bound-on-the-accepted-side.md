# A printed bound on the accepted side

{{panel:marine-base-calculator}}

When the engine refuses a figure for being too large, it says how large the figure may be. A learner who types that printed bound back in should get a result, and at six decimals that takes a stated rule.

## The saturation refusal

A base whose berth utilisation reaches 1 has no steady state. The exact bound on the arrivals a day is the berths times the working hours a day over the service hours, and the arrivals must stay strictly below it. The engine prints the bound in its message, verbatim, for a case with 2 berths whose bound is exactly 20:

> arrivalsPerDay must be at most 19.999999 (rounded down at the sixth decimal so that it is accepted) for a steady state with 2 berths: the berth utilisation must stay below 1, so arrivals a day must stay below berths x working hours a day / service hours = 20; got 20, a berth utilisation of 1

The exact bound 20 is itself refused, so the engine prints 19.999999, the nearest six-decimal figure its rule accepts, and says it has moved it.

## When rounding would land on the wrong side

On base-refuse-saturated-thirds the exact bound is a repeating decimal, which the message prints at six decimals as 26.666667, verbatim:

> arrivalsPerDay must be at most 26.666666 (rounded down at the sixth decimal so that it is accepted) for a steady state with 2 berths: the berth utilisation must stay below 1, so arrivals a day must stay below berths x working hours a day / service hours = 26.666667; got 30, a berth utilisation of 1.125

Ordinary rounding gives 26.666667, which is above the exact bound and would itself be refused. The engine rounds down, to 26.666666, which is below the bound and accepted. The note in brackets appears only when the printed figure differs from the exact bound.

## The Ekene base at one berth

The Ekene base at one berth works 24 hours with 8-hour calls, so the exact bound is 3 arrivals a day, and the printed bound is 2.999999. Typed back in, 2.999999 arrivals a day run: the berth utilisation sits a hair below 1 and the mean wait runs to millions of hours. The figure is accepted, and it is still no plan. A bound says where the model stops working. It does not say where a base works well.

## Why the rule matters

The number in the refusal is always a number the engine will take, whichever way the exact bound happens to round.

## Exercise

Open the shore base calculator on the view "The berth queue" and start from "Ekene base with one berth (refused)". Read the refusal and find the printed bound and the exact bound in it. Set Arrivals a day (stated) to the printed bound and run: read the Berth utilisation and Mean wait, hours tiles. Then set Arrivals a day (stated) to 3 and read the refusal, noting what it says about the utilisation.
