# The analogy requirement

The pooled fit collapsed to $b = 0.05$ and matched neither well it was built from. Before blaming the fitter, rule the fitter out. The diagnosis is short, and what it leaves standing is the single governing rule of type-curve work.

## The elimination

There are three suspects: the fitting algorithm, the normalization, and the population.

**The fitter.** Give it one well and it recovers that well's planted parameters exactly: Ekene-3 at $b = 0.49999999999999994$ and Ekene-6 at $b = 0.35$, both at R2 1.00000000000000. The same grid search, on the same data, in the same run.

**The normalization.** The same single-well runs are performed on normalized points and return $q_{i,norm} = 1.00000000000000$ with $D_i$ and $b$ untouched. Scaling by a constant and starting each clock at zero changed nothing that the fit reads.

**The population.** That is what is left. Ekene-3 and Ekene-6 differ in $D_i$ by a factor of two, 0.00200000000000000 against 0.00100000000000000, and in $b$ by 0.15. Pooling them asks one Arps curve to be two different Arps curves at the same time. Least squares answers the only way it can, with the curve that minimises squared error against a cloud that is not an Arps curve at all.

So say plainly what the pooled parameters are. They are the parameters of the best single curve through a mixture. They are not an estimate of any well's decline, and they are not "the field's $b$". Treating them as an estimate of a physical quantity is a category error, and no amount of extra data fixes it, because more of the same mixture is still a mixture.

## The screen

The defence is a table you build before pooling anything: one row per candidate well, fitted alone on its own window.

| Well | Model | $D_i$ (1/d) | $b$ | R2 |
|---|---|---|---|---|
| Ekene-1 | Exponential | 0.00120000000000000 | 0 | 1.00000000000000 |
| Ekene-3 | Hyperbolic | 0.00200000000000000 | 0.49999999999999994 | 1.00000000000000 |
| Ekene-5 | Harmonic | 0.00150000000000000 | 1 | 1.00000000000000 |
| Ekene-6 | Hyperbolic | 0.00100000000000000 | 0.35 | 1.00000000000000 |

No two rows cluster. The four Ekene producers span the entire Arps family from $b = 0$ to $b = 1$, with $D_i$ spread over a factor of two, on one field, in one sand, under one operator. There is no analogous pair here at all, and the fixture is built that way deliberately: a shared field name is not evidence of shared decline character, and this table is the fastest way to prove it in any given case.

## What analogy actually requires

Wells belong in the same pool when they share the physics that sets the decline. In practice that means the same drive mechanism at the same depletion stage, comparable completion and stimulation, the same flow regime (transient behaviour and boundary-dominated behaviour decline differently), similar spacing and drainage area, similar reservoir quality and fluid, and a common operating strategy including artificial lift and drawdown policy. Field name, operator, licence block, shared flowline and shared cost centre are administrative facts. They are how the wells are organised, not how they produce.

Evidence beats assertion. Fit every candidate alone, tabulate as above, and pool only the cluster. If nothing clusters, you do not have a type curve. You have a group of wells, and saying so is the correct deliverable.

## When you actually need one

Type curves exist for wells that cannot speak for themselves: new drills, wells with three months of history instead of three years, wells whose record is broken by a facility outage. Ekene-6 has 28 clean monthly points and fits itself at R2 1.00000000000000. Borrowing an exponent for a well like that is choosing a worse answer over a better one that is already in your hand.

So the first question about any proposed type-curve application is not "is the type curve good". It is "could the target have fitted itself". If the answer is yes, the type curve is at best a cross-check.

## Three named misconceptions

**"Same field, same type curve."** The screen above disproves it in four rows.

**"More wells always make a better type curve."** Adding a non-analog raises the point count and lowers the information. The pooled curve here misses Ekene-6 at R2 0.615735522363384 while reporting 0.861590575359367 overall, and every additional non-analog buys more statistical comfort with more modelling error.

**"The pooled R2 passed, so the pool was fine."** The pooled R2 scores the cloud. Per-member statistics score the wells. Only the second kind can fail in a way that a booking would notice.

{{panel:dca-typecurve-explorer}}

Work the checkboxes and watch how ordinary the bad answers look. Ekene-1 with Ekene-6 returns $b = 0.05$ at R2 0.960883802352448. Ekene-1 with Ekene-5 returns $b = 0.1$ at R2 0.985812009637093. Ekene-5 with Ekene-6 returns $b = 0.6$ at R2 0.976377608662669. All four producers together return $b = 0.05$ at R2 0.917095895124882. Every one of those R2 values would clear a casual review, and not one of those pools contains two analogous wells.

## Worked example: reject a proposal

An engineer proposes building "the Ekene type curve" from all four producers, on the grounds that it uses all the available data and returns a respectable R2 0.917095895124882. Run the screen instead of the fit. Four wells, three different model types, $b$ spanning 0 to 1, $D_i$ spanning a factor of two, and every well already fitting itself at R2 1.00000000000000.

The correct response is to reject the pool and say why in one line: the population is not analogous, the pooled $b$ of 0.05 lies below three of the four members and equals none of them, and every candidate already has enough history to be fitted directly. Notice that the proposal was not unreasonable on its face. It was defeated by a table that took four fits to build.

## Exercise

Pooling Ekene-3 with Ekene-5 returns $b = 0.35$ at R2 0.917400687148632. That pooled exponent happens to equal the planted $b$ of Ekene-6, a well which is not in the pool. Write two sentences on what that coincidence does and does not mean, and on what it would take to distinguish a meaningful exponent from a numerical accident.

Then answer two questions. If you were forced to pool exactly two of the four Ekene producers, which pair would you choose and on what evidence? And what single piece of information, absent from the fixture entirely, would do most to justify or destroy any pool you propose?
