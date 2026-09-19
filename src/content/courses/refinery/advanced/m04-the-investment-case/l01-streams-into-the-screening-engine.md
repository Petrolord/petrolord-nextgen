# Streams into the screening engine

Modules 1 to 3 read a month that has happened. This module reads a decision that has not: an expansion of ODIOMA, valued before any capital is spent. The feasibility engine builds the plant's annual streams and hands them to the screening engine, the same engine the Economics courses use, which returns a cash flow. This lesson reads the inputs and what crosses between the two engines.

{{panel:refinery-variance-explorer}}

## The expansion

ODIOMA's expansion is a conversion plant of 12000 bpd with 340 on-stream days and firm supply. Crude costs 74.0000 a barrel. Capital is scaled by the modular law from a reference of 100000000.00 at 10000 bpd. The fixed operating cost is 14000000.00 a year and the variable operating cost 4.2000 a barrel. The plant takes 2 construction years and runs for 20 operating years. It is valued at a discount rate of 12 percent and a tax rate of 30 percent, from start year 2027. Every figure is illustrative, in US dollars.

The screen returns four figures before any valuation:

| figure | value |
| --- | --- |
| capital | 117831965.35 |
| gross value per barrel of crude | 92.2100 |
| annual throughput (bbl) | 3753600.00 |
| gross margin per barrel | 14.0100 |

The capital comes from the modular scaling law. The gross value is the conversion slate's value per barrel of crude.

## What crosses to the screening engine

feasibilityEconomics hands the screening engine the following, with money in millions of US dollars:

| input | value |
| --- | --- |
| fiscalType | TaxRoyalty |
| royaltyRate | 0 |
| taxRate | 30 |
| discountRate | 12 |
| lossCarryForward | true |
| projectLife | 22 years |
| startYear | 2027 |

The streams follow. Production of oil, in barrels, is 0.00 in year 0 and 3753600.00 in the first operating year. The price in the first operating year is 92.2100, the slate's gross value. The opexFixed in the first operating year is 291.7664 million, and it is the fixed operating cost plus the crude cost. The opexVariable is 15.7651 million. The capex in year 0 is 58.9160 million.

## Reading the handover

Three settings carry the refinery's character, and each has a lesson of its own in this module.

Revenue goes in as revenue: barrels at the slate's value. The crude bill goes in as cost, inside opexFixed. Lesson 2 reads why.

The royalty rate is 0, because a refinery buys its crude and pays no royalty. The fiscalType is still TaxRoyalty, so the tax applies and the royalty term reads zero. Lesson 3 reads it.

The capex arrives in the construction years, and lossCarryForward is true. Lesson 4 reads how the capital is deducted, and module 5 reads what carrying the loss does.

The project life of 22 years covers the construction years and the operating years together, numbered year 0 to year 21 on the cash flow. The start year of 2027 labels the calendar years; the last lesson of this module shows that it moves no figure.

## Units change at the boundary

The screen works in dollars and barrels. The screening engine works in millions of dollars, printed to four decimals. The capital prints as 117831965.35 dollars on the screen. In the streams the capital is spread evenly as 58915982.67 and 58915982.67, each printed to the cent; the engine carries the unrounded halves, which sum to the capital: true. The capex prints as 58.9160 million in year 0 and 58.9160 million in year 1 on the cash flow.

## Exercise

Read the four screen figures and the seven settings the screening engine receives. Say which settings mark this as a refinery. Then read the capital in dollars and the capex in year 0 in millions, and say what the screening engine's unit is and why a reader must track it when moving between the two tables.
