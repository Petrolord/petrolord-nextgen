# Blocky and sparse-spike inversion

Model-based least squares asks only that the result fit the trace and stay near the LFM. Two variants ask for a sharper earth: blocky inversion, which prefers few large steps in ln(AI), the log of AI (acoustic impedance), and sparse-spike inversion, which prefers few non-zero reflection coefficients. At Ekene-1, blind, sparse-spike scores the best of the three methods and blocky the worst.

## Blocky

The engine runs `modelBased` with blocky on. It adds an iteratively reweighted total variation term, epsTV^2 sum of w_i (m_(i+1) - m_i)^2 with w_i = 1 / sqrt((m_(i+1) - m_i)^2 + beta^2), and re-solves over the stated outer loops. Each loop sets the weights from the last result, so a large step earns a small weight and costs little, and many small steps cost more than few large ones. The course states epsTV 0.020000 and 4 outer loops, and leaves beta at 0.001, an engine argument. The strength of the preference is epsTV, and a study states it with the loops.

## Sparse-spike

`sparseSpike` works on the reflectivity. FISTA (Beck and Teboulle 2009) solves min 1/2 ||C r - d||^2 + lambda ||r||_1 for a sparse reflectivity r (`fistaReflectivity`). The engine integrates r to a relative ln(AI), m_(i+1) = m_(i-1) + 2 r_i, levelling each of the two interleaved chains to its mean, and takes the low frequencies from the LFM through a moving-average crossover at 8 Hz.

## Lambda sets the sparsity, on the trace's scale

The penalty lambda ||r||_1 is weighed against a misfit measured in trace units, so lambda means nothing until it is read against the trace's amplitude. The 101-sample Ekene-1 trace has a largest absolute amplitude of 399.814697. Non-zero reflectivity samples with the scaled wavelet:

| lambda | non-zero samples, 60 iterations | non-zero samples, 400 iterations |
| --- | --- | --- |
| 0.002000 | 101 | 101 |
| 200.000000 | 96 | 61 |
| 1000.000000 | 67 | 44 |
| 5000.000000 | 36 | 27 |

At QI Studio's own setting of 0.002000 every one of the 101 samples is non-zero. On traces of this amplitude that lambda imposes no sparsity. Sparsity appears only at the larger lambdas, and more iterations sharpen it further. A study that calls its result sparse-spike states lambda and the count of non-zero samples it produced.

## Three methods at Ekene-1

Each run blind, the well left out of its LFM, scored against the log after the 50 Hz high cut:

| method | correlation | AI error percent | samples |
| --- | --- | --- | --- |
| model-based | 0.852881 | 10.557858 | 27 |
| model-based, blocky | 0.751173 | 13.130119 | 27 |
| sparse-spike | 0.873414 | 8.356661 | 27 |

Sparse-spike leads on both measures here, and its AI error falls below the LFM-alone error of 8.638086 percent at this well. It does so at a lambda that imposes no sparsity, so sparsity cannot take the credit. Blocky trails both at the stated epsTV.

These are scores at one well on 27 samples. The blind-well lesson runs model-based and sparse-spike at all four wells, and the order is not the same everywhere.

{{panel:qi-inversion-explorer}}

## Exercise

In the inversion explorer, set View to "Model-based, blocky and sparse-spike", Data to "Ekene teaching pack", Well to Ekene-1 and "The well's own log" to left out. Run Method model-based, then model-based, blocky with "Blocky epsTV" 0.020000 and "Blocky outer loops" 4, then sparse-spike with "Sparse-spike lambda" 0.002000, reading each correlation and AI error. For sparse-spike, read the non-zero reflectivity samples, then set lambda to 1000.000000 and Iterations to 400 and read the count and scores again. Write one sentence on whether more sparsity improved the match at this well.
