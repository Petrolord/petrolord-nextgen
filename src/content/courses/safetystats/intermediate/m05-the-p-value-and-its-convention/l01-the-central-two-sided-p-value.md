# The central two-sided p-value

{{panel:ss-intervals-explorer}}

Four comparisons and the engine's central p-value for each:

| comparison | smaller tail | central p-value |
| --- | --- | --- |
| ERHA east against west | upper, 0.128104 | 0.256209 |
| UTOROGU north against south | not printed | 0.051759 |
| compare-first-zero | not printed | 0.048748 |
| compare-second-zero | not printed | 0.039551 |

The rule behind every figure in the last column is one sentence: twice the smaller tail, capped at 1.

## The rule

The conditional test gives two tails. The lower tail is the probability of the first group's count or fewer, under equal rates. The upper tail is the probability of that count or more. Whichever is smaller says how far out the observed count sits on its own side. Doubling it asks how far out it would be on either side, which is what two-sided means. The cap at 1 keeps the result a probability, because the two tails overlap at the observed count and doubling the smaller can occasionally pass 1.

The engine's method line says exactly this: "central two-sided p-value (twice the smaller tail, capped at 1)".

## On ERHA

East recorded 6 of the 17 events against an expected share of 0.210374. The lower tail is 0.951727 and the upper tail is 0.128104, so the upper is smaller. Twice it is the central p-value, which the engine prints as 0.256209. That is well above 0.05. The data give no good reason to think east and west differ.

## What the p-value is

The engine's central p-value is the probability, if the rates were equal, of a count at least as far out on the observed side as the one recorded, doubled to cover the other side. A small p-value says equal rates would rarely produce a split like this one. It is never the probability that the rates are equal, and it says nothing about how large a difference might be. The rate-ratio interval answers that second question.

## Why the engine calls it a convention

There is more than one accepted way to turn a two-sided exact test into one number. The engine chose the central convention and declares it in its method line. The next lesson shows the other main convention, the minlike one R and scipy use, which adds up every split no more likely than the observed one, and the lesson after that shows why the engine's choice is the one that agrees with its own interval.

A reader who meets a p-value from this engine should know that it is central, that it is twice the smaller tail, and that it is capped at 1. With those three facts it can be checked by hand from the two tails. Each printed figure is rounded to six decimals on its own, so twice a printed tail can differ from the printed p-value in the last digit, as it does on ERHA; the engine doubles the unrounded tail.

## The threshold

This course reads 0.05 as the line for a 95 percent interval, because a central p-value below 0.05 and a 95 percent interval that excludes 1 are two views of the same result. That pairing is the subject of the third lesson in this module.

## Exercise

From the ERHA figures, write down the lower tail of 0.951727 and the upper tail of 0.128104, pick the smaller, double it and apply the cap. Compare your answer with the engine's 0.256209 and say why the last digit differs. Then state in one sentence what that figure says about east and west, and one thing it does not say.
