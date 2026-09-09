# Sunk years

Sunk is a decision about which question is being asked, and the engine answers whichever one you set.

{{panel:ec-time-explorer}}

## The published case

valuation_year_sunk adds treat_prior_as_sunk=true to a valuation in 2031 of a ledger whose base year is 2030. The 2030 row is still computed: gross revenue 100000000.00, royalty 20000000.00, tax 32500000.00, net cash flow minus 12500000.00. The row carries a new column, sunk, reading true, and it is then left out of every value metric.

NPV becomes 37500000.00, the 2031 flow alone. The prior flow is reported separately as sunk_net_cash_flow, minus 12500000.00. Total capex reads 0.00, because the only capex was in the sunk year. IRR is null: with no negative flow left there is nothing to bracket a root. Payback reads Year 0. DPI is null, since there is no PV of capex to divide by. Take falls from 80.7692 percent to 58.3333 percent, because the pre-take value now excludes the year the capex was spent.

## AKATA from 2030

| valuation_year | sunk | NPV | IRR, percent | sunk_net_cash_flow | total capex |
| --- | --- | --- | --- | --- | --- |
| 2030 | false | 77464382.26 | 29.2361 | not reported | 255000000.00 |
| 2030 | true | 206819768.67 | null | -121123680.00 | 45000000.00 |
| 2031 | true | 187959458.93 | null | -89377672.80 | 0.00 |
| 2032 | true | 135836068.30 | null | -24909427.73 | 0.00 |

Same rows, three answers from 2030 alone: 72534830.66 valued at the start, 77464382.26 valued a year later with everything kept, 206819768.67 valued a year later with 2029 written off. Each is right for its question. The first asks whether to start. The second restates the first in 2030 money. The third asks whether to continue, given that 2029 has been paid for and cannot be recovered.

Note the sunk figure: minus 89377672.80 for a 2031 valuation is the cumulative nominal net cash flow through 2030, not the real cumulative of minus 90302313.79. The sunk column is money of the day.

## The mistake

The careful mistake is to carry the continue answer back to the start question. 206819768.67 is not evidence that AKATA was a good investment in 2029; 72534830.66 is. A reader who sanctions on the sunk figure has valued the field without its capex, and any field passes that test. The reverse error is as common: stopping a field because its original NPV has gone negative when its forward NPV, prior years sunk, is still positive. The past cost is the same whether you continue or not.

## What sunk refuses

It refuses to remove the row: the fiscal state still accrues from the sunk year, which is why the published case carries 5000000.00 of depreciation into 2031. It reports the IRR as null rather than as a large number. It refuses to act without a later valuation year: treat_prior_as_sunk on AKATA with valuation_year 2029 flags 0 rows and reports sunk_net_cash_flow as 0.00. And it refuses to decide for you which question you are asking.

## Exercise

Read the NPV for a 2030 valuation with prior years kept and with them sunk, and explain why the difference is larger than the 2029 net cash flow. Then say which of the two answers the start question.
