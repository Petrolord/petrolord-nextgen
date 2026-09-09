# The Fisher rate

The real discount rate is not the nominal rate less inflation. It is the ratio of two growth factors, and the engine derives it rather than accepting it.

{{panel:ec-time-explorer}}

## The relation

One year at the nominal rate multiplies money by one plus the rate; one year of inflation multiplies prices by one plus the inflation. The real rate is what is left when the second is divided out of the first: one plus the nominal, over one plus the inflation, less one. On AKATA that is 10 percent against 3 percent, reported as the applied real rate of 6.796117 percent.

The sweep holds the nominal rate at 10 and moves inflation:

| inflation, percent | applied real rate, percent | NPV |
| --- | --- | --- |
| 0 | 10.000000 | 72534830.66 |
| 1 | 8.910891 | 72534830.66 |
| 2 | 7.843137 | 72534830.66 |
| 3 | 6.796117 | 72534830.66 |
| 5 | 4.761905 | 72534830.66 |
| 8 | 1.851852 | 72534830.66 |

At zero inflation the real rate is the nominal rate. At 8 percent it is 1.851852 percent, and a subtraction would have put it higher. The gap grows with inflation and always in one direction: subtraction overstates the real rate, and an overstated rate understates every discounted row.

## Why the NPV column does not move

The real basis deflates each flow and discounts it at the real rate; the nominal basis discounts the flow as it stands at the nominal rate. Because the real rate was built by dividing the inflation out of the nominal rate, the two operations multiply back to the same factor. The 2033 flow of 44874457.77 deflates to 39870374.51 over four years of 3 percent and discounts to 30649858.46 at 6.796117 percent; the same 44874457.77 discounts at 10 percent to 30649858.46.

That is why NPV reads 72534830.66 at every inflation in the sweep while the real total net cash flow falls from 141637829.18 to 83912631.29. The deflator and the rate cancel exactly, and a change in inflation that changes no row of the ledger cannot change its value. The Fisher relation is not an approximation the engine tolerates; it is the identity that makes the real basis a restatement rather than a different answer.

## The mistake

The careful mistake is the subtraction, and it is dangerous because it changes nothing visible in the rows. A reader who deflates the flows correctly and then discounts them at a subtracted rate produces an NPV smaller than 72534830.66 with no row to blame. The wrong number will look like a slightly conservative valuation. Check the applied real rate the engine prints; a hand calculation at any other rate will not reconcile.

The second mistake is to pair the real rate with nominal flows or the nominal rate with real flows; the first overstates value and the second understates it.

## What the rate refuses

There is no configuration key for a real rate in any published case: discount_rate_pct is nominal, and the real rate is always derived from it and from inflation_rate_pct. It refuses to see the escalators: the applied real rate is 6.796117 percent on AKATA, on multiyear_pia_real, on multiyear_jv_real and on pia_loss_relief, whatever their prices do, because only the inflation rate enters it. And the cancellation refuses to hold under mid-year, where the half-year shift uses a different factor on each basis and the NPVs part: 69159247.46 nominal against 70188970.32 real.

## Exercise

Read the applied real rate at 3 percent and at 8 percent inflation and say what a subtraction would have given in each case. Then explain why the NPV column did not move.
