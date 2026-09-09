# The units that travel

Every column in the ledger carries a unit and a precision, and the engine never changes either. Learn them once and every table in the course reads the same way.

{{panel:ec-ledger-explorer}}

## The five

Money is USD, printed to two decimals: gross revenue 186032000.00 for AKATA in 2029. Oil and condensate are bbl, gas is Mscf, both to two decimals in the rows: 2200000.00 bbl of oil and 1760000.00 Mscf of gas in that row. Prices are USD per bbl and USD per Mscf, printed to six decimals: applied_oil_price 82.000000 and applied_gas_price 3.200000 in 2029, then 83.640000 and 3.264000 in 2030 once the escalators have worked one year. Rates are percent: jv_royalty_pct=15 means 15 percent, and the engine reports take 66.1723 percent and IRR 29.2361 percent, four decimals each.

## Barrels of oil equivalent

Gas is folded into a single volume at 6 Mscf per barrel, and that convention is fixed. AKATA's totals are oil 9680000.00 bbl and gas 7744000.00 Mscf, and the reported boe is 10970666.67. The three-stream published case reports boe 10300000.00 from oil 5000000.00 bbl, condensate 300000.00 bbl and gas 30000000.00 Mscf: condensate counts as a barrel, gas counts at one sixth of a barrel per Mscf, and nothing else counts.

The boe is what unit costs are quoted on. AKATA's unit technical cost is 40.006602 USD/boe and its opex per boe 16.762800, both to six decimals; the hand-derived case reports 35.000000 and 10.000000 on 2000000.00 boe.

## What is read and what is priced

AKATA's gas is 800 scf per barrel, and the upload column is akata_gas_mscf with 1760000 against 2200000 bbl: the thousand is in the header. A file listing gas in scf under an _mscf header is read as a thousand times too much gas, and nothing objects.

Water is read and not priced: case_insensitive_headers carries Water_BBL=20000, the engine reads 20000.00 bbl of water for 2027, and revenue is 7500000.00 on the 100000.00 bbl of oil alone.

## The mistake

The careful mistake is a rescale. Rounding 186032000.00 to millions loses the decimals that let a reader check the row against the engine; reading 82.000000 as a whole number loses the six that show the escalator's work in 83.640000. Quote what the engine prints. Percent is the other trap: 15 in jv_royalty_pct is a percent value, and a reader who enters the fraction has asked for a royalty a hundred times smaller, and the engine will run it.

## What the units refuse

They refuse to convert: no field for volumes in thousands of barrels, no gas price per boe, no currency but USD. A file in the wrong unit is not refused; it is believed, and every number downstream carries the error at full precision.

## Exercise

Read AKATA's 2030 row in the explorer and write the two volumes, the two applied prices and the gross revenue with their units and printed decimals. Then name the two columns the row's boe comes from and the one number that converts between them.
