# What the oracle checks on a cargo

Every figure in this tier came from the engine. This lesson reads what the digest says the engine is held to.

## An independent oracle

The digest names it: "The crude assay engine is held to an independent Python oracle, tools/validation/downstream/oracle_crudeassay.py, written from the rules and not from the JavaScript." Two things in that sentence matter to a reader. The oracle is independent of the engine's code. And what it is written from is the rules, the same rules this tier has quoted section by section.

## How the oracle computes

The digest lists the oracle's methods in one sentence: "It loads a cargo in barrels and pounds, inverts the Refutas index by bisection, takes yields by segment overlap, finds T50 by bisection and keeps the netback as a 100,000 bbl account." Each can be set beside the engine's own route, as this course has quoted it.

A cargo in barrels and pounds. The engine converts volume shares to mass shares once, with resolveFractions: each crude's mass share is its volume share times its specific gravity, over the sum of those products. The oracle loads a cargo in barrels and pounds.

Refutas inverted by bisection. The engine inverts the index with viscosityFromBlendIndex, and the Associate tier printed its round trip. The oracle inverts it by bisection.

Yields by segment overlap. The engine takes a cut's yield as the curve at the cut's upper bound minus the curve at its lower bound. The oracle takes yields by segment overlap.

T50 by bisection. The engine reads T50 as temperatureAtVolumePercent(curve, 50), interpolated between the curve's points. The oracle finds T50 by bisection.

Netback as an account. The engine computes the netback per barrel of crude with the formula module 4 quoted. The oracle keeps the netback as a 100,000 bbl account.

On every one of the five, the two routes are named differently in the digest. The digest does not describe the oracle's routes past those words, so this lesson does not describe them either.

## What it is checked on

The oracle is run on golden cases, counted from the vendored file:

| golden set | cases |
| --- | --- |
| blends | 6 |
| curve cases | 4 |
| blended default curve | 1 |

## What the oracle is written to

The oracle is written from the rules. The held item C13, Watson K taken at T50, is one of those rules as the studio states it, and the digest calls T50 "a SCREENING basis: the strict basis is the mean average boiling point, which the studio does not compute". The digest teaches C13 as a stated limit, and this course does too. The golden-set counts say what the oracle was run on. They say nothing about which basis for K is right.

## Exercise

Take two Kwale figures from this tier, the blend T50 of 587.3184 F and the netback of 64.9473 $/bbl. For each, quote the oracle's method from the digest and the engine's route from this tier. Then quote the three golden-set counts, and quote the digest's words for what the oracle is written from.
