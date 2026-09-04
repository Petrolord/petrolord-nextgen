# A NaN caught and dropped

The ground resistance of a buried line has a floor, and below it the shape factor has no real value. What `overallU` does with that non-value is the finding.

{{panel:pd-hydrate-explorer}}

## Where the term stops existing

`burialResistance` is the conduction shape factor, acosh(2H/D) over 2 pi k, with H the burial to the centreline and D the coated outside diameter. On the published 8.625 in coated pipe half that diameter is 0.35937500 ft, and that is the floor. A burial shallower than it puts 2H/D below 1, where acosh has no real value, and the function returns NaN.

At 3.00 ft on that pipe the call returns 0.3728922550 hr ft degF/Btu per foot on a 2H/D of 8.34782609. At 0.30 ft it returns nothing: 2H/D is 0.83478261.

## The three lines that swallow it

`overallU` assembles a list of resistances. It pushes the burial term only when `Number.isFinite` says the term is a number, and three lines later refuses the whole call if any resistance in that list is not finite. The guard runs first, so the NaN never joins the list the refusal inspects, and the call succeeds one term short.

## The same trench, entered two ways

| Trench entered | Terms returned | Burial term present | U, Btu/(hr ft2 degF) |
| --- | --- | --- | --- |
| 3.0 ft | 5 | yes | 0.7455927364 |
| 0.3 ft | 4 | no | 1.3348791131 |

Both rows come back with `ok` true and no note. The second is not an approximation of the first: 1.3348791131 is the engine's own published insulated build, the pipe with no trench at all, and the swallowed answer matches it to 0.0000e+0 relative. The error in U is 79.035960 percent, and the vanished ground term carried 44.145299 percent of the correct stack.

## A larger pipe makes the typo easier

On TEACHING LINE AKASO SPUR, a teaching construct and not a published case, the coated diameter is 16.750 in and half of it is 0.69791667 ft. A 3.00 ft trench mistyped as 0.3 ft falls under that floor too: 5 terms come back against the correct 6, and U reads 0.6675904532 against the correct 0.4529728566, an error of 47.379792 percent.

## The mistake

Reading `ok` true as "the trench was modelled". Nothing in the returned object says a trench was asked for: no `burial` entry, no note, no warning. The term count is the only evidence, so a caller who does not count terms cannot tell a buried line from an exposed one.

## What it refuses

Nothing here. A layer with an unresolvable conductivity is refused, a layer whose outside diameter is not larger than its inside is refused, and a pipe with no layers is refused. A bad trench on the same pipe is not.

## Exercise

Set the published pipe with a 3.0 ft trench in the panel, read U and the term count, then re-enter the trench as 0.3 ft and read both again.

Then say what a caller would have to check to notice the difference.
