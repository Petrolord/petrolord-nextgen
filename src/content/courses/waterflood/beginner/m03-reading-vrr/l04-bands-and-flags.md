# Bands and flags

A VRR number becomes an action only when it is compared against something. There are two somethings, they come from different places, and keeping them apart is the difference between a dashboard that flags problems and one that flags the plan.

## The interpretation bands

The first comparison is generic reservoir engineering. The Petrolord voidage core classifies any VRR against fixed thresholds:

- below 0.9: under-injection, produced voidage is not being replaced, expect pressure to decline
- above 1.1: over-injection, injecting more than produced, repressurizing or possible voidage fill-up
- between: balanced, voidage is being replaced

These bands know nothing about your field. They are a reading of the physics: a flood ten percent below replacement will lose pressure, a flood ten percent above will gain it, and inside that range the pressure signal is small enough that other things dominate.

Applied to Ekene: 0.85 reads under-injection, 1.05 reads balanced, the Professional tier's North element at 1.2425079040670826 reads over-injection, and its South element at 0.6072854843711397 reads under-injection.

## The operator target band

The second comparison is your plan. It is an input, not a constant, and it is the one that should drive alarms. Ekene's operating band in this course is 1.00 to 1.20: the field is aiming at 1.05 and will accept anything from replacement up to twenty percent above it.

The engine flags each period as `under`, `in-band`, or `over` against whatever band you supply, and returns null where the instantaneous VRR is undefined. Against the 1.00 to 1.20 band, Ekene's 36 months come out as:

| band | under | in-band | over |
|---|---|---|---|
| 1.00 to 1.20 | 4 | 32 | 0 |
| 0.95 to 1.10 | 3 | 33 | 0 |
| 1.04 to 1.06 | 5 | 31 | 0 |

Four months flagged under, all of them in the start-up ramp, and nothing flagged over across the whole record.

## What the three rows tell you

Look at how little the answer moves. Widening the band from 1.00-1.20 to 0.95-1.10 removes one flag. Tightening it to 1.04-1.06, which is nearly a point target, adds one. Three quite different bands give three, four and five flagged months out of thirty six.

That stability is a property of THIS field, and it is worth knowing why: Ekene's VRR is a step function that sits exactly on 1.05 for 31 of 36 months, so almost every band that contains 1.05 gives the same answer. On a field whose VRR scatters, band width is the single biggest driver of how many alarms you get, and choosing it becomes a real decision about alarm fatigue rather than a formality.

Note also that under the tightest band the first five months flag under, not four, because 1.01 is below 1.04. The flags did not find a new problem; the band moved.

{{panel:wf-ledger-explorer}}

Drag the band minimum and maximum and watch the shaded region move against the fixed lines. The count of flagged months in the tiles updates with it. Try to find a band that produces an `over` flag anywhere in the Ekene record, and note what you have to do to the maximum to get one.

## Flags are not alarms

A flagged period is a period outside the band. Whether it deserves attention depends on how many, how consecutive, and how recent. Four scattered flags in three years is noise. Four consecutive flags is a trend. Four consecutive flags in the last four months is a problem. The flag array carries the information to make that distinction, and a dashboard that reduces it to a count throws that away.

Ekene's four under-flags are the first four periods of the record, consecutive and entirely historical. Read as a count they look like a small persistent problem. Read in position they are obviously the commissioning ramp, and the right response is to leave them alone.

## Null is a third answer

Where a period produced no voidage at all, the instantaneous VRR is undefined and the flag is null rather than `under`. That matters, because a shut-in month with zero production and zero injection is not an under-injection event, and a system that silently treats undefined as zero will report it as the worst month in the record. Undefined and zero are different, and a surveillance tool that cannot distinguish them will eventually cost you a day of investigating a maintenance shutdown.

## The misconception to avoid

"The 0.9 and 1.1 bands are the industry standard target." They are interpretation thresholds built into the classifier, not a target anyone should adopt by default. A field needing repressurization should run above 1.1 for years and be flagged `over` the entire time by the generic classifier while being exactly on its own plan. Set your target band from your plan, and let the generic classifier be a second opinion rather than the alarm.

## Exercise

First, using the three-row table above, explain in two sentences why tightening the band to 1.04-1.06 adds exactly one flagged month rather than several, and name the month that gets added.

Second, design a flag rule for Ekene that would have raised nothing during the commissioning ramp but would raise within two months if the field dropped to a sustained VRR of 0.7. State the band, the window, and the consecutive-period rule.
