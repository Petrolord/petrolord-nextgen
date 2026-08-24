# The prediction panel map

This lesson is the map of the tier. It names what the prediction panel reports, says which module owns each part, and puts the six graded numbers in front of you now rather than at the end. Seeing the destination early changes how you read the arithmetic that gets you there, and at this tier the destination is unusual: the answer is a range with a method attached, not a depth.

## What the panel does

The panel takes the four Ekene wells, lets you choose a starting marker that Ekene-4 does carry, and predicts Ekene-4's TOP_B from it. Choose TOP_A and it works from TOP_A. Choose TOP_SAND and it works from TOP_SAND. For whichever marker you pick, it shows the three wells that carry TOP_B, the interval from your marker down to TOP_B in each of them, the mean of those three intervals, and Ekene-4's own depth for that marker.

Then it does something the tier depends on. Whichever marker you selected, it draws both predictions on the same depth axis, with the band between them shaded and labelled as the spread. You cannot look at one estimate on this panel without seeing the other one beside it, which is deliberate. A single estimate is the part of this work a learner can already do. The pair, and the distance between them, is the part this tier exists to teach.

## The four readings, and who owns them

**The intervals from your marker.** One per carrying well, three in all. These are measured distances inside real wellbores and they are the raw material of everything else. Module 2 works the TOP_A column and module 3 works the TOP_SAND column.

**The mean interval.** The average of those three, and the moment the assumption enters. Averaging three wells and applying the result to a fourth is a decision, and modules 2 and 3 each make it once and say what it rests on.

**The prediction.** Ekene-4's own depth for the marker, plus the mean interval. One addition. Two of them exist, one per marker, and they do not agree.

**The spread.** The distance between the two predictions. Module 4 owns it and treats it as the answer rather than as a defect. Module 5 then separates it from structural relief, which is the reading most often confused with it.

Module 6 puts the whole thing together as a workflow and walks the capstone.

## The six graded numbers

The tolerances are part of the fact, so learn them beside the values.

| reading | value | tolerance |
| --- | --- | --- |
| mean TOP_A to TOP_B interval | 141 m | 0.01 |
| mean TOP_SAND to TOP_B interval | 92 m | 0.01 |
| Ekene-4 TOP_B, layer-cake estimate | 1671 m | 0.01 |
| Ekene-4 TOP_B, from TOP_SAND | 1682 m | 0.01 |
| spread between the two estimates | 11 m | 0.01 |
| TOP_B structural relief across the three wells | 34 m | 0.01 |

Look at the shape of that table before the values. Two means, two predicted depths, and then two numbers that are both differences in metres and are not the same kind of thing at all. That last pair is where this tier is won or lost.

The two predicted depths, 1671 m and 1682 m, are estimates. They are never written down without a word marking them as predicted, because nothing in Ekene-4 was ever measured at either depth.

The spread of 11 m is how far apart two defensible methods land on the same three wells. It is a statement about the prediction.

The relief of 34 m is 1662 minus 1628, the distance between the deepest and shallowest logged TOP_B. It is a statement about the surface, and it is a three-well number. It describes how much TOP_B moves structurally across the wells that have it, and it says nothing about how well you predicted the fourth.

Quoting 34 m where 11 m belongs is the classic failure at this tier. The two are both differences, both in metres, and both come off the same panel, and they answer different questions. Module 5 exists for that distinction alone.

## How to use the panel

Use it to check yourself rather than to find out. The productive loop is to compute a reading by hand from the table in the previous lesson, write it down, then open the panel and compare. A match confirms the rule you used. A miss tells you which rule is wrong, and the panel shows enough intermediate detail to locate it.

That loop works here because the engine is exact closed-form arithmetic. Three subtractions give the intervals, one division gives the mean, and one addition gives the prediction. There is no fitting and no iteration. If your hand answer and the panel disagree by anything at all, one of you has made a mistake and it is findable.

One habit to start now. Every time you write a number off this panel, mark what kind of number it is: a measured depth, a predicted depth, an interval, a mean of intervals, a spread between predictions, or a structural relief. Those six kinds behave differently and mean different things, and most of the errors at this tier are one kind being reported as another.

The panel below predicts Ekene-4's TOP_B from the marker you choose and shows both estimates with the spread between them.

{{panel:wc-prediction-explorer}}

## Exercise

Open the panel and find all six graded readings on it. Beside each, write the module that will explain it and the kind of number it is from the six kinds above. Then switch the marker from TOP_A to TOP_SAND and note carefully which readings change and which do not.

Self-check: the two means and the layer-cake estimate belong to modules 2 and 3, the from-TOP_SAND estimate and the spread belong to modules 3 and 4, and the relief belongs to module 5. By kind, 141 m and 92 m are means of intervals, 1671 m and 1682 m are predicted depths, 11 m is a spread between predictions, and 34 m is a structural relief. Switching the marker changes the interval table, the mean, the anchor depth and the prediction that the panel is working through step by step, and it leaves both final estimates, the spread of 11 m and the relief of 34 m unchanged, because those are properties of the dataset rather than of your current selection.
