# What a passing check proved

A depression check that agrees with the need to ten decimal places has usually proved that an inverse inverted, and nothing else.

{{panel:pd-hydrate-explorer}}

## What `ok` is actually reporting

The requirement returns `ok` as the injection rate's own `ok`. It is true when a rate could be computed, which means a water rate was supplied and the lean stream was stronger than the target concentration. It is not a verdict on the depression. A design that misses its subcooling and a design that hits it return the same `ok`.

## The tautology below the crossing

Sweep points on the teaching line's water rate and lean strength, only the need moving. At a 15.0 degF need the requirement sizes 17.0691859639 weight percent and reports a delivered Hammerschmidt depression of 15.0000000000 degF. At a 20.0 degF need it sizes 21.5337052221 weight percent and reports 20.0000000000 degF.

Both agree exactly, and they have to. The concentration came out of the Hammerschmidt inverse and the check ran Hammerschmidt forward on it. The two operations undo one another, so the check restates its input.

## Where the check starts saying something

At a 25.0 degF need the sized concentration is 25.5420918367 weight percent, above HAMMERSCHMIDT_RELIABLE_WT_PCT, so `basis` becomes nielsenBucklin and the delivered depression is 22.8576327543 degF against the 25.0 asked for, a shortfall of 2.1423672457 degF. That is the first row where the check ran a different relation from the one that sized, and it is the first row whose answer carries information. Nothing about the fluid changed there. Two independent relations were finally set on one concentration.

## The call that was never asked a question

Call `inhibitionRequirement` with no `subcoolingF` at all and it returns `ok: true`, `required: false`, `neededDepressionF` NaN, no `weightPct`, and the note "The fluid sits outside the hydrate region by NaN F. No inhibitor is needed to keep it there."

The guard is `!(need > 0)`, and that test is true for a NaN, so the branch written for a fluid already outside the hydrate region also catches a caller who said nothing about where the fluid is. The answer returned is a decision not to inhibit the line, with `ok` true, and the words NaN F printed into a sentence meant for a user.

## The mistake

Treating `depressionCheck` as evidence without reading `basis`. The field is only a check where `basis` differs from the relation that sized the dose. Everywhere else it is the sizing arithmetic printed twice, and a design that matches its own need to the last figure is the case that deserves the most suspicion, not the least.

## Exercise

Run the requirement at a need low enough to size under 25.0 weight percent and record `basis`, `recommendedF` and the difference from `neededDepressionF`.

Then run the same call with no subcooling supplied at all, and say what `ok` reads and what the note tells a user to do.
