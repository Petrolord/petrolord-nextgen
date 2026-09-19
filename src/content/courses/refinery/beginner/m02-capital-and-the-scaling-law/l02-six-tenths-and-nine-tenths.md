# Six tenths and nine tenths

The economy of scale in this screen is one number, the exponent, and the exponent is an input. modularRefinery carries two of them, and the screen prints both laws side by side so you can see what the choice does.

{{panel:refinery-screen-explorer}}

## The two laws

SCALING_EXPONENT holds STICK_BUILT 0.6 and MODULAR 0.9. A stick-built refinery is erected piece by piece on its site. A modular refinery arrives as skid-mounted units built in a yard, and a bigger modular plant tends to mean more modules. The two exponents are the screen's way of saying those two ways of building grow in cost differently with size.

scaleComparison takes OKORDIA's quotation of 64000000.00 for 5000 bpd and prints both laws at each capacity:

| capacity (bpd) | modular cost (0.9) | stick-built cost (0.6) |
| --- | --- | --- |
| 1000 | 15035122.47 | 24366770.42 |
| 2500 | 34296750.80 | 42224253.14 |
| 5000 | 64000000.00 | 64000000.00 |
| 10000 | 119428222.92 | 97005860.26 |
| 20000 | 222860944.20 | 147033389.44 |
| 30000 | 321008180.00 | 187529987.30 |

## A third exponent for comparison

An exponent of 1 means cost in proportion to capacity: no economy of scale at all. The same quotation scaled with an exponent of 1 to 10000 bpd gives 128000000.00. Set beside the 10000 bpd row, that gives three readings for the same plant: 119428222.92 on the modular law, 97005860.26 on the stick-built law and 128000000.00 in proportion.

The exponent is doing all the work. The quotation, the reference capacity and the target capacity are identical in all three. The only thing that moves is the power the capacity ratio is raised to. Three exponents give three costs for one plant from one quotation, and nothing in the quotation says which of them is right.

## What the exponent means

Read the exponent as how strongly cost resists growing with size. At 1, cost is in proportion to capacity, and the screen shows no economy of scale. Below 1, cost grows more slowly than capacity. The lower the exponent, the more slowly it grows. So 0.6 carries a strong economy of scale and 0.9 a weak one.

That reading is what the table shows. Above the reference size, the law with the strong economy of scale gives the lower cost: at 30000 bpd the stick-built law prints 187529987.30 and the modular law 321008180.00. Below the reference size the same property runs the other way, and at 1000 bpd the modular law prints 15035122.47 against the stick-built law's 24366770.42. The engine prints a flag for exactly this comparison, which the next lesson reads.

## Why both laws are on the screen

A screen that printed one law would hide the most consequential assumption on the page. Printing both makes the argument explicit: a small plant is where modular construction is being tested against stick-built, and the screen can show at what size each is cheaper on these two exponents. The next lesson reads that directly off the ratio and the flags the engine prints.

The exponents themselves are defaults, and the last lesson of this module says how to treat them.

## The mistake

Quoting one of the two costs without its exponent. "A 20000 bpd plant costs 222860944.20" is incomplete; it is the modular law's figure, and the stick-built law puts the same plant at 147033389.44. Both come from the same quotation.

## Exercise

Read the 10000 bpd row of the table and the exponent of 1 figure for the same capacity. List the three costs with the exponent that produced each. Then say what property of the exponent orders them, and which of the three assumes no economy of scale at all.
