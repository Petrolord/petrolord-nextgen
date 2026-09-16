# Iterations that never break even

The breakeven solve searches oil prices from 0 to 500 USD per bbl. An iteration still short of the target at the top of that bracket has no breakeven to report, and the engine removes it from the sample and counts it.

{{panel:ec-breakeven-explorer}}

## Why an iteration drops out

Bisection needs a crossing. If NPV at 500 USD per bbl is still short of the target, no price in the bracket reaches it and the solve returns null. The published solve_unreachable case, a 500000 million USD target, returns null, and so does solve_zero_production_null.

ISIALA's base case earns an NPV of 1552.6414 million USD at the bracket top, and its run of 5000 iterations reports excluded 0.

## A run that loses iterations

The published mc_with_unreachable case sets capex so large that part of the sample cannot break even under 500 USD per bbl. At seed 5 over 120 iterations:

| quantity | value |
| --- | --- |
| excluded | 55 of 120 |
| 10th percentile of breakeven price | 397.3404 |
| median | 449.5729 |
| 90th percentile of breakeven price | 486.6757 |
| mean | 446.8432 |
| base case at the beliefs' medians | 498.0372 |

The percentiles are computed on the survivors; the 55 excluded iterations are not placed anywhere.

## What the survivors hide

The base case at the beliefs' medians breaks even at 498.0372, higher than the reported 90th percentile of 486.6757. On ISIALA's complete sample the base case of 71.6277 sits between the 10th percentile and the median, where a centre belongs. Here it sits past the top, because every excluded iteration was an expensive one.

So 449.5729 is the median of the iterations that had a breakeven. Put those 55 back and the median of the whole sample would be higher by an amount this run cannot tell you.

## When nothing survives

The published mc_all_unreachable_throws case sets capex so large that no iteration breaks even. The engine throws instead of reporting percentiles of an empty sample: "No iteration broke even below 500 dollars a barrel. Check the production profile, the cost ranges and the target NPV."

## What exclusion refuses

It refuses to guess: no wider bracket, no 500 substituted for a missing price, no estimate of the tail it cut off. The count printed beside the percentiles is the only evidence of the truncation.

A held draw is not an excluded one. When a fitted triangle reaches past a physical limit the draws beyond it are held at the limit and counted in `clippedDraws`: on the published mc_efficiency_past_100 case 19 of 300 efficiency draws land above 100 percent and are set to 100, with no iteration excluded. An excluded iteration leaves the sample, a clipped draw stays in it at the boundary.

The tornado meets the same edge. On mc_with_unreachable no variable has a breakeven at its adverse end, so all three high sides read null and all three bars carry `unreachable` true. Before the 2026-09-15 repair those ends were drawn at 0.0000, which is finding B1.

## The mistake

The careful mistake is reading the percentile table before the excluded count. A run that reports 397.3404, 449.5729 and 486.6757 looks like a tight, well behaved distribution. It is the distribution of the lucky part of the sample.

## Exercise

State ISIALA's excluded count and its NPV at the 500 USD per bbl bracket top. Then, for mc_with_unreachable, explain why its base case of 498.0372 sits higher than its reported 90th percentile, and say whether the median breakeven of the whole sample lies higher or lower than 449.5729.
