# Ordering measures

{{panel:qr-alarp}}

An ALARP case usually weighs several measures, and they are considered in some order: the most effective first, or the cheapest per fatality prevented, or the one good practice expects. The engine weighs one measure per call. The order, and the choices behind each verdict, belong to the analyst. This lesson uses the EDIKAN firewall to show how much of a verdict comes from those choices, and what that means for ranking one measure against another.

## One measure, many verdicts

| convention | cost / benefit | verdict at DF 3 | ICAF |
| --- | --- | --- | --- |
| undiscounted | 8.750000 | GROSSLY_DISPROPORTIONATE | 8750000.00 |
| the 2003 checklist limits | 9.350247 | GROSSLY_DISPROPORTIONATE | 8026550.41 |
| R2P2 Appendix 3 | 9.328625 | GROSSLY_DISPROPORTIONATE | 7683740.15 |

The undiscounted DF sweep adds the other axis: GROSSLY_DISPROPORTIONATE at DF 1, 2, 3 and 5, and NOT_GROSSLY_DISPROPORTIONATE at DF 10. The verdict can turn on choices the analyst makes: the discounting convention, the DF, the VPF and its year. For the firewall the convention moves the ratio from 8.750000 to 9.350247, and the DF decides the verdict.

## Comparing measures on one footing

Measures can only be ordered on a common footing. The firewall's 8.750000 undiscounted and 9.350247 at the checklist limits describe the same measure, so a ratio computed under one convention says nothing about a second measure computed under another. An ALARP case therefore fixes one convention, one VPF with its year, and one DF for every measure it weighs, and ranks the measures by their cost to benefit ratios under those choices. It then shows the ranking at the other defensible choices, because a ranking that reverses under a neighbouring convention is a finding in itself.

## Ratio or ICAF

The two figures can rank differently. Discounting raises the firewall's ratio, from 8.750000 to 9.350247, and lowers its ICAF, from 8750000.00 to 8026550.41, because the ICAF counts the fatalities prevented undiscounted. A measure that prevents injuries as well as deaths looks better on its ratio than on its ICAF, because the ICAF leaves the injuries out. So an ordering names the figure it ranks by. The verdict is read from the ratio against the DF, and the ICAF sits beside the VPF of 1000000 as a comparison.

## What the engine leaves to the analyst

The engine does not know which measures exist, which ones good practice already requires, or which ones interact. The deltaPLL for each measure, and for any measures taken together, comes from rerunning the earlier tiers' arithmetic with the measure in place, and it reaches `costBenefit` as a stated input. The engine then weighs exactly what it is given, so the quality of an ordering rests on the quality of those stated reductions.

## Exercise

Take the firewall's ratio under the checklist limits, 9.350247, and its ICAF, 8026550.41, and set them beside the undiscounted 8.750000 and 8750000.00. Say which of the two figures rises under discounting and which falls, and why. Then write one sentence explaining why an ordering of measures must name both the figure and the convention it ranks by.
