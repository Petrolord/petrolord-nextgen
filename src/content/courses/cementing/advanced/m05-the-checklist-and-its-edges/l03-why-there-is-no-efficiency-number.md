# Why there is no efficiency number

A design decision, written in the engine's own comment.

## The comment

    // ---- quality checklist (honest, not a fake efficiency %) ----------

That is the whole of the argument, in one line, at the top of the function.

## What a fake efficiency looks like

Software in this space commonly reports a mud removal efficiency, or a displacement efficiency, or a job quality score: a single number between zero and a hundred.

It is produced by weighting several sub-criteria and adding them up. Standoff contributes so much, density hierarchy so much, velocity so much.

## Why it is a fake

**The weights are invented.** Nobody has measured how much a point of standoff is worth against a tenth of a metre per second of annular velocity, because the answer depends on the mud, the spacer, the rock and the geometry.

**It hides which item failed.** A job at 87 percent could be a job with excellent standoff and no spacer, or good everything and marginal standoff. Those need different fixes and the score gives the same answer to both.

**It cannot be falsified.** A cement job either isolates or it does not, and it is found out years later. There is no field measurement that returns 87 percent, so the number can never be checked against anything.

**It sounds like a measurement.** That is the real damage. A percentage carries an implication of precision that a list of five booleans does not, and it travels into reports and decisions with that implication attached.

## What the list claims instead

Five specific things, each of which is either true or false of this job, each with the number that decided it.

    standoff: false. Minimum standoff 60% vs the API 67% target.

A reader who gets that knows exactly what happened and exactly what to change. A reader who gets 80 percent knows nothing.

## The claim is smaller, and it is true

Which is the trade. The list will not tell you whether the job will isolate. Nothing will.

It will tell you that five specific conditions, each of which is known to matter, hold or do not, on stated numbers.

## Where the same discipline appears elsewhere in this suite

The Casing and Tubing course reports a status per section per case rather than a string verdict, for the same reason: collapsing fourteen verdicts to one word loses the only useful information.

The Geomechanics course reports a quality score and says exactly what it is counting, which is the ordering violations, rather than presenting it as a confidence.

## Exercise

Take a hypothetical job scoring 80 percent on a four-item weighted average.

List three genuinely different jobs that could produce that number, and say what each would need done to it.
