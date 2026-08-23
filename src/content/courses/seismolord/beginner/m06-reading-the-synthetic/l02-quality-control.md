# Quality control

A synthetic is a persuasive object. It is a trace that looks like seismic, plotted next to seismic, and the eye will happily match a wrong synthetic to a real section and call it a tie. Every horizon named from that tie inherits the error, and the error travels into the map, the volume and the well proposal. So the synthetic gets QC'd before it is trusted rather than after it has been used.

This lesson is the checklist: five checks, in the order the pipeline runs, so that a failure is caught at the stage that caused it.

## Check one: the input curves

Everything begins with DT and RHOB, and a synthetic can be no better than they are. Two defects matter.

Nulls are the first. A sentinel value such as -999.25 left in a curve is not missing data as far as arithmetic is concerned; it is a very large negative number, and it propagates. It corrupts the velocity at that sample, then the impedance, then the two reflection coefficients that sample takes part in, and then, through the wavelet, a band of the synthetic tens of milliseconds wide. One unhandled null damages far more of the trace than one sample.

Spikes are the second, and they are more dangerous because they look like data. A washout, a cycle skip on the sonic or a bad density pad reading gives a value that is finite and plausible in isolation but wrong. It generates a reflection coefficient at an interface that does not exist, and the wavelet turns that into a convincing event.

This is exactly the discipline the Well Data course drilled: declare the null, exclude it from statistics, and inspect the curve before computing on it. There the habit protected a porosity. Here it protects a tie.

## Check two: the units

The sonic curve of the teaching well is in microseconds per metre. The other common convention is microseconds per foot, and the two differ numerically by the ratio of the units, about 3.28.

Suppose a file carries DT in microseconds per foot and the software assumes metric. A foot is shorter than a metre, so the transit time per foot is roughly 3.28 times smaller than the transit time per metre through the same rock. Invert that smaller number as though it were metric and the velocity comes out about 3.28 times too high. A section that should read around 3000 m/s lands near 10000 m/s, and impedance is inflated by the same factor.

What makes this worth its own check is that nothing crashes. Every curve plots, the synthetic looks like a synthetic, and the only symptom is that the numbers are wrong throughout. Read the unit from the LAS header, and sanity-check the velocity against what you know sedimentary rock does.

## Check three: the factor of two

Seismic time is two-way time. The energy travels down to the interface and back up again, so the time-depth function must include both legs.

Forget the return leg and every time on the panel is exactly halved. In the teaching setup the top of the log sits at 1500 m in a 2000 m/s overburden. Two-way, that is 1500 ms. One-way, it is 750 ms. The synthetic is still smooth, still well formed, and sitting 750 ms shallow.

The check takes a second: confirm the reported TWT at the top of the log against the depth and the overburden velocity with the factor of two in place. On this well, 1500 m must give 1500 ms.

## Check four: validity masking

The synthetic is computed on a grid running from 0 to 1798 ms at a 2 ms step, 900 samples in total, while the log occupies only 1500 to 1650 ms of it. More than nine tenths of the trace lies outside anything the well can support.

Treat those samples as zeros and they are still numbers, so they get swept into any statistic computed over the full trace. The engine instead marks them as gaps, and the panel statistics are computed only over the live window. When you QC a synthetic in any package, ask what the software did outside the log: zero-filled traces give averages diluted toward zero, and edge artefacts where the wavelet runs off real data into fabricated silence.

## Check five: polarity and plausibility

Polarity is a convention rather than a fact, and the failure mode is assuming instead of stating. Say which sign you are using and which way an increase in impedance is displayed, and record it beside the tie. Two interpreters using opposite conventions will tie the same well half a loop apart, and neither can see why from the display alone.

Plausibility closes the list. Reflection coefficients inside a normal sedimentary section are a few hundredths, and on the teaching well the strongest is 0.017688, squarely in that range. Coefficients approaching 1 do not mean a spectacular interface. A coefficient of 1 is a perfect mirror, which in a well log is always an input error, so when one looks extraordinary, check the curve that produced it.

## Exercise

Say whether the mean sonic velocity would read higher or lower than 3145.29 m/s if the DT curve were in microseconds per foot and the software assumed metric, and by roughly what factor. As a self-check: roughly 3.28 times higher, near 10000 m/s, because the per-foot transit time is the smaller number and inverting it gives too fast a velocity. Then state what the reported TWT at the top of the log would be with the two-way factor dropped, and why a reflection coefficient of 0.9 in a shale-sand section is a data problem rather than a discovery.
