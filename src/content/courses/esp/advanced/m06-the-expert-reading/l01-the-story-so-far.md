# The story so far

This tier is one chain of translations, and every seam in it is a place where two answers are both right and disagree.

## The chain

Head required becomes shaft horsepower, shaft horsepower becomes amps, amps become volts and kVA at surface. An error introduced at one step is invisible at the next, because the next step accepts whatever it is given.

## Two powers, one pump

`shaftHp` is brake power at the head the duty requires. `stack.bhpTotal` is brake power at the head the integer stack actually makes. On golden design gassyOffshore those are 125.69771587 hp and 125.74467535 hp, a gap of 0.037345 percent. On teaching well IBENO-2, a stack of a few dozen stages, they are 29.77428389 hp and 30.53878580 hp, a gap of 2.503380 percent. The ratio of the two powers is exactly the ratio of the two heads, to machine precision on every case. Everything electrical is built on the first of the two.

## Two load fractions, one name

`sizePump` returns utilisation against the motor's usable rating, after the thrust derate. `motorCurrent` returns the electrical load fraction against the plate, before it. On teaching well QUA-IBOE-4 at a 12 percent derate they are 1.0842751471 and 0.9541621294, 13.011302 points apart, and one module raises `motorOverloaded` while the other raises nothing on the same motor. Both are right for the question they answer, and the shared name is the whole of the trap.

## Amps, cable and surface

Motor current is the nameplate current scaled by the electrical load fraction, and flagged rather than extrapolated below half load, where 0.2000 of plate gives 9.8000 A. The cable is chosen on voltage drop alone, which is why 192.000000 A goes down 6 AWG at a drop of 3.733233 percent. At surface, golden electrical case 1 asks 2481.51704573 V and 143.98680570 kVA, and leaves 4.72992077 kW in the conductor.

## Decisions, conventions and artefacts

The motor, the cable, the stage count, the derate and the power factor are decisions, and somebody signs them. Rounding stages up, the rounded gradient constant 0.433 and the linear scaling of nameplate current are conventions, defensible and not unique. Two fields sharing the name `loadFraction`, an ampacity flag that is true because there is no ampacity column, and a message that printed its own threshold are artefacts of how the code was assembled.

Knowing which of the three you are looking at is what this tier was for. A decision can be argued, a convention has to be stated, and an artefact has to be worked around until somebody is allowed to fix it.

## Exercise

For each of the three seams in this tier, write the two numbers that disagree and the one sentence that says why both are right.

Then sort the numbers in a finished design into decisions, conventions and artefacts, and say which list belongs in a report and which in a footnote.
