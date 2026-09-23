# No reset after a signal

{{panel:dq-monitor-explorer}}

When a CUSUM sum passes h, the engine reports the signal and carries on from where the sum stood. It does not restart the sums at zero. On EKENE-3, with k 0.5 and h 4 in sigma units, S_hi jumps to 26.197812 on day 8, the glitch, and stays above h, 15.096251 psi, on 8 days from day 8 to day 16. It dips to 13.396717 on day 11 and signals nothing that day, then climbs back over h on day 12.

| day | pressure, psig | S_hi | signal |
| --- | --- | --- | --- |
| 8 | 633.800000 | 26.197812 | high |
| 9 | 608.000000 | 20.930780 | high |
| 10 | 611.100000 | 18.763749 | high |
| 11 | 607.900000 | 13.396717 | none |
| 12 | 618.000000 | 18.129686 | high |
| 13 | 619.500000 | 24.362655 | high |
| 14 | 615.700000 | 26.795623 | high |
| 15 | 613.000000 | 26.528592 | high |
| 16 | 604.500000 | 17.761560 | high |

## What no reset means

The recursion is the whole rule. S_hi on day 9 is day 8's 26.197812 plus day 9's reading less the target less k, floored at zero. Nothing in the engine sets it back after the signal. So one large reading keeps S_hi high for as many days as it takes ordinary readings to drain it, and on EKENE-3 the glitch's excess, together with days 12 to 15 reading above target, keeps S_hi above h on every day to day 16 except day 11.

## The alternative, and why the engine did not take it

A common practice restarts both sums at zero once a signal has been investigated, so that the chart looks for the next event from a clean start. That is a decision about the process: it presumes the cause has been found and dealt with. The engine has no way to know that. It reports the sums as they stand, with the rule written in its basis block, "S_hi or S_lo strictly above h; no reset after a signal". A caller who has found a cause and wants a fresh start charts the days after it as a new series, and says so in the note.

## Reading a run of signals

Because the sums carry on, a run of consecutive signals can be one event seen repeatedly. The eight upper signals from day 8 to day 16 are the glitch and the days after it, and a note that counted them as eight separate events would overstate what happened. The first day of each run is the day to report, with the length of the run beside it.

## The low side

S_lo tells the same story on the other side. It passes h on day 21 at 19.657812 and stays above it on every day to day 40, where it reads 62.324215. That run is the planted shift from day 16, held in the sum because nothing resets it. Its first day, 21, is the figure a monitoring note leads with.

## Exercise

Using the table, check day 9's S_hi: start from 26.197812, add day 9's reading of 608.000000, and take away the target of 611.380000 and k of 1.887031. Then, in the panel's CUSUM view, remove days 1 to 8 from the monitored series so the chart starts on day 9, and read the first upper signal of that shorter run. Write one sentence on what the fresh start changed.
