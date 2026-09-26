# The seller shortfall reading

{{panel:gsa-quantity-calculator}}

{{panel:gsa-contract-calculator}}

Where a text leaves a rule open, or prints a formula that would give an odd result, the engine takes a reading and states it in its own basis. It states four. This module reads each one where it acts, beside the text it reads. The course grades none of them: every capstone field is the same number under each reading the engine takes and under the alternative it names.

## What the model agreement prints

The Commonwealth Secretariat's Gas Sales Agreement, Contract 2 in the Commonwealth Model Contract Series (2025, licensed under Creative Commons Attribution 4.0, read on 2026-09-26), defines the Shortfall Quantity. Its definition opens with the day:

> "means for any Day in the Delivery Period, during which Seller did not make available the Properly Nominated Quantity,"

and then prints a formula:

> "the Properly Nominated Quantity less the Delivery Tolerance Quantity and less the Daily Actual Quantity determined using the following formula: SFQ = (PNQ − DTQ ) − DAQ"

The opening speaks of gas the seller did not make available. The formula subtracts the Daily Actual Quantity, the gas actually delivered. On most days the two agree. They part on a day the seller made gas available and the buyer did not take it.

## The engine's reading

The engine states its reading in the basis of `dailyBalance`, verbatim:

> seller shortfall measured against the quantity the seller made available; the model formula subtracts the Daily Actual Quantity, which would count gas made available and not taken against the seller

So the engine's seller shortfall is the properly nominated quantity less the tolerance less the quantity made AVAILABLE, less any force majeure and maintenance stated for the day, and none on a day the stated cause is on the buyer's side.

## Where it acts

| day (golden input) | nominated | available | taken | seller shortfall | buyer shortfall |
| --- | --- | --- | --- | --- | --- |
| gas made available and not taken | 100.000000 | 100.000000 | 60.000000 | 0.000000 | 40.000000 |
| a cause on the buyer's side | 100.000000 | 20.000000 | 20.000000 | 0.000000 | 80.000000 |

On the first day the seller made the whole 100.000000 available and the buyer took 60.000000. The engine returns a seller shortfall of 0.000000 and a buyer shortfall of 40.000000. Read literally, the printed formula would put those 40.000000 against the seller, which would reduce the Adjusted ACQ and have the seller pay damages for gas it offered.

The Ekene power plant's January 2027 carries the second pattern on 2027-01-30, and the engine says so in its reasons:

> 2027-01-30: 8400 of the properly nominated quantity was not made available for a cause on the buyer's side, so it is not a seller shortfall

## Why it is a stated choice

The definition's opening supports the engine's reading and the formula's letter supports the other. A contract drafted from the model can settle it in its own words, and a report says which reading its figures rest on.

## Exercise

Open the quantity calculator on "The daily balance". It starts on the Ekene power plant's January 2027. Change 2027-01-11 so the seller makes 21000 available and the buyer takes 12600, and read that day's seller shortfall, buyer shortfall and reason. Then set buyerCaused to true on 2027-01-20 and read how the month's seller shortfall total moves. Finally open the contract calculator on "The four stated readings" and find the first reading printed from the engine's basis, with the day it acts on.
