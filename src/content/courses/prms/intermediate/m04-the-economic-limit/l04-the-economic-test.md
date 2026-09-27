# The economic test

{{panel:prms-reserves-calculator}}

A case cut at its economic limit still has to pay for itself as a whole. The engine asks one question of each case: is its undiscounted net cash flow, after tax and abandonment, above 0? That is the economic test of PRMS 3.1.2.1, and it decides whether the project holds Reserves at all.

## The test, in the engine's words

The engine's basis, verbatim:

> SPE-PRMS 2018 (June 2018, v1.03 with the 2022 errata; CC BY-NC-ND 4.0, cited by section): 3.1.2.1 (undiscounted cumulative net cash flow above 0, ADR included), 3.1.2.8

ADR is abandonment, decommissioning and restoration. The test is undiscounted: the consolidated PRMS errata of May 2022 revise the glossary's meaning of economic to a zero percent discount rate, matching PRMS 3.1.2.1, and the engine applies it so.

## The best case decides the class

When the best case passes, the project holds Reserves. When it fails, the engine reports no Reserves and says the project stays in Contingent Resources. Three small golden inputs show the edge; each states one year with a low, best and high of 5000000, 7000000 and 9000000 barrels at 10 a barrel, and differs only in its capital:

| golden input | best case undiscounted net cash flow (engine) | best economic (engine) |
| --- | --- | --- |
| econ-exactly-zero-not-economic | 0.000000 | false |
| econ-best-fails | -10000000.000000 | false |
| econ-faq33-low-fails | 10000000.000000 | true |

The status on the first two, verbatim:

> not commercial: the best case fails the economic test (PRMS 2.1.2.2, 3.1.2.1); the project stays in Contingent Resources, economically not viable (PRMS 2.1.3.7.1)

## Exactly 0 is not economic: a reading

A net cash flow of exactly 0 is not above 0, so the engine calls it not economic. That is the engine's stated reading of the test, and it names the alternative: exactly 0 economic. No graded figure rests on the edge.

The test also includes abandonment, as the basis says. That too is a reading; the alternative the engine names is the test before the abandonment cost. On EKN-1 every case passes either way.

## The high case may not fail

If the best case passes, the high case on the same costs and prices must pass too, because a high forecast that loses money when the best makes money describes no sensible range. The engine refuses it, verbatim:

> forecasts.high must be a forecast that is economic when the best case is (tested on the same costs and prices, PRMS 2.2.0.3: an undiscounted net cash flow above 0); got -5000000

The low case is different. It may fail while the best passes, and the next lesson shows what the engine does then.

## On EKN-1

All three Ekene Main cases pass: the low at 156927914.662500, the best at 382377266.937500 and the high at 651707494.450000, each at 100 percent. The status reads, verbatim:

> Reserves: the best case is economic (PRMS 2.1.2.2, 3.1.2.1)

## Exercise

Work in the reserves calculator, in the view "The economic limit and the entitlement".

1. Start from "An undiscounted net cash flow of exactly 0". Read each case's net cash flow and verdict, and the status.
2. Start from "The best case fails" and read the status. Compare the two starts' capital in the box.
3. Start from "The FAQ 3.3 figures: the low case fails". In the box, change the high forecast's oil to a figure of your own whose revenue at 10 a barrel falls short of the capital of 60000000, and read the refusal.
4. On "EKN-1 Ekene Main waterflood, net entitlement", read the economic column and the status.
