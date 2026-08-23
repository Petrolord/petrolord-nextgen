# Adopting a final Rw

The triangle closed and the water leg confirmed it. What remains is the formal step that separates an Expert evaluation from a competent calculation: adopting the value, on the record, with its provenance, uncertainty and domain of validity stated. This lesson writes that record for the typewell and sets the rules for maintaining it.

## The adoption statement

An adopted parameter needs four elements, and all four belong in the report:

1. **The value.** Rw = 0.05 $\Omega\cdot m$ at 180 degF formation temperature.
2. **The provenance.** Three convergent, independent routes: the laboratory sample 0.114 $\Omega\cdot m$ at 75 degF corrected by Arps to 0.049910; the SP quicklook from SSP = -93 mV and $R_{mfe}$ = 0.62 $\Omega\cdot m$ giving 0.049831; the Pickett water-leg fit over 2075 to 2078 m giving $aR_w$ = 0.0500 with $a = 1$ and $m = 2.000$. Each route is documented with its inputs so a reviewer can recompute it.
3. **The uncertainty.** The spread across the three routes, here 0.000169 $\Omega\cdot m$, well under 0.001 and under 0.4 percent of the value. Where routes disagree, this element becomes a range carried into sensitivity instead of a reassuring footnote.
4. **The domain of validity.** This Rw describes this reservoir's formation water at formation temperature. A different pressure system, a separate aquifer, a shallower stacked sand or a neighbouring fault block owes you its own triangulation; water chemistry does not respect your project boundaries.

The statement is short, but every element does work. The value without provenance is an assertion; provenance without uncertainty invites false precision; and all three without a domain statement will one day be applied to a reservoir they do not describe.

## Rounding discipline

The triangulation produced 0.049910, and the adoption statement says 0.05. Is the rounding defensible? Check it against the numbers that matter. Booking SAND_A with the Arps value gives a pay-average water saturation of 0.3609 and 18.0 m of net pay; booking it with the rounded 0.05 gives 0.3613 and the same 18.0 m. The saturation moves by 0.0004 and no pay moves at all.

The discipline is to make exactly this comparison, record it, and then round. Rounding is not a loss of rigour when its cost is measured and shown to be immaterial; it is a loss of rigour when it happens silently in whichever direction the analyst last typed. State the computed value, state the adopted rounded value, and show the difference does not matter. If it did matter, you would not round.

## Living with the adopted value

Adoption is not permanent. New data arrives, and the record must say in advance how it will be treated. The classic case: after first production, a produced-water analysis becomes available, water sampled directly from the reservoir with no filtrate to contaminate it. That sample outranks the pre-production lab bottle. The procedure is to re-run the triangulation with the new vertex, re-validate in the water leg, and if the adopted value changes, re-book the reservoir and issue a versioned revision of the report.

Versioning is the operative word. The original report is not edited in place; it is superseded by a new one that states what changed, why, and what the change did to the booking. Silent edits destroy the audit trail that the adoption statement exists to create. A reviewer must always be able to see that the January evaluation used 0.05 from three routes, and the October revision used 0.048 after produced water arrived, and exactly what that revision cost in saturation and pay.

The same rule covers corrections. If a transcription error is found in $R_{mfe}$ months later, the fix goes through the same door: re-triangulate, re-validate, re-book, re-version.

## Worked example

Draft the adoption statement for the typewell in four numbered lines, then verify its rounding claim:

1. Adopted: Rw = 0.05 $\Omega\cdot m$ at 180 degF.
2. Provenance: Arps-corrected sample 0.049910; SP quicklook 0.049831; Pickett $aR_w$ 0.0500 ($a$ = 1, $m$ = 2.000, 6 points, 2075 to 2078 m).
3. Uncertainty: route spread 0.000169 $\Omega\cdot m$ (0.34 percent).
4. Validity: this reservoir's water system at formation temperature.

Rounding check: SAND_A pay-average Sw 0.3609 (at 0.049910) against 0.3613 (at 0.0500); net pay 18.0 m in both cases. Difference immaterial; rounding adopted.

## Exercise

A produced-water sample arrives a year later and the re-run triangulation gives lab 0.047, SP 0.049 (unchanged inputs), Pickett 0.050 (unchanged). Using the scaling rule from the previous lesson, estimate what adopting 0.048 instead of 0.050 would do to a saturation previously booked at 0.361, and state the two documentation actions the change requires. As a self-check: $0.361 \times \sqrt{0.048/0.050} = 0.361 \times 0.9798 = 0.354$, a decrease of about 0.007 in Sw; the actions are re-booking the affected zones with the new value and issuing a versioned report revision recording the old value, the new value and the booking impact.
