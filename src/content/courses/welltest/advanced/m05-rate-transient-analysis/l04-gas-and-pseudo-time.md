# Gas and pseudo-time

The gas version needs a second transform, and it is not a small correction.

{{panel:wt-regression-explorer}}

## Two changes from the oil case

**The pressure axis** becomes pseudo-pressure, for the reasons module 4 gave.

**The time axis** becomes material-balance PSEUDO-time, because gas compressibility and viscosity change so much during depletion that the storage term is not constant.

    tca = (mu ct)_i / q(t)  x  integral of q / (mu(pbar) ct(pbar)) dtau

The integrand weights each moment of production by how the fluid properties at the AVERAGE reservoir pressure at that moment compare against their initial values.

## The circularity

Read the definition again. It needs the average reservoir pressure as a function of time.

The average pressure comes from the gas material balance:

    p/z = (p/z)_i (1 - Gp/G)

which needs G, the gas in place, which is what the analysis is trying to find.

So the calculation is circular, and it is resolved by iteration. This is the Mattar and Anderson dynamic material balance:

1. Guess G.
2. Compute the average pressure at each time from the material balance.
3. Compute pseudo-time from the fluid properties at those pressures.
4. Regress and get a new G.
5. Repeat until G stops moving.

The engine's `flowingMaterialBalanceGas` implements exactly this, seeding G at five times the produced-to-date, inverting p/z by bisection at each step, and stopping when G changes by less than one part in a million.

## The result

On the 300-day fixture it converges in 15 iterations to a gas in place about two tenths of a percent below the planted 20 million Mscf, at an r squared of 0.9999993779658716.

Fifteen iterations, each of which inverts p/z at every one of 300 rows by 60 bisection steps. That is 270 thousand bisections and it runs in well under a second, which is worth knowing when deciding whether to put it in a panel.

## The size of the correction

At the last row, material-balance pseudo-time is 999.0185673584442 days where plain material-balance time is 1966.5396150880294 days.

The ratio is 0.5080083613335826. Pseudo-time is HALF material-balance time by the end of the record.

That is not a refinement. Using te instead of tca on this well would put the slope out by a factor approaching two and the gas in place with it.

The reason is that mu ct for gas falls substantially as the reservoir depletes. Early production, at high pressure where mu ct is small relative to its initial value, is weighted differently from late production. Over a 300-day depletion from 4800 psia the accumulated difference is a factor of two.

## When the correction is small

At low drawdown, or over a short record, or at low pressure where mu ct is flatter, the correction is minor and te is adequate.

The way to find out is to compute both and take the ratio, which the engine gives you for free. A ratio near 1 says the correction did not matter here. A ratio of 0.5 says it decided the answer.

## The same warning as everywhere

G is inversely proportional to the initial mu ct, which comes from correlations or a laboratory PVT. The engine defaults to Papay for z and Lee-Gonzalez-Eakin for viscosity and lets a laboratory table override them.

A gas in place from correlations carries the correlations' error. A laboratory PVT is worth having, and the engine's default of preferring a supplied table over its own correlations is the right one.

## The misconception to avoid

"Pseudo-time is a small correction that can be skipped for a first pass." On this fixture it is a factor of two by the end of the record. Whether it can be skipped is a question with a numeric answer that takes one extra run to get, and guessing at it is not worth the two seconds saved.

## Exercise

The pseudo-time ratio at the last row is 0.5080083613335826.

State what the gas in place would come out as if te were used instead of tca, to the nearest order of magnitude, and say in which direction the error goes. Then say what you would check first if a gas RTA returned an implausibly large G.
