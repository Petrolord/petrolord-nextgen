# Imperfect proof test coverage

{{panel:lp-sif-builder}}

A proof test finds what it is designed to find. A full stroke test of a shutdown valve exercises the whole assembly, and a partial stroke test does not. Proof test coverage is the fraction of dangerous undetected failures a test actually reveals, and once it drops below one the failures it misses wait for something else entirely.

## What the uncovered failures wait for

The engine splits every undetected down time in two. The covered fraction waits for the proof test, so it carries the interval divided by the voting factor plus one, plus the repair time after the test. The uncovered fraction waits for the lifetime, the point at which the item is restored as new, so it carries the lifetime divided by the same factor, plus the repair time. The engine states the treatment in its basis as the coverage multiplied by the first down time plus one minus the coverage multiplied by the second.

## Coverage swept on one valve

OBAGI is one shutdown valve as a single channel, with a dangerous undetected rate of 9e-7 per hour, a proof test interval of 8760 hours, a repair time after a test of 24 hours and a lifetime of 87600 hours, all stated.

| proof test coverage | tCE hours | PFDavg | RRF | SIL |
| --- | --- | --- | --- | --- |
| 1 | 4404.000000 | 0.003963600000 | 252.295893 | 2 |
| 0.95 | 6375.000000 | 0.005737500000 | 174.291939 | 2 |
| 0.9 | 8346.000000 | 0.007511400000 | 133.130974 | 2 |
| 0.8 | 12288.000000 | 0.011059200000 | 90.422454 | 1 |
| 0.7 | 16230.000000 | 0.014607000000 | 68.460327 | 1 |

A coverage of 0.7 leaves 30.00 percent of the undetected failures waiting for the ten year overhaul, and the PFDavg it gives is 3.685286 times the perfect test's. Between a coverage of 0.9 and 0.8 the band falls from 2 to 1 on this valve with no other input changed.

## The lifetime becomes a required input

Once the coverage is below one, the lifetime is no longer optional. The engine refuses a call with a coverage below one and no lifetime and names the lifetime as the offending field, because the uncovered failures stay until the item is restored as new. The lifetime must also be at least as long as the proof test interval.

## Why coverage is the hardest input to defend

A failure rate can be cited. An interval is in the maintenance system. A coverage figure is a claim about what a written test procedure physically exercises, and it is the input most often typed optimistically. The table above shows why that matters: the difference between a claimed 0.95 and a real 0.8 on this valve is 0.005737500000 against 0.011059200000, which is close to a factor of two on the number the whole verification rests on.

## Coverage and the equivalent down time

The middle column of the table is the clearest way to see what coverage does. The channel equivalent down time climbs from 4404.000000 hours at a perfect test to 16230.000000 hours at a coverage of 0.7, and the PFDavg climbs with it in exact proportion, because a single channel with no detected failures is simply its dangerous rate multiplied by that time.

## Exercise

Take the perfect test PFDavg of 0.003963600000 and the coverage 0.8 figure of 0.011059200000 for this valve. Compute the ratio of the second to the first to six decimals, compare it with the 3.685286 quoted for a coverage of 0.7, and say what a partial stroke procedure claiming a coverage of 0.95 would have to demonstrate to be believed.
