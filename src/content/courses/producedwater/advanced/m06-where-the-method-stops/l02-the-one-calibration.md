# The one calibration in this module

Sort every number in this engine into derived, declared, calibrated or held, and the calibrated pile has exactly one thing in it. That is worth dwelling on, because a calibration is a different kind of claim from everything around it.

{{panel:pw-device-explorer}}

## What it is

`attachmentEfficiency` is 0.01. It is the probability that a droplet colliding with a bubble sticks, and it is the ONE number in this module with no derivation at all.

It was chosen so that a cell at the module's own default conditions cuts in the ten to twenty micron range induced gas flotation is customarily credited with. That is the entire justification. No published measurement stands behind the value, and nothing in this course presents it as published.

## How hard it pulls

Move it and the flotation cut moves with its own square root.

| attachment efficiency | cut micron | cut over the declared value row |
| --- | --- | --- |
| 0.002 | 53.071631 | 2.236068 |
| 0.005 | 33.565447 | 1.414214 |
| 0.01 | 23.734355 | 1.000000 |
| 0.02 | 16.782723 | 0.707107 |
| 0.05 | 10.614326 | 0.447214 |

The last column is derived, each cut over the declared value row. Taking the efficiency from its declared 0.01 down to 0.002 multiplies the cut size by 2.236068, and taking it up to 0.05 multiplies it by 0.447214. Those are movements most designers would not accept in a device rating, and they come from a number with nothing published behind it.

## Why a square root is the reassuring part

A calibration entering with a square root is better behaved than one entering linearly. An error in the number you know least about is damped on its way to the answer rather than passed through whole.

That is a property to check whenever you meet a calibration. Work out the power it enters at, because the power tells you how much of your uncertainty survives the calculation.

## It is an input

The value is not locked away. It is an input, so a caller with a vendor curve can move it, which is exactly what should happen to a number with no derivation the moment somebody has real data.

That is also why no graded answer in this course depends on it. Grading an answer that rests on a calibration would be grading the calibration.

## How to quote a flotation cut

Say the cut size, say the bubble size and the gas rate that produced it, and say that the attachment efficiency behind it is a calibrated value chosen to land the default case in a customary range. A reader who knows that can decide how much weight to put on it. A reader who does not will treat it like the basin cut, which comes out of geometry and measured fluid properties and is a completely different kind of number.

## Exercise

Sweep the attachment efficiency in the panel and confirm the square root behaviour against the ratio column.

Then write the caveat you would attach to a flotation cut size in a design report, in one sentence a non specialist could act on.
