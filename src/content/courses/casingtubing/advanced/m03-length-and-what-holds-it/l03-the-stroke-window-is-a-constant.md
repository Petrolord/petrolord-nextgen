# The stroke window is a constant

The pressures slide the window. They never widen it.

{{panel:ct-tubing-explorer}}

## The claim

Hold the pressure changes fixed and sweep the temperature. The string strokes out at some cold temperature and at some hot one, and the WIDTH of the band between them is

    2 x stroke / (alpha x L)

whatever the pressures are.

## Why

The total length change is

    total = (pressure terms) + alpha x L x dT

The pressure terms do not contain dT. So as a function of temperature the total length is a straight line of slope alpha times L, offset by whatever the pressures contribute.

The stroke condition is that the absolute total is at most the stroke. A straight line of fixed slope crosses plus and minus the stroke at two points separated by twice the stroke divided by the slope.

The pressures change the offset, which moves both crossings together. They cannot change the slope, because they are not in it.

## On this string

    2 x 1.5 / (0.000012 x 2500) = 100 degrees exactly

And the bisected answer from the engine agrees: the cold limit is at minus 34.82534863819683 degrees and the hot one at 65.17465136180317, and the difference is 100 to a part in ten million.

## Slide it

Take the bore pressure change from 10 MPa to 30 MPa. Both limits move UP, because the pressure terms shorten the string and it now takes more heating to stroke out at the top.

The width stays at 100.

## What this is good for

It converts a completion design question into an arithmetic one.

Ask how much stroke a seal assembly needs and the answer is: enough to cover the operating temperature range, times alpha times the length, over two. Nothing about the pressures enters that at all.

For a 2500 m string with an 80 degree operating swing, the stroke needed is 0.000012 times 2500 times 80 over 2, which is 1.2 m. This packer has 1.5 m and would cover a 100 degree swing.

## The caveat that makes it approximate

It is exact only for a string whose pressure terms are temperature-independent, and in a real well they are not: heating the annulus raises its pressure, which changes both pressure terms.

The width is therefore a very good approximation rather than an identity, and the fact that this engine reproduces it to a part in ten million is a statement about the engine's assumptions, not about a real completion.

## Exercise

Compute the stroke window width for a 4000 m string with 2 m of stroke.

Then say how much stroke a 4000 m string would need to cover a 90 degree operating swing, and whether that is a realistic seal assembly.
