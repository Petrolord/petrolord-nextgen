# Micro and macro averages

{{panel:ae-scoring-explorer}}

The engine scores every cell of every field, and a report usually wants one figure for the whole extraction. There are two honest ways to get it. Micro pools every cell of every field into one count and computes the rate once. Macro computes the rate field by field and takes the mean of the fields. The engine returns both, and on this set they agree for accuracy and disagree for F1.

## The rule

The engine prints the F1 half of its basis:

> f1 = 2 precision recall / (precision + recall) on filled cells, a missing precision or recall counting as 0, and 0 when both are 0; null when no cell of that field is filled on either side; microF1 pools every cell, macroF1 is the mean of the per-field f1 that are not null

## Field by field

| field | type | A correct | A wrong | A missed | A unsupported | A F1 | B F1 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| well | text | 30 | 0 | 0 | 0 | 1.000000 | 0.857143 |
| date | text | 30 | 0 | 0 | 0 | 1.000000 | 0.947368 |
| event | text | 28 | 2 | 0 | 0 | 0.933333 | 0.931034 |
| oil_rate_bopd | number | 30 | 0 | 0 | 0 | 1.000000 | 0.857143 |
| water_cut_pct | number | 28 | 0 | 1 | 1 | 0.800000 | 0.769231 |
| reservoir_pressure_psia | number | 29 | 0 | 0 | 1 | 0.923077 | 0.833333 |

System A's weakest field is water_cut_pct, where the planted missed zero and the planted wrong-well water cut both land. Its F1 of 0.800000 is low because the field has few filled cells, so two mistakes weigh a lot.

## Micro and macro, side by side

| figure | system A | system B |
| --- | --- | --- |
| micro accuracy | 0.972222 | 0.916667 |
| macro accuracy | 0.972222 | 0.916667 |
| micro F1 | 0.966825 | 0.895238 |
| macro F1 | 0.942735 | 0.865875 |

Accuracy counts every cell, and every labelled record is scored on every field, so each field has the same 30 cells. The mean of six rates over equal counts is the pooled rate, and macro accuracy equals micro accuracy by construction. The course checked both systems; the two figures differ only in the last bits of the arithmetic, by 1.11e-16 for A and 2.22e-16 for B.

F1 counts filled cells, and the number of filled cells differs from field to field. Micro F1 lets the fields with many filled cells dominate. Macro F1 gives each field one vote, however few cells it has. For system A the small water_cut_pct field, at 0.800000, pulls macro F1 down to 0.942735 against a micro F1 of 0.966825.

## Which one to report

Neither is wrong. Micro answers "of all the values in these records, how many were extracted right". Macro answers "how well does the system do on a typical field", and it will not let a rare field hide. A reader who needs the water cut cares about macro. A reader totting up every value cares about micro. Report both, name each, and read the per-field table before trusting either.

A field that no cell fills on either side has no F1, and the engine returns it as null. Macro F1 averages the fields that have one, so a report says how many fields went into it.

## Exercise

Open the view for field extraction with its default inputs: the six fields, the first eight labelled records and system B's predictions for them. None of those eight records has a water cut on either side, so read what the per-field table shows for water_cut_pct and how many fields the macro F1 tile can average. Then add `"water_cut_pct": 5` to the fields of one prediction. Run it, find the new unsupported cell, and read the water_cut_pct F1 and both F1 tiles again. Say which of micro F1 and macro F1 moved more, and why one cell could move it so far.
