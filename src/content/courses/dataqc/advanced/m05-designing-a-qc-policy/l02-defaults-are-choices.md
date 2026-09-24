# Defaults are choices

{{panel:dq-checks-explorer}}

Every setting a check uses when the caller leaves it unset is written in the result's basis block, and every one is a choice. Where a published source states the number, the engine names it; where none does, the choice is Petrolord's. The phase-sum tolerance is 0.005000 of the TOTAL, frozen runs need 5 values within 0 of the run's first value, the water cut tolerance is 1e-6, the Mahalanobis alpha is 0.025000, and the Tukey fences use the R7 quartile rule.

| setting | default | whose choice |
| --- | --- | --- |
| phaseSumCheck relTolerance, on the TOTAL | 0.005000 | Petrolord |
| phaseSumCheck absTolerance | 0 | Petrolord |
| frozenRuns minRun | 5 | Petrolord |
| frozenRuns tolerance, against the run's first value | 0 | Petrolord |
| waterCutCheck tolerance | 1e-6 | Petrolord |
| indexCheck stepTolerance | 1e-6 x expectedStep | Petrolord |
| duplicateIdentifiers maxDistance and the digit rule | 1, digits must match | Petrolord |
| mahalanobis alpha | 0.025000 | Petrolord |
| zScores threshold | 3 | the usual convention |
| modifiedZScores threshold | 3.500000 | Iglewicz and Hoaglin, as NIST prints it |
| iqrFences k and quartile rule | 1.500000, R7 | Tukey for k; Petrolord for the rule, so a spreadsheet reproduces it |
| ewmaChart L and limits | 3, asymptotic | NIST 6.3.2.4 |
| grubbsTest alpha | 0.050000 | NIST 1.3.5.17.1 |

## The phase sum, on the total

The parts must add to the total within max(absTolerance, relTolerance x |total|). On EKENE-3 day 40, oil plus water is 1737.500000 bbl/d against a gross of 1774.000000, a difference of -36.500000 against an allowed 8.870000, and it is flagged. Day 41 differs by -5.400000 against an allowed 8.991000 and is not. The alternatives change the answer: at relTolerance 0.01 day 40 is still the one day flagged, and with absTolerance 50 bbl/d added, no day is.

| tolerance, stated | failed | days flagged |
| --- | --- | --- |
| relTolerance 0.005, the default | 1 | 40 |
| relTolerance 0.01 | 1 | 40 |
| relTolerance 0.005 with absTolerance 50 bbl/d | 0 | none |

## Frozen runs, against the first value

A frozen run is at least 5 consecutive present values each within the tolerance of the run's FIRST value. The alternative compares each value with the one before it. On the stated slow drift, 410.000000 rising by 0.100000 a reading to 410.600000, at tolerance 0.15 the engine finds 0 runs. Derived, and a rule the engine does not use: comparing each value with its neighbour would chain all 7 readings into one run. The engine's rule calls a drift a drift, and it reserves "frozen" for a meter that holds its value.

## The water cut tolerance

At the default 1e-6 the water cut check fails 83 days on EKENE-3; at one unit in the fourth decimal it fails 6, the planted ones. The sheet reports water cut to four decimals, so the default flags rounding. A policy for a four-decimal sheet states 1e-4 and says why.

## The quartile rule

The Tukey fences use R7 quartiles by default, the default of Excel, R and numpy, so a spreadsheet reproduces the fences; R6 is NIST's rule. On EKENE-7's water sand gamma ray the upper fence reads 48.685000 with R7 and 49.117500 with R6, and both flag entry 170. The choice moves the fence and, on this sand, leaves the flag where it was.

## Why the defaults are written down

A default that nobody states is a decision nobody made. The engine writes each one into its basis block, so a result carries the settings that produced it and anyone can rerun it with the same or with different ones. A policy copies the settings it keeps, changes the ones that do not suit its data, and records the reason for each change beside it.

## Exercise

In the checks panel's consistency view, run EKENE-3's phase sum at the default and confirm day 40 is flagged with an allowed difference of 8.870000. Set relTolerance to 0.01 and confirm day 40 is still the one day flagged. Then raise relTolerance until day 40 stops being flagged, and note the value. Write one sentence for a policy that states the tolerance you would choose for a gross total metered by truck tickets, and the reason.
