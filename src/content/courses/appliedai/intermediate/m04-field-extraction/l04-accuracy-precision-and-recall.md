# Accuracy, precision and recall on cells

{{panel:ae-scoring-explorer}}

Once every cell has an outcome, the counts are turned into rates. The engine returns three kinds, and each has its own denominator. In this course "accuracy" always names its denominator.

## Three rates, three denominators

The engine's basis states each:

> correct / cells; microAccuracy pools every cell, macroAccuracy is the mean of the per-field accuracies (every labelled record is scored on every field, so the two are equal)

> correct filled cells / cells with a predicted value (wrong, unsupported and correct filled)

> correct filled cells / cells with a label value (wrong, missed and correct filled)

The first is accuracy over cells. The second is precision on filled cells: of the cells the system filled, how many were right. The third is recall on filled cells: of the cells the label filled, how many the system got right.

## The two systems

| over the 180 cells | system A | system B |
| --- | --- | --- |
| correct | 175 | 165 |
| of which both empty | 73 | 71 |
| accuracy over cells | 0.972222 | 0.916667 |
| precision on filled cells | 0.962264 | 0.895238 |
| recall on filled cells | 0.971429 | 0.895238 |

## Why empty cells inflate accuracy

A passage states only some of the six fields. A system that returns nothing for a field the passage does not mention is correct on that cell, and on this set 73 of system A's 175 correct cells are of that kind. The course states it plainly: accuracy is inflated by empty cells. A blank prediction is right on every cell whose label is empty, so accuracy over cells rewards silence on the fields a passage does not state.

Precision and recall count filled cells only, and that is why they sit beside accuracy. System A's precision says that of the values it wrote, 0.962264 were right. Its recall says that of the values the labels hold, it found 0.971429. Neither counts the empty-empty cells, and a system that left everything blank would have a recall of 0.

## Reading the gap between the systems

On accuracy over cells, system B trails A by a few hundredths: 0.916667 against 0.972222. On precision on filled cells the gap is wider, 0.895238 against 0.962264, because B's mistakes are all among the filled cells, where precision is counted, and the empty-empty cells that pad accuracy are removed. B's precision and recall are equal on this set: it made as many filled mistakes on the prediction side as on the label side.

## F1 on filled cells

The engine combines precision and recall into F1, 2 precision recall / (precision + recall), on filled cells. A field where no cell is filled on either side has no precision and no recall to combine, and its F1 is returned as null. The next lesson reads F1 per field.

## Say which rate you mean

A bare figure tells a reader nothing. Say "accuracy over the 180 cells, 0.972222" or "precision on filled cells, 0.962264", and give the empty-empty count beside an accuracy.

## Exercise

Open the view for field extraction with its default inputs: the six fields, the first eight labelled records and system B's predictions. Read the micro accuracy tile and the correct-because-both-empty tile. Now empty every prediction, so that each record has `"fields": {}`, and run it. Read the same two tiles and the micro F1 tile, and write two sentences: what happened to accuracy over cells, and what happened to F1 on filled cells, and why they moved so differently.
