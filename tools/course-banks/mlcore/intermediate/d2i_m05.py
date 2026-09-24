import sys, os; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D2 Professional m05, the confusion matrix and its ratios.
# Every figure is the course's confusion matrix and report on the 90 pay test
# rows at the 0.5 threshold, and the engine's own zero-denominator and
# boundary cases. No capstone field, well, stated input or graded answer appears.

q(2, "In the engine's confusion matrix for the pay test wells, what does the cell in row true 0, column predicted 1 count?",
 "4 non-pay rows the model called pay, the false positives.",
 ["4 pay rows the model missed.",
  "62 non-pay rows called non-pay, the true negatives of pay.",
  "0 pay rows called non-pay, the count of missed pay in the report."],
 "The engine's layout, in its own words: \"matrix[i][j] counts rows whose TRUE label is labels[i] and PREDICTED label is labels[j] (scikit-learn layout)\". Row true 0, column predicted 1 holds the 4 non-pay rows called pay. There are 0 false negatives, and the 62 true negatives sit on the diagonal.")

q(0, "What is the precision of pay on the 90 test rows?",
 "0.857143, which is 24 / (24 + 4)",
 ["1.000000, which is 24 / (24 + 0)",
  "0.939394, which is 62 / (62 + 4)",
  "0.955556, the rows on the diagonal over all 90"],
 "Precision of pay is TP / (TP + FP): of the 28 rows called pay, 24 are pay. 24 / 24 is the recall of pay, 62 / 66 is the recall of non-pay, and 0.955556 is the accuracy.")

q(3, "What is the recall of pay on the test wells, and what does it say?",
 "1.000000: all 24 pay rows were called pay.",
 ["0.857143: of the rows called pay, that share are pay.",
  "0.939394, because four of the pay rows were missed.",
  "0.923077, the F1 of pay."],
 "Recall of pay is TP / (TP + FN) = 24 / (24 + 0): the model found every pay row in the three test wells and paid for it with 4 false calls. 0.857143 is the precision of pay, 0.939394 is the recall of non-pay (no pay row was missed), and 0.923077 is the F1 of pay.")

q(1, "Label 0, non-pay, has precision 1.000000 and recall 0.939394. Why?",
 "Every row called non-pay was non-pay, and 4 of its 66 rows were called pay.",
 ["Non-pay rows outnumber pay rows 66 to 24, and a precision rises with support.",
  "Four pay rows called non-pay lower its recall; its precision counts true negatives only.",
  "Label 0 is the negative class, so the engine holds its precision at exactly 1."],
 "Read from the non-pay side, the same four counts give TP 62, FP 0 and FN 4: the 4 non-pay rows called pay are pay's false positives and non-pay's false negatives. So precision is 62 / 62 and recall 62 / 66. Support does not enter a precision, no pay row was called non-pay, and the engine computes label 0 like any other label.")

q(0, "Which figure is the F1 of pay on the test wells?",
 "0.923077, from 2 x 24 / (2 x 24 + 4 + 0)",
 ["0.945913, the macro F1 over both of the labels",
  "0.956571, the F1 weighted by support",
  "0.968750, the F1 of the non-pay label"],
 "F1 of pay is 2TP / (2TP + FP + FN) with TP 24, FP 4 and FN 0: 0.923077. The macro F1, 0.945913, is the plain mean of the two labels' F1, the weighted F1, 0.956571, weights them by support, and 0.968750 is the F1 of non-pay. Three different numbers carry the same two letters in one report.")

q(2, "How does the engine compute F1 for a label?",
 "As 2TP / (2TP + FP + FN), equal to the harmonic mean wherever precision and recall are both defined.",
 ["As the arithmetic mean of the two ratios, (precision + recall) / 2, for every label in the report.",
  "As TP / (TP + FP + FN), the share of rows touched by that label which the model got right.",
  "By weighting the accuracy of the report by the label's support and dividing by the rows."],
 "The basis reads, in the engine's own words: \"2TP / (2TP + FP + FN), the harmonic mean of precision and recall where both are defined\". The count formula is also defined when one ratio is 0 / 0. The arithmetic mean does not punish imbalance, TP / (TP + FP + FN) drops the factor of two, and support enters only the weighted average.")

q(3, "What are the macro and weighted precision on the pay test wells?",
 "Macro 0.928571; weighted 0.961905.",
 ["Macro 0.961905; weighted 0.928571.",
  "Macro 0.945913; weighted 0.956571.",
  "Macro 0.969697; weighted 0.955556."],
 "The macro precision is the plain mean of 1.000000 and 0.857143, 0.928571; the weighted precision gives non-pay 66 of 90 votes and reads 0.961905. The swapped pair reverses them, 0.945913 and 0.956571 are the macro and weighted F1, and 0.969697 and 0.955556 are the macro and weighted recall.")

