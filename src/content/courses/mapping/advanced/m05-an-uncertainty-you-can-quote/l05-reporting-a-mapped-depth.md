# Reporting a mapped depth

Everything this tier measured exists to change one sentence: the one in which a mapped depth reaches somebody who will act on it. This lesson writes that sentence.

## The bad version

> P-1: 1542.62 m.

Three problems, and all three are invisible to the reader.

It implies a precision of a centimetre on a number whose demonstrated error at comparable locations is several metres. It carries no conditions, so it cannot be reproduced or compared with a later vintage. And it offers no way to tell whether the difference between this prospect and another one at 1546 m is real.

## The over-corrected version

> P-1: 1542.619873046875 m, from a thin-plate spline through six wells on a 25 by 20 grid at 100 m with a two-cell pad and an 800 m extrapolation limit, contoured at 10 m, live nodes 201, crest 1539.7181396484375 m, deepest 1590 m, map mean 1550.2667801131063 m.

Everything in it is true and it is unusable. A reader looking for a depth has to find it among fifteen numbers, and the twelve digits after the decimal point undermine the credibility of the whole line.

## The version to write

> **P-1: 1542.6 m**, from six wells (thin-plate spline, 100 m cell, 800 m extrapolation limit). Removing any single well moves it to between 1541.9 and 1549.7 m, dominated by Ekene-6 at 361 m. Two interior validation tests on this map gave errors of $+9.8$ m and $-5.7$ m.

Four sentences worth of content in three lines. A reader gets the number, the method in enough detail to reproduce it, a range with the reason for its asymmetry, and independent evidence of the map's demonstrated error.

## The four elements

**The number, rounded honestly.** One decimal place is generous for a map whose errors are metres. Quoting 1542.6 m rather than 1542.619873046875 m loses nothing and claims nothing false.

**The conditions.** Method, cell size and extrapolation limit. Three items, and without them no later reader can rebuild the map or tell whether a new vintage differs because of the data or the settings.

**The control sensitivity.** The jackknife range, with the dominant well named. Naming the well matters: it tells a reader that the number leans on one measurement, and it tells a planner which well would be worth confirming.

**The demonstrated error.** The residuals, quoted individually with their signs and never averaged. They are what turn a modelled range into evidence.

## What this changes downstream

A volumetrics engineer receiving 1542.6 m alone will use it as a fixed input.

The same engineer receiving the four-element version will run the volume at 1542 m and at 1550 m and see how much the answer moves, which is exactly what should happen. On this field the difference is a 17.4 m column against a 10 m column at a 1560 m contact, which is a 43 percent change and worth knowing about before a number reaches a decision.

That is the whole return on the tier. Nothing about the map improved; what improved is that the number arrives with enough attached for the next person to use it properly.

## The habit for a whole map

A single location gets the treatment above. For a map with several prospects, the same content goes in a table.

| Location | Depth | Jackknife range | Dominant well |
| --- | --- | --- | --- |
| P-1 | 1542.6 | 1541.9 to 1549.7 | Ekene-6 at 361 m |

One row per location, computed the same way, with the method and the residuals stated once above the table. It is more work than quoting six depths, and the work is the point.

## Worked example

Rewrite this line honestly: *the prospect crest is at 1539.72 m with 8 m of closure.*

> Prospect crest 1539.7 m from six wells (thin-plate spline, 100 m cell, 800 m limit), which is 1.3 m shallower than the shallowest pick on the field and therefore partly an artefact of the fit. Mapped closure 8 m, against demonstrated interior errors of $+9.8$ m and $-5.7$ m on this map, so the closure is not resolved by the present control.

The rewrite is longer and it says something the original did not: that the closure the sentence is built on is smaller than the map's measured error.

## Exercise

Write a reporting line for a location where the map reads 1551.3 m, the jackknife range is 1549.8 to 1556.2 m, and the dominant well is 480 m away. Say which four elements your line contains.

As a self-check: a suitable line is *1551.3 m from six wells (thin-plate spline, 100 m cell, 800 m extrapolation limit); removing any single well moves it to between 1549.8 and 1556.2 m, dominated by the well 480 m away; interior validation on this map gave errors of $+9.8$ m and $-5.7$ m.* The four elements are the number rounded to a defensible precision, the method conditions needed to reproduce it, the control sensitivity with its dominant well named, and the demonstrated errors quoted individually rather than averaged.
