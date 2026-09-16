# The outlet spec sets the load

A dehydration unit does not remove the water in the gas. It removes the difference between the water in the gas and the water the contract allows to leave. That difference is the load, and the number that sets it is a typed spec.

{{panel:fc-water-explorer}}

## One subtraction

OBIAFU arrives at 53.450380 lb per MMscf and has to leave at 7.000000 lb per MMscf, so 46.450380 lb per MMscf comes out. That is the whole of it. The inlet came from the conditions and the outlet came from a contract, and the unit is sized on the gap between them.

## The spec, moved

At a fixed rate of 62.000000 MMscfd and a fixed circulation of 3.200000 gal per lb:

| outlet spec, lb/MMscf | water out, lb/day | circulation, gpm | reboiler, MMBtu/hr |
| --- | --- | --- | --- |
| 7.000000 | 2879.9235 | 6.399830 | 0.697269 |
| 4.000000 | 3065.9235 | 6.813163 | 0.742302 |
| 2.000000 | 3189.9235 | 7.088719 | 0.772324 |
| 1.000000 | 3251.9235 | 7.226497 | 0.787335 |
| 0.500000 | 3282.9235 | 7.295386 | 0.794841 |

Read the direction. A tighter spec means more water out, more glycol and a larger reboiler, every time, and each of the three columns moves the same way.

Read the shape too, without putting a number on it. The inlet content is a ceiling. However tight the spec becomes, the unit can never remove more than the 53.450380 lb per MMscf that arrived, so the load approaches a limit rather than growing without end. Record the rows and watch that ceiling act on them. Do not put a ratio on how close any two rows sit, because the figures are printed here and the comparison between them is not.

## Why this matters more than it looks

A pipeline spec is usually inherited. It came from a contract somebody signed, and it arrives on a data sheet as a number with no argument attached. It is nevertheless the single input with the most direct grip on how much equipment gets built, because it sets the load and everything downstream is the load with multipliers applied.

The useful question when a dehydration unit looks expensive is therefore not always about the glycol. It is often whether the spec is the spec the contract actually requires, or a rounder and tighter number somebody wrote down once and nobody has revisited.

## What the load is not

The load is not the water in the gas. Reporting 53.450380 lb per MMscf as what the unit removes overstates the duty on every stream that has any spec at all above zero. The two numbers live one subtraction apart and they are easy to confuse on a busy data sheet.

## Exercise

Record the OBIAFU inlet content, the outlet spec and the load in lb per MMscf. Then take the spec table and say what happens to all three result columns as the spec tightens, and why the water removed cannot keep rising indefinitely.
