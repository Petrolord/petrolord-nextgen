# Warnings versus tiers

The engine's own source draws the line in the comment sitting directly beneath the tier declaration: tier describes the method, warnings describe the run. The Professional tier taught you that sentence. This lesson makes you believe it, with three runs where the two channels come apart, and then asks what is left to protect you when they do.

## What the run channel actually checks

Open the oil path and count the things that can put a string into the warnings array.

Aquifer default notes, when the engine substituted a default for a parameter you did not supply. A closure check, which fires when the drive index sum at the final timestep differs from 1 by more than 0.05. A fit check, which fires below 0.95. Correlation and viscosity range checks, which fire when your conditions fall outside what the correlation authors sampled. And structural checks on a laboratory PVT table, which is where Ekene's five familiar sort complaints come from.

That is the list. Now read it for what it does not contain.

Nothing checks the sign of the oil in place. Nothing checks the magnitude of the oil in place against anything at all. Nothing compares your answer to a volumetric booking, because the engine has never been shown one. There is a single physical plausibility check in the whole file, the one that fires when a pot aquifer regression returns a negative water volume, and it lives on the gas path. The oil path has no equivalent.

So the run channel watches whether the model agrees with itself, and whether your inputs are inside the domains of the curve fits. It does not watch whether the answer is possible.

## Run one: identical warnings, opposite answers

Take the Ekene tank as committed and run it twice, once with the aquifer model set to none and once with a pot aquifer forced on. The first returns 12139208.1074968 stb. The second returns -516449.043355256 stb, a negative volume of oil.

Compare the warnings arrays. They are not merely similar. They are identical, string for string, five entries each, all five being the lab table sort complaints that were already there. The diff is empty.

Every check passed on the impossible run, and they passed for reasons worth understanding. The fit statistic is 0.999485673716372, comfortably above 0.95. The drive index sum is 1.0000000000000004, which misses one by 4.440892098500626e-16 against a threshold of 0.05. No aquifer default was substituted. No correlation was consulted, so no range check applied.

The closure in particular is not luck. The pot aquifer plot regresses $F/E_t$ against $\Delta p / E_t$. On this fixture both $E_o$ and $E_{fw}$ are exactly linear in the drawdown, so $E_t$ is too, and $\Delta p / E_t$ is therefore constant: 42153.0479896247 at the first survey and 42153.0479896241 at the sixth. The vertical coordinate is the F over Et column, which you already know is constant. So all six points sit on top of each other at a single location in that plane, and the regression is fitting a line to one point. It has no leverage at all. The intercept it reports, which is the oil in place, is decided by scatter in the twelfth significant figure, and whatever pair of numbers comes out satisfies the row equation identically. The closure check is confirming that a degenerate fit is self consistent, which it always will be.

And the tier? It changes, because the code path changed, from a `benchmark_verified` with no stated tolerance to a `benchmark_verified` with a tolerance of 0.13 percent. The impossible run advertises the tighter claim.

## Run two: no warnings at all

The Ekene case at least had five strings on the screen to make you uneasy. This one has none.

Take the Dake Exercise 9.2 performance history, the strong water drive case from module 2, and run it with the aquifer model set to none. The engine returns an oil in place of 532.588241588393 MMSTB, a fit statistic of 0.999317934436751, a drive index sum of 1.00423320400820, a mechanism of depletion drive, and a warnings array of length zero. The tier is `benchmark_verified`.

Dake's own answer for that reservoir is 312 MMSTB. The Carter-Tracy run with the finite aquifer gives 307.221409553720 MMSTB. Ignoring the aquifer has inflated the booking by 225.366832034673 MMSTB, which is 73.3564865684486 percent above the Carter-Tracy answer and 70.7013594834593 percent above Dake's.

Two hundred and twenty five million barrels of oil that are not there, on a silent screen, under a benchmark verified badge. Nothing is wrong with the arithmetic. It answered the question it was asked, which was what oil in place would explain this pressure history if no water were arriving.

## Run three: the channel working

For contrast, break the same case a different way. Keep Carter-Tracy but remove the radius ratio, so the engine uses the infinite acting solution on an aquifer that is finite. Oil in place 156.177551848366 MMSTB, cumulative influx 148.248060002236 MMrb against the finite answer of 88.0645883139400 MMrb, and one warning: the fit statistic has fallen to 0.863239485188882 and the engine says so.

Compare the two failures. Run two is 220 MMSTB above the truth and silent. Run three is 156 MMSTB below it and noisy. The channel did not speak up because run three was worse. It spoke up because run three fitted worse. Those are different things, and confusing them is the single most expensive habit in this subject.

## A quiet run is not a validated run

Put the two channels side by side and the summary is uncomfortable. The tier is a lookup on the code path and cannot see your data. The warnings are a set of self consistency and domain checks that cannot see your reservoir. Between them they do not contain a single test that the answer is physically possible, let alone right.

What does catch run two? Three things, all of them yours and none of them automated. The volumetric reconciliation, because a booking from a map and a contact would not be near 533 MMSTB. The level of the F over Et column, because on the Dake history it does not hold constant. And the counterfactual pair, because running the case both with and without the aquifer puts 225 MMSTB of difference on one page and forces you to say which one you believe and why.

## Worked example: triaging the three runs

| Run | Oil in place | Fit statistic | Index sum | Warnings | Tier |
|---|---|---|---|---|---|
| Ekene, no aquifer | 12139208.1074968 stb | 1.00000000000000 | 1.00000000000000 | 5 sort complaints | benchmark_verified, no tolerance |
| Ekene, pot forced | -516449.043355256 stb | 0.999485673716372 | 1.0000000000000004 | the same 5 | benchmark_verified, 0.13 percent |
| Dake, aquifer ignored | 532.588241588393 MMSTB | 0.999317934436751 | 1.00423320400820 | none | benchmark_verified, no tolerance |

A reviewer reading only the right hand three columns would rank these three runs as equally healthy, and would probably rank the second and third above the first on the strength of the warning count. Every column in that table is true. The table is still useless, because none of its columns is about the answer.

## Exercise

Build the missing column. Take the table above and add one headed "evidence the answer is possible", then fill it for each row using only things the engine does not compute for you.

For the first row you have the volumetric booking. For the second you have the sign. For the third you have neither yet, so say what you would go and get, name it specifically, and estimate what it would cost in time.

Then write the rule you will apply from now on, in one sentence, in the form "before I quote an oil in place I will always". If your sentence mentions a fit statistic, a warning count or a tier, rewrite it.
