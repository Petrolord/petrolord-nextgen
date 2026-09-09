# The default nobody set

Leave a field blank and the engine fills it, and the fill is not always zero. The ledger that comes back describes a field you did not quite describe.

{{panel:ec-ledger-explorer}}

## The escalators

Left unset, the oil price escalator and the opex escalator fall back to the inflation rate. The capex escalator does not; it stays at 0. escalator_defaults_to_inflation sets inflation_rate_pct=5 with no oil or opex escalator, base_year=2030, oil_price_usd_bbl=100.

| year | applied_oil_price | gross_revenue | opex | capex |
| --- | --- | --- | --- | --- |
| 2030 | 100.000000 | 100000000.00 | 10000000.00 | 50000000.00 |
| 2031 | 105.000000 | 105000000.00 | 10500000.00 | 0.00 |

The price and the opex climbed at the 5 percent inflation rate. The capex was all spent in 2030, so its escalator had nothing to act on, but the default says it would have stayed put in 2031 regardless.

Set against the hand-derived case, which writes every escalator as 0 with inflation 0, the totals move: revenue 205000000.00 against 200000000.00, opex 20500000.00 against 20000000.00, tax 66750000.00 against 65000000.00, net cash flow 26750000.00 against 25000000.00. Nobody set an oil price escalator, and the ledger has one.

## The defaults that are refusals

Some blanks have no default. oil_price_usd_bbl unset with oil volumes is a refusal, oil_price_unset; the gas twin the same. The engine will guess an escalator from inflation but will not guess a price from anything. That asymmetry is deliberate: an escalator default reproduces the money-of-the-day world a nominal ledger describes, and a price default would be a number from nowhere.

## The default in the deck

A deck has a default of its own: years before the first entry take the first entry's price. deck_before_first_entry has entries for 2031 and 2032, and 2030 reads 90.000000, the 2031 value, while the flat oil_price_usd_bbl=100 is never used. The reader who set 100 as the price and entered a deck starting the next year has a 2030 price of 90 and did not set it.

## What the defaults refuse

They refuse to be visible in the ledger. The 2031 row in escalator_defaults_to_inflation reads 105.000000 whether the escalator was typed as 5 or left blank with inflation at 5, and there is no column that says which. The config is the only record, and a config with a blank in it is a config with the inflation rate in that blank.

## The mistake

The careful mistake is setting inflation for a reason unrelated to prices, then finding prices and opex escalating with it. A reader who wants a flat price and a flat opex in a world with 5 percent inflation writes 0 in each escalator explicitly, as flat_escalator does for opex. The rule is short: a blank escalator is inflation, a zero escalator is flat, and only the capex escalator is safe to leave blank.

## Exercise

Load escalator_defaults_to_inflation and read the 2031 price, opex and capex. Then write the three escalator values, oil, opex and capex, that give the same ledger with inflation left at 5, and say which one you could have left blank.
