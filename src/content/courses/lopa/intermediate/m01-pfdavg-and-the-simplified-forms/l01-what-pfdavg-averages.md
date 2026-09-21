# What PFDavg averages

{{panel:lp-sif-builder}}

A safety instrumented function spends almost all of its life doing nothing. It is asked to act only when a demand arrives, and a demand can arrive at any hour of the proof test interval. PFDavg answers one question: averaged over that interval, what is the probability that the function is already failed when the demand comes. The Associate tier asked how much risk reduction a scenario is missing. This tier asks what a proposed function actually achieves, and the answer is a PFDavg.

## The average over the proof test interval

A dangerous undetected failure can arrive at any moment in the interval, and it stays hidden until the next proof test finds it. The unavailability of the channel therefore climbs through the interval and falls back at the test. PFDavg is the time average of that unavailability over the interval. The engine returns it as a probability, with the risk reduction factor beside it, which is one over PFDavg.

## One channel, one number

The EKULAMA teaching channel carries a dangerous undetected failure rate of 1.2e-6 per hour on a proof test interval of 8760 hours, which is one year at the engine constant HOURS_PER_YEAR of 8760. Taken as a single channel with no redundancy, the engine returns this.

| quantity | value |
| --- | --- |
| PFDavg, one out of one | 0.005256000000 |
| RRF | 190.258752 |
| SIL band, low demand | 2 |

Twelve decimals are not decoration. Every PFDavg in this course is quoted at twelve decimals because that is the precision the engine prints and the precision this tier is graded at. Risk reduction factors, hours and years are quoted at six.

## The words this course legislates

Five words are fixed before anything is written. A subsystem or a function has a PFDavg, which is an average. An individual protection layer has an IPL PFD, which is the single figure an analyst credits on a LOPA row. The fraction of failures that strike every channel at once is always called the beta factor, and betaD when it applies to detected failures. RRF is always the risk reduction factor. The consequence is described in words and carried into the arithmetic by its tolerable mitigated event likelihood.

## What the engine asks for

The verification half of the engine takes one function, `pfdAvgSubsystem`, and it invents nothing. The architecture, the failure rates per hour, the proof test interval in hours, the mean time to restoration, the mean repair time after a test, the beta factor, betaD, the proof test coverage and the lifetime are all inputs. What comes back is the PFDavg, its RRF, its band, the terms that built it and the equivalent down times behind them. Where an input is missing and the answer would depend on it, the engine refuses and names the field.

## Exercise

Take the 1oo1 PFDavg of 0.005256000000 and compute one over it by hand. Write your figure to six decimals, set it beside the engine's RRF of 190.258752, and state how many decimals agree. Then say in one sentence what a demand arriving in the last week of the 8760 hour interval faces compared with one arriving in the first week.
