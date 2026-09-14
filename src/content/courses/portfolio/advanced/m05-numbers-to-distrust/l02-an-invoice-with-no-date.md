# An invoice with no date

The S-curve builds its Actual line from invoices, bucket by bucket, by invoice date. An invoice whose date is null is counted from 1970, so it sits in every bucket, and an invoice with no date field at all is never counted.

{{panel:ec-governance-explorer}}

## The published undated case

The case has 12 monthly points labelled Jan 20 to Dec 20 and two invoices: one of 100 with no invoice_date field, and one of 200 whose invoice_date is null.

| point | label | Planned | Actual | Forecast |
| --- | --- | --- | --- | --- |
| first | Jan 20 | 0 | 200 | 200 |
| last | Dec 20 | 1101 | 200 | 200 |

At the first point, with Planned still at 0, the Actual line already reads 200. That is the null-dated invoice. The engine counts a null date from 1970, which is earlier than every bucket, so the amount appears from the first point to the last. The invoice of 100 has no date to read and never appears. The curve shows 200 of spend throughout, which matches neither what was invoiced nor when.

## How a dated invoice lands

OFON-1's invoices show the rule working: 3100000 dated 2027-02-20, 5200000 dated 2027-04-10, 4400000 dated 2027-06-05 and 2390000 dated 2027-07-18, a total of 15090000.

| point | label | Actual |
| --- | --- | --- |
| 0 | Feb 27 | 0 |
| 1 | Mar 27 | 3100000 |
| 2 | Apr 27 | 3100000 |
| 3 | May 27 | 8300000 |
| 4 | Jun 27 | 8300000 |
| 5 | Jul 27 | 12700000 |
| 6 | Aug 27 | 15090000 |

The February invoice first appears at Mar 27 and the April invoice at May 27: each invoice counts from the first point after its date. Point 0 reads 0 because nothing is dated before the window opens. A curve that reads above 0 at its first point has counted something dated before its window, and a null date is the first suspect.

## Two sources of actuals

The AFE metrics read actuals from the cost lines, and the S-curve reads them from invoices. On OFON-1 both come to 15090000, because the teaching field was built so they agree. Nothing in the engine makes them agree. A null-dated invoice pushes the curve ahead of the lines, an invoice with no date field leaves it behind, and the CPI of 1.009377 is computed from line actuals the curve never uses.

## Left as published

EC5-0 bounded the S-curve to its window and left the null date as it was. The engine neither refuses nor flags an undated invoice, so the finding is taught as a property of the engine as published.

## The mistake

The mistake is reading an early Actual as early spending. A curve showing 200 of spend at its first point, beside a Planned line at 0, looks like a project well ahead of plan on its costs. The second mistake is trusting the curve's total, which here matches neither invoice list nor cost lines. Before reading any S-curve, check that point 0 reads 0 and that the last Actual equals the actuals on the cost lines.

## Exercise

For the published undated case, give the first and last Actual, say which invoice produced them and which invoice never counts. Then, from OFON-1, say at which point the invoice dated 2027-04-10 first appears and why point 0 reads 0.
