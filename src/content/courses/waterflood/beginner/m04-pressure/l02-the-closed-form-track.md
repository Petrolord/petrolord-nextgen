# The closed-form track

The Material Balance course develops the tank equation and inverts it to get pressure from cumulative production. This lesson extends that inversion by one term so that it works during a flood, and then runs it over the Ekene record. Nothing here is a new model; it is the RC2 model with injection in it.

## The inversion

Start from the balance for an undersaturated oil reservoir, now with produced and injected water:

$$N_p B_o + (W_p - W_i) B_w = N B_{oi} (c_o + c_{efw}) \Delta p$$

and substitute the linear oil expansion $B_o = B_{oi}(1 + c_o \Delta p)$:

$$N_p B_{oi}(1 + c_o \Delta p) + (W_p - W_i) B_w = N B_{oi} (c_o + c_{efw}) \Delta p$$

Divide through by $B_{oi}$ and write $W = (W_p - W_i) B_w / B_{oi}$:

$$N_p + N_p c_o \Delta p + W = N (c_o + c_{efw}) \Delta p$$

Collect the $\Delta p$ terms and solve:

$$\boxed{\Delta p = \frac{N_p + W}{N (c_o + c_{efw}) - N_p c_o}}$$

Set $W$ to zero and this is exactly the depletion-era inversion from the Material Balance course. Injection enters as a negative withdrawal and nothing else changes. That matters more than it looks: it means the flood-era pressure track continues the depletion-era track with no seam, no re-fitting, and no discontinuity at the flood start.

## Checking the seam

At the flood start, cumulative oil is 261475.03999967827 stb, and cumulative produced and injected water are both zero. Then $W = 0$ and

$$\Delta p = \frac{261475.03999967827}{12139208.107496763 \times 1.976923076923077\times10^{-5} - 261475.03999967827 \times 1.2\times10^{-5}}$$

$$= 1103.9917373330045 \text{ psi}$$

so $p = 3200 - 1103.9917373330045 = 2096.0082626669955$ psia, which is exactly the pressure the Material Balance fixture reports at the flood start. The two courses agree to the last digit because they are running the same closed form.

## The Ekene flood-era track

Accumulate month by month from the flood start, adding each period's $N_p$, $W_p$ and $W_i$ to the running cumulatives and re-evaluating. The result is a monthly pressure at the end of each period. Three landmarks:

| period | cumulative $N_p$ (stb) | cumulative $W_i$ (bbl) | pressure (psia) |
|---|---|---|---|
| 2023-01 | 266202.07431542396 | 4789.431168713511 | 2092.973311798282 |
| 2023-04 | 279773.2373509519 | 19848.420630873454 | 2088.9530115439275 |
| 2025-12 | 438398.87644001114 | 224975.42705121648 | 2123.4461408278908 |

The shape is a shallow V. Pressure falls for the first few months while the flood is ramping, bottoms out at 2088.9530115439275 psia in April 2023, and then rises steadily for the remaining 32 months to finish at 2123.4461408278908 psia. That is a recovery of 34.4931292839633 psi from the trough, and it ends 27.437878160895252 psi above where the flood started.

{{panel:wf-ledger-explorer}}

The bright amber dashed line is this track. Watch it against the VRR lines: pressure falls while the VRR is below target and rises once the 1.05 hold takes over. The two curves are the same story told in different units.

## Why the estimate in lesson 1 came out low

Lesson 1 estimated the repressurization from the net surplus alone: 7738.498783101561 rb divided by 287.97936771938475 rb per psi gives 26.87171252713553 psi. The actual rise from the trough is 34.4931292839633 psi.

The gap is not an error in either number. The 26.87 psi is the rise measured from the FLOOD START, and the actual rise from the flood start is 27.437878160895252 psi, which agrees with the estimate to within two percent. The 34.49 psi is measured from the TROUGH, which is 7.055251123068047 psi below the flood start because the flood spent its first four months still losing ground.

The lesson is a small one and it recurs everywhere: two correct numbers can disagree because they are measured from different origins. Say which origin.

## Where the last two percent goes

The remaining small discrepancy between 26.87171252713553 and 27.437878160895252 psi comes from the $-N_p c_o$ term in the denominator, which grows as cumulative production grows. It makes the tank slightly more responsive to withdrawal later in life than earlier. Over Ekene's small production it is worth about two percent. On a field that has produced a large fraction of its oil in place, it is worth much more, and a linear "rb per psi" rule of thumb stops working.

## The misconception to avoid

"The pressure track is a measurement." It is a model output, computed from production volumes and assumed tank properties. It is exactly as good as the assumption that Ekene is a single closed tank with the stated compressibilities, and no better. The next three lessons are about testing it against the six real pressure surveys, which is the only thing that gives it standing.

## Exercise

First, use the boxed inversion to compute the pressure at the end of 2023-04 from the cumulative volumes in the table, and confirm you reproduce 2088.9530115439275 psia. Use $B_w = 1.02$, $B_{oi} = 1.2$, $c_o = 1.2\times10^{-5}$, $c_{efw} = 7.76923076923077\times10^{-6}$, $N = 12139208.107496763$, $p_i = 3200$.

Second, state what the pressure at the end of the record would be if the field had injected nothing at all after the flood start, keeping the same production. You will need the cumulative $N_p$ from the table.
