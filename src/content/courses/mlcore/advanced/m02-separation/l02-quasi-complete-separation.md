# Quasi-complete separation

{{panel:ml-diagnose-explorer}}

Complete separation needs a hyperplane that puts every row strictly on its own class side. Quasi-complete separation is the weaker case: a hyperplane puts every row on its own side or exactly on the plane, with rows of both classes sitting on it. The coefficients are still infinite, and the engine still refuses. This lesson works the engine's own small case.

| x | y |
| --- | --- |
| 1 | 0 |
| 2 | 0 |
| 3 | 0 |
| 3 | 1 |
| 4 | 1 |
| 5 | 1 |

## Reading the six rows

The case has one feature and six rows: X [[1],[2],[3],[3],[4],[5]] and y [0,0,0,1,1,1]. Put a threshold at x = 3. Every row below it is class 0, every row above it is class 1, and the two rows exactly at 3 carry one label each. The two rows at 3 share an x and differ in label, so no threshold divides the classes strictly. The threshold at 3 puts every row on its own side or on the plane: the quasi-complete case.

## Why the coefficients are still infinite

Think of the fit as a steepness and a boundary. Fix the boundary at x = 3 and make the curve steeper. The four rows off the plane move toward their own labels, and their contribution to the likelihood keeps rising. The two rows on the plane sit at a probability of one half whatever the steepness, so their contribution stays where it is. The likelihood keeps rising, has no largest value, and the slope that would maximise it is infinite.

## The engine's words

The engine refuses the six rows before any iteration:

> y is quasi-completely separated by a linear combination of the features (every row lies on or on its own class side of a hyperplane, some exactly on it), so the maximum likelihood coefficients are infinite: add an L2 penalty (l2 > 0) or remove the separating feature

It names `y` and offers the same two remedies as for complete separation. The two messages differ in the clause that says where the rows lie. Quote the one the engine returns: they are different findings.

## Where quasi-complete separation comes from

Ties are the way it arises in the case above: rows of both classes share one value of a feature that otherwise divides them, and any feature whose values repeat can hold such a tie. In the Ekene pay rule, a sample is pay when PHIC is at least 0.16, so a PHIC of exactly 0.16 is pay; the rule itself decides every tie, and on the high-RT rows the engine finds complete separation. Your own labels may not decide their ties so cleanly.

## Exercise

Open the panel on the separation view and replace the table with the six rows above, the feature named x and the target y, l2 at 0. Run it and copy the kind of separation the engine names. Then change the second row at x = 3 to class 0, run it again, and write down which kind the engine reports. Last, change it back to class 1, move it to a value between 3 and 4, and write down the kind once more.
