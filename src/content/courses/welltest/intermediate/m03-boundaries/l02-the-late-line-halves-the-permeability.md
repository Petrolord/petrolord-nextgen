# The late line halves the permeability

A straight line, in the right place, on clean data, giving the wrong answer.

{{panel:wt-diagnostic-explorer}}

## The setup

The fault fixture has a planted permeability of 85 mD, a skin of plus 3, and a fault 800 ft away. It runs for a thousand hours, which is long enough to show two clearly separated radial stretches.

Fit a semilog line to the early one, from 1 to 20 hours: the permeability comes out at 81.25445414895721 mD and the skin at 2.561418480889217. Both a little low, both for the familiar reason that the storage transition has not entirely finished, and both close enough to the planted values to be a good result.

Now fit a semilog line to the LATE stretch, from 200 to 1000 hours. It is a beautiful line: twelve points, an r squared of 0.9998, no visible curvature.

It reports a permeability a bit over half the early one, and a skin that is NEGATIVE.

## Why

The late line's slope is nearly twice the early line's, because the derivative has nearly doubled. The slope equation says permeability is inversely proportional to slope. So a nearly doubled slope is a nearly halved permeability.

That is the whole mechanism, and it is inescapable: the late semilog line on a faulted well DOES have twice the slope, and the semilog equation applied to it DOES report half the permeability, because that equation assumes there is one well and there are effectively two.

The skin follows the permeability down for exactly the reasons the Associate tier's module 5 laid out: a smaller k makes the logarithmic term in the skin formula less negative, and a larger m shrinks the first term. Both push the skin down, and on this well they push it past zero.

## The same wrong answer twice

Stop and notice what has happened.

In the Associate tier, fitting a line that included wellbore storage gave a permeability far too low and a skin whose sign inverted.

Here, fitting a line past a sealing fault gives a permeability about half of the truth and a skin whose sign inverts.

Two completely different physical causes, one at the start of the test and one at the end, producing the same qualitative error. That is not a coincidence. Both are cases of applying the infinite-acting radial equation to data that are not infinite-acting radial flow, and that equation fails in a characteristic direction: it reports a worse reservoir and a better well.

The direction is worth remembering because it is a bias. Well test analyses that get the regime wrong systematically understate permeability and overstate stimulation.

## Which line is right

The early one, and the reason is physics rather than fit quality.

The early radial stretch is the reservoir behaving as the equation assumes: one well, expanding disturbance, nothing reached. The late stretch is two wells, and the equation has no term for that.

There is a correction. If you are confident it is a single sealing fault, the late slope is twice the true one, so the true permeability is twice what the late line reports. Applying that correction to this fixture would land you close to the planted value. The correction is only valid for a single fault, though, and knowing it is a single fault is the thing you were trying to establish.

## What a report should say

If both radial stretches are present, report the early one and say why. State the ratio between the two slopes as the evidence for a boundary. Do not average them.

If only the late stretch is present, because the test started too late or the storage was too long, report that the test does not determine the permeability without an assumption about the boundary, and state what the answer would be under the single-fault assumption.

That second form feels like a weaker report and it is a much better one.

## The misconception to avoid

"The late data are the most reliable because storage has died." Storage dying is a necessary condition, not a sufficient one. Late data are where boundaries live, and a boundary is just as capable of ruining a semilog analysis as storage is. The usable stretch is bounded at BOTH ends, and this module is the second bound.

## Exercise

Open the panel on the sealing-fault fixture and read the early and late derivative plateaus.

Compute the permeability each of them implies from the plateau equation 70.6 q B mu / (k h). Then say which of the two matches the early semilog line's 81.25445414895721 mD, and what the other one is a permeability of.
