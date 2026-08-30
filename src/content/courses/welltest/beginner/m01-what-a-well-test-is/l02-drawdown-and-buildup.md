# Drawdown and buildup

The same well, the same rock, two tests, and one of them is much easier to run well.

## The drawdown

Shut a well in until its pressure is flat, then open it at a constant rate and record the pressure as it falls. That is a drawdown test, and it is the form every equation in well testing is derived for.

The drawdown this course uses runs for 100 hours at 450 stb/d. The pressure starts at the initial 4800 psia and has fallen 278.8313109793389 psi by the end of it.

Its virtue is that it is the natural experiment. Its defect is that it requires a constant rate for the whole test, and rates are not constant. Chokes are adjusted, separators trip, the well cleans up. Every wobble in the rate puts a wobble in the pressure that the analysis will read as reservoir behaviour.

## The buildup

Produce the well for a while, then shut it in and record the pressure as it recovers. That is a buildup, and it is what is actually run in the field, because the rate during a shut-in is exactly zero and stays there without anyone's help.

The buildup this course uses follows 36 hours of production at 450 stb/d. At the instant of shut-in the flowing pressure is 4530.771773811249 psia, and over the next 79.43282347242814 hours the pressure climbs back most of the way to where it started.

The price of that clean rate is that a buildup is not a fresh experiment. The reservoir remembers the 36 hours of production. The pressure that recovers during the shut-in is the sum of a well that is still notionally producing and an imaginary well injecting at the same rate from the moment of shut-in, which is what superposition means and what module 4 is about.

## The same well twice

Both fixtures come from the same reservoir with the same planted properties.

| property | value |
|---|---|
| permeability | 85 mD |
| skin | +6.5 |
| wellbore storage | 0.015 bbl/psi |
| porosity | 0.18 |
| viscosity | 0.9 cp |
| total compressibility | 1.2e-5 /psi |
| wellbore radius | 0.354 ft |
| net pay | 45 ft |
| formation volume factor | 1.25 rb/stb |
| rate | 450 stb/d |
| initial pressure | 4800 psia |

Those are the answers. A synthetic fixture with known answers is the only honest way to teach interpretation, because it lets you hold what an analysis reports against what is actually there. A real test has no such column, which is precisely why interpretation errors on real data are invisible.

## They do not give the same answer

Analysed carefully, over the late data where both are behaving, the drawdown reports a permeability about 1.2 percent above the buildup's on the same well. Neither is wrong. They are two different measurements of the same quantity, taken at different times, with different amounts of interference from the wellbore, and 1.2 percent is a small and honest disagreement.

The number worth carrying away is not 1.2. It is that the disagreement exists at all, and that it is larger than the number of digits most reports quote a permeability to.

## Which one you run

In practice, buildups. The rate control is free, the well is already producing so the test costs only deferred production, and the analysis is well understood. Drawdowns are run when a shut-in is impossible or when the well is new and has never flowed.

There is a real cost to a buildup that a drawdown does not have. A shut-in produces nothing. A long buildup on a good well is expensive, and the pressure to cut a test short is the reason so many tests end before the data that would have answered the question.

## The misconception to avoid

"A buildup and a drawdown are the same test run backwards." They are not symmetric. The buildup carries the whole production history before it, and the drawdown does not; the buildup's time axis is a transform of shut-in time rather than shut-in time itself; and the pressure a buildup extrapolates to is not the initial pressure of the reservoir once the reservoir has been produced. Module 4 takes those apart one at a time.

## Exercise

The drawdown fixture ends at 100 hours and the buildup fixture ends after 79.43282347242814 hours of shut-in following 36 hours of production.

State which of the two has seen further into the reservoir, and say what you would need to know to answer that properly rather than by counting hours.
