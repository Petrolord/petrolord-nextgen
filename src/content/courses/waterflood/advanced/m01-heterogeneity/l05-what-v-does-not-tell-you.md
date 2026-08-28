# What V does not tell you

$V = 0.5$ is a single number summarising a permeability distribution. Single numbers summarising distributions always throw something away, and knowing what $V$ throws away is what stops you over-reading it.

## It does not know the ordering

$V$ is computed from the SET of permeabilities. Shuffle which layer has which permeability and $V$ is unchanged, because the sorted list is the same.

That is fine for the sweep methods in this course, which also depend only on the sorted list. It is not fine for anything involving gravity, crossflow or a completion design, all of which depend on where in the column the fast rock sits. A 600 md streak at the base of the interval and the same streak at the top give identical $V$ and very different floods once gravity or a selective completion enters.

## It does not know the thicknesses

$V$ is computed from permeabilities alone. The engine's own orchestrator computes it from the layer list, but only the $k$ column enters.

So a column with one thin very permeable streak and a column with one thick very permeable interval, otherwise identical, share a $V$. The sweep is completely different: a thin thief zone carries little volume even though it breaks through first, while a thick one carries most of the flood.

The stage tables do use thickness, so the coverage numbers distinguish these cases. $V$ alone does not.

This is why $V$ should never be quoted as the summary of a layered analysis. It is an input to it.

## It assumes log-normality

The reduction $V = 1 - e^{-\sigma}$ holds because the distribution is assumed log-normal. If it is not, the fitted line is a compromise through curved data and $V$ is the slope of that compromise.

Real permeability distributions are often bimodal: a sand-shale system has a population of good rock and a population of poor rock, and their mixture is not log-normal at all. A single $V$ fitted to a bimodal set lands between the two modes and describes neither.

The diagnostic is the plot, not the number. Points on a line means log-normal, and a curve or a kink means you are averaging two populations.

## It does not know the fluids

$V$ is a rock property. The sweep it produces depends on the mobility ratio, which is a fluid property, and the two are independent. The same $V = 0.5$ column at a favourable mobility ratio of 0.5 gives a coverage at first breakthrough of 0.582878889525386, and at an unfavourable 5.0 gives 0.44357724095944917.

So a statement like "$V = 0.5$ means about half the column is swept at breakthrough" is a coincidence of this column at this mobility ratio, not a general relationship. There is no general relationship, and the numerical closeness of $V$ and the coverage here is an accident worth not building an intuition on.

## What it IS good for

Three things.

**Screening.** $V$ above about 0.8 says a conventional waterflood will have severe conformance problems, and that is a useful gate before doing any detailed work.

**Comparison.** Two reservoirs, or two zones, or the same zone from two data sources, compared on one number.

**Generating a layer model.** Given $V$ and $k_{50}$, you can construct a representative layer set to feed the sweep methods, which is exactly the inverse of the construction in lesson 3. That is the most common industrial use: nobody has a real five-layer description, so they build one from a fitted distribution.

## The habit

Quote $V$ with three things attached: the sample it was fitted to, the plotting position, and the number of points. Without those it is not reproducible, and with a small sample it is not very meaningful either.

## The misconception to avoid

"A low $V$ means a good waterflood." It means a narrow permeability distribution, which removes one specific failure mode. A homogeneous reservoir at an unfavourable mobility ratio still fingers viscously, still has poor areal sweep, and can still channel through a fault. $V$ addresses vertical conformance and nothing else.

## Exercise

First, construct two five-layer columns with the same permeability set but different thickness assignments, one with the fastest layer at 40 feet and one with it at 5 feet, in an 84 foot column. Without computing anything, state which has the better coverage at first breakthrough and why.

Second, list the three things you would attach to a quoted $V$, and explain for each what a reader could not check without it.
