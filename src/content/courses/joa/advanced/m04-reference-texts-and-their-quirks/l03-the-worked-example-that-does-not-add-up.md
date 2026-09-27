# The worked example that does not add up

{{panel:joa-agreement-calculator}}

Rounding is one reason a printed figure differs from an exact one; an arithmetic error is another. This lesson reads a public guide whose worked example prints a wrong product.

## The text

OpenOil's Oil Contracts: How to read and understand them (version 1, November 2012, Creative Commons, read on 2026-09-26) is a public guide to petroleum contracts. Its state participation example taxes the companies' share of benefits:

> "25% of the international oil company's share of benefits = 25% of 49 million dollars" (OpenOil, Oil Contracts: How to read and understand them (version 1, November 2012))

and then prints the product:

> "This is calculated by: 0.25 x 49 = 11.75 million dollars" (OpenOil, Oil Contracts: How to read and understand them (version 1, November 2012))

## The check

The product of 0.25 and 49 is 12.25. The printed 11.75 is an arithmetic error of the book's own, and nothing about the example's rounding or terms explains it. A reader who copied 11.75 into a model would carry the error forward into every figure built on it.

## What the course does with the book

The validation record behind this engine keeps the OpenOil book out of every gate for that reason: no golden case is built from its example, and no figure of the engine is checked against it. The course teaches the example as a lesson in reading a source: quoted as printed, with the corrected arithmetic beside it.

## The rule this module draws

A figure copied from a reference text is checked before it is taught:

- a figure that differs from the exact one within the text's printed precision is rounding, and is quoted as printed and said to be the text's;
- a figure that differs by more is an error, and is shown with the arithmetic that corrects it;
- a figure that cannot be checked because the text omits its inputs is taught as the text's claim and graded nowhere.

The World Bank's 43 and 57 are the first kind. OpenOil's 11.75 is the second.

## Exercise

No view of the calculator computes the OpenOil tax, so apply the same check to a worked example it does compute. Open the agreement calculator on the view "PSC cost recovery", start from "World Bank Briefing Note 8, the two-barrel example", and check each printed line of that example against the engine: profit oil, contractor profit oil, income tax and the two totals. For each line, write whether the printed figure is exact, rounded or wrong, and give the arithmetic. Then write the one sentence you would put in a partner report about OpenOil's 11.75.
