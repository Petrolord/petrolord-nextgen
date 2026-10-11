# How far impedance and Vp/Vs move

Substitution produces a brine log beside the in situ log for every oil-leg sample. The feasibility question compresses it to two figures: how far the oil moves AI (acoustic impedance, Vp times density) and how far it moves Vp/Vs. Both rows sit in the verdict.

## Sample by sample

| depth ft | AI in situ | AI brine | Vp/Vs in situ | Vp/Vs brine |
| --- | --- | --- | --- | --- |
| 5082.000000 | 5718680.865100 | 6406068.354736 | 1.821244 | 2.026043 |
| 5087.000000 | 6269272.385300 | 6847209.894684 | 1.733327 | 1.879614 |
| 5091.000000 | 6508877.856000 | 7091530.763147 | 1.692201 | 1.831460 |
| 5095.000000 | 6657833.108800 | 7232047.957293 | 1.683340 | 1.818147 |
| 5099.000000 | 6132273.356900 | 6708678.392395 | 1.839545 | 2.001612 |
| 5103.000000 | 6569803.508800 | 7117224.076160 | 1.753821 | 1.891129 |
| 5110.000000 | 6876631.854600 | 7324973.338620 | 1.750560 | 1.858685 |
| 5114.000000 | 7350603.656600 | 7660571.567728 | 1.746495 | 1.816325 |

AI is in kg/(m2 s). Both properties rise at every tabled sample when brine replaces the oil: Vp rises and density rises, so AI rises; Vp rises while Vs falls a little, so Vp/Vs rises too. The deepest sample, nearest the contact and wettest, moves least.

## The means over the leg

Each figure below is the mean of the 65 sample values:

| quantity | in situ (oil) | substituted to brine | change, percent |
| --- | --- | --- | --- |
| AI kg/(m2 s) | 6641244.924742 | 7136467.682134 | 7.456776 |
| Vp/Vs | 1.752075 | 1.877221 | 7.142745 |

Taking the leg to brine raises its mean AI by 7.456776 percent of the in situ figure, and its mean Vp/Vs by 7.142745 percent. These are the fluid effect alone: the same rock, the same porosity, the same clay, with only the pore fluid changed.

## Against the water leg

The measured water leg reads a mean-of-layer AI of 7358819.677147 kg/(m2 s) and a Vp/Vs of 1.827552. Its AI is higher than the substituted oil leg's, and its Vp/Vs is lower. The water leg and the oil leg are different rock: the water leg is the cleaner sand, with mean Vsh 0.117854 against the oil leg's 0.178134, and a lower mean porosity, 0.197677 against 0.203626. So the water-leg figures carry the fluid difference plus a rock difference, and the substituted figures carry the fluid difference alone. A study that compared the two legs directly would be reading clay and porosity as fluid.

Two kinds of mean appear in this tier and a study says which it reports. The figures above average each sample's AI and Vp/Vs. The elastic set averages Vp, Vs and density first and computes AI from the means, which gives 6639018.603084 kg/(m2 s) for the oil leg in situ against 6641244.924742 here.

## What the two percentages mean

Both changes are the size of the fluid signal the seismic would have to see, and each rests on stated inputs: the conditions that set the two fluids, the quartz and clay moduli, the kit's PHIT, Vsh and Sw, and the net sand cut-off that picks the 65 samples. A fluid that moved neither would leave nothing to detect whatever the data quality. Here the oil moves both by similar fractions. Whether that move takes the top of the sand off the wet background is a separate test, made on the crossplot of intercept and gradient.

{{panel:qi-feasibility-explorer}}

## Exercise

In the feasibility explorer, set View to "Fluids and substitution" and Data to "Ekene pack: Ekene-1". Read the four "Mean" tiles and check them against the table above. Lower "Net sand Vsh cut-off (stated)" so the shaliest oil-leg samples drop out, and record which way the two means move. Restore 0.350000. Then switch Data to Ekene-3 and say whether the oil there moves AI by more or less than at Ekene-1.
