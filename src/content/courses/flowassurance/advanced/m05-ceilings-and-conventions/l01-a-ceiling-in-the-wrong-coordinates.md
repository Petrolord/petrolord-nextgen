# A ceiling in the wrong coordinates

MAX_PRACTICAL_WT_PCT is 70.0 weight percent, and the requirement compares against it the concentration the Hammerschmidt inverse produced. The refusal boundary is drawn in the coordinates of the relation the module says over-predicts up there.

{{panel:pd-hydrate-explorer}}

## What the constant is guarding

The Hammerschmidt inverse is asymptotic to 100 weight percent, so it returns a concentration for any subcooling somebody names. The ceiling exists to stop that: past roughly 70.0 weight percent the aqueous phase is barely water, and deep subcooling is a thermal problem rather than a concentration one. That is a good reason for a limit. It is not a reason to measure the limit with the relation that is wrong there.

## The same ceiling read twice

At 70.0 weight percent methanol the engine's two relations read 170.0478568456 degF and 108.6168490752 degF. The engine will accept and design for a stated subcooling anywhere up to the higher of those. The chemistry it checks against tops out at the lower. For MEG the same ceiling gives a Hammerschmidt depression of 87.7772407497 degF, and `depression` reports `nielsenBucklinF` as null there as everywhere.

## The column the refusal does not read

Sweep points on the shipped engine, methanol, each row reading its own `depressionCheck` back. These are sweep points and not published cases.

| Subcooling, degF | Design, weight percent | Delivered, degF | Short by, degF | Return |
| --- | --- | --- | --- | --- |
| 60.0 | 45.1543195377 | 49.3036127042 | 10.6963872958 | accepted |
| 80.0 | 52.3294271365 | 62.2995393132 | 17.7004606868 | accepted |
| 100.0 | 57.8443762412 | 74.1102214571 | 25.8897785429 | accepted |
| 120.0 | 62.2156056830 | 84.9338967494 | 35.0661032506 | accepted |
| 140.0 | 65.7654751781 | 94.9228840490 | 45.0771159510 | accepted |
| 160.0 | 68.7056048463 | 104.1967543907 | 55.8032456093 | accepted |
| 170.0 | 69.9940887712 | 108.5961499505 | 61.4038500495 | accepted |
| 180.0 | 71.1806669793 | 112.8510939641 | 67.1489060359 | refused |

The shortfall column is monotone in the need and `ok` is true on every row but the last. The last row is not refused for being short by the most. It is refused for asking 71.1806669793 weight percent. Sort the table by shortfall and the refusal stays exactly where it is.

## The mistake

Treating the ceiling as the point past which the answer stops being usable. The deepest subcooling 70.0 weight percent methanol can kill on the relation the module prefers is 108.6168490752 degF, and the requirement accepts needs of 120.0, 140.0, 160.0 and 170.0 degF past it, each with `ok: true` and each carrying its own evidence in `depressionCheck`. The refusal fires when a concentration crosses a line, never when a depression does.

## What it refuses

The requirement refuses on concentration and on nothing else. No path through this function fails because the check came back short, at any need, on any fluid, and no note marks a row as short. The one column that would catch it is computed and left unread.

## Exercise

Read both relations at 70.0 weight percent methanol and write down the width of the band between them.

Then find the largest subcooling this function still accepts, and say how far past that band the accepted rows already run.
