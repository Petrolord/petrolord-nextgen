# The capstone walkthrough

The Expert capstone gives you a section of its own, with picks to a tenth of a metre, in which one well reached total depth above TOP_B. You predict the missing pick two ways from the wells that carry it: project the mean TOP_A to TOP_B interval down from TOP_A for the layer-cake estimate, and the mean TOP_SAND to TOP_B interval down from TOP_SAND for the other. You report both predictions, their spread, the two mean intervals and the structural relief of TOP_B where it is drilled. This lesson walks the six on the Ekene section, where Ekene-4 is the short well. None of the Ekene numbers is a capstone answer.

The prediction explorer opens on the Ekene wells. Choose "Type a section" and replace the Ekene lines with the brief's wells; the short well is the one with a dash for TOP_B.

## The six fields, worked on Ekene

**1. Mean TOP_A to TOP_B interval.** On Ekene the three intervals are 140, 150 and 133 m, so the mean is 423 divided by 3, which is 141 m. Read it from the mean TOP_A to TOP_B tile.

**2. Mean TOP_SAND to TOP_B interval.** On Ekene the intervals are 92, 97 and 87 m, so the mean is 276 divided by 3, which is 92 m.

**3. The layer-cake estimate.** The short well's TOP_A plus field 1: on Ekene, 1530 plus 141, which is 1671 m.

**4. The estimate from TOP_SAND.** The short well's TOP_SAND plus field 2: on Ekene, 1590 plus 92, which is 1682 m.

**5. The spread between the two estimates.** Field 4 minus field 3: on Ekene, 11 m.

**6. TOP_B structural relief where it is drilled.** The deepest TOP_B pick minus the shallowest over the wells that carry it: on Ekene, 1662 minus 1628, which is 34 m.

With picks to a tenth of a metre, a mean over three wells can run to recurring decimals. The tiles print two decimals; carry the full value through the prediction rather than a rounded mean.

## The means feed the predictions, so an error propagates

Each prediction is its mean plus a fixed anchor depth, so an error in a mean carries into its prediction metre for metre, and then into the spread. The most common error at this tier is a divisor error: both means are over the wells that carry TOP_B, so the short well contributes no interval to either mean. It contributes only its anchor depths.

## The spread must equal the difference of the two predictions

Field 5 is a reconciliation, not an independent measurement. Whatever you enter for fields 3 and 4, field 5 must be their difference. Check it before submitting, since one subtraction catches a stale field left over from an earlier attempt.

## The relief is a separate reading

Field 6 is the only one of the six that is not derived from the predictions at all. It comes from the measured TOP_B picks, and it would be the same if nobody had ever attempted a prediction. It is not the error bar on fields 3 and 4, and the marks are lost by swapping it with the spread.

{{panel:wc-prediction-explorer}}

## Exercise

Without opening the panel, list the six fields in capstone order with the hand arithmetic for each one on the Ekene section. Then answer in two sentences: if you mistakenly averaged the TOP_SAND to TOP_B intervals over four wells, which fields would be wrong and what would each become.

As a self check: 423 divided by 3, or 141 m; 276 divided by 3, or 92 m; 1530 plus 141, or 1671 m; 1590 plus 92, or 1682 m; 1682 minus 1671, or 11 m; and 1662 minus 1628, or 34 m. Dividing 276 by 4 gives 69 m at field 2, so field 4 becomes 1590 plus 69, which is 1659 m, and field 5 becomes 1671 minus 1659, which is 12 m. Fields 1, 3 and 6 would be unaffected.
