# Every range at zero

Set the price, capex and reserves ranges to zero and the Scenario Builder's Monte Carlo has nothing to sample. The engine as published threw an error on that input (finding S4); as repaired in EC3-0 it returns the deterministic answer in every slot.

{{panel:ec-risk-explorer}}

## What the run returns now

ISIALA with every range at zero, 30 iterations:

| quantity | NPV, million USD |
| --- | --- |
| Low case P90, engine key `p10` | 81.0464 |
| Best case P50, engine key `p50` | 81.0464 |
| High case P10, engine key `p90` | 81.0464 |
| emv | 81.0464 |
| deterministic NPV | 81.0464 |

Every iteration is the base case, so the three cases, the mean and the deterministic NPV agree to the fourth decimal, and bin 0 of the histogram holds 30 of 30 iterations.

## Why it used to throw

The histogram splits the sample into 20 bins between the lowest and the highest NPV. With no spread, the lowest and the highest are both 81.0464 and the bin width is zero. The published code divided each value's distance from the lowest by that width, got zero over zero, which is not a number, looked up a bin at that index, found nothing, and threw a TypeError when it tried to count into it. The repair tests the width first and sends every value to the first bin when the width is zero.

## What the zero run is for

It is the Monte Carlo's negative control. A sampler handed no uncertainty must give back the deterministic NPV, 81.0464 on ISIALA, and nothing else. If the three cases ever split on a zero run, the sampler is inventing spread, and no case it reports on a real run can be believed. Run it once before trusting the tool on a new field.

## What it refuses

A zero run is not a field without uncertainty. The Scenario Builder never samples opex, royalty or tax at any setting, so zero on the three ranges it does sample only means its own knobs are still. The decline, both halves of opex and the 20 year quick life sit exactly where they were typed whatever the ranges say.

## The mistake

The careful mistake is reading three equal cases as a confident project. A Low case P90 of 81.0464 here does not say ISIALA has a 90 percent chance of being worth at least that much; it says no range was given. The second mistake belongs to anyone who met the old error: nudging a range to a tiny value so the run finishes. That produces a histogram and three cases that look like a distribution and describe a range nobody believes.

## Exercise

Run ISIALA with every range at zero for 30 iterations and state the Low, Best and High case NPVs with their P-labels and engine keys, the emv, and the bin that holds the sample. Then explain in two sentences why the published engine threw on this input and which finding records it.
