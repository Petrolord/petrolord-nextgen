# Coverage and the lifetime

{{panel:lp-proof-test}}

A proof test that finds every dangerous undetected failure is an idealisation. A real test strokes a valve part way, or tests the trip without the final element, or exercises a transmitter without proving the impulse line. The fraction it does reveal is the proof test coverage. The failures it leaves behind stay in the equipment until the item is restored as new, which happens at the lifetime T2 and not at the next proof test. Coverage and the lifetime therefore arrive together, and the engine will not accept one without the other.

## The split the engine makes

The engine splits every undetected down time into a covered part and an uncovered part. The covered fraction sees the proof test interval. The uncovered fraction sees the lifetime. The engine's own statement of the split, returned in its basis when coverage is below one, reads as PTC times T1 over j plus one, plus MRT, plus one minus PTC times T2 over j plus one, plus MRT. For a 1oo1 the divisor is two, so the covered failures wait half an interval on average and the uncovered failures wait half a lifetime.

## OBAGI, one shutdown valve

OBAGI is a single shutdown valve as a 1oo1: an undetected failure rate of 9e-7 per hour, a proof test interval of 8760 hours, an MRT of 24 hours and a lifetime of 87600 hours, all stated.

| proof test coverage, stated | tCE hours | PFDavg | RRF | SIL |
| --- | --- | --- | --- | --- |
| 1 | 4404.000000 | 0.003963600000 | 252.295893 | 2 |
| 0.95 | 6375.000000 | 0.005737500000 | 174.291939 | 2 |
| 0.9 | 8346.000000 | 0.007511400000 | 133.130974 | 2 |
| 0.8 | 12288.000000 | 0.011059200000 | 90.422454 | 1 |
| 0.7 | 16230.000000 | 0.014607000000 | 68.460327 | 1 |

A coverage of 0.7 leaves thirty percent of the undetected failures waiting for the ten year overhaul, and the PFDavg is 3.685286 times the perfect test's. The channel equivalent down time tells the same story: it rises from 4404.000000 hours to 16230.000000 hours, which is far longer than half the proof test interval, because most of the waiting is now being done by the uncovered share.

## Why the lifetime has to be typed

Without a lifetime the uncovered share has no end date, so there is nothing to average over. The engine declines the call:

> lifetimeHours: is required when proofTestCoverage is below 1: the uncovered failures stay until the item is restored as new

It also declines a lifetime shorter than the interval, because an item restored as new more often than it is proof tested is a description of something else:

> lifetimeHours: must be at least the proof test interval

Neither refusal carries a number. Both name the field, so the analyst knows what to supply.

## Coverage is a claim about a procedure

Coverage is a number a person asserts about a written test procedure, and the engine applies it exactly as typed. It has no way of knowing whether a partial stroke really exercises the seat, or whether the technician completed the step. That judgement, and the record behind it, stay with the analyst, and a verification note gives the coverage with the procedure it came from.

## Exercise

Take the OBAGI rows at coverage 1 and coverage 0.9. Write the difference between 0.003963600000 and 0.007511400000, then express the second as a multiple of the first to three decimals. Say which of the two rows would still meet a required PFDavg of 0.005, and write one sentence on what a site would have to change to get the 0.9 row back under that requirement.
