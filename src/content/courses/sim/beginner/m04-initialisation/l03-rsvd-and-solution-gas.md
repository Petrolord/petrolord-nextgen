# RSVD and solution gas

Equilibration puts the fluids where gravity wants them. It also has to say how much gas is dissolved in the oil, and that can vary with depth. RSVD is the keyword that settles it.

## The keyword

RSVD gives solution gas ratio against depth, as a small table. Ekene's is two rows:

    5055.774278215223 ft    0.4 Mscf/stb
    5251.120588883762 ft    0.4 Mscf/stb

Those two depths are the shallowest column top and the deepest layer base, so the table spans the whole model. The value is the same at both ends, which means Rs is constant with depth: every barrel of oil in the model starts with 400 scf of dissolved gas, wherever it sits.

## Why it could be otherwise

In a thick column, deeper oil is at higher pressure and can hold more gas. A real reservoir often shows a compositional gradient, with Rs rising with depth, and in an extreme case the oil is saturated at the base and undersaturated at the crest.

RSVD is where that gradient goes. A field with 500 ft of oil column and a measured gradient would carry a table with genuinely different values at top and bottom.

Ekene has about 62 ft of oil column and the Material Balance course modelled it as a single tank with one Rs. Carrying a constant here is consistent with that, and inventing a gradient would be adding a feature the field's own analysis never had.

## The value has to match the PVT table

0.4 Mscf/stb is not an arbitrary choice. It is the top node of the PVTO table, the solution gas ratio at the bubble point.

That connection is load-bearing. If RSVD said 0.5 and the PVTO table topped out at 0.4, the deck would be initialising oil with more gas than any row of its own PVT table describes, and the simulator would have to extrapolate a table it should not extrapolate.

The check is one line: the RSVD value must appear in the PVTO table, and for an undersaturated reservoir it should be the highest Rs the table carries.

## Undersaturated by construction

Ekene starts at 3200 psia with 400 scf/stb dissolved. The PVTO table says 400 scf/stb saturates at 2000 psia. So every cell starts 1200 psi above its own bubble point, which is what undersaturated means.

That is a property of the initial state, not of the fluid. The same oil in a reservoir at 1800 psia would start saturated, with free gas, and the deck would need a gas-oil contact and a gas cap.

## What this decides

Whether free gas appears during the run, and when.

As the field produces and pressure falls, a cell that drops below 2000 psia will start releasing gas. From that moment the oil in it shrinks, its viscosity rises, and gas begins competing for the pore space. The whole character of the model changes.

Ekene's flood was designed to keep pressure above the bubble point, and the waterflood course's pressure track shows it never went below about 2089 psia. So the deck describes a reservoir that stays undersaturated throughout, and the free-gas machinery is present without being exercised.

## The misconception to avoid

"An undersaturated reservoir does not need a gas table." It does, because a simulator has to be able to handle gas the moment any cell crosses the bubble point, and near-wellbore pressures fall much further than average reservoir pressure. A deck without a gas table for an undersaturated oil is a deck that cannot represent its own producers' drawdown.

## Exercise

First, RSVD gives 0.4 Mscf/stb at both ends of the model. State what that means in scf/stb and confirm which row of the PVTO table it corresponds to.

Second, the initial pressure is 3200 psia and the bubble point is 2000 psia. Compute the undersaturation margin, and state what would have to happen in a cell for free gas to appear.
