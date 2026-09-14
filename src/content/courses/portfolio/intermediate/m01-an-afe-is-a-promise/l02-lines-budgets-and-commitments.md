# Lines, budgets and commitments

A commitment is money the AFE has already promised to a contractor through an order or a contract and has not yet paid. It sits between the budget and the actual, and a cost report that leaves it out reads a line as healthier than it is.

{{panel:ec-cost-explorer}}

## Three amounts on every line

OFON-1's lines in USD, with the sum the forecast rule reads:

| code | budget | commitment | actual | actual + commitment |
| --- | --- | --- | --- | --- |
| DRL-01 | 14200000 | 2600000 | 9800000 | 12400000 (derived) |
| CSG-02 | 3900000 | 0 | 4300000 | 4300000 (derived) |
| CMT-03 | 1250000 | 300000 | 640000 | 940000 (derived) |
| LOG-04 | 2100000 | 900000 | 350000 | 1250000 (derived) |
| CMP-05 | 5600000 | 1200000 | 0 | 1200000 (derived) |

The engine totals the budget at 27050000, commitments at 5000000 and actuals at 15090000. The commitment column adds as 2600000 + 0 + 300000 + 900000 + 1200000 = 5000000.

## The budget belongs to the line

Each budget is the sum authorised for one scope of work. The engine forecasts each line on its own and adds the line forecasts into the EAC, so money left on DRL-01 is never lent to CSG-02. DRL-01 has 9800000 spent and 2600000 committed, 12400000 in all, against 14200000. CSG-02 has spent 4300000 against 3900000 with nothing left to commit. The AFE total can look comfortable while one line is already past its authorisation.

## What a commitment changes

LOG-04 shows an actual of 350000 against a budget of 2100000, which looks like a line barely touched. Add the 900000 committed and 1250000 of the line is already spoken for. CMP-05 shows an actual of 0, and 1200000 is committed before any completion money has been spent.

Commitments enter one reading and stay out of the others. The forecast rule compares each budget with actual + commitment, so commitment can raise an EAC. Earned value, CPI and percent spent read actuals only: percent spent on OFON-1 is 55.7856 percent, the 15090000 of actuals over the 27050000 budget, and the 5000000 committed sits outside it.

## What it refuses

The commitment is a figure someone typed. The engine does not check it against a contract, does not tie it to any invoice, and does not stop actual + commitment passing the budget. If a paid order is moved into the actual without being taken out of the commitment, actual + commitment counts it twice, and the forecast rule reads the double count as an overrun. A commitment of 0 on CSG-02 is not a sign of safety either; that line's money is already out of the door.

## The mistake

The common mistake is reading actual against budget and stopping there. Summed that way, OFON-1 has spent 15090000 of 27050000 and seems to have ample room. The commitments add 5000000 already promised, and CSG-02 alone is over its line. The opposite mistake is treating a large commitment as a forecast: DRL-01's 12400000 of actual + commitment is still under its budget, so the rule forecasts the line at 14200000 and leaves it there.

## Exercise

For DRL-01, LOG-04 and CMP-05, write the budget, commitment, actual and actual + commitment, and say whether actual + commitment passes the budget on each. Then explain why CSG-02 is the only line whose actual + commitment is larger than its budget, and give that figure.
