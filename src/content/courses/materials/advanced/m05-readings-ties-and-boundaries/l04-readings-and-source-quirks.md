# Readings and source quirks

{{panel:materials-spares-calculator}}

The engine's figures are checked against printed sources, and a printed source has habits of its own: it rounds, it reads a table to two places, and now and then it slips. This lesson names every text the course used, with its edition, licence and the date it was read, and reads the quirks each one carries.

## The texts, as the course read them

Every text below was read on 2026-09-27.

| text | edition or date | licence | how the course uses it |
| --- | --- | --- | --- |
| Harris, "How Many Parts to Make at Once", Factory 10(2) | February 1913, read in the 1990 Operations Research reprint | public domain | quoted, with citation |
| C. Caplice, MIT ESD.260J Logistics Systems, lectures 7, 8, 11, 12 and 13 | Fall 2006 | MIT OpenCourseWare, CC BY-NC-SA 4.0 | figures cited by lecture and slide only |
| MIL-HDBK-338B, Electronic Reliability Design Handbook | 1 October 1998 | public domain | quoted, with citation |
| SPE-PRMS 2018 | June 2018 | CC BY-NC-ND 4.0 | named only, for the P-label sentence |

The lectures are licensed for non-commercial use and this course is sold, so the course cites their figures by lecture and slide and explains every idea in its own words. Two textbooks were not read, and the validation record says so, verbatim:

> Not used: Silver, Pyke and Thomas (4th ed., CRC 2017) and Nahmias are not publicly readable, so not read or cited.

## Quirk one: printed short

Harris prints each lot below the formula's figure. His first example gives an EOQ of 2190.890230 in the engine, and he prints 2,190. A print that stops short of the rule is a rounding habit, and the engine keeps the rule.

## Quirk two: a table read to two places

Lecture 11 slide 24 prints safety stocks at four cycle service levels, reading the safety factor from a table to two decimals. The engine reproduces all four only with that reading stated. The exact factor gives figures a few units away. A figure is quoted with the reading it used.

## Quirk three: two slips

The fill-rate column of the same slide prints a safety stock of 348 at a fill rate of 0.95. The rule gives 339.179604, 8.820396 below the print. The other three rows agree to within 2 units, so the 0.95 row is a slip.

Lecture 13 slide 12 prints the expected units short beyond level 4 as 0.009. The recursion the slide states gives 0.001619. The printed figure is the recursion's at no precision the slide uses. The course keeps each print beside the rule's own figure and changes no rule to match a print.

## Quirk four: a rounded probability

The handbook prints 0.986 for the lamps, where the engine gives 0.985612. That is the same figure at three decimals, and it is no slip.

## Exercise

Open the spares calculator on the view "A slow-moving spare on Poisson demand" and start from "The PSV kits on the Ekene register". Type the lecture 13 case: "Demand rate a period (stated)" 0.8, "Lead time, periods (stated)" 0, "Review period, periods (stated, 0 for continuous review)" 1, and "Service level (stated)" 0.99, keeping the cycle service measure. Read the level (3) and the table's last row: an expected short of 0.010699 and a cumulative of 0.990920. Apply the recursion by hand for level 4: subtract one less 0.990920 from 0.010699. Compare your figure with 0.001619 and with the printed 0.009.
