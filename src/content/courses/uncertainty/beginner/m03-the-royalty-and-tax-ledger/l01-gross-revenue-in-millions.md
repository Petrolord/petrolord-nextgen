# Gross revenue in millions

Gross revenue is the first line of every ledger row: each stream's annual volume times its price, added together and divided by 1e6. Nothing has been paid out of it yet, and nothing in it belongs to the contractor yet.

{{panel:ec-screening-explorer}}

## Volume times price, in millions

The engine writes oil revenue as oil volume times oil price divided by 1e6, gas revenue the same way, and grossRevenue as their sum. On ISIALA the gas volume is 0, so the gas price of 3.5 contributes nothing and every row is oil alone.

| year | oil bbl | oil price | grossRevenue |
| --- | --- | --- | --- |
| 2027 | 1606000.0000 | 70.0000 | 112.4200 |
| 2028 | 1413280.0000 | 70.0000 | 98.9296 |
| 2036 | 508264.2812 | 70.0000 | 35.5785 |
| 2046 | 141552.0984 | 70.0000 | 9.9086 |

Over twenty years ISIALA's totalRevenue is 864.1699 million USD. Because the price is flat, grossRevenue falls by exactly the volume's decline, and 2046 revenue is 0.088140 of 2027's.

The published hand case keeps the arithmetic visible: 1 million bbl a year at 100 USD per bbl gives grossRevenue of 100.0000 in each of its two years and totalRevenue of 200.0000.

## When gas is present

The published 10 year base case is oil only, and its 2028 grossRevenue is 547.5000. The same case with a constant gas price added reads 585.8250 in 2028, and its totalRevenue rises from 3118.5674 to 3371.4351. Gas adds to the same column in the same units, and the quick form never builds it.

## A profile that runs out

A profile shorter than the life reads as zero beyond its end. The published `tr_missing_profiles` case has grossRevenue of 30.0000 and 24.0000 in its first two years, then 0.0000 in 2032 and 2033. Opex of 5.0000 is still charged in both empty years, so each has a net cash flow of -5.0000. The engine does not notice that the field stopped.

## The mistake

The careful mistake is to multiply the daily rate by the price. ISIALA's 4400 bopd at 70 USD per bbl is a day's revenue in USD, and it is nothing like the 112.4200 million USD the ledger books for 2027. The engine multiplies the annual volume, 1606000.0000 bbl, and divides by 1e6. A column built from the daily rate is too small by a year of days, and a column built without the 1e6 is a million times too large. Either one looks like a number, and both flow straight into royalty and tax.

The second mistake is to read grossRevenue as income. On ISIALA in 2027 grossRevenue is 112.4200 and net cash flow is -17.8210. Royalty, capex, opex and tax all come out of that first line, and the first of them, royalty, is taken before any cost is recognised.

## What gross revenue refuses

It refuses a realised price. There is no quality differential, no transport deduction, no working interest and no price that changes with the year. It is volume times a flat price, to four decimals, in million USD, and every later column is built on it.

## Exercise

Compute ISIALA's grossRevenue for 2027 and 2028 from the oil volumes and price, and state totalRevenue. Then explain what the 2032 and 2033 rows of `tr_missing_profiles` show about a profile that ends early, quoting the grossRevenue, opex and net cash flow in those rows.
