# Where a curve exceeds

{{panel:qr-societal}}

A state of EXCEEDS says that the curve crosses the line somewhere. A reviewer needs to know where: over which range of N the curve lies above the criterion, because that range names the events that drive the result. The engine reports that range for every exceeding step, and the rule it uses has three parts. This lesson states the rule, works it on one step of the JISIKE off-site curve, and then shows what a line with an upper end does.

## The rule

For each step whose corner exceeds the line, the range runs to the corner itself. It runs from the largest of three values:

| candidate for the start of the range | why it can be the start |
| --- | --- |
| the previous corner | the step begins there |
| the line's smallest N | the line does not apply below it |
| (C / F)^(1 / alpha) | the N at which the falling line drops to the step's height F |

The third candidate comes from setting the line equal to F and solving for N. Before that N the line is above the flat step; after it the step is above the line. Taking the largest of the three gives the first N at which all three conditions hold.

## The JISIKE off-site curve against the Dutch line

The comparison returns EXCEEDS, with these ranges:

| exceeding step ends at N | F above the line from N | to N |
| --- | --- | --- |
| 12.000000 | 10.153462 | 12.000000 |
| 40.000000 | 24.253563 | 40.000000 |
| 300.000000 | 70.710678 | 300.000000 |

## One step worked

Take the step ending at N = 40. Its F is 0.000001700000 per year. The Dutch line has C = 1e-3 and alpha = 2, so the line falls to F at N = (1e-3 / F)^(1/2) = 24.253563, derived. The previous corner is 12 and the line's smallest N is 10. The largest of 12, 10 and 24.253563 is 24.253563, so F lies above the line from 24.253563 to 40. Between 12 and that point, the step is still below the line.

On the first step the previous corner is 3, the line's smallest N is 10, and the crossing is at 10.153462, so the crossing decides again. The range on each step is narrower than the step itself.

## A line with an upper end

A line may stop at a largest N. With the same Dutch constants capped at N = 100, stated, the corner at N = 300 lies outside the line's range. The curve still has a step running across N = 100, so the engine evaluates F at N = 100 itself, and compares there:

| N | ratio F / line | state |
| --- | --- | --- |
| 12.000000 | 1.396800 | EXCEEDS |
| 40.000000 | 2.720000 | EXCEEDS |
| 100.000000 | 2.000000 | EXCEEDS |

This is the one place where the engine checks a point that is not a corner of the curve. It has to: on the step that crosses the cap, the ratio is largest at the cap, so the cap is where that step's maximum sits.

## What the range is for

The ranges show which events carry the exceedance and how wide a band of N each one covers. A duty holder looking for measures looks first at the scenarios whose steps exceed, because moving their frequency or their N is what moves the curve below the line.

## Exercise

Take the step ending at N = 300, where F is 0.000000200000 per year. Compute (1e-3 / F)^(1/2) and confirm the start of the range, 70.710678. Then say why neither the previous corner of 40 nor the line's smallest N of 10 is the start on that step.
