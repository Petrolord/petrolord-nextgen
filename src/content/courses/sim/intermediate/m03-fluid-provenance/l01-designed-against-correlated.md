# Designed against correlated

There are two ways to get a PVT table into a deck. You can measure or design the fluid and tabulate it, or you can run a correlation on the fluid's gravities and tabulate that. Ekene's deck does the first, and this module is about why that choice had to be made deliberately.

## What the deck carries

The designed fluid, from the Material Balance course:

| quantity | value |
|---|---|
| initial pressure | 3200 psia |
| bubble point | 2000 psia |
| solution gas at pb | 400 scf/stb |
| Bo at initial pressure | 1.2 rb/stb |
| oil compressibility | 1.2e-5 per psi |
| oil viscosity at pb | 1.8 cp |

Those are not measurements. They are the values that course chose, and every calculation in the reservoir engineering module since has used them: the tank pressure history, the flood ledger's frozen factor set, the fractional flow curves.

## What a correlation says instead

Ekene's oil is 32 API with 0.75 gravity gas at 180 F. Feed those three numbers to the standard correlation set and you get a complete PVT description without any designed values at all.

| quantity | designed | correlated |
|---|---|---|
| Bo at 3200 psia | 1.2 | 1.2292846175634324 |
| Rs at 2000 psia | 400 scf/stb | 421.93922752270595 scf/stb |
| oil viscosity at pb | 1.8 cp | 0.7341185203712621 cp |

The correlation set used is Standing for bubble point, solution gas and formation volume factor, Beggs and Robinson for oil viscosity, Hall and Yarborough for the gas z-factor, McCain for water and Lee, Gonzalez and Eakin for gas viscosity. That is a standard, defensible stack, and none of it was tuned to Ekene.

## The size of the disagreement

Bo differs by 2.4403847969526993 percent. Solution gas differs by 5.484806880676496 percent. Viscosity differs by more than a factor of two.

Those are not rounding differences. They are two descriptions of the same oil, both defensible, and the deck can carry only one.

## Why the viscosity gap is so large

Because 1.8 cp was chosen for a purpose. The SCAL course needed a mobility ratio, and mobility ratio is the whole reason a waterflood sweeps well or badly. It set the oil viscosity at the flood-era pressure to a value that made the Ekene flood mildly unfavourable at a mobility ratio of 1.2, which is a realistic and instructive place to be.

Beggs and Robinson, given 32 API at 180 F with 400 scf/stb dissolved, says the oil is much thinner than that.

Neither is wrong. One is a design choice for a teaching field and the other is a correlation on a light oil at a warm reservoir temperature. What matters is that the deck and the flood analysis carry the same one.

## The rule this module is about

**A deck's fluid must be the fluid the model was matched against.**

That is the whole content of the module and everything else is illustration. If a history match was done with one PVT description and the deck carries another, the match does not transfer, and the model reproduces history for the wrong reasons.

## The misconception to avoid

"Correlations are objective, so a correlated PVT is more defensible than a designed one." A correlation is a fit to somebody else's fluids, and using it asserts that your fluid resembles that population. That is an assumption, not an observation, and on a fluid you have designed or measured it is a worse assumption than the design or the measurement. Correlations are what you use when you have gravities and nothing else.

## Exercise

First, compute the percentage differences for Bo and Rs from the table above and confirm they match the values quoted.

Second, name the one input to the deck's PVT that came from a physical requirement of the waterflood analysis rather than from a fluid measurement, and say what that requirement was.
