# A flag that flips the wrong way

`glrOk` compares a requirement against what the well makes. When the requirement moves for the wrong reason, so does the flag.

{{panel:pd-remedy-explorer}}

## The two ends of the sweep

The teaching well OGUTA-2 makes 5900.0 scf/bbl and needs 248.1897322873 psia to lift its slug. At 900.0 psia of casing it needs 11338.72941173 scf/bbl and the flag reads false, on a well that can move the plunger. At 90.0 psia it needs 3339.72840586 scf/bbl and the flag reads true, on a well that cannot move it.

| Casing, psia | pressureOk | glrOk | feasible |
| --- | --- | --- | --- |
| 900.0 | true | false | false |
| 720.0 | true | false | false |
| 600.0 | true | false | false |
| 480.0 | true | false | false |
| 400.0 | true | false | false |
| 320.0 | true | true | true |
| 285.0 | true | true | true |
| 240.0 | false | true | false |
| 180.0 | false | true | false |
| 130.0 | false | true | false |
| 90.0 | false | true | false |

## The band in the middle is real

The rows at 320.0 and 285.0 psia are not the defect. The casing still clears the requirement there, by 71.81026771 psi and 36.81026771 psi, the expansion runs the right way, and the required ratio has genuinely dropped under the 5900.0 scf/bbl the well makes. `feasible` turns true over that band on a living well because less casing pressure really does mean less gas per cycle. Anyone calling the whole column an artefact has to explain those two rows, and cannot.

## Where the flag stops earning its true

Below the crossing between 285.0 and 240.0 psia the casing sits under the requirement and `glrOk` reads true for four more rows on a well with no lift left. It is not tracking gas sufficiency, it is tracking a smaller average of two pressures. The warning follows it out. At 720.0 psia the screen raises insufficientGas: "A cycle needs 9,561.2 scf of gas per barrel and the well makes 5,900.0. There is not enough gas to drive the plunger at this slug size." At 90.0 psia that warning is gone, because the requirement it fires on fell under the well.

## What this looks like on a report

Quote the required ratio beside the gas check, the pair most reports carry, and a dying well prints as an improving one: a falling requirement, a warning that goes away, a check that turns true. Only pressureOk disagrees.

## The reading that survives

Take the sign of casing minus required lift first, and read `glrOk` only where it is positive. On this well that is the seven rows from 900.0 psia down to 285.0 psia, where the flag means what its name says. Outside them it means nothing, and no field in the returned object marks the boundary.

## Exercise

Write the casing pressure at which `glrOk` first reads true, and the one at which the expansion first fails to run the right way.

Then say why those two are not the same number, and which of them decides whether the flag can be quoted.
