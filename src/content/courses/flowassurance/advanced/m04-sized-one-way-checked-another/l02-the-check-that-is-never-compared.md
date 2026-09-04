# The check that is never compared

`inhibitionRequirement` picks a concentration with the Hammerschmidt inverse, checks it with Nielsen-Bucklin, and returns both numbers in one object without ever setting one against the other.

{{panel:pd-hydrate-explorer}}

## The three steps inside one call

`weightPctForDepression` inverts Hammerschmidt to get the concentration. `depression` is then called on that concentration, finds it above HAMMERSCHMIDT_RELIABLE_WT_PCT, and reports Nielsen-Bucklin as `recommendedF`. Nothing reads `recommendedF` back against `neededDepressionF`. The returned `ok` is the injection rate's `ok`, so it says a rate could be computed, not that the dose works.

## One call on a teaching line

TEACHING LINE AKASO SPUR is a construct this course invented, not a published case and never checked by any oracle. It asks for 36.00 degF of shut-in subcooling plus a 5.00 degF margin, so `neededDepressionF` is 41.00 degF.

| Field returned | Value |
| --- | --- |
| `ok` | true |
| `required` | true |
| `weightPct` | 36.0035520084 weight percent |
| `depressionCheck.hammerschmidtF` | 41.0000000000 degF |
| `depressionCheck.nielsenBucklinF` | 35.6195882812 degF |
| `depressionCheck.recommendedF` | 35.6195882812 degF |
| `depressionCheck.basis` | nielsenBucklin |
| `error` | none |

The sized depression is 41.0000000000 degF and the delivered depression is 35.6195882812 degF, and both sit in the same object, one field apart.

## What the shortfall is worth

Against what was asked for, the design falls 5.3804117188 degF short, which is 13.122955 percent of the need. Against the bare subcooling with the whole 5.00 degF safety margin thrown away, it still falls 0.3804117188 degF short. So the margin is gone and then some. A line dosed to that design is inside the hydrate region on the module's own preferred relation, with `ok: true` and `error` reading none on the return, and the number that says so printed beside the number that hides it.

## What the honest dose costs

Inverting Nielsen-Bucklin for the same 41.00 degF gives 39.8251780234 weight percent methanol, which is 3.8216260150 weight percent more than the engine sized and whose Nielsen-Bucklin depression is 41.0000000000 degF. On the teaching line's 420.0 bbl/d of produced water at 96.00 weight percent lean methanol, the engine's dose injects 307.7753251096 bbl/d against a stream density of 6.6696000000 lb/gal, and the honest dose injects 362.0655724349 bbl/d: 54.2902473253 bbl/d more, or 17.639571 percent. That is the size of the finding in the only currency a facility cares about, a pump and a tank.

## The mistake

Taking `weightPct` and stopping, because the field is called `weightPct` and it is the thing a dosing sheet asks for. The concentration is the answer to the question the inverse was asked, and the inverse was asked with the relation the module says over-predicts up there. `depressionCheck` is not a formality attached to a finished design. It is a second opinion the function collected and then ignored, and reading it takes one line of comparison that the caller, not the module, has to write. Nothing in the return marks that line as missing.

## Exercise

Put a subcooling and a margin through the requirement on methanol and record `neededDepressionF`, `weightPct` and every field of `depressionCheck`.

Then subtract `recommendedF` from `neededDepressionF` yourself, and say what value of `ok` a return should carry when that difference is positive.
