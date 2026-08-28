# Reporting a tuned model

A tuned model that is not documented is indistinguishable from a fabricated one. This lesson is the write-up.

## The five lines

**What was tuned.** Four bounded knobs on the C7+ pseudo-component only: the critical temperature and pressure multipliers, the C1 to C7+ binary interaction parameter, and the volume shift. Library components untouched.

**Against what.** Four measurements from Core Laboratories RFL 88001: the saturation pressure at 220 F, and the total gas-oil ratio, stock tank gravity and formation volume factor from the optimum separator test at 100 psig and 75 F.

**The ledger.** Before and after, per target, with the one that got worse marked.

**What was held fixed.** The reported composition, the C7+ molecular weight and specific gravity, and every library component property.

**What it cost.** The formation volume factor moved from 0.31 percent to 1.13 percent, because total gas-oil ratio, stock tank gravity and formation volume factor share the stock-tank volume.

## The sentence

If only one line survives into a summary:

> The compositional model is tuned to the Core Laboratories study by four bounded knobs on the C7+ pseudo-component, matching saturation pressure to within a tenth of a percent and stock tank gravity to within two API, at the cost of the formation volume factor, which was better before tuning.

Every clause is load-bearing. Drop the scope and a reader assumes the whole model was fitted. Drop the targets and they cannot tell what it was fitted to. Drop the cost and they will find it themselves.

## The word to avoid

Validated.

The model was tuned to these four numbers, so it reproduces them by construction. That is a calibration and it cannot fail.

A validation needs something the model was not tuned to. A fifth measurement, a differential liberation the tuning did not use, a second sample from the same reservoir. On this study, holding the formation volume factor OUT of the objective and checking it afterwards would have been a validation, and it is worth considering for exactly that reason.

The simulation course made this distinction about a structural calibration and it is the same distinction here. A study that calls a calibration a validation believes it has an independent check when it has none.

## Where the report goes

With the model, and in the study document. A tuned model whose tuning lives only in somebody's notebook becomes an untraceable set of parameters within a year, and the parameters look like physical properties.

That last point is the real risk. A tuned critical temperature is a fitted parameter wearing the name of a measured quantity, and a reader who finds it without the ledger will treat it as characterisation rather than as a fit.

## What to do about the uncertainty

Not hide it in a point estimate. The knobs are under-determined and the prior pull is the only thing holding three of them near their starting values.

The standard response is a range: tune against perturbed targets, or with different weights, and report the spread in the predictions that matter. That converts a hidden dependence into a stated sensitivity.

## The misconception to avoid

"Documenting the tuning undermines confidence in the model." An undocumented tuning is discovered eventually, and when it is, everything else in the study becomes suspect. A documented one is a decision a reader can agree or disagree with, which is the most a model can offer.

## Exercise

First, write the five-line report for this tuned model, with a number on every line.

Second, this model has been calibrated and not validated. Describe the smallest change to the procedure that would have produced a genuine validation, and say what it would have cost.
