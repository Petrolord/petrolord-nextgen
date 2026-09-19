# The published example

{{panel:hy-protection-chemicals}}

The worked example of 29 CFR 1910.1000(d)(2) is 500.000000 against 1000.000000, 45.000000 against 200.000000 and 40.000000 against 200.000000. Its terms are 0.500000, 0.225000 and 0.200000, its index is 0.925000, and it does not exceed. The engine reproduces every one of those figures.

| component | concentration | limit | term |
| --- | --- | --- | --- |
| 1 | 500.000000 | 1000.000000 | 0.500000 |
| 2 | 45.000000 | 200.000000 | 0.225000 |
| 3 | 40.000000 | 200.000000 | 0.200000 |
| index | | | 0.925000 |

## Why a printed example matters

The regulation prints the rule and a case worked through it. When the engine reproduces the printed case, the rule has been checked against something a person other than the engine's author wrote down. The evidence class for the mixture index is published and reproduced: a value the source prints is matched at the precision it prints, and a misreading of the rule would miss it.

That matters more than it looks. An additive index is simple enough that almost anyone would code it correctly. The printed case is what turns "almost anyone" into a measured result. It is also the case to rerun first whenever you doubt a tool.

## Reading the example against the teaching mixture

The published example sits below unity at 0.925000 with its largest term at 0.500000. The teaching mixture of the previous lesson sits above unity at 1.059500 with its largest term at 0.385000. The mixture with the larger single term is the one that passes. The index does not care how the sum is shared out; it cares only about the sum. A mixture of many small terms can exceed where a mixture of one large term does not. So when you screen a mixture, rank the components by their terms and not by their concentrations: acetone at 385.000000 ppm and xylene at 31.200000 ppm carry terms of similar size, because each is divided by its own limit.

## What the door refuses

A limit of zero would divide by zero, so it is refused. A concentration below zero is refused, and so is an empty mixture. Each refusal names its field, in the engine's own words:

> components[0].limit must be a finite number above zero

> components[1].concentration must be a finite number, zero or more

> components must be a non-empty array

## What a concentration of zero means

A concentration of zero is accepted. It contributes a term of zero, which is the right answer for a component that is listed and absent. A limit of zero has no such reading, because no substance has an allowance of nothing, and that asymmetry is why one is accepted and the other refused.

## Exercise

Open the protection panel's mixture view and enter the three components of the published example. Record each term and the index, and check them against 0.500000, 0.225000, 0.200000 and 0.925000. Then compare the index with the teaching mixture's 1.059500, and state which of the two mixtures has the larger single term and which one exceeds.
