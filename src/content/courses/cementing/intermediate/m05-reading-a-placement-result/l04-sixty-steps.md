# Sixty steps

A discretisation with a default, and what it can miss.

{{panel:cm-placement-explorer}}

## The grid

    for (let k = 0; k <= steps; k += 1) { const V = (k / steps) * vTotal; ... }

with `steps` defaulting to 60, so 61 evaluations evenly spaced in PUMPED VOLUME from zero to the total.

Evenly in volume, not in time. At a constant rate those are the same thing; at a varying rate they would not be.

## What each step costs

A full rebuild of the fluid intervals, both leg maps, two head sums and two friction sums. On this job the annulus has two rows and at most five fluids, so a step is a few dozen arithmetic operations.

Sixty one of those is nothing, which is what makes the rate bisections in this tier affordable: each bisection is eighty runs of the whole job.

## What the grid can miss

**A brief free-fall period.** The horizontal well's neat programme free falls at exactly ONE of its 61 steps, at 24.891615007704534 cubic metres.

One step. The whole finding that the neat programme free falls on that well rests on a single sample, and if the grid had been coarser the sample might have fallen either side of the dip.

## Is the finding safe

Check it, because the check is one line and eighty milliseconds.

| steps | steps in free fall | volume range (m3) | worst U-tube (Pa) |
|---|---|---|---|
| 60 | 1 | 24.8916 to 24.8916 | -104394.27505085245 |
| 120 | 3 | 24.2366 to 25.5467 | -104394.27505085245 |
| 240 | 6 | 23.9091 to 25.5467 | -104394.27505085245 |
| 600 | 16 | 23.7125 to 25.6777 | -110300.25230836123 |

The dip is real. It spans about two cubic metres of the job, which is about two and a half percent of it, and every grid finds it.

And the 60-step answer UNDERSTATES the depth. At 600 steps the worst balance is -110300.25230836123 Pa rather than -104394.27505085245, because the coarse grid never sampled the bottom of the dip. Six percent, on a number this course quotes.

So the finding survives and one of its digits does not. Both of those are worth knowing, and neither is visible from a single run.

**A brief ECD peak.** Same argument. The peak on these runs is at the last step, which is always sampled, so it is safe here. On a job with an interior peak it would not automatically be.

## Why sixty and not six hundred

Because the outputs are read by a human and a chart with 601 points is not more informative than one with 61.

And because it is a default, exposed as a parameter, so anybody who needs more can ask for more.

## The step that is always right

The last one. `endPumpPressurePa`, `floatDiffPa` and `annulusEnd` all come from the final evaluation at the full pumped volume, which is exactly the end of the job. Those three are not sampled quantities at all.

## Exercise

The horizontal well's neat programme free falls at one step in 61.

Express that as a fraction of the job, and then as a volume in cubic metres, and say how long that period lasts at 0.02 cubic metres a second.
