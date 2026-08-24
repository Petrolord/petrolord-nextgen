# Adding Ekene-7 to the control

The blind test is over and the pick is now data. This lesson adds it to the control set and starts measuring what changed, which is a different and equally useful experiment.

{{panel:mp-validation-explorer}}

## The new map

Select **six plus Ekene-7** on the panel. Seven control points, the same frame, the same 100 m cell, the same 800 m limit.

Three things are worth reading immediately.

**The live node count is 201.** Unchanged. Adding a well normally cannot reduce coverage, and here it does not increase it either, because Ekene-7 is interior: it adds no new hull area and every node within 800 m of it was already within 800 m of something.

That is a capstone field and it is graded exactly. A learner expecting the count to rise is expecting an exterior well.

**The map now honours 1549 m at (1500, 1500).** The prediction that was 1543.33 m is gone, replaced by the measurement.

**The cross-validatable count is now 2.** Ekene-6 and Ekene-7 are both interior to the hull of the other six, so both can be dropped and still predicted. The count rose because an interior well was added, not because a well was added.

## The seven-well leave-one-out

With two testable wells the exercise can be rerun.

| Removed | Prediction | Actual | Residual |
| --- | --- | --- | --- |
| Ekene-6 | 1555.815673828125 | 1546 | $+9.815673828125$ |
| Ekene-7 | 1543.3271484375 | 1549 | $-5.6728515625$ |
| The other five | blank | | none |

Two results worth noticing.

**Ekene-7's leave-one-out residual is exactly the blind residual.** Removing Ekene-7 from the seven-well set leaves the original six wells, so the prediction is by construction the same 1543.3271484375 m. The two instruments agree because in this one case they are the same calculation, which is a useful consistency check on the whole procedure.

**Ekene-6's residual barely moved**, from $+9.8439$ to $+9.8157$ m, a change of 0.028 m. Ekene-7 is now in the control set for that run, 500 m away, and it shifted the prediction by less than three centimetres. Because Ekene-7's own pick at 1549 m is close to what the surrounding wells already implied, it adds very little new information at Ekene-6.

## What has and has not improved

**Improved:** the map now has a measurement where it previously had a 5.67 m error, and it has one more interior control point for everything nearby.

**Improved:** two testable wells instead of one. Still not a statistic, and twice as much as before.

**Not improved:** the coverage, which is unchanged at 201 nodes.

**Not improved:** the resolution of short-wavelength structure elsewhere. Ekene-6's residual is essentially unchanged, which says the new well did not help the map see the culmination it was missing 500 m away. A well fixes the map where it is, and its influence falls off quickly.

## The general lesson

An interior appraisal well buys three things: a measurement at its own location, a small improvement nearby, and one more testable point. It does not buy coverage and it does not buy resolution across the field.

That is worth knowing before a well is proposed as a way to de-risk a map. The de-risking is local, and its radius is roughly the scale over which the surface actually varies, which on this field the residuals suggest is a few hundred metres.

## Worked example

How would the picture differ if Ekene-7 had been drilled at (3000, 1000), outside the hull to the southeast?

The live node count would rise, because the hull would extend to include the new corner and nodes within 800 m of it would become live. The cross-validatable count would stay at 1, because the new well would be a hull vertex and could not itself be dropped and predicted. And the blind test would have been an extrapolation rather than an interpolation, testing a different and less relevant property of the map.

So an exterior well buys coverage and an interior well buys validatability, and the two are almost complementary.

## Exercise

State the live node count and the cross-validatable count with Ekene-7 included, then explain in two sentences why Ekene-6's leave-one-out residual barely changed when Ekene-7 joined the control set.

As a self-check: the live node count stays at 201, because Ekene-7 is interior and adds neither hull area nor newly reachable nodes, and the cross-validatable count rises to 2, because Ekene-7 is itself interior to the hull of the other six. Ekene-6's residual changed by only 0.028 m because Ekene-7's pick of 1549 m sits close to what the surrounding wells already implied at that location, so it carried almost no new information, and because at 500 m away its influence on the fitted surface at Ekene-6 is small in any case.
