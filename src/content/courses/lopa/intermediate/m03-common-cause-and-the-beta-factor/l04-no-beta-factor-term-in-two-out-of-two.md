# No beta factor term in two out of two

{{panel:lp-sif-builder}}

Every redundant architecture in this engine carries a common cause term except one. A two out of two carries none, and a beta factor typed on a two out of two call is ignored with a warning. That is not an omission in the engine. It is what Annex B states, and the reason is worth following closely, because it is the one place in this course where ignoring common cause is the conservative choice.

## What a two out of two actually is

A two out of two trips only when both channels agree to trip. That means it fails to act on demand as soon as either channel is dangerously failed. It is not redundancy for safety at all; it is redundancy for availability, bought by accepting that the first dangerous failure of either channel disables the function. Its PFDavg is therefore twice one channel's, and the engine prints exactly that.

> PFD = 2 lD tCE (Annex B carries no beta term for 2oo2)

## The call, with and without a beta factor

The EKULAMA channel with diagnostics, called as a two out of two, first with no beta factor typed and then with 0.05 typed.

| call | PFDavg | common cause, undetected | warning |
| --- | --- | --- | --- |
| 2oo2, no beta factor typed | 0.010576000000 | 0.000000000000 | none |
| 2oo2, beta factor 0.05 typed | 0.010576000000 | 0.000000000000 | beta does not apply to 2oo2 and was ignored |

The answer is identical. The warning exists so that an analyst who typed a beta factor learns it did nothing, and does not leave a review believing the calculation credited it.

## Why leaving it out errs high

Treating both channels as independent counts a common cause event twice, once as each channel failing. In reality one such event fails the two out of two exactly once, no worse than a single channel failing. So the Annex B answer is above the truth, and by how much can be measured. The vendored golden carries a time dependent route for this case: at a beta factor of 0.1 the exact two out of two average is 0.016460844922 against the Annex B 0.017520000000, which is 6.43 percent above it. Common cause makes a real two out of two slightly better than two independent channels, and Annex B does not take the credit.

## The choice the engine made

The engine could have modelled the credit and returned the lower number. It implements the Annex B form as published, so that a verification note quoting this engine quotes the standard's equation and nothing added to it. The conservative direction matters here: the error is known, it is small on this channel, and it is on the safe side of the target. An engine that quietly improved on a published equation would give an analyst a number no reviewer could trace to a source.

## Exercise

Take the two out of two PFDavg of 0.010576000000 and the one out of one figure of 0.005288000000 on the same channel. Compute the ratio and explain it from the printed formula. Then compute how much lower the golden's time dependent value of 0.016460844922 sits against the Annex B 0.017520000000 at a beta factor of 0.1, and compare your answer with the 6.43 percent quoted above.
