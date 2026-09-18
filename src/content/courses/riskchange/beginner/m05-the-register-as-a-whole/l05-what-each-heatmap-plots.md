# What each heatmap plots

The four populations of the previous lesson are not a thought experiment. The Suite shows risk counts in more than one place, and each place makes its own two choices. Reading any of them correctly starts with knowing which population it plots.

{{panel:rc-risk-explorer}}

## Three surfaces

| surface | which risks | which score |
| --- | --- | --- |
| Risk Register dashboard | "Open" and "Under Review" risks | inherent |
| Heatmap tab | the four live statuses | inherent |
| Assurance hub | live risks, through countByBand | not stated here |

The Risk Register dashboard counts Open and Under Review risks and plots them INHERENT. The Heatmap tab plots the four live statuses INHERENT. The Assurance hub counts live risks through countByBand.

## The Heatmap tab

The Heatmap tab's population is exactly one of the four rows the engine printed: live risks, inherent.

| population | "Critical" | "High" | "Medium" | "Low" | "None" |
| --- | --- | --- | --- | --- | --- |
| live risks, inherent | 4 | 3 | 2 | 0 | 1 |

On the OBODO register it holds the 10 live risks, and its Critical count is 4: OB-01, OB-02, OB-03 and OB-08.

## The dashboard

The dashboard's population is narrower. It takes "Open" and "Under Review" and leaves out the other two live statuses, "Mitigated" and "Realized". On the OBODO register that leaves out OB-04, which is "Mitigated", and OB-07, which is "Realized". Both are live risks that the Heatmap tab plots and the dashboard does not.

This course does not print the dashboard's band counts for the OBODO register, so it does not quote them. What it can say is which risks the two populations differ by: OB-04 and OB-07. Any difference between the two heatmaps on this register comes from those two risks.

## The two heatmaps disagree

Two heatmaps of the same register, built on two different populations, can show different numbers in the same cell. The recon behind this course records the two heatmaps disagreeing as a finding. Neither is miscounting. Each is counting the list it was given, and the lists differ by status.

The practical lesson is the one from the previous lesson, applied to real screens. Before comparing two counts, find out which risks each was handed and which score each counts. A heatmap without that information is a picture of an unstated question.

## The hub

The Assurance hub counts live risks through countByBand. This course's source does not state which score the hub counts, inherent or residual, so this lesson does not say. Check the hub's own label before comparing it with either heatmap.

## The mistake

The mistake is to treat "the heatmap" as one thing. There are two in the Risk Register alone, plotting different populations. A "Mitigated" risk appears on one and not the other, which is exactly the kind of risk a reader is most likely to forget is still carried.

## Exercise

Record which statuses and which score the dashboard and the Heatmap tab each plot. Record the Heatmap tab's population's Critical count on the OBODO register and name the risks in it. Name the OBODO risks that the Heatmap tab includes and the dashboard leaves out, and state the rule that explains why.
