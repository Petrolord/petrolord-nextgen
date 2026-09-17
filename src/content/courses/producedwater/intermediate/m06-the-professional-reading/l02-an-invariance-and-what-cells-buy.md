# An invariance, and what the cell count buys

A flotation bank can be one big cell or a dozen small ones. Ask a model what that choice does and you learn something about the model as well as about the bank.

{{panel:pw-device-explorer}}

## The question, posed fairly

To ask it properly, two things have to be held constant. The total volume, so the water spends the same time in the bank. And the TOTAL GAS, so the bank is fed the same gas whichever arrangement it is in. The gas ratio here is per cell, so it has to be scaled by the cell count to keep the total fixed.

| cells | m3 each | total m3 | ratio per cell | total gas m3/s | residence s | cut micron |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 60 | 60.000000 | 0.300000000000 | 0.041402941388 | 434.751720 | 48.447550 |
| 2 | 30 | 60.000000 | 0.150000000000 | 0.041402941388 | 434.751720 | 48.447550 |
| 4 | 15 | 60.000000 | 0.075000000000 | 0.041402941388 | 434.751720 | 48.447550 |
| 12 | 5 | 60.000000 | 0.025000000000 | 0.041402941387 | 434.751720 | 48.447550 |

Every cut size in that column is the same number. The spread across the four arrangements is 7.11e-15 micron, which is derived, the largest minus the smallest, and it is machine noise. A jest test asserts the invariance to 1e-12.

## Why this had to come out this way

Nothing in the chain knows how the volume was divided. The plan area comes from a volume and a depth, the gas flux from a gas rate and that area, the residence from a volume and a flow. Split the bank and every one of those quantities scales in a way that cancels.

An answer that DID move here would mean the model had picked up a dependence on how a user chose to describe the same equipment, and that is a defect rather than a feature. It would also be nearly impossible to spot from a single run, because there is no obvious wrong answer to look for. The only way it shows up is by asking the model the same question twice in two forms.

## What the cell count does change

The invariance holds at equal total gas. Hold the gas RATIO instead and the cell count moves the answer, and it should: four cells at a ratio use four times the gas of one cell at the same ratio.

The module reports the gas per cell AND the total on every return, so that reason is on the screen rather than left to be inferred. A reader comparing two arrangements can see immediately whether they were fed the same gas.

## What an invariance is worth

An identity like this one needs no publication to check. It is a statement the model makes about itself, it can be tested by running the model twice, and it is one of the strongest kinds of check there is, because it cannot be satisfied by a coincidence of constants.

Ask it of any model that lets you describe one piece of equipment two ways. A model that passes tells you something real about its internals, and a model that fails has told you where to look.

## Exercise

Explain why the gas ratio had to be scaled by the cell count for this comparison to mean anything.

Then say what it would have told you about the model if the cut size had moved between the one cell row and the twelve cell row.
