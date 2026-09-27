# The binding constraint and its ties

{{panel:marine-voyage-calculator}}

Of all the constraints on a voyage, one is closest to its limit. It is the one that would stop the vessel taking more cargo first, and it is the one a planner watches. The engine names it the binding constraint. This lesson shows how the engine chooses it, including what happens when two constraints are equally full.

## The highest utilisation binds

In this course "binding" has one meaning: the constraint with the highest utilisation, by the stated tie rule. On the Ekene PSV milk run that is deck area, at 0.900000. The engine says so in its reasons:

> the binding constraint is deck area: 540 m2 of 600 m2 (90%)

The reason prints the load and capacity as short figures and the utilisation as a percentage. The field the course quotes is the utilisation beside it, 0.900000.

Binding does not mean full. A voyage whose binding constraint sits at 0.5 has room on every limit; the binding one is simply where that room runs out first.

## When two constraints tie

Two utilisations tie when they agree to twelve significant digits. The engine then names the first of the tied constraints in its stated order: deck area, deck load, deadweight, then the tanks in the order of the products. On the small teaching case "A binding tie", deck area and deck load share a utilisation of 0.500000, and the engine names deck area:

> the binding constraint is deck area: 25 m2 of 50 m2 (50%)

That is a reading the engine states, and the course names its alternative: the tie could as well go to the last of the tied constraints, which would name deck load here. Neither is a law of shipping. A tie means both limits are equally close, and a planner facing one should watch both; the engine needs one name, so it states how it picks.

| case | binding | utilisation |
| --- | --- | --- |
| Ekene PSV milk run, rainy season | deck area | 0.900000 |
| A binding tie | deck area | 0.500000 |
| A tank that binds | tank d | 0.900000 |
| A load exactly at capacity | deck area | 1.000000 |

## Why twelve digits

Decimal inputs are held as binary fractions, so two figures meant to be equal can differ in their last digit. On the small case "A decimal sum at capacity", deck cargoes of 0.1 and 0.2 m2 fill a 0.3 m2 deck, and the double sum comes out a hair above 0.3. Compared at twelve significant digits, it is exactly at capacity, and the voyage is feasible at a utilisation of 1.000000. Without the rule, rounding noise would decide the answer.

## Exercise

In the voyage and fleet calculator, set View to "The voyage plan" and start from each of the four cases in the table above in turn: "Ekene PSV milk run, rainy season", "A binding tie", "A tank that binds" and "A load exactly at capacity". For each, find the binding constraint and its utilisation in the voyage table and read the reason. On "A binding tie", find the two constraints that share the top utilisation in the constraints table and confirm that the engine named the first in the stated order.
