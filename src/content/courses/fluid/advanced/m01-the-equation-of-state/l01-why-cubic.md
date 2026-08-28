# Why cubic

Of all the equations of state available, the industry runs on a two-hundred-year-old idea with two parameters. This lesson is why.

## What an equation of state is

A relation between pressure, volume and temperature for a substance or a mixture. The ideal gas law is one. It is a bad one for anything dense.

What a reservoir engineer needs from it is not mainly the volume. It is the PHASE BEHAVIOUR: given a composition, a pressure and a temperature, how does the mixture split into liquid and vapour and what is in each.

## The van der Waals idea

Two corrections to the ideal gas law.

**Molecules occupy space**, so the volume available is less than the container. Subtract a covolume b.

**Molecules attract each other**, so the pressure on the wall is less than it would otherwise be. Subtract a term in a over volume squared.

$$p = \frac{RT}{v - b} - \frac{a}{v^2}$$

Multiply through and it becomes a cubic in v. That is where the family name comes from and it is the source of everything useful about it.

## Why the cubic form is the point

A cubic in volume has one or three real roots.

**One root** means one phase. The substance is a liquid or a gas and there is nothing to split.

**Three roots** means the equation is describing a two-phase region. The largest root is the vapour volume, the smallest is the liquid volume, and the middle one is physically meaningless.

So the mathematics produces the phase behaviour rather than having it bolted on. One equation describes both phases and tells you when there are two of them. Nothing simpler does that.

## Why not something more accurate

More accurate equations exist. Multi-parameter reference equations reproduce pure-substance properties to a fraction of a percent, far better than any cubic.

They are not used for reservoir fluids for three reasons.

**They need per-substance parameters** that exist for water and methane and not for a C7+ pseudo-component. The thing we most need to model is the thing they cannot describe.

**They do not extend to mixtures easily.** Cubics extend through mixing rules that need one parameter per pair. Reference equations do not have an equivalent that works.

**They are slow.** A compositional simulation does millions of flashes, and a cubic root is closed form.

So the cubic wins on the criteria that matter here, and it loses on the criterion that matters least.

## What it costs

Liquid densities. A two-parameter cubic gets vapour-liquid equilibrium well and liquid volume badly, typically several percent out and systematically so.

That is why the volume translation exists, and why the Professional tier found nine API of error traceable to it. The cost of the choice is visible in exactly one place.

## Which cubic

Two dominate: Soave-Redlich-Kwong and Peng-Robinson. They differ in the form of the attraction term's volume dependence.

Peng-Robinson generally does better on liquid densities, which is why it is more common in reservoir work. The engine implements Peng-Robinson 1978 and nothing else, which is a stated scope decision rather than a claim that the other is wrong.

## The misconception to avoid

"A cubic equation of state is an approximation and a better one would be more accurate." A better one would be more accurate for pure substances whose parameters are known. For a mixture a third of which is a lumped pseudo-component with correlated properties, the equation is not the limiting factor. Improving it would be optimising the part of the chain that is already the most rigorous.

## Exercise

First, explain in three sentences why the cubic FORM, rather than any particular cubic, is what makes this family useful for phase behaviour.

Second, give three reasons why a more accurate multi-parameter equation of state is not used for reservoir fluids.
