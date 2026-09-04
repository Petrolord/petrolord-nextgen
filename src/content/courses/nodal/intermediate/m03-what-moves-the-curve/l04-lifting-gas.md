# Lifting gas

Gas lift lightens the column and adds friction to it, with the same gas, at the same time. So there is a rate beyond which more gas costs more than it buys.

{{panel:pd-vlp-explorer}}

## Two effects, one input

Injected gas occupies pipe volume liquid would otherwise fill, so the column lightens: the lightening constant comes DOWN. The string also gets more crowded, so velocity rises and friction with its square: the friction constant goes UP.

| BONNY-7 change | Minimum rate, stb/d | Minimum bhp, psia |
| --- | --- | --- |
| lightening constant 375.00 stb/d | 627.069742 | 1476.243252 |
| lightening constant 187.50 stb/d | 561.403918 | 1159.998265 |
| friction constant 0.00064 | 627.069742 | 1476.243252 |
| friction constant 0.00128 | 455.992990 | 1656.374688 |

Same well, same quantity, same order of magnitude, opposite signs. FORCADOS-3 agrees, its 2348.191408 psia falling to 1912.118951 psia and rising to 2608.483199 psia under the equivalent pair.

## Why the trade must turn

The gravity term has a budget, 2150 psi on BONNY-7, and it decays towards zero with diminishing returns. BONNY-7 sheds from 2125.489174 psi at 4.32 stb/d to 601.970606 psi by 964.35 stb/d, then needs the whole remaining axis to reach 171.562832 psi at 4324.44 stb/d.

The friction term has no budget. A bounded benefit against an unbounded cost has one shape: the benefit wins first, because the cost starts at nothing, then the cost overtakes it and keeps going.

## Which wells it is for

The gravity share settles it before any gas moves. FORCADOS-3 is still at 0.53444210 by 2586.52 stb/d, with a 4310 psia dead column 590 psi above its reservoir pressure. BONNY-7 is down to 0.12887773 by 1924.38 stb/d, so lift gas there attacks a term that is already small and adds to one that is already large.

## The gas has to get down there

The injection side is a dry gas column of its own, and what it takes is not available at the valve. BONNY-7's gains 0.01432765 psi/ft. FORCADOS-3's carries 10.5 MMscf/d down a 2.125 in bore at a friction group of 0.02721909 and gains 0.15674503 psi/ft.

## What it refuses

There is no lift gas injection rate input. Mapping Mscf/d onto a column's weight needs a multiphase traverse with a real PVT stack, which the module declines to own. This is a study of what a lighter, rougher column does. It gives the SHAPE of the trade and never an optimum injection rate, and it cannot say where the gas goes in.

## The mistake

Watching only the pressure fall. The friction penalty is quadratic, so the early response is nearly monotone, and two low injection rates with a line through them build a model with no turning point in it.

The reverse error is as common: a flattening response read as an optimum, when it can equally be the two effects approaching cancellation, so the next increment makes things worse.

## Exercise

In the panel, halve BONNY-7's lightening constant from 375.00 to 187.50 stb/d and record the change in minimum pressure, then double its friction constant from 0.00064 to 0.00128 and record that.

Write the two side by side and say why their being comparable means a real well's response to more gas cannot be monotone.
