# Surveys and cadence

Six pressure surveys in thirty six months is a normal surveillance programme for a small field. This lesson takes those six points, does what any engineer would do with them, and discovers that the answer is wrong in a way no amount of care with the arithmetic would have prevented. The problem is the cadence, and cadence is decided years before anyone looks at the data.

## The six surveys

Each survey is taken on the first of the month and reads the tank pressure at the end of the previous month, so every value below is a row of the model track and nothing has been invented.

| survey date | reads month | pressure (psia) |
|---|---|---|
| 2023-02-01 | 2023-01 | 2092.973311798282 |
| 2023-08-01 | 2023-07 | 2091.2352356587335 |
| 2024-02-01 | 2024-01 | 2098.2628904903004 |
| 2024-08-01 | 2024-07 | 2105.4274468043795 |
| 2025-02-01 | 2025-01 | 2112.2529397049 |
| 2025-08-01 | 2025-07 | 2118.5159449533567 |

Read that column on its own, with no model. It falls slightly, then rises steadily for two years. A reasonable engineer would report: pressure bottomed out somewhere in the first half of 2023 and has been recovering since. That is correct as far as it goes.

## What interpolation does with them

To put a pressure on every monthly period, the engine interpolates linearly between surveys onto each period's mid-month coordinate, and clamps flat outside the survey range. That last part matters immediately: the 2023-01 period sits before the first survey, so it takes the first survey's value exactly, 2092.973311798282 psia.

Between the February and August 2023 surveys the interpolation draws a straight line from 2092.973311798282 down to 2091.2352356587335. A straight line between two points is monotone. The truth between those two points is a V with its bottom at 2088.9530115439275.

So the interpolated series has its minimum at the last month before the second survey:

$$\text{interpolated minimum: } 2023\text{-}07 \text{ at } 2091.380075337029 \text{ psia}$$

against a true minimum at 2023-04 at 2088.9530115439275 psia. The cadence put the trough **three months late and 2.427063793101752 psi too high**.

## Why this is not fixable by better interpolation

A cubic spline through the same six points would also miss it, and might overshoot in the other direction. Any interpolator, of any order, reconstructs what is between samples from the samples; if a feature lives entirely between two samples and is smaller than the trend across them, no interpolator recovers it. This is not an approximation error to be reduced with a better method. It is missing information.

The Nyquist intuition applies directly: to resolve a feature you need samples at closer than half its duration. The Ekene trough is a four-month event, so it needs surveys at least every two months to be seen at all. It got one every six.

{{panel:wf-ledger-explorer}}

Compare the two amber lines. The bright one dips sharply in April 2023. The faint one slides gently down to July. Both are drawn from the same reservoir. One of them is what you would have on your desk.

## What this costs in practice

Suppose you were history matching. You have six surveys, you build a tank model, and your model predicts a trough in April that your data says is in July. You now have a three-month mismatch to explain, and there is no shortage of plausible explanations: maybe the compressibility is wrong, maybe there is a small aquifer, maybe the allocation is off. Each of those is a real hypothesis, each costs days to test, and none of them is the answer. The answer is that the data never contained the feature.

The defence is to compute, in advance, what your surveillance programme can resolve. Six-monthly surveys resolve annual trends. They do not resolve start-up transients. Saying so at the start of a project is cheap; discovering it during a history match is not.

## The clamp is a statement too

Periods outside the survey range take the nearest survey value, flat. That is the honest default: it does not extrapolate a trend past the data. But it means the first month of the record carries a value measured a month later, and the last months carry a value measured before them. If you are reading a $dp/dt$ near either end of the record, you are reading a boundary condition rather than a measurement.

## The misconception to avoid

"More surveys are always better, so this is just a budget argument." It is a resolution argument, and resolution is a design parameter with a target. Before setting a cadence, ask what the shortest feature you need to detect is. If the answer is a start-up transient of a few months, a six-monthly programme is not a slightly worse version of a monthly one; it is a programme that cannot answer the question, at any budget spent on gauge quality.

## Exercise

First, using the 2023-02 and 2023-08 survey values, compute by hand the linearly interpolated pressure at the mid-point of 2023-04 and compare it with the true track value of 2088.9530115439275 psia. Report the error in psi.

Second, propose a survey schedule of exactly eight surveys across the 36 months that would have resolved the trough, and state the largest gap in your schedule and why you placed it where you did.
