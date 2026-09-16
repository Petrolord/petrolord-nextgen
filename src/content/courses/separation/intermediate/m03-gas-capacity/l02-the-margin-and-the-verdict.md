# The margin, and the verdict

The margin is the settling velocity divided by the gas velocity. ABANA-2 at 8.000000 ft runs 1.173387 ft/s against a settling velocity of 1.958255 ft/s, a margin of 1.668891, and gasCapacityOk is true.

{{panel:fc-slug-explorer}}

## A ratio with a threshold at one

| diameter ft | gas velocity ft/s | margin | carries the gas |
| --- | --- | --- | --- |
| 5.000000 | 3.003871 | 0.651911 | false |
| 6.000000 | 2.086022 | 0.938751 | false |
| 7.000000 | 1.532587 | 1.277745 | true |
| 8.000000 | 1.173387 | 1.668891 | true |
| 9.000000 | 0.927121 | 2.112190 | true |
| 10.000000 | 0.750968 | 2.607642 | true |

A margin above one says the gas in the gas space is moving more slowly than a droplet falls through it. A margin below one says the gas is winning, and liquid that should be landing on the surface is being carried out with the gas instead.

## The verdict is a field, not a comment

gasCapacityOk is returned as a true or a false beside the dimensions. It is not a note in the remarks column and it is not advisory. A vessel with gasCapacityOk false has been sized, has a length and an L/D, and does not do the job it exists to do.

The margin travels with the verdict because the two answer different questions. The verdict says whether the vessel carries its gas. The margin says by how much, which is what tells a reviewer whether the answer is comfortable or one operating change away from failing.

## Reading the margin as a distance from trouble

The 6.000000 ft drum reads 0.938751 and the 7.000000 ft drum reads 1.277745, so one foot of bore carries the family across the threshold. The 5.000000 ft drum at 0.651911 is not marginal, it is a long way out. At the other end, 2.607642 on the 10.000000 ft drum says the gas has more than twice the room it needs, which is a reason to ask whether that much steel was bought for nothing.

## What moves the margin

The gas velocity moves with the bore and with the level, and the settling velocity moves with the K, with the two densities and therefore with the pressure. On ABANA-2 the settling velocity of 1.958255 ft/s comes from a horizontal mesh K of 0.400000 against a liquid of 55.919504 lb/ft3 and a gas of 2.239712 lb/ft3. A change in operating pressure moves the gas density, the settling velocity and the actual gas rate together, so the margin is not a fixed property of the vessel.

## The mistake

The mistake is quoting the margin without the verdict, or the verdict without the margin. A reader given 1.668891 alone has to know the threshold, and a reader given true alone cannot tell 1.277745 from 2.607642. The other mistake is rounding: a margin of 0.938751 rounds to one, and one is a pass.

## Exercise

Give the margin and the verdict for the 6.000000 ft, 7.000000 ft and 8.000000 ft drums. State what a margin below one means physically, and name three inputs that move the settling velocity of 1.958255 ft/s.
