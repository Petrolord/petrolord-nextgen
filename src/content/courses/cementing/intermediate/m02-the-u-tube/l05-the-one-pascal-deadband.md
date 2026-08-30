# The one pascal deadband

A threshold of minus one pascal, and the bug it exists to prevent.

{{panel:cm-placement-explorer}}

## The line

    // 1 Pa deadband: float residue must not flag free fall.
    const freeFall = raw < -1;

Not `raw < 0`. Minus one pascal.

## Why

Consider a job whose inside and annulus columns are exactly balanced at some step: the same fluids at the same true vertical depths on both sides, and no friction because the rate is low or the fluids carry no rheology.

The exact answer is zero. The computed answer is the difference of two sums of about ten million pascals each, each accumulated over dozens of segments in double precision.

That difference is not zero. It is a few times ten to the minus ten, with a sign that depends on the order the segments happened to be summed in.

Half the time it is negative, and a strict `raw < 0` would report free fall.

## What that would look like

Not a crash, and not an obviously wrong number. A cement job that is perfectly balanced would report a free-fall warning at a scattering of steps, apparently at random, and the warning would move if anything about the segment ordering changed.

Nobody would be able to reproduce it and nobody would be able to explain it.

## Why one pascal

Because it is large compared with the rounding, which is around a nanopascal here, and small compared with anything physical.

A real free-fall deficit is measured in tens or hundreds of kilopascals. The horizontal well's worst step is minus 104394.27505085245 Pa, which is a hundred thousand times the deadband.

So the threshold cannot mask a real event and cannot admit a spurious one. There is a factor of ten to the fifth of daylight on both sides.

## The engine's own test for it

The test suite runs an EQUAL DENSITY, FRICTION FREE programme through the whole job and asserts that every step's raw U-tube value is within one pascal of zero, and that no step reports free fall.

That is a test of the deadband and of the segment bookkeeping at once: if the volume accounting drifted, the balance would drift with it and the test would fail.

## The general shape

Any Boolean derived from the sign of a difference of two large computed quantities needs a deadband, and the deadband needs a comment saying what it is protecting against.

This one has both, and the comment names the specific thing: float residue. The last millilitre of cement sitting on the float collar at the end of the job is exactly the situation where the two columns nearly balance.

## Exercise

The deadband is one pascal and the worst real deficit on this course's wells is minus 104394.27505085245 Pa.

Express the ratio, and then say what would go wrong if somebody raised the deadband to a hundred kilopascals to make the warnings quieter.
