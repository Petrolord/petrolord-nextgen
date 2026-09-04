# Water cut and density

Water makes a column heavier and makes it lighten more slowly. The second effect is the one that catches people.

{{panel:pd-vlp-explorer}}

## Both constants move

The gravity term is a gravity constant over one plus rate divided by a lightening constant, and water raises both. The gravity constant, because water is heavier than oil. The lightening constant, because a column lightens when solution gas comes out and occupies pipe volume, and water carries none. A wetter stream has less gas per barrel of liquid at every rate, so it needs MORE rate to shed the same proportion of its weight.

## The sweep that behaves oddly

| BONNY-7 lightening constant, stb/d | Minimum rate, stb/d | Minimum bhp, psia |
| --- | --- | --- |
| 187.50 | 561.403918 | 1159.998265 |
| 375.00 | 627.069742 | 1476.243252 |
| 750.00 | 646.294276 | 1842.168146 |
| 1500.00 | 581.492476 | 2185.774480 |

The pressure column is monotone. The rate column climbs to 646.294276 stb/d and turns back to 581.492476 stb/d. FORCADOS-3 does the same: lightening constants of 410.00, 820.00, 1640.00 and 3280.00 stb/d give minimum rates of 1607.279673, 1843.619418, 1987.819717 and 1928.734780 stb/d, over pressures climbing from 1912.118951 to 3460.135276 psia.

Raising the constant makes the gravity term larger at every rate, which lifts the bottom monotonically. It also makes the decline gentler, spreading the same fall over a wider band of rate, and where the rising friction term offsets that gentler decline is not monotone. The pressure is the honest signal here.

## The consequence that kills wells

BONNY-7's dead column of 2570 psia sits 170 psi below its 2740 psia reservoir pressure. FORCADOS-3's 4310 psia sits 590 psi above its 3720 psia. Water cut walks a well from the first condition to the second and the consequence is not gradual: on one side the well recovers from a shut in by itself, on the other it needs an intervention every time it stops.

The diagnosis flips with it. BONNY-7's gravity share is 0.12887773 at 1924.38 stb/d, friction having overtaken gravity at 968.379388 stb/d. FORCADOS-3's is still 0.23582291 at 4135.95 stb/d, its crossover out at 2718.933018 stb/d. A friction problem becomes a weight problem, and tubing size stops being the answer.

## What it refuses, and it is a large refusal

The instrument has no water cut input. It has two constants, and nothing here maps a per cent onto them. That mapping needs densities at conditions, a solution gas oil ratio, formation volume factors and a holdup correlation, which are exactly what the module declines to own.

So you cannot ask this curve what happens at a stated water cut. You can ask what a heavier, slower lightening column does, then say what mapped one onto the other.

## The mistake

The two point sweep. Take BONNY-7's lightening constant at 187.50 and 750.00 stb/d and the threshold rises. Take 750.00 and 1500.00 and it falls. Both differences are correct and both stories wrong, because the lever turns inside the range.

## Exercise

In the panel, sweep BONNY-7's lightening constant across 187.50, 375.00, 750.00 and 1500.00 stb/d, recording the minimum rate and pressure at each.

Then say which column is monotone, and what a designer would have concluded from the first and third rows alone.
