# The pressure test

The other burst case, and it behaves in the opposite direction.

{{panel:ct-loadcase-explorer}}

## The story

The string is run and cemented. Before drilling ahead, it is filled with mud and pumped up at surface to a test pressure, to prove it will hold.

## The columns

    inside(z)  = test pressure + mud gradient x z
    outside(z) = seawater gradient x z

Test pressure 35000000 Pa, mud 1440 kg/m3 giving 14121.576 Pa per metre, seawater 1030 kg/m3 giving 10100.8495.

## The slope

    d(differential)/dz = 14121.576 - 10100.8495 = 4020.7265 Pa per metre

POSITIVE. The differential grows with depth, so this case governs at the BOTTOM of each section.

The slope is much gentler than the gas kick's, because two liquid columns nearly cancel while a gas column against a liquid one does not.

## The numbers

| depth | inside (Pa) | outside (Pa) |
|---|---|---|
| 0 | 35000000 | 0 |
| 501.58393986 | 42083155.727115735 | 5066423.888145282 |
| 1253.959849651 | 52707889.31778933 | 12666059.720363203 |
| 2507.919699301 | 70415778.63557866 | 25332119.440726407 |

Section 1 reports its worst at 1454.59342559458 m, the deepest grid point inside it, with a safety factor of 1.5933625591003786.

Section 2 reports its worst at the shoe itself, 2507.919699301 m, with 1.2123376873879477.

## Which of the two burst cases is worse

It depends which section you ask about.

On section 1 the gas kick gives 1.6904923854809817 and the test gives 1.5933625591003786, so the TEST is worse.

On section 2 the gas kick gives 2.0422329755287567 and the test gives 1.2123376873879477, so the test is much worse.

The test wins on both, and it is the only case in the whole suite that produces a non-passing verdict.

## Why a deliberate load is the design case

Because the test pressure is chosen by an engineer and the kick pressure is chosen by the formation. It is easy to over-specify a test.

The test pressure should be enough to prove the string against its worst service load and no more. A test that exceeds the service load by a wide margin is not extra confidence, it is an extra load event that the string has to survive for no return.

## Exercise

Compute the test differential at the shoe from the table above, and divide the section 2 burst rating of 54656619.12727273 Pa by it.

Then say how much the test pressure would have to be reduced by to bring that safety factor to 1.3.
