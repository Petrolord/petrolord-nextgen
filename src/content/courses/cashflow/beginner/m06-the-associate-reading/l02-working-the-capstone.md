# Working the capstone

A ledger question hands you files and a configuration and asks for readings. The method is to build the first row by hand, prove it against the engine, and only then trust the rest.

{{panel:ec-ledger-explorer}}

## Step one: the files must be readable

Before any arithmetic, check what the engine will accept. Production needs a year, a date or a month_index, and volume columns ending in _oil_bbl, _gas_mscf or _condensate_bbl, or the bare forms. Capex and opex need one cost column each, and every stream with volumes needs a price. AKATA passes: akata_oil_bbl and akata_gas_mscf by year, amount_usd for capex, total_opex_usd for opex, oil_price_usd_bbl 82 and gas_price_usd_mscf 3.2. A file that fails is refused with a message, not run with a zero, and the reading of a refused run is the refusal, with its reason.

## Step two: build one row by hand

Choose the first year, because it holds the capex and it is where mistakes are loudest. AKATA 2029:

| line | how | value |
| --- | --- | --- |
| gross_revenue | 2200000.00 bbl at 82.000000 plus 1760000.00 Mscf at 3.200000 | 186032000.00 |
| royalty | 15 percent of gross | 27904800.00 |
| opex | typed, no escalation in the base year | 24000000.00 |
| depreciation | a tenth of the 210000000.00 spent this year | 21000000.00 |
| taxable_income | gross less royalty, opex, depreciation | 113127200.00 |
| tax | 40 percent of taxable income | 45250880.00 |
| capex | typed | 210000000.00 |
| net_cash_flow | gross less royalty, opex, capex, tax | -121123680.00 |

If the row does not match the engine to the cent, stop. The gap tells you which convention you broke: a net 21000000.00 too low means depreciation was charged to cash; a tax of 0.00 means capex was deducted from the base; a royalty smaller than 27904800.00 means it was taken off something net.

## Step three: a second row, for the escalators

The base year hides the escalators, so prove a later row. AKATA 2030: applied_oil_price 83.640000, applied_gas_price 3.264000, opex 24720000.00, depreciation 25500000.00 now that the 45000000.00 tranche has joined, gross revenue 159564720.00, tax 34164004.80, net 31746007.20. If the price is still 82.000000 in your 2030 row, the oil escalator was not applied; if the opex is still 24000000.00, the opex escalator was not.

## Step four: read down, not across

With two rows proven, take the engine's columns and read the readings this tier owns. Cumulative: trough -121123680.00 in 2029, crossing between -29534809.71 and 19845806.34, payback 3.461632 years from the nominal running sum. Totals: revenue 857602518.80, capex 255000000.00, opex 183899092.34, tax 148425219.46. Boe 10970666.67 with gas at 6. Unit technical cost 40.006602, opex per boe 16.762800. Take 66.1723 percent. If the question is asked at a working interest, scale the money readings and leave the volumes and the unit costs alone, and quote the take from the 100 percent row, because that is the only row on which it is the government's share.

## Step five: the checks a reader makes

Four checks catch most wrong ledgers. Tax is not zero in a year that spent capex. The depreciation column sums to no more than the capex, 174000000.00 against 255000000.00 on AKATA. The last cumulative equals the total net cash flow, 117362408.71 on the real column. And the take sits between the royalty rate and 100 percent unless the field lost money in total.

## What the method refuses

It gives you no number the ledger does not hold: no discounting, no return, no value of waiting. It proves two rows and trusts the rest on the strength of them, so a convention that only bites in a later year, a loss carried or a limit reached, is not caught by it. And it cannot rescue a refused upload; the only fix for a missing price is the price.

## Exercise

Take the hand-derived case and work its 2030 row by hand: revenue 100000000.00, royalty at 20 percent, opex 10000000.00, depreciation 5000000.00, tax at 50 percent, capex 50000000.00. Confirm -12500000.00. Then apply the four checks to its two-row ledger and say which check the 2030 row alone can already pass.
