# Losses outside zero to one hundred

Most of this tier has been about what the engine computes. This lesson is about one input it will not compute with at all.

{{panel:crude-valuation-explorer}}

## The range the engine states

The engine applies the loss percent as a factor on the product value, (1 - loss percent / 100). The digest says what the loss is: "Losses are a volume shrinkage on the product side, so they come off the product value before the costs." At Kwale the loss is 0.8 percent, and its value is 0.5939 $/bbl of crude.

The engine's refusal states the range it accepts: "Losses must be between 0 and 100 percent." The digest probes one value past each end of that range, 101 percent and -1 percent, and prints what comes back for each.

## What the engine returns

netbackValue refuses both, in its own words:

| asked | what the engine returned |
| --- | --- |
| losses of 101 percent | REFUSED: Losses must be between 0 and 100 percent. |
| losses of -1 percent | REFUSED: Losses must be between 0 and 100 percent. |

A refusal is an answer. It names the range the input must lie in. The digest prints the sentence and no netback beside it, so there is no figure to carry forward and no differential to read.

## How this differs from a blank

Module 4 showed a blank loss treated as zero and named in assumedZero. The digest gives the reason for that one: a netback with no freight is a legitimate question, so a blank cost is taken as zero and NAMED. A loss of 101 percent is not a blank. It is a typed number outside the stated range, and the engine refuses it. So a blank is filled and labelled, and a value outside the range is refused. The digest prints the blank case: with Kwale's freight and losses left blank, the netback is 67.4412 $/bbl, assumedZero names freight and losses, and the valuation reports complete: true.

## One sentence for both ends

The two probes sit on opposite sides of the range, one above 100 and one below 0, and the engine returns the same sentence for both. The sentence names the range. It does not say which end was crossed, and the typed value is what shows that.

## Reading a refusal

When the engine refuses, read its sentence as it is printed. It says what range is acceptable, and the digest prints no corrected value and no netback beside it. The valuation explorer shows the refusal in place of the waterfall, with the engine's sentence, so the learner sees the answer the engine actually gives.

## Exercise

Read the two refused requests and the engine's sentence for each. Say which end of the stated range each input lies past, and quote the range the sentence names. Then say how the engine's treatment of a blank loss differs from its treatment of these two.
