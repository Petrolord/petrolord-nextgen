# The pressure head over the vapour pressure

NPSH available is a statement about the suction side of a pump, and its first term is not the suction pressure. It is how far the suction pressure stands above the pressure at which this particular liquid boils.

{{panel:fc-suction-explorer}}

## The OKONO suction

The OKONO suction is a drum at 24.500000 psia holding a liquid whose vapour pressure is 0.950000 psia, at a specific gravity of 1.040000. The engine returns a pressure head of 52.308173 ft.

Two things about that figure decide how the rest of the suction side reads. It is a difference, so the vapour pressure sits inside the term rather than beside it. And it is a head, so the conversion out of pressure runs at the specific gravity of the liquid being pumped, which is why the gravity is one of the stated conditions.

## The evidence that it is a difference

The engine will say so itself if it is asked at the right place. Hand it a suction of 6.200000 psia on a liquid whose vapour pressure is 6.200000 psia and the pressure head comes back as 0.000000 ft. The suction pressure there is not small. It is all spent holding the liquid as a liquid, and the term that measures the surplus has no surplus to measure.

That is why the vapour pressure belongs inside the first term. What keeps a liquid from flashing as it accelerates into the eye of an impeller is the pressure it carries over its own boiling pressure, and an absolute suction pressure on its own says nothing about that.

## Only the suction pressure moves it here

Hold the liquid, the gravity and the geometry and pad the drum, and the pressure head walks with the suction pressure:

| suction psia | pressure head ft |
| --- | --- |
| 14.700000 | 30.540865 |
| 18.000000 | 37.870673 |
| 21.000000 | 44.534135 |
| 24.500000 | 52.308173 |
| 30.000000 | 64.524519 |
| 40.000000 | 86.736058 |
| 60.000000 | 131.159135 |

Every row is the same liquid at the same vapour pressure and the same gravity. The suction pressure is the only condition that changed.

## The mistakes

The first is quoting the suction pressure as the pressure head. The OKONO drum is at 24.500000 psia and its pressure head is 52.308173 ft. A pressure and a length are not interchangeable.

The second is a gauge pressure passed in where an absolute one belongs. Every suction pressure in this work is absolute.

The third is dropping the vapour pressure, or leaving it at zero because the case did not seem to state one. That inflates the pressure head, and it inflates it by the term that was meant to be reserved against flashing.

## Exercise

Write the pressure head for the OKONO suction and name the three conditions it depends on. Then give the pressure head at suction pressures of 14.700000 psia and 60.000000 psia, and say what a pressure head of 0.000000 ft tells you about the suction it came from.
