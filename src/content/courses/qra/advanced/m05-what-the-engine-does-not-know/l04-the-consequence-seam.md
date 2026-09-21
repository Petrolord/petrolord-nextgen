# The consequence seam

Every individual risk in this course is a sum of frequency times probability of death, and the probability of death is an input. Producing one from a release is consequence modelling, which belongs to the consequence course, whose engine this engine imports and does not restate. This lesson walks the seam from the QRA side: what arrives across it, what the engine applies at it, and what a reader of a published chain has to watch for.

## What crosses the seam

| what a QRA needs | where it comes from | what this course does with it |
| --- | --- | --- |
| a probability of death at a place, Pd | a consequence model and a probit, in the consequence course | takes it as a STATED input |
| the expected number of deaths of a scenario, N | Pd over the population, cell by cell | takes it as a stated input |
| who is where, and for how long | the roster and the plot plan | takes it as a stated occupancy |

The engine exposes three functions that call the consequence engine to make a probability of death: `toxicPlumeGridPointRisk`, `thermalFatalityTransect` and `poolFireFatalityTransect`. This course never asks for their inputs, and nothing that passes through them is graded. The engine also does no grid, wind rose or population map bookkeeping. The caller supplies each scenario frequency and Pd, does that bookkeeping, and records where each value came from.

## Exposure caps, applied and stated

The Purple Book limits exposure to a fire to 20 s and to a toxic cloud to 30 minutes. The engine applies each cap without refusing and states the time it used, so a toxic exposure of 60 minutes is computed at 30. The toxic case sits on the consequence side of the seam. This course names the caps so that a reader of a result knows to look for the time the engine used, and knows that a longer stated exposure was capped rather than rejected.

## A published chain, rounded

Purple Book Appendix 6.B works one individual risk contribution at one grid point. Its early steps are consequence modelling and belong to the consequence course; from the effective cloud width onward they are QRA arithmetic. The source is internally rounded:

| step | printed in the source | the whole chain, golden |
| --- | --- | --- |
| probability of death, Pd | 0.381 | 0.380294556093 |
| contribution, per year | 7e-9 | 0.000000006997 |

The whole chain gives Pd = 0.380294556093, and the printed 0.381 follows only from the rounded effective cloud width of 86.2 m. The source also uses R = 361 m for a point whose distance computes to 360.555 m from its coordinates (200, 300), and one step names the point (100, 200). Both routes reproduce the printed contribution of 7e-9 per year to two significant figures. All of this is about the SOURCE: a reproduction that needs a rounded intermediate says which one it used.

## The other seams

The same line runs through the other seams of this course. The risk matrix and its scoring belong to the risk and change course, and this course never scores one. LOPA, IPL credit and SIL determination belong to the LOPA course. Point source flare radiation and setback distances belong to the facilities courses. Present value mechanics belong to the economics courses, and this course uses the canonical year-end present value only inside the gross disproportion test and the ICAF.

## Exercise

Take the two values of Pd, the printed 0.381 and the whole-chain 0.380294556093. Round the whole-chain value to three decimals and compare it with the print. Then write one sentence for an ALARP note stating where a probability of death came from and which rounded intermediate, if any, the reproduction used.
