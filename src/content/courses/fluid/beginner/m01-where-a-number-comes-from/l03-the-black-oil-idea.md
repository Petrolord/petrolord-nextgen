# The black-oil idea

Before any correlation, a modelling decision: treat the reservoir fluid as two components rather than the twenty or so it actually contains.

## What the simplification is

A real reservoir fluid is a mixture of methane, ethane, propane, the butanes, the pentanes, hexane, nitrogen, carbon dioxide and a long tail of heavier hydrocarbons. Its behaviour depends on all of them.

The black-oil model replaces that with two pseudo-components: a stock tank oil and a surface gas. Everything the fluid does is then described by how much gas is dissolved in the oil at each pressure, which is Rs, and how much the oil swells, which is Bo.

## Why it works as well as it does

Because for most oil reservoirs the composition does not change much. The fluid in place is one mixture, and as pressure falls the gas that comes out of solution is roughly the same gas each time.

When that holds, two components carry the behaviour and the twenty-component description adds detail nobody needs. Black-oil models are faster, they need far less input, and they were what the industry ran on for decades.

## Where it stops working

**Volatile oils and gas condensates.** Near the critical point the composition of the phases changes rapidly with pressure. The gas coming out of solution at 3000 psia is not the gas coming out at 1500 psia, and a description that assumes it is will get the recovery wrong.

**Gas injection.** Injecting gas changes the composition of the fluid in place, which is exactly what the black-oil model assumes does not happen.

**Anything where the composition itself is the answer.** Predicting what arrives at a plant, sizing a separator train properly, or deciding whether a condensate will drop liquid in the reservoir all need the components.

For those the compositional description, which the Expert tier of this course builds, is the honest tool.

## What Ekene is

An ordinary undersaturated oil at 32 API with 400 scf/stb of solution gas, well away from the critical point, produced by depletion and then waterflood. The black-oil description is exactly right for it, and the four courses before this one used nothing else.

That makes it the fluid to learn the correlations on.

## What Good Oil Well No. 4 is

A published study of a richer oil, reported with its full composition. The Professional and Expert tiers use it, because the questions those tiers ask, what a laboratory actually measured and what an equation of state makes of it, need a fluid whose composition is on record.

## The point about levels of description

Neither description is more correct than the other. They answer different questions and they cost different amounts of input.

Choosing the black-oil description is a decision, and like every decision in this series it should be written down. A model that used two components where it needed twenty is not obviously broken; it produces plausible numbers, and it is wrong in a direction that depends on the process.

## The misconception to avoid

"Compositional is the accurate one, black oil is the approximation." Compositional is the more detailed one, which is not the same thing. An equation of state that has not been tuned to this fluid can be further from the truth than a correlation that has been checked against a report, and the Professional tier measures exactly that on a real study.

## Exercise

First, name three situations where a black-oil description is the wrong tool, and say what goes wrong in each.

Second, Ekene is described in this series entirely in black-oil terms. State the property of the fluid that makes this reasonable, and name one change to the field's development that would make it unreasonable.
