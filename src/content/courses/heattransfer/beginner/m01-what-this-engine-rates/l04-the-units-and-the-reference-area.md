# The units and the reference area

This engine works in field units and it works in them everywhere. Duties are Btu an hour. Temperatures are degF. Mass flows are lb an hour. Surfaces are ft2. Coefficients are Btu an hour per ft2 per degF. Resistances are hr.ft2.F per Btu. Diameters are inches. The air cooler adds psia, inches of water and brake horsepower. Nothing converts silently and nothing is metric.

{{panel:fc-exchanger-explorer}}

## How many decimals a figure is worth

Temperatures, log means, surfaces, coefficients, diameters, percentages and dimensionless groups are printed to six decimals in this course. Duties, capacity rates and the UA product are printed to four. Resistances are printed to nine, because the interesting ones are small and a resistance rounded to six decimals loses the term you were trying to see. Counts of tubes and shells are whole numbers.

Those are reporting conventions and not claims about accuracy. Six decimals on a surface does not mean the surface is known that well. It means the arithmetic reproduces that far, which is what lets you check a chain step by step and find where your figure and the engine's parted company.

## A coefficient without its reference area is not a number

An overall coefficient is a number per unit of area, so it means nothing until you say which area. This module refers its coefficient to the OUTSIDE tube surface, and it says which area on every single answer, in the words `outside tube surface (do)`.

A second export inside this same engines package is called overallU and is referred to a stated bore instead. Those are different numbers for the same physical exchanger, and a value carried from one to the other is wrong by the ratio of the two areas. So no lesson here says the overall coefficient without naming the area it is referred to.

## Two words that already mean something else

Fouling in this course is a heat-transfer resistance, in hr.ft2.F per Btu, and it appears as a term in the sum that makes up the coefficient. The Separation course uses the same word for a mist extractor fouling, which is a different quantity with different units and a different remedy. Check which one a document means before you carry a number.

Approach is the other one. It already carries a separation meaning and a compression meaning elsewhere in this module family, so this course names the quantity it wants instead. The driving force here is the log mean of the two end temperature differences, and that phrase is used every time.

## The letter P

P in this course is a dimensionless temperature group and it is nothing else. Nothing in heat exchange here is a percentile, so no P ten or P fifty belongs anywhere near these answers. Find out which of the two a P means before you use it.

## Exercise

List the six units this engine uses that you would have to convert to work in SI, and write the conversion beside each. Then write one sentence saying what would go wrong if an overall coefficient referred to the outside tube surface were used in a calculation that expected one referred to the bore.
