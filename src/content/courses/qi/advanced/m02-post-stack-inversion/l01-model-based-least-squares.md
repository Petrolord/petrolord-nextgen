# Model-based least squares

Model-based inversion finds the ln(AI) log, the log of AI (acoustic impedance), whose forward model matches the trace, while a weight holds it near the low-frequency model. At Ekene-1, inverted blind with the stated settings, it correlates with the log at 0.852881 with an AI error of 10.557858 percent. The LFM alone scores a lower error at the same well, and more iterations make the result worse.

{{video:qi-f15}}

## The problem

The engine's `modelBased` minimises ||C D m - d||^2 + eps^2 ||m - m0||^2, where C D is the forward operator of the first module, d the trace and m0 the LFM. It solves by conjugate gradients on the normal equations (CGLS), starting from m0, for the stated number of iterations or until the gradient falls to 1e-10 of its first value. The weight eps pulls the result towards the LFM. The output is ln(AI), and AI = exp(ln(AI)).

## At Ekene-1, blind

Ekene-1 is left out of its own LFM, so the inversion at the well knows nothing of its log. With eps 0.050000 and 60 iterations, all 60 iterations run and the residual RMS is 2.121830 in trace units. Round the top of the Ekene Sand:

| time ms | log AI after the high cut | LFM AI | inverted AI |
| --- | --- | --- | --- |
| 1280.000000 | 4951328.995159 | 5173957.520173 | 4686769.690526 |
| 1288.000000 | 5586150.312069 | 5168379.152075 | 5312165.284155 |
| 1296.000000 | 6044332.734122 | 5168379.152075 | 7582152.255748 |
| 1304.000000 | 6092574.823749 | 5168379.152075 | 7082384.485415 |
| 1312.000000 | 5512396.282574 | 5177480.045787 | 5850264.680558 |

The LFM is almost flat across the sand. The inversion finds the step up into the sand that the LFM lacks, and the log has it too. It then overshoots: at 1296 and 1304 ms the inverted AI is well above the log.

## The iteration count is a choice

Here the iteration count is also the regularisation. The same blind inversion at four counts, eps 0.050000, scored against the log after the high cut:

| iterations asked | iterations run | residual RMS | correlation with the log | AI error percent |
| --- | --- | --- | --- | --- |
| 20 | 20 | 3.419041 | 0.840147 | 8.300748 |
| 60 | 60 | 2.121830 | 0.852881 | 10.557858 |
| 120 | 120 | 1.731434 | 0.583443 | 19.965981 |
| 300 | 300 | 1.233454 | 0.091593 | 52.851805 |

And the weight at 300 iterations:

| eps | residual RMS | correlation with the log | AI error percent |
| --- | --- | --- | --- |
| 0.050000 | 1.233454 | 0.091593 | 52.851805 |
| 1.000000 | 1.320986 | 0.219646 | 33.801729 |
| 5.000000 | 1.769102 | 0.732457 | 13.421322 |

## Reading the two tables together

The residual falls with every extra iteration while the error at the well rises, because the solver fits the trace beyond what the stated wavelet and the scale can explain. A smaller residual is no better inversion. At 300 iterations the correlation has all but gone. A heavier weight holds the result nearer the LFM, and recovers part of the correlation at the cost of a larger residual.

Two plain facts follow for Ekene-1. The stated 60 iterations score a larger error than 20 iterations do. And the LFM alone, at 8.638086 percent, scores a lower RMS error than the stated inversion; only 20 iterations get below it on this measure. What the inversion adds is shape: a correlation of 0.852881 where the LFM alone correlates negatively. The blind-well lesson sets this out at every well.

## What a study states

The LFM and its wells, the wavelet and its scale, eps, the iterations asked and run, the residual, and the blind-well score that checks them all.

{{panel:qi-inversion-explorer}}

## Exercise

In the inversion explorer, set View to "Model-based, blocky and sparse-spike", Data to "Ekene teaching pack", Well to Ekene-1, "The well's own log" to left out, Method to model-based, "Regularisation weight eps" to 0.050000 and "Iterations" to 60. Read the residual RMS, the blind correlation and AI error, and the table row at 1296 ms. Step Iterations through 20, 120 and 300, then at 300 step eps through 1.000000 and 5.000000. Write one sentence on which setting you would state for this well, and which figure decided it.
