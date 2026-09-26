# Price reopeners reported by month

{{panel:gsa-ledger-calculator}}

{{panel:gsa-contract-calculator}}

A long gas contract may let either party ask for its price to be reviewed on stated dates. That is a price reopener. No formula states what a review will decide, and the engine models no outcome.

## What the engine does with a reopener

`priceSeries` takes a list of reopener months and reports each one where it falls, with a note. It keeps pricing on the stated formula through and after the reopener, because that is the only price the contract states. The Ekene export feed agreement (synthetic) carries reopeners in 2031-01 and 2035-01, and the engine reports them, verbatim:

> price reopener 2031-01: reported only; the engine does not model the outcome of a price review

> price reopener 2035-01: reported only; the engine does not model the outcome of a price review

So every export price after 2031-01 is the price the formula would give if the review left it unchanged. A report that quotes those prices says so.

## Where the idea comes from

CLDP and US DOE, Understanding Natural Gas and LNG Options (edition current as of October 2017, read on 2026-09-26), describe the price reopener as a concept, beside the S-curve. The Energy Charter Secretariat (2007) discusses price reviews in its Box 9. Both are read as concept.

## A reopener month is a stated input

The engine takes each reopener as a month, 'YYYY-MM', and refuses anything else by name:

> reopeners[0] must be a month 'YYYY-MM'; got "2031"

## The index change cap

The Commonwealth model agreement (2025, CC BY 4.0), Article 15.8, prints two ways to bound an index: Alternative 1, a floor and a ceiling on each index, and Alternative 2, a cap on how far an index may change. The engine computes Alternative 1 and does not model the change cap. A contract that carries one is priced on the formula without it, and the report names the gap.

## Why the engine stops here

A review outcome entered as if it were known would put a guess into every later month and every NPV resting on them. A reader who wants to see what a review might do can run the formula again with a changed slope or constant, and quote that run as a stated case.

## Exercise

Open the ledger calculator on "Contract prices month by month". It starts on the Ekene export feed price. Find the two reopener notes and the months they sit on. Add a third reopener in 2033-01 and read the notes again, then enter "2031" as a reopener and read the refusal. Next open the contract calculator on "Prices on an S-curve", paste the same inputs with the slope raised to 0.1485 and read the 2031 annual average; state in two sentences how a report would present that run beside the contract's own price.
