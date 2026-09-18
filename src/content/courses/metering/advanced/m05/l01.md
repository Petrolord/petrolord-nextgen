# The same arithmetic answers money and emissions

What evaporates out of a fixed-roof tank is product that was bought and a release that has to be reported. Those are two conversations in most organisations and they are one calculation, which is worth knowing before you are asked to do the work twice.

## The tank and what it loses

| quantity | value |
| --- | --- |
| vapour space height, ft | 4.200000 |
| true vapour pressure, psia | 2.370000 |
| annual throughput, bbl | 484000.0000 |
| vapour space volume, ft3 | 12844.2382 |
| vapour density, lb/ft3 | 0.027086 |
| total loss, lb/yr | 77142.8167 |
| total loss, short tons/yr | 38.5714 |

The inputs are a vapour space height of 4.200000 ft above the liquid, a true vapour pressure of 2.370000 psia for the product, and an annual throughput of 484000.0000 bbl through the tank. From those the engine returns a vapour space volume of 12844.2382 ft3, a vapour density of 0.027086 lb/ft3, and a total loss of 77142.8167 lb/yr, which it also returns as 38.5714 short tons per year.

## One number, two units, two audiences

The last two rows are the same quantity. Pounds a year is the unit an operations engineer works in and short tons a year is the unit an emissions inventory is filed in, and the engine returns both so nobody has to convert between them in a spreadsheet cell that later gets copied.

That is a small thing with a large failure mode behind it. A loss figure that travels between departments and gets converted informally on the way eventually arrives wrong. Returning both renderings makes the conversion part of the result rather than part of the correspondence.

## What drives it

Three inputs carry most of the behaviour. The vapour space height sets how much vapour there is to expand. The true vapour pressure sets how much of that space is product vapour rather than air. The throughput sets how often the space is filled and emptied.

Vapour pressure also carries the sharpest edge in this module. Take it far enough up and the relations stop applying at all, which a later lesson handles with a refusal rather than a number.

## The geometry underneath it

The vapour space volume of 12844.2382 ft3 is the same cylinder the rest of this tier works on, taken over the height of the space above the liquid rather than over the whole shell. That is one more answer this tier takes out of the same geometry, beside the capacity, the shell and the wetted area, and it is the reason the losses sit in the same module as the shell and the venting.

## Why this belongs in a tank tier

A tank is not usually thought of as a process unit, because nothing happens in it. Losses are the reminder that something is happening in it all the time, and that the something has a price and a permit attached. Reading the same result as money and as an emission is the habit this module wants, and it costs nothing, because the arithmetic has already been done.

## Exercise

Read the loss block in digest SECTION 29 and name the returned figure that would be used in an emissions inventory and the one that would be used in a cost estimate. Then say what makes those two rows the same quantity.