q(1, "The weighted recall and the accuracy both read 0.955556 on the test wells. How are they related?",
 "As an identity: weighting each recall TP / support by its support leaves total TP over n, which is accuracy.",
 ["By coincidence on these three test wells, and on most other data the two would differ.",
  "They print alike at six decimals and part company further along, as printed figures do.",
  "Both are the recall of pay scaled by the share of pay rows among the 90 test rows."],
 "Each label's recall is TP over its support, so weighting by support and dividing by n cancels the supports and leaves the sum of TP over n, the accuracy. The engine computes the two and asserts a difference of 0, and the identity holds for any labels. The recall of pay here is 1.000000, which scaled by the pay share is far from 0.955556.")

q(2, "A model predicts sand for four rows whose true labels are sand, shale, sand and lime. With zeroDivision 0, what is the macro precision?",
 "0.166667, the mean of 0.5, 0 and 0",
 ["0.833333, the mean of 0.5, 1 and 1",
  "0.222222, the macro F1 of the four rows",
  "0.5, the precision of sand on its own"],
 "Sand is predicted four times and right twice, a precision of 0.5; shale and lime are never predicted, so their precisions are 0 / 0 and are scored zeroDivision, 0, and listed in `undefinedRatios`. The mean of 0.5, 0 and 0 is 0.166667. With zeroDivision 1 it would be 0.833333, and 0.222222 is the macro F1.")

q(0, "In the same four-row sand case, switching zeroDivision from 0 to 1 leaves the macro F1 at 0.222222. Why?",
 "Shale and lime each occur once and are missed once, so FN 1 gives each an F1 of 0 by counts.",
 ["The engine applies zeroDivision to precision and never to a recall or an F1, whatever happens.",
  "Macro F1 weights labels by support, and shale and lime carry too little weight to move it.",
  "An F1 ignores the precision of a label whenever its recall is zero, so the setting is skipped."],
 "F1 = 2TP / (2TP + FP + FN) divides by zero only when a label never occurs and is never predicted. Shale and lime each have FN 1, so each F1 is 0 by the count formula with no convention needed, and the macro F1 is sand's F1 and two zeros over three. zeroDivision applies wherever a denominator is 0, macro averages give each label one vote, and F1 uses the counts.")

q(1, "True labels 0, 1, 1 against predicted labels 0, 1, 0. How many ratios does the engine score with zeroDivision?",
 "None: every label is predicted and occurs, so no denominator is zero.",
 ["One, the recall of label 1, since it reads only one half of its rows.",
  "Two, the precisions, since the setting always applies.",
  "Three, one for each ratio of the label that is missed."],
 "The convention is used only when a denominator is 0, and here each label is predicted at least once and occurs at least once, so `undefinedRatios` is empty. A ratio that is small is still a count and is printed as it is, whatever the setting.")

q(3, "A caller passes zeroDivision 0.5 to `classificationReport`. What happens?",
 "A refusal naming `zeroDivision`: \"zeroDivision must be 0 or 1\".",
 ["Undefined ratios are scored one half, splitting the difference.",
  "It is rounded down to 0, the default setting, and the report runs.",
  "Every ratio in the report is multiplied by 0.5 before averaging."],
 "zeroDivision takes 0 or 1, and any other value is refused by name in the engine's own words: \"zeroDivision must be 0 or 1\". A refusal returns no report, rounds nothing and scales nothing.")

q(0, "The pay matrix's column sums are 62 and 28. What does the 28 count?",
 "The rows the model called pay, TP + FP for the pay label.",
 ["The pay rows in the test wells, the support of label 1.",
  "Rows the model got wrong, its false positives and negatives.",
  "Pay rows of the seven training wells that the model was fitted on."],
 "Columns are what the model called: 24 + 4 = 28 rows called pay, the denominator of the precision of pay. The row sums are the supports, 66 and 24, the model got 4 rows wrong, and the 70 training pay rows are outside the test matrix.")

q(2, "Why must a report state the layout of its confusion matrix?",
 "With truth on the columns the off-diagonal cells swap, and 4 false positives read as 4 missed pay rows.",
 ["The engine transposes its matrix whenever the labels arrive as text, so the layout varies by call.",
  "Swapping the layout changes the count of true positives and the accuracy computed from it.",
  "Rows and columns carry different totals, so only one layout can sum to the 90 test rows."],
 "Some tools put the prediction on the rows. The four numbers are the same, the diagonal is the same, and the accuracy is the same, but the off-diagonal cells change places, so a reader who assumes the wrong layout swaps false positives and false negatives. The engine keeps rows true and columns predicted for any labels, and both layouts sum to 90.")

q(1, "With 66 of the 90 test rows non-pay, what does a rule that calls every row non-pay score?",
 "It is right on 66 rows and finds none of the pay, which accuracy alone hides.",
 ["An accuracy of 0.955556, exactly the same figure as the fitted logistic model.",
  "A recall of pay of 1, because no pay row is ever wrongly called pay.",
  "Nothing at all, since the engine refuses a report with one predicted label."],
 "Accuracy counts the diagonal, so a rule that never calls pay is right on every non-pay row, 66 of 90, while its recall of pay is 0. That is why the ratios by label are read beside accuracy. The fitted model's accuracy, 0.955556, comes from 62 correct non-pay calls and 24 correct pay calls, and the engine reports a label that is never predicted with its precision scored zeroDivision.")

emit(Q, '/root/dai-wip-mlcore/banks/d2i_m05.json', expect_n=15)
finish()
