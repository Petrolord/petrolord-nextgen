# A refusal that names another number

Three refusals in `liftAdvisor.js` print a figure the caller never supplied, and the first of them then advises changing it. The sentences are the part a planner pastes into a report, so the figure inside them travels.

{{panel:pd-reading-explorer}}

## The pressure nobody set

`designGasLift` reads `num(facility?.injectionPsig, 900)` and prints that value. Derived, with no facility object at all: ok = false, reason "At 900 psig the injection line never gets below the flowing gradient, so there is nowhere to put gas in. More surface pressure, or a lighter design rate."

With `injectionPsig` 250 the same sentence names 250, which is a real input. With the string "high" it names 900 again, because `num` falls back in silence: `num("high", 900) = 900`, `num(true, 900) = 900`, `num(null, 900) = 900`. `parseFloat` also eats a unit suffix, so `num("900 psig", 0) = 900` and a string is accepted as a number with no note.

A successful placement carries the same default forward into its equipment line, 500 Mscf/d injected at 4,180 ft, 900 psig at surface. Those runs use this course's own stub chain and are teaching numbers, not published designs.

## The open flow that was never read

`runDesignPass` reads `model.ipr.qmax ?? rateAtPwf(model.ipr, 0)`.

| qmax | Result against a target of 5000 stb/d |
| --- | --- |
| 2480 | refused on the well's own figure |
| undefined | refused, and the sentence names an open flow of 0 stb/d |
| null | refused, and the sentence names an open flow of 0 stb/d |
| 0 | refused, and the sentence names an open flow of 0 stb/d |
| NaN | not refused: the pass runs, 4 chains |

`??` catches only null and undefined, so a NaN open flow passes through and `targetRate >= NaN` is false. The refusal that fires prints a limit from a fallback; the refusal that would have mattered does not fire at all.

## A rate reported as NaN

A rod ladder whose produced rates are all unknown refuses with `achievedBpd` = NaN against a target of 800: "The largest unit tried (1.25 in plunger, 48 in stroke at 6 spm) makes NaN bbl/d against a target of 800." The rung it names is the first one on the ladder, because the comparison that picks the closest rung is false for NaN on both sides.

## Units, since the sentences mix them

`injectionPsig` is gauge. `psigToPsia(900) = 914.700000` psia, and `psigToPsia(undefined) = NaN`. `ATM_PSIA` is 14.7 and is the one place gauge meets absolute in this domain.

## The mistake

Quoting the refusal as a finding about the well. "More surface pressure" is advice about a pressure the caller never chose, and an open flow of 0 stb/d in a refusal is the absence of an inflow model rather than a well that cannot flow.

## Exercise

Run the gas lift refusal with no facility, then with `injectionPsig` 250, and write down both sentences.

Then say which words in the first one a reader could not tell came from the code rather than from the well.
