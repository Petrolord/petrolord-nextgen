# Which one is the stroke

The wave answer is the stroke. It is the travel the barrel sees, and it is the number the volume calculation is fed.

{{panel:pd-card-explorer}}

## The question has an answer

`plungerStrokeIn` from the march is the peak to trough travel of the pump end node over one settled cycle. That is the distance the plunger physically moves inside the barrel, so it is the distance that sweeps volume. `displacementBpd` is fed that number and not the spring rule.

On ODUMA-4 the march returns 98.526653100 in. The dimensionless group `Sp over S` comes back as 0.923505123, that marched stroke over the 106.687716837 in surface stroke, so the whole RP 11L reading of the design is built on it.

## What the volume does with it

| Quantity | Value, bbl/d |
| --- | --- |
| rated displacement on the surface stroke | 380.874258458 |
| swept displacement on the plunger stroke | 351.739329047 |
| produced rate | 316.565396142 |

Produced over rated comes back as 0.831154611. The first step down that column is the stroke the rods gave away, the second is fillage and pump efficiency.

Substituting the spring rule's 91.152184050 in would report a plunger that travels 7.374469050 in less than the march says it does, 8.090282 percent short, and every barrel figure downstream would inherit that shortfall.

## The spring rule still has a job

It is the static limit, and near the static limit it is exact. At 0.5 spm on the published taper the rule gives 45.279814701 in and the march gives 45.286791250 in, a difference of 0.015408 percent.

It is therefore the right thing to check an implausible marched answer against, and it is not a competing estimate of the same running quantity.

## What the marched stroke refuses to be

It refuses to be smooth in speed. On the published taper the overtravel runs 0.373874 percent at 5.0 spm, 4.403772 at 6.0, 0.738434 at 7.0, 3.910776 at 8.0 and 9.696181 at 9.0. A design that picks a speed by watching the plunger stroke climb is reading a ladder that steps back twice inside four rows.

It also refuses to be a measurement. It is what a damped wave equation with an assumed damping ratio predicts, sampled at a resolution the caller did not choose.

## The mistake

Quoting the spring rule because closed form looks more definite. The rule is exact for a string that behaves as a spring, and a string at 10.859173990 round trips per stroke is not one.

## Exercise

Write the three ODUMA-4 volume figures in order and say what each step down the column paid for.

Then state the marched stroke and the spring rule for ODUMA-4, and the percentage a design would lose by reporting the wrong one.
