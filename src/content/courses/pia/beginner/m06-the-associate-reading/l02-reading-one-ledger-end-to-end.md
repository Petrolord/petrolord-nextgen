# Reading one ledger end to end

{{panel:pia-royalty-calculator}}

A ledger is read from the rows to the take. This lesson reads Ekene Alpha's first year that way, line by line, naming the provision behind each figure, and then reads the whole life by provision. It is the reading the capstone asks for, on a case whose figures the course prints.

## The terms and the first year's rows

Ekene Alpha is a converted petroleum mining lease in shallow water, at a 100 percent working interest, with oil at 75, condensate at 70 and gas at 3 USD per Mscf. In 2026 it produces 2920000 barrels of oil, 116800 barrels of condensate and 2336000 Mscf of gas, spends 120000000 USD of capex and 24000000 USD of opex. 2026 is a year under the Nigeria Tax Act 2025.

## The royalty lines

| line, 2026 | engine figure | the provision behind it |
| --- | --- | --- |
| liquids daily rate, bopd | 8320.000000 | condensate counts as crude oil (Seventh Schedule para 6); the engine's annual reading |
| liquids royalty rate | 0.059976 | the shallow water tranches (Seventh Schedule para 10(4); Regulations r.13(2)) |
| production royalty on liquids | 13625099.038462 | Seventh Schedule para 10 |
| gas royalty rate | 0.050000 | Seventh Schedule para 10(6), no gas used in-country |
| gas royalty | 350400.000000 | Seventh Schedule para 10(6) |
| royalty by price rate, oil | 0.017935 | Seventh Schedule para 11(1), Regulations base |
| royalty by price | 4037323.188406 | Seventh Schedule para 11(1), Regulations base |
| total royalty | 18012822.226867 | the engine's total of the three royalties above |

The daily rate sits between 5,000 and 10,000 bopd, so the rate is a weighted average of the two small-field tranches. The total royalty is the engine's own sum of the three royalties; each printed line is rounded to six decimals, so adding the printed lines can miss the printed total in the last place. The royalty by price is read on the Regulations base, the engine default, and every figure after it depends on that base.

## The contributions

HCDT is 0.000000 in 2026, because Alpha states no prior-year opex. The NDDC levy is 4320000.000000 USD, 3 percent of the year's opex plus capex, the total annual budget read from a secondary source.

## The taxes

The hydrocarbon tax reads Alpha's crude and condensate profit. Alpha also sells associated gas, so the engine enters shared costs at the crude-plus-condensate share of gross revenue, 0.970075, and says so in a note. Companies income tax reads the whole oil and gas profit and does not deduct the hydrocarbon tax. As a year under the Nigeria Tax Act 2025, 2026 carries the development levy and no tertiary education tax. This tier reads those lines from the panel and names their provisions; the Professional tier works the tax base. The order still matters to the reading: the royalties come first and every tax line sees them, the contributions come off both tax bases, and the levy reads the income tax base.

## The whole life by provision

| line, 2026 to 2032 | USD |
| --- | --- |
| total royalties | 79273732.707567 |
| hydrocarbon tax | 204770583.587056 |
| companies income tax | 222856630.287730 |
| development levy | 35714217.371697 |
| HCDT | 4320000.000000 |
| NDDC | 9540000.000000 |
| government take percent | 66.564877 |

## The notes are part of the reading

Below the table the panel prints the engine's notes: the daily rate reading, the base year of the royalty by price, the shared costs, the realised price standing in for the fiscal price, and the gazette edition of the Nigeria Tax Act 2025. A reading that skips the notes misses the settings the figures rest on.

## Exercise

Open the royalty calculator and choose "The instruments stacked on a ledger". Run ekene_alpha_shallow_converted_nta. For 2026, read the total royalty, HCDT, NDDC, hydrocarbon tax, companies income tax and development levy from the table, and beside each write the provision behind it. Check the total royalty against the table above. Then do the same for 2030, the first year Alpha is at or below 5,000 bopd, using "Royalty by terrain and daily rate" to confirm its liquids royalty rate. Read every note and say which figure each one qualifies.
