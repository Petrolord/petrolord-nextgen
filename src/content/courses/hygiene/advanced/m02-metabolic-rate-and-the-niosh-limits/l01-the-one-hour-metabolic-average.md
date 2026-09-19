# The one-hour metabolic average

{{panel:hy-heat-stress}}

The teaching hour's work is 380.000000 W for 40.000000 minutes and 140.000000 W for 20.000000 minutes. The time weighted metabolic rate is 300.000000 W over the hour. This is the M that every NIOSH heat stress limit in this module is evaluated at.

## What the rate measures

Metabolic rate is the rate at which the body turns energy into work and warmth, in watts. Heavy lifting produces more than walking, and walking more than standing at a panel. The rate matters to heat stress because every watt of warmth the body produces has to leave it, by sweat evaporating and by the surroundings taking it, and the WBGT measures how hard the surroundings make that.

The engine's door is `metabolicRateTwaW`. It takes periods of watts and minutes and returns the time weighted rate, the same arithmetic `wbgtTwaC` does for the index.

| period | metabolic rate, W | minutes |
| --- | --- | --- |
| 1 | 380.000000 | 40.000000 |
| 2 | 140.000000 | 20.000000 |

## Arithmetic by definition

The golden classes this door ARITHMETIC BY DEFINITION, with 0 published cases, 1 oracle-only case and 1 refusal. Its only constant is the window, so nothing in it could be misread off a page. That is the second reason, beside the WBGT average, that a one-hour metabolic average can be graded when every limit built on it cannot.

The input deserves the scrutiny the arithmetic does not need. A metabolic rate in the field is an estimate, usually taken from tables of activities rather than measured on the worker. The average is only as good as the rate assigned to each period, and a scenario that states the rates has already made that judgement for you.

## Watts only

The engine takes watts and no other unit. It has no kcal/h input, so a rate read from a source in kilocalories an hour has to be converted before it is typed. The NIOSH worked example this tier reads in module three states its rate as 300 kcal/h, which the golden carries as 348.9 W. A learner who types the kilocalorie figure as watts gets an answer the engine cannot catch, because both are plausible positive numbers.

## The refusal

A period with no work rate is refused on the field that names it:

> periods[0].metabolicRateW must be above zero watts

A body at work always has a rate above zero, so a zero rate means a missing entry, and the engine says which one.

## Exercise

Recompute the teaching hour: multiply each rate by its minutes, add, and divide by 60.000000 minutes. Confirm 300.000000 W. Then write one sentence saying what the average would be if the two periods had equal minutes, and whether it would still be 300.000000 W.
