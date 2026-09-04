# A boolean needs an oracle

The most consequential thing a gas lift design emits is a true or a false, and for a long time nothing independent ever checked it.

{{panel:pd-unloading-explorer}}

## What the oracle was doing

The validation oracle for this module had an `unloading()` function. It walked the valves, appended an empty open valve list for every stage, and returned. It never evaluated the closing condition on anything. No `unloading` key was written into the goldens at all, so there was no committed answer to compare against and no comparison to fail.

The function existed. It was called. It ran clean on every case. A reviewer opening that file saw an oracle with an unloading routine in it.

## Why that is worse than nothing

An ungated function is visibly ungated. Somebody reading the goldens sees no unloading key, asks why, and either writes one or accepts the risk knowingly. False coverage removes that conversation. The whole premise of an extraction gate is that an independent implementation checked the engine, and here the gate was passing on a check that had never been performed. Coverage that is not coverage is not a weaker form of coverage. It is a stronger form of no coverage, because it also suppresses the question.

The engine's own test asserted only a direction: that a decrement far below every spread multipoints and one far above does not. The usual design band is 20 to 50 psi per valve, and both of those extremes sit outside it. A test that only pins the two ends tests the direction of the rule and not the rule, and every real design lives in the middle.

## What closed it

Engines PR #110 derives the verdict from the published closing rule at valve depth, off a forward RK4 column. The engine evaluates the same rule at surface, by inverting a coarser column. Two roads that share no code and no numerical method. On stage 3 valve 1 of midDecrementKnifeEdge the oracle reads 1180.251805285 psia against a dome of 1182.023754759 psia, a margin of -1.771949474 psi. The engine reads 1111.2000 psia against 1112.854991112 psia, a margin of -1.654991112 psi. Different numbers, same verdict.

The goldens gained an unloading key on every design, 28 stage rows and 85 closing margin rows, and a fourth published case spaced on 26.75 psi per valve to sit in the middle of the band. Verdict agreement is exact on all 22 stages of the three IPO designs, and the sign of the margin agrees on every IPO closing margin row.

## What the new oracle found on its first run

Verdict agreement on constantPressurePPO is false, on all five of its later stages. The engine reports multipointing at stages 2 through 6 and the oracle reports every stage clean. That disagreement is the pinned PPO divergence, and it had been sitting in a shipped function the whole time the stub was reporting nothing.

## Exercise

Read the stage 3 verdict on valve 1 in the panel by both routes and write the two margins.

Then state, in one sentence, what a passing validation suite proves about a function whose oracle never evaluates its condition.
