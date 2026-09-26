import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D5 Professional m04, Field Extraction.
# Every figure is quoted from digest.txt: 30 labelled records, 6 fields, 180
# cells, both fixed systems' predictions, the four outcomes and the stated
# tolerance records. No capstone name, id, record or value appears.

q(0, "The Ekene extraction set has 30 labelled records over 6 fields, and system B returned predictions for 28 records. Over how many cells is B scored?",
 "180, as every labelled record is scored on every field",
 ["Only the 28 returned records, times 6 fields",
  "30, one cell per record with all six fields judged together as a unit",
  "175, the count of cells scored correct for system A on the same records"],
 "A cell is one field of one record, and every labelled record is scored on every field whether or not the system returned it, so 30 x 6 = 180 for both systems. A record with no prediction is scored as all empty. The record is never the unit, and 175 is A's correct count, an outcome tally.")

q(2, "System A puts 3.7 in water_cut_pct on the EKD-027 record, whose label for that field is empty. Which outcome does the cell get?",
 "Unsupported: the label is empty and the prediction has a value",
 ["Wrong: both sides are compared, and 3.7 differs from the empty label",
  "Missed: the label forgot the passage's water cut",
  "Correct: 3.7 is Ekene-6's real water cut, and a true figure matches"],
 "Wrong needs a value on both sides, and missed needs a label value with an empty prediction. The label is the key, so a value the passage does not give for that record is unsupported, whatever its source. The planted defect put Ekene-6's 3.7 percent on an Ekene-3 record.")

q(3, "System A leaves water_cut_pct empty on EKD-020, where the label is 0 because the passage says the well makes no water. What is the outcome?",
 "Missed, because a 0 label holds a value that the empty cell leaves out",
 ["Correct, since an empty cell and a zero both mean the well makes no water",
  "Unsupported, as the passage never writes a water cut digit",
  "Wrong, because an empty prediction falls outside absTol 0.05"],
 "The fixture's rule makes water_cut_pct 0 where the passage says the well makes no water, so the label holds a value. Empty is null, absent or a blank string, and 0 is none of those, so an empty prediction against it is missed. Unsupported runs the other way, label empty and prediction filled. Wrong needs a value on both sides; the tolerance is never reached.")

q(1, "System A writes \"near-miss\" for the event of EKD-044, which is labelled \"near miss\". What does the engine return?",
 "Wrong, with the reason: normalised \"nearmiss\" differs from \"near miss\"",
 ["Correct, since the hyphen is read as a space before the two are compared",
  "Missed, since \"near-miss\" is read as an identifier and dropped",
  "Unsupported, the label being read as empty once its hyphen goes"],
 "Text fields use SQuAD normalisation, which drops ASCII punctuation. Dropping the hyphen joins the two words into \"nearmiss\", and that differs from \"near miss\", so both sides hold a value and they do not match: wrong. The label has no hyphen, and identifiers belong to the groundedness claim grammar, which extraction never uses.")

q(0, "System B puts \"150 bopd\" in oil_rate_bopd for EKD-003, where the label is 150. What is the outcome?",
 "Wrong: \"150 bopd\" is not a plain number, whatever its value",
 ["Correct: the digits 150 are read and the unit after them is ignored",
  "Missed: a value the engine cannot read is scored as if it were empty",
  "Unsupported: the unit makes it a text value that the label does not hold"],
 "A number field accepts a number or a string of digits with optional comma thousands groups and a decimal part. \"150 bopd\" is neither, so the engine scores the cell wrong with the reason \"\\\"150 bopd\\\" is not a plain number (digits with optional comma thousands groups and a decimal part)\". Both sides hold a value, so the cell is neither missed nor unsupported.")

q(3, "System B writes 45.25 for the label 45.2 on EKD-032, where water_cut_pct has absTol 0.05. How is the cell scored?",
 "Correct, as the tolerance is inclusive and the difference sits on it",
 ["Wrong, since a difference equal to the tolerance lies outside it",
  "Wrong, since 45.25 carries a digit that the label does not have",
  "Unsupported, since a two-decimal figure has no match in a one-decimal label"],
 "The rule is |prediction - label| <= max(absTol, relTol x |label|), a less-than-or-equal. The difference sits on 0.05, and in double precision it computes just under 0.05, so the cell is correct. Numbers are compared as values, so an extra digit is no mismatch, and both sides hold a value, which rules out unsupported.")

q(2, "On EKD-033 the oil rate label is 64.6 and B predicts 64.7, against an absTol of 0.05. Which outcome follows?",
 "Wrong, with the reason \"64.7 differs from 64.6 by 0.10000000000000853, above the tolerance 0.05\"",
 ["Correct, since 64.7 and 64.6 agree to two significant figures",
  "Correct, since the tolerance is inclusive and the gap is small",
  "Missed, since a rate above its label reads as another event"],
 "The difference is just over twice the absTol of 0.05, so the cell is wrong. The long figure in the reason is the double-precision subtraction printed in full, and it belongs to the message. Inclusive means a difference equal to the tolerance matches, and this one is well above it. Significant figures play no part, and a filled prediction is never missed.")

