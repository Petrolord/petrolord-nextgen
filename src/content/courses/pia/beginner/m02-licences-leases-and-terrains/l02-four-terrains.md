# Four terrains

{{panel:pia-royalty-calculator}}

The terrain is the single input that moves the most figures on a Nigerian ledger. It sets the royalty rate on liquids above the small-field tranches, it decides whether the hydrocarbon tax applies at all, and it sets the production allowance cap for a new lease. The Act names four terrains, and the engine takes each as a stated string.

## The terrain rates in the text

The Seventh Schedule sets the production royalty by terrain, in para 10(2):

> "on terrain basis as follows: (a) onshore areas 15% ; (b) shallow water (up to 200m water depth) 12.5% ; (c) deep offshore (greater than 200m water depth) 7.5% ; and (d) frontier basins 7.5%."

The Nigeria Tax Act 2025 restates the same four rates in its own Seventh Schedule, para 6(2)(b), so the terrain rates are the same in every year this course reads.

## The four strings

The engine accepts exactly four values of `pia_terrain`: "onshore", "shallow_water", "deep_offshore" and "frontier". Anything else is refused, with the four values named back:

> pia_terrain must be "onshore", "shallow_water", "deep_offshore" or "frontier"; got "offshore".

A marginal field needs care, because it is not a terrain. The Act treats a marginal field as a field onshore or in shallow water, and its royalty follows that terrain's tranches. The engine refuses "marginal_field" as a terrain, and its message names the flag that gives a producing marginal field converted under the Act its own tax treatment. The Converted and new leases lesson reads that flag.

## What the terrain does to the royalty

The terrain rate is only the top of the scale. Onshore and shallow water fields pay small-field tranches below 10,000 bopd and deep offshore pays 5 percent up to 50,000 bopd, so two terrains can pay the same rate at a low daily rate and different rates at a high one. The engine's rates at three daily rates:

| liquids bopd (stated) | onshore | shallow_water | deep_offshore | frontier |
| --- | --- | --- | --- | --- |
| 7500 | 0.058333 | 0.058333 | 0.050000 | 0.075000 |
| 20000 | 0.106250 | 0.093750 | 0.050000 | 0.075000 |
| 60000 | 0.135417 | 0.114583 | 0.054167 | 0.075000 |

Read across a row. At 7500 bopd onshore and shallow water pay the same rate, deep offshore pays its flat 5 percent and frontier pays 7.5 percent. At 60000 bopd all four differ, and deep offshore has just begun to pay 7.5 percent on the barrels past 50,000 bopd. The next module works through the tranches in full.

## What else the terrain decides

The terrain reaches beyond royalty. Frontier acreage pays no royalty by price (Seventh Schedule para 11(2)). Deep offshore and frontier sit outside the Act's hydrocarbon tax in a year under the Act alone (PIA s.260(3)). The Professional and Expert tiers take those lines up; at this tier it is enough to know that the terrain string is read by several provisions at once.

## Exercise

Open the royalty calculator and choose "Royalty by terrain and daily rate". Enter 20000 bopd and the year 2026, then step the terrain through all four values and write down the rate each returns. Repeat at 120000 bopd. For each terrain, say which part of the Seventh Schedule para 10 produced the figure. Finally type offshore into a case in "The instruments stacked on a ledger" as the pia_terrain of ekene_alpha_shallow_converted_nta, run it, and copy the refusal.
