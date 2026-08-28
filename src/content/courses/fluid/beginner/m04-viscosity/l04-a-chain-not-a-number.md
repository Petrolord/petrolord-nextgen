# A chain, not a number

Three correlations in series, each taking the previous one's output as an input. What that structure means for the answer.

## The chain

$$\text{API}, T \xrightarrow{\ \text{Beal}\ } \mu_{od} \xrightarrow{\ \text{Beggs-Robinson},\ R_s\ } \mu_{ob} \xrightarrow{\ \text{Vasquez-Beggs},\ p, p_b\ } \mu_o$$

Three published methods, each fitted to a different data set, composed. That composition is normal practice and it has consequences that are easy to miss.

## Errors compound

Each stage carries its own uncertainty and the stages multiply rather than average.

Beal on a dead oil might be twenty percent out. Beggs and Robinson applied to a wrong dead oil inherits that error and adds its own. Vasquez and Beggs on top inherits both.

The engine reports 0.8035947954460412 cp for Ekene at 2600 psia. Sixteen digits, from three correlations in series, none of which has ever seen this fluid. The digits are reproducible arithmetic. They are not knowledge of the viscosity.

## A different chain gives a different answer

Beal is not the only dead oil correlation. Beggs and Robinson published their own, which is what the Suite's black-oil path uses in one place, and it gives a different dead oil viscosity for the same API and temperature. Feed that into the same live oil step and the answer moves.

There is also Beal-Cook-Spillman, which the engine carries and labels `screening` after an audit.

So "the correlated viscosity of this oil" is not well defined until the chain is named. The engine's default chain is Beal then Beggs-Robinson then Vasquez-Beggs, and the number this course quotes is that chain's.

## What to report

Not the number alone. The number, the chain, and the inputs:

> Oil viscosity 0.80 cp at 2600 psia and 180 F, from Beal dead oil, Beggs-Robinson live oil at 400 scf/stb, Vasquez-Beggs undersaturated. No laboratory measurement.

That is one sentence and it is reproducible by somebody else. The bare number is not.

## The engine helps here

Every correlation carries its published training range, and the engine's warning function names the correlation and the bound when conditions leave it. Run Ekene's chain at 320 F rather than 180 and a warning appears naming Vasquez-Beggs and the temperature.

Warnings arriving with the number rather than in a manual is the pattern the whole Suite follows, and it is what lets a chain be audited after the fact.

## The general shape of the lesson

Every part of a black-oil description is a chain like this. Bo depends on Rs, which depends on the bubble point. Bg depends on z, which depends on the pseudo-criticals, which depend on gas gravity.

A fluid description is a small dependency graph of correlations, and a number pulled out of it means nothing without the path that produced it. This is the same question the whole series has been asking, arriving at the level of a single property.

## The misconception to avoid

"The last correlation in the chain is where the uncertainty is." The uncertainty enters at every stage and the first stage usually contributes the most, because Beal's dead oil scatter is the widest of the three. An undersaturated viscosity that looks precise is inheriting a dead oil viscosity that was never precise.

## Exercise

First, write out the three-stage chain for Ekene at 2600 psia with the value at each stage, naming the correlation and the inputs it consumed.

Second, write the one-sentence report line for that viscosity, containing everything somebody else would need to reproduce it.
