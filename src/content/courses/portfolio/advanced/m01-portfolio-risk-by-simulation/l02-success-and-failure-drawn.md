# Success and failure drawn

The repaired risk summary does not sum bells. In every iteration it decides whether each funded project succeeded, and only then draws what the success was worth or books the fail cost.

{{panel:ec-governance-explorer}}

## Two draws per project

Each project gets two standard normal drivers per iteration, z1 and z2. The project succeeds when normalCDF(z1) is below pos. On success its value is npv_p50 plus the success spread times z2; on failure its value is minus fail_cost, with no spread at all. The portfolio value for the iteration is the sum across the funded projects.

The success spread is the normal-equivalent standard deviation from the entered percentiles, (npv_p10 - npv_p90) / 2.5631. For OK-3 that is (700.0000 - 210.0000) / 2.5631 = 191.1747.

| project | npv_p50 | npv_p10 | npv_p90 | pos | fail_cost | success spread | mixture sd |
| --- | --- | --- | --- | --- | --- | --- | --- |
| OK-1 | 95.0000 | 150.0000 | 50.0000 | 0.950000 | 10.0000 | 39.0153 | 44.3821 |
| OK-3 | 420.0000 | 700.0000 | 210.0000 | 0.250000 | 85.0000 | 191.1747 | 238.6507 |
| OK-4 | 210.0000 | 320.0000 | 120.0000 | 0.800000 | 40.0000 | 78.0305 | 121.9467 |
| OK-5 | 38.0000 | 55.0000 | 22.0000 | 1.000000 | 0.0000 | 12.8750 | 12.8750 |

## Which spread is drawn

Two spread columns sit side by side and only one is drawn. The success spread scales z2. The mixture sd, which folds the failure lump into one number, is never drawn: it feeds the closed-form stdDev. OK-5 has pos 1.000000 and no fail cost, so its two columns agree at 12.8750. OK-3 fails often, and its mixture sd of 238.6507 is larger than its success spread of 191.1747 because the gap between 420.0000 and minus 85.0000 adds to the variance.

## What a failure is worth

A failure is a single number. OK-3 fails with chance 0.750000 and then books a loss of 85.0000 in every such iteration, never a little more or less. That is why the simulated distribution of a small portfolio has spikes: the 450.0000 set, OK-1 + OK-3 + OK-4, carries OK-3's failure in about three iterations out of four, and the successes of OK-1 and OK-4 spread the rest around it.

A success is not a guaranteed gain either. It is a normal draw around npv_p50, so a wide success spread can occasionally put a success below zero.

## What the draw refuses

The chance of success and the size of the success are driven by different normals, so a project never succeeds "big" because it barely succeeded. The success spread is symmetric. OK-3's npv_p10 of 700.0000 sits further above its npv_p50 of 420.0000 than its npv_p90 of 210.0000 sits below it, and a normal spread keeps only the width, discarding that skew. OK-5 draws both normals in every iteration although its success is certain.

## The mistake

The mistake is to read npv_p90 as a project's low case. OK-3's npv_p90 of 210.0000 is a percentile of the success case only. Its real downside is a loss of 85.0000, reached with chance 0.750000, and that risked EMV is 0.250000 x 420.0000 - 0.750000 x 85.0000 = 41.2500. A simulation that drew OK-3 from its success percentiles alone would never book a failure, and would report a portfolio far safer than the one funded.

## Exercise

For OK-3, state its pos, npv_p50, fail_cost and success spread, and show the success spread from its npv_p10 and npv_p90. Then describe what one iteration books for OK-3 on a failure and on a success, and say which of its two spread columns the simulation draws.
