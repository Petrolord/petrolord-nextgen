# Royalty, tax, levy and funds in order

{{panel:pia-royalty-calculator}}

The previous modules read royalty one part at a time. A year on a Nigerian ledger carries more lines than royalty: two contributions, two taxes on profit and an education charge. This module stacks them. The first lesson sets out the order the engine applies them in and gives each its citation; the rest of the module reads the bases, the funds, the taxes and the take.

## The order in one year

Royalty comes off revenue first: the production royalty on liquids and gas, and the royalty by price. The host communities contribution (HCDT) and the NDDC levy are then computed on their own bases. The hydrocarbon tax is charged on the crude oil and condensate profit after royalties and the other deductions the Act allows. Companies income tax is charged separately on the whole oil and gas profit and does not deduct the hydrocarbon tax. Last, the tertiary education tax, in a year under the Act alone, or the development levy, in a year under the Nigeria Tax Act 2025, is charged on the companies income tax assessable profit.

| order | instrument | citation | engine field |
| --- | --- | --- | --- |
| 1 | production royalty, liquids | PIA Seventh Schedule para 10 | liquids_production_royalty |
| 1 | production royalty, gas | PIA Seventh Schedule para 10(6) | gas_royalty |
| 1 | royalty by price | PIA Seventh Schedule para 11 | price_royalty |
| 2 | HCDT contribution | PIA s.240(2) | hcdt |
| 2 | NDDC levy | NDDC Act 2000 s.14(2)(b) (secondary source) | nddc |
| 3 | hydrocarbon tax | PIA ss.260, 263, 267; NTA ss.65, 68, 72 | hct_tax |
| 3 | companies income tax | PIA s.302; NTA s.56(b), s.78, s.82 | cit_tax |
| 4 | tertiary education tax | Finance Act 2023 s.26 | tet_tax |
| 4 | development levy | NTA s.59(1) | dev_levy_tax |

## One year, every line

The worked example is a single year, 2025, a year under the Act alone: a converted shallow water lease at 50,000 bopd with oil at 80 USD/bbl and a fixed NDDC sum. The royalty by price is read on the Regulations base, the engine default, and every line after it depends on that base.

| line (engine) | 2025, USD |
| --- | --- |
| liquids production royalty | 164250000.000000 |
| royalty by price | 34908351.810791 |
| total royalty | 199158351.810791 |
| HCDT | 5100000.000000 |
| NDDC | 15000000.000000 |
| hydrocarbon tax | 285784994.456763 |
| companies income tax | 299472494.456763 |
| tertiary education tax | 31747249.445676 |
| total tax | 617004738.359202 |
| net cash flow | 141236909.830007 |

The liquids are 18250000 barrels of oil over 365 days, 50000.000000 bopd. At that rate in shallow water the weighted royalty rate is 11.250000 percent, the royalty by price rate at 80 USD/bbl in 2025 is 0.023910, and total tax is the hydrocarbon tax plus companies income tax plus the tertiary education tax.

## Why the order matters

The order decides what each line can see. The hydrocarbon tax sees the royalties because they come first, and the text lets them be deducted. Companies income tax never sees the hydrocarbon tax, because the text forbids that deduction. The education charge reads the income tax base, so anything that moves that base moves it too. The next lesson reads each base in turn.

## Exercise

Open the royalty calculator and choose "The instruments stacked on a ledger". Run worked_example_inputs_default and find each line of the table above in the panel's table. Write the lines in the order the engine applies them, and beside each put its citation. Then change oil_price_usd_bbl in the case box from 80 to 60, run it again, and list which lines moved and which stayed where they were. For each line that moved, say whether the price moved it directly or a line before it moved it. For each line that stayed, name the base it reads and say why the price cannot reach it.
