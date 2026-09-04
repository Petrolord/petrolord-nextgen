# Marching back up

Given a pressure at depth, what surface pressure produced it? The answer is a secant search on the forward march, which makes the inverse exactly as good as the march and no better.

{{panel:pd-column-explorer}}

## The round trip

Each published column is marched down to its packer, and the resulting depth pressure is handed back to the inverse.

| Column | Depth pressure, psia | Surface recovered, psia | Closure, psi |
| --- | --- | --- | --- |
| 1 | 1215.716705320 | 1014.700000000 | -1.930e-10 |
| 2 | 1841.239804452 | 1414.700000000 | -2.819e-10 |
| 3 | 668.597603196 | 614.700000000 | -2.940e-10 |

All three close to well under a millionth of a psi, on columns lifting 201.016705, 426.539804 and 53.897603 psi. It looks like proof of something.

## What the closure is actually made of

Run the same round trip on the shipped engine at its 40 step default and the errors line up in pairs. Column 1 goes down 1.251e-4 psi heavy and comes back to 1014.699897424 psia, which is -1.026e-4 psi light. Column 2 goes down 9.973e-4 psi heavy and returns 1414.699251483 psia, -7.485e-4 psi light. Column 3 goes down 1.209e-5 psi and returns 614.699988946 psia, -1.105e-5 psi.

The inverse inherits whatever the forward march did and then undoes it. Both directions use the same stepping, so both carry the same truncation, and the return trip subtracts an error the outward trip added.

## The mistake

Treating a closing round trip as validation. A closure of -1.930e-10 psi says the two directions of one routine agree with each other. It cannot detect a wrong gradient, a wrong compressibility factor or a wrong constant, because every one of those would be applied identically going down and coming back.

Compare that with a check against something outside the routine. The same march, isothermal with z pinned at 1, sits 2.6688e-4 psi from the closed form built on the engine's own coefficient 0.0187417041 at 40 steps, and -8.5612e-2 psi from the one built on the rounded textbook 0.01875. Each of those two numbers reports something a round trip cannot: the first is how well the walk is walking, the second is a disagreement between two formulations of the same law. A closure of -1.930e-10 psi reports neither, and it is the number that looks most impressive.

## What the inverse refuses

It returns a surface pressure. It does not report a confidence, it does not tell you the column it inverted was the right column, and it says nothing about the well between the two depths, because that column is static and carries no flow.

## Exercise

Invert each of the three published depth pressures and record the surface pressure and the closure.

Then write, beside each closure, the forward difference at the 40 step default, and say what the pairing of those two numbers rules out and what it does not.
