# Four location classes

B31.8 asks what is around the pipe and answers with a design factor. B31.4 asks nothing about the route at all. The same steel at the same pressure therefore has two different legal walls depending on which code the line is built to.

{{panel:fc-wall-pig-explorer}}

## The table the module carries

| location class | design factor |
| --- | --- |
| 1 | 0.720000 |
| 2 | 0.600000 |
| 3 | 0.500000 |
| 4 | 0.400000 |

Class 1 is the emptiest route and Class 4 the most populated. The factor falls as the surroundings fill up, and because it divides, a falling factor is a thickening wall.

B31.4 uses a flat design factor of 0.720000 whatever the route, which is the same number B31.8 gives to Class 1.

## What the route costs, on one pipe

SOKU, unchanged: 1200.000000 psig on 12.750000 in at 52000.000000 psi with an allowance of 0.125000 in.

| code | class | design factor | pressure wall in | required wall in | MAOP of the required wall psig |
| --- | --- | --- | --- | --- | --- |
| B31.8 | 1 | 0.720000 | 0.204327 | 0.329327 | 1200.000000 |
| B31.8 | 2 | 0.600000 | 0.245192 | 0.370192 | 1200.000000 |
| B31.8 | 3 | 0.500000 | 0.294231 | 0.419231 | 1200.000000 |
| B31.8 | 4 | 0.400000 | 0.367788 | 0.492788 | 1200.000000 |
| B31.4 | any | 0.720000 | 0.204327 | 0.329327 | 1200.000000 |

Class 4 asks for 1.800000 times the pressure wall of Class 1 on the same pipe at the same pressure. The route moved it. The fluid, the diameter, the yield and the design pressure all stood still.

Read the pressure wall column on its own for a moment. It runs from 0.204327 in to 0.367788 in across the four classes while every input except the design factor holds still, which is the clearest statement in this module that a code factor is an engineering decision rather than a calculation.

## Every row rates back to the same pressure

The last column reads 1200.000000 psig on all five rows. That is the design working as intended rather than a coincidence: each required wall was derived from 1200.000000 psig, so reading the rating back off it returns the pressure it came from, whichever class produced it.

A thicker wall is not a higher rating here. It is the same rating bought under a stricter factor.

## The B31.4 row is not a shortcut

B31.4 and B31.8 Class 1 land on the same wall for this pipe because the two factors are the same number. They agree on the arithmetic without making the same statement. One has looked at the route and found it empty. The other has not looked.

So a B31.4 line does not become a B31.8 Class 1 line, and a route survey cannot be skipped by quoting the agreement.

## The mistake

The mistake is carrying one wall across a class boundary. A line that leaves a Class 1 stretch and enters a Class 3 stretch needs the Class 3 wall on the Class 3 stretch, and the 0.329327 in rolled for the empty end is thinner than the 0.419231 in that stretch demands.

The second mistake is reading the class as a property of the pipeline. It is a property of each stretch of route, so one line can hold several, and the wall schedule changes where the surroundings do.

## Exercise

Give the four B31.8 design factors and the flat factor B31.4 uses, and say which class B31.4 matches. Then give the SOKU pressure wall at Class 1 and at Class 4 with the multiple between them, and explain why the MAOP column reads 1200.000000 psig on every row of the table.
