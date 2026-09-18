# Two inputs where people expect one

{{panel:fc-inhibitor-integrity-explorer}}

A corrosion inhibitor arrives with one number on its datasheet. This module
asks for two, and the second one is where the answer actually comes from.

EFFICIENCY is what the chemical removes while it is on the wall. AVAILABILITY
is the fraction of the time it is there. The engine takes them as separate
inputs and returns the effective protection they give together, the shortfall
against the datasheet figure in percentage points, and a warning that names the
metal loss the shortfall costs.

| efficiency percent | availability percent | effective protection percent | shortfall pp | rate mm/yr |
| --- | --- | --- | --- | --- |
| 95.000000 | 100.000000 | 95.000000 | 0.000000 | 0.083821 |
| 95.000000 | 98.000000 | 93.100000 | 1.900000 | 0.115674 |
| 95.000000 | 95.000000 | 90.250000 | 4.750000 | 0.163452 |
| 95.000000 | 90.000000 | 85.500000 | 9.500000 | 0.243082 |

## The top row is the only one where the datasheet is right

At 95.000000 percent efficiency and 100.000000 percent availability the
effective protection is 95.000000 percent and the shortfall is 0.000000
percentage points. That is the row a datasheet describes, and it is the row a
line is never in. Drop the availability to 98.000000 percent and the effective
protection is 93.100000 percent, which is 1.900000 percentage points short.
Drop it to 90.000000 percent and the effective protection is 85.500000 percent,
a shortfall of 9.500000 percentage points.

Notice that the efficiency column never moved. Every one of those four rows is
the same chemical. The whole of the movement in the answer came from the second
input, and that is the point of asking for it separately.

## The two inputs answer to different people

Efficiency is a property of a chemical and it is settled by a laboratory. It is
chosen once, at the point of selection, and it rarely moves afterwards.
Availability is a property of an operation and it is settled by a pump, a tank
level, an injection point and a delivery schedule. It moves every week. Asking for them in one box would
average a laboratory result and an operating record into a number belonging to
neither.

## The shipped case is on this arithmetic

The studio ships with a corrosion inhibitor at 90 percent efficiency and 95
percent availability. On that case the effective protection is 85.500000
percent and the shortfall is 4.500000 percentage points, and the warning is
present on the screen. A reader who takes 90 percent off the datasheet and
stops has overstated the protection by those 4.500000 percentage points on the
first case the app ever shows them.

## Why this part of the engine can be graded

Every number in this section is arithmetic over two typed percentages. No
correlation constant is anywhere in the chain, no fugacity coefficient, no
threshold and no band. That is why the corrosion inhibitor arithmetic carries
graded capstone fields in this course while the corrosion rate the correlation
produces carries none. You can check this arithmetic by
hand, and doing so once tells you which part of this screen you can verify for
yourself.

## Exercise

Record the effective protection and the shortfall at 95.000000 percent
efficiency for availabilities of 100.000000, 98.000000, 95.000000 and 90.000000
percent. Then state what the efficiency column did across those four rows and
which input produced the movement in the protection column.
