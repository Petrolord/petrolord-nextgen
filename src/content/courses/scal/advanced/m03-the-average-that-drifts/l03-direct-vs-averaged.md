# Direct versus averaged

You now hold two pipelines that answer the same question. The direct fit takes one plug's raw J points and returns the plant exactly: $a = 0.25$, $b = 1$, $r^2_{\log} = 1$. The averaging pipeline takes all three plugs and returns $a = 0.2491501585202375$, $b = 1.0102893566145976$. On the Ekene fixture the direct fit wins outright. So when does the average earn its keep, and how do you report either number honestly?

## When the direct fit is the right tool

Prefer the direct fit when you have one good plug and a defensible irreducible saturation. Every step between the lab table and the fitted parameters is then exact arithmetic: compute J, hand the raw points to the fitter, supply $S_{wirr}$. Nothing is resampled, nothing is interpolated, and on clean data the answer is the data's own. This is also the configuration where the fit diagnostics mean what you want them to mean: a poor $r^2_{\log}$ on a direct fit is telling you about the rock or the measurement, not about the pipeline.

The direct fit's weakness is exposure. One plug is one piece of rock. If that plug is unrepresentative, beautifully fitted garbage is still garbage, and the fit statistics cannot warn you because they never see the other rock.

## When the average earns its keep

Real plug sets disagree. Measurement scatter, small wettability differences between preparations, digitization error on old curves: each plug's J cloud sits slightly off the others even after a correct collapse. That scatter is noise in the averaging sense, and the geometric mean genuinely suppresses it. With five scattered plugs, the mean curve is a better estimate of the shared rock behavior than any single plug, resample bias and all, because the scatter you remove is larger than the bias you introduce.

The discipline is to know which regime you are in. The Ekene fixture sits at one extreme: zero scatter, so the average contributes only its bias and the direct fit dominates. A drawer of weathered field plugs sits at the other. In between, the honest move is to run both and look at the gap. If the averaged refit and the best single-plug fits disagree by more than the scatter between plugs justifies, the pipeline is contributing, and the previous lesson told you exactly how.

And when you do use the average, treat the refit as a CANDIDATE, not a conclusion. The routine itself hints at this by returning the min to max band alongside the mean. Check the refit against the raw J cloud of every plug, not against the resampled mean it was fitted to. The resampled mean will always flatter it. The raw cloud is the evidence.

## Name the chain

The Material Balance course, one door over, learned this rule the hard way with printed constants: a number derived from a rounded print differs from the same number derived from the raw double, and once both are loose in a report nobody can tell which is which. The rule here is the same rule wearing capillary clothes. The quantity called "the fitted a of the Ekene J curve" has at least two legitimate values in this course, 0.25 by the direct chain and 0.2491501585202375 by the averaging chain, and neither is a mistake. They are answers to different questions.

So never quote a fitted parameter without its provenance. "a = 0.249, averaged refit over three plugs, shared Swirr 0.25, 41-point grid" is a reportable number. "a = 0.249" on its own is a landmine: the next engineer will check it against a direct fit, get 0.25, and burn an afternoon deciding which of you erred, when the true answer is neither. You saw the grading side of this in the previous lesson: the capstone's tolerance of 0.0005 is narrower than the 0.0008498414797624976 gap between the chains, precisely so that naming the wrong chain is detectable.

## The misconception to avoid

The misconception is that the averaged number is automatically the deliverable because it used more data. Data volume is not a pedigree. A number's pedigree is the chain that produced it, stated completely enough that someone else can reproduce it. An average that cannot say what it did to each sample before combining them is less trustworthy than a single measurement that can, and a reviewer who asks for the chain is not being pedantic. They are doing exactly what this module trained you to do.

## Exercise

First, write the one-line provenance statement you would attach to each of the two Ekene values, 0.25 and 0.2491501585202375, such that a colleague could reproduce either without asking you anything.

Second, describe a plug set, in terms of scatter magnitude relative to the resample bias, for which the averaging pipeline gives a better reservoir curve than any direct single-plug fit, and state the observable you would compute to demonstrate that it does.
