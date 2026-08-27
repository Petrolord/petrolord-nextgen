# Benchmark versus method

Every module before this one asked whether an answer was right. This one asks a different question, and it is the question that actually gets asked of you in a working career: what do you have the right to say about the answer, and to whom, and on what evidence?

Two kinds of evidence run through everything you have done. The first is internal. The line is straight, the fit statistic is high, the drive indices close to one, the intercept is negligible, the terms carry sensible units. All of that is the model agreeing with itself. It is necessary and it is worth almost nothing on its own, as the Associate tier proved when it showed that a misread compressibility grouping leaves the plot perfectly straight, the fit statistic at one, every survey still agreeing, and the slope 25.3658536585366 percent too high.

The second kind is external. Somebody outside your organisation published a worked example: their data, their arithmetic, their printed answer, in a book you did not write and cannot edit. You run your tool on their inputs and you compare. If the numbers land together, something has been tested that no amount of internal consistency can test, namely whether the code implements the physics the literature says it implements.

The engine carries a field for the second kind of evidence, and only for the second kind. It is called `validation_tier`, it comes back on every result alongside the oil in place, and this module is about reading it correctly.

## The three words

The tier takes one of three string values, and the engine's own source documents each of them at the point where the result type is declared.

`benchmark_verified` says the implementation has been tested against a published worked example and matches within the stated tolerance, and that the reference case is recorded for traceability.

`published_method` says the implementation follows a recognized peer reviewed or industry standard formulation, and that the workflow includes documented assumptions, internal checks, and calculation traceability.

`engineering_basis` says the implementation follows established reservoir engineering principles where a suitable public worked example is not available, and that the method is documented, traceable, and ready for engineering use within stated assumptions.

Read those three again and notice what separates them. It is not accuracy. It is not sophistication. It is not how much the developers trusted the code. The single thing that moves a path from the third word to the first is the existence of a published worked example with a printed answer to compare against. That is a fact about the literature, not a fact about the software.

## Where the tier comes from

Now the detail that reorganises the whole module. The tier is produced by one exported function, `resolveValidationTier`, and it takes exactly three arguments: the fluid system, the aquifer model, and whether there is a gas cap. That is the entire input.

Your pressures are not an argument. Your cumulative production is not an argument. The fit statistic is not an argument, the drive index sum is not an argument, the sign of the oil in place is not an argument. The function is a lookup table over the code path, and it returns the same tier for a flawless run and a catastrophic one, because it never sees either.

Say it in the form you will need under questioning. **The tier is a property of the method you invoked, decided before your first survey was read.** It travels with the route, not with the journey.

## The whole map, and what is missing from it

There are twelve reachable combinations of the three arguments: two fluid systems, four aquifer models, and for oil a gas cap present or absent. Ask the function for all twelve and the answer is lopsided.

| Fluid system | Aquifer model | Tier | Stated tolerance |
|---|---|---|---|
| oil | none | benchmark_verified | none stated |
| oil | pot, no gas cap | benchmark_verified | 0.13 percent |
| oil | pot, with gas cap | benchmark_verified | 1.5 percent |
| oil | fetkovich | benchmark_verified | 10 percent |
| oil | carter_tracy | benchmark_verified | 3.53 percent |
| gas | none | published_method | none stated |
| gas | pot | benchmark_verified | 0.19 percent |
| gas | fetkovich | benchmark_verified | 0.76 percent |
| gas | carter_tracy | benchmark_verified | 3.53 percent |

Eleven of the twelve come back `benchmark_verified`. Exactly one comes back `published_method`, the volumetric gas tank with no aquifer, which is the plain p over z line. And `engineering_basis` is returned by nothing at all. The word appears in this engine four times, twice in explanatory comments and twice in a type declaration, and never in a return statement. A grep confirms it.

That matters for how you quote a tier. A vocabulary of three levels invites a reader to think the engine grades its paths, sorting the well tested from the merely principled. Inside material balance it does not sort them. It says benchmark verified about almost everything it can do, and the useful information is not in the word but in the reference string and the tolerance that come with it, which is lesson 2.

Why does the gas volumetric line sit lower than everything around it? Not because the p over z line is doubtful; it is the oldest and simplest result in the subject. It sits lower because no worked example is committed against it in this repository, while the gas cases with an aquifer are anchored on Pletcher's SPE 75354 tables. Absence of a benchmark, not presence of a doubt.

## Worked example: what the Dake run entitles you to say

Run the Dake Exercise 9.2 history through Carter-Tracy with the finite aquifer, as module 2 did. The engine returns an oil in place of 307.221409553720 MMSTB, a cumulative influx of 88.0645883139400 MMrb, a fit statistic of 0.999975248425736, and a tier of `benchmark_verified` with a stated tolerance of 3.53 percent.

Here is a sentence you may write: the Carter-Tracy oil path in this engine has been checked against Dake Exercise 9.2 and recorded as agreeing with that exercise within 3.53 percent.

Here is a sentence you may not write: my oil in place is within 3.53 percent of the truth. The tolerance belongs to the benchmark case, not to your case. On Dake's data those happen to be the same case, which is exactly why the example is a benchmark and your field is not.

And here is a sentence that would be a firing offence in a reserves report: the engine validated my result. It did not. It validated a code path, on somebody else's data, on a date recorded in the reference string.

## Exercise

Take three runs you have made in this tier: the Dake history with Carter-Tracy and the finite aquifer, the same history with no aquifer at all, and the Ekene tank with a pot aquifer forced onto it. Without running anything, write down the tier each one returns and the tolerance each one carries, using only the map above and the aquifer model you selected.

Then write, for each, one sentence you would be willing to sign in a report and one sentence that would be an overclaim. If all three of your permitted sentences say much the same thing while the three results differ by hundreds of millions of barrels, you have understood the lesson.
