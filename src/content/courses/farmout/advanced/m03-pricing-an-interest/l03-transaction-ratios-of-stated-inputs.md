# Transaction ratios of stated inputs

{{panel:farmout-valuation-calculator}}

Deal teams compare prices through ratios: a price per percent, a price for the whole licence, a price per barrel of a reserve category, a price per flowing barrel a day. The engine computes each ratio from figures the call states, and reports it. It asserts no market value.

## The rule

The engine states it in its basis:

> transaction metrics are ratios of stated inputs (price, volumes, rates), reported only: no market value is asserted

Its source line says where the volumes come from:

> NPV per percent of working interest at the stated discount rate; the reserve category and its volume are stated as the user classifies them

## The Ekene Deep price

The fixture (synthetic) states a price of 16000000.000000 for 30.000000 percent on the risked basis, with 120.000000 MMboe of "2C (contingent, best estimate)" for the whole prospect (engine):

| golden case | price (stated) | price per percent | price for 100% | price over value per percent | volume net to the interest | price per unit |
| --- | --- | --- | --- | --- | --- | --- |
| interest-ekene-risked | 16000000.000000 | 533333.333333 | 53333333.333333 | 2.026914 | 36.000000 MMboe | 444444.444444 |

The engine's reasons, verbatim:

> stated price 16000000 for 30%: 533333.33 a percent, 53333333.33 for 100%; 2.026914 times the risked value per percent
> 2C (contingent, best estimate): 36 MMboe net to the interest; 444444.44 per MMboe

The price per percent divides the stated price by the stated working interest. The ratio 2.026914 divides that by the risked value per percent, 263125.842605. The volume net to the interest is 30.000000 percent of the stated 120.000000 MMboe, and the price per unit divides the price by it.

## A producing interest

The golden case interest-production-metric prices 20.000000 percent working interest in a producing field at a stated 18000000.000000, with a stated rate of 1000.000000 boe/d net to the interest (engine):

| golden case | price per percent | price for 100% | price over value per percent | rate net to the interest | price per flowing unit |
| --- | --- | --- | --- | --- | --- |
| interest-production-metric | 900000.000000 | 90000000.000000 | 1.125000 | 1000.000000 boe/d | 18000.000000 |

> production: 1000 boe/d net to the interest; 18000 per boe/d

## What must be stated with a volume

A reserve volume needs its unit, and a unit needs a volume. Both refusals are the engine's:

> transaction.volumeUnit must be a non-empty string; got nothing

> transaction.volumeUnit must be left out when no reserves are stated; got "boe"

A call may state at most 10 reserve categories.

## The reserve category is a label

The engine classifies nothing. "2C (contingent, best estimate)" is the fixture's label, typed by whoever built the case, and the engine divides the price by the volume beside it whatever the label says. The classification of reserves and resources follows its own published rules, which this course does not apply. A report quotes the category and its volume as the call stated them.

## What a ratio compares

A price per MMboe on one deal and a price per MMboe on another are comparable only when the categories, the net volumes, the fiscal terms and the timing are alike. The Nigerian fiscal terms that would make two deals unlike belong to the Petroleum Industry Act course.

## Exercise

Open the valuation calculator on the view "A price for a working interest" and start from "The Ekene Deep price, risked". Read the price tiles and the reserve tiles. Change "Stated price (optional)" and confirm that every price ratio moves in proportion while the value tiles do not. In the box, change the reserve's gross volume and read the price per unit. Delete the volume unit from the transaction and read the refusal. Then start from "A producing interest priced per flowing unit" and read the flowing-unit tiles.
