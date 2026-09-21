# Three things called back pressure

{{panel:fc-sizing-explorer}}

Back pressure is an overloaded phrase on this platform. It already means the choke setting in managed pressure drilling, and it already means the term in the Rawlins and Schellhardt equation in nodal analysis and well testing. Three different quantities elsewhere on this platform are called back pressure, and none of them is the one this course means.

## The one sense this course uses

Here back pressure means the pressure at the relief valve outlet, in the header the valve discharges into. It is always written that way in these lessons, at every mention, because the habit of qualifying it is cheaper than the habit of guessing. Wherever you meet it unqualified in a plant document, the first question is which of the several senses the author had in mind.

## Three renderings of one quantity

Even inside this one sense, the same outlet pressure reaches the engine in three different renderings, and the table below prints all three for ORUBIRI.

| rendering | ORUBIRI |
| --- | --- |
| stated at the outlet, psig | 35.000000 |
| the same pressure, absolute | 49.700000 |
| the ratio the branch decision reads | 0.104258 |

The stated figure is gauge. The absolute figure is the same pressure with the atmospheric constant added. The ratio is that absolute pressure divided by the relieving pressure, and it is the ratio, rather than either pressure on its own, that the branch decision actually reads. So a learner who changes a back pressure and watches nothing happen has usually changed a number the decision does not read, or has moved a ratio that already sits on the flat part of the answer. The next module is entirely about which of those two it was.

## The gas route and the liquid route disagree on purpose

The gas route is the only one in this module that takes an absolute back pressure. The liquid route takes its set and back pressures in gauge and works on their difference, so the atmospheric constant never enters it at all.

AKASO, the liquid stream of this tier, shows what that looks like. It states a set pressure of 310.000000 psig and the same 10.000000 percent allowance, which puts its relieving pressure at 341.000000 psig. Against a back pressure of 40.000000 psig at the valve outlet, the differential across the valve is 301.000000 psi. Nothing was converted to absolute anywhere in that sentence, and nothing needed to be, because a difference of two gauge pressures is the same difference in absolute.

That is not an inconsistency in the engine. It is the shape of the two published equations. The gas equation needs an absolute upstream pressure because the mass flux through the throat depends on it. The liquid equation needs a pressure drop, and a drop is indifferent to the datum. Mixing the two conventions is one of the commonest ways a relief calculation goes quietly wrong, and it goes wrong by about one atmosphere, which is small enough to look like a rounding difference.

## Exercise

For ORUBIRI, write out the three renderings of the outlet pressure and say which one the branch decision reads. Then say why the liquid route can work in gauge throughout while the gas route cannot.
