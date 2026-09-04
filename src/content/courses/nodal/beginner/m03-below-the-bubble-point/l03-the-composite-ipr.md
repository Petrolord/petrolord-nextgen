# The composite IPR

Standing's construction: a straight line while the fluid is undersaturated, a Vogel curve once it is not, and one productivity index carrying both halves.

{{panel:pd-ipr-explorer}}

## The construction

Most oil wells are undersaturated in the bulk of the drainage area and saturated at the sandface, where the drawdown is spent. A straight line ignores the second region and Vogel the first; Standing's 1970 construction joins them. Above the bubble point the rate is the index times the drawdown; below it, the extra rate is Vogel's shape scaled by the index times the bubble point over 1.8, with the flowing pressure divided by the bubble point rather than the reservoir pressure.

## Two blocks that add up

| | BONNY-7 | FORCADOS-3 |
| --- | --- | --- |
| Reservoir pressure | 2740 psia | 3720 psia |
| Bubble point | 1300 psia | 2450 psia |
| Productivity index | 2.00000000 stb/d/psi | 1.57194033 stb/d/psi |
| Undersaturated block | 2880.000000 stb/d | 1996.364220 stb/d |
| Saturated block | 1444.444444 stb/d | 2139.585450 stb/d |
| Absolute open flow | 4324.444444 stb/d | 4135.949669 stb/d |
| Saturated share | 0.33401850 | 0.51731419 |

Each pair of blocks sums to the printed open flow. The saturated block depends only on the index and the bubble point, never on the reservoir pressure, which is why FORCADOS-3 has the smaller index and still the larger saturated block.

## The published case

Reservoir pressure 3000 psia, bubble point 2000 psia, index 1.2 stb/d/psi, open flow 2533.333333 stb/d, 40 rows.

| Flowing pressure, psia | Rate, stb/d |
| --- | --- |
| 3000 | 0.000000 |
| 2700 | 360.000000 |
| 2250 | 900.000000 |
| 1500 | 1733.333333 |
| 750 | 2283.333333 |
| 300 | 2469.333333 |
| 0 | 2533.333333 |

The slope is minus 0.83333333 psi per stb/d at 126.6667 and 506.6667 stb/d, then minus 0.85470451 at 1266.6667, minus 1.33843239 at 2026.6667 and minus 2.55747877 at 2406.6667 stb/d. Constant at minus one over 1.2 stb/d/psi, then climbing: a composite reveals itself in that pattern and no other.

## Calibration, and the part people get wrong

If the test sits at or above the bubble point the index is the test rate over the test drawdown: against 3000 psia with a bubble point of 2000 psia, 600 stb/d at 2500 psia returns 1.20000000 stb/d/psi.

If it sits below, the rate is the index times both blocks evaluated down to the test pressure, still linear in the index, so the engine divides by that factor instead: 1500 stb/d at 1400 psia on the same reservoir returns 0.98684211 stb/d/psi and an open flow of 2083.333333 stb/d. Only one of those paths divides by drawdown, which is why a below-bubble test read as a straight line returns an index that is not the well's.

## What it refuses

It needs a bubble point and will not find one. Given 0 psia it becomes a straight line all the way down, which on BONNY-7 is 5480.000000 stb/d of open flow instead of 4324.444444. Given one at or above the reservoir pressure it clamps and becomes Vogel. Both look healthy and neither warns.

Below the join it carries no physics, only Vogel's shape. And it holds the index through depletion, so the published case at 2400 psia returns 1813.333333 stb/d on the assumption that a well producing below its bubble point has not lost permeability to oil.

## Exercise

Confirm that each well's two blocks sum to its printed open flow.

Then put the two saturated shares side by side and say what property of each well decides which is larger.
