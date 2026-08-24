# What a bulk shift is

A bulk shift is one number. You add it to the two-way time of every sample of the synthetic, and the whole trace moves up or down the section together. Nothing inside the synthetic changes. The spacing between events, their relative amplitudes, their polarities and the shape of the wavelet are all exactly as they were. The only thing that changes is where the trace as a whole sits on the TWT axis.

Written out, if the synthetic predicts an event at TWT $t$ and the shift is $\Delta t$, the shifted synthetic predicts that event at $t + \Delta t$. The same $\Delta t$ applies at the top of the logged interval and at the bottom of it, and at every sample in between.

## One degree of freedom

That is the whole content of a bulk shift, and it is worth saying in the language of degrees of freedom. A bulk shift has exactly one. However badly the synthetic and the seismic disagree, a bulk shift has a single knob with which to fix it. If the disagreement itself has more structure than a single constant, the knob cannot reach it.

This is a strength and not only a limitation. A one-parameter correction is honest. It is easy to record, easy to reverse, easy for the next person to see, and it cannot manufacture agreement that the data does not contain. Corrections with many degrees of freedom can be tuned until any synthetic matches any seismic, at which point the match has stopped being evidence of anything.

## What a bulk shift legitimately corrects

Two situations produce exactly a constant offset, and both are common.

**A datum or reference mismatch.** The synthetic is computed from a time-depth function referenced to some datum, often the kelly bushing or a seismic reference datum. The seismic volume is referenced to a datum of its own. If those two references sit at different elevations, everything in the synthetic is early or late by the same amount, and that amount is a constant in TWT. There is no depth dependence in it because the discrepancy happened once, above the logged interval, and every ray passed through it.

**A checkshot or replacement velocity offset.** The interval above the top of the logged section has to be given a time. In this teaching case that interval is handled by a single overburden velocity, and in practice it is handled by a checkshot survey or by an assumed replacement velocity. If the time assigned to that overburden is out by a fixed amount, everything below it inherits the same fixed error, again with no depth dependence, because the error is a constant added once at the top.

Both cases are precisely a constant added to every sample, so a bulk shift removes them completely rather than approximately. That is the boundary of the tool, and it is a real boundary.

## What a bulk shift cannot correct

Three failures look like misalignment and are not fixed by moving the trace.

**A stretch or a squeeze.** If the velocities used to build the time-depth function are systematically too high or too low, the error in TWT grows as you go deeper, because the error accumulates over the interval travelled. Aligning the top of the section then leaves the base misaligned, and aligning the base leaves the top misaligned. A bulk shift can split the difference and it cannot remove the problem, because the misfit is a function of time rather than a constant. Correcting it means adjusting the time-depth function itself, which changes the internal spacing of the synthetic.

**A phase error.** If the wavelet in the processed data is not zero phase while your synthetic wavelet is, the events do not line up even when their times are right, because their shapes differ. A peak in one may correspond to a trough or to a zero crossing in the other. Moving the synthetic can bring one event into apparent agreement while making others worse, and the correlation stays mediocre wherever you put it. The fix is a phase correction on the wavelet, not a time shift on the trace.

**A wrong or missing reflector.** If the synthetic contains an event the seismic does not, because the density log was washed out or a log gap was filled with something invented, no shift creates agreement. The trace being shifted is wrong before it is moved.

The useful diagnostic is the shape of the residual misfit. If the misfit is roughly the same size and the same sign everywhere in the interval, a bulk shift is the right tool. If it grows with time, you have a stretch. If it changes character from event to event while their spacings agree, suspect phase. Reaching for a shift when the misfit is not constant is how a tie gets forced.

## In this exercise

Here the observed trace is the synthetic moved bodily by 8 ms in TWT, so the misfit is a constant of 8 ms at every sample. That is the textbook case for a bulk shift, and a bulk shift removes it exactly rather than partially. Applying a shift of 8 ms makes the two traces identical over their overlap.

Notice what that means for how much this exercise can teach. It demonstrates that the method finds the right constant when a constant is the right answer. It cannot demonstrate what a stretch looks like under the same scan, because there is no stretch here to look at. Keep the boundary in mind when you read the result, because the scan will still return a single lag and a single correlation on data where a single lag is the wrong model, and it will not warn you.

## Exercise

For each of the following, decide whether a bulk shift fixes it, partly helps, or does nothing, and give a one-sentence reason. First, the seismic datum sits 12 m above the datum used for the time-depth function. Second, the velocity used for the interval above the logs is 5 per cent too low. Third, the sonic reads too fast throughout the logged section. Fourth, the processed data carries a 90 degree phase rotation.

Self-check: the first is fixed completely, because an elevation difference above the logged interval adds the same time to every sample. The second is also fixed completely, for the same reason, because an error confined to the overburden is a constant inherited by everything below it. The third is only partly helped, because a sonic error inside the logged interval accumulates with depth and produces a stretch whose misfit grows with time, so a single constant can balance it but not remove it. The fourth is not fixed at all, because the events differ in shape rather than in position, and no amount of moving the trace changes the shape of the wavelet in it.
