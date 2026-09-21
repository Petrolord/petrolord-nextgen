# The boundary snap

{{panel:qr-alarp}}

The lower band rule settles a value that sits exactly on a limit. A computer rarely produces a value exactly on anything. An individual risk is built from products of frequencies and probabilities, and IEEE double precision carries a tiny error in most of them. The engine's BOUNDARY_SNAP decides when a computed value is close enough to a threshold to count as the threshold itself, so that the band never depends on the order in which a machine multiplied.

## Products that miss by the last bit

| product, stated | in IEEE double | threshold it means | preset | engine band | boundary |
| --- | --- | --- | --- | --- | --- |
| 0.1 x 0.1 x 0.1 | 0.0010000000000000002 | 1e-3 | r2p2-workers | TOLERABLE | unacceptable |
| 0.1 x 0.1 x 0.01 | 0.00010000000000000002 | 1e-4 | r2p2-public | TOLERABLE | unacceptable |
| 0.2 x 0.000005 | 0.0000010000000000000002 | 1e-6 | r2p2-public | BROADLY_ACCEPTABLE | broadly-acceptable |

On paper 0.1 x 0.1 x 0.1 is exactly 1e-3. In double it is 0.0010000000000000002, a hair above. A plain comparison would call that UNACCEPTABLE for workers, although the exact product is the threshold itself. The snap stops that from happening, and the lower band rule then puts the value where the owner's decision says it belongs.

## What the snap is

BOUNDARY_SNAP is 1e-9, and it is RELATIVE: a computed value within one part in a thousand million of a threshold IS the threshold. The engine then applies the lower band rule to it, and `atBoundary` names which threshold it was. The same relative snap decides when a corner of a societal curve sits on a criterion line, and when a cost sits exactly at DF times its benefit.

## The snap is narrow

The snap catches floating point noise and nothing more. An individual risk of 1.0000001e-6 per year lies one part in ten million above the lower limit. That is a real difference, far larger than the snap, and the engine reports it as TOLERABLE for the public with boundary null.

| individual risk per year, stated | public band | boundary |
| --- | --- | --- |
| 1.0000001e-6 | TOLERABLE | null |

An analyst who wants 1.0000001e-6 per year treated as broadly acceptable has to argue it in words. The engine will not round it away, and a reviewer reading the result can see from the null boundary that it did not.

## Why relative

The engine compares against limits of 1e-3 and 1e-6 per year and against costs in currency units. An absolute tolerance small enough for the smallest limit would be meaningless at the largest. A relative snap scales with the threshold it is compared against, so one value of 1e-9 serves every limit in the engine. It is a different tolerance from the branch sum check met in the Associate tier, BRANCH_SUM_TOLERANCE, which is absolute because every branch set sums to the same number, one.

## Exercise

Take the second row of the first table. Write the product as the engine sees it, 0.00010000000000000002, beside the public upper limit of 1e-4, and say which band a plain comparison would give it and which band the engine gives it. Then take 1.0000001e-6 per year and explain in one sentence why the snap leaves it in the TOLERABLE region with boundary null.
