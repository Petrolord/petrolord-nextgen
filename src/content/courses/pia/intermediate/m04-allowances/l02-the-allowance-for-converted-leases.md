# The production allowance for converted leases

{{panel:pia-hct-calculator}}

The production allowance is the Act's incentive inside the hydrocarbon tax: a deduction per barrel produced, with no cost behind it. Converted leases and new leases get different allowances. This lesson reads the converted-lease allowance, the simpler of the two.

## The text

The Petroleum Industry Act 2021, Sixth Schedule para 1(1): "1.: (1) There shall be a production allowance for crude oil production by leases which are converted oil mining leases based on a conversion contract and their renewals, which shall be the lower of US $2.50 per barrel and 20% of the fiscal oil price."

The Nigeria Tax Act 2025 prints the same paragraph at its Sixth Schedule para 1(1), so the converted-lease allowance is the same in every year the engine reads. Para 1(4) extends every allowance for crude oil to condensates and liquid natural gas liquids within the tax.

## Two legs and a crossing price

The allowance per barrel is the lower of two legs: a fixed 2.50 USD, and 20 percent of the price. At 12.50 USD/bbl the two legs are equal. Above that price the fixed leg is lower and applies; below it the price leg applies.

The engine's returns on 1000000 barrels of a converted lease:

| oil price (stated) | allowance |
| --- | --- |
| 75.000000 | 2500000.000000 |
| 12.50, the crossing | 2500000.000000 |
| one cent below the crossing | 2498000.000000 |
| 10.000000 | 2000000.000000 |

At any price above 12.50 USD/bbl the allowance is 2.50 USD a barrel. The price leg matters only at a very low price, and the boundary rows show the handover is continuous: at the crossing both legs give the same figure.

## The price the texts name, and the price the engine uses

The text says "fiscal oil price", the price the Commission sets for a field at its measurement points. The engine uses the realised price and says so in every PIA run:

> The realised oil and condensate prices stand in for the Commission's fiscal prices (PIA Seventh Schedule para 8), so the additional tax at the fiscal price (PIA s.268; NTA s.73) is not computed.

The fiscal price and the additional tax at it are concept-only in this course.

## On the worked example

The worked example inputs (synthetic: shallow water, converted lease, 2025, 18250000 bbl of oil at 80 USD/bbl) return a production allowance of 45625000.000000, which is 2.50 USD on every barrel. The allowance is deducted after the cost price ratio, in the step from assessable to chargeable profit, and it sits outside the cap.

## Exercise

Work in the course's own hydrocarbon tax calculator, which calls the same engine.

1. Open "The production allowance". Set lease status to converted, terrain shallow_water, 1000000 bbl, nothing produced before, and a year under the Act alone. Type each price in the table and match the allowance.
2. Switch the framework to a year under the Nigeria Tax Act 2025 and repeat one row. Did anything move? Which paragraph of that Act explains it?
3. Set a price of 12.5, then one cent less. Which leg applies in each run?
4. Open "The tax base and the cost price ratio on a ledger" on worked_example_inputs_default and find the production allowance column.
