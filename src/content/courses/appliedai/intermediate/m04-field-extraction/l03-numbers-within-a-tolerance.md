# Numbers within a tolerance

{{panel:ae-scoring-explorer}}

Exact match could not tell that "45.0 percent" and "45 percent" are the same quantity. A number field can, because the engine reads the prediction as a number and compares it with the label within a stated tolerance.

## The rule

The engine prints it in its basis:

> the prediction is a number or a string of digits with optional comma thousands groups and a decimal part; it matches when |prediction - label| <= max(absTol, relTol x |label|)

Two tolerances can be stated on a field. absTol is a fixed amount in the field's units. relTol is a share of the label. The larger of the two applies. The comparison is less than or equal, so a difference exactly on the tolerance is a match.

## Four stated cells

The course states two fields, q with relTol 0.01 and p with absTol 2 and relTol 0.001:

| record | field | label | prediction | tolerance | difference | outcome |
| --- | --- | --- | --- | --- | --- | --- |
| r1 | q | 100 | `101` | 1 | 1 | correct |
| r1 | p | 3000 | `3,003` | 3 | 3 | correct |
| r2 | q | 50 | `50.6` | 0.5 | just over 0.6 | wrong |
| r2 | p | 1000 | `1002.5` | 2 | 2.5 | wrong |

On r1 both differences sit exactly on their tolerances, and both are correct: the tolerance is inclusive. On p the relative tolerance wins for the label 3000, where 0.001 of it is 3, and the absolute one wins for the label 1000, where 0.001 of it is less than 2. "3,003" is read as three thousand and three, because a comma followed by three digits is a thousands group.

## On the Ekene records

Three cells from the two systems show the rule at work. System A wrote "3,038" for the label 3038, and it is correct: the comma is a thousands group. System B wrote 45.25 for the label 45.2 on EKD-032, a difference that sits on the absTol of 0.05, and it is correct because the tolerance is inclusive. System B wrote 64.7 for the label 64.6 on EKD-033, and it is wrong. The engine's reason prints the difference as the computer holds it:

> 64.7 differs from 64.6 by 0.10000000000000853, above the tolerance 0.05

The difference is just over 0.1, twice the tolerance, and the cell is wrong. The long figure is the double-precision subtraction printed in full, and it belongs to the message.

## A unit inside a number

System B wrote "150 bopd" for the oil rate of EKD-003, where the label is 150. The value is right and the cell is wrong, because a string with a unit in it is not a plain number:

> "150 bopd" is not a plain number (digits with optional comma thousands groups and a decimal part)

The fix belongs in the system's output.

## Tolerances are stated inputs

A tolerance is part of the field, so it is checked like any other input. A negative relative tolerance is refused:

> fields[0].relTol must be a finite number, 0 or more

A label given as text in a number field is refused as well, because the label is the key and must be a number:

> labels[0].fields.rate must be a finite number or empty

## Exercise

Open the view for field extraction and replace the three inputs with your own. Declare one number field, `[{"name": "rate", "type": "number", "absTol": 0.5}]`, one label `[{"id": "r1", "fields": {"rate": 100}}]`, and predict "100.5". Run it, then try "100.6", "1,00.5" and "100.5 bopd". Predict each outcome before you run it. Finally set relTol to 0.01 on the field and run "100.6" again.
