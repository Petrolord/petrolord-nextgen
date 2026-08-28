# Three correlations disagree

The engine carries Standing, Vasquez-Beggs and Glaso. Run them on the same oil and they return different answers, and the spread is the lesson.

{{panel:fluid-correlation-explorer}}

## The three

**Standing (1947).** 105 bubble points from 22 California crude and gas mixtures.

**Vasquez and Beggs (1980).** Over 6000 measurements from a worldwide data set, and it splits its coefficients at 30 API: one set for heavier oils, another for lighter. It also carries a separator pressure correction, because the gas gravity you measure depends on how the oil was separated.

**Glaso (1980).** North Sea oils, and it carries the engine's `screening` label rather than `published_method`, because an audit of this engine's implementations flagged its solution gas branch as suspect. It remains selectable and it comes with a warning.

## What the spread looks like

Run all three on Ekene at 32 API, 0.75, 180 F and 400 scf/stb, and the bubble points land hundreds of psia apart.

None of them is broken. Each is doing exactly what it was built to do, which is reproduce the oils it was fitted to. They disagree because Californian oils, worldwide oils and North Sea oils are not the same population, and 32 API with 0.75 gas is a different point in each of the three fitted spaces.

## What to do about it

**Do not average them.** The average of three fits to three different populations is a fit to nothing. It has no error bar and no provenance, and it hides the disagreement instead of reporting it.

**Pick one, and say which.** The choice should follow the fluid: if your oil resembles the population a correlation was fitted to, prefer it. Vasquez-Beggs on a worldwide data set is the safer default for an unfamiliar fluid; Standing has the longest track record.

**Report the spread as your uncertainty.** If three published correlations disagree by four percent on your fluid, four percent is a fair statement of how well a correlation can know it, and it is far more honest than sixteen digits from whichever one you happened to run.

## The disagreement is the information

This is worth stating plainly because it inverts the usual instinct. A learner who runs three correlations and gets three answers often feels they have failed to find the right one.

They have found something better: a measurement of how much a correlation can be trusted here. A single number tells you nothing about its own reliability. Three numbers from three independent fits tell you a great deal.

The Professional tier does the same thing against a real laboratory report, which is the only way to find out whether the spread contains the truth or misses it entirely.

## Why the engine keeps a screening correlation at all

Because it is in the literature and people ask for it, and removing it would mean a user who needs Glaso quietly gets something else. Keeping it, labelling it and warning on it is the honest option. That pattern, keep the method, state its tier, warn at the point of use, is the same one the whole Suite follows.

## The misconception to avoid

"Newer correlations supersede older ones." They are fitted to different data, not to better data. Vasquez-Beggs has far more measurements than Standing and that makes it broader, not necessarily closer on any particular oil. Age is not the axis; the population it was fitted to is.

## Exercise

First, run all three correlations on Ekene in the panel and record the three bubble points and the spread between them. State that spread as a percentage of the middle value.

Second, one of the three is labelled `screening` by the engine. Name it, say what that label means for how you may use its output, and say why the engine keeps it available rather than deleting it.
