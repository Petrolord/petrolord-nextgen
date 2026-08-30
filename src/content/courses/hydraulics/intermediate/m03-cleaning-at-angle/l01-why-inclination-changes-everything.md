# Why inclination changes everything

The mechanism that a vertical transport model cannot contain.

{{panel:hy-cleaning-explorer}}

## In a vertical hole

A cutting falls straight down through the mud. The mud goes up. The cutting's net motion is the difference, and if the mud is fast enough it goes up too.

That is the model this course computes, and in a vertical hole it is a fair description.

## In a hole at angle

The cutting still falls under gravity, and gravity is no longer along the hole. It falls ACROSS the annulus and lands on the low side.

The distance it has to fall is the annular gap, which is centimetres, not the length of the hole. So it lands almost immediately.

Once it lands, it is no longer a particle in a fluid. It is part of a bed lying on the low side, and moving it needs a completely different mechanism: the mud has to scour it, roll it, or lift it back into suspension.

## Why the model does not see it

The engine computes a slip velocity from a force balance on a single particle in an unbounded fluid, and subtracts it from the annular velocity.

There is no bed in that calculation. There is no low side. There is no inclination anywhere in the slip velocity expression.

## The evidence in the engine's own output

The horizontal well and the slant well return the SAME transport ratio at every flow rate, for the same mud.

Look at the numbers: 0.8284815558593573 at 0.025 m3/s for both. The two wells have identical annulus geometry and identical flow rates, and the model has no other input that could distinguish them.

A 40 degree hole and a 90 degree hole cannot possibly clean the same. The model says they do.

## The three regimes real experience finds

**Below about 30 degrees**, cuttings are carried in suspension and a vertical model is roughly right.

**Between about 30 and 60 degrees**, beds form and can slide back down the hole under their own weight, which is the worst regime and the hardest to manage.

**Above about 60 degrees**, beds form and are stable: they do not slide, and they have to be removed by mechanical action.

The middle regime is the difficult one, and it is the one a build section passes through.

## What this course does instead

It computes the vertical transport model honestly, states its scope, and names the mechanism it is missing.

The alternative would be to add an inclination correction factor, which would produce a plausible number with no oracle behind it. The engine does not have one and this course does not invent one.

## Exercise

Run both wells at every flow rate in the panel and confirm the transport ratios are identical.

Then write down, in one sentence, what a user who did not read this lesson would wrongly conclude from that.
