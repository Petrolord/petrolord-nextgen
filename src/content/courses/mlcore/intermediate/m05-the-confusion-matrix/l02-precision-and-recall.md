# Precision and recall

{{panel:ml-validate-explorer}}

Accuracy mixes the two kinds of error. Precision and recall pull them apart. Each is a ratio of counts, computed for one label at a time.

## The two questions

For the pay label:

* Precision = TP / (TP + FP). Of the rows the model called pay, what fraction are pay? This is the question for whoever acts on the calls: if every row flagged pay is perforated, precision is the fraction of perforated rows that deserved it.
* Recall = TP / (TP + FN). Of the rows that are pay, what fraction did the model call pay? This is the question for whoever fears a missed zone: recall is the fraction of the real pay the model found.

The two denominators differ. Precision divides by a column of the matrix, everything predicted pay. Recall divides by a row, everything that is pay.

## The Ekene figures

On the 90 test rows of the pay split, at the one half threshold, the pay label has TP 24, FP 4 and FN 0:

| label | TP | FP | FN | support | precision | recall |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | 62 | 0 | 4 | 66 | 1.000000 | 0.939394 |
| 1 | 24 | 4 | 0 | 24 | 0.857143 | 1.000000 |

For pay, precision is 24 / (24 + 4) = 0.857143 and recall is 24 / 24 = 1.000000. The model found every pay row in the three test wells and paid for it with four false calls. Support is the number of rows whose true label is that label.

## Label 0 is a class too

The engine reports the same ratios for label 0, non-pay. In a binary report the two classes' rows are the same four counts read from each side. A false positive for pay is a false negative for non-pay: the 4 non-pay rows called pay appear as FN 4 on the label 0 row. So non-pay has perfect precision, 1.000000, because every row the model called non-pay was non-pay, and a recall of 0.939394, because 4 of its 66 rows were called pay.

Which label is "positive" is a choice of which row of the report to read. Quote a precision or a recall with its label every time: "precision of pay 0.857143" is a fact; "precision 0.857143" is ambiguous in a two-class report where the other precision is 1.000000.

## The trade between them

The two ratios pull against each other through the threshold. Lower the threshold and more rows are called pay: recall of pay can only stay or rise, and precision usually falls as more non-pay rows are swept in. Raise it and the reverse. The one half threshold is one point on that trade. On these test wells it sits at full recall of pay, so any higher threshold can only keep or lose pay rows, and any lower one can only add false calls or keep them.

Neither ratio is enough alone: calling every row pay gives a recall of pay of 1, whatever the precision.

## Exercise

Open the confusion matrix view. Type ten true labels with four 1s, and predicted labels that catch three of the four 1s and add two false 1s. Read the precision and recall of label 1 and of label 0, and check each against TP, FP and FN by hand. Then change one predicted 0 to 1 on a row whose true label is 0 and write down which of the four ratios moved.
