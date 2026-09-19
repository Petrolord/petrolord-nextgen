# The capstone brief

{{panel:ss-intervals-explorer}}

The capstone for this tier grades six figures, and every one of them answers the Professional question: how sure are we?

| graded field | the lesson it rests on |
| --- | --- |
| lower 95 percent limit on a site's recordable rate per 200,000 hours | limits from the chi-square distribution |
| upper 95 percent limit on the same rate | limits from the chi-square distribution |
| central 95 percent upper limit for a crew with zero events, per 200,000 hours | the upper limit at zero |
| lower 95 percent limit on a rate ratio | the rate ratio and its interval |
| upper 95 percent limit on the same rate ratio | the rate ratio and its interval |
| the central p-value of that comparison | the central two-sided p-value |

## What it grades and why

It grades limits and a p-value. It grades no rate on its own, because that is the Associate question and the Associate capstone already asks it. It grades nothing about whether a series is changing, because that is the Expert question. Each tier's capstone grades only its own question, so no lesson in one tier can hand out another tier's answer.

Every graded figure comes from two engine functions, `rateConfidenceInterval` and `compareRates`, and you have met both in every module of this tier.

## The workplace is new

The capstone runs its own workplace, with its own counts and hours. None of them appears in any lesson, and none of the figures in this tier's lessons is a capstone answer. The BLS example, the IMO ladder, the ABO crew, ERHA and UTOROGU are worked examples. Use them to check that you are driving the explorer correctly, and then work the capstone's own figures from scratch.

## How to work it

Take each field in turn and decide which function it needs before you touch the explorer.

For the two limits on a site's rate, pass the site's count and hours on the 200,000 base at confidence 0.95. Pass the confidence as a fraction: the engine refuses 95 and says so in its own words.

For the zero events crew, pass a count of 0 and its hours on the same base and confidence. The field asks for the central 95 percent upper limit, which is the engine's own output. It is not the rule of three, and the rule of three figure would sit roughly a fifth lower on any hours.

For the comparison, set the two groups in the order the brief gives, because the ratio and its limits depend on which group comes first. Record the lower limit, the upper limit and the central p-value the engine returns. A minlike p-value from R or scipy is a different figure and will not match.

## Before you submit

Check that each comparison agrees with itself: a central p-value below 0.05 should come with an interval that excludes 1, and one above 0.05 with an interval that includes it. Keep your figures at full precision until the end.

## Exercise

Before you open the capstone, rerun the BLS worked example through the explorer and confirm 1.407182 and 7.211338. Then rerun UTOROGU and confirm the central p-value of 0.051759 and the interval of 0.991404 to 12.408545. State, for each of the six graded fields, which of these two reruns exercises the same engine path.
