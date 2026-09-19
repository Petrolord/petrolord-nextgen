# What the oracle checks on a cargo

Every figure in this tier came from the engine. This lesson is about why anyone should believe them.

## An engine checked against itself proves nothing

A test that recomputes the engine's figure with the engine's own formula will always agree with it. If the formula is wrong, the test is wrong the same way, and the two agree on the wrong answer. Agreement is only evidence when the second computation gets there by a different road.

So the crude assay engine is held to an independent Python oracle, tools/validation/downstream/oracle_crudeassay.py, written from the rules and never from the JavaScript.

## How the oracle computes

The oracle loads a cargo in barrels and pounds, inverts the Refutas index by bisection, takes yields by segment overlap, finds T50 by bisection, and keeps the netback as a 100,000 bbl account.

A cargo in barrels and pounds. The engine converts volume shares to mass shares with a formula and blends on the fractions. The oracle instead fills a notional cargo: so many barrels of each crude, each weighing so many pounds. Mass-basis properties come from adding up the pounds of sulfur and dividing by the pounds of crude. Volume-basis properties come from adding barrels. If the engine's mass fractions were wrong, the physical inventory would disagree.

Refutas inverted by bisection. The engine inverts the viscosity index directly, with viscosityFromBlendIndex. The oracle searches for the viscosity whose index matches, by halving an interval until it closes in.

Yields by segment overlap. The engine takes a cut as the curve at the top minus the curve at the bottom. The oracle treats the curve as a set of straight segments and measures how much of each segment falls inside each cut.

T50 by bisection. The engine interpolates between the two curve points either side of 50 percent. The oracle searches the curve for the temperature at which it reaches 50.

Netback as an account. The engine computes dollars per barrel with a formula. The oracle keeps books on a 100,000 bbl cargo: it sells the products from the cargo's barrels, takes out the lost volume, pays processing and freight on the cargo, and divides at the end. A loss taken in the wrong place in the engine would not survive a set of books that tracks where every barrel went.

## What it is checked on

The oracle is run on golden cases, counted from the vendored file, and on each the two roads must meet:

| golden set | cases |
| --- | --- |
| blends | 6 |
| curve cases | 4 |
| blended default curve | 1 |

## What the oracle does not settle

An oracle confirms that the engine computes what the rules say. It cannot decide which rule is right. The held item C13, Watson K taken at T50, is a choice of basis. An oracle written to the same rule will agree with it, and that agreement says nothing about whether T50 is the right stand in for the mean average boiling point. Held items are stated as limits for exactly that reason: no test can close them.

## Exercise

Take two Kwale figures from this tier, the blend T50 of 587.3184 F and the netback of 64.9473 $/bbl, and for each say which of the oracle's methods reaches that kind of figure and how its road differs from the engine's. Then quote the three golden-set counts. Finally, say why a check that used the engine's own formula would not count as evidence.
