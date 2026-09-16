# The Reynolds number in field units

The Reynolds number weighs a fluid's momentum against its viscosity. On the OGBIA line it is 48431.2523, which the engine reports as turbulent.

{{panel:fc-liquid-explorer}}

## The four inputs

It takes the density, the velocity, the bore and the viscosity. On OGBIA those are 54.500000 lb/ft3, 2.244621 ft/s, 7.981000 in and 2.500000 cp.

Three of the four are already settled by the time it is reached. The viscosity is the one input that enters here and nowhere earlier, which is what makes this the step where the fluid's character finally reaches the calculation.

## The centipoise has to be converted

A viscosity in centipoise is not in the pound, foot and second system the rest of the chain works in. One centipoise is 6.7197000000e-4 lbm per ft per s, and that conversion is measured out of the engine rather than typed in.

The Reynolds number itself is dimensionless. Every unit in it cancels, which is precisely why it can be compared against fixed boundaries for any fluid in any pipe.

## Viscosity alone, on the built line

| viscosity cp | velocity ft/s | Reynolds number | regime |
| --- | --- | --- | --- |
| 1.000000 | 2.244621 | 121078.1307 | turbulent |
| 2.500000 | 2.244621 | 48431.2523 | turbulent |
| 5.000000 | 2.244621 | 24215.6261 | turbulent |
| 10.000000 | 2.244621 | 12107.8131 | turbulent |
| 20.000000 | 2.244621 | 6053.9065 | turbulent |
| 30.000000 | 2.244621 | 4035.9377 | turbulent |
| 40.000000 | 2.244621 | 3026.9533 | transitional |
| 60.000000 | 2.244621 | 2017.9688 | laminar |
| 120.000000 | 2.244621 | 1008.9844 | laminar |

## The velocity does not move

Read the second column. It holds at 2.244621 ft/s down the whole table, because velocity is rate over area and neither of those is the viscosity. Everything downstream of the Reynolds number does move.

That is the cleanest demonstration in this tier of what depends on what. A thicker oil in the same pipe at the same rate travels at the same speed, and it is the friction it meets on the way that changes.

## The regime is a reported value

The engine returns the regime beside the number. It is worth reading rather than inferring, because the boundaries belong to the engine and the label it prints is what it actually did.

## The bore is in it twice

The Reynolds number is the density times the velocity times the bore, over the viscosity. The bore sits in that expression directly, and it is also inside the velocity, because the velocity is the rate over an area the bore fixed.

So opening a bore pulls the Reynolds number in two directions at once. That is worth knowing before predicting which way a regime will move when a line is resized, because the two effects do not act in the same direction.

## The mistake

Handing the Reynolds number a viscosity in the wrong unit. It is dimensionless, so the result carries no unit to look wrong, and a value off by a factor of a thousand still prints as a plausible Reynolds number and still selects a branch.

## Exercise

Name the four inputs the Reynolds number takes and say which one enters the chain at this step. Then say what happens to the velocity as the viscosity rises on this line, and why.
