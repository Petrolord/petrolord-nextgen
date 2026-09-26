# Excess, off-specification and pre-start gas

{{panel:gsa-contract-calculator}}

This module lists the clauses the engine leaves out. Each is taught as a concept, with the text it would come from, and none is graded. This lesson takes the quantity clauses.

## Excess gas and over-delivery

A seller may agree to supply gas above the DCQ. The Commonwealth model agreement (2025, CC BY 4.0) calls this Excess Gas, and its Alternative 1 for the Buyer's Annual Deficiency Quantity takes excess gas into account. The engine computes Alternative 2, without it, and models no excess gas. Gas the buyer takes above the take-or-pay quantity is counted at the contract price unless it is make-up, and the daily balance reports takes above the adjusted DCQ as over-take. Neither is excess gas in the model's sense.

## Off-specification gas and pre-start gas

Gas that fails the quality specification, and gas delivered before the Start Date, have their own clauses in the model agreement: Article 13 and the Start Date provisions. The engine does nothing with either; every quantity it reads is gas the contract counts.

## Two alternatives the engine does not take

The model's Article 12.7.5 prints a third end of the Delivery Period: extending the term so the buyer can take the make-up still open. The engine computes forfeit and refund and leaves the extension out. Its Article 12.8 prints a carry-forward that reduces next year's ACQ as Alternative 1. The engine computes Alternative 2, which reduces the deficiency.

## The engine cannot be told what it does not compute

A missing clause is safe only if no input can smuggle it in. A key a function does not read is refused at whatever level it sits, with its path and every key the function accepts. The course's golden example is a misspelt force majeure key on a contract year:

> years[0].fm is not an accepted key; the accepted keys of years[0] are year, acq, maintenance, forceMajeure, sellerShortfall, permittedReduction, taken, contractPrice, topPrice, makeUpPrice, shortfallPrice

A key for excess gas or off-specification gas meets the same refusal. The list of accepted keys is, in effect, the list of clauses the engine computes.

## What a report says

A contract carrying any of these clauses can still be run for the clauses the engine computes, and the report names, beside the figures, the clauses left out.

## Exercise

Open the contract calculator on "The whole contract in money". It starts on the Ekene export feed (synthetic). Add a key excessGas with any quantity to the 2030 year and read the refusal: copy the accepted keys it lists. For each clause in this lesson, name the key it would need and confirm the key is absent. Then write the two sentences a report on the export feed would carry about excess gas and the extend-the-term alternative.
