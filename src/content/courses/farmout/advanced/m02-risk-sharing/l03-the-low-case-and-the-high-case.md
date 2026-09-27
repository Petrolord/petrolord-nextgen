# The low case and the high case

{{panel:farmout-valuation-calculator}}

A standard deviation is one number for a whole spread. The low case and the high case describe its two ends, and the engine labels them by a stated convention.

## The labels

The engine states which percentile is which:

> p90 is the low case and p10 the high case (probability of exceedance, lib/conventions/percentile.js)

P90 is the value the outcome exceeds 90 percent of the time, so it sits at the low end. P10 is exceeded only 10 percent of the time, so it sits at the high end. The convention is the platform's, read from the canonical percentile module, and every course on the platform uses the same one.

## The Ekene Deep positions

On the Ekene Deep prospect (synthetic), with seed 20271111 and 20000 draws (engine):

| golden case | position | low case (P90) | high case (P10) |
| --- | --- | --- | --- |
| risk-ekene | EKO drills Ekene Deep alone (70%) | -28000000.000000 | 157675235.929265 |
| risk-ekene | EKO after the farm-out (40% and the cash) | -6792000.000000 | 99708134.816723 |

The farm-out lifts EKO's low case from -28000000.000000 to -6792000.000000 and lowers its high case from 157675235.929265 to 99708134.816723. The farmor gives up part of its best outcome in exchange for a much smaller worst one.

These four figures print the same as the dry-hole and success payoffs of the deal view for the same positions. With a single prospect, a dry-hole chance of 0.750000 puts the ninetieth percentile of exceedance inside the dry-hole outcome, and the success value of these holdings is stated without spread. A position with a spread on its success value, or with several prospects, would give low and high cases between the payoffs.

## One bet or four

The golden case risk-spread-four holds the same EMV of 20000000.000000 in two ways: one prospect at 100 percent, or four independent prospects at 25 percent each (seed 11, 50000 draws, engine).

| golden case | position | standard deviation | low case (P90) | high case (P10) |
| --- | --- | --- | --- | --- |
| risk-spread-four | one prospect at 100% | 106887791.632160 | -40000000.000000 | 212319325.876538 |
| risk-spread-four | four prospects at 25% | 53443895.816080 | -40000000.000000 | 92230348.163821 |

The standard deviation halves. The high case falls from 212319325.876538 to 92230348.163821, because four independent wells rarely all succeed together. The low case stays at -40000000.000000: the chance that all four wells fail together is still above 10 percent, so the ninetieth percentile of exceedance still falls where every well fails.

## What is never graded

The low case and the high case come from seeded draws. The course teaches them and grades none. The same seed and draw count return the same figures on any machine, and a different seed returns different ones.

## Exercise

Open the valuation calculator on the view "Risk sharing: spread, the chance of a loss, the low and high cases" and start from "The Ekene farmor alone and after the farm-out". Read the low case and the high case for both positions and the percentile note under the table. Compare them with the payoffs in the view "The value of the deal to each side". Then start from "One bet or four", read both positions, and say in two sentences why spreading the same EMV over four prospects moves the high case and leaves the low case where it is.
