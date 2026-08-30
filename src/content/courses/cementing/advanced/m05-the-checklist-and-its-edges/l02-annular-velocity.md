# Annular velocity

The mud removal criterion the engine does carry, and the one number it is compared against.

{{panel:cm-standoff-explorer}}

## The calculation

    velocity = pump rate / annular capacity

taken over every annulus row, and the MINIMUM is the one reported.

On this course's wells at 0.02 cubic metres a second:

| row | capacity (m2) | velocity (m/s) |
|---|---|---|
| cased | 0.013356688045922537 | 1.4973771889585683 |
| open hole at 15 percent | 0.013548091222369345 | 1.476222714457212 |

The slowest is the open hole, at 1.476222714457212.

## Why the open hole is slower

Because the excess made it the wider annulus. At the bit size the open hole capacity would be 0.011780948889016823 and the velocity 1.6976561216257935, faster than the cased section.

Fifteen percent of excess turned the fastest annulus into the slowest one.

Which is the right behaviour: a washed-out hole really does slow the fluid down, and the slow places are where the mud is not removed.

## The target

    minV >= 0.3 m/s

Three tenths of a metre per second, hard-coded, with the reason in the detail string: for mud removal.

## Where it comes from

It is a rule of thumb, and it is on the low side of the ones in use. The literature offers several: a minimum absolute velocity, a velocity relative to the mud's own displacement, a Reynolds number criterion for turbulent displacement, and an effective-laminar criterion that wants the opposite.

Three tenths of a metre per second is a screening floor rather than a design criterion.

## It is not binding on this job

Both velocities are around five times the target. The item passes on both wells with a wide margin, and nothing about the rate choice in the Professional tier was constrained by it.

That is common on a 7 inch string. It stops being common on a large-diameter surface casing in a washed-out hole, where the annulus is enormous and the velocity can be a few centimetres a second.

## The third pull on the rate

Which is the point of having it here. The Professional tier had two constraints on the pump rate, free fall and circulating density, pulling in opposite directions.

This is a third, and it pulls the same way as free fall: faster is better. So the rate is squeezed from both sides by two constraints that want it high and one that wants it low.

On this job the velocity constraint is slack and the other two decide. On a bigger annulus it would not be.

## Exercise

Compute the pump rate at which the open hole annular velocity on this well would fall to exactly 0.3 m/s.

Then say whether that rate is above or below the free-fall edge for the slant well's two-slurry programme, which is 0.01693390800228161 cubic metres a second.
