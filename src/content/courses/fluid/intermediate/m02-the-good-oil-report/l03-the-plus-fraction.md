# The plus fraction

Two numbers standing in for hundreds of compounds, and the modelling decision that follows.

{{panel:fluid-study-explorer}}

## What C7+ is

Everything in the fluid with seven or more carbon atoms, lumped into one reported entry.

In a real crude that is hundreds of distinct compounds: normal and branched paraffins, naphthenes, aromatics, and progressively heavier and less identifiable material out into the residue.

The laboratory does not report them individually because it cannot. Beyond about C10 a crude becomes a continuum rather than a list, and separating it further costs more than it returns for most purposes.

## What is reported instead

Two numbers.

**Molecular weight**, 218 for this fluid, measured by freezing point depression or by another colligative method on the separated heavy fraction.

**Specific gravity**, 0.8515, measured directly on the same fraction.

Sometimes a boiling point is reported as well. When it is, it should be used, because a measured boiling point is better than a correlated one.

## What has to happen next

An equation of state needs a critical temperature, a critical pressure, an acentric factor and a volume shift for every component. C7+ has none of those, because it is not a substance.

So the two reported numbers have to be turned into a full set of pseudo-component properties by correlation. That process is called characterization and the next module is entirely about it.

The important thing to see here is that it is unavoidable. There is no way to run a compositional model on a real fluid without inventing properties for the heavy fraction, and every choice in that invention propagates.

## One pseudo-component or several

The engine uses ONE. That is a stated design decision and it has consequences.

Splitting C7+ into several pseudo-components, by fitting a distribution to the molecular weights and cutting it into three or six, generally improves the model's behaviour near the critical region and for condensates. It also requires choices about the distribution and the cut points that nobody can check against a measurement.

A single pseudo-component is the simplest defensible choice: it uses exactly what was measured, it introduces no unmeasurable structure, and it is what the engine's tuning knobs then act on.

For a black oil well away from its critical point, which this fluid is, one pseudo-component is adequate, and the Expert tier measures how adequate against the study's own numbers.

## Why the heavy fraction dominates the difficulty

Because it carries most of the mass, it sets the liquid density, and its properties are the least constrained.

Methane's critical temperature is known to a fraction of a degree. C7+'s is an output of a correlation applied to a molecular weight that was itself measured with a few percent of uncertainty.

So the least certain part of the description is the part that matters most for the liquid phase, which is the part a black oil mostly is.

## The number to remember

0.3329 of the moles and something over two thirds of the mass, described by two measurements and four correlations.

That sentence is what the Expert tier's tuning is responding to. The knobs act on the pseudo-component and nowhere else, because that is where the uncertainty is and because the library components are measured substances that should not be adjusted.

## The misconception to avoid

"C7+ is a small correction because it is one entry in an eleven-entry list." It is one entry carrying a third of the moles and most of the mass. Counting entries is not counting fluid, and the single lumped entry is the most consequential line in the analysis.

## Exercise

First, state the two measured properties of the C7+ fraction and say what has to be produced from them before an equation of state can run.

Second, give one argument for splitting C7+ into several pseudo-components and one argument against, and say which the engine chose.
