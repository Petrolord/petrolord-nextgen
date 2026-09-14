# The priors your posteriors imply

The VOI Analyzer takes three sets of typed percents: the chance of each outcome, the chance of each indicator, and the chance of each outcome given each indicator. They describe one prospect only when the last two average back to the first.

{{panel:ec-judgement-explorer}}

## Averaging the posteriors back

The implied chance of an outcome is the chance of each indicator times the chance of the outcome given that indicator, summed over the indicators. The engine sets it beside the stated chance and calls the inputs consistent when every difference is within 0.005.

EKPAN's survey typed at full precision (Bright spot 46.000000 percent, success given Bright spot 64.673913 percent, success given No bright spot 9.722222 percent) averages back exactly:

0.460000 x 0.646739 + 0.540000 x 0.097222 = 0.297500 + 0.052500 = 0.350000

The two products are the joint chances Bayes builds from the likelihoods 0.850000 and 0.250000. The delta is 5.551115e-17, binary residue, and the gross voi reads 19.84.

## The published checks

| case | stated Success | implied Success | delta | consistent |
| --- | --- | --- | --- | --- |
| consistentFromBayes | 0.300000 | 0.300000 | 0.000000e+0 | true |
| inconsistent | 0.300000 | 0.420000 | 1.200000e-1 | false |
| missingPosteriorsCountAsZero | 0.300000 | 0.240000 | -6.000000e-2 | false |
| threeOutcomes | 0.200000 | 0.200000 | 0.000000e+0 | true |

The inconsistent case types posteriors describing a prospect that succeeds 0.420000 of the time against a stated 0.300000. In the missing posteriors case the implied chances, 0.240000 and 0.210000, do not even add to 1, because a posterior left out counts as zero.

## Why typed inputs can disagree

The engine's Bayes route starts from likelihoods, the chance of a reading given an outcome, and derives posteriors from the stated prior, so implied and stated priors agree by construction. The Decision Tree Builder works that way. The Analyzer takes posteriors as a person types them, and nothing ties them to the outcome chances typed two boxes earlier.

IRRI is the Analyzer's default study with both indicators typed as 20 / 80 percent. Every reading says success at 20 percent, so the average is 0.200000 whatever the indicator chances are, against a stated 0.300000.

## What the check does and refuses to do

On IRRI the repaired Analyzer reports consistent false and withheld true. It keeps EMV without information 15.00 and EVPI 63.00, the two cards that use only the stated outcome chances, and withholds EMV with information, the value of information, the net value and the diagram. EKPAN typed with indicators at 56 and 44 percent, posteriors unchanged, still sums to 100 and still fails: 75.75 and 52.00 survive, the rest is withheld.

The check never repairs. It does not say which set is wrong and does not rescale anything to fit. A pass says only that the three sets agree.

## The mistake

The careful mistake is to treat outcome chances and posteriors as independent best estimates: refreshing the posteriors from a new survey interpretation while the outcome chances stay at an older figure, or typing a likelihood such as 0.850000 into a posterior box. Together they describe two prospects, and any value computed from them measures the gap between those prospects as well as the survey.

## Exercise

Compute the implied success chance for EKPAN at full precision and for IRRI, and state each delta against the stated chance. Then name the two Analyzer cards that survive on IRRI and explain why those two do not depend on the indicator entries.
