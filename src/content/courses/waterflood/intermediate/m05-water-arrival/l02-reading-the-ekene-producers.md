# Reading the Ekene producers

Run the Chan diagnostic on the Ekene record and it returns three results: the field as a whole and two of the four producers. This lesson reads them, and then does the more important thing, which is to ask what a classification is worth on a dataset like this one.

## The results

| series | late-time log-log slope of WOR' | classification |
|---|---|---|
| Field (all wells) | 2.2114559940777454 | channelling-like |
| Ekene-3 | 1.6028659409443355 | channelling-like |
| Ekene-6 | 2.348281726147951 | channelling-like |

All three are far above the 0.4 channelling threshold. Not marginally above, where the smoothing choice would matter: at 1.6 and 2.35 they are four to six times the threshold.

Ekene-1 and Ekene-5 produce no result at all, for reasons the next lesson takes up.

## What the numbers say on their face

Both wet producers are channelling. Water is reaching them through a preferential path rather than as a swept front, and the field aggregate says the same.

Ekene-6 is the stronger of the two at 2.348281726147951, and Ekene-6 is the nearest producer to both injectors, 715.8910531638176 m from Ekene-2 and 989.9494936611666 m from Ekene-4. It is also the first to see water, in March 2024, fourteen months after the flood started.

Ekene-3 at 1.6028659409443355 is further out, 1400.89257261219 m from Ekene-2 and 1216.5525060596437 m from Ekene-4, and sees water six months later.

## Why the field aggregate is the least useful of the three

The field series lumps every producer's oil and water together and computes one water oil ratio. That aggregate is dominated by whichever well is producing the most water, which here is Ekene-6.

A field-level Chan classification is therefore close to a restatement of the worst well, and it will stay "channelling" for as long as one well channels, regardless of what the others do. It is worth computing because it is free and because a change in it is a signal, but it is not a statement about the field's dominant mechanism.

Always read the per-producer rows.

## The caution this fixture demands

Here is where honesty is required about what these numbers are.

Ekene is a generated teaching field. Its producers' water cuts were planted as smooth saturating ramps, rising from zero at a designed breakthrough date toward a designed maximum. That is a reasonable-looking water history and it was not produced by simulating a channel.

A saturating ramp read over its RISING limb has an accelerating water oil ratio, because the WOR denominator is falling as the oil declines while the numerator climbs. So the derivative rises, and the log-log slope comes out steep, and the classifier says channelling.

The classification is a correct reading of the shape that is in the data. Whether that shape means what Chan's method says it means, on this dataset, is a different question, and the honest answer is that the fixture was not built to encode a mechanism.

## Why that caveat is worth the space

Because it is the general problem with pattern-recognition diagnostics. Chan's method was calibrated on cases where the mechanism was known. Applied to a new dataset it returns a label with no confidence attached, and the label is only as good as the resemblance between your data and his cases.

On real data the resemblance question is answerable: you can check whether the WOR shape is consistent across wells, whether it matches the geology, whether a tracer confirms the path. On a teaching fixture you can only note the limit and move on.

What the Ekene numbers DO teach reliably is the machinery: how the derivative is computed, what the thresholds are, how the smoothing enters, and how far from a boundary a given result sits. Those transfer.

## The one corroborating piece of evidence

There is an independent argument for channelling at Ekene-6, and it does not come from Chan at all. The Expert tier computes the pore volume that Ekene-6's allocated injection could have swept by its breakthrough date, and compares it against the pattern element. The answer is 1.4697005138728763 percent.

Water that arrives after contacting one fiftieth of the element it was supposed to sweep is, by any definition, channelling. That argument is volumetric, uses no curve shapes, and is the strongest evidence in this course that something is wrong with the sweep. It is worth waiting for.

## The misconception to avoid

"Three wells classified as channelling means the field is channelling." Two wells were classified, one aggregate restated the worse of them, and both classifications rest on a shape whose provenance is a designed ramp. Count the independent pieces of evidence, not the rows in the table.

## Exercise

First, for each of the three results, state how far above the 0.4 threshold it sits as a multiple, and say for which of them you would bother re-running with a different smoothing window.

Second, Ekene-6 sees water fourteen months after the flood starts and Ekene-3 twenty months after. Using the distances above, compute an apparent front velocity for each in metres per month, and state whether the two are consistent with a single sweep velocity.
