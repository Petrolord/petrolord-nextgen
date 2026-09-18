# What a meter run is being asked to do

A meter run is asked for a number that a buyer and a seller will both sign. The
equation that produces it is short enough to fit on one line, and that is the
trap. What matters is how well the number is known and which pieces of it the
software in front of you is refusing to answer for.

## Three engines, and no wires between them

This course stands on three modules. No module imports another, which is why a
fact learned about one carries nothing over to the next by construction. The
meter run is yours. The control valve and the storage tank belong to the tiers
above, and nothing you learn here is quietly reused there.

The metering module is small enough to list. Its exported names are counted by
taking `Object.keys` of the imported module, with the rule that every name the
module exports counts, functions and data alike, with no filter.

   metering.js exported names: 11

Nine of those are functions: `dischargeCoefficient`, `expansibility`,
`orificeFlow`, `orificeUncertainty`, `permanentLoss`, `sizeOrifice`,
`straightRunDiameters`, `transmitterUncertaintyPct` and `turbineVolume`. Two are
data: `RG_REYNOLDS_BASIS` and `STRAIGHT_RUN_WITHHELD_FITTINGS`. The second data
name tells you something before you have run anything, and you will meet it in
module four.

## What the run actually delivers

Put a plate in a pipe, measure the pressure drop across it, and the flow follows
from the geometry, the fluid and one coefficient. The module returns the flow
and it also returns the beta, the discharge coefficient, the expansibility, the
Reynolds number, a volume it labels at the flowing density, a flag saying
whether the beta sits inside the published range, and a warning line that is
sometimes null. Every one of those is part of the answer.

## The subject is the uncertainty

The orifice equation is simple and its uncertainty is the subject. A single
figure for flow with nothing beside it cannot be argued with or improved. A
figure with a budget behind it tells you which input to spend money on, and
module six is nothing but that budget. Between here and there you will meet a
coefficient that is computed rather than assumed, a factor for compressibility,
a transmitter whose accuracy is quoted on something other than the reading, and
a table the engine refuses to complete.

Read a refusal as curriculum. Where this package does not carry a published
relation it says so in its own words and returns no number, and those sentences
are quoted here exactly as the screen shows them.

## Exercise

Look at the two data names the metering module exports and say in one sentence
each what you expect them to be for. Check the second against module four.
