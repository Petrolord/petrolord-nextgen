# What it refuses

The engine refuses a run rather than emitting a zero answer when an upload cannot be read. There are eight refusals, each with its own message, and each one names a header you can fix.

## The eight

Every message except the last begins "Ingestion validation failed", and every one says what it found and what it wanted.

| Refusal | Message |
| --- | --- |
| no_volume_columns | Production file: no oil/gas/condensate volume columns recognized. Headers found: date, oil_production. Expected per-well columns ending in _oil_bbl / _gas_mscf / _condensate_bbl, or bare oil_bbl / gas_mscf / condensate_bbl. |
| no_usable_date | Production file: no row had a usable date. Provide a "year", "date" (year-month or year-month-day), or "month_index" column. |
| capex_no_cost_column | CAPEX file: no cost column recognized. Headers found: category, date, spend. Expected one of amount_usd / cost_usd / capex_usd / total_capex_usd / value_usd (or any *_usd column). |
| opex_no_cost_column | OPEX file: no cost column recognized. Headers found: date, monthly_cost. Expected one of total_opex_usd / opex_usd / cost_usd / amount_usd (or any *_usd column). |
| oil_price_unset | Oil price (oil_price_usd_bbl) is not set but the production data has oil volumes. |
| gas_price_unset | Gas price (gas_price_usd_mscf) is not set but the production data has gas volumes. |
| ambiguous_cost_aliases | CAPEX file: a row has multiple cost columns populated with different values (amount_usd, cost_usd). Keep exactly one cost column per row so the amount is unambiguous. |
| no_production_rows | No production data found. Upload and process a CSV first. |

## Why refuse

A header the engine does not recognise is not a zero. A production file headed date, oil_production has oil in it; running it as zero oil would produce a ledger with revenue 0.00, take null and payback beyond project life, and a reader would be told the field is worthless when the file was mislabelled. So the engine stops. The same for a price: an unset oil_price_usd_bbl with oil volumes in the file is refused rather than priced at nothing.

## The pairs to keep apart

Four of the refusals are about names, two about prices, one about ambiguity and one about emptiness. The useful skill is telling a refusal from its near neighbour that runs.

Ambiguity against duplication. A capex row carrying amount_usd and cost_usd with different values is refused. The same row with both columns at 30000000 is accepted once, and the year's capex is 30000000.00, not doubled. The message says which: different values, refused; the same value, taken once.

Unrecognised against unpriced. oil_production is not a volume column and stops the run. water_bbl is a volume column and does not: the case_insensitive_headers upload carries Water_BBL=20000, the engine reads 20000.00 bbl of water for 2027, and revenue is 7500000.00 from the 100000.00 bbl of oil alone. Water goes into the annual volumes and earns nothing, silently.

Gas price against gas presence. gas_price_unset fires only when the production data has gas volumes. The hand-derived case has gas_price_usd_mscf=0 and gas_mscf 0.00 in every row, and it runs.

## What refusal does not cover

The engine refuses what it cannot read. It does not refuse what it can read and should not believe. A total_usd column of 99 beside drilling_usd 20000000 and facilities_usd 5000000 is not refused; it is ignored, and capex is 25000000.00. A column headed w1_oil_bbl_forecast is not a volume column: alone, the file fails as no_volume_columns; beside a real one, it is dropped without a word. Every silent drop is a check the reader makes on the annual volumes the engine reports back.

## The mistake

The careful mistake is to fix the message rather than the file: renaming spend to amount_usd when the column holds a rate rather than a cost, or adding a year column with one value on every row to satisfy no_usable_date. The refusal goes away, the ledger is wrong, and no later refusal will catch it. A refusal is the engine's only chance to object; after the door, it believes you.

## Exercise

Write the eight refusal names from memory, grouped as names, prices, ambiguity and emptiness. Then take the ambiguous_cost_aliases row and say what single edit turns it into the duplicate_identical_aliases row, and what capex the engine then reports.
