# The affinity laws, printed as a subtraction

The affinity laws are stated in every pump text as three proportionalities. This package does something more useful with them: it applies them and then prints the difference between what came out and what the law says should have come out.

{{panel:fc-suction-explorer}}

## Where the laws are taught, and what this course adds

The laws themselves, the best efficiency point and the operating range either side of it belong to the ESP course in the Production module, which teaches them at length. This course cites them and takes up a narrower question: which changes to a pump they describe, and which they do not.

A speed change on a geometrically similar machine is the case they describe, and they describe it exactly.

## The OKONO duty, scaled by speed

The base duty is 1234.452969 gpm at 417.801018 ft, drawing 183.041884 brake hp.

| speed ratio | flow gpm | head ft | brake hp | head over the base head | less the ratio squared | power over the base power | less the ratio cubed |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0.700000 | 864.117078 | 204.722499 | 62.783366 | 0.490000000 | 5.551115123125783e-17 | 0.343000000 | 0 |
| 0.800000 | 987.562375 | 267.392652 | 93.717444 | 0.640000000 | 0 | 0.512000000 | 0 |
| 0.900000 | 1111.007672 | 338.418825 | 133.437533 | 0.810000000 | 0 | 0.729000000 | 1.1102230246251565e-16 |
| 1.000000 | 1234.452969 | 417.801018 | 183.041884 | 1.000000000 | 0 | 1.000000000 | 0 |
| 1.100000 | 1357.898266 | 505.539232 | 243.628747 | 1.210000000 | 0 | 1.331000000 | 0 |

## What the two difference columns are for

The quotient columns say what happened. The difference columns say how close it is to what the law claims. Head over the base head against the speed ratio squared, and power over the base power against the ratio cubed, subtracted rather than described.

Eight of the ten differences printed are zero. The two that are not are 5.551115123125783e-17 and 1.1102230246251565e-16. That is what "exactly" means for a law implemented in double-precision arithmetic, and printing the subtraction is the only way to say it without hand waving. A lesson that asserts "the laws hold exactly" and shows a quotient column is asking to be believed. A lesson that shows the subtraction is not.

## The warned column, which is false on every one of these rows

None of these five speed ratios draws a comment from the engine. That is not the same as the laws being endorsed at those ratios: it is the engine declining to interrupt over a change of that size.

## The mistake

The mistake is applying the cube to the wrong leg. Flow goes with the ratio, head with its square and power with its cube, and reading a head change as a flow change at a ratio of 0.700000 turns 204.722499 ft into 864.117078 gpm worth of confidence in the wrong quantity.

The second is forgetting which leg pays for a speed increase. At a ratio of 1.100000 the flow goes to 1357.898266 gpm, which sounds modest, and the brake power goes to 243.628747 hp. The power quotient on that row is 1.331000000, and the driver has to be able to deliver it.

## Exercise

Write the flow, head and brake power at speed ratios of 0.700000 and 1.100000, together with the head and power quotients on each row. Then state what the two difference columns compare, and say why printing them is a stronger claim than printing the quotients on their own.
