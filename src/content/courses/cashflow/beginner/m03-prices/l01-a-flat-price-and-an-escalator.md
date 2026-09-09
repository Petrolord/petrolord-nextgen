# A flat price and an escalator

With no deck, the applied price is one number for the base year and an escalator applied for every year away from it, in both directions.

{{panel:ec-ledger-explorer}}

## The rule

oil_price_usd_bbl is the price in the base year. oil_price_escalator_pct compounds it forward one year at a time. The flat_escalator case sets base_year=2030, oil_price_usd_bbl=100 and oil_price_escalator_pct=10, and the ledger applies 100.000000 in 2030 and 110.000000 in 2031. On 1000000.00 bbl a year the gross revenue is 100000000.00 then 110000000.00, and total revenue is 210000000.00.

AKATA runs the same rule at a gentler rate: oil_price_usd_bbl=82 with oil_price_escalator_pct=2 from base_year=2029.

| year | applied_oil_price |
| --- | --- |
| 2029 | 82.000000 |
| 2030 | 83.640000 |
| 2031 | 85.312800 |
| 2032 | 87.019056 |
| 2033 | 88.759437 |
| 2034 | 90.534626 |
| 2035 | 92.345318 |

The six decimals are the compounding made visible. 85.312800 in 2031 is not 82 plus two equal steps; it is 83.640000 escalated again, and each step is larger than the one before it. The gas price in the same rows runs 3.200000, 3.264000, 3.329280 on its own escalator, and the revenue column carries both.

## Both directions

The resolver, asked for a flat 80 with a 10 percent escalator from base year 2030, returns 80.000000 in 2030, 88.000000 in 2031, 96.800000 in 2032, 106.480000 in 2033, 117.128000 in 2034 and 128.840800 in 2035. Asked for years before the base it de-escalates: 72.727273 in 2029 and 66.115702 in 2028. The base year is the anchor, not the first year of production. A field whose first row is dated before its base year is priced under the flat price, and a reader who assumed the flat price was the starting price will not find it in the first row. The published ledgers all start at or after their base year, so the de-escalated years appear only in the resolver's output, but the resolver is what the ledger calls.

With the escalator at 0 the same call returns 80.000000 in every year from 2028 to 2035. Zero means flat.

## What it refuses

It refuses to run without a price. oil_price_unset stops the run when the production data has oil volumes and oil_price_usd_bbl is not set; there is no default price. It refuses nothing else on this path: an escalator of 10 compounds without a ceiling, and 128.840800 in 2035 is the engine doing what it was told. Whether that is a price anybody will pay is not its question.

## The mistake

The careful mistake is a blank where a zero was meant. An escalator that is not set does not mean flat: it falls back to the inflation rate. The escalator_defaults_to_inflation case sets inflation_rate_pct=5 and leaves oil_price_escalator_pct out, and the applied price is 100.000000 then 105.000000, revenue 100000000.00 then 105000000.00. flat_escalator wrote opex_escalator_pct=0 explicitly and got flat opex. A reader who wanted a flat price and left the field empty with inflation set has an escalating one, and the ledger will not say so beyond the second row's price.

## Exercise

Open AKATA in the explorer and read the applied oil price for 2031 and 2032. Then, using the resolver's series for a flat 80, say what the 2029 price is for a field whose base year is 2030, and why it sits under 80.
