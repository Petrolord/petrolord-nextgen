# The canonical sampler

{{panel:materials-spares-calculator}}

Every figure so far in this tier has been exact: the same inputs give the same number on any machine. Lead-time risk is different. When a lead time and a demand rate are each uncertain, the engine samples them, and a sampled figure is an estimate. This module teaches how the engine samples, how to read what it returns, and why none of it is graded.

## One sampler for the whole platform

The engine carries no sampler of its own. Its leadTimeRisk function samples through lib/stats, the platform's one seeded Monte Carlo: mulberry32 for the uniform numbers, the triangular inverse triInvCDF to turn each uniform into a value, and basicStats for the percentiles and the mean. Its P-labels come from lib/conventions/percentile.js. leadTimeRisk is the only function of the nine that samples, and nothing in the engine is discounted.

Using the canonical sampler means the Monte Carlo here behaves as it does everywhere else on the platform: the same seed and the same draw count give the same draws, and the P-labels follow one convention. Distributions and Monte Carlo as a subject belong to the uncertainty course; this course applies the sampler to one question, the demand that arrives while a replacement is on order.

## The seed is required

A seeded sampler repeats itself exactly. The engine makes the seed a stated input with no default, so that every run can be reproduced, and refuses a call without one, verbatim:

> seed must be a whole number from 0 to 4294967295; it is required so that every run can be reproduced

The draw count is stated too, as a whole number from 1 to the cap. Zero draws is refused:

> iterations must be a whole number from 1 to 200000; got 0

## What the sampler reads

The inputs are the demand a day and the lead time in days, each either a constant number or a triangle stated by its minimum, mode and maximum; a reorder point; an optional cycle service level for a reorder point; the seed; and the draws. The Ekene register's case is the mechanical seal on the export pump, with 20000 draws on seed 20270301. Every figure it returns is an estimate on that seed and that count, and the course quotes each one with both.

## Never graded, and why

A sampled figure moves when the seed or the draw count moves. A graded answer must have exactly one right value, so no graded figure in this course is a Monte Carlo draw. The spares calculator marks every sampled tile "(sampled)" and prints the seed and draws above the table.

## Exercise

Open the spares calculator on the view "Lead-time risk by Monte Carlo (ungraded)" and start from "The mechanical seal on the Ekene register". Read the panel's note above the table and find the seed and the draws it names. Read the sampling line the engine prints and name the three pieces of lib/stats it uses. Clear "Seed (stated)" so it reads not stated and read the refusal. Restore 20270301, set "Draws (stated)" to 0, and read the second refusal. Restore 20000.
