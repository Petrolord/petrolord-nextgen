# What one station cannot tell you

A station reading is exact, and what it is exact about is a station.

{{panel:pd-droplet-explorer}}

## The reading is not in doubt

At 2500.0 psia and 620.0 degR, published water at 60.0 dyne/cm and 67.0 lbm/ft3 through 2.441 in tubing needs 2341.162863678 Mscf/d. That number is not an estimate. Given the six inputs it is a calculation with one answer, checked against an independent implementation in another unit system. Whatever else is true, the reading itself is sound.

## What moved it was never the well

| Pressure, psia | Temperature, degR | Turner critical rate, Mscf/d |
| --- | --- | --- |
| 300.0 | 540.0 | 892.895047041 |
| 300.0 | 620.0 | 833.741395355 |
| 1000.0 | 540.0 | 1614.343188395 |
| 1000.0 | 620.0 | 1509.356272243 |
| 2500.0 | 540.0 | 2496.154595078 |
| 2500.0 | 620.0 | 2341.162863678 |

One fluid, one gravity, one compressibility factor, one tubing size. The requirement runs from 833.741395355 to 2496.154595078 Mscf/d and every step of that came from the pressure and the temperature, which is to say from where the gauge was. Nothing about the reservoir, the completion or the liquid rate entered anywhere.

## The sentence a station supports

"At 2500.0 psia and 620.0 degR, water through 2.441 in needs 2341.162863678 Mscf/d" is supported. "The well needs 2341.162863678 Mscf/d" is not, and the distance between the two sentences is every other point in the string, each with its own pressure, its own temperature and possibly its own diameter, each of which would return a different number from the same code.

## Why the module cannot close the gap

It was never asked to. There is no inflow performance anywhere in these modules, and the flowing traverse is passed in as a list of stations carrying their own pressure, temperature, z and diameter. `loadingProfile` does not solve multiphase flow and does not invent a gradient. So a single station has no mechanism by which it could know what any other station reads, and the module makes no claim that it does.

## The mistake

Writing "the well is not loading" when the calculation said "this station is not loading at this rate". Nothing in the returned object stops you, because it does not carry the station it was evaluated at. The correction is a habit rather than a technique: name the station in the sentence, every time, and the question of whether it is the right station stays open instead of quietly closing.

## Exercise

Write the six published critical rates and state, for each pair, which single input changed.

Then write one sentence your station reading supports and one it does not, and say what you would need to turn the second into a claim.
