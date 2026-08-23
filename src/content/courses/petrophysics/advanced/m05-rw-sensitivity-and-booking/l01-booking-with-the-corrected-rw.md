# Booking with the corrected Rw

The previous module ended with a decision: the triangulated formation water resistivity is 0.049910 ohm.m at formation temperature, confirmed three independent ways. This module spends that result. We book SAND_A with the corrected Rw, then book it again with the wrong one, and study what changes. This lesson does the first half, and it contains a deliberate anticlimax that is the whole point of the Expert tier.

## The Associate recipe, one parameter changed

The booking recipe here is exactly the one you learned at the Associate tier: density porosity from RHOB with the given matrix and fluid values, shale volume by Larionov tertiary from the gamma ray, Archie water saturation with $a = 1$, $m = 2$, $n = 2$, and the standard cutoffs of porosity 0.08, Vsh 0.5 and Sw 0.6. Nothing from the Professional tier's toolkit appears: no neutron-density combination, no shaly-sand models.

That is a deliberate experimental control. If we changed the porosity source and the saturation model and Rw all at once, we could never say which input moved the answer. By rerunning the Associate booking with only Rw replaced, every difference between this lesson and the next one is attributable to a single number.

## Running the booking

With $R_w = 0.049910$ ohm.m, the SAND_A zone (2010 to 2030 m) books as follows:

| Quantity | Value |
| --- | --- |
| Gross thickness | 20.5 m |
| Net pay | 18.0 m |
| Net to gross | 0.878 |
| Pay-average porosity | 0.2081 |
| Pay-average Sw | 0.3609 |

Two of these are graded in the Expert capstone: the net pay of 18.0 m (tolerance 0.01 m) and the pay-average water saturation of 0.3609 (tolerance 0.005).

## Worked example at 2020 m

Take the familiar mid-sand sample at 2020 m: $\phi_D = 0.2100$ and $R_t = 9.2554$ ohm.m. Archie with the corrected Rw, step by step:

1. Porosity squared: $0.2100^2 = 0.0441$.
2. Denominator: $0.0441 \times 9.2554 = 0.4082$.
3. Ratio: $0.049910 / 0.4082 = 0.12228$.
4. Square root: $S_w = \sqrt{0.12228} = 0.3497$.

The sample passes all three cutoffs comfortably and contributes its 0.5 m to the net.

## Assumed versus proven

Now compare against the Associate tier, which used the given $R_w = 0.05$ ohm.m. That booking returned net 18.0 m and pay-average Sw 0.3613. At the 2020 m sample it gave the course's familiar $S_w = 0.3500$; the corrected Rw gives 0.3497. The differences are in the fourth decimal, far inside every tolerance, and the net pay is identical to the half metre.

So the Expert booking changes nothing. If that feels like wasted effort, look again at what actually changed: the epistemic status of the answer. The Associate tier was handed 0.05 as a given and had to trust it. You have now measured a lab sample, corrected it to formation temperature with Arps, cross-checked it against the SP quicklook and the Pickett fit, and confirmed unity saturation in the water leg. The number 18.0 m did not change, but it stopped being an assumption and became a conclusion. The Expert work has not changed the answer; it has earned it.

This is worth internalising as a professional habit. A validation exercise that confirms the existing answer is a success, not a null result. The alternative outcome, where the triangulation had exposed the given Rw as wrong, would have rewritten every zone summary in the study. Knowing which world you are in is what the fee is for.

## What sits underneath the averages

One reading note before the counterfactual. The pay-average porosity of 0.2081 is averaged over the 18.0 m that passed the cutoffs, not over the full 20.5 m gross. Averages conditioned on a cutoff travel with their sample set, and the next lessons exploit exactly that behaviour, so fix the definition now: net, NTG and the pay averages are a package computed over the same flagged samples, and they must always be read together.

Try it yourself: the panel below runs the same engine on the typewell.

{{panel:petro-rw-triangulator}}

## Exercise

Rerun the 2020 m Archie calculation with $R_w = 0.05$ ohm.m and confirm you recover the Associate value. Self-check: $0.05 / 0.4082 = 0.12249$ and $\sqrt{0.12249} = 0.3500$, against 0.3497 with the corrected value. Then state, in one sentence each: (a) why the two bookings agree so closely on the typewell, and (b) why the agreement was still worth proving. For (a), the corrected Rw of 0.049910 differs from the given 0.05 by less than 0.2 percent, and Sw scales only with the square root of Rw; for (b), the Associate value was an unverified given, and the Expert triangulation is what makes 18.0 m defensible in front of a partner or an auditor.
