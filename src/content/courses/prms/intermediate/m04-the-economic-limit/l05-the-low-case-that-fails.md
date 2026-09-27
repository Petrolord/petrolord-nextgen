# The low case that fails

{{panel:prms-reserves-calculator}}

The best case can pass the economic test while the low case fails. The project is then commercial, so it holds Reserves, yet the low forecast does not pay. PRMS 3.1.2.8 and answers 3.3 and 3.4 of the PRMS FAQs (November 2022, answers dated October 2022) settle what to report, and the engine follows them: 1P is 0, the 2P and 3P stand, and the low-case barrels stay inside the 2P.

## The FAQ's own figures

Answer 3.3 works an example with a technical low outcome of 5 and a best estimate of 7. The course cites its numbers only. The golden input econ-faq33-low-fails states them as a one-year project: low, best and high of 5000000, 7000000 and 9000000 barrels, an oil price of 10, capital of 60000000, no royalty, tax or opex, and the licence ending in the same year. The engine returns:

| case | undiscounted net cash flow at 100% | economic | reported oil |
| --- | --- | --- | --- |
| low | -10000000.000000 | false | 5000000.000000 |
| best | 10000000.000000 | true | 7000000.000000 |
| high | 30000000.000000 | true | 9000000.000000 |

| category | oil |
| --- | --- |
| 1P | 0.000000 |
| 2P | 7000000.000000 |
| 3P | 9000000.000000 |
| P1 | 0.000000 |
| P2 | 7000000.000000 |
| P3 | 2000000.000000 |

The engine's reason on the low case, verbatim:

> the low case is not economic: 1P = 0 and the 2P and 3P estimates stand (PRMS 3.1.2.8; FAQ 3.3); the low case quantities remain within 2P; FAQ 3.4 keeps them out of 1C, since a project carries a single classification

## Reading the result

The 1P is 0.000000 because no quantity can be called proved when the low forecast does not pay. The 2P is 7000000.000000, the whole best estimate, so the Probable (P2) increment is 7000000.000000: the low-case barrels are inside it. The Possible (P3) is 2000000.000000.

The low-case barrels are not moved to Contingent Resources. A project carries one classification, and this one is Reserves. Splitting it into a 1C and a 2P would give one project two classes.

## The same figures when the low case passes

State the same set as increments of 5, 2 and 3 MMbbl (golden input cat-faq33-incremental) and the engine returns 1P 5.000000, 2P 7.000000 and 3P 10.000000. The shape is the same; there the low case is taken as passing, so its barrels become the 1P.

The panel shows the result in a tile of its own: "1P set to 0 (the low case fails)", true or false.

## Why it matters

A company with a marginal low case could be tempted to report a 1P from barrels that do not pay. The rule stops that, and the reasons show the verdict on each case so a reader can see why the 1P is zero.

## Exercise

Work in the reserves calculator, in the view "The economic limit and the entitlement".

1. Start from "Low case fails (FAQ 3.3 example)". Read each case's verdict, the category table and the tile "1P set to 0 (the low case fails)".
2. In the box, lower the capital until it equals the low case's revenue, its 5000000 barrels at 10 a barrel. Read the low case's net cash flow and verdict, and the tile, and explain the result from the economic test.
3. Lower the capital again, to any figure of your own below that revenue, and read the 1P.
4. Open the view "Incremental and cumulative categories", choose the start "Incremental example (FAQ 3.3)" and set the first, second and third increments to 0, 7 and 2. Compare the categories, in MMbbl, with the ones in step 1.
