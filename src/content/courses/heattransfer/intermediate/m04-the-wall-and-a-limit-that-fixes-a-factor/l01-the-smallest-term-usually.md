# The smallest term, usually

The wall is the term nobody worries about, and on the studio case it earns that reputation. It carries 0.000228791 hr.ft2.F per Btu, which is 2.107398 percent of the whole stack. Metal is a good conductor and a tube wall is thin, so the term is small for the same reason on almost every exchanger anybody builds.

## Small is a reason to check it, once

A small term is not a term to leave out. It is a term whose value you can afford to be slightly wrong about, which is a different statement, and the difference matters because the wall is also the one term in this stack whose expression has a factor in it that a reader cannot check by inspection.

That is the subject of the next three lessons. The reason it is worth three is that a term carrying two percent of a stack can hide an error of a factor of two in itself and still leave the coefficient close enough to look right.

{{panel:fc-coefficient-explorer}}

## What moves the term

| wall thickness, inches | wall resistance at k 9 | wall resistance at k 26 | wall resistance at k 64 |
| --- | --- | --- | --- |
| 0.109000 | 0.001138428 | 0.000394071 | 0.000160091 |
| 0.035000 | 0.000335975 | 0.000116299 | 0.000047247 |
| 0.010000 | 0.000093531 | 0.000032376 | 0.000013153 |
| 0.002000 | 0.000018556 | 0.000006423 | 0.000002609 |

Two things move it and there are no others. The thickness, read down any column, and the conductivity, read across any row. The three columns stand in inverse proportion to their conductivities, so a less conductive wall moves the term by the same factor in the other direction. That is the whole of the conductivity dependence and there is nothing else in it.

So the case where the wall stops being negligible is a thick tube in a poor conductor. A heavy wall in a low conductivity alloy can carry a share of the stack worth arguing about, and the table above is how to find out rather than a reason to assume.

## The conductivity is a stated input here

In this course the wall conductivity arrives stated. It is a condition of the case, in the same way the two film coefficients are, and for the same reason. The default the engine carries for it is pinned rather than validated, so any figure resting on that default rests on a number no publication in this repository settles, and a course cannot ask a reader to produce a figure of that kind.

Stating it costs nothing and buys a great deal. A conductivity that comes with the question belongs to the question, and an answer computed from it is an answer about a piece of metal rather than about a default. The same reasoning is why both film coefficients are given conditions here, and it is a move this programme has made before: the separation course states a vendor coefficient for exactly this reason rather than letting a graded answer lean on a value that a review could move.

## Exercise

Record the wall resistance and the wall share on the studio case. Then take one row of the table and write the three resistances at the three conductivities, and say what relationship the three stand in. Finish by stating where the conductivity in this course comes from.
