# The mitigated frequency without a SIF

{{panel:lp-worksheet}}

The mitigated frequency without a SIF is how often the consequence is expected with the credited layers doing their work and no safety instrumented function on the row. It is the unmitigated frequency multiplied by the product of the credited IPL PFDs. This is the number that gets compared with the tolerable frequency, and it is where the whole determination half of the engine has been heading.

## The two products that make it

| quantity | engine key | value |
| --- | --- | --- |
| unmitigated frequency, per year | `unmitigatedFrequencyPerYr` | 0.013500000000 |
| product of the credited IPL PFDs | `iplProduct` | 0.001000000000 |
| mitigated frequency without a SIF, per year | `mitigatedFrequencyWithoutSifPerYr` | 0.000013500000 |

ORONI credits two layers, the high level alarm with operator response at an IPL PFD of 0.1 and the relief valve at 0.01. Their product is 0.001000000000, and it carries the unmitigated 0.013500000000 per year down to 0.000013500000 per year.

The two uncredited layers contribute nothing to this figure. They stay on the output under `notCredited` with their reasons, so the worksheet shows what was claimed and what was allowed, and the reviewer can see how much of the claim survived.

## Why the name says without a SIF

The engine names the field carefully. This is the frequency with the existing layers only. A proposed safety instrumented function, when one is typed, is applied on top of this figure and produces a different frequency, which module four takes up. Keeping the two apart is what lets the engine say how much reduction is still missing: the gap is measured from this number, and a SIF is then judged on whether it closes it.

## Reading the number honestly

0.000013500000 per year is roughly one occurrence in seventy four thousand years for this one scenario at this one separator. Two things follow. The first is that no plant has the history to confirm a figure like that, which is why it is built from a product of factors each defended on its own. The second is that a site has many such rows, and a frequency that looks negligible alone is not negligible summed over a facility. LOPA judges one row at a time, and the sum across rows is somebody else's arithmetic.

What the engine guarantees here is the multiplication and the bookkeeping. Every factor is printed with its name, the credited layers are separated from the uncredited ones with reasons, and the frequency comes back to twelve decimals so the comparison with the tolerable frequency is made on the figure itself.

## Exercise

Divide the unmitigated frequency of 0.013500000000 per year by the mitigated frequency of 0.000013500000 per year and state what that ratio equals in terms of the credited IPL PFDs. Then work out what the mitigated frequency would be if the relief valve at 0.01 were removed from service and no longer credited, and say in one sentence what the plant would have to do about the row that day.
