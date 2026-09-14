# Billing a partner

A partner is billed its working interest of money actually spent. The engine splits whatever total it is handed, so choosing the right total, the actuals to date, is the biller's job and not the engine's.

{{panel:ec-governance-explorer}}

## The actuals split

OFON-1's actuals to date are 15090000 USD. Split by the same working interests that divide the budget:

| party | working interest percent | share of budget | billed on actuals |
| --- | --- | --- | --- |
| Ofon Energy | 40.0000 | 10820000 | 6036000 |
| Enang Petroleum | 22.5000 | 6086250 | 3395250 |
| Mfem Resources | 12.5000 | 3381250 | 1886250 |
| operator | 25.0000 | 6762500 | 3772500 |

Ofon Energy's bill is 15090000 x 40.0000 / 100 = 6036000. The four bills sum to 6036000 + 3395250 + 1886250 + 3772500 = 15090000, the whole of the actuals.

## Which actuals

The AFE carries actuals in two places. The cost lines hold them for the metrics: DRL-01 9800000, CSG-02 4300000, CMT-03 640000, LOG-04 350000 and CMP-05 0, a total of 15090000. The invoices hold them for the S-curve: 3100000 on 2027-02-20, 5200000 on 2027-04-10, 4400000 on 2027-06-05 and 2390000 on 2027-07-18, an invoice total of 15090000. On OFON-1 the two agree by construction. On a real AFE they need not, and a bill should name which one it split.

## Which totals are not bills

The commitments of 5000000 are orders placed, not money spent, and billing them charges partners for work nobody has invoiced. The budget of 27050000 is an authorisation, and the EAC of 27600000 is a forecast. Billing Ofon Energy its budget share of 10820000 today would charge it for 40.0000 percent of work not yet done. The same interest applied to the EAC is a forecast of a partner's final exposure, useful for its own planning and wrong on an invoice.

## What the report used to do

Before EC5-0 the AFE summary PDF billed two invented partners, Partner A at 30 percent and Partner B at 10 percent, whatever partners had been saved. An AFE with Ofon Energy, Enang Petroleum and Mfem Resources would have printed a split for parties that do not exist. The repaired PDF bills the AFE's saved partners and prints the engine note whenever the split is invalid.

## The mistake

The mistake is reading a bill without its total. A figure of 6036000 is right as 40.0000 percent of actuals and wrong as a share of anything else. The second mistake is billing from a split marked valid false, on the reasoning that the amounts still add to the cost. They do, and the note is there to stop that bill.

## What it refuses

The split has no cash call, no advance billing against a forecast and no record of what each partner has already paid. It applies one set of interests to one total in the AFE's own currency, USD on OFON-1, and it converts nothing.

## Exercise

Split OFON-1's actuals to date between the four parties and check the sum. Then name the two places the AFE records actuals, and explain why the commitments of 5000000 and Ofon Energy's budget share of 10820000 are not amounts to bill.
