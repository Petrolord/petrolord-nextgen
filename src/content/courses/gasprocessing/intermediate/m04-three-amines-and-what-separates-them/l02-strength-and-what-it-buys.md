# Strength, and what it buys

Strength is the weight percent of amine in the solution that circulates. It sits in the middle of the circulation chain, between pounds of amine and pounds of solution, and it is one of the two properties the digest names as setting the circulation.

## The three typical strengths

| amine | typical strength, wt % |
| --- | --- |
| MEA | 18.000000 |
| DEA | 28.000000 |
| MDEA | 45.000000 |

Each of those is a default rather than a fixed property. Name an amine and say nothing about strength and the engine uses the row's own typical figure and reports which one it used. Type a strength and it uses that instead.

{{panel:fc-absorber-explorer}}

## What the table cannot tell you about strength

Here is the trap, and it is worth spending a lesson on. The three amine circulations this module prints are each computed at that amine's own strength and at that amine's own rich limit. Two properties move together from row to row.

So you cannot read the effect of strength out of that comparison. A difference between two rows is the combined effect of a different strength and a different loading limit, and nothing in the printed answer separates them. Any sentence that attributes the whole of the difference to strength alone is a sentence about a calculation nobody did.

If you want the effect of strength on its own, the way to get it is to hold everything else and move the one input, which is exactly what the panel beside this lesson is for. The table is a comparison of three amines. It is not a sweep of one variable.

## What strength is doing in the chain

Strength is a dilution. A solution at a given weight percent carries that fraction of amine and the balance is mostly water, so the step converts an amount of active chemical into a much larger amount of liquid to be pumped, heated and cooled.

That is why strength appears in both of the answers the sweetening package produces. It sets the gallons, and because the regenerator is priced per gallon circulated, it sets the duty through the same step. One typed number lands in both.

## Why the strengths differ across the rows

The module does not say, and neither should a reading of its output. What it does say is that the strengths are customary values with no publication behind them in this repository, declared alongside the rich limits and the duties. The reasons an operator runs one amine strong and another weak belong to corrosion, degradation and solvent chemistry, and none of that is modelled here.

## Exercise

Record the three typical strengths and say which one the engine uses when a caller names MDEA and gives no strength. Then explain why the three printed circulations cannot be used to isolate the effect of strength, and name the second property that moves with it across those rows.
