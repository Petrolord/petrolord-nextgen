# The published cases

Three cases exercise the settling expression on their own numbers, and read side by side they show which of its terms is doing the work.

{{panel:fc-separator-explorer}}

## The three rows

| case | K | liquid lb/ft3 | gas lb/ft3 | terminal ft/s |
| --- | --- | --- | --- | --- |
| souders0.35 | 0.350000 | 52.000000 | 2.500000 | 1.557402 |
| souders0.45 | 0.450000 | 55.000000 | 5.000000 | 1.423025 |
| souders0.18 | 0.180000 | 62.400000 | 0.800000 | 1.579494 |

The three velocities sit within about a tenth of a foot per second of each other while their K values run from 0.180000 to 0.450000, a spread of two and a half times. That is the first thing these cases teach: K does not decide the answer on its own.

## The case that ought to be fastest

souders0.45 carries the largest K and returns the slowest velocity, 1.423025 ft/s. Its gas weighs 5.000000 lb/ft3, twice the 2.500000 of souders0.35 and more than six times the 0.800000 of souders0.18, and the gas density term overwhelms the K advantage.

souders0.18 is the mirror image. Its K of 0.180000 is the smallest of the three by a wide margin, and its light gas at 0.800000 lb/ft3 against a liquid at 62.400000 gives it the fastest velocity of the three at 1.579494 ft/s.

## What that means for a vessel

The required area is the gas rate over this velocity, so these three cases would size within a tenth or so of each other at equal rates, despite describing quite different hardware. A reader who expects a vane pack to buy a much smaller vessel than a bare drum is right only when the gas density is held constant, and it rarely is: the bare drum case here is a low-pressure service and the high-K case is a high-pressure one.

That is the practical lesson. Pressure moves the gas density, gas density moves the settling velocity hard through the square root, and the hardware coefficient is often the smaller of the two effects.

## How to read a case against a stream

These cases are separate vessels with their own numbers, and none of them describes the teaching streams. ABANA-1 settles at 1.458422 ft/s on a liquid of 55.171463 and a gas of 2.239712 lb/ft3, which places it between souders0.35 and souders0.45 in both fluid terms and in its answer. Confirming that a stream lands where the published cases bracketing it would suggest is a cheap sanity check, and it is the only legitimate use of a case belonging to another vessel.

## The mistake

Quoting a published case's velocity for a stream that merely looks similar. The numbers in these rows belong to the rows. A velocity of 1.579494 ft/s is the answer for a liquid of 62.400000 and a gas of 0.800000 lb/ft3 at K 0.180000, and it is the answer to nothing else.

## Exercise

Write the three cases with their inputs and their velocities, and say why the one with the largest K returns the slowest answer. Then say which term moved the results most across the three rows, and what that implies for a design where a mist extractor is being justified on vessel size alone.
