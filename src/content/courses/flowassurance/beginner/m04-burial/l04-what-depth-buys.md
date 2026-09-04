# What depth buys

Depth is bought by the foot and paid for in acosh, and acosh is a logarithm. The first foot of cover is worth a great deal and the tenth is worth very little.

{{panel:pd-thermal-explorer}}

## The published pipe, driven down

The published 8.625 in coated diameter in wet soil at k 1.2, with only the depth to centreline moved. The 4.000000 ft row is the published build; every other row is a derived sweep point on published inputs.

| Depth to centreline, ft | Ground resistance | U of the buried build | Ground share, percent |
| --- | --- | --- | --- |
| 1.000000 | 0.2231567198 | 0.9062381451 | 32.110845 |
| 2.000000 | 0.3185103955 | 0.7968974908 | 40.301898 |
| 3.000000 | 0.3728922550 | 0.7455927364 | 44.145299 |
| 4.000000 | 0.4112572083 | 0.7132000377 | 46.571938 |
| 6.000000 | 0.4651830320 | 0.6721535435 | 49.646860 |
| 10.000000 | 0.5330096535 | 0.6267818956 | 53.045793 |
| 20.000000 | 0.6249732901 | 0.5742267291 | 56.982867 |

Resistances in hr ft degF/Btu per foot, U in Btu/(hr ft2 degF), all referred to the 6.065 in bore.

## The return falls off, and it falls off early

Doubling the depth does not double the ground term. From 1.000000 ft to 2.000000 ft the shape factor moves by a factor of 1.42729466. From 10.000000 ft to 20.000000 ft the same doubling moves it by 1.17253653. Once 2H/D is past about two, acosh is growing like a logarithm and there is nothing left in it.

The U column says the same thing in the currency a design cares about. Driving the published trench from 4.000000 ft to 20.000000 ft takes the coefficient from 0.7132000377 to 0.5742267291 Btu/(hr ft2 degF), and the trench still carries only 56.982867 percent of the stack.

## Where the whole term goes

At the floor the pipe lies on the seabed. Half the coated diameter is 0.35937500 ft, 2H/D is exactly 1.00000000, acosh is 0.0000000000, and the buried build returns 1.3348791131 Btu/(hr ft2 degF), the exposed answer to the last figure. Cover added from there is the steepest part of the curve. Cover added at 10.000000 ft is the flattest.

## The mistake

Pricing a trench per foot. Somebody reads 0.4112572083 at 4.000000 ft, wants twice the resistance, and specifies a trench twice as deep. What arrives at 6.000000 ft is 0.4651830320 and at 20.000000 ft is 0.6249732901, and neither is close to what was budgeted. A trench is dug by the foot. The resistance it buys does not arrive by the foot, and no return from the module warns anybody about the difference.

## What depth will not buy

Certainty that the pipe is still in the trench. The term is a shape factor and a conductivity, and it returns a number to ten places for any depth it is handed, including one the line has since scoured out of.

## Exercise

Read the ground resistance and the overall U at 1.000000 ft, 4.000000 ft and 20.000000 ft in the panel.

Then say which of those steps you would pay for, and why the last is hard to justify.
