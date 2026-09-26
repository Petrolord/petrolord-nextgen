# Heat equivalence between oil and gas

{{panel:gsa-contract-calculator}}

The Expert tier asks how a contract price sits against oil, what the whole contract is worth in money, and how far each figure rests on a choice the engine states. An oil-indexed price links gas to crude, and the first thing to know about any link is where it would sit if a barrel of oil and the gas carrying the same heat were worth the same.

## Parity is a reciprocal

If a barrel of crude costs one dollar and the gas matching its heat costs the same, each MMBtu of gas is worth one dollar divided by the MMBtu in the barrel. The engine's function `energyParitySlope` states its rule in its own basis:

> slope = 1 / (MMBtu per barrel); gas in US$/MMBtu = slope x oil in US$/bbl on equal heat content.

That slope is the parity slope. Multiply it by an oil price in US$ per barrel and it returns the gas price in US$ per MMBtu that matches oil on heat content alone.

| MMBtu per barrel | parity slope (engine) | where the heat content comes from |
| --- | --- | --- |
| 5.800000 | 0.172414 | Energy Charter Secretariat (2007) |
| 5.689000 | 0.175778 | EIA energy conversion calculators, read 2026-09-26 |
| 6.000000 | 0.166667 | a stated round figure |

## The two sources

The Energy Charter Secretariat's Putting a Price on Energy: International Pricing Mechanisms for Oil and Gas (2007), read on 2026-09-26, discusses oil-linked gas prices in its section 4.5.3.3 with the form P = A x JCC + B, where JCC is the Japan crude cocktail, and prints the heat-equivalence slope as 0.172. The engine on 5.8 MMBtu per barrel returns 0.172414. A later lesson in this tier reads that printed figure against the exact one.

The EIA's energy conversion calculators, a web page read on 2026-09-26, give 1 barrel of crude oil as 5689000 Btu, a 2026 estimate for United States production. On that heat content the parity slope is 0.175778. Two sources give two slopes, so a report names the one it uses.

## Words this tier keeps

The vocabulary of the Associate and Professional tiers binds here too. A shortfall is always a seller shortfall or a buyer shortfall. A deficiency is the take-or-pay quantity less the quantity counted, and the money is the deficiency payment. Make-up is gas paid for in a deficiency year and taken later; carry-forward is excess takes credited against a later deficiency. The Adjusted ACQ is the ACQ less its stated reductions. The domestic base price is a stated input, quoted only as reported. A parity slope is always quoted with its MMBtu per barrel.

## What parity does not say

Parity is a reference line and prices nothing. A contract sets its own slope and constant, which the next lesson reads. The course's practicals run in its own calculator panels, which call the same vendored engine the lessons quote; at this tier that is the contract calculator.

## Exercise

Open the contract calculator on the view "Energy parity". It starts on 5.8 MMBtu per barrel. Read the parity slope, then enter 5.689000 and 6 in turn and read each slope. For each, multiply by an oil price of your choice and state the gas price that matches it on heat content, with the MMBtu per barrel beside it. Finally enter 0 and read the refusal in the engine's own words:

> mmbtuPerBarrel must be a finite number above 0; got 0
