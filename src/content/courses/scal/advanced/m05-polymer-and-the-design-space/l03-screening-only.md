# Screening only

Run any polymer case through `analyzeDisplacement` and the result arrives with a sentence attached. The engine's warnings array contains, verbatim:

> Polymer case: water viscosity multiplied for screening only; no adsorption, permeability reduction, or rheology effects.

That string is not boilerplate. It is the engine telling you the boundary of its own competence, and an Expert's job is to know what each named omission would do to the numbers you just read.

## The inventory of what is not modelled

**Adsorption.** Polymer molecules stick to rock surfaces. Every pore wall the slug passes coats itself at the formation's expense, so the leading edge of a real polymer bank continuously loses concentration, and therefore viscosity, as it advances. The screening model holds the multiplier constant from injector to front. In a real flood the bank you paid for at the wellhead is not the bank that arrives at the front; how much survives depends on rock surface area, salinity, and polymer chemistry, none of which appear in a single multiplier. Adsorption always pushes the real outcome below the screening outcome, and it also delays the bank: rock that is busy adsorbing is not being viscosified.

**Permeability reduction.** Adsorbed polymer narrows pore throats, cutting the rock's permeability to the water phase that follows. Engineers fold this into a residual resistance factor. It is partly a gift, since reduced water mobility behind the slug extends the favorable ratio after the expensive chemical has stopped being injected, and partly a hazard, since the same mechanism can damage injectivity at the wellbore where the concentration history is longest. The screening model has no memory of where polymer has been, so it can represent neither the gift nor the hazard.

**Rheology.** Polymer solutions are not Newtonian. Most field polymers shear-thin: viscosity falls where flow is fast, near wellbores, and recovers where flow is slow, deep in the formation. Some solutions build viscosity under the elongational strain of pore throats at high rate. So the honest statement is not "the water is 2 cp" but "the water is 2 cp at some reference shear rate, less near the injector, more in the far field." A single multiplier freezes this entire velocity dependence at one number.

## What a screening number is for

Given all that, why compute the screening case at all? Because the question it answers cleanly is the question that comes first: is the mobility ratio the binding constraint on this flood, and is the prize from fixing it large enough to justify a study?

For Ekene the screening answer is crisp. The base ratio 1.2 is only mildly unfavorable, and yet the multiplier-4 case still moves breakthrough efficiency by about 0.068, roughly an eighth better than the base flood's 0.5088773453049006. That is a direction and a magnitude, and it is trustworthy AS a direction and a magnitude because every mechanism the model omits, chiefly adsorption, pushes the real gain downward from the screening gain. A screening result is an optimistic bound with a physics argument for which way reality deviates. What it is not is a design: it cannot size a slug, schedule a chase bank, or predict injectivity, and the warning string exists so that nobody mistakes it for one.

## The misconception to avoid

The misconception is treating the warning as legal fine print rather than as content. When the screening case looks marginal, the warning is decisive: a marginal screening gain will be eaten by adsorption in the field, so a marginal answer is a no. When the screening case looks strong, the warning is a task list: it names, in order, the three studies a real project must buy next. Reading a model's own disclaimer as information about the answer, rather than as a liability shield, is one of the habits that separates this tier from the ones below.

## Exercise

First, for each of the three named omissions, write one sentence stating the direction it moves real performance relative to the screening case, and one measurement or lab test you would commission to constrain it.

Second, a screening run at multiplier 4 on a different field shows breakthrough efficiency improving by 0.011. Using the optimistic-bound argument of this lesson, write the two sentence recommendation you would put in front of management, and state the single word that the engine's warning string most entitles you to use in it.