q(1, "A stated field p has absTol 2 and relTol 0.001. For the label 3000 the prediction is \"3,003\"; for the label 1000 it is \"1002.5\". What are the outcomes?",
 "Correct for 3000, where the tolerance is 3; wrong for 1000, where it is 2",
 ["Wrong for both, since absTol 2 applies whatever the label is",
  "Correct for both, since relTol 0.001 is added on top of absTol 2",
  "Wrong for 3000, since the comma turns \"3,003\" into two numbers"],
 "The tolerance is max(absTol, relTol x |label|): for 3000 that is max(2, 3) = 3 and the difference 3 sits on it, correct; for 1000 it is max(2, 1) = 2 and the difference 2.5 is above it, wrong. The larger of the two applies, and they are never added. A comma followed by three digits is a thousands group, so \"3,003\" reads as three thousand and three.")

q(2, "System A's accuracy over the 180 cells is 0.972222 and its precision on filled cells 0.962264. Why is accuracy the higher of the two?",
 "73 of its 175 correct cells are correct only because both sides are empty",
 ["Accuracy applies each number field's tolerance, which precision does not use",
  "Precision counts the 2 records that system B failed to return against A",
  "Accuracy leaves the wrong cells out, while precision counts them twice"],
 "Accuracy is correct over all cells, and an empty prediction against an empty label is correct, which pads the count. Precision is correct filled cells over cells with a predicted value, so the empty-empty cells drop out. Both rates use the same outcomes and tolerances, B's missing records are B's alone, and each cell counts once.")

q(0, "System A's micro and macro accuracy both print 0.972222. What makes them equal?",
 "Each field has the same 30 cells, so the mean of the field rates is the pooled rate",
 ["They agree at six decimals by chance, the way the two F1 figures fail to",
  "The engine copies micro accuracy into macro whenever the fields are few",
  "All six fields have the same accuracy, so any average of them agrees"],
 "Every labelled record is scored on every field, so each field has 30 cells, and the mean of six rates over equal counts is the pooled rate: equal by construction. The course checked it, a difference of 1.11e-16 for A, the last bits of the arithmetic. Nothing is copied, and the fields differ: A's event field has 28 correct of 30, its well field 30.")

q(3, "System A's micro F1 is 0.966825 and its macro F1 0.942735. Which field pulls macro below micro?",
 "water_cut_pct, with few filled cells and an F1 of 0.800000",
 ["well, where a single wrong well name counts against every field",
  "oil_rate_bopd, where a number field's tolerance cuts its F1 in half",
  "reservoir_pressure_psia, whose missed cells count double in the macro mean"],
 "Macro F1 gives each field one vote. water_cut_pct holds A's planted missed zero and its wrong-well water cut among few filled cells, so its F1 of 0.800000 pulls the mean of the six down. A's well and oil_rate_bopd fields both score 1.000000, and A has no missed cell in reservoir_pressure_psia.")

q(1, "The first field passed to scoreExtraction is declared {\"name\": \"well\", \"type\": \"text\", \"absTol\": 1}. What happens?",
 "It is refused: \"fields[0].absTol applies to 'number' fields only\"",
 ["The tolerance is ignored and the text is compared after normalisation",
  "The well name is read as a number and matched within 1",
  "Every cell of the field is scored as unsupported, flagged by the tolerance"],
 "A tolerance belongs to a number field, so the engine refuses a tolerance on a text field and names the field by its position, in its own words. It does not ignore the input or reinterpret the field. An unsupported outcome depends on a cell's values; a declaration alone produces none.")

q(2, "A prediction arrives with the id r9, which has no labelled record. What does scoreExtraction do?",
 "Refuses the call: \"predictions[0].id is r9, which is not a labelled record\"",
 ["Scores r9's filled cells as unsupported, its label being empty",
  "Adds r9 to the records and scores every field as all empty",
  "Drops r9 quietly and scores the labelled records as usual"],
 "Labels are the key, and a prediction with no label has nothing to be scored against, so the engine refuses and names the id. The other direction is allowed: a labelled record with no prediction is scored as all empty, as B's EKD-053 and EKD-056 are. Nothing is dropped silently.")

q(0, "System B returned no prediction for EKD-053 or EKD-056. How do those records enter its tallies?",
 "As all empty: their 4 filled labels become missed cells, their empty labels correct",
 ["They are left out, so B is scored on its 28 returned records alone",
  "Every field of both records is counted as unsupported, since nothing in the predictions backs them",
  "They are refused, since every labelled record needs a prediction"],
 "A labelled record with no prediction is scored as all empty. On EKD-053 the date and event labels hold values, and on EKD-056 the well and event labels, so those 4 cells are missed, which is B's whole missed count; every empty label on the two records is correct. The cells stay in the 180, unsupported needs a filled prediction, and nothing is refused.")

q(1, "One field has no filled cell on either side, labels or predictions. What does the engine return for that field's F1, and what does macro F1 do with it?",
 "Null, and macro F1 averages only the fields whose F1 is not null",
 ["1.000000, since every cell of the field is correct with both sides empty",
  "0.000000, since precision and recall are both 0 on that field",
  "A refusal naming the field, since it holds nothing that can be scored"],
 "The basis: F1 is null when no cell of that field is filled on either side, and macroF1 is the mean of the per-field F1 that are not null, so a report says how many fields went into it. Accuracy would count those cells correct, but F1 is taken on filled cells, and with none there is no precision or recall to be 0. The call succeeds.")

emit(Q, '/root/dai-wip-appliedai/banks/d5i_m04.json', expect_n=15)
finish()
