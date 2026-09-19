# A closed form and a bisection

Lesson one read the SECTION 12 table as answers. This lesson reads the relation the engine solves to reach them, and the second route the digest names for finding the same answers.

{{panel:carbon-efficiency-explorer}}

## The relation, as SECTION 12 states it

SECTION 12 states the relation in words. With E the excess-air fraction, E times the oxygen demand, over the stoichiometric dry products plus E times the stoichiometric air, equals the measured fraction. Written out:

E x (oxygen demand) / (stoichiometric dry products + E x stoichiometric air) = measured dry O2 fraction

Every term but E is a figure the learner has already met. The oxygen demand is o2PerKmolFuel, 2.089500 kmol O2 per kmol of the invented Isiokpo fuel (SECTION 11). The stoichiometric air is stoichAirPerKmolFuel, 9.975652 kmol air per kmol fuel (SECTION 11). The stoichiometric dry products are the dry flue gas at no excess air, which the first row of SECTION 12 prints as 8.999152 kmol per kmol fuel. The measured fraction is the analyser's dry oxygen reading.

Read the relation as it is written. On the top, E multiplies the oxygen demand. On the bottom, E multiplies the stoichiometric air and is added to the dry products. E is the only unknown, and it appears on both sides of the fraction bar. The measured fraction is a dry fraction, which is why the bottom carries dry products and leaves the water of module one out.

## Solved in closed form

SECTION 12 says the relation is solved in closed form. The engine's excess air comes straight from the relation, one reading in and one excess air out, and the table prints it as a percent. At a reading of 5.5 percent the engine reports 32.1223 percent excess air. At 2.8 percent it reports 13.9199 percent. Those are the two readings the rest of this tier calls the heater's current state and its target.

## The same E by bisection

The same line of SECTION 12 names a second route: the oracle finds the same E by bisection on the full dry flue gas. In practice, a bisection brackets the unknown between two guesses and halves the bracket until it closes, so it reaches the answer by search and never rearranges the relation.

The digest's words mark two differences between the routes. The engine uses a closed form; the oracle searches. The engine works from the stoichiometric terms of the relation; the oracle works on the full dry flue gas. The digest's sentence is that both find the same E. That agreement is what the table rests on, and it is the reason this course quotes the table's excess air without reworking it.

## What the relation leaves out

Read the terms again: oxygen demand, stoichiometric dry products, stoichiometric air and the measured fraction. None of them is carbon monoxide. The relation holds for the engine's stated assumption of complete combustion, which lesson three reads in full. Nor does anything in the relation stop the measured fraction reaching the oxygen fraction of air itself. Lesson four reads the engine's refusal at that edge.

## Exercise

Read the first row of SECTION 12, at a reading of 0 percent, and the SECTION 11 outputs. Say which printed figure fills each of the three stoichiometric terms of the relation. Then say, from SECTION 12's own sentence, what the oracle's bisection shares with the engine's closed form and where the two routes differ.
