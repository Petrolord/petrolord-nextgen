# The scaled wind speed held at one

{{panel:cq-fire}}

The scaled wind speed u* has a floor. The Yellow Book writes it as u* = max(1, u10 / uc), and the engine follows the printed form exactly. This short lesson explains what the floor does to the flame length and why a learner who forgets it will get the wrong number for every light wind.

## The floor in the formula

The wind factor in Thomas is u* raised to the power minus 0.21. If u* could fall below one, a light wind would make that factor larger than one and the flame longer than in no wind at all. The printed form prevents that: whenever the wind at 10 m is below uc, u* is set to one, the factor becomes one, and the wind drops out of the calculation.

## ERHA below and above uc

ERHA's characteristic wind speed is 2.546226 m/s. The engine's sweep shows the floor at work:

| wind at 10 m, m/s, stated | scaled wind speed u* | flame length m |
| --- | --- | --- |
| 0 | 1.000000 | 35.746382 |
| 2 | 1.000000 | 35.746382 |
| 4 | 1.570953 | 32.511563 |

Every wind below 2.546226 m/s gives the same length, 35.746382 m, including no wind at all. Only above uc does the length begin to fall. At 4 m/s the scaled wind speed is 1.570953 and the flame has already shortened to 32.511563 m.

## Held at one is a property of the form

The flat stretch is the correlation's shape, and the engine copies it exactly as printed. It says the flame is insensitive to winds weaker than its own plume, and it makes the wind form continuous at uc, with no jump in the length as the wind crosses it. What it does not do is turn the wind form into the still air form: at no wind the wind form still gives 35.746382 m against the still air 37.101102 m.

## Reading a note that quotes a light wind

When a consequence note reports a pool fire in a light wind, check the scaled wind speed before anything else. A note that quotes u* below one has left the printed form. A note whose flame length changes between two winds that both sit below uc has done the same. The check needs only two numbers: the wind at 10 m and the fire's own uc. If the wind is the smaller, u* is one and the flame length is the no wind value, whatever the wind actually was. If the wind is the larger, u* is their ratio, and the flame length falls as that ratio to the power minus 0.21.

## Exercise

In the fire panel, load ERHA with the wind form. Enter a wind a little below 2.546226 m/s and a wind a little above it, and record u* and the flame length for each. Then explain in one sentence why the first result equals the no wind row exactly.
