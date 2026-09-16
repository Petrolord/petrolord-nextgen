# Goldens that are not measurements

Every published case behind this course is synthetic. They come from an independent oracle written in Python from the same physics, in SI where the engine works in field units, and no measured separator appears anywhere in the course.

{{panel:fc-slug-explorer}}

## What a synthetic golden can prove

Two implementations of the same physics, written by different people in different unit systems, will disagree the moment one of them makes an arithmetic slip or drops a conversion. That is what these goldens catch, and they catch it well.

What they cannot catch is a method that is wrong in both files. If the physics being encoded is the wrong physics, the oracle agrees with the engine and both are confidently wrong together. Agreement between two implementations is evidence about arithmetic, and it is not evidence about the world.

## The distance cases agree exactly

| case | haversine m | Vincenty m | chord m |
| --- | --- | --- | --- |
| portHarcourt90m | 89.4099 | 89.4099 | 89.4099 |
| portHarcourtDueNorth | 489.2584 | 489.2584 | 489.2584 |
| highLatitudeSmallDLon | 55.5975 | 55.5975 | 55.5975 |
| equator | 1111.9508 | 1111.9508 | 1111.9508 |

Three methods agreeing to the printed figure on four cases says the distance arithmetic is sound at site scale. It says nothing about whether the coordinates on a plan are where the steel is.

## The droplet cases disagree by a constant

The Stokes oracle sits at a ratio of 1.004184 to the engine on all three published cases, in the same direction every time. An engine velocity of 0.044500 ft/s meets an oracle velocity of 0.044686 ft/s, and 0.320400 ft/s meets 0.321740 ft/s.

A constant ratio is the useful kind of disagreement. It rules out an arithmetic slip, which would wander, and it points straight at a packaged constant. The gap is kept and stated, because the field form is the form the standards use, and any gate on droplet settling holds a tolerance wider than four parts in a thousand.

## Where the engine refuses instead of extrapolating

The z factor is the one place the module declines to answer outside its fit. A cold gas is refused with "Tpr 0.848 is below the DAK validity range of 1.0 to 3.0: the z-factor would be an extrapolation below the critical temperature, so it is refused". A hot gas and a very high pressure are refused the same way. Below the fit data at Ppr 0.200000 the answer is accepted with a note, z 0.986286 and a density of 0.317797 lb/ft3, because the surface runs to the ideal gas limit there.

A refusal is a golden too. It records where the method stops, which a synthetic case can establish as firmly as a measured one.

## The mistake

The mistake is reading a golden as a field validation. A green test suite here means the engine agrees with an independent implementation of the same assumptions, and a reader who reports it as agreement with measured separator performance has upgraded the claim.

The second mistake is dismissing the goldens for the same reason. They caught real defects in this engine, and the constant Stokes ratio is a finding that only appeared because two implementations were run side by side.

## Exercise

Say what a synthetic golden can prove and what it cannot. Then explain why the four distance cases agreeing exactly and the three Stokes cases disagreeing by 1.004184 are both useful results, and give the refusal message for a gas whose reduced temperature falls below the DAK range.
