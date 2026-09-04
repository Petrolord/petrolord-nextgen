# Drawdown

Two pressures, one subtraction, and more wrong answers in this subject than any other quantity.

{{panel:pd-ipr-explorer}}

## The subtraction

Drawdown is the reservoir pressure minus the flowing bottomhole pressure, in psi. Both must be absolute, psia and never psig, and both at the same datum. The engine checks neither: a gauge pressure against an absolute one is wrong by an atmosphere, and a gauge at the wrong depth adds a column of fluid that has nothing to do with the flow.

Only the flowing pressure is measured during the test. The reservoir pressure comes from a build-up, a shut-in survey or a model, and is an average over a drainage area, so a small drawdown test measures rate precisely and index fragilely. BONNY-7's test drawdown is 360 psi out of 2740 psia; FORCADOS-3's is 1540 psi out of 3720 psia.

## The identity, where it holds

BONNY-7's index is 2.00000000 stb/d/psi.

| Flowing pressure, psia | Drawdown, psi | Rate, stb/d |
| --- | --- | --- |
| 2380 | 360.0000 | 720.000000 |
| 1566 | 1174.0000 | 2348.000000 |
| 1300 | 1440.0000 | 2880.000000 |
| 1174 | 1566.0000 | 3121.144615 |
| 391 | 2349.0000 | 4133.021538 |

Every row above the bubble point of 1300 psia is the index times the drawdown and closes by hand: 1440 psi at 2.00000000 stb/d/psi is the printed 2880.000000 stb/d. The rows at 1566 psi and 2349 psi do not close, being below the bubble point.

## The budget

The largest drawdown available is the reservoir pressure itself. BONNY-7's budget of 2740 psi reaches 4324.444444 stb/d; FORCADOS-3's larger budget of 3720 psi reaches only 4135.949669 stb/d, because its index is 1.57194033 stb/d/psi and its bubble point of 2450 psia leaves only the first 1270 psi in the linear region, buying 1996.364220 stb/d.

Nobody spends the budget: BONNY-7 runs at a drawdown of 677.857029 psi and FORCADOS-3 at 1353.090778 psi, because the tubing sets the operating point.

It also shrinks. Holding the index, the published straight line case at 2000 psia gives an open flow of 3600.000000 stb/d and a pressure at half the open flow of 1000.000000 psia; the composite at 2400 psia gives 1813.333333 stb/d and 1610.779407 psia. Neither says when.

## The mistake worth naming

Quoting a rate and a drawdown that were never measured together: a rate from one month against a survey from another, subtracted from a reservoir pressure estimated in between, gives an index to eight figures describing no state the well was in.

The second is swapping the flowing pressure for the drawdown. On BONNY-7 a flowing pressure of 1566 psia is a drawdown of 1174 psi, and 1174 psia is a drawdown of 1566 psi. Both pairs are on the well's own curve, giving 2348.000000 and 3121.144615 stb/d, and neither looks wrong.

## What drawdown will not tell you

Whether the well tolerates it. No sand criterion, no coning limit, no damage model. And not how long, because every rate on the curve is a steady statement at one reservoir pressure.

## Exercise

Confirm by hand that BONNY-7's rate at 360 psi and 1440 psi of drawdown is the index times the drawdown, and say why 2349 psi does not close.

Then write FORCADOS-3's budget and its operating drawdown side by side, and say what stops it spending the rest.
