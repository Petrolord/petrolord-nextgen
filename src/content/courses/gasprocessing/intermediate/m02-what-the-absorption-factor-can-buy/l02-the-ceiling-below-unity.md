# The ceiling below unity

Below an absorption factor of one a column has a ceiling, and no stage count reaches past it. This is the single most useful fact in the staged half of the module, because it is the one that stops a project spending money on the wrong dial.

## What the ceiling is

Below unity the removal never passes the absorption factor however many stages are bought. The factor is not merely a rate at which stages pay off. It is the highest fraction the column can ever take out, and stages only walk the answer towards it.

| A | removal at 12 stages | removal at 200 stages | A itself | 200 stages less A |
| --- | --- | --- | --- | --- |
| 0.600000000000 | 0.599476889 | 0.600000000 | 0.600000000 | 0.000000000000 |
| 0.800000000000 | 0.788365257 | 0.800000000 | 0.800000000 | 0.000000000000 |
| 0.950000000000 | 0.897258427 | 0.949998335 | 0.950000000 | -0.000001665057 |
| 0.999999999000 | 0.923076923 | 0.995024876 | 0.999999999 | -0.004975123378 |
| 1.000000000000 | 0.923076923 | 0.995024876 | 1.000000000 | -0.004975124378 |
| 1.000000001000 | 0.923076923 | 0.995024876 | 1.000000001 | -0.004975124878 |
| 1.200000000000 | 0.979379999 | 1.000000000 | 1.200000000 | -0.200000000000 |

{{panel:fc-absorber-explorer}}

## Reading the last column honestly

The last column is the gap between what 200 stages reach and the absorption factor itself, and it is only meaningful on the rows below one.

It is exactly zero for the lower factors, because the factor raised to the stage count has fallen below anything double precision can hold and the relation collapses to the factor itself. That is a statement about the arithmetic of a computer rather than about an absorber, and it is worth naming as such. Only near one does 200 stages fall measurably short of the ceiling.

At and above unity that column means nothing at all, because there is no ceiling there to measure against. It becomes the distance from a removal that cannot exceed one to a factor that can, and it goes more negative the larger the factor, which is arithmetic about the column of a table rather than physics about an absorber. The row at 1.200000000000 is in the table so that this can be seen rather than assumed.

## What it means on a plant

An absorption factor below one means the solvent arriving is short of the duty the gas is bringing. There is no height of vessel that changes that. Adding trays to a starved column moves the answer closer to a ceiling it was always going to sit under. Read down either of the starved columns in the surface of the previous lesson and watch what each added stage returns.

So when a removal target is missed, the first question is which side of one the absorption factor sits. Above one, more stages are a real option. At or below one, the honest answer is more solvent, and the engine says exactly that when it is asked for a stage count it cannot supply.

## Exercise

Record the removal at 12 stages and at 200 stages for the columns at A = 0.600000000000 and A = 0.950000000000, and the value of the factor itself in each case. Then say what the final column of that table is measuring on those two rows, and why the same column carries no meaning on the row at 1.200000000000.
