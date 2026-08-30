# Working the capstone

The six graded values in this tier, and the traps in each.

{{panel:cd-spaceout-explorer}}

## The conditions

The capstone completion has its own polished bore, its own landing and its own two design cases, and none of them matches the published job.

Read the four numbers carefully: the bore length, the insertion depth as landed, the elongation case and the contraction case, and the margin, which is not half a metre.

## The six values

Two availables, two remainings, and two sizing results.

The available elongation is the bore length less the insertion depth. The available contraction is the insertion depth. Check them by the identity: they must sum to the bore length exactly.

The two remainings are each available less the magnitude of the corresponding case. One of them is negative, and a negative remaining is a real answer rather than an error. Report it with its sign.

The minimum insertion at which both cases pass is the lower edge of the band. The shortest usable bore is the swing plus twice the margin.

## The traps

Using the insertion depth for elongation and the remainder for contraction. It is the other way round, and the lesson on elongation pushing in is the one to reread.

Dropping the sign on the negative remaining. The grader expects the signed value.

Computing the minimum bore length with one margin instead of two.

And computing the minimum insertion from the elongation case. It comes from the contraction case, because that is the lower bound.

## The checks

The two availables must sum to the bore length. The contraction remaining must equal the available contraction less the contraction magnitude, which you can verify without the engine. And the minimum insertion must be larger than the landing as given, because the landing as given fails one case.

If the last of those is not true, you have the two directions the wrong way round.

## What this capstone is showing you

A completion that passes one case comfortably and fails the other, with a band that exists and does not contain the landing. It is the published job's problem made worse, and the six values quantify exactly how much worse.

## Exercise

Write the three checks before you start.

Compute the six values and apply them, keeping the sign on the negative one.

Then say how far the landing would have to move to reach the band, and whether the bore is long enough for that move to be possible.
