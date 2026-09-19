# The figure range and extrapolation

{{panel:hy-heat-stress}}

The NIOSH figures plot the limits from 116.000000 to 580.000000 W. At 100.000000 W the RAL equation gives 31.700000 C and the NIOSH heat REL equation 33.700000 C; at 600.000000 W they give 20.728067 C and 24.751261 C. Both rows lie outside the plotted range and the engine warns on each. All four limits are the NIOSH 2016-106 section 8.1 equation, checked for transcription only.

## What the range is

NIOSH 2016-106 draws its limits as curves on Figures 8-1 and 8-2, and those curves cover metabolic rates from 116.000000 to 580.000000 W. The engine exports that range as the frozen table `NIOSH_HEAT_FIGURE_RANGE_W`. Inside it the equation and the figure describe the same span of work. Outside it the equation still returns a number, and the figure has nothing to compare it with.

Every limit in this table is the NIOSH 2016-106 section 8.1 equation, checked for transcription only.

| M, W | RAL by the equation, C | NIOSH heat REL by the equation, C | outside the figure range |
| --- | --- | --- | --- |
| 100.000000 | 31.700000 | 33.700000 | yes, warned |
| 116.000000 | 30.791142 | 32.958733 | no |
| 580.000000 | 20.935665 | 24.920578 | no |
| 600.000000 | 20.728067 | 24.751261 | yes, warned |

## Warn and still evaluate

The engine's choice here is part of judgement J9: the NIOSH assessment warns outside 116 to 580 W and still evaluates. It does not refuse. The warning at 600 W reads, verbatim:

> 600 W lies outside the 116 to 580 W range the NIOSH figures plot: the equation is extrapolated

This is the same pattern the Associate tier met at the tops of the noise dose tables, judgement J3, where a level above 130 dBA is still integrated and the result carries a warning. In both places the engine reports what the formula gives and tells the reader that the source stops there. The number is kept so that the reader can see it, and the warning is kept so that nobody mistakes it for a value the source stands behind.

## Why refusing would be worse

A metabolic rate of 600 W is heavy work, and heavy work in heat stress is exactly the case a hygienist most needs to assess. A refusal would leave the report with nothing. The extrapolated limit is a reasonable screening figure as long as it travels with its warning, and the warning is carried in the engine's result for that purpose.

The same reasoning does not stretch without limit. The equation is logarithmic in M, so it keeps returning a finite limit however far out the rate goes. The further outside the range, the less the figure rests on anything NIOSH drew.

## Two layers of status

A figure at 600.000000 W therefore carries two labels. It is the NIOSH 2016-106 section 8.1 equation, checked for transcription only, and it is extrapolated beyond the figures. The first is true at every rate. The second is true only outside the range. A report quoting 24.751261 C carries both.

## Exercise

Read the two warned rows and write the full status sentence each would carry in a report, with both labels. Then name the judgement call that governs the warning, and name the Associate tier call that follows the same pattern for sound levels above the top of Table G-16a.
