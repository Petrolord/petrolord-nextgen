# The model agreement and its alternatives

{{panel:gsa-contract-calculator}}

Every clause the engine computes comes from a text, and this module reads those texts as sources: what each one states, what it leaves to the parties, and where it prints a figure the engine computes more exactly. It starts with the one most of the engine's clauses come from.

## A model agreement the course may quote

The Commonwealth Secretariat's Gas Sales Agreement, Contract 2 in the Commonwealth Model Contract Series (2025), was read on 2026-09-26. Its front matter states its licence:

> "This work is licensed under Creative Commons Attribution 4.0 International."

So the course quotes it, short and exact, with that attribution. The AIPN model gas sales agreement is a licensed text: the course teaches its ideas as concepts where they are needed and quotes none of it. Every clause quoted in this course comes from the Commonwealth model.

## Figures left for the parties

A model agreement is a template. Where a figure is a commercial choice, it prints a blank. The take-or-pay percentage is one:

> "quantity of Gas equal to [## INSERT] percent (##%) of the Adjusted Annual Contract Quantity for that Contract Year."

MaxDCQ is another. The engine takes each such figure as a required input with no default, and a call without it is refused by name.

## Alternatives printed side by side

Where the drafters saw more than one reasonable rule, the model prints alternatives and leaves the choice to the parties. The engine implements some and names the rest:

| clause | alternatives printed | what the engine computes |
| --- | --- | --- |
| Adjusted ACQ | without or with the operational flexibility credit | Alternative 2, the credit entering as permittedReduction |
| Buyer's Deficiency Payment, Article 12.6 | BADQ x TOPP, or (BADQ - CFCQ) x TOPP | Alternative 2 when carry-forward is stated, which is Alternative 1 when it is not |
| end of the Delivery Period, Article 12.7.5 | forfeit, refund, extend the term | forfeit and refund; extending is not modelled |
| carry-forward, Article 12.8 | reduce next year's ACQ, or reduce the deficiency | reduce the deficiency, with the cap on the deficiency |
| take-or-pay price, Article 15.2.6 | annual average, last month, a percentage of the last month | a stated input per year; priceSeries returns the annual average and the last month's price |
| index floor and ceiling, Article 15.8 | floor and ceiling per index, or a cap on the change | floor and ceiling per index |

An alternative the engine does not model is taught as a concept, and the next module lists each with where it would come from.

## From a signed contract to the engine's inputs

A signed agreement drafted from the model has made each choice. Reading it into the engine is a matter of mapping: an operational flexibility credit goes into permittedReduction, a carry-forward right becomes the carryForward block with its period, base and cap, the end-of-term alternative becomes makeUp.endOfTerm, and the take-or-pay price alternative decides whether each year's topPrice is the annual average or the last month's price. A choice the engine cannot hold is reported beside the figures and left out of them.

## The other texts, with their editions

ESMAP Report 152/93, Long-term Gas Contracts: Principles and Applications (January 1993, World Bank and UNDP) describes make-up, minimum pay and carry-forward. The HMRC Oil Taxation Manual pages OT05435 and OT05402 (both updated 19 December 2019, Open Government Licence) describe the make-up orders and effective swing. The Energy Charter Secretariat's 2007 report, OIES Paper NG 175 (2022) and CLDP and US DOE, Understanding Natural Gas and LNG Options (edition current as of October 2017) cover prices and concepts. Every one was read on 2026-09-26.

## Exercise

Open the contract calculator on "The whole contract in money". It starts on the Ekene export feed (synthetic), which states carry-forward. Read the 2029 deficiency payment. Delete the carryForward block and read it again: name the Article 12.6 alternative each figure follows. Then set contract.makeUp.order to "lifo" and read the refusal, which names every order the engine accepts:

> contract.makeUp.order must be one of "after-adjusted-acq", "after-top-quantity", "first"; got "lifo"
