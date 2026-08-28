# Formation volume factor

How much space a stock tank barrel takes up in the reservoir, and why it is always more than one.

## The definition

Bo is the volume that one stock tank barrel of oil occupies at reservoir conditions, in reservoir barrels per stock tank barrel.

A live oil at 1.2 rb/stb means: take one barrel out of the tank, put its dissolved gas back into it, warm it to reservoir temperature and squeeze it to reservoir pressure, and it occupies 1.2 barrels down there.

## Why it exceeds one

Two effects push it up and one pushes it down.

**Dissolved gas swells the oil.** This is the big one. Gas going into solution increases the liquid's volume substantially, and it is why Bo tracks Rs so closely.

**Thermal expansion.** Reservoir temperature is well above 60 F, and warm oil occupies more space.

**Compression.** Reservoir pressure squeezes it back, but liquids are nearly incompressible, so this is a small correction.

Swelling wins comfortably, which is why Bo for a live oil is always above one. A dead oil with no dissolved gas would have Bo just above one from temperature alone.

## The shape of the curve

From atmospheric pressure up to the bubble point, Bo RISES with pressure, because more gas is staying in solution and swelling the oil.

At the bubble point it peaks. This is the maximum: all the gas is dissolved and nothing more can go in.

Above the bubble point Bo FALLS with pressure, because no more gas is available and the only remaining effect is compression.

That peak at the bubble point is the most distinctive feature of a black-oil PVT table and it is the fastest way to spot a table that has been assembled wrongly. A Bo curve that rises monotonically all the way to the top of the pressure range has lost its bubble point.

## Where it enters everything

Oil in place divides by Bo: reservoir barrels of oil over rb/stb gives stock tank barrels. So a Bo error is a proportional error in every volume a study books.

Voidage multiplies by it: stock tank barrels produced times Bo gives the reservoir volume that left. The waterflood course's whole ledger is built on that.

Material balance uses both, and the simulation deck carries it as a table.

## Ekene

Designed at 1.2 rb/stb. Standing at the designed 400 scf/stb returns

$$1.2407824121407645 \text{ rb/stb}$$

which is about 3.4 percent above the designed value. Feed it the correlated 421.94 scf/stb instead and it returns 1.2516120850485737, further away again, because more gas means more swelling.

Two correlated numbers, both defensible, both different from the design, and the difference between the two correlated ones is entirely down to which Rs you fed in.

## What three percent does

A three percent error in Bo is a three percent error in oil in place, straight through. On Ekene's booked 12.139 million stock tank barrels that is around 400 thousand barrels, which is not a rounding difference.

It is also forty times the residual the simulation course worked to achieve when it calibrated its structure against the volumetric booking. The structure was tuned to a tenth of a percent while the fluid underneath carried a three percent question, which is a useful sense of proportion about where the uncertainty in a study actually lives.

## The misconception to avoid

"Bo is a small correction." It is a factor between about 1.05 and 1.7 that multiplies or divides every volume in the study. It is not small and it is not a correction; it is a unit conversion between two different places, and getting it wrong scales everything.

## Exercise

First, sketch Bo against pressure from atmospheric to well above the bubble point, marking the peak and saying what causes the slope on each side.

Second, Standing gives Ekene 1.2407824121407645 rb/stb against a designed 1.2. Compute the percentage difference and say what it would do to the field's booked oil in place.
