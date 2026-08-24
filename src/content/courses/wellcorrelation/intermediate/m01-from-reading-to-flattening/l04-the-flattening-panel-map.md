# The flattening panel map

This lesson is the map of the tier. It names the five things the flattening panel reports, says which module owns each one, and puts the six graded numbers in front of you now rather than at the end. Knowing what you are being asked to produce changes how you read everything between here and the capstone.

## The five readings

The panel runs the section engine on the four Ekene wells with a flattening top and a datum depth under your control, and reports five things.

**The datum.** The top you chose to flatten on and the depth you chose to force it onto. This is the only input on the panel that is an interpretation rather than a result, and it is the one that changes every other reading. Module 2 owns it.

**The shifts.** One number per well, in metres, with its sign. The shift is the whole of the flattening operation, and every other displayed number on the panel is downstream of it. Module 2 owns it.

**The displayed depths.** Where each pick draws on the panel once its well's shift has been applied. Every one of these is a displayed depth and is quoted as such. Module 3 owns them, along with the displayed span of the whole section.

**The intervals.** The thickness between two picks inside a well. These are the numbers that do not move when the datum moves, and watching them stay put while everything else changes is the best demonstration of what flattening is. Module 4 owns them.

**The missing tops.** Which wells carry which surfaces, and what the engine does with a well that lacks the flattening top. Module 5 owns it.

Module 6 puts the five together as a workflow in the order you would run them on a section that arrived this morning, and walks the capstone.

## The tier setting

Everything graded at this tier uses one setting: flatten on TOP_A at a 1450 m datum. Set the panel to that and leave it there while you work through the modules. Move it deliberately when a lesson asks you to, then put it back.

## The six graded numbers

The tolerances are part of the fact, so learn them alongside the values.

| reading | value | tolerance |
|---|---|---|
| Ekene-4 flattening shift | -80 m | 0.01 |
| Ekene-2 TOP_SAND displayed depth | 1503 m | 0.01 |
| Ekene-4 TOP_A to TOP_SAND interval | 60 m | 0.01 |
| A-to-SAND growth range | 14 m | 0.01 |
| wells carrying all four tops | 3 | 0, must be exact |
| displayed depth span of the section | 150 m | 0.01 |

Look at the shape of that table before the values. Five of the six are continuous quantities in metres with a tolerance on them, and one is a count with no tolerance at all. That difference is not a grading detail. A count of wells is a definition, so an answer one off is a wrong model rather than a rounding miss, and the grader is saying exactly that by refusing it any room.

Three of the six are worth flagging now because each has a standard way of going wrong.

The Ekene-4 shift of -80 m is negative, and the sign is part of the answer. Writing 80 is a different claim from writing -80, and module 2 is about why the subtraction runs in the order it does.

The 1503 m against Ekene-2's TOP_SAND is a displayed depth. Nothing in that wellbore is at 1503 m. Quoting it without the word displayed and without the datum that produced it is the error module 3 exists to prevent.

The growth range of 14 m is a difference between two intervals rather than a depth, so it does not have a displayed version and it does not change when the datum changes. If yours moves when you move the datum, you have measured something else.

## How to use the panel

Use it to check yourself rather than to find out. The productive loop is to predict a reading from the pick table and the rules, write the prediction down, then open the panel and compare. A prediction that matches confirms the rule you used. A prediction that misses tells you which rule is wrong, and the panel shows enough intermediate detail to find out which.

That loop is available at this tier in a way it is not available at most tiers, because the engine here is exact closed-form arithmetic. There is no fitting, no iteration, and no tolerance hiding a difference of opinion. One subtraction gives a well its shift and one addition puts a pick on the panel. If your hand answer and the panel disagree by anything at all, one of you has made a mistake and it is findable.

One habit to start now. Every time you write a number down off this panel, write beside it what kind of number it is: a measured depth, a displayed depth, an interval, a shift, or a count. Those five kinds behave differently when the datum changes, and most of the mistakes at this tier are one kind of number being treated as another.

The panel below flattens the Ekene section on the top and datum you choose, and reports the shifts, the displayed depths, the intervals and the growth range.

{{panel:wc-flatten-explorer}}

## Exercise

Open the panel on TOP_A at 1450 m and find all six graded readings on it. Beside each one, write the module that will explain it and the kind of number it is from the five kinds above. Then change the datum depth on its own, leaving the flattening top on TOP_A, and note which of the six move and which do not.

Self-check: the shift, the displayed depth and the displayed span belong to modules 2 and 3, and the interval, the growth range and the well count belong to modules 4 and 5. By kind, the -80 m is a shift, the 1503 m is a displayed depth, the 60 m and the 150 m are an interval and a displayed span, the 14 m is a difference between intervals, and the 3 is a count. Changing the datum depth alone moves the shifts and every displayed depth, including the 1503 m, and leaves the interval, the growth range, the count and the 150 m displayed span unchanged.
