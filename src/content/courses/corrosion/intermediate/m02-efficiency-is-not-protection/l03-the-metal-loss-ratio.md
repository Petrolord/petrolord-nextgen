# The metal loss ratio

{{panel:fc-inhibitor-integrity-explorer}}

The shortfall in percentage points tells you how far the protection missed the
datasheet. The metal loss ratio tells you what that miss costs the wall, and it
is the more useful of the two because it is the number the remaining life
divides by.

| efficiency percent | availability percent | effective protection percent | shortfall pp | metal loss against the datasheet number |
| --- | --- | --- | --- | --- |
| 95.000000 | 100.000000 | 95.000000 | 0.000000 | 1.000000 |
| 95.000000 | 98.000000 | 93.100000 | 1.900000 | 1.380000 |
| 95.000000 | 95.000000 | 90.250000 | 4.750000 | 1.950000 |
| 95.000000 | 90.000000 | 85.500000 | 9.500000 | 2.900000 |
| 95.000000 | 80.000000 | 76.000000 | 19.000000 | 4.800000 |
| 95.000000 | 70.000000 | 66.500000 | 28.500000 | 6.700000 |
| 95.000000 | 50.000000 | 47.500000 | 47.500000 | 10.500000 |
| 95.000000 | 25.000000 | 23.750000 | 71.250000 | 15.250000 |

## Read the second row before the last one

Two percentage points of availability, from 100.000000 to 98.000000 percent,
take the effective protection from 95.000000 percent to 93.100000 percent. That
is a shortfall of 1.900000 percentage points, which reads as almost nothing.
The metal loss on that same row is 1.380000 times the datasheet number. A
reader who summarises the screen by the protection column will call that row
fine. A reader who summarises it
by the loss column will notice a loss of 1.380000 times the datasheet number,
from a programme nobody would describe as unreliable. Both readers are looking
at the same row.

## The ratio is what the life divides by

The remaining life in this module is a remaining allowance divided by a rate.
The metal loss ratio is a ratio of rates, so it passes straight through that
division and becomes the factor by which the life shortens. That is why the
ratio is worth recording as its own field rather than being left for the reader
to form. At 95.000000 percent efficiency and 90.000000 percent availability the
ratio is 2.900000, and the rate on that row is 0.243082 mm/yr against the
0.083821 mm/yr of the datasheet row.

## The shipped case has one too

On the studio's own default case the corrosion inhibitor is at 90 percent
efficiency and 95 percent availability, the effective protection is 85.500000
percent and the shortfall is 4.500000 percentage points. The warning names the
loss ratio directly:

> a 90 percent inhibitor at 95 percent availability gives 85.5 percent
> effective protection, which is 1.45 times the metal loss of the datasheet
> number: availability, not efficiency, is what limits it

## Two columns, two audiences

The shortfall in percentage points is stated in the units the chemical was
selected in. The metal loss ratio is stated in the units the wall is measured
in. They are the same fact twice and the second changes a decision.

## Where the ratio comes from

Nothing in the correlation is in it. Both rates in the ratio share the whole
chain, so every constant, coefficient and factor divides out and what is left
is arithmetic over two typed percentages. A capstone can grade it for exactly
that reason, and so can you, on paper, in one line.

## A ratio against a datasheet

The comparison is always against the datasheet row rather than against an
uninhibited line. A ratio of 1.000000 means the programme delivered what the
container promised.

## Exercise

Record the shortfall in percentage points and the metal loss ratio for the
availabilities of 98.000000, 95.000000 and 90.000000 percent. Then state which
of the two columns moves more between the first and the last of those three
rows, and say which of them a remaining life is more sensitive to.
