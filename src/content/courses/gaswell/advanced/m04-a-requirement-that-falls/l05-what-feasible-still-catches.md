# What feasible still catches

A wrong number does not always ship a wrong verdict. Knowing which one you have is the difference between a defect report and a panic.

{{panel:pd-remedy-explorer}}

## The verdict is a conjunction

`feasible` is `pressureOk` and `glrOk`, and nothing else. On the teaching well OGUTA-2 at 900.0 psia of casing, `pressureOk` is true, `glrOk` is false and `feasible` is false. At 90.0 psia, `pressureOk` is false, `glrOk` is true and `feasible` is false again. The gas check has inverted between those two points and the verdict has not moved, because the pressure check picked up what the gas check dropped.

That is why nothing in production is shipping a wrong feasibility today. It is also the whole of the protection: one flag covering for another, by arithmetic rather than by design.

## What is not protected

The headline number is. A required gas-liquid ratio of 3339.72840586 scf/bbl at 90.0 psia of casing goes into a report, a spreadsheet and a compressor sizing without `feasible` anywhere near it. So does `glrOk` on its own, and so does the disappearance of the insufficientGas warning, which fires on the requirement rather than on the verdict.

The band at 320.0 and 285.0 psia is the sharper case. There `pressureOk` is true, `glrOk` is true and `feasible` is true, on a well that is alive, with the casing clearing the requirement by 71.81026771 psi and 36.81026771 psi. Nothing there is an artefact. The design became feasible because the requirement fell under the 5900.0 scf/bbl the well makes, and a reader who cannot tell that band from the rows below it has no basis for trusting either.

## What the conjunction cannot see

`feasible` never compares `liquidPerDayBbl` to anything, so a cycle that carries a small fraction of what the well makes passes every check the screen performs. It never looks at the sign of casing minus required lift as a condition on the gas number. And `pressureOk` is a static comparison, because the force balance carries no friction unless friction is handed in, no velocity, no slippage past the plunger and no fallback of the slug during the rise.

## How to report it

Quote `feasible` with the two flags that built it, and quote the casing pressure and the required lift pressure beside them. On this well those are 720.0 psia against 248.1897322873 psia, which is a margin of 471.8102677127 psi. Four numbers make the verdict reproducible; the single word does not.

## Exercise

Write the truth table of `pressureOk` and `glrOk` at 900.0 psia and at 90.0 psia of casing, with `feasible` for each.

Then say which single number you would put next to `feasible` on a one line summary so that a reader could tell those two cases apart.
