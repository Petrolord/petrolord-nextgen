# Wear derating

The role default is a starting point, not a verdict. When you have measured the pipe, you are expected to override it, and the engine lets you.

{{panel:wi-annulus-explorer}}

## How the override works

`mawop` reads the factor as `c.factor ?? factors[c.role]`. If a candidate carries its own factor, that value is used and the role table is never consulted for it. The role still travels with the row as its kind, so the table still says what the string is.

That ordering is deliberate. A measurement should beat a convention.

## What it costs

From the role sweep, a candidate with a 40000000 Pa limit at 1435.457478934607 m allows 37606905.05541501 Pa at a factor of 1.0 and 27606905.05541501 Pa at a factor of 0.75.

So writing an explicit 0.75 against a string you would otherwise take at face value drops the rated term from 40000000 Pa to 30000000 Pa, a quarter of the limit, and the whole of that reduction reaches the surface number.

## When an override is honest

An override is honest when it moves downwards and rests on evidence about this string in this well. A caliper or electromagnetic thickness log showing metal loss at the wear point below the wellhead. A casing wear model run against the rotating hours and dogleg severity in the drilling record. An inspection from a previous workover.

In each case the limit you supplied is no longer the limit this joint has, and the factor carries that news until someone re-rates the string properly.

## When it is not

The engine refuses a factor above one and a factor of zero or below, with the message that the factor must sit in the interval greater than zero and up to and including one. So you cannot uprate a string by declaring a factor of 1.2.

What the engine will not catch is the quieter abuse. Nothing stops you writing 0.9 against an outer casing whose role default is 0.5, and the row will compute happily. That converts half of the rating into nine tenths of it under cover of a data entry, and only the discipline of your own review will find it.

The test is simple. An override downwards needs evidence of damage. An override upwards needs evidence that the role itself is wrong, and the honest way to record that is to change the role and say why.

## Exercise

Give the 9-5/8 candidate on the published well an explicit factor of 0.4, then read the new MAWOP and say whether the governing candidate changed.

Then try a factor of 1.1 and read the error the engine returns.
