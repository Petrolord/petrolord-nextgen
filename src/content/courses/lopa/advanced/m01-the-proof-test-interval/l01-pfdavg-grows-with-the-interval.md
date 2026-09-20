# PFDavg grows with the interval

{{panel:lp-proof-test}}

The proof test interval is the input an operating site changes most often, and the PFDavg moves with it. The engine's `proofTestSensitivity` takes one subsystem and a list of intervals in hours, holds every other input still, and returns the PFDavg the subsystem achieves at each one. The failure rates stay where they were typed, the MTTR and the MRT stay, the beta factor stays. What comes back is the price of a longer interval, written in the same quantity the target is written in.

## The sweep the engine runs

Six intervals, from a quarter of a year to eight years, are 2190, 4380, 8760, 17520, 35040 and 70080 hours. HOURS_PER_YEAR is 8760, so the years column is the hours over 8760. Two subsystems are shown here: the EKULAMA channel as a 1oo1 with undetected failures only, and the IDU valves as a 1oo2.

| T1 hours | T1 years, derived | EKULAMA 1oo1, DU only | IDU valves 1oo2 |
| --- | --- | --- | --- |
| 2190 | 0.250000 | 0.001314000000 | 0.000300179812 |
| 4380 | 0.500000 | 0.002628000000 | 0.000611621000 |
| 8760 | 1.000000 | 0.005256000000 | 0.001287026426 |
| 17520 | 2.000000 | 0.010512000000 | 0.002847929478 |
| 35040 | 4.000000 | 0.021024000000 | 0.006810104389 |
| 70080 | 8.000000 | 0.042048000000 | 0.018095929431 |

Across the whole sweep the EKULAMA 1oo1 rises from 0.001314000000 to 0.042048000000, and the IDU valves rise from 0.000300179812 to 0.018095929431. Every one of those figures is an engine return on stated inputs. The failure rates behind them are illustrative teaching inputs, and this course recommends none of them.

## The band moves with the interval

A SIL band is a label on a decade of PFDavg, so a subsystem can walk out of its band while nothing about the hardware changes. For the IDU valves the engine reports SIL 3 at 2190 hours, SIL 3 at 4380 hours, SIL 2 at 8760 hours, SIL 2 at 17520 hours, SIL 2 at 35040 hours and SIL 1 at 70080 hours. Three of those six rows are the same band, which is why a verification note carries the achieved PFDavg as well as the band.

## What the sweep does not decide

The sweep answers one question and refuses to answer the rest. It does not know the required PFDavg, so it cannot say which row passes. It does not know whether the site can reach the valve, whether a test at that interval is practical, or whether the failure rates still hold after four years in service. It moves T1 and reports. The judgement of which row to accept belongs to the analyst, and the required PFDavg that row has to meet comes from the layer of protection analysis.

## The words this course uses

PFDavg is the average probability of failure on demand of a subsystem or a whole safety instrumented function, averaged over the proof test interval. A credited protection layer carries an IPL PFD, which is a single credited figure. The risk reduction factor, RRF, is one over PFDavg. Common cause is always carried by the beta factor and never by a bare letter.

## Exercise

Take the IDU valves at 0.001287026426 on a one year test and at 0.002847929478 on a two year test. Divide the second by the first and write the ratio to six decimals. Then state which SIL band each of the two rows falls in, and write the one sentence a verification note would need so a reader can see that the band alone did not decide anything.
