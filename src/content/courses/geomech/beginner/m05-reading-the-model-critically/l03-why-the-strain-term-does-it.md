# Why the strain term does it

Tracing the breach to one input.

{{panel:gm-stress-explorer}}

## The two candidates

The horizontal stress estimate has two parts that could push SHmax above the overburden: the burial term and the tectonic strain term.

## Ruling out the burial term

The burial term is k0 times the effective vertical stress, plus the pore pressure. With k0 at 0.38888888888888895, that term is always well below the overburden.

Check it at 50 m: the effective vertical stress is 622722.275 Pa, k0 times that is 242169.7736111112 Pa, plus a pore pressure of 505042.475 Pa gives 747212.2486111112 Pa. The overburden is 1127764.75 Pa.

So burial alone puts SHmax comfortably below the overburden at the shallowest sample in the profile, and a fortiori everywhere deeper.

## The strain term is the culprit

The SHmax strain term is 8897569.444444442 Pa, at every depth.

Add that to the 747212.2486111112 Pa above and the estimate is 9644781.693055553 Pa, against an overburden of 1127764.75 Pa. The estimate exceeds the overburden by a factor of about 8.5.

The frictional clamp then pulls it back to 2531747.107419281 Pa, which is still more than twice the overburden.

## Why it fades with depth

Because the strain term is fixed and the burial term grows.

| depth | burial part of SHmax | strain term | overburden |
|---|---|---|---|
| 50 m | 747212.2486111112 Pa | 8897569.444444442 Pa | 1127764.75 Pa |
| 1000 m | 14944244.972222224 Pa | 8897569.444444442 Pa | 22555295 Pa |
| 2600 m | 41294168.70833333 Pa | 8897569.444444442 Pa | 58643766.99999999 Pa |

At 50 m the strain term is twelve times the burial part. At 2600 m it is about a fifth of it.

## The crossover

The violation ends between 1150 m and 1200 m, which is where the burial term has grown enough that the sum finally drops below the overburden.

That crossover depth is a property of three things: the strain term's size, k0, and the overburden gradient. Change any of them and it moves.

## What this teaches about the model

That a depth-independent addition to a depth-proportional quantity is only safe over the depth range where the two are comparable.

The tectonic strain formulation is standard and it is fine at reservoir depth. It is being extrapolated to 50 m here, where it has no business being, and the model has no mechanism to notice.

## What a real study does

Calibrates the strains against a measurement at depth, then declines to extrapolate the model above the shallowest calibration point. The shallow section gets drilled on experience and offset data instead.

## Exercise

Compute the burial part of SHmax at 1150 m and at 1200 m, add the strain term to each, and confirm the crossover falls between them.

Then solve for the strain term that would put the crossover exactly at 500 m, and say whether that is a plausible tectonic strain.
