# What a rating is not

A rating is four numbers: an outside diameter, a wall, a yield and a design factor. Nothing else reaches the calculation, so nothing else is in the answer.

{{panel:pd-trunk-explorer}}

## What the number is made of

The gate case is a 6.625 in outside diameter on a 0.28 in wall in API 5L X52, whose yield is 52000 psi, at a design factor of 0.72. The rating is 3164.739623 psi. Change the fluid, the temperature or the year it was laid, and the answer is still 3164.739623 psi, because not one of those was supplied.

## Not a statement about the service

The design factor is where a code puts the fluid and the class location, and the module refuses to supply one. Hold the pipe and the steel fixed on an NPS 8 schedule 80 line, 8.625 in outside on a 0.5 in wall with a 7.625 in bore in x65 at 65000 psi, and the answer runs 3014.492754 psi at a design factor of 0.4, 5426.086957 psi at 0.72 and 7536.231884 psi at 1. Same steel, same wall. What moved is a rule somebody chose.

## Not a statement about the wall it has today

The wall in the calculation is the wall in the table, one per row: 0.28 in for NPS 6 schedule 40, 0.432 in for NPS 6 schedule 80. Barlow is linear in that wall, so doubling it to 0.56 in doubles the gate rating to 6329.479245 psi, and metal lost off the inside comes off the rating in proportion. No corrosion allowance is an input. A table wall is the wall of a pipe that has never been in service.

## What it refuses

An unknown grade resolves to NaN and never to a default: `gradeYield('x55')` is NaN. A missing yield is NaN and a zero wall is NaN. A size not in the table returns null rather than a nearby one: `scheduleRow(5, '40')` is null. With no design factor the function does not refuse at all. It returns the bare hoop stress, 4395.471698 psi on the gate pipe, 1.388889 times the rating, which describes a wall at yield rather than a pressure to work to.

## The mistake

Comparing two ratings without their factors. On one 6.625 in pipe with one 0.28 in wall at a design factor of 0.72, gradeB rates 2130.113208 psi and x65 rates 3955.924528 psi, and there the difference really is steel. Put two ratings from different sources together and the gap may be steel, wall, diameter or a jurisdiction, and the rating carries none of them.

## Exercise

In the panel, rate the 6.625 in pipe with the 0.28 in wall at 52000 psi and a design factor of 0.72, then rate it again with no design factor, and write both.

Then say what has to be written beside a rating before anybody operates to it.
