# Barlow, and the thin wall idea

One line of algebra, and the assumption that makes it true enough.

{{panel:ct-rating-explorer}}

## The formula

    P = 2 x Yp x t / D

with Yp the yield strength, t the wall thickness and D the outside diameter. That is Barlow's formula, and it is the whole of the burst calculation before the tolerance factor is applied.

## Where it comes from

Cut a length L of pipe in half along its axis. The pressure inside pushes the two halves apart with a force of P times D times L, because the projected area of a half cylinder is its diameter times its length.

Two walls hold it together, each carrying a stress sigma over an area t times L. So

    P x D x L = 2 x sigma x t x L

and cancelling L and setting sigma to the yield strength gives Barlow directly.

## The thin wall assumption

That derivation puts the same stress in every part of the wall. A thick-walled cylinder does not do that: the hoop stress is highest at the bore and falls toward the outside, and the exact answer is the Lame solution rather than Barlow.

For a ratio of diameter to wall above about 15, the difference is a few percent and Barlow is on the conservative side of it. Every casing row in this catalog is above 17, so the assumption holds throughout.

## Why the outside diameter and not the mean

Barlow as derived above uses whichever diameter you cut on. API specifies the OUTSIDE diameter, which gives the smallest answer of the reasonable choices, and consistency matters more here than the extra percent.

## Worked

A 9-5/8 inch 47 lb/ft joint at L-80: diameter 0.244475 m, wall 0.0119888 m, yield 551580560 Pa.

    2 x 551580560 x 0.0119888 / 0.244475 = 54097875.183376625 Pa

The rating the panel shows is smaller than that, and the next lesson is entirely about why.

## Exercise

Compute Barlow for the 9-5/8 inch 53.5 lb/ft joint at L-80, wall 0.013843 m.

Then compute it for the 20 inch 133 lb/ft joint at the same grade, wall 0.016129 m and diameter 0.508 m. The second pipe has a thicker wall and a lower rating. Say why in one sentence.
