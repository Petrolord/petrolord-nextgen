# Achieved RRF and achieved SIL

{{panel:lp-sif-builder}}

{{panel:lp-worksheet}}

A PFDavg is a probability, and probabilities near a thousandth are hard to talk about. Two derived readings make the number usable. The risk reduction factor is one over the PFDavg, and it says how many times less often the consequence happens with the function in place. The band is the division of the low demand table the PFDavg falls in. The engine returns both with every function and every subsystem.

## The IDU function, read three ways

| reading | value |
| --- | --- |
| PFDavg | 0.001792971954 |
| RRF | 557.733208 |
| SIL | 2 |
| state | SIL |

The RRF of 557.733208 is simply one over 0.001792971954, quoted at the six decimals the engine prints risk reduction factors to. The band of 2 comes from the low demand table, and the state of SIL says the value sits inside the table, clear of both of its ends.

## The low demand table

| SIL | PFDavg from, inclusive | PFDavg to, exclusive | RRF above | RRF up to, inclusive |
| --- | --- | --- | --- | --- |
| 4 | 1e-5 | 1e-4 | 10000 | 100000 |
| 3 | 1e-4 | 1e-3 | 1000 | 10000 |
| 2 | 1e-3 | 1e-2 | 100 | 1000 |
| 1 | 1e-2 | 1e-1 | 10 | 100 |

Each band includes its lower PFDavg bound and excludes its upper one, which the engine states as its convention. An exact decade therefore belongs to the lower band: a PFDavg of exactly 0.01 is band 1 and exactly 0.001 is band 2. In risk reduction factor terms an RRF of exactly 100 is band 1. A value that has just crossed a decade does not reach the higher band until it is strictly past it.

## Why the exact decade rule matters

A band boundary is not a rare place to land. Frequency products built from tenths and halves fall on decades often, and in machine arithmetic a product whose exact value is a decade can print a hair above it. The engine handles that with a decade snap, so a value within one part in a billion of a power of ten is treated as that power of ten. Without it, a function whose exact risk reduction factor is 100 could be banded one division away from where the convention puts it, on nothing more than the last bit of a double.

## The two states at the ends

Above the table the engine returns the state NOT_SIL_RATED, for a PFDavg of 0.1 or worse, where no band applies. Below the table, at a PFDavg under 1e-5, it returns band 4 with the state BELOW_SIL4_TABLE_FLOOR and notes that no claim beyond band 4 exists. Both states exist so that a value off the table is reported as being off the table.

## The band is a label

An achieved band is convenient shorthand and it is never the target. A band is a division ten times wide, so two functions in the same band can differ by a factor of ten in the thing that actually matters. The required PFDavg from the LOPA row is one number inside a band, and a function anywhere above that number misses the requirement while wearing the right label. The next lesson closes that loop on a real row.

## Exercise

Compute one over the function PFDavg of 0.001792971954 to six decimals and check it against 557.733208. Then work out how much smaller the PFDavg would have to be for this function to reach band 3, using the table above, and express that change as a factor.
