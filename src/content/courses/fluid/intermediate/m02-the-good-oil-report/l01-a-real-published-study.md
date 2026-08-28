# A real published study

Good Oil Co. Well No. 4, Core Laboratories report RFL 88001. One of the most reproduced PVT studies in the literature, and the fluid the rest of this tier works on.

{{panel:fluid-study-explorer}}

## What it is

A reservoir fluid study on a well in the Productive Field, Samson County, Texas, carried out by Core Laboratories and reported as RFL 88001.

It appears in McCain's *The Properties of Petroleum Fluids* as the worked example that runs through the PVT chapters, and in Whitson and Brule's *Phase Behavior* as tables 6.4, 6.7 and 6.9. Ahmed reproduces it too. Three textbooks, one report.

## Why it is reproduced so often

Because it is complete and it is unremarkable.

Complete: it has a compositional analysis to C7+, a constant composition expansion, a differential liberation, and four separator tests at different pressures. Everything a teaching example needs.

Unremarkable: it is an ordinary black oil of moderate gravity with an ordinary gas-oil ratio. Nothing about it is a special case, which is exactly what you want when the point is the method rather than the fluid.

## What the report contains

| quantity | value |
|---|---|
| reservoir temperature | 220 F |
| bubble point | 2634.65 psia |
| total gas-oil ratio | 768 scf/stb |
| stock tank gravity | 40.7 API |
| formation volume factor | 1.474 rb/stb |
| components reported | 11, including C7+ |
| C7+ molecular weight | 218 |
| C7+ specific gravity | 0.8515 |

Every one of those is tier `measured`. A laboratory put a sample in a cell and did the work.

## The pressure base

The report quotes pressures in PSIG against a base pressure of 14.65 psia, which is stated in the report itself and cross-attested in Whitson.

So the bubble point printed as 2620 psig is 2634.65 psia, and the separator test printed as 100 psig is 114.65 psia.

That base of 14.65 rather than 14.696 is a detail of the era and the laboratory, and it is exactly the sort of thing that gets lost when a table is copied into a second document. A study reproduced with the wrong base is out by about 15 psi everywhere, which is small enough to look like scatter.

## How the engine uses it

As a gate. The engine's validation harness runs its equation of state against this study's separator tests and checks the answers against the published values within stated tolerances, and those tolerances are in the harness rather than in a comment.

That is what the tier `armed` means: the engine reproduces a published study within a tolerance somebody wrote down. The fixture records where the data came from, including the URLs of the scans it was transcribed from, so a reader can go back to the source.

## Why this tier uses it rather than Ekene

Because Ekene was designed. Running a model against a designed fluid tells you whether the model agrees with a decision.

Good Oil was measured. Running a model against it tells you whether the model agrees with a laboratory, which is the only comparison that can be lost.

## The misconception to avoid

"An old study is a poor benchmark." The fluid has not changed since 1988 and neither has the physics. What matters in a benchmark is that the measurements are documented, the conditions are stated and the source is traceable, and this one has all three. A modern study locked in a data room that nobody can cite is worth less.

## Exercise

First, list the six measured quantities from the report above and say which experiment in the previous module produced each.

Second, the report quotes pressures in psig on a 14.65 psia base. Compute the absolute pressures for a reported bubble point of 2620 psig and a separator at 100 psig, and say what would happen to a comparison if a reader assumed a 14.7 base.
