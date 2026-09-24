# The NIST table and its design

{{panel:dq-monitor-explorer}}

The NIST/SEMATECH e-Handbook, section 6.3.2.3, works a tabular CUSUM with a target of 325, k 0.317500 and h 4.195900, both in the data's units. The engine reproduces the table from those printed inputs, and its first upper signal is group 14. The same page prints a design line for h. Using the page's own inputs, alpha 0.0027, beta 0.01, a shift delta of 1 sigma and the printed k 0.317500, that formula gives 3.749328, and 4.189476 with alpha halved. The table uses 4.195900.

| h | where it comes from |
| --- | --- |
| 4.195900 | the value the NIST table uses |
| 3.749328 | the page's design formula, with alpha 0.0027, derived |
| 4.189476 | the same formula with alpha halved, derived |

## The table the engine reproduces

The golden that anchors the engine carries this example, with target, k and h taken as printed. Groups 11 to 15 read:

| group | x - 325 | S_hi | S_lo | cumulative sum |
| --- | --- | --- | --- | --- |
| 11 | -0.375000 | 0.000000 | 0.312500 | -2.650000 |
| 12 | 0.150000 | 0.000000 | 0.000000 | -2.500000 |
| 13 | 3.325000 | 3.007500 | 0.000000 | 0.825000 |
| 14 | 2.250000 | 4.940000 | 0.000000 | 3.075000 |
| 15 | 2.825000 | 7.447500 | 0.000000 | 5.900000 |

S_hi passes 4.195900 at group 14 with 4.940000. The table is a statement about the arithmetic of the recursion, and the engine matches it.

## The design line

The page's design formula is h = (2 / delta^2) ln((1 - beta) / alpha) k, where alpha is the false alarm probability the design accepts, beta the probability of missing a shift of delta, and k the reference value. With the printed inputs it gives 3.749328 in the data's units. Halving alpha gives 4.189476. Neither is the 4.195900 the table uses. The page's own design formula does not give the h its own table is built on, and the course records that in the final module as a note about a published page.

## Why the engine has no design helper

A design helper would take alpha, beta and delta and return k and h. The engine does not build one. k and h are inputs with a stated unit, and the NIST page shows why that is the safer contract: even the published design line and the published table disagree on h. A helper would have to pick one reading of the design and present its answer as the chart's. The engine leaves the design to the caller, who states k, h and the unit in the plan and can cite the source they used.

## Designing on EKENE-3

The EKENE-3 chart in this module uses k 0.5 and h 4 in sigma units, the rule of thumb the engine's refusal quotes, and it is labelled as a stated choice. A plan that designs its own k and h from a stated alpha and beta writes the formula, the inputs and the result beside the chart, so that anyone reading it can repeat the arithmetic.

## Exercise

Take the design formula and the page's inputs: delta 1, alpha 0.0027, beta 0.01 and k 0.317500. Work h = (2 / delta^2) ln((1 - beta) / alpha) k on a calculator and check that you reach 3.749328. Repeat with alpha halved and check 4.189476. Then open the panel's CUSUM view on EKENE-3, keep k 0.5 in sigma units and change h from 4 to 5, the other end of the refusal's rule of thumb. Read the first upper and lower signals, and write one sentence on which h you would put in a monitoring plan and why.
