# An invoice with no date

The S-curve builds its Actual line from invoices, bucket by bucket, by invoice date. An invoice the engine cannot date reaches no bucket, and the count of undated invoices is reported beside the curve, so money it cannot place is named rather than misdated.

{{panel:ec-governance-explorer}}

## The published undated case

The case has 12 monthly points labelled Jan 20 to Dec 20 and two invoices: one of 100 with no invoice_date field, and one of 200 whose invoice_date is null.

| point | label | Planned | Actual | Forecast |
| --- | --- | --- | --- | --- |
| first | Jan 20 | 0 | 0 | 0 |
| last | Dec 20 | 1101 | 0 | 0 |

The Actual line reads 0 at the first point and at the last, while Planned climbs to 1101. Neither invoice carries a date the engine can read, so neither reaches the curve: the 200 with a null invoice_date and the 100 with no invoice_date field are treated alike. Beside it the engine reports 2 undated invoices. The curve places what it can; the count names what it cannot.

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

The February invoice first appears at Mar 27 and the April invoice at May 27: each invoice counts from the first point after its date. Point 0 reads 0 because nothing is dated before the window opens. A curve whose Actual never moves while bills are approved is the shape to check now, and the undated count says how many the engine could not place.

## Two sources of actuals

The AFE metrics read actuals from the cost lines, and the S-curve reads them from invoices. On OFON-1 both come to 15090000, because the teaching field was built that way. Nothing in the engine makes them agree. An invoice the engine cannot date leaves the curve behind the lines, and the CPI of 1.009377 is computed from line actuals the curve never uses.

## What the repair changed

EC5-0 bounded the S-curve to its window and left the undated invoice alone; that repair came later. Until it did, a null date was read as a day in 1970, earlier than every bucket, so this case put an Actual of 200 on every point from the first. The figure was plausible, it reconciled with nothing, and no screen said a date was missing. That is why this module exists. The engine still does not refuse an undated invoice: it declines to place it and names the count instead, a smaller number and a better one.

## The mistake

The mistake used to be reading an early Actual as early spending; now it is reading a low Actual as low spending. A curve flat at 0 beside a Planned line ending at 1101 looks like a project that never started, when the bills may simply have arrived with no dates. The count beside the curve separates the two, and it is the reading to take first. The second is trusting the curve's total, which here matches neither invoice list nor cost lines.

## Exercise

For the published undated case, give the first and last Actual, say how many invoices the engine reports as undated, and what each contributes to the curve. Then, from OFON-1, say at which point the invoice dated 2027-04-10 first appears and why point 0 reads 0.
