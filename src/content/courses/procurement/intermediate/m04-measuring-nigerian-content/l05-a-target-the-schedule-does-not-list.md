# A target the Schedule does not list

{{panel:pr-award-calculator}}

The 2010 Schedule lists 45 lines in the three sections the engine holds. A tender may include an item none of them names, catering on a rig, say. Under s.11(2) the Nigerian Content Development and Monitoring Board may set a level for an item the Schedule does not list. The engine allows for it too, on one condition: the target is stated by the user, with its source.

## A stated target

An item can be tied to a Schedule line by its key, or it can carry its own target: a percentage, a measured unit and a source. The course states an example with two items: land rigs, a Schedule line at 70% by man-hours, and catering, a stated target of 90% by man-hours. Two stated bids:

| bid | rig | catering | overall | items met |
| --- | --- | --- | --- | --- |
| B1 | 70.000000 (meets 70) | 90.000000 (meets 90) | 73.333333 | 2 of 2 |
| B2 | 69.900000 (below 70) | 89.500000 (below 90) | 73.166667 | 0 of 2 |

B1 sits exactly on both minimums and meets both. B2 sits just below both. Both items are in man-hours, so the overall content is pooled.

## Where each target comes from

The engine returns every target with its source, as it holds it. For the Schedule line, verbatim:

> Nigerian Oil and Gas Industry Content Development Act 2010 (Act No. 2, commenced 22 April 2010) s.11 and the Schedule as enacted in 2010 (later Board targets are not included), EXPLORATION, SUBSURFACE, PETROLEUM ENGINEERING AND SEISMIC: Drilling Rigs (Land) 70% by man-hours

For the stated target, the source is whatever the user wrote, returned with a label that says so:

> stated by the user: a level stated for this example by the course; no Board target was read

The catering level of 90% here is the course's own example figure, and its source says that no Board target was read.

## Three refusals

A stated target must carry all three parts. With no source:

> items[0].source must state where the target comes from (a user-stated target is never a hidden default)

With no percentage:

> items[0].targetPct must be a number from 0 to 100 when no scheduleLine is given

With a unit the engine does not accept:

> items[0].measure must be one of man-hours, tonnage, spend, length, number, volume, litres

Without the first rule, a typed target would look exactly like a figure read from the Act.

## Later Board targets

The course read no Board target set after the 2010 Act. If a tender is governed by one, the evaluator reads it, cites it, and enters it as a stated target with that citation as its source.

## Exercise

Open the award calculator on the view "Nigerian content by item". Replace the items with two of your own: first one called catering with a targetPct of 90, a measure of man-hours and a source sentence of your own, then one tied to the Schedule line coiled-tubing-services. Replace the bids with two bids, B1 and B2, each reporting both items in man-hours with Nigerian and total hours of your choosing, one meeting both minimums and one missing both. Read the targets table and its sources. Then delete the catering source and read the refusal; restore it and change its measure to hours.
