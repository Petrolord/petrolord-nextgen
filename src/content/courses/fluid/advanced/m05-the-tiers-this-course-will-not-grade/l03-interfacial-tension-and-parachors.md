# Interfacial tension and parachors

A quantity that matters for capillary pressure and relative permeability, computed from a parameter with no independent check.

## What it is

Interfacial tension between the oil and the gas phase, in dynes per centimetre. It appears wherever capillarity does: capillary pressure, residual saturations, and near-miscible displacement where the tension going to zero is the whole point.

## The Weinaug-Katz method

$$\sigma^{1/4} = \sum_i P_i\left(\frac{x_i \rho_L}{M_L} - \frac{y_i \rho_V}{M_V}\right)$$

with P the parachor of each component. The tension is the fourth power of the sum, so once again a small error in the bracket becomes a large error in the answer.

The structure says something physical: interfacial tension comes from the DIFFERENCE in molar density between the phases, weighted by how each component contributes to surface behaviour. As the phases become identical near the critical point the bracket goes to zero and so does the tension, which is correct.

## What a parachor is

An empirical parameter, roughly proportional to molecular volume, tabulated for pure substances from measured surface tensions.

For library components the engine carries published values. For the C7+ pseudo-component there is no measurement, so it uses Firoozabadi's correlation against molecular weight.

Good Oil's C7+ gets a parachor of 588.1872 from a molecular weight of 218.

## Why it is screening

The parachor of the pseudo-component is a correlated value for a substance that does not exist, it enters a difference of two similar quantities, and the result is raised to the fourth power.

Each of those amplifies uncertainty. Together they make the interfacial tension the least constrained output of the model.

The engine's harness gates the implementation by transcription against the published method and takes the library parachors from published tables. The answer for a mixture containing a pseudo-component is not gated against anything, because there is nothing to gate it against.

## A correction worth knowing about

The engine's documentation records that its Firoozabadi parachor correlation leads with a coefficient of minus 11.4 rather than plus 11.4, and that this was verified at build time against the source rather than taken from memory.

A sign error in a leading coefficient would produce parachors that are wrong by a large amount and still look like plausible numbers. It is the kind of error that survives review and fails only against a source.

Checking correlation constants against the actual publication, at the time of writing the code, is worth the hour it takes.

## Where the number is nevertheless useful

**Trend.** Interfacial tension falling as pressure rises toward miscibility is a real and useful signal even when the absolute value is uncertain.

**Comparison.** Two gas compositions ranked by the tension they would achieve against the same oil, where the pseudo-component error is common to both.

**Screening for miscibility.** An estimated minimum miscibility pressure from a tension trend is a screening number and it is the right kind of tool for deciding whether to run a slim tube test.

## The misconception to avoid

"Interfacial tension is a physical property, so a computed value is a measurement of it." It is a physical property computed from a parameter that was correlated for a component that is a construct, through a relation that raises a small difference to the fourth power. The physical status of the QUANTITY says nothing about the epistemic status of the NUMBER.

## Exercise

First, name the three features of the Weinaug-Katz calculation that amplify uncertainty for a mixture containing a pseudo-component.

Second, give one use of a computed interfacial tension that survives the uncertainty and say why it does.
