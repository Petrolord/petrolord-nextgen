# The deep offshore tier

{{panel:pia-hct-calculator}}

Deep offshore fields have their own small-field rule, and it is simpler than the onshore scale: one tier, one edge. This lesson reads it from the text, sets it beside the engine's returns, and shows why the royalty carries so much weight on a deep offshore lease in a year under the Act alone.

## What the texts say

The Petroleum Industry Act 2021, Seventh Schedule para 10(3): "(3) For deep offshore fields with a production during a month of not more than 50,000 bopd, the royalty rate shall be 5% and the share of the production above 50,000 bopd shall be at the royalty rate specified in subparagraph (2)." The subparagraph (2) rate for deep offshore, beyond 200 metres of water, is 7.5 percent.

The Petroleum Royalty Regulations 2022, r.13(1)(b), turn the tier into a weighted rate: "for production greater than 50,000bopd, the rate shall be a weighted average rate of 5% of 50,000bopd plus 7.5% of the incremental daily production above 50,000bopd divided by the total production per day."

## The rate the engine returns

| liquids bopd (stated) | deep_offshore | shallow_water |
| --- | --- | --- |
| 20000 | 0.050000 | 0.093750 |
| 50000 | 0.050000 | 0.112500 |
| 50001 | 0.050000 | 0.112500 |
| 60000 | 0.054167 | 0.114583 |
| 120000 | 0.064583 | 0.119792 |

The edge belongs to the tier below it: at exactly 50,000 bopd the rate is 5 percent, and above it only the barrels past 50,000 pay 7.5 percent. One barrel over the edge moves the rate by less than the six decimals the course prints, so 50001 still prints 0.050000.

## The Ekene deep offshore lease

The synthetic deep offshore lease of the course produces 21900000 bbl a year, which is 60,000 bopd over 365 days, so its liquids royalty rate is 0.054167 in every year. In 2025, a year under the Act alone, that lease pays no hydrocarbon tax at all. The Act says so in s.260(3): "(3) This Part shall not apply to a frontier acreage until it is reclassified under section 68 (3) of this Act and to deep offshore." The engine returns a hydrocarbon tax rate of 0.000000 for deep offshore in such a year.

Under the Act alone, deep offshore crude pays royalty and companies income tax, and its hydrocarbon tax base is computed and charged at zero. In 2025 the engine still reports that lease's chargeable profit, 795646660.199557, and companies income tax of 291253998.059867. The Expert tier takes up what the Nigeria Tax Act 2025 does to deep offshore from 2026.

## Exercise

Work in the course's own hydrocarbon tax calculator, which runs the same engine.

1. Open the view "The tax base and the cost price ratio on a ledger" and start from ekene_deep_new_60k_conservative.
2. Delete the 2026 and 2027 entries from `prodRows` and from `opexRows`, so the ledger holds only 2025, a year under the Act alone. In the first table read the 2025 daily rate, 60,000 bopd, and the liquids royalty rate, 0.054167. Confirm the HCT rate column reads 0.000000 and the chargeable profit reads 795646660.199557.
3. Change the 2025 `oil_bbl` to 18250000, which is 50,000 bopd over 365 days. Read the new daily rate and the liquids royalty rate, 0.050000, and say which barrels stopped paying 7.5 percent.
4. Say in one sentence why the hydrocarbon tax stayed at zero in both runs, citing the section.
