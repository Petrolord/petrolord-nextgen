# The onset and the detection rule

The capstone grades the overpressure onset at a tolerance of zero, and the answer is 2520 m. The ramp starts at 2500 m. Both statements are true, and the 20 m between them is this lesson.

{{panel:pp-eaton-explorer}}

## The rule, stated exactly

The engine reports the onset as: the first sample, scanning downward, whose pore pressure exceeds the hydrostatic by more than 0.05 MPa.

Three choices hide in that sentence. A threshold: 0.05 MPa, there to keep floating-point residue and log noise from flagging a normal section. A grid: samples every 10 m, so the answer is always a multiple of 10. A direction: first from the top, so one noisy shallow sample could claim the onset on a real log, which is one more reason the screening of module 2 matters.

## Walking into the ramp

The encoded overpressure at the first few samples below the ramp top, from the engine:

At 2500 m, 0 exactly: the ramp contributes nothing at its own top sample. At 2510 m, 0.04000000000001117 MPa. At 2520 m, 0.08000000000000372. At 2530 m, 0.12000000000000373.

The scan reaches 2510 m and finds 0.04, real overpressure, below threshold: not flagged. At 2520 m it finds 0.08, above threshold: flagged, scan over. The reported onset is 2520 m, two samples below the mechanism's true start, and it is the correct answer to the question the rule asks.

The tolerance of zero now makes sense. The graded quantity is not where overpressure begins, which is a matter of geology and, on a real well, of argument. It is what the stated rule reports on this data, which is a matter of fact, exactly reproducible, with no rounding to be generous about.

## The rule's parameters move the answer

The panel's threshold control demonstrates this. At 0.01 MPa the onset reads 2510 m, because 0.04 clears the lower bar. At 0.2 MPa a first guess says 2560 m: the sequence runs 0.04, 0.08, 0.12, 0.16, then exactly 0.20 at 2550 m, and 0.20 is not strictly above 0.2, so the first qualifying sample should be 2560 m. The engine reads 2550 m. Both the guess and the engine are reasoning correctly, and reconciling them is the exercise below.

The exponent moves it too, as module 2 found: at $n = 1$ the whole anomaly is quieter and the flag waits until 2540 m; at $n = 4$ it fires at 2510. Same well, same rule, different reported onsets.

None of this is a defect. Any detector has parameters, and a detector without stated parameters is a detector you cannot reproduce. The lesson is that an onset is a triple, depth plus rule plus settings, and quoting the depth alone invites a colleague with different settings to contradict you about a well you agree on.

## Why 20 m matters on a real well

On this well, 20 m of onset error costs nothing; the ramp is gentle. On a real well the onset often lands near a casing decision: the last casing shoe above the overpressured section has to be set in normal pressure, and the string is planned off the prognosis. An onset reported 20 m deep of the mechanism, because the anomaly had not yet cleared a threshold, is 20 m of hole the plan believes is normal and is not. The mitigation is exactly the decomposition this lesson practised: know your rule's threshold, know the anomaly's growth rate, and state the onset as no deeper than, never as equal to.

There is also a converse worth a sentence: a threshold too low reports onsets everywhere on a noisy log, and a driller who has seen three false onsets stops believing the fourth. The threshold is a trade between missing the top of a ramp and crying wolf, which is why it is a stated, argued number and not a constant of nature.

## Worked example

Predict the onset under a 0.1 MPa threshold without touching the panel. The overpressure sequence is 0.04, 0.08, 0.12 at 2510, 2520, 2530 m. The first value strictly above 0.1 is 0.12, so the onset reports 2530 m. The general rule for this well: with threshold $T$ MPa and the 4 kPa per metre ramp sampled every 10 m, the reported onset is 2500 m plus 10 times the smallest integer $k$ with $0.04k > T$.

## Exercise

Using that rule, explain why the 0.2 MPa threshold reports 2550 m and not 2560 m, being careful about the word strictly.

Self check: the sequence at 2540 m is 0.16, at 2550 m is 0.20000000000000745 by the engine's arithmetic. The comparison is strictly greater than 0.2, and the floating-point sum at 2550 m lands a hair above 0.2 rather than exactly on it, so the flag fires at 2550 m. With exact decimal arithmetic 0.20 would not exceed 0.2 and the onset would be 2560 m: the reported answer sits on a floating-point hair. That is not a reason to distrust the engine; it is a reason never to set a threshold exactly on a value the data can take.
