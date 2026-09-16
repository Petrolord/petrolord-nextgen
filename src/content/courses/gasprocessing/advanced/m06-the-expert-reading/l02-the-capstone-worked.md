# The capstone worked

The assessment gives a dew point skid and asks for the figures a designer would hand over. Every one is reachable by running the chain in order and reading what the engine returns. Here is that chain worked on the teaching stream.

{{panel:fc-coldend-explorer}}

## Conditions first

Nothing downstream can be formed without them. AGBADA arrives at 1180.000000 psia and 96.000000 degF with a gas gravity of 0.680000 and a molar heat capacity of 9.800000 Btu per lbmol per degF.

The gravity sets the pseudo-criticals and therefore the reduced pair, a reduced pressure of 1.771625 and a reduced temperature of 1.491161. The compressibility at that state is 0.834003433.

## The derivative, then the coefficient

The temperature derivative of the compressibility is 0.001161871583 per degR. It leads because it is the term the whole answer turns on. The coefficient follows: 0.061607962 degF per psi, or 6.160796 degF per 100 psi. The heat capacity enters here as a divisor and nowhere else in the chain.

## The march

Let down to 640.000000 psia over twenty steps, the gas cools 36.316483434 degF and arrives at 59.683516566 degF.

Take the three coefficients with it. The inlet is 0.061607962, the last half step is 0.071833233, and the mean the cooling delivered is 0.067252747. The mean belongs beside the arrival, and the inlet coefficient is 0.916066108 times it.

## The water, twice

The saturation routine is asked at both ends. At the inlet the gas carries 33.801656743 lb per MMscf. At the cold spot it can hold 18.762820770 lb per MMscf. The difference is 15.038835973 lb per MMscf into the boot, and as a ratio the cold gas holds 0.555085832 of what the warm gas held.

Check the warning field on each read before quoting it. The engine attaches its ideal-mixing chart warning above 1000.000000 psia, and these two reads are taken at 1180.000000 psia and at 640.000000 psia, so they do not carry the same status. A water content quoted without the note that came with it is a number stripped of what qualifies it.

## What the chain will not give you

Four questions come up here and none is answered. What hydrocarbon condenses at the cold spot needs a compositional flash. Whether the cold spot is inside the hydrate region belongs to Flow Assurance. How well the separator separates needs vessel internals this module does not model. What the real-gas correction would do to either water read is held for literature.

Write those beside the answer rather than leaving them for a reviewer.

## Units, precision and refusals

Water contents, pressures, temperatures and ratios print to six decimals. Counts are whole numbers. A coefficient quoted in degF per 100 psi has to say so, because the same quantity in degF per psi is the same answer at a different scale.

Where the engine refuses, the refusal is the answer. Record the message and the fields beside it rather than a blank, because a blank is what an empty input box also produces.

## Exercise

Work the chain in order and write each step with the input it needed from the step before. Record the reduced pair, the compressibility, the derivative, the coefficient in both units, the cooling, the arrival, the three march coefficients and the three water figures. Then say which single input divides the coefficient and enters nowhere else.
