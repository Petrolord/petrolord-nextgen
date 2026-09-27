# Orders outstanding, one for one

{{panel:materials-spares-calculator}}

The engine's insurance model starts from one picture. A unit fails, a spare goes in, and a replacement order goes to the supplier that same day. The order arrives one lead time later and refills the shelf. Each failure places exactly one order, so the model is called one for one, and the number of orders still on their way at any moment decides whether a spare is on the shelf when the next failure comes.

## The engine's model, in its own words

The rule the engine applies, verbatim:

> orders outstanding X ~ Poisson(failuresPerYear x leadTimeDays / daysPerYear), one for one; expected units down E[(X - n)+]; annual cost n x unitCost x holdingRate + E[(X - n)+] x daysPerYear x downtimeCostPerDay; probability of no shortage P(X <= n); fill rate P(X <= n - 1), the chance a failure finds a spare

Read it in pieces. Failures arrive at random at a steady rate, so the orders outstanding at a random moment are Poisson. Their mean is the failures a year times the fraction of a year each order spends on its way, the lead time in days over the days a year. With n spares, a failure that comes while more than n orders are outstanding finds the shelf empty, and the unit waits.

## The ESP motor's mean

The Ekene register states 2 failures a year, a lead time of 150 days and 365 days a year. The engine returns a mean of 0.821918 orders outstanding. That single figure drives every probability and every cost in the rest of this module.

| input | stated | what it does to the mean |
| --- | --- | --- |
| failures a year | 2 | the mean rises in proportion |
| lead time, days | 150 | the mean rises in proportion |
| days a year | 365 | converts the lead time to years |

The engine converts nothing else. The failures are a year, the lead time is in days, and the days a year join them, so a lead time stated in weeks would give a wrong mean with no refusal. Each input is written down with its unit for that reason.

## A lead time of nothing is refused

A replacement that arrives the instant it is ordered leaves nothing outstanding, and the model has nothing to size. The engine refuses it, in its own words:

> leadTimeDays must be a finite number above 0; got 0

The mean has a cap too, taught with the other caps later in this tier.

## What the model assumes

One for one is the engine's stated model. Every failed unit is replaced by a new order; nothing is repaired and returned, no unit is condemned, and there is one shelf. A plant that repairs its motors in a workshop runs a different model, and this course names it and leaves it out.

## Exercise

Open the spares calculator on the view "Insurance spares" and start from "The ESP motor on the Ekene register". Note the "Mean orders outstanding" tile, 0.821918. Set "Failures a year (stated)" to 4 and predict the new mean before you read it; check that it is twice the first. Read the reason: the cheapest stock now sits on the search limit, and the reason says so. Restore 2, then set "Lead time to replace a failed unit, days (stated)" to 0 and read the refusal. Restore 150 and write one sentence explaining why doubling the failures and doubling the lead time move the mean alike.
