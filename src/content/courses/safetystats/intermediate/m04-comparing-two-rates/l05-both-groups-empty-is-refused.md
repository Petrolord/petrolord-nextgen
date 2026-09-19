# Both groups empty is refused

{{panel:ss-intervals-explorer}}

Three calls to `compareRates` and what each returns:

| what was passed | field named | result |
| --- | --- | --- |
| 0 events in 180000 hours against 6 in 210000 | none | ratio 0.000000, upper 0.990863 |
| both groups empty | `count1` | refused |
| a group with no hours | `exposureHours2` | refused |

The first is a golden comparison with one empty group. The second and third carry no number.

## The engine's own words

When both counts are zero the engine refuses, names `count1`, and gives this message verbatim:

> count1 and count2 are both zero: the conditional test has no events to condition on

When the second group has no hours it names `exposureHours2`:

> exposureHours2 must be a finite number of hours above zero: a rate over no exposure is undefined

## Why both empty cannot be tested

The conditional test works by splitting the total count between the two groups and asking whether the split matches the hours. With both counts at zero, the total is zero and there is nothing to split. The binomial would be on zero trials, every tail would be one, and the rate ratio would be zero over zero. None of that is a finding, so the engine refuses to produce it.

This is different from one empty group. There, the other group's events give the test something to condition on, and the previous lesson showed the engine returning a finite limit on one side. With both empty, no side of the interval exists.

## What to do instead

Two groups with no events at all are two zero events questions, and module three answers each of them. Run each group through `rateConfidenceInterval` and report its upper limit. For a crew with 0 recordables in 41300 hours that limit is 17.863823 per 200,000 hours at 95 percent. Two such limits side by side say how high each group's rate could be, which is the most two clean records can tell you.

What they cannot tell you is which group is better. A report that ranks two crews with zero events each is ranking their hours, because the one with more hours has the lower upper limit and nothing else to separate them.

## Why the refusal names count1

A refusal names one field, so that a program can point at it. Both counts are at fault here, and the engine names the first and puts both in the message. That keeps the rule simple for a program that reads `field`: one field, and the message carries the rest.

## The pattern across the engine

Every refusal in this tier has the same shape: the engine stops when the question has no answer and names the input that made it so. Confidence given as 95 has no answer as a probability. Two empty groups have no split to test. A group with no hours has no rate. Each refusal carries no number, and a program that reads the result sees an `error` and a `field` and nothing it could mistake for a finding.

## Exercise

Open the comparison view and enter 0 events in 180000 hours against 0 in 210000 hours. Copy the engine's message and the field it names. Then run each group through the interval view on the 200,000 base at confidence 0.95, record both upper limits, and state which group's upper limit is lower and what, if anything, that tells you about which group is safer.
