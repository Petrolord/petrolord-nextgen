# Volumes by well and by year

The production file is the only place the engine learns how much was sold, and it reads volumes by the shape of the header, not by what the column means in the field.

{{panel:ec-ledger-explorer}}

## Which headers are volumes

A column is a volume column when its name ends in one of three suffixes, on its own or behind a well prefix. The published test of the recogniser:

| Header | Volume column |
| --- | --- |
| oil_bbl | true |
| w1_oil_bbl | true |
| total_oil_bbl | true |
| gas_mscf | true |
| w2_gas_mscf | true |
| condensate_bbl | true |
| water_bbl | true |
| OIL_BBL | true |
| oil | false |
| oil_price_usd_bbl | false |
| opex_usd | false |
| year | false |
| date | false |
| month_index | false |
| w1_oil_bbl_forecast | false |

The suffix must be last. w1_oil_bbl_forecast fails because forecast follows it; oil fails because there is no unit. Case does not matter, so OIL_BBL and Oil_BBL are the same column as oil_bbl. water_bbl passes because water is a volume the engine tracks, though it is never priced.

## From rows to a year

Every row is dated, and every volume in every row with the same year is added into that year. The alaoma_csv_ingestion upload has two rows, date=2027-01 with oil_bbl=100000 and date=2027-02 with oil_bbl=90000, plus water_bbl of 20000 and 25000. The engine reads 2027 as oil 190000.00 bbl, gas 0.00 Mscf, condensate 0.00 bbl, water 45000.00 bbl. The other columns in those rows, days_in_month, liquid_bbl, oil_rate_bopd and watercut_pct, are carried past without being read: none ends in a volume suffix.

AKATA's file is already annual. Its rows run from year=2029 akata_oil_bbl=2200000 akata_gas_mscf=1760000 to year=2035 akata_oil_bbl=770000 akata_gas_mscf=616000, one row a year, and the ledger's oil_bbl and gas_mscf columns repeat them to two decimals. The totals are oil 9680000.00 bbl and gas 7744000.00 Mscf.

## By well

A prefix is a well. w1_oil_bbl and w2_oil_bbl are two wells' oil, and the year's oil is their sum. The per_well_beats_total_rollup upload has well1_oil_bbl=60000 and well2_oil_bbl=40000 for 2027, and the engine reads 100000.00 bbl. The prefix can be anything, akata or w1 or a real well name, as long as the suffix closes the header. A file with many wells needs one oil column per well and, if there is gas, one gas column per well, and the engine sums each stream across all of them.

## What it refuses

A production file with no recognised volume column is refused: headers date, oil_production draw the message "no oil/gas/condensate volume columns recognized" with the expected suffixes listed. The message names oil, gas and condensate. Whether a water column alone would carry a file past the check is not something the published cases show, so do not rely on it.

## The mistake

The careful mistake is a header that reads right and ends wrong. A column called oil_bbl_forecast, or Oil (bbl) with the unit in brackets, is a column a person reads instantly and the engine drops. If it is the only oil column the run is refused and the message says so. If it sits next to a real oil column the run proceeds without it, and the only trace is that the annual volume the engine reports is smaller than the one in the spreadsheet. Compare the engine's annual volumes with your own sum before reading anything else in the ledger.

## Exercise

In the explorer, load the alaoma_csv_ingestion rows and confirm the 2027 oil volume of 190000.00 bbl and water of 45000.00 bbl. Then say what the engine would report for 2027 oil if the February header were oil_bbl_forecast, and whether it would refuse the file.
