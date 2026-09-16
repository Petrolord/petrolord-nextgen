# Uniform around the base

The Scenario Builder's Monte Carlo draws one factor for each uncertain variable in each iteration, uniformly around the base case, and applies that factor to every year.

{{panel:ec-risk-explorer}}

## The rule

A variable with a range r takes one draw per iteration, uniform on [1 - r, 1 + r]. The app's settings give price, capex and reserves a range of plus or minus 20 percent, so each factor lands between 0.8 and 1.2. A base value v in any year becomes v times its variable's factor, so a 2027 value is drawn from [v(1 - r), v(1 + r)] and every later year moves by the same proportion.

The draws come from mulberry32(20260829) in a fixed order within each iteration: reserves, price, capex. A falsy range consumes no draw. The generator's first draw is 0.936239, which puts the reserves factor of the first iteration near the top of its interval, and ISIALA's 2027 oil volume of 1606000.0000 bbl is scaled by it along with all twenty years.

## A uniform range is not a belief

A uniform range has no mode. A value just inside the upper edge is exactly as likely as the base value, and a value just outside is impossible. The Breakeven Analyzer instead fits a triangular through three stated percentiles: ISIALA's capex belief of 150 / 180 / 220 becomes 127.2260 / 168.6738 / 252.3607. That shape has a peak and tails past the stated 10th and 90th percentiles. Plus or minus 20 percent is neither a percentile nor a believed endpoint, only a width.

## One factor for a whole life

An iteration's price factor multiplies 2027 and 2046 by the same number, so a profile and a price deck keep their shape. A factor held for a whole life is what a scenario does, and the spread is wide:

| quantity | NPV, million USD |
| --- | --- |
| scenario Low | -57.8151 |
| Monte Carlo lowest of 1000 | -46.1564 |
| Low case P90 | 15.6063 |
| Best case P50 | 78.5315 |
| High case P10 | 152.0653 |
| Monte Carlo highest of 1000 | 208.9685 |
| scenario High | 226.0140 |

The two scenarios still sit outside the sample at both ends. They move price, production and variable opex to 0.8 times base and capex and fixed opex to 1.2 times in one direction, while the three sampled factors are drawn independently and fixed opex is never drawn at all.

## The mistake

The careful mistake is reading plus or minus 20 percent on the inputs as plus or minus 20 percent on the answer. A price factor of 0.8 takes a fifth of the revenue away while royalty, tax, fixed opex and capex follow their own rules, and the low tail of a case worth 81.0464 million USD reaches -46.1564. A range on an input says nothing directly about the width of the outcome.

## What it refuses

It holds no correlation between its three variables and no shape inside a range. It never samples fixed opex, royalty, tax or the discount rate, and one factor covers the whole life, so it cannot model a price that falls only in the later years.

## Exercise

Write the interval ISIALA's 2027 oil volume is drawn from at the app's settings, in the form [v(1 - r), v(1 + r)] with v and r filled in. Say which variable takes the first draw of an iteration and roughly where a draw of 0.936239 lands in its interval. Then explain why the scenario Low of -57.8151 still sits below the lowest sampled NPV of -46.1564.
