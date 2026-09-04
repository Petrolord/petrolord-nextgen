# Comparing wells with it

Absolute open flow conflates the quality of the completion with the energy in the reservoir. Ranking on it ranks a mixture.

{{panel:pd-ipr-explorer}}

## Two wells that look alike

| Quantity | BONNY-7 | FORCADOS-3 |
| --- | --- | --- |
| Open flow, stb/d | 4324.444444 | 4135.949669 |
| Reservoir pressure, psia | 2740 | 3720 |
| Bubble point, psia | 1300 | 2450 |
| Productivity index, stb/d/psi | 2.00000000 | 1.57194033 |
| Rate at the bubble point, stb/d | 2880.000000 | 1996.364220 |
| Saturated share of open flow | 0.33401850 | 0.51731419 |
| Production test | 720 stb/d at 2380 psia | 2400 stb/d at 2180 psia |
| Test drawdown, psi | 360.0000 | 1540.0000 |
| Test below the bubble point | no | yes |

BONNY-7 has the better completion, FORCADOS-3 the stronger reservoir, and the near-equal open flows are those two differences cancelling.

## What each quantity belongs to

The index belongs to the completion and the rock: it is what one psi of drawdown buys, so BONNY-7's straight-line slope is -0.50000000 psi per stb/d, held at 216, 649, 1297, 1946 and 2595 stb/d, and FORCADOS-3's is -0.63615646, held at 207, 620, 1241 and 1861 stb/d. The reservoir pressure belongs to the reservoir and says how much drawdown is available. The bubble point belongs to the fluid and says how much of the range is straight. The open flow belongs to all three at once.

## Three conditions for a fair comparison

The same family. BONNY-7's one test gives 5480.000000, 3233.247201 and 4324.444444 stb/d; FORCADOS-3's gives 5797.402597, 3946.987127 and 4135.949669 stb/d.

The same reservoir pressure, or both stated. The published straight line reads 5760.000000 stb/d at 3200 psia and 3600.000000 at 2000 psia.

The same fluid and units. The published gas cases sit at 13289.296319, 5596.679697 and 88.806747 Mscf/d, and the published Fetkovich case at 124.766308 stb/d has a higher reservoir pressure, 3500 psia, than the straight-line case's 3200 psia with an open flow of 5760.000000 stb/d.

## The fourth condition, about the test

An index is the well's index only if the test sat above the bubble point. BONNY-7 is the controlled case: straight line and composite both back out 2.00000000 stb/d/psi, error 0.00000000. FORCADOS-3 is corrupted: 1.55844156 against 1.57194033, error -0.01349877 stb/d/psi, reading 1656.623377 stb/d against 1670.972571 at 2657 psia.

## Compare at the same fraction instead

| Fraction | BONNY-7, psia | Fraction | FORCADOS-3, psia |
| --- | --- | --- | --- |
| 0.04994861 | 2632.000000 | 0.05004896 | 3588.315612 |
| 0.45000000 | 1767.000000 | 0.44995712 | 2536.112823 |
| 0.60007708 | 1442.500000 | 0.60010401 | 2121.481541 |
| 0.74992292 | 1105.576792 | 0.75000913 | 1622.391151 |
| 0.97006680 | 301.955326 | 0.97003115 | 420.700695 |

The fraction says how hard a well is worked. The pressure says whether the working point is reachable.

## Exercise

Build both wells and record the index, reservoir pressure, bubble point, saturated share and open flow for each.

Decide which has the better completion and which the stronger reservoir, and say why the open flows settle neither.
