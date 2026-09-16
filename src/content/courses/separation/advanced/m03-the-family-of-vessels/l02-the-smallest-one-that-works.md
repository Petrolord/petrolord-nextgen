# The smallest one that works

The preferred vessel is the smallest diameter in the list that is both feasible and inside the band. Two conditions, then the smallest survivor, and nothing about the order the diameters were typed in.

{{panel:fc-slug-explorer}}

## Reading a preference off the family

ABANA-2 prefers 7.000000 ft. The 5.000000 ft and 6.000000 ft rows are infeasible on gas capacity, so they are out however slender they are. The 8.000000, 9.000000 and 10.000000 ft rows are all feasible, and every one of them sits below the band at 2.908817, 2.042955 and 1.489314. The 7.000000 ft row at a slenderness of 4.342025 is the only row that satisfies both conditions, so `preferredStatus` reads selected.

ABANA-1 prefers 3.000000 ft in the same way. The 2.000000 ft row fails on gas, the 2.500000 ft row is feasible at a slenderness of 5.259484 and out of a band that stops at 4.000000, and 3.000000 ft is the smallest row that clears both tests.

## Why smallest

Diameter drives cost, and every larger feasible row also works. The preference is an economic tie-break applied after the engineering questions are settled: feasible first, in band second, smallest third.

## The rule that was retired

Before FC1-0 the sweep preferred the first row in list order that fell inside the band, and it did not ask whether that row worked.

| published case | preferred now | status | the retired rule preferred |
| --- | --- | --- | --- |
| horizontal2InBandButGasOverloaded | 8.500000 ft | selected | 7.500000 ft |
| verticalUnsortedListSmallestFeasible | 7.000000 ft | selected | 8.000000 ft |
| verticalNoneFeasible | null | none-feasible | 3.000000 ft |
| d1ProbeVertical4ftGasOverloaded | null | none-in-band | 4.000000 ft |

On horizontal2InBandButGasOverloaded the 7.500000 ft row is inRange true, feasible false, reasons gas-capacity, at a slenderness of 4.706969 and a length of 35.302269 ft. It is a perfectly proportioned drum that cannot carry its gas, and the retired rule recommended it because it was the first in-band row it met. The repaired sweep passes over it to 8.500000 ft, slenderness 3.233467, length 27.484466 ft, reasons none.

## Order in the list is not information

verticalUnsortedListSmallestFeasible is the case that isolates the other half of the defect. Its 7.000000 ft and 8.000000 ft rows are both feasible and both in the band of 1.000000 to 2.000000, at slendernesses of 1.291345 and 1.040882. The repaired rule takes 7.000000 ft because it is smaller. The retired rule took 8.000000 ft because that is where it happened to sit in the array.

A recommendation that depends on the order a user typed the diameters is not a recommendation about vessels.

## The mistake

The mistake is to accept a preferred diameter without reading the row it came from. The preference is a one line answer standing on a length, a slenderness, two flags and a reason list, and a reviewer who takes the diameter alone cannot tell a selected vessel from a null that was rendered as a blank.

The second mistake is to assume the preferred row is the best row. It is the smallest row that qualified. A larger feasible row with a much better gas margin may be the right vessel on a stream that surges, and the sweep prints every one of them so that judgement can be made.

## Exercise

State the three conditions that produce a preferred diameter, in the order they are applied, and give the preferred row for ABANA-2 with its slenderness. Then describe the retired rule, and explain using horizontal2InBandButGasOverloaded and verticalUnsortedListSmallestFeasible how it could recommend a vessel that failed and a vessel that was merely first.
