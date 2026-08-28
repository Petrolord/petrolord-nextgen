# The Standing gap

The correlation says this oil holds 421.93922752270595 scf/stb at its bubble point. The design says 400. This lesson is about what that five and a half percent means and what it would do if it were in the deck.

## Where the number comes from

Standing's correlation relates bubble point pressure, solution gas, oil gravity, gas gravity and temperature. Given four of them it returns the fifth.

Here the bubble point is fixed at 2000 psia, the oil at 32 API, the gas at 0.75 and the temperature at 180 F. The correlation returns the solution gas that makes those consistent, and it is 421.94 rather than 400.

Read the other way round, it says: an oil of this gravity, with 400 scf/stb dissolved, at this temperature, would bubble at a somewhat lower pressure than 2000 psia.

## What the gap would cost in the deck

**Oil in place.** The volumetric booking divides reservoir oil by Bo to get stock tank barrels. Using the correlated Bo of 1.2292846175634324 rather than 1.2 gives 2.4 percent fewer stock tank barrels from the same reservoir volume. That is forty times the reconciliation residual the previous module worked so hard to achieve.

**Material balance.** The Material Balance course derived the field's oil in place from a pressure history using the designed Bo. Swap the PVT and the same pressures imply a different oil in place, so the tank model and the deck would disagree about the size of the field.

**Voidage.** The waterflood ledger converted every produced barrel at Bo 1.21584 and every injected barrel at Bw 1.02. Change Bo and every voidage replacement ratio in three years of ledger moves.

**Sweep.** The mobility ratio is oil viscosity over water viscosity times the endpoint permeabilities. Take the oil viscosity from 1.8 to 0.734 and the mobility ratio drops from 1.2 to about 0.49, which turns a mildly unfavourable flood into a favourable one and changes every sweep number the waterflood course computed.

## The point

That last one is the striking one. A PVT substitution nobody would call major, made in one section of one file, would invalidate an entire course's worth of analysis on the field.

That is what "the deck must carry the fluid the model was matched against" means in practice. It is not a tidiness rule.

## Which is right for Ekene

The designed fluid, without hesitation, because every other number about this field was derived with it. Consistency across the study beats agreement with a correlation.

For a real field the question is different and harder. There you would have laboratory PVT from one or more samples, a correlation as a fallback where the samples do not reach, and a judgement about how representative the samples are. The answer is usually the lab data with a correlation used to extend it, and the deck should say which parts came from which.

## What to write down

The provenance, per table. Something like: oil PVT designed to the field's own material balance parameters, gas PVT from Hall and Yarborough with Lee, Gonzalez and Eakin viscosity on a gas gravity of 0.75.

A reader can then judge each table on its own terms, and can tell at a glance that the oil and the gas in this deck came from different places, which is true and is worth knowing.

## The misconception to avoid

"A five percent PVT difference is within the uncertainty, so it does not matter." Five percent on a quantity that multiplies through every volume, every voidage ratio and every mobility calculation is not a small perturbation, and more importantly it is not a RANDOM one. It moves everything the same way at once, which is exactly what an uncertainty band does not do.

## Exercise

First, the designed oil viscosity is 1.8 cp and the correlated value is 0.7341185203712621 cp. The mobility ratio scales with oil viscosity. Compute what the mobility ratio would become if the correlated viscosity were used in place of the designed 1.2, and say whether the flood becomes more or less favourable.

Second, list three quantities elsewhere in this field's analysis that would move if Bo changed by 2.4 percent.
