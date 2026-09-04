# What ok means here

`ok` true means the function reached the end of its own code. It does not mean the inputs you supplied were used.

{{panel:pd-hydrate-explorer}}

## A dropped term you can count

`overallU` swallows a NaN trench and returns `ok` true, no note, and 4 resistance terms where 5 were asked for. U comes back 1.3348791131 against the correct 0.7455927364 Btu/(hr ft2 degF), an error of 79.035960 percent. It is detectable, barely: the `resistances` array is in the return, and counting its entries against what was handed in shows the loss.

## A dropped term you cannot

`cooldownTime` reads its two mass slots as `(contents?.massLbPerFt || 0)`. NaN is falsy in JavaScript, so a NaN mass becomes a zero mass, and the guard that follows only fires when the total heat capacity reaches zero.

| Slots NaN | ok | Result |
| --- | --- | --- |
| both | false | "Cooldown needs a heat capacity for what is cooling and a heat transfer coefficient." |
| contents only | true | 1.2806433091 hr, time constant 0.9856538758 hr, note none |
| neither | true | 4.6627248553 hr, time constant 3.5886907719 hr |

The middle row is short by -72.534444 percent, exactly the 72.534444 percent of M Cp the contents carried on that published case. The return has `ok`, `hours`, `timeConstantHr` and `stations`, and nothing else. There is no mass count to count, so no care with the returned object finds this one.

## The discipline defeated two calls later

The same module states the rule: "A NaN propagates into a refusal; a plausible wrong number does not." `pipeMassLbPerFt` with an outside diameter no larger than the inside returns a bare NaN, not a refusal object, and `contentsMassLbPerFt` does the same on a zero density or a zero bore. The consumer turns that NaN into a zero, so it never reaches a refusal.

## What ok is worth, and what to read instead

It is worth knowing the call did not throw. It is not evidence that a trench, a mass or a temperature pair was used. The note and the sign carry more. A cooldown whose target is below ambient returns `ok` true with Infinity hours and a written note, which is a good answer. One starting below its target, on a teaching line this course built, returns `ok` true with -4.6959175559 hr, no note and no error, which is not.

## The mistake

Writing a caller that branches on `ok` alone. Every result here passes that branch, and the two dropped-term cases pass every other check the returned object supports.

## Exercise

Run the published cooldown with both masses good, then with the contents mass NaN, then with both NaN, recording `ok`, the hours and the note each time.

Then say which you could catch from the return alone, and what a caller has to check before the call instead.
