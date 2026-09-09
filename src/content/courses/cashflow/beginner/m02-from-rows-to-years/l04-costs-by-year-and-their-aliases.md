# Costs by year and their aliases

A cost row is a date and one amount in USD, and the engine finds the amount by trying a short list of header names, then falling back to a sum.

{{panel:ec-ledger-explorer}}

## The preferred aliases

For capex the engine looks for amount_usd, cost_usd, capex_usd, total_capex_usd or value_usd. For opex it looks for total_opex_usd, opex_usd, cost_usd or amount_usd. Case is ignored: Cost_USD and Total_Opex_USD in the case_insensitive_headers upload are read as 30000000.00 of capex and 750000.00 of opex for 2027.

A preferred alias, when present, is the amount; the rest of the row is carried past. The alaoma_csv_ingestion opex rows carry fixed_opex_usd=500000, variable_oil_usd=200000, variable_water_usd=50000, unit_opex_usd_per_bbl=7.5 and total_opex_usd=750000 for 2027-01, then total_opex_usd=740000 for 2027-02. The engine reads total_opex_usd both times and the 2027 opex is 1490000.00. The parts are not added to the total; the unit rate is not multiplied by anything.

## The fallback

With no preferred alias, every column ending in _usd is summed, and columns prefixed total_ are excluded from that sum. The usd_fallback_parts case makes the rule visible: a capex row of drilling_usd=20000000, facilities_usd=5000000 and total_usd=99 gives 2027 capex 25000000.00; an opex row of fixed_usd=400000 and variable_usd=100000 gives 500000.00. The 99 is excluded because of its prefix, and the parts sum because nothing preferred was there to stop them.

## Rows into years

Cost rows are dated the same three ways production rows are, and rows in the same year add. alaoma_csv_ingestion has capex rows for 2027-01 (Well A1, cost_usd=30000000) and 2027-06 (Flowline, cost_usd=10000000), and the 2027 capex is 40000000.00. The category, item and basis_note columns are labels; the engine reads none of them. AKATA's capex is two rows, year=2029 amount_usd=210000000 and year=2030 amount_usd=45000000, and its opex is seven rows of total_opex_usd=24000000, one a year from 2029 to 2035, before any escalator touches them.

## Two aliases in one row

Two preferred aliases in one row is the rule to memorise. If they hold the same value, the value is taken once: amount_usd=30000000 with cost_usd=30000000 reads as capex 30000000.00. If they hold different values, the run is refused with ambiguous_cost_aliases: "Keep exactly one cost column per row so the amount is unambiguous." The engine will not pick the first, the larger or the sum.

## What it refuses

A cost file with no recognisable amount is refused, and the message lists what it looked for: a capex file headed category, date, spend fails, as does an opex file headed date, monthly_cost. Neither spend nor monthly_cost ends in _usd, so the fallback finds nothing either. The unit is in the header or the column is not a cost.

## The mistake

The careful mistake is the fallback firing when the reader thought an alias was in charge. An opex file with fixed_usd, variable_usd and a hand-computed total_usd has no preferred alias, so the parts are summed and the total is excluded: the number the reader checked is the one number the engine does not use. Had the total been headed total_opex_usd it would have been preferred and the parts ignored instead. Same amounts, different header, different ledger; check the annual opex the engine reports against the file.

## Exercise

Load usd_fallback_parts in the explorer and confirm capex 25000000.00 and opex 500000.00 for 2027. Then say what the capex would read if the total_usd column were renamed total_capex_usd, and which rule decided it.
