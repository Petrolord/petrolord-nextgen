# A grid has a resolution

Every sampled instrument has a smallest feature it can see. For a sign change scan that feature is the window between two crossings.

{{panel:pd-node-explorer}}

## Spacing is what you get, not what you type

You set a count; the spacing follows from it and from the rate range. On FORCADOS-3, open flow 4135.949669 stb/d, the spacing runs 105.837892 stb/d at nGrid 40, 69.960640 at 60, 41.693715 at 100, 20.742099 at 200, 10.345057 at 400, 4.591410 at 900 and 1.032177 at 4000. On BONNY-7, open flow 4324.444444 stb/d, the same counts give 110.661425, 73.149077, 43.593895, 21.687415, 10.816530, 4.800662 and 1.079219 stb/d.

## The window is what has to be seen

When there are two crossings, the residual is negative only between them, and that stretch is the stable window. FORCADOS-3 at a wellhead pressure of 960 psia has crossings at 234.488087 stb/d and 2125.009203 stb/d, so its window is 1890.521117 stb/d, spanning 1203.919667 psi and 0.45709481 of its open flow.

The closed form instruments vary only that width. `analyticResidualWide` has roots 400 stb/d apart, at 800.000000 and 1200.000000 stb/d; `analyticResidualPinched` has them 20 stb/d apart, at 990.000000 and 1010.000000 stb/d. Both against an open flow of 2000.000000 stb/d.

## The comparison, and its one sided guarantee

Spacing smaller than the window forces a sample inside it, so both crossings are found. Spacing larger removes that guarantee and promises nothing either way.

| nGrid | Spacing, stb/d | Spacing over window | Status |
| --- | --- | --- | --- |
| 40 | 105.837892 | 1.829468 | flowing |
| 50 | 84.238322 | 1.456107 | dead |
| 60 | 69.960640 | 1.209310 | flowing |
| 70 | 59.821417 | 1.034047 | flowing |
| 80 | 52.249086 | 0.903155 | flowing |
| 200 | 20.742099 | 0.358539 | flowing |

That is FORCADOS-3 choked back to 1469.15 psia, where the window has closed to 57.851719 stb/d. Every row from 80 down carries the guarantee. The rows above one do not, and two of them disagree.

## The window moves with the condition

Holding the inflow curve still and raising only the wellhead pressure, FORCADOS-3's window reads 2064.445505 stb/d at 860 psia, 1890.521117 at 960, 1695.613297 at 1060, 1473.513228 at 1160, and 57.851719 stb/d at 1469.15 psia. Its minimum residual closes with it, from -509.628610 psi at 960 psia to -0.478610 psi at 1469.15 psia.

A resolution study done once does not certify the same well behind a tighter choke.

## The count is not a precision setting

Once a bracket exists the root find locates the crossing, not the grid. BONNY-7 returns 1355.714057 stb/d at nGrid 40 and 1355.714058 stb/d at 4000, reading 1355.714059 at 200 and 1355.714055 at 900 on the way. The pinched instrument returns exactly 1010.000000 stb/d at 110, 200, 400, 900 and 4000. The extra samples bought no digits. The count buys detection, and the rule guaranteeing it needs the window, which is an output of the solve.

## Exercise

Copy the choked FORCADOS-3 table: count, spacing, ratio against a window of 57.851719 stb/d, status.

Mark the first row whose ratio falls below one. State what is guaranteed at and above it, and precisely what is and is not guaranteed below it.
