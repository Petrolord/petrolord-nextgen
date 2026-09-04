# The takeoff

The programme ends with a materials count and a step list, and with a verdict that a good surface phase cannot buy.

{{panel:wi-pa-explorer}}

## What the takeoff counts

The published case returns a takeoff with `plugCount: 4` and a slurry total that comes to the same volume as P1 alone, because P1 is the only plug given a geometry. The other three appear in `undesignedPlugs`: P2 reservoir secondary, P3 intermediate and S1 surface plug.

That list is the useful part. The takeoff does not guess. A plug with no hole size, no stinger and no excess contributes nothing to the cement total and is named instead, so you can see how much of the programme has a volume behind it. Step 1 reads "slurry 6.2 m3 balanced" for P1 and the other steps carry no volume at all.

## The phase ordering

Three phases, and the order is the order of the work.

Phase 1 sets the barrier plugs deepest first, sorted on their bases: P1 at 2380 to 2520, then P2 at 2350 to 2510, then P3 at 1700 to 1810. Each step ends with the same instruction to verify by tag and pressure test.

Phase 2 is a single step: cut and retrieve casing above the deepest intermediate barrier where annular cement is absent.

Phase 3 sets the surface plug and then removes the wellhead and cuts the casings below surface or mudline to the regulatory depth. Six steps in total for the published case.

## A passing surface plug does not save the well

The published programme returns `pass: false`. Its surface plug S1, at 0 to 60 m MD against a 50 m requirement, returns `pass: true`.

Both are in the same result, and the sweep on surface plug length makes the point.

| Surface plug length, m | Surface plug pass | Programme pass |
| --- | --- | --- |
| 40 | no | no |
| 48 | no | no |
| 50 | yes | no |
| 60 | yes | no |
| 80 | yes | no |

Lengthening the surface plug changes one row of the answer and nothing else. The programme fails because the intermediate gas stringer has P3 as its only qualifying barrier and no secondary, and no amount of cement at surface addresses a zone at 1800 m MD.

Adding a backing plug does. With P4 intermediate secondary at 1580 to 1700 m MD the intermediate zone gains a secondary, the programme passes, the plug count becomes 5 and the step list grows to 7. The slurry total does not move, because P4 was given no geometry either.

## Exercise

1. Run the published case and read the takeoff, then confirm which three plugs are undesigned.
2. Sweep the surface plug length and watch the programme verdict refuse to follow it.
3. Add a backing plug over the intermediate zone and check both the verdict and the new step count.
