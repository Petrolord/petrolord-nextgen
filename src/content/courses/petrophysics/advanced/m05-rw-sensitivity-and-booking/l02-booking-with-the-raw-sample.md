# Booking with the raw sample

The lab reported the water sample at 0.114 ohm.m. The temperature line on the same report said 75 degF. This lesson books SAND_A as if that second line had been ignored, pushing the bench-temperature resistivity straight into a formation-temperature equation. It is the single most common Rw blunder in practice, and the typewell lets us watch it corrupt a booking end to end.

## The counterfactual booking

Same recipe as the previous lesson: density porosity, Larionov tertiary Vsh, Archie with $a = 1$, $m = 2$, $n = 2$, cutoffs 0.08 / 0.5 / 0.6. The only change is $R_w = 0.114$ ohm.m instead of 0.049910.

| Quantity | Corrected Rw | Raw sample Rw |
| --- | --- | --- |
| Gross thickness | 20.5 m | 20.5 m |
| Net pay | 18.0 m | 16.5 m |
| Net to gross | 0.878 | 0.805 |
| Pay-average porosity | 0.2081 | 0.2099 |
| Pay-average Sw | 0.3609 | 0.5303 |

The raw-sample net of 16.5 m is the third booking number the Expert capstone grades (tolerance 0.01 m). The capstone asks for it precisely because producing the wrong answer on purpose, and understanding why it is wrong, is stronger evidence of mastery than producing the right one.

## The same sample, revisited

At 2020 m the inputs have not moved: $\phi_D = 0.2100$, $R_t = 9.2554$ ohm.m. Only the parameter has:

1. Denominator as before: $0.2100^2 \times 9.2554 = 0.4082$.
2. Ratio: $0.114 / 0.4082 = 0.27930$.
3. Square root: $S_w = \sqrt{0.27930} = 0.5285$.

Against 0.3497 with the corrected value. This particular sample still passes the 0.6 cutoff, so it stays in the net either way; the samples that flip live nearer the edges of the sand, where saturations were already climbing. The next lesson maps exactly which ones.

## What physically happened

Nothing happened to the rock. Every log reading, every porosity, every Vsh value is identical between the two columns of the table. What changed is that a resistivity measured on a bench at 75 degF was asserted to apply at 180 degF. Formation brine at depth is hot, its ions are more mobile, and it conducts more than twice as well as the same brine in the lab. Using the bench value tells Archie the formation water is a much poorer conductor than it really is, so the observed $R_t$ can only be explained by more of that poorly conducting water. Every computed saturation inflates by the same factor:

$$\frac{S_w^{raw}}{S_w^{corr}} = \sqrt{\frac{0.114}{0.049910}} = 1.5113$$

a scaling this module's third lesson dissects in full. The immediate consequence is visible in the table: 1.5 m of genuine pay crossed the 0.6 cutoff and vanished from the net.

## The business translation

Read the damage in business terms, because that is how it will be read when it escapes the petrophysics group. On the same rock, with the same logs, net to gross fell from 0.878 to 0.805 and the average water saturation of the pay rose by 17 saturation points, from 36 percent to 53 percent. Downstream, the volumetric chain multiplies net, porosity and hydrocarbon saturation together, so both errors compound in the same direction: less rock counted, and less oil per counted metre. A reserves booking, a development decision or an equity split built on the right-hand column would be materially wrong, and no amount of care downstream can repair it, because the error entered at a parameter every later step trusts.

Notice also the quiet oddity in the table: pay-average porosity went up, from 0.2081 to 0.2099, in the booking that lost pay. That is not a compensation and not good news; it is the conditional-average behaviour flagged in the previous lesson. The samples that fell out were the poorer ones, so the survivors average slightly higher. The next lesson treats this properly.

Try it yourself: the panel below runs the same engine on the typewell.

{{panel:petro-rw-triangulator}}

## Exercise

A colleague books a different well with $R_w = 0.114$ ohm.m and reports a pay-average Sw of 0.62 for its main sand. Assuming the same lab-versus-formation temperature mistake, estimate what the corrected pay-average Sw would roughly be, and state one reason your estimate is only approximate. Self-check: dividing by the scaling factor gives $0.62 / 1.5113 = 0.410$, so about 0.41; the estimate is approximate because the corrected booking would also readmit flipped samples into the net, and the pay average would then be taken over a different, larger sample set rather than by rescaling the old average.
