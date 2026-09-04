# Working the capstone

Six answers, one calibration. Get it right and the six follow; get it wrong and all six fail together.

{{panel:pd-ipr-explorer}}

## Step one: choose the family

A reservoir pressure, a bubble point inside the reading range and one test point at a composite: straight line above the bubble point, Vogel below. A bubble point of 0 psia, carried by the published straight-line, Vogel, Fetkovich and Jones cases, says the curve is one block. Coefficients rather than an index point at a fitted family, a rate in Mscf/d at gas.

## Step two: locate the test against the bubble point

This decides which block carries the test. BONNY-7's 720 stb/d at 2380 psia sits above its bubble point of 1300 psia, so line and composite both back out 2.00000000 stb/d/psi, error 0.00000000. FORCADOS-3's 2400 stb/d at 2180 psia sits below its bubble point of 2450 psia, and the line backs out 1.55844156 against 1.57194033, error -0.01349877 stb/d/psi.

## Step three: check the identity at the test

Feed the test pressure back in. The published cases return 900.000000, 700.000000, 600.000000, 1500.000000 and 1100.000000 stb/d against tests of 900, 700, 600, 1500 and 1100. BONNY-7 returns 720.000000, FORCADOS-3 2400.000000. If it is not exact, stop.

## Step four: check the identity at the bubble point

The rate at the bubble point must equal the index times the drawdown to it. BONNY-7: 2880.000000 stb/d against an undersaturated block of 2880.000000. FORCADOS-3: 1996.364220 against 1996.364220. The saturated block, the index times the bubble point over 1.8, is 1444.444444 and 2139.585450 stb/d, summing to open flows of 4324.444444 and 4135.949669 stb/d at saturated shares of 0.33401850 and 0.51731419.

## Step five: read forwards

Check which block the pressure falls in. Above the bubble point, verify by hand: BONNY-7 reads 720.000000 stb/d at 2380 psia and 2348.000000 at 1566 psia, exactly 2.00000000 stb/d/psi times drawdowns of 360.0000 and 1174.0000 psi. Below it that check misleads, since at 1174 psia the composite reads 3121.144615 stb/d where the line reads 3132.000000. The open flow is the same reading at 0 psia.

## Step six: read backwards, then forwards again

Check the rate against the open flow first: at or above it the reply is zero pressure, a boundary that looks like a solved answer. Then read the answer forwards. The published straight-line case closes the loop, 2880.000000 stb/d at 1600 psia forwards and 1600.000000 psia at 2880.0000 stb/d backwards.

## The traps

**A below-bubble test calibrated as a straight line.** It reproduces the test and still gives FORCADOS-3 an open flow of 5797.402597 stb/d against 4135.949669.

**The straight-line slope carried below the bubble point.** BONNY-7 goes from -0.50000000 psi per stb/d to -0.57666066 at 3243 stb/d and -1.57442483 at 4195.

**The open flow quoted as a deliverability.** BONNY-7 needs 649.199606 psia for 0.90000000 of it and 301.955326 psia for 0.97006680.

**An inverse read off a sampled table.** The turbulent gas case reads -12.910810 psi low at 8.8807 Mscf/d, against under a psi further up the curve.

**A rate above the open flow.** The published Fetkovich case stops at 124.766308 stb/d.

**Mixed units.** stb/d, Mscf/d, psia never psig, stb/d/psi, psi per stb/d.

## Exercise

Work BONNY-7's index, rate at the bubble point and open flow by hand from its four defining items before opening the panel. Run both identities on your own numbers, then compare: any disagreement is in the calibration, not in a reading.
