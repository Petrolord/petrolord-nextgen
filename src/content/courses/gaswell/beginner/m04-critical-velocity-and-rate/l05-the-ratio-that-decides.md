# The ratio that decides

A rate carries no verdict. A velocity carries no verdict. The ratio between what the gas does and what it must do carries the only one there is.

{{panel:pd-droplet-explorer}}

## The whole sweep, including the rows nobody reports

The station is 1000.0 psia, 540.0 degR, z 0.90, gas gravity 0.65, water at 60.0 dyne/cm and 67.0 lbm/ft3, through 2.441 in, at a Turner critical rate of 1614.343766935 Mscf/d.

| Gas rate, Mscf/d | Actual velocity, ft/s | Ratio | Loaded |
| --- | --- | --- | --- |
| 400.0 | 1.9584354355 | 0.2477787000 | true |
| 800.0 | 3.9168708710 | 0.4955574001 | true |
| 1200.0 | 5.8753063066 | 0.7433361001 | true |
| 1400.0 | 6.8545240243 | 0.8672254502 | true |
| 1600.0 | 7.8337417421 | 0.9911148002 | true |
| 1614.0 | 7.9022869823 | 0.9997870547 | true |
| 1800.0 | 8.8129594598 | 1.1150041502 | false |
| 2200.0 | 10.7713948953 | 1.3627828503 | false |
| 2600.0 | 12.7298303309 | 1.6105615503 | false |

The critical rate is the same 1614.343766935 Mscf/d on every row. Only the left column moved.

## It is two ratios at once

At 1800.0 Mscf/d the velocity ratio is 1.1150041502 and the rate ratio is 1.1150041502, a difference of 0.0000e+0. That is not a coincidence and it is not a rounding. Both sides of the comparison are evaluated at the same station on the same area, so the conversion between velocity and rate cancels out of the fraction entirely.

This is why the ratio is the number to carry. It is unitless, and it says the same thing whichever currency the report happens to use.

## The row that matters is the one nobody would print

At 1614.0 Mscf/d the ratio is 0.9997870547 and the well is loaded. Not marginal, not borderline, not on the line. The flag reads true.

Write that ratio to two decimals and every reader in the room will take it as passing. The verdict is a strict comparison against one, and a ratio under one by any amount at all is a loading verdict. The engine has no way to be less pedantic, because nothing in the balance says how far under one is close enough.

## The mistake

Deciding that 0.9911148002 at 1600.0 Mscf/d is near enough to healthy because 1600.0 is near enough to 1614.343766935. That reasoning has the direction right and the standing wrong. Everything at or below the critical rate is a well that cannot lift its droplets at that station, and the ratio is telling you by how little, not whether.

## What it refuses

It refuses to be a forecast. The rate is an input, so the ratio prices a day somebody described rather than the next one.

And it refuses to speak for anywhere else. This ratio is a statement about one station, computed from one pressure, one temperature, one z and one area. What the same well reads at a different station is a different calculation, and nothing on this row hints at it.

## Exercise

Find the two rates in the panel between which the flag changes, and write the ratio at each. Then say in one sentence why quoting the ratio to two decimals would have hidden the change.
