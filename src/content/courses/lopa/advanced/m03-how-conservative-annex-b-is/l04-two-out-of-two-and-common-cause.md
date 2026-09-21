# Two out of two and common cause

{{panel:lp-proof-test}}

{{panel:lp-sif-builder}}

Every redundant architecture in Annex B carries a common cause term except one. A 2oo2 has none, and the engine says so in the formula it returns: PFD = 2 lD tCE (Annex B carries no beta term for 2oo2). This is a property of the published form the engine implements, and it is the fourth of the four places Annex B departs from the exact average. It is worth teaching in its own right because it is the one departure whose direction surprises people.

## What the engine does with a typed beta factor

| call | PFDavg | common cause DU | warnings, verbatim |
| --- | --- | --- | --- |
| 2oo2, no beta factor typed | 0.010576000000 | 0.000000000000 | none |
| 2oo2, beta factor 0.05 typed | 0.010576000000 | 0.000000000000 | beta does not apply to 2oo2 and was ignored |

The two rows return the same PFDavg to the last digit, and the common cause contribution is 0.000000000000 in both. The typed fraction changed nothing, and the engine reports that it changed nothing. An analyst who types a beta factor and sees the answer move has typed it against a different architecture.

## Why the omission errs high

A 2oo2 trips only when BOTH channels work, so it fails on the FIRST dangerous failure of either channel. Its PFDavg is twice one channel's. Now consider a failure that takes out both channels at once. It fails the 2oo2 exactly as thoroughly as one channel failing would have done, so it should be counted once. Annex B, having no common cause term, has already counted that failure twice, once in each channel. Common cause makes a real 2oo2 slightly better than two independent channels, and the published form does not take the credit.

The counting fixes the direction of the error and this course stops there. A closed form for the size of the double counting is not something the engine returns or the digest prints, so no such formula is taught here and none is graded. What the counting does settle is that every common cause failure is charged twice where it should be charged once, so the published form sits above the exact average wherever common cause is present. The one number this course attaches to the effect is the measurement below.

## What the measurement says

The golden's time dependent route puts a number on it. At a beta factor of 0.1 the exact 2oo2 average is 0.016460844922 against the Annex B 0.017520000000, which is 6.43 percent above it. That measured figure carries the linearisation as well as the missing common cause term, so it is the total conservatism of the 2oo2 case, of which the missing term is only one part. The time dependent value is provenance and is never graded.

## Exercise

Take the Annex B 2oo2 figure of 0.017520000000 and the time dependent 0.016460844922 at a beta factor of 0.1. Work out the absolute difference between them, then divide that difference by the time dependent value and confirm for yourself that it recovers the 6.43 percent quoted above. Compare it with the 2oo2 pair computed with and without a typed beta factor, 0.010576000000 both ways, and say in one sentence what a project would have to measure before it could claim any part of that 6.43 percent back.
