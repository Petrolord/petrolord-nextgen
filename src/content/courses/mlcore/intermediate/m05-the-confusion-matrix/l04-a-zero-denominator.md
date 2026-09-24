# A zero denominator

{{panel:ml-validate-explorer}}

Precision divides by the number of rows predicted as a label. If the model never predicts that label, the denominator is zero and the precision is 0 / 0, which has no value. Recall has the same problem for a label that never occurs in the truth. A report still has to print something in that cell.

## What the engine does

The engine scores an undefined ratio with a stated value, `zeroDivision`, which is 0 by default and may be set to 1. It also lists every ratio it scored that way in `undefinedRatios`, so a reader can see which cells are a convention and which are counts. Its basis says, in its own words: "a zero denominator scores 0 (scikit-learn zero_division = 0)". Any other value is refused by name:

> zeroDivision must be 0 or 1

## The engine's own case

Four samples with three facies labels, a model that calls everything sand:

* true labels: sand, shale, sand, lime
* predicted labels: sand, sand, sand, sand

Sand is predicted four times and is right twice, so the precision of sand is 2 of 4, 0.5. Shale and lime are never predicted, so their precisions are 0 / 0.

| zeroDivision | ratios scored zeroDivision | macro precision | macro F1 |
| --- | --- | --- | --- |
| 0 | precision of "lime"; precision of "shale" | 0.166667 | 0.222222 |
| 1 | precision of "lime"; precision of "shale" | 0.833333 | 0.222222 |

With zeroDivision 0 the macro precision is the mean of 0.5, 0 and 0, which is 0.166667. With zeroDivision 1 it is the mean of 0.5, 1 and 1, which is 0.833333. The same model and the same four rows give two different macro precisions, and nothing about the model changed. The choice moves the macro average, so a report states it.

## Why the macro F1 did not move

Look at the last column: 0.222222 both times. The engine's F1 is 2TP / (2TP + FP + FN), and it divides by zero only when TP, FP and FN are all zero, which means the label never occurs and is never predicted. Shale and lime each occur once and are missed once, so each has FN 1 and an F1 of 0 by the count formula, with no convention needed. The macro F1 is sand's F1 and two zeros, over three.

## Only when a denominator is zero

The convention is used only when a denominator is 0, and nowhere else. The engine's boundary case: true labels 0, 1, 1 against predicted labels 0, 1, 0. Every label is predicted at least once and occurs at least once, so 0 ratios are scored zeroDivision and `undefinedRatios` is empty. A ratio that is merely small, such as a precision of 0 from a label predicted and always wrong, is a count and is printed as 0 whatever the setting.

## What to write in a report

State the zeroDivision you used and list the undefined ratios. For a label the model never predicts, say so in words: that says more than either 0 or 1 in the precision column.

## Exercise

Open the confusion matrix view. Type the true labels sand, shale, sand, lime and the predicted labels sand, sand, sand, sand. Read the undefined ratios and the macro precision with zeroDivision 0, then switch it to 1 and read them again. Then change the last predicted label to lime and write down which undefined ratios remain and why.
