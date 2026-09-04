# What this engine models

Three straight-line ideas, one real gas column, and a recursion that walks a string down a well until the pressure stops paying.

## The three lines

The injection line is the real gas casing column from the surface injection pressure, marched with a compressibility factor at every step and never taken as a flat 0.02 psi/ft rule of thumb. The unloading line is the kill fluid gradient from the fluid level down, 0.45 psi/ft on `westTexasOil`. The transfer line is the production pressure the tubing shows while unloading, the wellhead pressure plus a lifted gradient, 114.7 psia and 0.1 psi/ft on the same case. One of the three is computed from gas properties at pressure and temperature. Two are declared by the designer and carry no physics at all, which is worth remembering every time a design looks precise.

## Two conventions, one recursion

`surfaceClose` drops the surface injection pressure a fixed amount per valve. On `westTexasOil` at 25.00 psi per valve the eight stages run 1014.7000, 989.7000, 964.7000, 939.7000, 914.7000, 889.7000, 864.7000 and 839.7000 psia. `constantPressure` holds it: `constantPressurePPO` declares 0.00 psi per valve and shows 1114.7000 psia at all six stages, leaning on its 100.0 psi transfer differential alone. Same recursion, different decrement.

## How closely it has been checked

Each published quantity carries an independent oracle value beside the shipped engine value.

| Quantity | Golden | Engine | Difference |
| --- | --- | --- | --- |
| Column at 8000 ft, psia | 1215.716705320 | 1215.716830429 | 1.251e-4 psi |
| z at 500.0 psia, 100.0 degF | 0.932572676 | 0.932572676 | -2.229e-13 |
| Dome at 120.0 degF, psia | 675.573876944 | 675.573876944 | -1.728e-11 psi |

Valve depths agree too: the largest depth difference from the golden is 8.030e-4 ft on `westTexasOil` and 2.047e-4 ft on `constantPressurePPO`. On a string whose shallowest mandrel sits at 2119.249994721 ft, eight ten-thousandths of a foot is not a disagreement about anything.

## The mistake

Reading that agreement as correctness. It says the shipped engine and an independent implementation carry out the same construction and land in the same place. It does not say the construction is right, and where both sides share an assumption the agreement is silent: `westTexasOil` lands its deepest mandrel 131.375432376 ft from its neighbour against a stated 250.0 ft minimum, and the goldens record that without complaint because the oracle mirrors the same branch.

## What it refuses

It does not solve the well's inflow and it does not solve multiphase outflow. The flowing production traverse used to find the deepest injection point is passed in as a depth and pressure table, so the caller builds it from a validated nodal model rather than this module inventing a gradient.

## Exercise

Write the surface injection pressure at every stage of `westTexasOil` and of `constantPressurePPO`.

Then state in one sentence what a decrement of 0.00 psi per valve leaves the recursion with, and which declared input has to do that work instead.
