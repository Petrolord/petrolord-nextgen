# The density difference, which drives everything

A droplet of oil rises because it is lighter than the water around it. How much lighter is the entire driving force for every gravity and centrifugal device in this module, and it is one subtraction: the brine density less the crude density.

## The subtraction, on one water

Take the UZERE brine at 1035.261174 kg/m3 and put the six crudes of the last lesson against it:

| API | crude kg/m3 | difference from the UZERE brine, kg/m3 |
| --- | --- | --- |
| 12 | 967.534410 | 67.726764 |
| 19 | 922.532810 | 112.728365 |
| 24 | 892.869375 | 142.391799 |
| 30 | 859.697757 | 175.563417 |
| 38 | 819.122052 | 216.139122 |
| 46 | 782.203875 | 253.057299 |

The UZERE stream sits on the middle row at 142.391799 kg/m3, and that single figure reappears in every device answer this tier reads.

## What the spread is worth

Across that sweep the difference changes by a factor of about three, and that is the same factor landing on every cut size squared. A heavy crude in the same brine is a fundamentally harder duty, and no amount of equipment selection makes the driving force larger. It is a property of the two fluids, settled before anybody opens a catalogue, and the only lever an engineer has over it is temperature, which moves both densities at once and moves them by different amounts.

## The number a small error lands on

Notice where the subtraction is fragile. The brine density and the crude density are both close to a thousand, and the difference between them is a few tens to a few hundreds. A one percent slip in either input is a small slip in a density and a much larger slip in the difference, and the difference is what the answer is built on. That is the argument for stating the temperature and the salinity of a sample carefully: those inputs look like documentation and they behave like design variables.

## When the subtraction has the wrong sign

If the oil is heavier than the water, there is no rise at all, and this engine says so by name: the oil must be lighter than the water for it to rise. That is worth stating plainly because it is physically possible. Very heavy crude in fresh, hot water can be denser than the water it sits in, and it will go down rather than up. A method built on buoyancy has nothing to say about that case, so the module refuses rather than returning a cut size somebody might use.

## Where it goes next

Everything from here is this one number doing work. The next module asks how fast a droplet of a given size rises given this difference and the viscosity from the module before. The module after that inverts the question and asks what size droplet a given vessel can catch in the time the water spends inside it. Both of those are this subtraction and the viscosity, arranged two ways.

{{panel:pw-water-explorer}}

## Exercise

Using the table, say how much the driving force changes between a heavy crude and a light one in the same brine. Then explain why the module refuses rather than reporting a negative rise velocity when the oil is heavier than the water.
