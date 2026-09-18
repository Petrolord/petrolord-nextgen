# What each heatmap plots

The four populations of the previous lesson are not a thought experiment. The Suite shows risk counts in more than one place, and each place makes its own two choices. Reading any of them correctly starts with knowing which population it plots.

{{panel:rc-risk-explorer}}

## Three surfaces

| surface | which risks | which score |
| --- | --- | --- |
| Risk Register dashboard | "Open" and "Under Review" risks | inherent |
| Heatmap tab | the four live statuses | inherent |
| Assurance hub | live risks, through countByBand | inherent and residual, both shown |

The Risk Register dashboard counts Open and Under Review risks and plots them INHERENT. The Heatmap tab plots the four live statuses INHERENT. The Assurance hub counts live risks through countByBand, twice.

## The Heatmap tab

The Heatmap tab's population is exactly one of the four rows the engine printed: live risks, inherent.

| population | "Critical" | "High" | "Medium" | "Low" | "None" |
| --- | --- | --- | --- | --- | --- |
| live risks, inherent | 4 | 3 | 2 | 0 | 1 |

On the OBODO register it holds the 10 live risks, and its Critical count is 4: OB-01, OB-02, OB-03 and OB-08.

## The dashboard

The dashboard's population is narrower. It takes "Open" and "Under Review" and leaves out the other two live statuses, "Mitigated" and "Realized". On the OBODO register that leaves out OB-04, which is "Mitigated", and OB-07, which is "Realized". Both are live risks that the Heatmap tab plots and the dashboard does not.

On the OBODO register the dashboard population is 8 risks: OB-01, OB-02, OB-03, OB-05, OB-06, OB-08, OB-11 and OB-12. Counted inherent, it reads "Critical" 4, "High" 1, "Medium" 2, "Low" 0 and "None" 1.

Set that beside the Heatmap tab's row. "Critical", "Medium", "Low" and "None" agree. "High" reads 3 on the Heatmap tab and 1 on the dashboard, and the arithmetic is the two risks the dashboard leaves out: OB-04 and OB-07 both carry an inherent band of "High", and 3 minus 2 is 1.

## The two heatmaps disagree

Two heatmaps of the same register, built on two different populations, can show different numbers in the same cell. The recon behind this course records the two heatmaps disagreeing as a finding. Neither is miscounting. Each is counting the list it was given, and the lists differ by status.

The practical lesson is the one from the previous lesson, applied to real screens. Before comparing two counts, find out which risks each was handed and which score each counts. A heatmap without that information is a picture of an unstated question.

## The hub

The Assurance hub calls countByBand twice over the live risks, once inherent and once residual, and shows both. On OBODO that is "Critical" 4 inherent and 1 residual, the two live rows of the four populations. The hub's inherent count is the Heatmap tab's population; its residual count is a question neither heatmap asks.

## The mistake

The mistake is to treat "the heatmap" as one thing. There are two in the Risk Register alone, plotting different populations. A "Mitigated" risk appears on one and not the other, which is exactly the kind of risk a reader is most likely to forget is still carried.

## Exercise

Record which statuses and which score the dashboard and the Heatmap tab each plot. Record the Critical and High counts of the dashboard and of the Heatmap tab on the OBODO register, and the two Critical counts the hub shows. Name the OBODO risks that the Heatmap tab includes and the dashboard leaves out, and state the rule that explains why.
