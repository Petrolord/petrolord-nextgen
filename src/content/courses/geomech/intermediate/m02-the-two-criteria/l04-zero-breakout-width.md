# Zero breakout width

The conservatism in the collapse criterion, stated.

{{panel:gm-stability-explorer}}

## What the engine requires

That the Mohr-Coulomb criterion is satisfied at EVERY angle round the hole.

The moment one angle fails, the pressure is below the collapse pressure.

## What that corresponds to

A breakout of zero width. The very first sliver of rock to fail.

## What a real hole tolerates

A great deal more. Breakouts of 30 to 60 degrees of total width are common on wells that were drilled without incident and cased successfully.

The rock that fails spalls off, the hole becomes slightly oval, and drilling continues. The hole is only in trouble when the breakout is wide enough that the failed material cannot be cleaned out faster than it arrives, or when it undercuts enough to destabilise the whole section.

## The size of the conservatism

Large. Allowing a 60 degree breakout can lower the required mud weight by a substantial fraction of the collapse gradient, because the criterion only has to hold outside the failed arc and the arc is centred on the worst angle.

So a zero-width collapse pressure is not the mud weight below which the well fails. It is the mud weight below which the well begins to show a breakout.

## Why the engine chooses it anyway

Three reasons, and they are good ones.

**It needs no extra parameter.** A breakout-width criterion needs a tolerated width, and that number comes from experience rather than from mechanics.

**It is unambiguous.** Zero width is a definition; 40 degrees is a judgement.

**It errs safe.** A criterion that is too conservative gives a mud weight that works. One that is too permissive gives a hole full of cavings.

## What it means for reading the output

A collapse gradient from this engine is a "no breakout at all" gradient. Compare it against the actual mud weight used and the difference tells you how much breakout you were probably tolerating, not whether the well was safe.

On a well where the mud weight was consistently below the computed collapse gradient and nothing went wrong, the model is not necessarily wrong: it may simply be answering a stricter question than the well asked.

## The alternative

A breakout-width criterion integrates the failed arc and requires it to stay below a stated width. It is more realistic, it needs one more calibrated input, and it is what a study does once there is caliper data to calibrate against.

## Exercise

Explain why allowing a wider breakout lowers the required mud weight, in terms of which angles the criterion has to hold at.

Then say what field measurement you would use to calibrate a tolerated breakout width, and on what well.
