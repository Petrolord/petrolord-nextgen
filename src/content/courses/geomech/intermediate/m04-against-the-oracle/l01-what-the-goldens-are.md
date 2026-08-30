# What the goldens are

An independent implementation, and what agreement with it means.

## The file

`geomech_cases.json` carries one stress profile of 52 samples, one parameter set, two wells with their survey stations, a vertical fixture with closed-form answers, and the expected outputs for all of it.

## Where the expected values came from

An independent numpy implementation of the same specification: the same rotations, the same Kirsch formulas, the same Mohr-Coulomb criterion, the same bisections on the same theta grid.

The file's own description says so, and it asks for agreement to a relative tolerance of 1e-6.

## What that is worth

**It catches transcription errors.** Two people implementing the same rotation from the same equations will disagree if either has a sign wrong, and a sign error in a rotation is easy to make and invisible by inspection.

**It catches convention drift.** Whether theta is measured from the high side or from north, whether compression is positive, whether the azimuth rotates clockwise from north. Two implementations agreeing means they share every convention.

**It catches numerical specification differences.** A bisection to a tolerance and a bisection for a fixed count give different last digits. Pinning the count makes the comparison exact rather than approximate.

## What it is not worth

**It does not check the physics.** Both implementations use the same equations. If the equations are the wrong model for the rock, both are wrong together and the comparison is silent.

**It does not check the parameters.** A Poisson ratio from a lithology table propagates identically through both.

**It does not check against the earth.** No borehole was drilled to produce this file.

## The word for that distinction

Verification against validation.

**Verification** asks whether the equations were solved correctly. Two independent implementations agreeing is strong verification.

**Validation** asks whether the equations describe the world. That needs field data: calipers showing where breakouts formed, losses showing where the wall split, and stuck pipe showing where the mud was too light.

This course has strong verification and states that its validation is a separate and larger question.

## What the profile itself is

Synthetic. A constant overburden gradient, a hydrostatic pore pressure with a clean ramp, and a sonic curve that falls linearly with depth.

That is a fixture, and its job is to make every effect attributable to one cause. It is not a well.

## The one exception

The vertical fixture in the same file has answers that come from arithmetic rather than from another implementation. That is the next lesson, and it is the strongest check in the course.

## Exercise

Explain in one sentence each what a golden file would fail to catch if the same person wrote both implementations, and what it would fail to catch if the same equations were wrong.

Then say which of the two you think is more likely in practice.
