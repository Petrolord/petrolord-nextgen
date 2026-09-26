# The Adjusted ACQ

{{panel:gsa-quantity-calculator}}

At the end of a contract year, the buyer's obligation is measured against the gas it could fairly have been asked to take. The ACQ is the starting point, but some of that gas was never on offer: the seller had maintenance, force majeure struck, or the seller simply failed to make gas available. The Adjusted ACQ takes those quantities off.

## The model agreement's definition

The Commonwealth model agreement defines it as a subtraction:

> "the quantity of Gas equal to the Annual Contract Quantity less the sum of the Scheduled Maintenance Quantities, Force Majeure Quantities, Shortfall Quantities, and if applicable less the Operational Flexibility Credit," (Commonwealth model GSA (2025), definition of Adjusted ACQ)

The engine's rule follows it: Adjusted ACQ = ACQ - maintenance - force majeure - seller shortfall - permitted reduction. The permitted reduction is where a contract's own additional reduction goes, such as an operational flexibility credit; it is an explicit input, and zero unless stated.

## A worked year

The golden case with force majeure and a seller shortfall states a year with an ACQ of 1000.000000 and reductions of 200.000000 in all, made up of maintenance, force majeure, seller shortfall and a permitted reduction.

| year | ACQ | reductions | Adjusted ACQ (engine) |
| --- | --- | --- | --- |
| 2027 | 1000.000000 | 200.000000 | 800.000000 |
| 2028 | 1000.000000 | 0.000000 | 1000.000000 |

The seller shortfall in that year is 50.000000, and the engine prints this reason for it, verbatim:

> 2027: seller shortfall 50 reduces the Adjusted ACQ and is paid to the buyer at 1.5: 75

The second half of that reason is the subject of the last module.

## The power plant's 2027

In the power plant fixture, 2027 carries force majeure of 42000.000000 and a seller shortfall of 6300.000000, the quantities the daily balance found in January. Both reduce that year's Adjusted ACQ below its ACQ of 7665000.000000. This is one of the planted situations, and running the year in the panel shows the engine find it.

## A whole year of force majeure

If force majeure covers the entire ACQ, the Adjusted ACQ is 0.000000, and so is everything built on it. The golden case with a whole year of force majeure returns an Adjusted ACQ of 0.000000, no deficiency and no reason, because there is nothing to reconcile.

## Reductions cannot exceed the ACQ

A year whose reductions add up to more than its ACQ cannot be real, and the engine refuses it, naming each reduction:

> years[0].acq must be at or above the reductions it carries (maintenance + force majeure + seller shortfall + permitted reduction = 110); got 100

## Why the adjustment protects the buyer

Without it, a buyer would owe take-or-pay money on gas the seller never offered. The Adjusted ACQ makes the obligation fair: the buyer is measured only against gas that was on offer.

## Exercise

Open the quantity calculator, the course's own calculator panel, and choose "One take-or-pay year". The box holds the golden case with force majeure and a seller shortfall. Run it and read the ACQ and the Adjusted ACQ for 2027 and 2028. Find each reduction among the inputs of 2027 and check that they add up to the difference. Then lower the 2027 `acq` to 100 and read the refusal. Restore it, raise `forceMajeure` for 2027 until the reductions equal the ACQ, and read the Adjusted ACQ.
