# Boundaries, rule by rule

{{panel:gsa-contract-calculator}}

Every rule in a gas sales agreement has an edge: a quantity exactly equal to the take-or-pay quantity, an index exactly at a kink, a make-up entry in the last year of its period. A reader who assumes one boundary convention for all of them will misread some. The engine applies each rule with its own boundary, and the course probed each one on a golden input when it built its tables. No single rule covers them all.

## The quantity rules

| rule | at the boundary | what the engine returns |
| --- | --- | --- |
| deficiency | counted EQUAL to the take-or-pay quantity | no deficiency (0.000000); one unit short gives 1.000000 |
| make-up after the Adjusted ACQ | taken EQUAL to the Adjusted ACQ | no make-up; make-up only strictly above |
| make-up expiry | the last year of the period | usable in that year; the rest expires at its end |
| carry-forward surplus | counted EQUAL to the base | surplus only strictly above |
| carry-forward cap | a credit EQUAL to the cap percent of the deficiency | applied in full |
| seller shortfall on a day | (PNQ - tolerance) - available EQUAL to zero | no seller shortfall; one unit more gives 1.000000 |
| MaxDCQ | a nomination EQUAL to MaxDCQ | properly nominated in full |
| force majeure and maintenance | together EQUAL to the DCQ | allowed, nothing owed either way; above the DCQ refused |

Read the pattern and its breaks. A deficiency and a seller shortfall arise only strictly below their thresholds, so meeting the figure exactly owes nothing. Make-up and carry-forward surplus arise only strictly above theirs. The carry-forward cap is inclusive: a credit exactly at the cap is applied. A make-up period of N years after a deficiency year y runs to the end of year y + N inclusive, and none is available in the year after.

Two more edges sit in the day and the year. A zero nomination on a day whose adjusted DCQ is above zero makes the whole adjusted DCQ a buyer shortfall: on the Ekene power plant's 2027-01-05 that is 21000.000000. A period day count excludes its end date, as a contract year that finishes on the following first of January does.

## The price rules

| rule | at the boundary | what the engine returns |
| --- | --- | --- |
| S-curve | an index EQUAL to a kink | on the mid segment; the curve is continuous there |
| price floor or ceiling | a raw price EQUAL to the floor | not labelled clamped; one index point lower is held at the floor |
| four-decimal rounding | a fifth decimal of five | rounds up |
| escalation | each anniversary of the base month | steps in whole years |

The course states one price probe in full: on 1 + 0.1 x oil with a floor of 4 and a ceiling of 9, oil at 30 prices 4.000000 with no clamp, and oil at 29 prices 4.000000 clamped at the floor. The price is the same; the label tells the reader which rule set it.

## The Nigerian rules

The domestic rules have their own edges. A gas distributor's negotiated price exactly equal to the commercial sector price is within the ceiling. A gas based industries formula price exactly equal to the domestic base price, or to the floor of US$0.90 per MMBtu, is not held. Voluntary contracts exactly equal to the obligation deem it fulfilled, because PIA s.110(2) says "equal to or higher"; one short is not. An agreement penalty rate exactly equal to the US$3.50 minimum is the agreement's rate.

## Why this matters for a report

A report that says a contract "met" its take-or-pay quantity, or a price "hit" its floor, should be able to say which side of the boundary the figure fell on and what the rule does there. The engine's reasons say it for every year and month, which is why the course quotes them.

## Exercise

Open the contract calculator on "Prices on an S-curve". Replace its inputs with a straight 1 + 0.1 x oil formula carrying a floor of 4 and a ceiling of 9, and price oil at 29, 30, 80 and 82 in consecutive months. Read the price and the clamped column for each, and state which months sit on a boundary. Then open "The whole contract in money" and write a two-year contract of ACQ 1000 at 80 percent whose first year takes exactly 800: confirm the deficiency is 0.000000, with stated make-up terms, prices and royalty. Then take 799 and read the deficiency and its reason.
