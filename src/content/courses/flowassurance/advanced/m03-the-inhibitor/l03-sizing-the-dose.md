# Sizing the dose

Turn the depression relation around and it gives a concentration for a wanted number of degF. It gives one for any number of degF, which is the part that has to be handled.

{{panel:pd-hydrate-explorer}}

## The inverse, and why it never fails

Solving the depression relation for the weight percent gives W equal to 100 times the depression times the molecular weight, over K plus the depression times the molecular weight. Both parts grow with the depression, so the result climbs toward 100 weight percent and never reaches it. No subcooling is large enough to break the arithmetic.

That is why the module carries an explicit ceiling. `MAX_PRACTICAL_WT_PCT` is 70.0 weight percent, and its header says why: the inverse will return a concentration for a subcooling nothing can kill, and past the ceiling the aqueous phase is barely water. Deep subcooling is solved with insulation, heating or displacing the line, not by pushing a concentration further.

## What the chain does in order

`inhibitionRequirement` adds `safetyMarginF` to `subcoolingF` and calls that the need. On TEACHING LINE AKASO SPUR, a construct this course designed for itself and not a published case, that is a shut-in subcooling of 36.00 degF plus a margin of 5.00 degF, so `neededDepressionF` is 41.00 degF.

It sizes the weight percent from the need with the Hammerschmidt inverse, using the molecular weight and the K of the chosen inhibitor. For methanol on that need it returns `ok` true, `required` true and a `weightPct` of 36.0035520084 weight percent. It then calls `depression` at the concentration it just sized, which returns `hammerschmidtF`, `nielsenBucklinF`, `recommendedF`, `basis`, `reliable`, `spreadF` and a note. Last, it calls `injectionRate`.

The returned object carries `neededDepressionF`, `weightPct`, `depressionCheck` and `rate`. The top-level `ok` is the rate's `ok`, nothing more.

## Three ways out before a rate exists

A need that is not positive returns `required` false and a note saying no inhibitor is needed. A weight percent outside 0 to 100 returns an error saying no concentration of that fluid gives that depression. One above the ceiling returns an error quoting the concentration to one decimal, naming the ceiling, and saying the problem is thermal rather than one of concentration.

The one decimal is deliberate. At whole percent a concentration just over the limit prints as the limit itself, and the sentence would name a ceiling the number appears to satisfy.

## The mistake

Sizing on the flowing subcooling. The dose that matters is the one that holds while the line is stopped and the boundary has moved out: 71.00 degF flowing against 78.00 degF packed up, with the fluid colder at the same time.

## What it refuses

`weightPctForDepression` returns a bare NaN for a depression or a molecular weight that is not positive. The ceiling refusal is the only one in the chain that names a way out.

## Exercise

Size a dose for 36.00 degF plus a 5.00 degF margin, and note the concentration, the basis and the `reliable` flag that come back.

Then raise the subcooling until the call refuses, and say what it names as the alternative.
