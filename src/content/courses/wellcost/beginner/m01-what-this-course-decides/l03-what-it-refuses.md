# What it refuses

The engine costs the programme you give it, and it will not invent the programme for you.

## No hydraulics

Nothing in the engine knows the mud weight, the pump rate, the annular velocity or the equivalent circulating density. A rate of penetration is an input you assert, not a result the engine derives. If poor hole cleaning is going to halve your rate, you halve the rate yourself.

## No torque and drag

There is no string model. A trip takes twice the depth divided by a trip speed whether the hole is vertical or horizontal, whether the string is in compression or hanging free. A hole that will be slow to trip is a hole where you enter a slower trip speed.

## No rig-specific learning curve

The engine does not know that the third section on a pad is faster than the first, or that this crew has drilled twenty of these wells. Every activity is evaluated from its own arguments alone, with no memory of what came before it.

## No market rates

Rates are yours. The engine does carry an indicative benchmark, and for a 3,000 m offshore shelf well in the Gulf of Mexico it will suggest 8 best-in-class days, 9 dry hole days, a rig rate of 450,000 dollars per day and a spread rate of 200,000 dollars per day. Every one of those is flagged indicative. It is a sanity check, not a price.

## No schedule optimisation

There is no search, no optimiser, no reordering. The engine evaluates the order you wrote. If you want to know whether a different casing point is cheaper, you build the other programme and evaluate it too.

## What it does refuse outright

The engine is strict about arithmetic that cannot mean anything. A drill activity must have a rate of penetration greater than zero and a bottom depth greater than its top depth. A trip speed and a casing run speed must both be greater than zero. A flat duration, a casing flat term, a cost rate and the non-productive fraction must all be at least zero.

It also refuses a broken programme. If a drill activity claims to start at a depth where the hole is not, the engine stops and tells you both depths rather than quietly leaving a gap in the hole.

## Exercise

For each of the five refusals above, name one situation where it would mislead you and say what you would do to the inputs instead.

Then decide which of the two indicative benchmark day counts you would compare an 18 day estimate against, and why.
