# The gas table

The oil in this deck is designed. The gas is correlated. Mixing provenance within one PROPS section is legitimate and it needs saying out loud.

## What the gas table holds

Twelve rows, from 400 to 3800 psia, giving the gas formation volume factor and viscosity at each:

| p (psia) | Bg (rb/Mscf) | mug (cp) |
|---|---|---|
| 400 | 7.69884172678742 | 0.012985917627189394 |
| ... | ... | ... |
| 3800 | 0.7558978864869643 | 0.02456746561386731 |

Bg falls by a factor of ten across the range and viscosity roughly doubles. That is gas doing what gas does: it compresses hard, and compressed gas is more viscous.

## Where it came from

The Hall and Yarborough z-factor correlation with Lee, Gonzalez and Eakin viscosity, evaluated on a gas gravity of 0.75 at 180 F. Both are the standard choices and both are correlations on a population of gases rather than measurements of this one.

## Why the gas is correlated when the oil is not

Because nothing else in the study needed it.

The Material Balance course modelled Ekene as undersaturated with no free gas. The flood ledger set the gas formation volume factor to zero because every molecule produced was solution gas already accounted for in Bo. The SCAL course worked in oil and water.

So there was no designed gas description to inherit, and inventing one would have meant designing a fluid nobody would ever check. A correlation on the field's own gas gravity is the honest fallback: it is derived from a real property of the field and it makes no claim to be a measurement.

## Why the deck needs a gas table at all

Ekene never goes below its bubble point in the field's history, so on the face of it no gas ever comes out of solution.

Two reasons the table is still required.

**Near-wellbore pressure falls much further than average pressure.** A producer pulling against a bottom-hole pressure limit of 1200 psia has cells around it well below the 2000 psia bubble point, even while the field average sits above it. Gas appears there.

**A forecast can go anywhere.** The prediction tail runs five years beyond the history with no guarantee that pressure holds. A deck without a gas table cannot represent its own forecast if pressure declines.

A deck that omits the gas table for an undersaturated oil is a deck that cannot model its own producers' drawdown.

## The consistency the table must have

The gas gravity in the correlation and the gas density in DENSITY must be the same gas. This deck's gas density of 0.0572715 lb/ft3 is 0.75 times air, and the gas table was generated at 0.75. Those two agreeing is not automatic; they come from different keywords and nothing checks them against each other.

That is a one-line check worth doing on any deck: divide the gas surface density by the density of air and confirm it matches the gravity the PVT was built on.

## The misconception to avoid

"Mixing a designed oil with a correlated gas is inconsistent." It is inconsistent only if the two describe fluids that could not coexist. Here they do not interact: the oil's dissolved gas is described entirely by the oil table's solution gas ratio, and the gas table describes free gas, which this reservoir does not have in its history. What would be inconsistent is a gas gravity of 0.75 in one keyword and 0.65 in another.

## Exercise

First, the gas surface density is 0.0572715 lb/ft3 and air is about 0.0764 lb/ft3. Compute the implied gas gravity and confirm it matches the value the PVT table was generated at.

Second, give two reasons an undersaturated reservoir still needs a gas table, and say which one applies from the very first timestep.
