# Sampling and what it costs

A chord across a curved function is biased in the direction the curve bends, and where you sample decides where the bias lands.

{{panel:pd-ipr-explorer}}

## The shortcut

Sample the relation at forty pressures, then read an inverse by interpolating between the two rows straddling your rate. Sometimes that is the only reading available: a pseudo-pressure gas inflow has an integral inside it and nothing to rearrange. Where a family does carry a closed-form inverse, the engine uses the exact one.

## Where the samples land

The engine builds its gas curve by walking evenly in PRESSURE, in forty steps. A gas relation works on a difference of squared pressures, so near the reservoir pressure a small pressure step produces a very large jump in rate. Even in pressure is wildly uneven in RATE, and the widest rate interval sits where the curve bends hardest. The bias piles up at the low-rate end.

## What it costs, measured

Rawlins and Schellhardt, C of 0.01 and n of 0.85 at 4000 psia, open flow 13289.296319 Mscf/d:

| Rate, Mscf/d | Exact, psia | Chord, psia | Bias, psi |
| --- | --- | --- | --- |
| 1328.9296 | 3864.487624 | 3863.009722 | -1.477901 |
| 4651.2537 | 3368.536572 | 3368.181360 | -0.355211 |
| 7973.5778 | 2688.408237 | 2688.003255 | -0.404982 |
| 11960.3667 | 1365.747404 | 1364.893267 | -0.854137 |

Houpeurt, a of 900 and b of 0.35 at 4000 psia: biases of -3.878569, -0.072015, -0.809484 and -0.849721 psi at 559.6680, 1958.8379, 3358.0078 and 5037.0117 Mscf/d.

The strongly turbulent case, C of 0.004 and n of 0.62 at 3200 psia, open flow 88.806747 Mscf/d:

| Rate, Mscf/d | Exact, psia | Chord, psia | Bias, psi |
| --- | --- | --- | --- |
| 8.8807 | 3160.745567 | 3147.834757 | -12.910810 |
| 31.0824 | 2890.790992 | 2889.857104 | -0.933888 |
| 53.2840 | 2397.413173 | 2396.939315 | -0.473858 |
| 79.9261 | 1265.038372 | 1264.303420 | -0.734952 |

One to three psi low through the body of both empirical families, thirteen psi low at the low-rate end of the turbulent one, whose lower exponent gives a steeper approach to the reservoir pressure and so a longer chord across a harder bend. Every reading is low. Nothing about a chord error is random.

## What it costs downstream

Read off the table, the vertical gas well shifts from 11335.720032 to 11335.081217 Mscf/d, a bias of -0.638815 Mscf/d, and the deviated big-tubing well from 8409.180054 to 8408.149052 Mscf/d, a bias of -1.031002 Mscf/d. Small, and systematic.

## The oil side never pays it

Oil curves ship as tables too, 40 rows on the published cases, 51 on BONNY-7, 45 on FORCADOS-3. The engine draws with them and reads answers from the relation. Ask BONNY-7 for the pressure at 3243 stb/d and 1105.576792 psia comes back regardless of where the stored rows fall.

## What sampling refuses

It refuses to improve where you need it unless you move the samples, and it refuses to warn you: 3147.834757 psia prints as authoritatively as 3160.745567 psia.

## Exercise

Record the exact and interpolated readings at 8.8807 and 53.2840 Mscf/d with the bias at each, then say why the same forty samples give such different errors at those two rates.
