# What the goldens are

Four cases, three subsystems, one independent implementation.

{{panel:hy-cleaning-explorer}}

## The contents

For each of the four cases: the three rheology fits, three flow rates of hydraulics results, four surge and swab results, and one hole cleaning result.

Each hydraulics result carries the pump pressure, the pipe loss, the annulus loss, the bit loss, the equivalent circulating density at total depth, the worst annular velocity and a set of equivalent circulating density checkpoints.

Each surge and swab result carries the pressure and the two equivalent mud weights.

The hole cleaning result carries the worst transport ratio, the cuttings feed rate and the full row list.

## Where they came from

A numpy program, written independently against the same published method specification, in a different language by a different author.

## Why an independent implementation

Because there is no closed form and no published worked example that covers this method end to end.

A hydraulics calculation on a real string is dozens of elements, each with a local power law and a friction factor from a correlation. Nothing about it is checkable by hand.

## The tolerance

The file states it: a relative tolerance of 1e-6 on every value.

That is a demanding number and it is achievable, because both implementations are following the same specification and there is no place where a judgement call would move an answer.

## What the engine actually achieves

Better than 1e-6 everywhere.

The rheology fits agree to about 1e-10, which is the rounding of the published nine-decimal values rather than a real disagreement.

The surge and swab pressures agree to about 1e-16, which is machine precision: the calculation is short and both implementations do it identically.

The pump pressures agree to about 1e-7, which is the longest chain in the comparison and the largest disagreement in it.

## The pattern

Short chains agree at machine precision. Long chains accumulate rounding and agree at 1e-7.

That is exactly what floating-point arithmetic does, and it is what a clean comparison looks like: the residual is a function of the length of the calculation rather than of anything anybody chose.

## Exercise

Open the panel's minimum-flow view and read the oracle tile.

Note the worst relative error and the number of values checked, then say what would have to be true of a disagreement for it to be worth investigating rather than accepting.
