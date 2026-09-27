# Reading a voyage plan

{{panel:marine-voyage-calculator}}

A voyage plan returns a lot of figures, and they come in a fixed order. Reading them in that order, and knowing what each rests on, is the core skill of this tier. This lesson walks the whole Ekene PSV milk run plan from top to bottom, then fixes the words the course uses to describe it.

## The order the engine returns

The engine returns, for each voyage: the legs and their calm hours; the hours by activity after the weather factor; the days; the fuel by activity and its cost; the load, as deck area, deck weight, bulk by product and the deadweight; each constraint with its load, capacity and utilisation; the binding constraint; the overloaded ones; and the reasons. Totals over the voyages follow, and a basis names the rules applied and their sources.

## The Ekene milk run, read in order

| part of the plan | what the engine returns |
| --- | --- |
| route | 206.000000 NM over five legs, EKA, EKJ, EKB, EKF |
| hours | 22.472727 sailing, 12.000000 port, 27.600000 field, 62.072727 in all |
| days | 2.586364 |
| fuel | 11.236364 t sailing, 0.360000 t port, 8.280000 t field, 19.876364 t in all |
| fuel cost | 17292.436364 |
| load | 540.000000 m2 and 635.000000 t on deck, deadweight 2390.000000 t |
| binding | deck area at 0.900000 |
| feasible | true, nothing overloaded |

The reasons hold one line:

> the binding constraint is deck area: 540 m2 of 600 m2 (90%)

## What each figure rests on

A figure quoted without its inputs is only half a figure. The hours rest on the route, the speed of 11 knots, the port and field hours and the weather factor of 1.2 on sailing and field time. The fuel rests on those hours and the three burns. The fuel cost rests on the fuel and the price of 870 a tonne. The utilisations rest on the stated capacities, including the usable fraction of 0.75. The binding constraint rests on all of the utilisations and the tie rule. When you report a figure, report what it rests on beside it.

## The words, as this course uses them

Four words in a voyage plan carry a narrower meaning here than in conversation.

A **voyage** is one sailing from the base and back. A milk run is one voyage through every stop; a dedicated voyage serves one installation.

A **capacity** is always of a named constraint: deck area times the usable fraction, deck load, deadweight or a named tank.

A **utilisation** is always of a named thing, here a constraint, and it is the load over the capacity.

**Binding** names the constraint with the highest utilisation, by the stated tie rule. It carries no legal meaning.

## Reading with care

Three habits help. Read the feasible flag before anything else, because an overloaded voyage still returns hours and fuel. Read the binding constraint with its utilisation, since a binding constraint at 0.5 and one at 0.99 tell very different stories. And read the basis, which states the rules in the engine's own words.

## Exercise

In the voyage and fleet calculator, set View to "The voyage plan" and Start from to "Ekene PSV milk run, rainy season". Read the plan in the order above and check every row of the table against the panel. Then write a five-line summary of the voyage in your own words: route and time, fuel and cost, load, binding constraint, and verdict, each with the inputs it rests on. Repeat the summary for "Ekene AHTS milk run" and compare the two verdicts.
