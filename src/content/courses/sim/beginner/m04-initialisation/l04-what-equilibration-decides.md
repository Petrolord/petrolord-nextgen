# What equilibration decides

Nine lines of SOLUTION settle four things, and every one of them propagates through the whole run. This lesson collects them so the section stops looking small.

## One: how much oil the model contains

Every cell above the contact is oil-bearing, and its oil volume is its pore volume times one minus the connate water saturation, divided by the formation volume factor. Sum that over the model and you have the oil in place.

Nothing in the deck states that number. It is a CONSEQUENCE of the grid, the porosity, the contact and the PVT table, and the simulator computes it during initialisation and prints it. That printed number is the first thing to read in any run output, because every recovery factor the study ever quotes is a fraction of it.

The Professional tier reconciles it against the volumetric booking and finds it agrees to within a tenth of a percent, which did not happen by accident.

## Two: the initial pressure everywhere

From one pressure at one datum, integrated through the fluid densities. A cell 60 ft above the datum sits at a lower pressure by the oil gradient over 60 ft.

That gradient comes from the surface densities in PROPS combined with the formation volume factors. So a mistake in DENSITY does not just affect buoyancy, it tilts the whole initial pressure field.

## Three: where the fluids are

Oil above the contact, water below it, decided per cell on the cell centre. No transition zone, because the capillary pressures are zero.

This is the assignment that makes some cells matter and others not. A cell in the water leg has no oil to produce and never will; it exists to carry pressure support and to let the injectors have somewhere to inject.

## Four: that nothing is moving

Equilibrium means no flow. Every phase pressure gradient is exactly balanced by gravity, so at time zero the model is at rest.

That is worth stating because it is a modelling assumption rather than an observation. A real reservoir at discovery may have regional flow, tilted contacts or an active aquifer sweeping across it, and none of those is an equilibrium state. A deck that equilibrates has assumed them away.

## The failure mode to know

If the initial state is NOT in equilibrium, the model will move at the first timestep with no wells open. Fluids will redistribute, pressures will shift, and the model will drift toward the equilibrium it should have started in.

That drift looks like a physical response and it is an initialisation artifact. The way to catch it is the standard first check on any new deck: run it with no wells for a short period and confirm that nothing changes. If the pressure moves, the initialisation and the property fields disagree, and the usual culprits are a density inconsistent with the PVT tables or a contact placed outside the grid.

## What SOLUTION does not decide

It says nothing about what happens next. Not a single well, rate or date appears in it. Everything dynamic is in SCHEDULE, which is the next module.

## The misconception to avoid

"Initialisation is a formality because the wells will dominate immediately." The wells act ON the initial state, and they act on it forever, because the material balance of the whole run starts from the volume equilibration decided. An error in the initial oil in place does not wash out with time; it scales every result the study produces.

## Exercise

First, list the four things equilibration decides, and for each name one keyword elsewhere in the deck that it depends on.

Second, describe the no-well check in three steps and state what a pressure drift of 5 psi over the first month would tell you.
