# When the file is refused

A refusal is the engine saying it cannot read the file. It is the loud failure, and the loud failure is the easy one.

{{panel:ec-ledger-explorer}}

## Reading the message

Every refusal names the file, what it found and what it wanted. capex_no_cost_column reads "CAPEX file: no cost column recognized. Headers found: category, date, spend. Expected one of amount_usd / cost_usd / capex_usd / total_capex_usd / value_usd (or any *_usd column)." The fix is in the message: spend is a cost with no unit in its name, and a header ending in _usd lets the file through. opex_no_cost_column, with headers date, monthly_cost, is the same story in the opex lane.

The production side has two. no_volume_columns lists the suffixes it wanted, _oil_bbl, _gas_mscf and _condensate_bbl, per well or bare. no_usable_date lists the three date columns. Then two prices, oil_price_unset and gas_price_unset, which fire only when the file has the matching volumes; one ambiguity, ambiguous_cost_aliases, for a row with two cost columns at different values; and no_production_rows, the engine asked to run with nothing uploaded at all.

## Refused against ignored

The refusals guard the door. Once inside, the engine drops what it does not recognise without a word, and those drops are the failures to worry about. The published cases hold several.

| Upload | Silently ignored | What the engine read |
| --- | --- | --- |
| usd_fallback_parts capex | total_usd=99 | 25000000.00 |
| alaoma_csv_ingestion opex | fixed_opex_usd, variable_oil_usd, variable_water_usd, unit_opex_usd_per_bbl | 1490000.00 from total_opex_usd |
| alaoma_csv_ingestion production | days_in_month, liquid_bbl, oil_rate_bopd, watercut_pct | oil 190000.00 bbl |
| per_well_beats_total_rollup | total_oil_bbl=100000 | 100000.00 from the wells |
| case_insensitive_headers | Water_BBL=20000, read but never priced | revenue 7500000.00 |

None of those runs was refused, and every one produced a clean ledger. A reader who only watches for refusals sees five successes.

## What the refusal does not check

It does not check that the number under a recognised header is the right number. A capex column headed amount_usd holding thousands of USD passes and is read at one thousandth of its value. A gas column headed _mscf holding scf passes and is read at a thousand times its value. It does not check that dates make sense against the base year, that the wells add up to any total, or that opex is present at all: per_well_beats_total_rollup runs with no opex file and total opex 0.00.

## The mistake

The careful mistake is to make the message go away. A year column pasted in with one value for every row satisfies no_usable_date and puts every month in one year. A spend column renamed amount_usd satisfies capex_no_cost_column whether or not spend was in USD. The refusal was the engine's last chance to object; after it, the only check is yours: the annual volumes, the annual capex and the annual opex the engine reports back, read against the file before the ledger is read at all.

## Exercise

Take the two refused cost files, headers category, date, spend and date, monthly_cost, and write the single header change that lets each through. Then list, for the alaoma_csv_ingestion upload, every column the engine ignored, and say which one a reader would most want to have been read.
