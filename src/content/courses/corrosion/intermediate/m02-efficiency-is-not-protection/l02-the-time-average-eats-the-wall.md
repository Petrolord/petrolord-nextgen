# The time average eats the wall

{{panel:fc-inhibitor-integrity-explorer}}

A 95 percent corrosion inhibitor running 80 percent of the time is not a 95
percent solution. For the fraction of the time the chemical is off the wall the
uninhibited rate applies in full, and it is that time average which eats the
wall. The arithmetic is not subtle and its result still surprises people.

Read the 80 percent row twice. At 95.000000 percent efficiency and 80.000000
percent availability the effective protection is 76.000000 percent, which is
19.000000 percentage points short of the datasheet figure, and the metal loss
is 4.800000 times what the datasheet number would give. The rate on that row is
0.402343 mm/yr.

## The engine says it in one sentence

> a 95 percent inhibitor at 80 percent availability gives 76.0 percent
> effective protection, which is 4.80 times the metal loss of the datasheet
> number: availability is what limits it

That last clause is the lesson of the module. Availability is what limits it.
Efficiency does not, once the chemical is good.

## Why the loss grows faster than the protection falls

The protection fell from 95.000000 percent to 76.000000 percent, a shortfall of
19.000000 percentage points. The metal loss went to 4.800000 times the
datasheet number. Those two figures describe the same row and they feel
different sizes, because what survives the corrosion inhibitor is the small
remainder and it is the remainder that sets the loss. Keep going down the
availability column and the loss keeps rising by the same amount for every
percentage point of availability lost, because the ratio is a straight line in
the availability.

| efficiency percent | availability percent | effective protection percent | shortfall pp | metal loss against the datasheet number |
| --- | --- | --- | --- | --- |
| 95.000000 | 80.000000 | 76.000000 | 19.000000 | 4.800000 |
| 95.000000 | 70.000000 | 66.500000 | 28.500000 | 6.700000 |
| 95.000000 | 50.000000 | 47.500000 | 47.500000 | 10.500000 |
| 95.000000 | 25.000000 | 23.750000 | 71.250000 | 15.250000 |

At 50.000000 percent availability the effective protection is 47.500000
percent, the shortfall is 47.500000 percentage points and the metal loss is
10.500000 times the datasheet number. At 25.000000 percent availability the
metal loss is 15.250000 times it. The chemical in all four of those rows is
still the same 95 percent product.

## The row the datasheet is describing

Go back up the availability column to 100.000000 percent, where the effective
protection is 95.000000 percent, the shortfall is 0.000000 percentage points
and the metal loss is 1.000000 times the datasheet number. That row is the only
one where the number on the container is the number on the wall. It also
requires the chemical to be present every hour of the year, with no shutdown and
no empty tank, so treating the datasheet figure as the protection treats an
unreachable case as the base case.

## What this means for a programme

Availability is an operations question. It is pump uptime, tank level, injection
point integrity and how long the truck takes to arrive. This module gives you a
way to price those things in metal, which is the only currency the wall
understands. Ten percentage points of availability, from 80.000000 to
90.000000 percent, take the metal loss on the same 95 percent product from
4.800000 to 2.900000 times the datasheet number, and the whole argument is two typed percentages and a division.

## Exercise

Record the effective protection, the shortfall and the metal loss ratio at
95.000000 percent efficiency for availabilities of 80.000000, 70.000000,
50.000000 and 25.000000 percent. Then state what happened to the efficiency
input across those rows, and say which of the two columns you recorded grows
faster as availability falls.
