# Kremser, in one relation

The Kremser relation is one closed form carrying the absorption factor and the stage count, and the fraction removed falls out of it. This lesson reads the surface it draws, the branch it takes at one, and the published check that says the arithmetic is right.

One expression covering a whole family of columns is unusual in this package. Most of what the Facilities engines answer arrives as a chain of steps, each with its own input and its own unit. Here two numbers go in and one comes out, and the entire behaviour of a staged absorber is in the shape of that single expression. The surface below is that shape, sampled.

## The surface, in both directions at once

| stages | A = 0.6 | A = 0.8 | A = 1 | A = 1.2 | A = 1.5 | A = 2 | A = 3 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 0.375000000 | 0.444444444 | 0.500000000 | 0.545454545 | 0.600000000 | 0.666666667 | 0.750000000 |
| 2 | 0.489795918 | 0.590163934 | 0.666666667 | 0.725274725 | 0.789473684 | 0.857142857 | 0.923076923 |
| 3 | 0.540441176 | 0.661246612 | 0.750000000 | 0.813710879 | 0.876923077 | 0.933333333 | 0.975000000 |
| 4 | 0.566273421 | 0.702522608 | 0.800000000 | 0.865620297 | 0.924170616 | 0.967741935 | 0.991735537 |
| 6 | 0.588480076 | 0.746926678 | 0.857142857 | 0.922576074 | 0.968916950 | 0.992125984 | 0.999085087 |
| 8 | 0.595927884 | 0.768995039 | 0.888888889 | 0.951920538 | 0.986646497 | 0.998043053 | 0.999898384 |
| 12 | 0.599476889 | 0.788365257 | 0.923076923 | 0.979379999 | 0.997417616 | 0.999877915 | 0.999998746 |

Read the columns rather than the rows. Above an absorption factor of one every column climbs towards total removal as the stages are added, and that is the behaviour most people expect from a column. At and below one it does not, and the next lesson is about nothing else.

{{panel:fc-absorber-explorer}}

## The branch at one

At an absorption factor of exactly one the closed form is indeterminate, so the engine takes a separate branch: the stages over the stages plus one. Read that branch against the A = 1 column above. One stage gives 0.500000000, four stages give 0.800000000, and twelve stages give 0.923076923.

A separate branch is normally a warning sign, because it is where an author can quietly substitute a different answer and nothing downstream can tell. Here it is a limit rather than a patch, and the evidence for that is in the next module, where the surface is read either side of one by a billionth and comes back continuous with the branch.

It is worth noticing what the branch does to the reading of the whole column. At an absorption factor of one the removal after a given number of stages depends on the stage count alone, so the column behaves like a device whose performance is bought entirely in steel. That is the only place on the surface where that is true, and it is the boundary between the two regimes the next module separates.

## What the published case checks

| A | stages | engine | golden | engine over golden |
| --- | --- | --- | --- | --- |
| 1.400000 | 6 | 0.958077213054 | 0.958077213054 | 1.000000000000 |
| 2.000000 | 3 | 0.933333333333 | 0.933333333333 | 1.000000000000 |
| 0.800000 | 8 | 0.768995038974 | 0.768995038974 | 1.000000000000 |
| 1.000000 | 5 | 0.833333333333 | 0.833333333333 | 1.000000000000 |
| 3.000000 | 2 | 0.923076923077 | 0.923076923077 | 1.000000000000 |

The golden here is a brute force stage cascade solved as a linear system, which reaches the same numbers by a genuinely different road. That matters more than the agreement itself. A check that restates the relation it is checking can only confirm that the typing is consistent, and this one cannot do that, because it never writes the relation down. The five ratios come back at 1.000000000000, and the row at an absorption factor of one is in the set, so the separate branch is checked too.

## Exercise

Record the removal at 6 stages for the columns at A = 0.6 and A = 3, then the removal at 12 stages for the same two columns. Say what each column did as the stages rose, and name the road the golden takes to the same answers.
