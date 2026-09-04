# What a wall can hold

Barlow is P = 2 S t f / D, and the D is the OUTSIDE diameter, not the bore. Get that one substitution wrong and every rating you quote is high.

{{panel:pd-trunk-explorer}}

## The published case

The gate case is a 6.625 in outside diameter with a 0.28 in wall in API 5L X52, whose yield is 52000 psi, at a design factor of 0.72. The rating is 3164.739623 psi. Run the same wall with no design factor at all and you get the bare hoop stress, 4395.471698 psi, which is 1.388889 times the rated pressure and is not a number anyone may operate to.

## Three levers, and only two of them are steel

Double the wall to 0.56 in and the rating doubles to 6329.479245 psi, because the wall is the only dimension in the numerator. Double the outside diameter to 13.25 in and it halves to 1582.369811 psi, because the outside diameter is the only dimension in the denominator. Grade is the third, and it is the cheapest lever to pull on paper.

| Grade | Yield, psi | Rating at design factor 0.72, psi |
| --- | --- | --- |
| gradeB | 35000 | 2130.113208 |
| x42 | 42000 | 2556.135849 |
| x52 | 52000 | 3164.739623 |
| x60 | 60000 | 3651.622642 |
| x65 | 65000 | 3955.924528 |

Every row there is the same 6.625 in pipe with the same 0.28 in wall at the same design factor. Only the steel moved, and the whole range the module ships spans 2130.113208 psi to 3955.924528 psi.

## A second line to compare

An NPS 8 schedule 80 line, 8.625 in outside on a 0.5 in wall with a 7.625 in bore, in x65 at 65000 psi and a design factor of 0.72, rates 5426.086957 psi. Its bare hoop is 7536.231884 psi. A heavier schedule in a bigger size on a better steel holds more than the gate pipe, and the arithmetic that says so is four numbers long.

## What it refuses

An unknown grade id resolves to NaN and never to a default: `gradeYield('x55')` is NaN. A missing yield returns NaN. A zero wall returns NaN. The module declines to guess a steel, because a rating quoted against the wrong yield reads exactly like a rating. NaN is a refusal that a caller who never tests for it will print, since it carries through arithmetic without complaint.

## The mistake

Quoting a bare hoop stress as a rating. On the gate pipe that is 4395.471698 psi where the rating is 3164.739623 psi, and the number that separates them is not a property of the pipe.

## Exercise

In the panel, rate the 6.625 in pipe with the 0.28 in wall in x42 and in x65 at a design factor of 0.72, and write both.

Then say why substituting the bore for the outside diameter in Barlow would push the answer the wrong way.
