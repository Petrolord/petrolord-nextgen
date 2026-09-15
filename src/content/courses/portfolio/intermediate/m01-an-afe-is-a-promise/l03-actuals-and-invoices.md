# Actuals and invoices

An AFE records spending twice: as an actual typed on each cost line, and as a list of dated invoices. The engine reads them for different jobs, and nothing in it checks that the two records still agree.

{{panel:ec-cost-explorer}}

## Two records of the same money

OFON-1's actuals by line, in USD:

| code | actual |
| --- | --- |
| DRL-01 | 9800000 |
| CSG-02 | 4300000 |
| CMT-03 | 640000 |
| LOG-04 | 350000 |
| CMP-05 | 0 |

The engine totals them at 15090000. The invoices run on their own dates:

| invoice date | amount |
| --- | --- |
| 2027-02-20 | 3100000 |
| 2027-04-10 | 5200000 |
| 2027-06-05 | 4400000 |
| 2027-07-18 | 2390000 |

They add as 3100000 + 5200000 + 4400000 + 2390000 = 15090000. On OFON-1 the two records agree by construction. They need not.

## Who reads which

The metrics read actuals from the cost lines. Earned value against actuals, CPI 1.009377, percent spent 55.7856 percent and the forecast rule's actual + commitment all come from the line column. The S-curve reads actuals from the invoices, and places each one by its date. Its Actual series as of 2027-08-15 steps from 3100000 at the Mar 27 point to 8300000 at May 27, 12700000 at Jul 27 and 15090000 at Aug 27, each step the next invoice added in.

An invoice carries a date and an amount and no cost code. No invoice on OFON-1 equals any line's actual: CSG-02's 4300000 is not the invoice of 4400000, and DRL-01's 9800000 matches no single invoice at all. The line actuals say where the money went; the invoices say when it went.

## When they drift apart

Enter a new invoice and forget the line, and the S-curve moves while CPI, percent spent and the EAC do not. Update a line and forget the invoice, and the dashboard moves while the curve stays flat. Either way two screens describe the same AFE with different spend, and each is correct about the record it reads.

## What it refuses

The engine does not reconcile invoices against actuals, and it does not attribute an invoice to a line. It still does not refuse an invoice with no date, but it no longer guesses one. An invoice the engine cannot date, whether its date is null or the field is missing, is kept off the S-curve altogether, and the count of undated invoices is reported beside the curve. In the published undated case neither invoice can be dated, so the curve holds neither and the count reads 2.

## The mistake

The mistake is to treat one agreement as proof of the other record. A reviewer who sees 15090000 on the dashboard and 15090000 at the last actual point of the curve has checked two totals, not two ledgers. Check the dates, check that every invoice has one, and check the sum of the invoices against the sum of the line actuals each time a report is issued. The second mistake is to read an invoice as a line's cost: the 5200000 dated 2027-04-10 could be drilling, casing or both, and the AFE cannot say.

## Exercise

Add OFON-1's four invoices and show that they equal the line actuals of 15090000. Then say which readings would move and which would stay put if a fifth invoice were entered without any line's actual being changed, and what the engine now does with an invoice it cannot date, and what it reports beside the curve.
