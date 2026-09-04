# The gas-oil ratio is per barrel of oil

`derivePoint` forms a gas-oil ratio as gas times 1000 divided by oil, in scf/stb. The 1000 is scf per Mscf and it is the only unit conversion in `surveillance.js`.

{{panel:pd-ledger-explorer}}

## Oil is the denominator and water is not in the expression

Water appears nowhere in a gas-oil ratio, so a well that waters out while making the same gas per barrel of oil has a flat gas-oil ratio and a climbing watercut. A derived sweep on constructed rows puts both quantities side by side.

| oil, stb | water, stb | gas, Mscf | watercut | gor, scf/stb |
| --- | --- | --- | --- | --- |
| 900.0 | 100.0 | 450.0 | 0.100000000000 | 500.000000000 |
| 500.0 | 500.0 | 250.0 | 0.500000000000 | 500.000000000 |
| 100.0 | 900.0 | 300.0 | 0.900000000000 | 3000.000000000 |
| 400.0 | 0.0 | 200.0 | 0.000000000000 | 500.000000000 |

Those are constructed demonstration rows and not published cases. The third row is the one to read twice. Its gas is 300.0 Mscf against 450.0 Mscf on the first row, so the gas went down, and its gas-oil ratio is 3000.000000000 scf/stb against 500.000000000 scf/stb, because the oil fell much further than the gas did.

## Why a ratio moves when nothing new is happening

That is the mechanism behind a gas-oil ratio exception. On the teaching well OGUTA-2, which was invented for this course and is neither real nor published, an ordinary recent day books 1008.000000 stb of oil, 312.000000 stb of water and 585.000000 Mscf of gas, giving a watercut of 0.236363636364 and a gas-oil ratio of 580.357142857143 scf/stb. A collapsed recent day on the same well books 82.000000 stb of oil, 231.000000 stb of water and 141.000000 Mscf of gas, giving a watercut of 0.738019169329 and a gas-oil ratio of 1719.512195121951 scf/stb.

Between the two day shapes the oil falls by a factor of 12.292682926829, the water by 1.350649350649 and the gas by 4.148936170213, so the gas-oil ratio rises by 2.962851782364. Nothing about the reservoir has been established by that arithmetic. The ratio rose because the denominator collapsed faster than the numerator.

## The hours column does not move it either

Both terms are volumes off the same row and neither is scaled to twenty-four hours, so the hours do not enter. The published rows of 2025-01-01 and 2025-01-02 carry 24.000000 h and 12.000000 h and book 800.000000 stb and 500.000000 stb of oil, and both return a `gor` of 500.000000000 scf/stb. The golden commits that same value on three of its five rows and null on the two that booked no oil.

## The mistake

Reading a gas-oil ratio rise as a statement about gas. Across those two constructed day shapes the ratio rose by 2.962851782364 while the gas was falling. The quantity that moved most was the oil, and the ratio cannot tell you which term did it.

## Exercise

Build a row of 100.0 stb of oil, 900.0 stb of water and 300.0 Mscf of gas in the panel and record the gas-oil ratio and the watercut.

Then change only the water to 0.0 stb and say which of the two numbers moved and which did not.
