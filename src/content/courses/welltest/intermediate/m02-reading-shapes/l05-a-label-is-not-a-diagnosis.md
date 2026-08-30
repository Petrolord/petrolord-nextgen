# A label is not a diagnosis

The habit this module exists to build.

## The situation you will be in

A pressure history arrives. You put it through the software. It gives you a log-log plot with coloured bands on it, a list of regimes, and an offer to fit a model.

Everything about that presentation says the diagnosis has been done. It has not. What has been done is a slope classification with a minimum-span filter, and the previous two lessons showed it naming a regime that is not there on six fixtures out of seven.

## The three-part test

Before accepting any regime label, ask three questions in this order.

**Is the slope in the band?** The software answered this. It is the weakest of the three tests, because several unrelated behaviours share a slope.

**Is the regime possible here?** This is about ordering. Near-well geometry produces its regimes early. Boundaries produce theirs late. Storage is always first. A regime out of its proper position is a transition wearing its clothes.

**Does the level make sense?** A radial plateau implies a permeability. A storage unit slope implies a storage coefficient. A linear-flow half slope implies a fracture half-length or a channel width. Compute what the level implies and ask whether that number is credible for this well. A plateau implying 900 mD in a field mapped at 40 is telling you something, and it is not that the reservoir is 900 mD.

## Where the answer actually comes from

Notice that questions two and three need information the test does not contain: the completion, the geology, the field's mapped properties, previous tests on nearby wells.

This is the real reason interpretation is not automatable in the way it looks like it should be. The pressure history constrains the answer; it does not determine it. What determines it is the pressure history plus everything you know about the well.

An interpretation delivered without that context is a shape-matching exercise, and it will be wrong in the specific way that shape matching is wrong: confidently, plausibly, and in whichever direction the ambiguity happened to fall.

## What to write down

A defensible diagnosis states, for each regime it claims:

- the time interval it occupies;
- the evidence, which is the slope and the level;
- what the level implies numerically;
- and why the regime is possible at that point in the sequence.

Four lines per regime. Most reports contain none of them, and a report that contains all four can be checked by somebody else, which is the whole point.

## The uncomfortable case

Sometimes all three questions have good answers and two DIFFERENT diagnoses pass all three.

That is not a failure of the method. It is a real property of pressure transient data, it is called non-uniqueness, and it is the subject of the Expert tier's second module. The right response is to report both and say what additional measurement would separate them, not to pick the one the software listed first.

## What this module has established

The derivative is the diagnostic. The alphabet of slopes identifies regimes. The order of regimes is as informative as the slopes. The engine's classifier reads slopes and one ordering rule, so it names transitions as regimes, and on this course's fixtures it does so on six out of seven. Every one of those false labels is caught by asking whether the regime is possible where it appears.

The rest of the tier applies that to specific wells and specific boundaries.

## The misconception to avoid

"With enough care, the software could get this right." Some of it could: an order-aware classifier would remove the false labels in this course. But the deeper limit is not implementation. Two different reservoirs can produce derivative plots that differ by less than gauge noise, and no amount of care in the classifier resolves that. Software can narrow the candidates. It cannot choose between them without information that is not in the pressure history.

## Exercise

Take one of the false labels from the previous lesson and write the four-line diagnosis entry that would have caught it: interval, evidence, implied number, and the ordering argument.

Then write the same four lines for the regime that is actually there in that interval.
