# What the ranges scale

The Scenario Builder offers three ranges. Each draws one factor per iteration and applies it to a fixed set of arrays. Reserves scales volumes and the variable opex they carry, price scales prices, capex scales capex.

{{panel:ec-risk-explorer}}

## Three ranges, six arrays

| range | arrays it scales, every year | ISIALA base values |
| --- | --- | --- |
| reserves | oil volume, gas volume, variable opex | oil 1606000.0000 bbl in 2027; gas volume 0; variable opex 20.8780 in 2027 |
| price | oil price and gas price | oil 70.0000; gas 3.5000 |
| capex | capex | 90.0000 in 2027 and 2028; 0.0000 after |

## Variable opex follows the barrels

The variable opex array is computed from the base volumes when the quick inputs are expanded, so ISIALA's 2027 carries 20.8780 million USD at 13 USD per bbl. The reserves factor multiplies that array along with the volumes. An iteration that lifts a fifth fewer barrels pays a fifth less to lift them, which is the only reading of a volume range that a cost per barrel allows. An engine that moved the barrels and left the cost behind would charge a low case for barrels it never produced.

## Draws that change nothing

ISIALA has no gas. The reserves factor scales a gas volume of 0 and the price factor scales a gas price nothing is sold at, and neither costs an extra draw: one factor covers every array its range owns, however many of them matter. The eighteen capex years at 0.0000 are scaled by the same capex factor that scales 2027 and 2028.

What does move the stream is switching a range between zero and nonzero. In the published case mc_seed3_price_only the reserves and capex ranges are falsy and consume no draws, so each iteration spends a single draw on price and the stream lands differently from a run with three live ranges.

## What is never sampled

Fixed opex, royalty, tax and the discount rate keep their case values in every iteration: fixed opex 2.5000 million USD a year, royalty 15 percent, tax 35 percent, discount rate 12 percent. A range typed against any of them has nowhere to go. So does the shape of the case: the decline, the 20 year life and the flat price deck stand as typed, because one factor lifts or lowers a whole array and never tilts it.

## The mistake

The careful mistake is assuming the Monte Carlo covers every input the sensitivity and scenario tools move. The sensitivity sweep scales fixed opex by 0.7 and 1.3, which moves ISIALA's NPV from 85.3696 to 76.7233, and the scenario Low scales fixed opex by 1.2. The Monte Carlo leaves fixed opex alone at every setting. Its spread from the Low case P90 of 15.6063 to the High case P10 of 152.0653 carries uncertainty in three inputs and in nothing else. A reader who calls that spread "the uncertainty in ISIALA" is describing three inputs out of many.

## What it refuses

It has no range for fixed opex, royalty, tax, decline or discount rate. It cannot move one year of a profile without moving all twenty in the same proportion, and it cannot change the shape of a profile or a price deck at all.

## Exercise

List the arrays each of ISIALA's three ranges scales, and name four quantities that stay fixed in every iteration. Then say what happens to ISIALA's 2027 variable opex of 20.8780 million USD in an iteration whose reserves factor is 0.8, and why the engine moves it.
