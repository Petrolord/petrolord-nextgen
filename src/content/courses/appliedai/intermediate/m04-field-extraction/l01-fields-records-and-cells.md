# Fields, records and cells

{{panel:ae-scoring-explorer}}

A short answer is one string per query. A copilot can also be asked to read a daily note and fill in a form. Which well, which date, what happened, what rate, what water cut, what pressure. That is field extraction, and it is scored field by field against a labelled record. This module scores it, and this lesson sets up the three words the rest of it uses.

## Fields

A field is one named slot with a type. The Ekene extraction set has 6:

| field | type | absTol |
| --- | --- | --- |
| well | text | none |
| date | text | none |
| event | text | none |
| oil_rate_bopd | number | 0.05 |
| water_cut_pct | number | 0.05 |
| reservoir_pressure_psia | number | 0.5 |

A text field is compared with the SQuAD normalisation of the last module. A number field is compared as a number, within a tolerance the field states. The engine offers exactly these two types, and it refuses any other by the position of the field:

> fields[0].type must be 'text' or 'number'

A tolerance belongs to a number field only. Put one on a text field and the engine refuses it:

> fields[0].absTol applies to 'number' fields only

## Records

A record is one source passage's labels: the value of each field that the passage states. The Ekene set has 30 labelled records, one per source passage, and the record id is the passage id. The fixture states its labelling rules: a field is empty where the passage does not state it for that record, water_cut_pct is 0 where the passage says the well makes no water, and reservoir_pressure_psia holds the static reservoir pressure only, so a wellhead pressure does not belong in it.

Each system returned predictions in the same shape. System A returned 30 records and system B 28.

## Cells

A cell is one field of one record, and the cell is the unit that is scored. 30 records times 6 fields is 180 cells, and every labelled record is scored on every field, whether or not the system returned it. A record the system did not return is scored as all empty.

The engine checks that a prediction lines up with the labels before it scores anything. A prediction for a record that has no label is refused, because there is nothing to score it against:

> predictions[0].id is r9, which is not a labelled record

A prediction that fills a field the call did not declare is refused the same way:

> predictions[0].fields.choke is not one of the fields

## Exercise

Open the scoring explorer on the view for field extraction. It starts with the six Ekene fields, the first eight labelled records and system B's predictions for them. Count the cells the view scores and check the count against the per-field table. Then change the type of the first field to "date" and read the refusal. Put it back, add `"absTol": 1` to the well field, and read that refusal. Finally change the id of the first prediction to one that has no label and read the third.
