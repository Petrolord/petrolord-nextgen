# Condensate, gas and natural gas liquids

{{panel:pia-royalty-calculator}}

A field rarely produces one product. Ekene Alpha produces crude oil, condensate and associated gas together. The royalty provisions sort those products into two groups before any rate is applied, and the sorting decides both the rate and the daily rate the tranches read.

## The sorting rule

The Seventh Schedule para 6 does the sorting in one sentence. Royalties

> "shall be paid into the Federation Account and verified by the Commission and for royalty purposes condensates shall be treated as crude oil and natural gas liquids shall be treated as natural gas."

So for royalty there are two groups. Condensate joins crude oil, and it pays the liquids royalty at the terrain's tranche rate. Natural gas liquids join natural gas, and they pay the gas royalty.

## Condensate counts in the daily rate

Because condensate is crude oil for royalty, it counts toward the daily rate the tranches read. The Regulations say so directly in r.12(1)(b):

> "(b) field produces both crude oil and condensates, the sliding scale shall be applied to the total production of crude oil plus condensates ;"

On Ekene Alpha in 2026 the rows carry 2920000 barrels of oil and 116800 barrels of condensate. The daily rate is crude plus condensate over 365 days, 8320.000000 bopd, and the rate on the whole liquids value is 0.059976. Alpha's 2026 production royalty on liquids is 13625099.038462 USD.

| product | royalty group | rate it pays |
| --- | --- | --- |
| crude oil | liquids | the terrain's tranche rate |
| condensate | liquids | the same tranche rate |
| natural gas | gas | 5 percent, or 2.5 percent used in-country |
| natural gas liquids | gas | 5 percent |

## Each stream at its own price

Crude and condensate share one rate, but each is valued at its own price. The same holds for the royalty by price, which the next module reads: on the case with crude at 95 and condensate at 88 USD/bbl in 2025, on the Regulations base, the engine charges crude at a royalty by price rate of 0.037768 and condensate at 0.031301.

## The tax groups differ

The royalty sorting is not the tax sorting. The hydrocarbon tax has its own definition of what it charges, and the Professional tier reads it. For royalty, the rule is the one sentence of para 6.

## Exercise

Open the royalty calculator and choose "Royalty by terrain and daily rate". Enter shallow_water, the year 2026 and 8320 bopd, and read 0.059976. Now work out Alpha's 2026 daily rate from crude alone, the oil barrels in the table above over the calendar days the panel prints, and enter it. Compare the two rates and say why the first is the one the text requires. Then switch to "The instruments stacked on a ledger", run ekene_alpha_shallow_converted_nta, set the 2026 condensate in the case box to 0, run it again and note how the total royalties tile moves.
