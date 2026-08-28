# The provenance ladder

The Suite's Fluid Systems Studio labels every quantity it displays with a tier that says what kind of evidence is behind it. That ladder is this course's spine.

## The six tiers

**measured.** A laboratory measured it on a sample of this fluid. The strongest thing a number can be, and the rarest.

**armed.** The engine reproduces a published study within a stated tolerance, and the study and the tolerance are both named. This is how the engine proves it does what published work says it should.

**oracle_gated.** The engine computed it and an independent implementation, written to reach the same answer by different routes, agrees. That says the arithmetic is right. It says nothing about whether the physics suits the fluid.

**lab_tuned.** An equation of state was adjusted until it reproduced measurements of this fluid, and the number comes from the adjusted model. Only as good as the measurements it was tuned to, and only where it was tuned.

**published_method.** A published method applied correctly, with no independent check of the result. Most correlations live here.

**screening.** An estimate nobody has checked against anything. Useful for ranking options and not for booking anything.

## The order is not obvious

`measured` beats everything. After that the ordering depends on what you are asking.

An `oracle_gated` flash calculation is arithmetically exact and can still be describing the wrong fluid. A `published_method` correlation has no independent check and may be perfectly adequate for a screening study of an oil that resembles the ones it was fitted to.

The tier tells you what KIND of confidence you have, not how much. Reading it correctly means asking what the tier is confidence about.

## What this course grades

Everything except `screening`.

That rule is not a technicality, it is the design of the course. The Expert tier has a whole module on `screening` quantities and grades none of it, exactly as the simulation course taught results literacy and graded none of that. Teaching a number and certifying that a learner can produce it are different acts, and the second one implies the number is worth producing.

The two quantities this affects most are the LBC viscosity in compositional mode, which is untuned and can be out by a factor of two on an oil, and the black-oil separator's gas partition, which is a labelled approximation. Both are taught. Neither is graded.

## Why the engine states it at all

Because a library that returns a number and nothing else forces every caller to rediscover its limits, and most callers do not.

The alternative most software chooses is to return the number and document the limits somewhere else. That works until the documentation and the code drift, which they do. Attaching the tier to the returned value keeps them together.

## The habit this builds

When a number arrives, ask which tier it is on before asking whether it is right. A `screening` number that is right is still a screening number, and quoting it as though it were measured misleads the next reader whatever its value happens to be.

## The misconception to avoid

"The tier is a quality score." It is a statement about the kind of evidence, not the size of the error. A carefully applied correlation inside its range can be closer to the truth than a badly run experiment, and it is still `published_method` while the experiment is still `measured`. The tiers tell you what you would have to do to check.

## Exercise

First, write out the six tiers in your own words, and for each one say what you would have to obtain to move a number up to the next one.

Second, this course grades five of the six tiers. Say which one it refuses to grade and give the reason in one sentence.
