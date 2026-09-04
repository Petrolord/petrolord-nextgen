# Fluid load

A pressure difference across a plunger, times the plunger's area. There is no third term.

{{panel:pd-string-explorer}}

## Linear in the differential, and exactly linear

A 1.7500 in plunger, area 2.405281875 in2, walked across differentials:

| Differential, psi | Fluid load, lb | Static stretch on the published taper, in |
| --- | --- | --- |
| 400.0 | 962.112750162 | 3.602185792 |
| 800.0 | 1924.225500324 | 7.204371585 |
| 1200.0 | 2886.338250486 | 10.806557377 |
| 1600.0 | 3848.451000647 | 14.408743169 |
| 1950.0 | 4690.299657039 | 17.560655738 |
| 2400.0 | 5772.676500971 | 21.613114754 |
| 2800.0 | 6734.789251133 | 25.215300546 |

Double the differential from 400.0 to 800.0 psi and both columns double to the last figure. The load carries no depth, no rod weight, no fluid gradient of its own and no friction, because none of those is in the product.

## One load, doing two things

The 4690.299657039 lb at 1950.0 psi is the extra pull the polished rod carries on the upstroke. It is also 17.560655738 in of stretch in the string that carries it, and stretch at the top is travel the plunger at the bottom does not get.

That second column is the one designers forget. The fluid load is not only a load. It is a subtraction from the stroke, and it grows at exactly the rate the load grows.

## Pressures are absolute

The differential is a discharge pressure minus an intake pressure, both psia. A design that mixes an absolute discharge with a gauge intake produces a differential that is wrong by atmospheric pressure, and the engine has no way to notice, because a differential is all it ever sees.

## The mistake

Sizing a plunger for rate and then being surprised by the load. Load and displacement come off the same area, so they move together and there is no plunger size that gives more volume and less pull.

## What it refuses

It refuses a plunger with nothing to lift, rather than returning a harmless zero. Set the discharge below the intake and the reply is `ok = false`, with the fluid load that would have been reported reading 0.000000 lb, and the message "The plunger has no fluid to lift: the discharge pressure does not exceed the intake pressure. Check the fluid level, the tubing pressure and the inflow."

That refusal is the only physical check in the calculation. Everything else the product accepts, including a differential no well would ever deliver, because a differential times an area is arithmetic and arithmetic does not know what a well can do.

## Exercise

Read the fluid load on a 1.7500 in plunger at 400.0, 800.0 and 1600.0 psi of differential, and write the static stretch each one causes on the published taper.

Then set the discharge below the intake and record what the engine returns instead of a load.
