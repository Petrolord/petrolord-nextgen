# Boiling the water back out

The second part of the reboiler duty is the one that does the dehydrating. A gallon of glycol comes back from the contactor carrying water, and the still has to boil that water off before the glycol can go round again.

{{panel:fc-water-explorer}}

## How much water is in a gallon

The circulation ratio said how many gallons carry a pound. Turn it over and it says how much water a gallon carries. At 3.200000 gal per lb each gallon picks up 0.312500000 lb of water, which is one over the ratio.

That inversion is the single most useful move in the glycol half of this course. Every per gallon quantity downstream is built on it, and every time the ratio moves this number moves the other way.

## What a pound costs to boil

The heat this module charges for taking a pound of absorbed water back out in the still overhead is 1100.000000 Btu a lb. It is a declared constant, exported under its own name, and it is also an input with that value as its default.

Multiply the water in a gallon by the heat a pound, and a gallon of glycol at 3.200000 gal per lb needs 343.7500 Btu to give its water up. That figure is the overhead term with no reflux at all, and it is the first row of the reflux table in the next lesson.

## Why it is declared rather than computed

A latent heat of vaporisation is a physical property and this module does not compute one. It takes a figure that stands for boiling absorbed water out of a glycol solution at still conditions, which is a slightly different thing from the latent heat of pure water, and it declares it.

There is no publication inside this repository to check that number against. What can be done is what was done: export it under a name, and measure it back out of the engine by asking for an answer in which the vaporisation term is the overhead alone. The measurement divided by the export comes back at 1.000000000000, so the name on the page and the number in use agree. That says nothing about whether 1100.000000 is the right value, and it is worth being clear about the difference.

## The two halves compared

The sensible term is charged on the solvent. The overhead term is charged on the water. That is why they respond to different things: the sensible half follows the still temperature and the overhead half follows the circulation ratio, and neither one cares much about the other.

## Exercise

At a circulation of 3.200000 gal per lb, record how much water a gallon carries and what the overhead heat per pound is. Form the overhead term from them and check it against 343.7500 Btu a gallon. Then say what a measured over exported ratio of 1.000000000000 does and does not establish about that constant.
