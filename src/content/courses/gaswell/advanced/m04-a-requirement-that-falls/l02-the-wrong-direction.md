# The wrong direction

Weaken the well and the gas it needs comes down. Everything else here follows from that sentence.

{{panel:pd-remedy-explorer}}

## The sweep, every point

The teaching well OGUTA-2 holds its required lift pressure fixed at 248.1897322873 psia, which does not move with the casing, and makes 5900.0 scf/bbl throughout. Walk the casing down.

| Casing, psia | Required gas-liquid ratio, scf/bbl | Casing less requirement, psi | Expansion right way |
| --- | --- | --- | --- |
| 900.0 | 11338.72941173 | 651.81026771 | true |
| 720.0 | 9561.17363265 | 471.81026771 | true |
| 600.0 | 8376.13644659 | 351.81026771 | true |
| 480.0 | 7191.09926054 | 231.81026771 | true |
| 400.0 | 6401.07446983 | 151.81026771 | true |
| 320.0 | 5611.04967913 | 71.81026771 | true |
| 285.0 | 5265.41383320 | 36.81026771 | true |
| 240.0 | 4821.02488843 | -8.18973229 | false |
| 180.0 | 4228.50629540 | -68.18973229 | false |
| 130.0 | 3734.74080121 | -118.18973229 | false |
| 90.0 | 3339.72840586 | -158.18973229 | false |

From 900.0 psia to 90.0 psia the requirement falls by 7999.00100588 scf/bbl, or 70.545832 percent, and every step of it runs in the flattering direction.

## Read the column in two halves

Above the crossing the fall is defensible physics: less casing pressure means less gas expanded per cycle. The mechanism is the average of the two ends, 574.09486614 psia at 900.0 psia of casing against 266.59486614 psia at 285.0 psia, and nothing is wrong with it.

Below the crossing there is no expansion. The casing sits under the pressure the cycle has to reach, and the average of a pressure and a pressure it cannot reach expands nothing. The 3339.72840586 scf/bbl at 90.0 psia is an artefact.

## Where it stops meaning what its name says

The requirement is not wrong. It stops being a requirement somewhere in the middle of the range, and the returned object says nothing about where. The fall carries through the crossing between 285.0 and 240.0 psia with no break in slope, no flag and no null, so a reader watching only the scf/bbl column cannot separate the honest half from the artefact.

## The same shape on the published case

The published plunger inputs, run with a derived well gas-liquid ratio of 4500.0 scf/bbl chosen to straddle the requirement, fall the same way: 4710.35929989 scf/bbl at 600.0 psia of casing, 4025.92806658 at 480.0, 3569.64057770 at 400.0, 2999.28121661 at 300.0, 2657.06559995 at 240.0, 2428.92185551 at 200.0, 2143.74217497 at 150.0. That case needs 225.85815561 psia, so its crossing sits between 240.0 and 200.0 psia.

## What a careful person gets wrong here

The instinct is to reach for the far end of the sweep, call the whole column broken and use none of it. That overstates the finding and is easy to disprove, because the top of the column is right. The missing guard is one line: refuse the gas number when the casing pressure is at or below the lift requirement, rather than averaging across the crossing.

## Exercise

Read the sweep row by row and mark the first casing pressure whose gas number you would not quote.

Then say what you would report in its place, and why the row at the next casing pressure up is still usable.
