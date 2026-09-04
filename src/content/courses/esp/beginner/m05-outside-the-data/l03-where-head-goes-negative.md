# Where head goes negative

A stage that makes negative head is the first answer in this package that cannot be mistaken for a real one, and it arrives more than 1300 bbl/d too late to help.

{{panel:pd-stage-explorer}}

## The zero crossing, and how far past the data it sits

The golden vendor curve's head fit reaches zero at 4806.6229 bbl/d at 60 Hz, which is 1306.6229 bbl/d past the published range high of 3500 bbl/d. Everything between those two rates is positive, plausible and wrong by an amount nothing reports.

| Rate, bbl/d | Head, ft | Efficiency | hp |
| --- | --- | --- | --- |
| 4800 | 0.11714286 | 0.25764571 | 0.01448112 |
| 4806 | 0.01102686 | 0.25534855 | 0.00137712 |
| 4900 | -1.67428571 | 0.21894857 | -0.24862896 |
| 5100 | -5.40285714 | 0.13916571 | -1.31380098 |
| 5500 | -13.44285714 | -0.02771429 | NaN |

## Head runs out before efficiency does

The efficiency fit on the same curve reaches zero at 5434.80 bbl/d, 628.18 bbl/d beyond where head reaches zero. At 4900 and 5100 bbl/d the efficiency is still positive and the brake power is negative, because the hydraulic power went negative and not because the efficiency did. Efficiency divides, so on a curve shaped the other way round a negative efficiency is a second route to a negative horsepower.

The 540 series reference stage runs the two out much closer together: head reaches zero at 4909.9025 bbl/d, 1409.9025 bbl/d past its published data, and efficiency at 5000.00 bbl/d, only 90.10 bbl/d further on.

## The same collapse in frequency

Held at a fixed duty rate, the failure appears as a frequency. The published gassyOffshore design's head per stage reaches zero at 33.6104 Hz, 26.3896 Hz below the speed it was sized at, and the published highWaterCut design's at 16.8755 Hz, 33.1245 Hz below its design speed. No drive would be taken near either, which is why the negative reading is no protection.

## The mistake

Waiting for the sign change. It is the one visible signal in the whole sequence, so it is tempting to treat it as the boundary of usable answers, and it is not. On a design where the sizing had already stopped meaning anything, head did not finally go negative until 36.1016 Hz, 6.5 Hz below the speed where the answers stopped meaning anything, and the engine answered at every step in between.

## What it refuses

The stage reading refuses nothing at all: it returns -13.44285714 ft as readily as it returns 27.914286 ft. The refusal lives one step later. Asked for a stage count on a head per stage of zero, the engine returns NaN, and on a negative head per stage it returns NaN as well. That is the only hard stop in this chain, and by the time it fires the reading has been wrong for 1306.6229 bbl/d.

## Exercise

Read the published curve at 4800, 4900 and 5100 bbl/d and write head, efficiency and horsepower at each.

Then say why the horsepower at 4900 bbl/d is negative while the efficiency there is 0.21894857, and what would have to be true for a negative efficiency to produce the same sign.
