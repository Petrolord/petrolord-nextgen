# The governance memo

A reserves submission is not a number with a paragraph attached. It is a set of claims, each of which somebody may later have to defend to an auditor, a partner or a regulator, sometimes years after the person who made them has left. The memo is what makes that possible, and writing it is the last technical step of the workflow rather than administration afterwards.

The test is specific. **A stranger holding your memo, the data and the tool should land on your number, not near it.** Anything failing that test is a gap, and every gap gets filled by somebody else's assumption.

## The six clauses

**1. The window, and why.** The stream, the start date, the end date, the row count, and the physical event that sets each boundary. Then the stability test, stated as an experiment with its result. "Start moved to 2024-04-01, $D_i$ unchanged at 0.00035; start moved to 2024-03-01, $D_i$ 0.00033718949081430467" is defensible. "Window chosen to capture the post-flood decline" is not: it records a conclusion and no evidence. Both boundaries need reasons, and a right-hand boundary set by a breakthrough rather than by the end of the data is a model statement that must say so.

**2. The model family, and why.** Which family, and what chose it. Say so if the choice was made by fit statistic alone, because that is a weak reason: the Professional tier showed exponential and harmonic both clearing the Excellent band on data whose truth is hyperbolic. A family chosen from physics is stronger, and the memo should say which you had.

**3. The b, and its justification.** If b was fitted, say what constrains it: time on production, how much of the rate range the window spans, whether it landed on a grid point or a search boundary. If b was assumed, borrowed or capped, name the source. Then state the sensitivity: how much the booking moves for one grid step of b. This clause exists because b is the only parameter that can multiply a booking without touching observed data, which is why SPEE's recommended evaluation practice addresses it directly and why b above one is a claim requiring justification. A fit that reports no b, because the family is exponential, should say so. It is a strength.

**4. The limit.** The economic limit is an assumption, not a measurement, and usually arrives from somebody else. Record the rate, the units, whether it is per well or per lease, where it came from, and whether the forecast was truncated at it or run to a fixed horizon. Two engineers with the same fit and different limits produce different EURs and neither is wrong.

**5. The uncertainty basis.** What distribution, over what quantity, built from what. Whether low and high are quantiles or scenario runs, and which convention the labels follow, since P90 is the low case in petroleum practice and the high case in some statistical software. If the range came from sampling, state the method and whether it is reproducible.

**6. What would change the answer.** The clause most often left out and the one auditors read first. List what would move the number materially, with a direction and, where you can, a size. This is the difference between a number that can be revised in an orderly way and one that has to be defended to the death because nobody wrote down what it depended on.

Add two lines the lower tiers already taught you: the cumulative convention, and the exclusion list.

## Worked example: Ekene-6 post-flood oil

Ekene-6 is the hard case and the honest one to write.

**Window.** Oil stream, 2024-05-01 to 2025-12-01, 20 monthly rows. Left boundary: the response ramp completed 2023-10-01 and the window is well clear of it. Right boundary: last row of history. Water broke through 2024-03-01, so every row carries water cut, rising from 0.004081632653061224 to 0.45. Stability test: moving the start later does not recover a stable constant, because the contaminating process is inside the window rather than at its edge.

**Family.** Exponential, returned by auto-select unaided. Fitted $q_i$ 58.134557068111256 stb/d, $D_i$ 0.0013275893489185155 per day, R2 0.9477350438026422, quality tier Good.

**b.** Not fitted, and deliberately so. The oil stream steepens across the window, and a hyperbolic fit would absorb that steepening into a b that would then extrapolate it as reservoir behaviour. The steepening is water cut, not drive mechanism.

**Limit.** 10 stb/d of oil, per well, applied as a truncation. Source: field convention used throughout this study.

**The number, and what it is.** EUR from this fit at that limit is 36257.11302016905 stb over 1325.8431016402847 days. **This is a forecast of the oil stream under a continuation of the observed water-cut trend, and it is not a statement about the reservoir.** The reconstructed gross liquid stream on the identical window returns $q_i$ 53.50156275634024 stb/d and $D_i$ 0.0003500000000000002 per day at R2 1.00000000000000, the field's flood decline constant recovered exactly, which the other three producers also return on their own clean windows. The oil stream is declining 3.793112425481473 times faster than that, entirely because water cut is climbing toward 45 percent.

**Uncertainty basis.** The oil forecast is dominated by the water-cut trajectory, not by the decline fit, whose residual scatter is negligible. Any credible range has to come from a range on water cut, which is out of scope here.

**What would change the answer.** The water-cut trajectory beyond the last row, which this booking extrapolates as a continuing quadratic rise and which nobody has forecast independently: the largest single exposure, and the volume is sensitive to it by a factor of order three. A change in injection rate or pattern at Ekene-2. A produced-water handling constraint, not modelled, which would truncate the forecast before the oil limit is reached. A change in the economic limit.

**Cumulative convention.** Closed-form integral of the fitted curve.

**Exclusions.** No infill, no workover, no artificial lift change, no water-handling constraint, no facility downtime, deterministic single case.

A reader who saw only the volume, 36257 stb, would assume a poor well. The memo says something different: a well the reservoir is treating well, on a stream the surface is treating badly, with the whole exposure in a curve nobody has forecast. That is a better basis for a decision than the volume alone, and it took eight short paragraphs.

## The misconception to retire: the memo is what you write when the work is done

A memo written last describes what you did. A memo's structure kept in front of you while you work changes what you do, because you notice the clause you cannot fill while there is still time to fill it. Every gap in the Ekene-6 memo above was found by trying to write a clause, not by reviewing the analysis afterwards.

## Exercise

Write the full memo, all six clauses plus the two extra lines, for Ekene-3's post-flood oil booking on the 2024-05-01 to 2025-12-01 window. Its fit returns $q_i$ 45.98862681275064 stb/d and $D_i$ 0.0008129392458294835 per day at R2 0.9345348502683186, its breakthrough is 2024-09-01, its wcMax is 0.25, and its reconstructed gross stream returns $D_i$ 0.00035000000000000005 per day at R2 1.00000000000000.

Then compare your clause 6 with the Ekene-6 one above. Ekene-3's oil decline is 2.3226835595128104 times the reservoir's rather than 3.79 times, and only 15 of its 20 rows carry water at all. State in one sentence whether that makes its booking safer or merely less obviously exposed, and give the reason.
