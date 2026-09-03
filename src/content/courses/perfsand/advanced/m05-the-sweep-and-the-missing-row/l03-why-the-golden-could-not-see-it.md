# Why the golden could not see it

Two failures of validation, and the rule each one produces.

## The first failure: the fixture divided evenly

The golden case sweeps a hundred metre interval at a ten metre step. A hundred divided by ten is a whole number, so the last whole step lands exactly on the bottom.

At that step size, an endpoint-inclusive sweep and one that stops at the last whole step produce IDENTICAL rows. The comparison could not distinguish them, however many digits it agreed to.

The rule: a fixture that exercises only the well-behaved case cannot detect the badly-behaved one. When a routine has a special case, the golden needs an instance of it. A step that divides the interval is a special case, and it was the only one on file.

## The second failure: the oracle shared the shape

The independent oracle is supposed to be independent. Its purpose is that a mistake in one implementation shows up as a disagreement with the other.

Its loop was a transcription of the engine's: the same while condition, the same clamp, the same break. So it had the same defect, produced the same truncated rows, and agreed perfectly.

The rule: an oracle that reproduces the engine's control flow is not independent, whatever language it is written in. Independence is about deriving the answer differently, not about typing it again elsewhere.

## What independence looks like here

The oracle now builds the list of depths to visit explicitly, as a list, and asserts the endpoint rule at nine step sizes before it writes anything.

A list of stations and a while loop are different enough that a mistake in one is unlikely to be a mistake in the other. That is what independence has to mean in practice.

## The pattern across two courses

The previous course in this series found a defect in a REDUCTION over verified rows: the rows were right and the selection over them was wrong. This one found a defect in the SET of rows: each row was right and one was missing.

Both survived because the comparison compared the wrong thing. One compared rows and never compared the summary. The other compared rows against an oracle that generated the same wrong set.

## Exercise

Name the two validation failures and state the rule each one produces.

Explain why writing an oracle in a different language does not by itself make it independent.

Then compare this defect with the reduction defect from the previous course, and say what the two have in common.
