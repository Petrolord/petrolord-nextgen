# The IRR that reports its bracket

`calculateIRR` is documented as robust with no artificial cap, and it has a bracket. When the root lies outside that bracket the function returns the bracket, and 102400 is printed where a rate should be.

{{panel:ec-comparison-explorer}}

## How the search is set up

The solver starts at 100 percent and doubles ten times, reaching 102400 percent. If the NPV is still positive at the top of that range it stops and returns 102400. Its 80 bisections run only when a sign change was found. Before any of that it has two early exits: it returns 0 when the flows never change sign, and 0 when the NPV at a rate of zero is not above zero.

## The published case

The golden pins flows of -1 in year 1 and 2000 in year 2. The engine reports 102400.0000 percent, the oracle reports no root, and the true rate is 199900 percent. Both numbers are pinned with the disagreement recorded, so the bracket cannot change quietly.

`calculateNPV` on those same flows makes the bracket visible:

| rate percent | NPV |
| --- | --- |
| 0 | 1999.0000 |
| 100 | 499.5000 |
| 1600 | 6.8616 |
| 25600 | 0.0264 |
| 102400 | 0.0009 |
| 199900 | 0.0000 |
| 400000 | -0.0001 |

At 102400 percent the NPV is 0.0009, which is small, positive, and not zero. The curve is that flat out there, and the engine has no way to tell a reader it stopped early.

## The clamp next door

The screening engine in the same package solves its IRR by Newton iteration and returns a 1000 percent clamp when the iteration runs away. Two solvers, two different methods, and the same failure: each reports the edge of its own search as an answer.

The tell is identical in both, a suspiciously round number where a rate should be: 102400 is 100 doubled ten times, and 1000 is a clamp someone typed. Neither is a root.

Roundness is the tell, not size. The published `capex_multiplier_0_7` case returns an IRR of 1095.4783 percent on a real ledger, and that is a root, not a bracket.

## The zero that is not a root

The two zero returns deserve as much attention. `irr_all_positive` has no sign change and reports 0.0000 percent with an NPV at 10 percent of 25.6198, a profitable project. `irr_npv0_negative` has flows of -100 then 90, loses money at every rate, and also reports 0.0000 percent, with an NPV at 10 percent of -16.5289. One zero means the question was ill-posed and the other means the answer is negative, and they print the same.

## What the solver refuses

It refuses to report a negative internal rate of return, refuses to search past 102400 percent, and refuses to distinguish its three special returns from a computed root. Nothing in the return value says which path produced it.

## The mistake

The careful mistake is sanity-checking an IRR by its magnitude. A reader who rejects 102400 percent as absurd and accepts 0.0000 percent as break-even has caught the harmless case and swallowed the dangerous one. Check the NPV at a rate of zero first: positive and no sign change gives one kind of zero, negative gives the other.

## Exercise

State the NPV of the published bracket case at 102400 percent and at 199900 percent, and which of the two the engine reports as the IRR. Then name the two situations in which the bisection returns 0, with a published case for each.
