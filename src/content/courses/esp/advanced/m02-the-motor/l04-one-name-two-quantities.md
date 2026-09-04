# One name, two quantities

`loadFraction` appears in two functions in one domain and holds two different quantities. Neither is wrong, which is what makes it harder to find than a wrong number.

{{panel:pd-power-explorer}}

## A motor that is overloaded and not overloaded

The teaching well QUA-IBOE-4 runs 95.41621294 hp of shaft on a 100 hp plate. Its electrical load fraction is 0.9541621294 and never moves.

| Derate, percent | Selection fraction | Gap, points | Warnings |
| --- | --- | --- | --- |
| 0 | 0.9541621294 | 0.000000 | none |
| 5 | 1.0043811889 | 5.021906 | motorOverloaded |
| 10 | 1.0601801438 | 10.601801 | motorOverloaded |
| 20 | 1.1927026618 | 23.854053 | motorOverloaded |

At a 5 percent derate the selection fraction crosses one and sizing declares the motor overloaded, while the fraction the amps are built on stays at 0.9541621294 and declares nothing. The same motor on the same well is overloaded and not overloaded, depending on which module you ask.

The published highWaterCut design crosses in the same way, later: 0.9804525682 at 12 percent with only a downthrust warning, then 1.0150567765 at 15 percent with downthrust and motorOverloaded together, against an electrical fraction fixed at 0.8627982600.

## Why this verdict came out differently

Two complaints of the same shape reached the same review. The two brake powers were two computations of one quantity, the power the pump absorbs, so at most one of them can feed the electrical chain and the choice was recorded as an open decision. The two load fractions are two different quantities that happen to share a name, so both computations stand and the name is the whole defect.

That is the test to apply. Ask whether the two numbers are one thing computed twice or two things wearing one label. The first is a bug about arithmetic. The second is a bug about vocabulary, and it is fixed by naming, not by changing a value.

## What it refuses

The engine refuses to distinguish them in its output. Two functions return a field called `loadFraction` with no qualifier, no unit and no cross reference, and nothing fires when they sit 23.854053 points apart.

It also refuses to reconcile the warnings. Sizing raises motorOverloaded while the current module raises nothing, and neither knows the other exists.

## The mistake

Carrying the sizing figure into an electrical calculation because a variable of that name was already in hand. On the teaching well QUA-IBOE-4 at a 20 percent derate that substitutes 1.1927026618 for 0.9541621294, which is 23.854053 points of overstatement in the current, the voltage drop and the cable selection all at once. The design report and the electrical report would then disagree, and both would be internally consistent.

## Exercise

Read both load fractions for the teaching well QUA-IBOE-4 at 0, 5 and 20 percent derate, and record which warning appears at which derate.

Then write one sentence saying why the same well is reported overloaded by one module and not by the other, and one sentence saying what would have to change for that to be a defect in the arithmetic rather than in the naming.
