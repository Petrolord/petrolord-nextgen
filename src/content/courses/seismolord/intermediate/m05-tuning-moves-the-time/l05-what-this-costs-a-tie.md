# What this costs a tie

The module has been about a property of synthetics. This lesson is about what that property does to the work, once the tie leaves your screen and other people start relying on it. The short version is that a tie made on the brightest event is a different tie at a different bandwidth, and the error that follows behaves in the worst way an error can behave.

## The same well, two ties

Take the teaching well and imagine two interpreters who never speak to each other.

The first builds the synthetic at 15 Hz, finds the strongest amplitude at 1580 ms TWT, and hangs the tie on it. The second builds the same synthetic from the same logs at 40 Hz, finds the strongest amplitude at 1646 ms TWT, and hangs the tie on that. Both followed the same instruction, which was to align on the strongest event. Both are internally consistent. Their ties differ by 66 ms.

Now notice what neither of them can see. Nothing on either display is wrong. There is no artefact to spot, no gap, no null, no unit that looks out of place. Each interpreter has a clean synthetic beside a clean section and a bright event lining up with a bright event. The disagreement is invisible from inside either workflow, and it only surfaces when the two ties meet in the same project.

## The error is systematic

This is the part that makes it expensive.

A random error moves the answer around a true value, differently each time. Random errors are unpleasant but they are survivable, because they partly cancel when you combine many measurements. Tie ten wells with random errors and the map built from them is roughly right even though no single tie is exact.

A tuning-driven pick error does not behave that way. Everybody working the same volume works at the same bandwidth, so everybody's brightest event has been relocated by the same mechanism in the same direction. Ten wells tied on brightness in one survey carry ten versions of the same bias. Averaging them does not remove it, because there is nothing to average against. The map is smooth, the wells agree with each other, and the whole surface is displaced.

Consistency is usually the evidence you look for that a set of ties is sound. Under a systematic error, consistency is exactly what you would expect to see, so the check you would normally run returns a pass.

## Where the error goes next

A tie is not a deliverable on its own. It is the thing that lets a seismic event be given a geological name, and everything downstream inherits that naming.

The horizon picked from the tie carries the displacement. The structure map gridded from that horizon carries it. A depth conversion turns the time displacement into a depth displacement and the prognosis to the target moves with it. An isochore built between two horizons carries the difference of two displacements, which can be larger or smaller than either. A volume computed inside a closure defined by those surfaces inherits all of it, and by that point the original decision to follow the brightest event on a 40 Hz synthetic is six steps back and no longer written anywhere.

The well proposal at the end of that chain is where somebody finds out. That is a slow and costly way to discover a bookkeeping habit was missing at the start.

## Reprocessing moves the tie without touching the rock

There is a second version of this that catches teams who did everything else properly.

Seismic volumes are reprocessed. A reprocessed volume usually has a different bandwidth from the one it replaces, which is often the reason for reprocessing it. If your ties were anchored to brightness, they were anchored to a property of the old bandwidth, and the new volume will disagree with them. Nothing in the earth changed between the two volumes. The wells did not move, the logs did not change, and the reflectivity computed from them is the same series it always was.

The team then spends time hunting for the error, because the natural assumption when a tie stops working is that something is wrong with the tie. Nothing is wrong with it. It was a measurement of the old wavelet all along and was never recorded as such.

The same boundary defeats any attempt to compare amplitudes across the two volumes. A bright spot mapped in the old data and the same feature mapped in the new one were measured through different wavelets, so a difference between them is not evidence of a difference in rock, and ranking prospects on amplitudes drawn from more than one survey ranks the processing as much as the geology.

A tie anchored to a defensible reflector survives the reprocessing, because the impedance contrast it was hung on is still there and still at the same two-way time. That is the practical payoff of the rule from the previous lesson, and it is why the rule is worth the small effort of writing the wavelet down.

## What this costs, stated plainly

A tie made on the brightest event buys speed now and pays for it later in three ways. It cannot be reproduced by anyone who does not know what bandwidth you used. It biases every well in a survey in the same direction, so the usual cross-checks do not catch it. And it expires the next time the data is reprocessed, at which point the cost is not the original mistake but the time spent looking for a fault that was never there.

None of that requires anybody to be careless. It follows from a single unstated assumption, which is that the brightest event is a feature of the earth. This module exists to remove that assumption, and the next module turns the removal into a checklist you can run.

## Exercise

Describe in your own words how two interpreters working the same teaching well at 15 Hz and at 40 Hz can both follow the instruction to tie on the strongest event and end up 66 ms apart, then explain why calling this a systematic error rather than a random one changes how seriously you treat it. As a self-check: the strongest amplitude sits at 1580 ms TWT at 15 Hz and at 1646 ms TWT at 40 Hz, so the same instruction points at two different times; the error is systematic because everyone working a given volume shares its bandwidth, so the bias runs the same way in every well and does not average out across a map. Then name one downstream product that inherits the error and one event that would expose it.
