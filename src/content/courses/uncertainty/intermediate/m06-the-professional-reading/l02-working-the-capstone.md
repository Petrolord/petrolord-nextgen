# Working the capstone

A graded breakeven reading is worked in the order the engine works: beliefs, fit, base, run, percentiles, tornado. The method is shown here on ISIALA, and its numbers belong to ISIALA alone.

{{panel:ec-breakeven-explorer}}

## The beliefs and the fit

Write every belief as three numbers with their words before touching the run. On ISIALA that is capex 150 / 180 / 220 million USD, opex 16 / 20 / 26 million USD a year and efficiency 85 / 91 / 96 percent, each a 10th percentile, a median and a 90th percentile.

Then check each shape ratio against the band from 0.381966 to 0.618034, and read the fit's exact flag.

| variable | shape ratio | min | mode | max | exact |
| --- | --- | --- | --- | --- | --- |
| capex | 0.428571 | 127.2260 | 168.6738 | 252.3607 | true |
| opex | 0.400000 | 13.3201 | 17.4160 | 30.8541 | true |
| efficiency | 0.545455 | 80.1459 | 92.0352 | 99.9640 | true |

All three sit inside the band. A ratio outside it, such as the narrow opex belief's 0.100000, clamps the fit, reports exact false and puts the note in the insight. Read the `beliefs` line next: it names the three percentiles the base case and the tornado actually used, and a reading that does not say which is incomplete.

## The base and the target

Solve the base case at the beliefs' medians before sampling: on ISIALA all three fits are exact, so those are the stated medians, and the answer is 71.6277 USD per bbl to an NPV of zero. Write the target NPV beside it. The same case needs 96.5968 to reach an NPV of 100 million USD and 134.3869 to reach 250, so a percentile table quoted without its target answers an unknown question.

## The run and its count

The iteration count and the seed are part of the answer: 5000 iterations at seed 20260829 on ISIALA. Read the excluded count before any percentile. ISIALA reports 0. Any other count means the percentiles describe the survivors only.

## The percentiles and the centres

Read the sorted sample in percentile words: 10th percentile of breakeven price 62.1713, median 73.3297, 90th percentile of breakeven price 85.5912. Put the mean of 73.6242 and the base case of 71.6277 beside them, each named; on ISIALA the base is the lower. No P-label goes on a breakeven price or on any input.

## The tornado

Quote each bar with both sides and the input value behind each end. On ISIALA the order is Total CAPEX at 16.4269, Annual OPEX at 14.7308 and Prod. Efficiency at 8.7867, and efficiency's low side of -3.7306 comes from its 90th percentile, 96 percent. Then check for an open bar: an end with no breakeven below 500 USD per bbl reads null, `unreachable` reads true, and the bar sorts first.

## Before you submit

| Check | What passing looks like |
| --- | --- |
| Beliefs | Every variable as a 10th percentile, median and 90th percentile |
| Fit | Shape ratio against the band, exact flag read, beliefs line read, any note quoted |
| Base | Solved at the beliefs' medians, with its target NPV |
| Run | Iterations and seed written, excluded count read first |
| Percentiles | Percentile words only, from the sorted sample |
| Centres | Mean, median and base case named separately |
| Tornado | Both sides, the input behind each end, efficiency reversed, any open bar named |

Then the units: USD per bbl for prices, million USD for money, and percentile words wherever a price or an input is named.

## The mistake

The careful mistake is doing each calculation right in the wrong order. A reader who quotes 73.3297 as ISIALA's median, correctly, without having read the beliefs line or the excluded count, could as easily be quoting the median of a clamped belief or of a truncated sample.

## Exercise

Work ISIALA in the order given: beliefs, fit, base and target, run and count, percentiles and centres, tornado. For each step write the ISIALA number that shows you read it, and name the step at which a clamped fit, and the step at which an excluded iteration, would first become visible.
