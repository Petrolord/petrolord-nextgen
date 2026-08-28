# The black-oil separator shortcut

A labelled approximation in the black-oil path, and the rigorous counterpart beside it.

## What the black-oil separator does

Given a solution gas ratio at the bubble point and a set of separator stages, it partitions the gas between the stages by a staged-liberation approximation.

It is not a flash. There is no composition to flash, because a black-oil description has two pseudo-components rather than eleven. So the partition is a rule about how much gas comes off at each stage rather than a calculation of what each stage releases.

## Why the rule is defensible

Because it telescopes correctly. The stage volumes sum to the bubble point solution gas ratio by construction, so the total is right whatever the split.

For a study whose question is the total gas-oil ratio, or whose separator train is a single stage, the approximation costs nothing.

## Where it stops being enough

When the SPLIT matters.

Stage-by-stage gas volumes decide compressor sizing. Stage gas gravities decide what each stream is worth and how it must be handled. Optimising a separator train means comparing splits at several pressures, which is exactly the quantity the approximation does not compute from physics.

For any of those the compositional separator train is the tool, and the engine has one: sequential per-stage flashes to a stock tank, with a material balance identity checked at each stage.

## The two sitting side by side

This is a good example of a pattern worth noticing in the Suite. The black-oil path has the fast approximate method, labelled `screening`. The compositional path has the rigorous one, labelled `oracle_gated`. Both are available, both are labelled, and the user chooses.

The alternative designs are worse. Offering only the approximation hides the limitation. Offering only the rigorous one demands a composition that most black-oil users do not have. Offering both silently lets a user compare two numbers without knowing why they differ.

## What the rigorous one costs

A composition. That is the whole cost, and it is not small: a black-oil study that has never had a compositional analysis cannot use the compositional separator at all.

Which is why the approximation exists rather than being a legacy artifact. It answers a question for a user who does not have the data for the better method.

## The check available when you have both

Run the compositional separator train and compare its total gas-oil ratio against the black-oil partition's total. They should agree closely, because both telescope to the same total.

If they do not, the black-oil description and the composition are describing different fluids, which is worth knowing before either is used.

That is a free consistency check on two independent descriptions of the same fluid, and it is the same shape as every other cross-check in this series.

## The misconception to avoid

"An approximation labelled screening should not be in the product." It should be in the product, labelled, because it answers a real question for users who cannot use the rigorous method. What should not be in the product is an approximation that is not labelled, or a labelled one whose label the interface hides.

## Exercise

First, explain in two sentences why the black-oil separator's total gas-oil ratio is reliable while its stage split is not.

Second, describe the consistency check available when both a black-oil description and a composition exist for the same fluid, and say what a failure of it would mean.
