# The canonical sampler

The well cost engine holds no Monte Carlo code of its own, and that is a project rule rather than an oversight.

## What lives where

The engine file is deterministic throughout. Activity durations, the schedule roll up, the AFE, the cost time curve and the cost per metre form are all closed forms, and each one returns the same answer every time it is called.

The sampling lives in one shared module, `src/lib/monteCarlo.js`. It holds the distribution marginals, triangular, uniform, normal and lognormal, the Gaussian copula sampler, the percentile statistics and the sensitivity measures.

A risked run is the two of them together. The module draws a realisation of the uncertain inputs, and the engine is called once on that realisation. Two thousand realisations at seed 42 gives you the published distribution.

## Why one implementation everywhere

A percentile is only a result if it can be reproduced. Every random draw in the module goes through an injectable generator, so a seeded run repeats exactly. A second sampler somewhere else in the codebase would be a second seed discipline, and nobody would notice it had drifted.

A convention has to be identical in every app. The module fixes the petroleum reading that P90 is the low case, the tenth percentile of the sorted values. Two implementations means two conventions, and eventually a meeting spent working out which chart is which.

Corrections propagate. The module's error function is the Abramowitz and Stegun 7.1.26 approximation with a stated maximum absolute error of 1.5e-7. If that ever needs improving there is one place to change it.

Sensitivity stays comparable. Every app that uses the module reports the same two measures, a Pearson variance decomposition and a Spearman rank correlation using average ranks for ties. A tornado from one app can be read beside a tornado from another.

## What the rule costs

It costs convenience. The engine cannot be handed a distribution and asked for a P50, and it will not grow a sampler for local reasons. Anything probabilistic has to be assembled by the caller.

That price is worth paying. The module was extracted from an existing sanctioned implementation and the original now delegates to it, so the codebase converged rather than forked. A locally clever sampler that nobody else can read is worth less than a shared one that everybody can check.

## Exercise

Describe, in the order they happen, the steps of a single realisation of the golden risk case, from the draw to the cost figure.

Then name two things that would go wrong if the well cost engine carried its own private triangular sampler.
