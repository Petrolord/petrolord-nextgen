# R squared, and when it is null

The fit comes back with a number that says how well it describes the points it was given. For the OKONO catalogue that number is an R squared of 0.999985896, which is very close to one and says the quadratic follows those four readings almost exactly.

{{panel:fc-pump-explorer}}

## What it measures, and what it does not

R squared is the share of the variance in the readings that the fitted curve explains. A value near one means the points sit close to the curve. That is the entire claim it makes.

In particular it says nothing about whether the linear system behind the fit was well conditioned, which is a separate question with a separate answer, and the next lesson is about that. It also says nothing about whether the curve is the right shape to be a pump curve. Both of those are easy to assume from a high R squared and both assumptions are wrong.

The second one is worth seeing. The engine fits a rising point set, three readings whose head climbs with flow, and that fit comes back with an R squared of 1.000000000, a perfect score. It is perfect because three points and three coefficients leave nothing for the curve to miss. The same return carries a droops flag of false and a warning in prose saying the fitted curve does not fall with flow. A pump curve that rises is not a pump curve, and R squared of 1.000000000 did not notice.

## The case where there is no number to give

Now fit three readings that all have the same head. The engine returns c2 = 0.000000, a droops flag of false, and an R squared of null.

Null is the right answer and it is not an error. R squared is the share of the variance the fit explains. Three identical heads have no variance to explain at all: the total sum of squares is zero, the quantity is a division by that zero, and it is undefined. A horizontal line explains nothing, and null is what nothing to explain looks like in a return.

The engine could have returned 1, on the grounds that the flat line fits the flat points perfectly. It could have returned 0, on the grounds that it explains nothing. Both would be a number where there is no number, and either would look like a measurement to whatever read it next.

## The mistake

Reading a high R squared as a verdict on the pump curve. The rising set scores 1.000000000 and is refused as a head curve in the very next module. R squared grades the fit against the points. Nothing more than that.

## Exercise

Give the OKONO R squared and say in one sentence what quantity it is the share of. Then say what the engine returns for three readings at identical heads, and explain why a return of 1 would have been a worse answer than null.
