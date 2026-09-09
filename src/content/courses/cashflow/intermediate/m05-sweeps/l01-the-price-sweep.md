# The price sweep

Hold every input still, move the flat oil price, and read what each KPI does. The sweep is a set of separate runs, and every one of them is a full ledger.

{{panel:ec-time-explorer}}

## AKATA from 30 to 120

| oil price, USD/bbl | NPV | IRR, percent | payback | take, percent |
| --- | --- | --- | --- | --- |
| 30 | -169873348.04 | null | Beyond project life | null |
| 40 | -115833227.55 | -21.3703 | Beyond project life | null |
| 50 | -66917909.83 | -6.6218 | Beyond project life | 135.2824 |
| 60 | -21406234.12 | 4.7647 | 5.72 years | 87.4083 |
| 70 | 22132715.69 | 15.5313 | 4.38 years | 73.3000 |
| 82 | 72534830.66 | 29.2361 | 3.46 years | 66.1723 |
| 90 | 106034602.79 | 39.5784 | 3.03 years | 63.3848 |
| 100 | 147909317.95 | 54.5010 | 2.65 years | 60.9584 |
| 120 | 231658748.27 | 95.2151 | 2.11 years | 57.9418 |

NPV crosses zero between 60 and 70 USD/bbl; the breakeven, solved rather than read off a grid, is 64.916777. The IRR crosses the nominal 10 percent in the same interval. Payback comes inside the seven-year life at 60 and shortens to 2.11 years at 120.

## What the price does to the tax column

Tax at 82 USD/bbl runs 45250880.00, 34164004.80, 25978830.05, 18973021.63, 12916305.18, 7874312.43, 3267865.37. At 50 it runs 21314880.00, 13633444.80, 8433524.45, 3963295.68, 79525.71, 0.00, 0.00: the last two years pay nothing, because depreciation of 25500000.00 and escalated opex outrun the revenue. At 30 only the first two years pay, 6354880.00 and 801844.80. Total tax falls from 279459095.32 at 120 to 7156724.80 at 30, and the take rises as the tax falls: 57.9418 percent at 120, 87.4083 at 60, 135.2824 at 50, 247.7770 at 45.

## Take beyond 100 percent

Take is the government's share of the pre-take value, revenue less capex less opex. At 50 USD/bbl that value is small and the royalty is charged on revenue regardless, so the government keeps more than the whole and the contractor's real net cash flow totals -45016230.39. At 40 USD/bbl and lower take is reported null: a share of a pre-take value that has stopped being positive is not reported. A take above 100 percent is not an error; it is a royalty on a loss.

## The published PIA sweep

oil_price_multiyear_pia_real moves a six-year PIA field from 40 to 120 USD/bbl. NPV runs from -145273028.51 to 423341704.82, IRR from -12.3012 to 107.7859 percent. Take reads 144.0232 at 40, 71.1024 at 80 and 71.3286 at 120: the PIA cascade holds its take almost flat where the JV take on AKATA keeps falling, because the PIA's price royalty tiers rise with price. Unit technical cost is 32.823299 USD/boe at every point, since cost per barrel has no price in it.

## The mistake

The careful mistake is to sweep the price and read the result as a probability. Nine ledgers at nine prices say what the field is worth if the price is that number for the whole life, flat, with the 2 percent escalator on top: at 82 the 2030 applied price is already 83.640000. They say nothing about how likely any price is, and averaging the NPVs across the sweep is not an expected value.

## What it refuses

It refuses to sweep a deck: the sweep moves the flat oil_price_usd_bbl, and a field priced by a deck has no single price to move. It holds the gas price at 3.2 USD/Mscf throughout, so a sweep on AKATA is a sweep on oil only.

## Exercise

Read the NPV and the take at 60 and at 70 USD/bbl. Then say where between them the breakeven must sit, and why take falls while NPV rises.
