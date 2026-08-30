# Sinusoidal and helical

Two modes, one exact ratio between them.

{{panel:ct-tubing-explorer}}

## The two shapes

**Sinusoidal.** The string lifts off the low side of the hole and snakes from side to side in the horizontal plane, staying in contact with the wall along a wavy line. It is a two-dimensional shape.

**Helical.** The string climbs the wall and wraps around the inside of the casing in a spiral. Three-dimensional, and much more severe.

Sinusoidal comes first. Increase the compression on a sinusoidally buckled string and at some higher load it snaps into a helix.

## The two limits

    sinusoidal = 2 x base
    helical    = 2 x (2 x sqrt(2) - 1) x base

with the same base for both.

So the ratio is exactly

    2 x sqrt(2) - 1 = 1.8284271247461903

and it is the same on every string, in every hole, at every inclination. It is a pure number that falls out of the two mode shapes and contains nothing about the geometry.

## On this string

    sinusoidal 63373.03101988061 N
    helical    115872.96889413144 N

Divide the second by the first and you get 1.8284271247461903 to the last bit.

## The three states

    compression at most sinusoidal          -> 'none'
    between sinusoidal and helical           -> 'sinusoidal'
    above helical                            -> 'helical'

The engine reports one of those three strings, with the compression and both limits alongside, so the reader can see how far into a state the string is rather than only which state it is in.

## Which of the three published cases

Production heating: 123684.94705447978 N of compression, above the helical limit of 115872.96889413144, so 'helical'.

It is above by 7811.9781603483425 N, which is about seven percent. The string is only just helical, and a slightly cooler production temperature would leave it sinusoidal.

Injection cooling and stimulation are both in tension, so 'none'.

## Why the exact ratio is worth remembering

Because it means you only ever have to compute one of the two limits. Compute the sinusoidal one and multiply by 1.8284271247461903 for the helical.

And because a reported pair that does not have that ratio is a bug.

## Exercise

Compute how much compression this string would have to carry to be twice the helical limit.

Then work out what mean temperature change would do it, given the pressure changes of the production heating case.
