# Boiling point and criticals

The first three links, and what each one is fitted to.

## Soreide for the boiling point

Takes molecular weight and specific gravity and returns a normal boiling point. For Good Oil's C7+ at MW 218 and SG 0.8515 it gives 998.2811638461088 degrees Rankine, which is about 539 F.

That is a plausible mid-boiling point for a C7+ cut of this molecular weight, and it is worth checking against intuition: a fraction averaging fifteen or sixteen carbons should boil somewhere in the 500 to 600 F range at atmospheric pressure.

The correlation was fitted to petroleum fractions with measured boiling points, so it is being applied to the kind of material it was built for, which is more than can be said for the steps that follow.

## Kesler-Lee for the criticals

Takes the boiling point and specific gravity and returns critical temperature and critical pressure.

$$T_c = 1324.2385574932478 \text{ degR}, \qquad p_c = 262.591601775175 \text{ psia}$$

The relationship between a boiling point and a critical temperature is strong and well behaved for pure hydrocarbons, so the critical temperature is the more reliable of the two.

Critical pressure is worse. It falls steeply with molecular weight and the correlations disagree with each other more at the heavy end than anywhere else. 262 psia for this pseudo-component is a low critical pressure, which is correct for heavy material and is also where the correlations are least tested.

## Lee-Kesler for the acentric factor

The acentric factor measures how far a molecule departs from spherical, and it enters the equation of state through the temperature dependence of the attraction term. It matters a great deal.

Lee-Kesler gives 0.6690835265426222 for this pseudo-component. For comparison methane is near 0.011 and normal decane is near 0.49, so 0.67 says a heavy, non-spherical molecule, which is what a C15-ish average should be.

There is an alternative, Edmister, which the engine also carries. Two published methods for the same quantity, and the engine's default is Lee-Kesler. That is another instance of the pattern this course keeps finding: name which one.

## Why the order matters

Boiling point, then criticals, then acentric factor. Each step consumes the previous step's output.

So the uncertainty compounds in a specific direction: the acentric factor inherits everything wrong with the criticals, which inherit everything wrong with the boiling point, which was predicted rather than measured.

A measured boiling point short-circuits the first link and improves everything after it, which is why it is worth asking a laboratory for one.

## The n-alkane check

The engine's gate suite checks these correlations by feeding them the molecular weight and specific gravity of KNOWN normal alkanes and confirming that the recovered boiling points and criticals land near the published values for those substances.

That is a real test with a real answer: nC10 has a measured boiling point and measured criticals, and a characterization chain that cannot recover them from its molecular weight and gravity is not going to do better on a mixture.

It is also the honest limit of what can be tested. The chain can be shown to work on pure substances; it cannot be shown to work on a lump, because the lump has no true answer.

## The misconception to avoid

"These are physical properties of the heavy fraction." They are the properties a pseudo-component must have for the equation of state to reproduce the fraction's behaviour, which is a different thing. Nothing in the fluid has a critical temperature of 1324 degrees Rankine. The number is a fitted parameter wearing the name of a physical quantity, and treating it as measured is how people end up defending it against data.

## Exercise

First, write the three-step chain from MW and SG to the acentric factor, naming the correlation and the inputs at each step.

Second, explain in two sentences why a measured boiling point is worth asking a laboratory for, in terms of what it does to the rest of the chain.
