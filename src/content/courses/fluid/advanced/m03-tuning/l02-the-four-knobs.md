# The four knobs

Two multipliers and two absolute values, all on the pseudo-component.

{{panel:fluid-tuning-explorer}}

## The set

| knob | what it does | form |
|---|---|---|
| fTc | multiplies the C7+ critical temperature | multiplier near one |
| fPc | multiplies the C7+ critical pressure | multiplier near one |
| kC1 | sets the C1 to C7+ binary interaction parameter | absolute |
| sPlus | sets the C7+ volume shift | absolute |

## Why these four

Because between them they span the two things the model gets wrong, and they do it with as little overlap as possible.

**fTc and fPc move the equilibrium.** The critical properties set a and b for the pseudo-component, which set how strongly it holds on to the light components. Raising the critical temperature makes the heavy fraction more liquid-like and lowers the saturation pressure.

**kC1 also moves the equilibrium**, through the methane to heavy-end attraction. It is the most direct handle on the saturation pressure there is, because the saturation pressure is essentially about how readily methane leaves.

**sPlus moves only the density.** The volume translation cancels in the equilibrium, so this knob cannot affect the saturation pressure or the phase split at all. It moves the stock tank gravity and almost nothing else.

## The near-decoupling

That last property is worth dwelling on. sPlus has an almost private effect on one target.

So the regression is closer to two smaller problems than one four-dimensional one: three knobs work on the phase behaviour, and one works on the density. A regression with that structure is better conditioned than four knobs all fighting over the same residuals.

It is not a complete decoupling, because stock tank gravity depends on WHAT ends up in the liquid as well as on how dense that liquid is, and the first part is equilibrium. But it is close enough to matter for how the fit behaves.

## Multipliers against absolutes

fTc and fPc are multipliers because the characterized values are meaningful starting points. A multiplier of 0.996 says the correlation was nearly right, which is a statement a reader can evaluate.

kC1 and sPlus are absolute because their correlated starting values are much weaker. The binary interaction parameter for a pseudo-component pair is barely constrained at all, and the volume shift is being applied outside its range. For those, the starting value is a guess and the tuned value is the answer.

That is a real design distinction rather than a convention: the form of the knob encodes how much the starting value is worth.

## What they are on Good Oil

The regression converges to:

| knob | value |
|---|---|
| fTc | 0.9963403431519178 |
| fPc | 0.9827953945642255 |
| kC1 | 0.050325447877585576 |
| sPlus | 0.12266364195926757 |

The two multipliers barely move, which says the Kesler-Lee criticals were close. The volume shift moves from 0.1539 to 0.1227, about a fifth of its value, which is the correction the nine API bias needed.

No knob hits a bound.

## Reading the tuned values

They are a report on the characterization, not just a means to an end.

Critical properties within half a percent and two percent of their correlated values say the characterization chain worked. A volume shift that had to move twenty percent says the volume shift correlation did not.

That is exactly what the Professional tier predicted from the mechanisms, and seeing the regression confirm it independently is worth more than either statement alone.

## The misconception to avoid

"The knobs are arbitrary because any parameter could be adjusted." They are the four constructed parameters that have first-order effects on the four measured targets, chosen so that one of them is nearly independent of the rest. Swapping in a different set would change what the fit means, and adding to the set would buy fit at the cost of predictive value.

## Exercise

First, name the four knobs and say for each one whether it affects the phase equilibrium, the density, or both.

Second, two knobs are multipliers and two are absolute. Explain what that difference encodes about the starting values.
