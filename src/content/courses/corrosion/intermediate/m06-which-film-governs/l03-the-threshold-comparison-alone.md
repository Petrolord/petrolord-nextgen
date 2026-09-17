# The threshold comparison, alone

{{panel:fc-chemistry-explorer}}

The sour service door does one thing. It compares an H2S partial pressure
against one threshold and reports the comparison in two units, with a count of
how far above in powers of ten. It does not classify a severity region and it
does not recommend a material.

The threshold, measured by bisecting the flag the engine returns, is
0.003500000000 bar, which is 0.050763208303 psia. The engine prints both so
nobody has to convert, and it declares in a field of its own that the VALUE is
held for literature. No source for it exists in this repository.

| H2S partial pressure bar | psia | above the threshold | decades above |
| --- | --- | --- | --- |
| 0.000100000000 | 0.001450377380 | false | -1.544068 |
| 0.003500000000 | 0.050763208303 | true | 0.000000 |
| 0.010000000000 | 0.145037738007 | true | 0.455932 |
| 0.100000000000 | 1.450377380072 | true | 1.455932 |
| 1.000000000000 | 14.503773800722 | true | 2.455932 |

On the studio's shipped case the H2S partial pressure is 0.051000 bar, which is
0.739699 psia, the stream is above the threshold, and it is 1.163506 decades
above it.

## A comparison and a count, and that is all

The decade count is the useful half. A verdict of above the threshold is true of
a stream a hair over the line and of a stream three orders of magnitude over it,
and those are not the same situation. The count separates them without anybody
having to invent a severity scale to do it.

At zero H2S the decade count is reported as an absence rather than as minus
infinity, and the sour flag is false. The logarithm of zero is not a screening
result, so the engine declines to print one.

## What this door explicitly does not do

There is no severity region and no material guidance. The engine reports both as
not provided in fields of their own rather than leaving the rows off the screen,
so a caller cannot read the gap as a value somebody forgot to set. There is no
hardness limit, no weldment qualification, no sulphide stress cracking criterion
and no hydrogen induced cracking criterion. All of that needs a standard and no
standard is present in this repository.

The engine says as much in its own note above the threshold:

> H2S partial pressure 5.000e-2 bar (7.252e-1 psia) is at or above the 0.0035
> bar (0.050763 psia) screening threshold used here. This module does not
> classify a severity region and does not recommend materials. The threshold
> value itself is not sourced here.

## Why the threshold is printed in two units

A threshold quoted in one unit and compared in another is where conversion
mistakes live. This engine derives the psia figure from the bar figure rather
than carrying a separate rounded literal for it, and prints both, so the reader
never has to convert and no second copy of the number can drift away from the
first. The psia value it reports is 0.050763208303, carried to twelve figures
because a threshold that has been rounded on the way to the screen is a
different threshold from the one the comparison used.

## The two refusals

A blank H2S partial pressure returns a finite H2S partial pressure is required.
A negative one returns the H2S partial pressure must be non-negative. Both name
the input, which is the pattern throughout this module.

## Exercise

Record the H2S partial pressure in bar and in psia, the sour verdict and the
decade count on the shipped case. Then record the threshold in both units and
state which of your two recorded pressures the decade count was formed against.
