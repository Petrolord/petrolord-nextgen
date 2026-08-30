# Design factors, and three verdicts

Four thresholds, one status, and a warning band nobody writes down.

{{panel:ct-loadcase-explorer}}

## The four design factors

| check | design factor |
|---|---|
| burst | 1.1 |
| collapse | 1.0 |
| tension | 1.6 |
| triaxial | 1.25 |

Four different numbers for four different checks, and each of them encodes a different amount of trust in the rating it is applied to.

Collapse gets 1.0 because the rating is already a published minimum from a test population. Tension gets 1.6 because parting a string is unrecoverable and because the real running load has shock and drag in it. Burst and triaxial sit in between.

## The rule

    FAIL     if any of the four safety factors is below its design factor
    WARNING  if any of burst, collapse or triaxial is below 1.1 times its design factor
    PASS     otherwise

## The warning band

The thresholds that produce a WARNING:

    burst below 1.2100000000000002
    collapse below 1.1
    triaxial below 1.375

Tension is absent from the warning rule. A section can sit at a tension safety factor of 1.61 and report PASS, while a burst safety factor of 1.2 reports WARNING despite being further above its own design factor in percentage terms.

## Is that right

It is a choice, and it is defensible: tension already carries the largest design factor, so a further ten percent band on top of 1.6 would flag sections that are genuinely fine.

But it is a choice, and it is not written anywhere except in the code. A reader who assumes all four checks have a warning band will misread a report.

## What a WARNING is for

It is not a failure. It is a request to look, and specifically to look at whether the assumption behind the load is as conservative as it should be.

A section at a burst safety factor of 1.21 passes its design factor by ten percent, which means the whole margin rests on the load case being right.

## The verdict is per section per case

Fourteen verdicts on this string. There is no overall string verdict, and there should not be: a string that fails one case in one section has a specific problem in a specific place, and collapsing that to a single word would lose the only useful information in the report.

## Exercise

A section reports burst 1.19, collapse 1.4, tension 1.55 and triaxial 2.0.

Give its status, and name every one of the four numbers that contributed to your answer.
