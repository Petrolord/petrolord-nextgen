# Where the floor and the fraction change places

A maximum of two things has a crossover, and this one can be found without reading any code. Two independent routes reach it, and what sits either side of it is the reason a margin rule is worth understanding as a margin rule.

{{panel:fc-suction-explorer}}

## The crossover, twice

The first route is measurement. Halve the required NPSH until the engine's own answer stops being the floor, and the required NPSH where the two halves are equal comes out at 8.571428571 ft.

The second route is arithmetic on the two halves already measured: the floor of 3.000000000 ft over the fraction of 0.350000000. That gives 8.571428571 ft as well.

Two routes, one figure. That is worth more than either route alone, because the first is a property of the running engine and the second is a property of the rule, and their agreement says the engine implements the rule it appears to implement.

## Either side of it

| required NPSH ft | required margin the engine applies ft | the half that bound | the available head that exactly satisfies it ft | the ratio there |
| --- | --- | --- | --- | --- |
| 4.000000 | 3.000000 | the floor | 7.000000 | 1.750000000 |
| 16.000000 | 5.600000 | the fraction | 21.600000 | 1.350000000 |
| 12.000000 | 4.200000 | the fraction | 16.200000 | 1.350000000 |
| 30.000000 | 10.500000 | the fraction | 40.500000 | 1.350000000 |

Below the crossover the floor is the larger of the two and it sets the required margin. Above it the fraction is larger and the fraction sets it.

## The trap in the last column

Read the three rows the fraction governs and the boundary ratio is the same number on each of them. A reader who only ever works at required NPSHs of that size will see 1.350000000 every time and conclude that this package applies a rule on the ratio of available head to required head.

It does not. On the row the floor governs, the ratio at the boundary is 1.750000000. Read the two governed rows against each other: at a required NPSH of 16.000000 ft the boundary ratio is 1.350000000 and at 4.000000 ft it is 1.750000000, a difference of 0.3999999999999999.

A margin rule and a ratio rule are not the same rule. They agree over the range where one half of the maximum happens to bind, and they part company as soon as the other half takes over. The three fraction rows are exactly the evidence that hides the difference, and the floor row is the one that reveals it.

## Why this matters on small pumps

The pumps whose required NPSH falls under the crossover are the ones where the floor governs, and those are the cases where a remembered ratio gives the wrong answer. A reader carrying 1.350000000 in their head applies it at a required NPSH of 4.000000 ft and asks for less margin than the engine does, and the shortfall is not visible in the arithmetic because the arithmetic is a correct application of the wrong rule.

## The mistake

The mistake is generalising a boundary ratio into the rule. The ratio is an output of the rule at a stated required NPSH. Turning an output into a rule works until the case moves across 8.571428571 ft, and then it fails silently.

## Exercise

Give the crossover required NPSH and both routes that reach it. Then state which half of the maximum binds at required NPSHs of 4.000000 ft and 30.000000 ft, give the boundary ratio on each, and explain why the three fraction rows alone would mislead a reader about what the rule is.
