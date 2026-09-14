# The currency of the AFE

An AFE is kept in one currency, and every amount in it, from a line budget to a partner's bill, is a whole number of that currency. OFON-1 is kept in USD.

{{panel:ec-cost-explorer}}

## Whole units, as printed

OFON-1's totals in USD:

| reading | amount |
| --- | --- |
| budget | 27050000 |
| commitments | 5000000 |
| actuals | 15090000 |
| EAC | 27600000 |
| variance at completion | -550000 |
| earned value | 15231500 |

These are written the way the engine prints them: whole dollars, no decimals, no scaling. A figure like 27050000 is not rewritten in thousands or millions, because every lesson, report and exercise on this AFE quotes the engine's own figure and a rescaled one cannot be checked against it.

## One currency, no conversion

The AFE holds a single currency code for all its lines, invoices and partners. There is no exchange rate among its inputs. A cost bought in another currency has to be converted before it is typed, at a rate the engine never sees and no report records.

The partner split stays in the AFE's currency too. The operator's 25.0000 percent of the 27050000 budget is 6762500 USD, and the operator's share of the 15090000 of actuals to date is 3772500 USD.

## Ratios carry no currency

CPI 1.009377 is earned value over actuals, 15231500 over 15090000. Percent spent, 55.7856 percent, is actuals over budget. Percent complete, 56.3087 percent, is earned value over budget. SPI as of 2027-08-15 is 0.872063. Each is one amount divided by another in the same currency, so the unit cancels. They print to six decimals as ratios or four as percents, and they would read the same if every amount on OFON-1 were in another currency, as long as all of them were.

## The capital portfolio is another model

The capital portfolio works in million USD to four decimals, with projects funded whole against a capex limit. OFON-1 works in whole USD against line budgets. The two share nothing: no project, no amount, no convention. A figure from one never belongs in a sum with the other, even when both are nominally in dollars.

## The mistake

The mistake is scaling. Someone converts 27050000 into millions to lay it beside a portfolio figure, rounds it on the way, and now holds a number the engine never printed and the AFE never authorised. The other mistake is a mixed ledger: a line entered in a local currency beside lines in USD, which the engine adds without complaint because it has no way to know.

## Exercise

State OFON-1's currency, budget, EAC and variance at completion as the engine prints them. Then explain why CPI 1.009377 would be unchanged in any single currency, and why a portfolio figure in million USD must never be added to an OFON-1 amount.
