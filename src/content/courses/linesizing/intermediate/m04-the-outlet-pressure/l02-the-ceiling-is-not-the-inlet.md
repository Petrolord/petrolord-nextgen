# The ceiling is not the inlet

The bracket the solver searches ends where the driving group vanishes. That pressure is the inlet divided by the square root of e to the s, and on any line with a hill on it that is not the inlet.

{{panel:fc-gasline-explorer}}

## Where the bracket really ends

| elevation change ft | e to the s | the outlet the rate approaches as it falls to nothing, psia | against the inlet, psi |
| --- | --- | --- | --- |
| 0.000000 | 1.0000000000 | 850.000000 | 0.000000 |
| 1500.000000 | 1.0828513009 | 816.835331 | -33.164669 |
| -1500.000000 | 0.9234878318 | 884.511201 | 34.511201 |
| 3000.000000 | 1.1725669398 | 784.964657 | -65.035343 |
| -3000.000000 | 0.8528297754 | 920.423606 | 70.423606 |

Each ceiling on that table is the trunk's own inlet of 850.000000 psia divided by the square root of the engine's e to the s on that row.

## Three cases, and only one of them is the inlet

A flat line ends its bracket at its own inlet, 850.000000 psia, because e to the s is exactly one and the square root of one changes nothing. That single case is where the intuition comes from, and it is the only case in which the intuition is right.

A descent ends the bracket above the inlet. At 3000.000000 ft of fall the ceiling is 920.423606 psia, which is 70.423606 psi above where the gas entered. The column of gas recovers more head than the friction spends, so outlets above the inlet are real operating points rather than nonsense.

A climb ends it below. At 3000.000000 ft of rise the ceiling is 784.964657 psia, 65.035343 psi below the inlet, because the column costs head that no rate gets back.

## What the fourth column is

The fourth column measures the difference between the bracket the physics asks for and a bracket that runs from atmospheric to the inlet. Reading it is reading how much of the answer such a bracket would have been unable to express.

It is worth being exact about the two ways that goes wrong, because they are opposite. On a descent the inlet-capped bracket is too short: the answer can sit above it, and a search that cannot reach a value cannot return it. On a climb the inlet-capped bracket is too long: its upper reach lies past the pressure where the group has already vanished, in a region where there is no rate to be found.

## Why this is the most interesting number in the course

Everywhere else in this engine a hill changes an answer. Here it changes the range of answers that exist. The ceiling is not an implementation detail of a bisection, it is the statement that at a given inlet and a given slope there is a pressure the outlet simply cannot be above, however little gas is moving.

## Reading a ceiling in practice

The ceiling is not an exotic quantity. It needs the inlet and the elevation group, both of which the engine already returns, and it is worth working out before a solve rather than after. A target outlet above the ceiling on a climb, or below atmospheric on any line, is a question with no answer inside this method, and knowing that in advance turns a refusal from a surprise into a confirmation.

## The mistake

The mistake is the assumption underneath all of this, that an outlet is always below an inlet. It is true on a flat line and it is false on every descending one.

## Exercise

Write the ceiling on the SOKU trunk at elevation changes of 0.000000, 1500.000000, -1500.000000, 3000.000000 and -3000.000000 ft, and say how each is obtained from the inlet. State which of the three cases puts the ceiling at the inlet. Then explain the two opposite ways a bracket ending at the inlet fails.
