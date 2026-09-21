# Four thermal presets that disagree

{{panel:cq-harm}}

The engine carries four thermal probit presets, and at the same heat flux and exposure time they can give answers far apart. None of them is an engine mistake. Each is transcribed from a named published source, and the engine names each by its origin so that nobody mistakes one for another. This lesson reads them side by side.

## The four presets

| preset | a | b | intensity unit | source |
| --- | --- | --- | --- | --- |
| eisenberg | -14.9 | 2.56 | kW/m2 | OSD/30 Table 17: Eisenberg et al. (1975) |
| tsao-perry | -12.8 | 2.56 | kW/m2 | OSD/30 Table 17: Tsao and Perry (1979) |
| lees | -10.7 | 1.99 | kW/m2 | OSD/30 Table 17: Lees (1994) |
| purple-book | -36.38 | 2.56 | W/m2 | TNO Purple Book CPR 18E (1999) eq. 5.4 |

Eisenberg and Tsao and Perry share b and differ only in a. At 20000 W/m2 for 20 s the Eisenberg probit is 2.994507 and Tsao and Perry gives 5.094507, derived 2.100000 probit units higher. In probability that is 0.022455 against 0.537647: a few percent of the people exposed under one preset and most of them under the other.

## The Purple Book form is Tsao and Perry

A heat probit labelled "TNO" is easily taken for Eisenberg. The Purple Book's -36.38 + 2.56 ln(Q^(4/3) t), with Q in W/m2, is Tsao and Perry rewritten in W/m2: -12.8 - 2.56 ln(1e4) is -36.378. The Purple Book prints -36.38, and its probit at 20000 W/m2 for 20 s is 5.092979 against Tsao and Perry's 5.094507. Two tables that look independent are one preset in two units.

## The lethal doses the source prints

OSD/30 Table 17 prints, for each named preset, the thermal dose that kills one percent and fifty percent, in (kW/m2)^(4/3) s. The engine's lethal doses against them (golden):

| preset | engine lethal dose for one percent | printed | engine lethal dose for fifty percent | printed |
| --- | --- | --- | --- | --- |
| eisenberg | 957.866291 | 960 | 2376.626918 | 2380 |
| tsao-perry | 421.742820 | 420 | 1046.414670 | 1046 |
| lees | 829.172848 | 828 | 2668.968204 | 2670 |

These printed lethal doses are what makes the three OSD presets graded quantities in this course.

The same table carries a TNO row, a = -15.3 and b = 3.02, and prints lethal doses of 389 and 841 for it. Those do not follow from the row's own coefficients, which give 384.344943 and 830.355817 in the golden. The source does not say which half of the row is wrong, so the engine carries no such preset. Ask for it by that name and the engine refuses:

> coefficients: unknown preset 'tno'; one of eisenberg, tsao-perry, lees, purple-book, or give { a, b } explicitly

The erratum belongs to the published table.

## What the disagreement means

The spread between presets is information about the sources behind them, and a consequence note treats it that way. It names the preset it used and its source, shows the others beside it, and says why it chose. A reader who sees only one preset cannot tell whether the answer sits at the cautious or the generous end of the published range. Because every preset is named by its origin, the choice is visible in every result the engine returns.

## Exercise

On the harm panel's probit view, enter 35000 W/m2 for 10 s and read all four presets. Compare your readings with the engine's sweep, where Eisenberg gives 0.030756 and Tsao and Perry 0.591034. Then write the paragraph a consequence note would carry for this exposure: which preset you used, why, and the other presets' probabilities shown beside it.
