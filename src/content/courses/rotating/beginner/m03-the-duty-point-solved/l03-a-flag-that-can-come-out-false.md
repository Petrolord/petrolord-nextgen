# A flag that can come out false

The last lesson claimed the converged flag can come back false. A claim like that is worth nothing until somebody produces the input that does it, so here it is, run as a negative control rather than described.

{{panel:fc-pump-explorer}}

## The input

Give the solver a curve that returns a non-finite head over part of its range. Everything else stays the same.

A non-finite head breaks the comparison the search depends on. Bisection works by asking whether the head difference at the midpoint is above zero or below it, and a comparison against a non-finite value is false whichever way it is asked. So the search is told, at every step inside that region, that the sign went the same way, and it marches quietly down to the bottom of the region and stays there.

## What comes back

- the flow it returns: 900.000000 gpm, against the 1234.452969 gpm the same curves really cross at, which is 334.452969 gpm away
- the bracket it finished on: 1.1368683772161603e-13 gpm, after 56 halvings
- the head difference at that flow: 154.7816454151096 ft
- converged: false

Look at the first three lines together. The answer is wrong by 334.452969 gpm, a gap far too large to be a rounding. The bracket is at the resolution of the numbers themselves. The residual is 154.7816454151096 ft, which is not a small disagreement in feet of head by any standard this course has used.

## What each half of the flag saw

A flag made only of the bracket would have called this solve converged, and it would have been telling the truth about the bracket. The search really did collapse to nothing. It collapsed onto the wrong flow.

The residual is the half that noticed. It asked whether the two curves agree at the flow being returned, and the answer was 154.7816454151096 ft of disagreement. That is a check that can fail, sitting beside one that cannot.

## The habit this is teaching

Every flag in this course, and every flag in every engine, is worth one question: what input makes it false? If there is no answer, the flag is decoration. A boolean that is always true costs nothing to compute and tells a reader nothing, while looking exactly like a boolean that was earned.

Notice also that the engine did not throw and did not refuse. It returned a flow, a head and a flag saying do not trust these. That is the right shape for this failure, because the caller may want to see how far off the search went.

## The mistake

Reading the flow and ignoring the flag. The return is complete and every field in it prints normally, including the 900.000000 gpm. The one field that says the number is wrong is the one field a hurried caller skips.

## Exercise

Give the flow the negative control returns, the flow the curves really cross at, and the distance between them. Then say which half of the converged flag caught it, what that half measured, and why the other half could not have.
