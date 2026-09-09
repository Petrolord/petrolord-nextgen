# Dates, years and month indexes

A row needs a year before it can be a year in the ledger, and the engine accepts three ways of saying which one.

{{panel:ec-ledger-explorer}}

## Three date columns

A production row, a capex row or an opex row is dated by a year column, a date column written year-month or year-month-day with hyphens, or a month_index column. The refusal message lists the same three, and if no row carries a usable one the run stops with no_usable_date.

A year column is read as the calendar year itself. AKATA's file runs year=2029 through year=2035, and the ledger has seven rows with those years. A date column is read for its year: alaoma_csv_ingestion rows dated 2027-01 and 2027-02 both land in 2027, and its capex rows dated 2027-01 and 2027-06 do the same, so 30000000 of drilling and 10000000 of flowline become one 2027 capex of 40000000.00. The month is used to find the year and then forgotten.

## The month index

month_index counts months from the base year: 1 to 12 land in base_year, 13 to 24 in the next year. The month_index_rows case uploads production rows month_index=1 through month_index=24, each with oil_bbl=10000. The engine reads 2027 as 120000.00 bbl and 2028 as 120000.00 bbl. Its capex row, amount_usd=5000000 at month_index=1, becomes 2027 capex 5000000.00; its opex row, total_opex_usd=1000000 at month_index=13, becomes 2028 opex 1000000.00, the first month of the second year.

The result reads total revenue 18000000.00, total capex 5000000.00, total opex 1000000.00, payback 1.18 years. Nothing in that ledger knows it was uploaded monthly.

## What the year does to the row

Dating happens before any price is applied, so the price a volume earns depends on which year its date falls in: rows dated 2027-01 and 2027-02 are priced at the 2027 price together, and a row dated the following January at the next year's price, whatever the escalator has made of it. Where a date lands is a pricing decision, not just a filing one.

## What it refuses to guess

The engine does not infer a date. A production file with volumes but no year, date or month_index column is refused, and so is one where the column exists but no row holds a usable value. It does not read a date from a filename, from the row order, or from a column called period or quarter. A month index is only meaningful against base_year: base_year is what month 1 means, and month_index=13 is the year after it.

## The mistake

The careful mistake is a month index that starts in the wrong place. Numbering months from the first production month when production starts in the second year of the model puts a year of volumes into base_year that belong to the year after, and every price, every escalated opex and every cumulative figure shifts one year early. The ledger will look complete. Check it against the plainest reading: month_index=13 is the first month of the year after base_year, so month_index=13 opex must show up in the second row, as the 1000000.00 does.

## Exercise

Load month_index_rows in the explorer and read the two annual volumes and the year each cost fell in. Then say which month index a March row in the second year would carry, and which row of the ledger it would join.
