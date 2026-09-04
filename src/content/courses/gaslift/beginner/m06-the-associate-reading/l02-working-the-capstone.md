# Working the capstone

Six steps in one order. Each step has a check that fails loudly, and doing them out of order means the first thing you find wrong is the last thing you did.

{{panel:pd-column-explorer}}

## Step one: pin the gas and the geotherm

Gravity, wellhead temperature, bottom temperature and the reference depth the geotherm runs linear over. Those four fix every gradient before a pressure is computed: sg 0.65 with 100.0 degF at surface and 190.0 degF at 8000.0 ft is one complete specification.

## Step two: march the column and sanity check the lift

Read the pressure at depth, then read the total lift and the average gradient. Column 1 lifts 201.016705 psi at 0.025127088 psi/ft, column 2 lifts 426.539804 psi at 0.038776346 psi/ft, column 3 lifts 53.897603 psi at 0.013474401 psi/ft. Compare the average with the flat 0.02 psi/ft rule and expect a ratio, not a match: 1.270257, 1.993598 and 0.680826 at the surface of those three. A ratio far outside that spread means an input is wrong, not the march.

## Step three: prove the march before trusting it

Run it at two step counts and look at the difference, not at either number. The engine's resolutions are 20 for spacing and 40 for the plotted curve, and the spread between 20 and 2000 is 5.0036e-4 psi on column 1. If a doubling does not cut the remaining difference by close to 4, stop: nothing downstream is safe.

## Step four: read the depth you actually need

Know whether the depth you asked for landed on a sample or between two. Between two the chord reads low, by -1.2220e-4 psi at 64 samples on column 1 and by -2.9517e-2 psi at 4. Nothing flags which one you got.

## Step five: solve the top valve as a fixed point

Seed it weightless, then iterate. The moves on westTexasOil run 112.559756904, 6.314981747, 0.354232178, 0.019870090 and 0.001114580 ft. Watch the moves, not the depths: a move that stops shrinking by roughly the same factor each pass means the iteration is not converging and the depth is not an answer.

## Step six: close the loop on the kill fluid line

At the top valve the injection pressure at depth must equal the unloading wellhead pressure plus the kill fluid gradient over that depth. westTexasOil reads 1068.362497529 psia at 2119.249994721 ft against 114.7 psia and 0.45 psi/ft. If the two sides disagree, the fixed point stopped early.

## The traps

**The weightless seed quoted as the answer.** It is 119.249955500 ft too shallow on westTexasOil.

**The flat 0.02 psi/ft rule.** Wrong in both directions, by -206.539805 psi on one published column and 26.102397 psi on another.

**Refining to close a gap.** A truncation shrinks by a factor near 4 a doubling. A residual that will not shrink means you are comparing two different things.

**Moving the decrement to move valve 1.** It shifts every mandrel below it and moves valve 1 by 0.000000000 ft.

**Mixed units.** psia never psig, Mscf/d, ft TVD, degF, psi/ft, in, lbm/ft3.

## Exercise

Work the six steps in order on a column of your choosing in the panel, writing one number at each step before moving on.

Then break the order: read a depth before checking the step count, and say which of the six checks would have caught it.
