# A published case on both sides of a limit

A threshold that is never crossed in a test suite is a threshold nobody has checked. This module's golden file is built so that every warning and every limit in it has cases on BOTH sides, and that design decision is worth more than most of the numbers in the file.

## Warnings as golden values

The golden carries expectation fields for the warnings themselves: `expectVelocityWarning`, `expectStarvedWarning`, `expectOverloadWarning`, `expectResidenceWarning`, `expectHoldupWarning` and `expectBreakthroughWarning`. A warning that stops firing therefore fails a case rather than going quietly.

Counted off the file:

| golden warning field | rows carrying it | rows where it is true |
| --- | --- | --- |
| expectVelocityWarning | 4 | 2 |
| expectStarvedWarning | 5 | 1 |
| expectOverloadWarning | 5 | 1 |
| expectResidenceWarning | 7 | 2 |
| expectHoldupWarning | 7 | 1 |
| expectBreakthroughWarning | 8 | 2 |

Every one of those fields is STRADDLED. It is true on at least one row and false on at least one other, which is what makes it evidence that the threshold sits where the module says it does.

## Why straddling is the whole point

Suppose a warning field were true on every row that carries it. A suite like that passes if the warning fires correctly, and it also passes if the warning fires always, on everything, for no reason. The cases cannot tell those apart.

Now suppose it were false on every row. The suite passes if the threshold is right and it passes if the warning has been deleted.

Only a field that is true on one row and false on another can measure where the boundary is. A straddled field is the difference between testing a warning and testing that a warning exists.

## The same idea applied to a refusal

The file carries a group for the media filter's loading floor, and it is built the same way. Seven rows: five beds REFUSED below the floor, two answered at and above it, and the bed area that would run the flow at the floor.

Read the shape of that group. It is not a demonstration that the module can refuse. It is a demonstration of exactly WHERE it starts refusing, with cases on the far side to prove the module still answers there, and with the bed area that reaches the floor recorded so the refusal can be acted on.

## The rule underneath both

At least one row per device states NONE of that device's defaults. That is a rule a golden file has to be built to, because a suite whose every case runs at the defaults cannot tell a default from a derivation.

Put the three ideas together and you have the shape of a published case file that is actually doing work. Straddle every threshold. Carry cases outside every stated band as well as inside it. And move the inputs off their default values so that the code has to compute rather than recall.

## Exercise

Pick any threshold in this module and describe the two cases you would add to pin it: one on each side, as close to the boundary as you can usefully get.

Then say what a suite that carried only the inside case would fail to notice, and what a reviewer reading a green run of it would be entitled to conclude.
