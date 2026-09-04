# The actual velocity

The actual velocity is the only number in the loading check that the well itself supplies, and it arrives as a rate.

{{panel:pd-droplet-explorer}}

## The same conversion, run backwards

A critical velocity becomes a critical rate by multiplying by 3054.38693878 Mscf/d per (ft/s x ft2 x psia / degR), an area and p over z times T. A production rate becomes an actual velocity by dividing by exactly the same three things. There is no second formula and no second constant.

The station: 1000.0 psia, 540.0 degR, z 0.90, gas gravity 0.65, water at 60.0 dyne/cm and 67.0 lbm/ft3, through 2.441 in.

| Gas rate, Mscf/d | Actual velocity, ft/s |
| --- | --- |
| 400.0 | 1.9584354355 |
| 800.0 | 3.9168708710 |
| 1200.0 | 5.8753063066 |
| 1400.0 | 6.8545240243 |
| 1600.0 | 7.8337417421 |
| 1614.0 | 7.9022869823 |
| 1800.0 | 8.8129594598 |
| 2200.0 | 10.7713948953 |
| 2600.0 | 12.7298303309 |

Doubling the rate from 400.0 to 800.0 Mscf/d doubles the velocity from 1.9584354355 to 3.9168708710 ft/s. The relation is linear because everything else in it is held at the station. Halve the rate and the velocity halves; the pipe and the gas have no say in it.

## Where it meets the critical velocity

That station's Turner critical velocity is 7.9039700957 ft/s. The sweep passes it between 7.9022869823 ft/s at 1614.0 Mscf/d and 8.8129594598 ft/s at 1800.0 Mscf/d, which is the same crossing the critical rate of 1614.343766935 Mscf/d describes in the other currency. Neither reading is the more fundamental one. They are the same comparison, converted.

## The mistake

Computing the actual velocity somewhere other than where the critical velocity was computed. It is an easy error to commit without noticing, because a gas rate is normally a surface number and the critical velocity is normally quoted where the liquid is. Divide a surface rate by a downhole area at a downhole p, z and T and the arithmetic runs, no warning appears, and the answer is a comparison between two different wells.

The second mistake is treating the actual velocity as a measurement. Nothing here measures a velocity. It is a rate somebody supplied, divided by a geometry somebody typed, at a station somebody chose.

## What it refuses

The conversion refuses a zero area rather than returning an infinite velocity, and the gas density refuses a zero temperature rather than dividing by it.

Beyond that it refuses to judge. An actual velocity of 7.9022869823 ft/s is neither good nor bad. It carries no verdict at all until it is set against the critical velocity of the same station, and 7.9022869823 ft/s is a healthy figure at one station and a loaded one at another.

## Exercise

Read the actual velocity at 1200.0 and at 2200.0 Mscf/d in the panel, then confirm by hand that the ratio between those two velocities is the ratio between those two rates.
