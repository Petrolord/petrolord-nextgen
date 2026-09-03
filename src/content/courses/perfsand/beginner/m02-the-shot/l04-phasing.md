# Phasing

The angle between successive shots, the six angles the tables carry, and why one of them is not an angle at all.

{{panel:ps-shot-explorer}}

## What phasing is

Successive charges in a gun are not all aimed the same way. Phasing is the angle by which each shot is rotated around the gun axis from the one before it.

A ninety degree phased gun puts shots at four compass points in rotation. A sixty degree gun uses six. A hundred and eighty degree gun alternates between two opposite sides.

## Why it exists

Because perforations that are all on one side of the hole drain a quarter of the rock badly and three quarters of it worse. Spreading them around the circumference gives the reservoir a symmetric set of drains, and symmetric drainage converges more easily than one-sided drainage.

There is also a mechanical reason. Shots concentrated on one plane weaken the casing along a line, and spreading them spreads the damage.

## Zero phasing

Zero phasing means every shot is aimed the same way: a single plane of in-line holes.

It is used on small through-tubing guns, where the gun is too small to carry charges pointing in different directions with enough explosive in each, and where the gun may be decentralised against the low side anyway.

And it is not simply the worst angle on a continuum. In the correlation it is a DIFFERENT FORMULA. The effective wellbore radius for a phased gun is a constant times the sum of the wellbore radius and the tunnel length. For zero phasing it is a quarter of the tunnel length, and the wellbore radius drops out of the expression entirely.

## Which angles are available

Six: zero, forty five, sixty, ninety, a hundred and twenty and a hundred and eighty degrees. Those are the angles the published constant tables carry, and the engine refuses anything else rather than interpolating between them.

That is a deliberate refusal. The seven constants per angle are a fitted set, not a smooth function of the angle, and interpolating between two fitted sets is not the same thing as fitting the angle in between.

## Exercise

Explain what phasing is and give two reasons a gun is phased at all.

State how the effective wellbore radius is computed at zero phasing and at every other angle, and say what disappears from the expression at zero.

Then say why the engine refuses a phasing of thirty degrees rather than interpolating, and whether you agree.
