# What an erratum does to a gate

The golden behind this course pins 5 errata. For each one the engine must stay OUTSIDE the printed tolerance, so an engine that matched the typo would turn the suite red. The five sit 5.071055, 1.836177, 199.794001, 6.821223 and 1.904167 tolerances away from what the sources print.

## Pinning a typo as a case to miss

There are two ways to handle a printed value the formula refutes. The first is to drop the row from the golden. That is quiet and it looks tidy, and it leaves the typo invisible: a later edit to the engine that happened to match the printed value would pass, because nothing checks that row. The second is to keep the row and reverse its sense. The case asserts that the engine is far from the printed value. An engine edited to agree with the typo then fails, and the row turns the typo into a test.

The golden does the second for all five.

| golden id | door | printed | engine | tolerances away |
| --- | --- | --- | --- | --- |
| niosh-t11-99 | `noiseReferenceDurationH` | 0.316389 | 0.314980 | 5.071055 |
| a1-115 | `noiseTwaFromDoseDbA` | 91.100000 | 91.008191 | 1.836177 |
| niosh-t12-50000 | `noiseTwaFromDoseDbA` | 102.000000 | 111.989700 | 199.794001 |
| niosh-heat-example-rel | `nioshRecommendedExposureLimitC` | 27.800000 | 27.458939 | 6.821223 |
| niosh-heat-example-ral | `nioshRecommendedAlertLimitC` | 25.000000 | 24.047916 | 1.904167 |

The two heat stress rows are the NIOSH 2016-106 section 8.1 equation, checked for transcription only, set against the worked example's figure readings.

## The margin of each pin

A pin is only as strong as its distance from the tolerance. The transposed digit sits 199.794001 tolerances away and no plausible edit brings the engine near it. The Table A-1 row sits 1.836177 tolerances away and the RAL example 1.904167, so a small drift in either door would bring the engine inside the printed tolerance and the case would go red. That is the pin doing its job: the closer an erratum sits to its tolerance, the more a gate on it is worth, because it is the one an honest-looking edit could slip into.

## What a pin cannot do

An erratum pin tests the engine against a known wrong value. It says nothing about a constant both the engine and the oracle copied from the same page. The two heat stress errata prove that the engine does not follow NIOSH's figure readings. They do not prove that 56.7, 11.5, 59.9 and 14.1 are the numbers in section 8.1, which is why those constants remain the NIOSH 2016-106 section 8.1 equation, checked for transcription only. A pin guards against one mistake, and it is worth being exact about which one.

## Reading standards with this in mind

The habit this module teaches has three parts. Check a printed value against the source's own formula. Tell a rounding habit from a slip by the printed unit and the neighbours. And when a slip is found, record it in a form that makes repeating it fail. A reader who corrects their own copy of a table and moves on protects themselves. A reader who writes the correction as a test protects everyone who uses the tool after them.

None of this is a history of the engine. The five errata are in the published sources today, and every reader of those pages meets them.

## Exercise

Rank the five errata by tolerances away, smallest first. For the smallest two, write one sentence each on what kind of engine edit could bring the engine inside the printed tolerance. Then name the one thing an erratum pin on the NIOSH heat REL example does not test, using the evidence class that covers it.
