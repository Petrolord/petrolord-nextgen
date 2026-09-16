# What the gas length cannot exceed

The gas length is the gas height multiplied by the ratio of the gas velocity to the settling velocity. The capacity rule holds that ratio at or below one, so on any vessel that carries its gas the gas length is at most the gas height.

{{panel:fc-slug-explorer}}

## The bound, stated plainly

A vessel passes the capacity check when the gas velocity is no greater than the settling velocity. That is the same condition as the velocity ratio being no greater than one. Since the gas length is that ratio times the gas height, a passing vessel cannot have a gas length larger than the height of its own gas space.

On ABANA-2 at a level of 0.500000 the gas height is 4.000000 ft and the gas length is 2.396801 ft. The bound holds with room to spare, and it holds on every diameter in the family.

| diameter ft | gas length ft | margin |
| --- | --- | --- |
| 7.000000 | 2.739202 | 1.277745 |
| 8.000000 | 2.396801 | 1.668891 |
| 9.000000 | 2.130490 | 2.112190 |
| 10.000000 | 1.917441 | 2.607642 |

## What follows about control

At a level of 0.500000 the gas height is half the diameter, so on the 8.000000 ft drum the gas length can never exceed 4.000000 ft while the vessel passes its capacity check. The liquid requirement on that same drum is 23.270539 ft. There is no arrangement of a real liquid duty under which the gas requirement takes control of a vessel that is passing.

So gas controls the length of a horizontal vessel in only two situations: the vessel is gas overloaded, which means it has already failed the capacity check, or the vessel is so wide for its duty that its liquid requirement is shorter than its own gas height. The published overloaded case is the first of those: a gas length of 16.976527 ft against a gas height of 3.000000 ft, a margin of 0.176715, and gasCapacityOk false. The ratio there is far above one, which is exactly why the bound is broken.

## The provenance of the bound

This consequence is pinned by a gate on the engine, and it rests on the settling velocity that the horizontal gas length uses. That velocity is the Souders-Brown velocity at the horizontal K, and its use as a droplet settling velocity is HELD FOR LITERATURE with no check against a published method. If the literature sizes the gas length from a stated droplet diameter instead, the ratio stops being the same quantity as the capacity check, and the bound has to be re-read from scratch.

Hold it as a property of this method rather than a fact about separators.

## The mistake

The mistake is seeing gas named as the controlling requirement and treating it as an ordinary outcome. On this method it is a signal to go and read the capacity verdict, because a passing vessel almost never produces it.

## Exercise

State the bound in one sentence and give the gas height and the gas length for the ABANA-2 drum at 8.000000 ft and a level of 0.500000. Then name the two situations in which gas can control a horizontal vessel, and say which held item this whole argument depends on.
