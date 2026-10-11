# When one well disagrees

A field wavelet is only as good as the wells in it, and one bad wavelet harms more than its own figure. QI Studio writes four rules for the issue register about ties and wavelets, and a designed case shows where the similarity rule catches a disagreeing well and where it lets one through.

## The rules

| what is measured | threshold | the register says |
| --- | --- | --- |
| a tie's mean windowed correlation | below 0.5 | poor |
| a tie's mean windowed correlation | below 0.7 | fair |
| the span of wavelet phases across wells | more than 30 degrees | flagged |
| a well's wavelet correlation with the average | below 0.8 | unlike the others |

For a well unlike the others the remedy is to leave it out of the field wavelet or to re-extract it.

## A designed disagreement

Ekene-3's wavelet is rotated by a stated phase before the comparison; the other three are as they are.

| well | rotated by 90 degrees: correlation with the average | rotated by 180 degrees (reversed polarity): correlation with the average |
| --- | --- | --- |
| Ekene-1 | 0.990887 | 0.971738 |
| Ekene-2 | 0.984498 | 0.960667 |
| Ekene-3 | 0.911984 | 0.693702 |
| Ekene-4 | 0.989492 | 0.972763 |

## Reading the case

At 90 degrees Ekene-3 scores 0.911984, still above the 0.8 rule, so the similarity rule passes a wavelet a quarter-turn out of phase. Reversed, it scores 0.693702 and falls below the rule.

In both cases the other three wells fall too. Unrotated, Ekene-1 scored 0.999838 against the average; with Ekene-3 rotated by 90 degrees it scores 0.990887, and with Ekene-3 reversed 0.971738. Ekene-2 and Ekene-4 drop the same way. The rotated wavelet has pulled the average towards itself, so every well now matches a wavelet that is partly wrong. A low figure on one well and slightly lower figures on all the others is the pattern of one well spoiling the mean.

## What each rule catches

The similarity rule catches a polarity reversal on one well. A 90-degree rotation passes it, and that is a phase problem the phase rule is there for: phases that span more than 30 degrees across wells are flagged, whatever their similarity. The tie correlation rules look at each well's synthetic against its trace, so they catch a tie that fails on its own even when the wavelets agree. A study runs all three.

## The remedy, and what it costs

Leaving the well out rebuilds the average from the remaining wells, which restores their figures. Re-extracting it, with another window or another trace, may bring it back into line. Either way the study names the well, the rule it broke and the step taken, because a field wavelet built from three wells of four is a different stated choice.

{{panel:qi-prestack-explorer}}

## Exercise

In the prestack explorer, set Data to "Ekene teaching pack" and View to "Wavelets across wells", with the trace window at 1100 to 1500 ms and Alignment search at 5 samples. Set Designed rotation to "Ekene-3 rotated by 90 degrees" and read every well's correlation with the average; then choose "Ekene-3 rotated by 180 degrees". Note which wells cross the 0.8 rule, and how far each of the other three falls from its unrotated figure. Then set View to "Wavelets and phase", read Best constant phase at each of the four wells, and say whether their span trips the 30 degree rule.
