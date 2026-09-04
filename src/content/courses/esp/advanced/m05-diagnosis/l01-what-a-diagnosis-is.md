# What a diagnosis is

A design asks what a pump should do. A diagnosis asks what a running pump is doing, on the same curve read backwards.

{{panel:pd-power-explorer}}

## The comparison, and only the comparison

`diagnoseOperation` takes a surveillance record and the stage curve the stack was built on, computes what that stack should make at the measured rate and speed, and divides. The published gate fixture is reference stage ref-540-2500, 200 stages, specific gravity 0.95, 2500 bbl/d at 60 Hz: head per stage 28.00000000 ft, head the stack should make 5600.000000 ft, efficiency the curve expects 0.7000000000, brake power the stack should absorb 140.08101020 hp, region recommended.

Everything the function returns is a reading or a ratio: the actual head, the expected head, the head ratio, the region, the duty as a multiple of the best efficiency rate, the efficiency and the amps against nameplate. Not one field is a cause.

## Head arrives by one of two routes

A record can carry the head directly, or it can carry an intake pressure and a discharge pressure and let the engine recover it. The recovery divides by a gradient built as 0.433 times the specific gravity: on the fixture that is 0.41135000 psi/ft, and 800 psia intake against 2856.750000 psia discharge recovers 5000.00000000 ft, a head ratio of 0.8928571429 and no flags.

That 0.433 is the rounded field constant, not the exact 0.433333333333 the density conversion uses, and the two are 0.076982 percent apart. Hand this function a specific gravity derived from a density and the head it recovers is on a different gradient from the one the design was built on.

## The region reading is about the curve

| Rate, bbl/d | Multiple of the best efficiency rate | Region |
| --- | --- | --- |
| 1400 | 0.560280 | downthrust |
| 1875 | 0.750375 | recommended |
| 2500 | 1.000500 | recommended |
| 3124 | 1.250225 | upthrust |

The bands are 0.75 and 1.25 of the best efficiency rate, and 0.750375 sits inside while 1.250225 sits outside. A region flag is a statement about where the duty landed, not about the pump's condition.

## What it refuses

It never names a cause. There is no wear model, no gas lock model and no failure mode anywhere in the function. It also refuses to diagnose a stopped pump: at zero drive frequency the stage read returns NaN head, region invalid and inside the published range false. And with no nameplate current it returns no amps reading at all, in the same way `motorCurrent` returns NaN when the nameplate current is zero.

## Exercise

Run the gate fixture in the panel and record the expected head, the efficiency, the brake power and the region.

Then recover the head from 800 psia and 2856.750000 psia, write the ratio, and say in one sentence what a specific gravity error would do to it.
