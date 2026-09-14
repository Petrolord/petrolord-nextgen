# Percents that are not chances

The repaired VOI Analyzer checks its typed percents before it computes anything. A set of percents that is not a distribution is refused with a message naming its sum in percent, and no card is shown.

{{panel:ec-judgement-explorer}}

## The refusals

Each published voiRefusals case on the Analyzer's default study, with the engine's message verbatim:

- posteriorsAboveHundred: `Outcome chances given "Positive Seismic" sum to 130 percent, expected 100`
- posteriorsOffsetButPriorsAgree: `Outcome chances given "Positive Seismic" sum to 110 percent, expected 100`
- indicatorChancesAboveHundred: `Indicator chances sum to 110 percent, expected 100`
- outcomeChancesBelowHundred: `Outcome chances sum to 90 percent, expected 100`
- missingOutcomeChanceCountsAsZero: `Outcome chances given "Positive Seismic" sum to 60 percent, expected 100`
- chanceOutsideRange: `P(Success Case | Positive Seismic) needs a chance between 0 and 100 percent`
- noIndicators: `No indicators given`

Three kinds of sum are checked: the outcome chances, the indicator chances, and the outcome chances given each indicator. Every single entry must also sit between 0 and 100 percent. EKPAN typed with its No bright spot chance at 64 percent beside a Bright spot of 46.000000 percent is refused the same way, `Indicator chances sum to 110 percent, expected 100`.

## What the Analyzer used to print

Before the repair, the same inputs produced cards. They are history, reconstructed from engine calls, and every one sits beside an evpi card of 63.00:

| case | gross voi before the repair |
| --- | --- |
| posteriorsAboveHundred | 69.00 |
| posteriorsOffsetButPriorsAgree | 42.50 |
| indicatorChancesAboveHundred | 33.00 |
| missingOutcomeChanceCountsAsZero | 41.00 |
| chanceOutsideRange | -15.00 |
| noIndicators | -15.00 |

Two of them are impossible on sight. A value of 69.00 is above the ceiling that perfect information sets, and -15.00 is below the floor of zero that Bayes guarantees. The others are more dangerous because they look plausible: 33.00 is exactly the default study's genuine voi, printed for an input whose indicator chances sum to 110 percent.

## A case that fools the eye

The posteriors of posteriorsOffsetButPriorsAgree given Positive Seismic sum to 110 percent, yet the case is built so the priors they imply agree with the stated ones. A reader who checks only the implied priors passes it. The Analyzer checks each distribution first, refuses it, and never reaches the consistency test.

The information engine's own implied-priors check counts a missing posterior as zero instead, and published missingPosteriorsCountAsZero reads consistent false.

## Refusal and withholding

A refusal says the typed numbers are not chances at all, and nothing is computed. A withholding says they are chances that cannot all be true together: IRRI, with both indicators typed as 20 / 80 percent, still reports EMV without information 15.00 and EVPI 63.00, because those two depend only on the stated outcome chances, and withholds the value of information. Neither answer repairs your inputs.

## The mistake

The careful mistake is editing the number a message names until the sum reads 100. The sum was a symptom. An indicator chance of 64 percent beside 46.000000 percent could be a slip in either box, and outcome chances given an indicator that sum to 130 percent may be likelihoods typed where posteriors belong, which no single edit repairs. Go back to the source of each number.

## Exercise

Write the message for EKPAN typed with No bright spot at 64 percent. Then, for chanceOutsideRange and indicatorChancesAboveHundred, give the gross voi the Analyzer printed before the repair and say which of the two could not have been caught by eye.
