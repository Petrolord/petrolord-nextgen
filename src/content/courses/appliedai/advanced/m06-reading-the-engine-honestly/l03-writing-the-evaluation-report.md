# Writing the evaluation report

{{panel:ae-trust-explorer}}

{{panel:ae-scoring-explorer}}

A figure without its settings cannot be reproduced, and a comparison without its uncertainty cannot be trusted. This lesson puts the course into one checklist and one worked paragraph.

## What the report names

An evaluation report names:

- the corpus and its size;
- the queries and how their judgments were pooled, the threshold and the gain;
- each system's retriever and its settings: method, k, k1, b, stop list;
- every metric with its cutoff, and the queries excluded and why;
- the unjudged passages each system retrieved;
- the answer scores, exact match and token F1, and the groundedness figures with numericRelTol and whether the retrieved lists were used;
- the comparison with its seed, replicate count, level and whether it was paired;
- annotator agreement;
- for a probability, the Brier score, ECE and MCE with the bin count and the edge rule.

Every item is there because a figure in this course moved when it changed: the threshold, the key, the bin count and the seed each moved one.

## A worked paragraph on the Ekene set

The retrieval half of such a report, from the course's own figures:

The corpus is the synthetic Ekene document set, 60 passages. 24 queries were judged on a four-grade scale by pooling the top 5 of both systems, 183 judged pairs; relevant means grade 1 or more, and nDCG uses linear gain. System A retrieves by BM25 (k 5, k1 1.2, b 0.75, stop list off) and system B by TF-IDF (k 5, stop list off). Q24 has no relevant passage and is excluded from every mean, so each mean is over 23 queries. At k 5, system A's MAP is 0.600278 and system B's 0.593007; mean nDCG is 0.762753 and 0.764137. Neither retrieved an unjudged passage. The paired bootstrap of the nDCG difference, A minus B, on seed 7 with 2000 replicates at level 0.95, gives -0.001384 with an interval from -0.068015 to 0.058726. The two annotators' unweighted kappa is 0.579841, and on the second annotator's grades the order of the systems on nDCG reverses. On this judged set the two systems cannot be told apart.

The last sentence is the finding. A report that said only "system B scores higher on nDCG" would have been true to six decimals and wrong as a conclusion.

## The answer and probability halves

The answer half follows the same pattern: exact matches of 24 with the normalisation named, mean token F1, and the pooled supported fraction with numericRelTol 0 and the retrieved lists used, each system's unsupported claims listed with the engine's reasons. The probability half gives the Brier score 0.168382, and ECE 0.209300 and MCE 0.723333 at 10 bins, an interior edge opening the upper bin, with log loss 0.503184 and its clipped count beside them.

## Exercise

Open the scoring explorer on "MAP and nDCG over a set of queries" and on "Two systems and the paired bootstrap", and the trust explorer on "Cohen's kappa" and "Calibration: Brier, reliability table, ECE and MCE". Confirm every figure the worked paragraph quotes. Then rewrite the paragraph at grade 2 or more: rerun system A's runs at relevantGrade 2, read its MAP and mean nDCG, set them beside system B's MAP at grade 2, 0.771014, and state which conclusion changed and which held.
