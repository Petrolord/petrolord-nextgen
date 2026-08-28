# What the validator checks

Before a deck is composed, a validator runs over the specification and refuses anything it cannot build. Knowing its rules tells you what class of mistake it will catch and, more usefully, what it will not.

## The rules

**Structural presence.** A title, a start date, positive grid dimensions, one layer entry per layer, at least one well.

**Table sufficiency.** A live-oil PVT table with at least two solution gas nodes, a gas table with at least two rows, water and rock and density blocks, a water-oil relative permeability table with more than two rows and a gas-oil table likewise.

**Initialisation.** An equilibration datum depth and a datum pressure, both finite.

**Geometry consistency.** The tops array must have exactly one value per column, and every value must be a positive depth.

**Well placement.** A well given indices must sit inside the grid and its completion inside the layers. A well given a trajectory must have at least one connection, and every connection must be inside the grid.

**History coherence.** The first history period must start on the deck's start date, period dates must ascend to the end date, and every well the history names must exist in the model.

## What that list has in common

Every rule is about whether the deck can be BUILT and READ. None is about whether it is right.

The validator will accept a grid in the wrong place, a fluid from the wrong field, a contact 100 ft too deep and a history from a different well, provided each is structurally well formed. It is a grammar check with some arithmetic, and it is doing what it should.

## Errors, not warnings

Everything on that list stops the deck. There is no severity gradation here: a specification either validates or it does not.

That is a deliberate design choice for a deck BUILDER, and it differs from a deck READER. The simulator itself distinguishes errors from warnings, because it has to cope with decks it did not write. A builder can refuse.

## Why some checks are more valuable than others

The presence checks catch omissions, which are common and obvious.

The geometry and well checks catch a different class: things that are individually plausible and jointly impossible. A completion at layer 6 in a five-layer grid is not obviously wrong from either half on its own.

The history checks are the most valuable of all, because they are cross-referential. A well name in the schedule that does not exist in the wells list is exactly the kind of error a human review misses and a machine catches instantly.

## What it costs to run

Nothing measurable. Validation is a pass over the specification, and it happens before any deck text is generated.

That is worth saying because it means there is no reason not to run it, and a builder that composes without validating is trading a certain small cost for an uncertain large one.

## The misconception to avoid

"The deck validated, so it is correct." Validation says the deck can be built and read. Correctness is a statement about the field, and no validator has ever seen the field. The rest of this module is about the gap between those two.

## Exercise

First, group the validator's rules into the six categories above and say which category a completion at layer 6 of a five-layer grid falls into.

Second, explain in two sentences why a deck BUILDER can refuse where a simulator has to warn.
