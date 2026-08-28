# Running it against the study

The model has the composition and the conditions. Now it is asked to reproduce four measurements it was never shown.

{{panel:fluid-study-explorer}}

## What the model was given

The eleven-component composition, the C7+ molecular weight of 218 and specific gravity of 0.8515, and the separator conditions: 114.65 psia at 75 F, then a stock tank at 14.65 psia and 75 F.

Nothing else. In particular it was not given the bubble point, the gas-oil ratio, the stock tank gravity or the formation volume factor.

## What it was asked for

Those four numbers.

| quantity | measured |
|---|---|
| saturation pressure at 220 F | 2634.65 psia |
| total gas-oil ratio | 768 scf/stb |
| stock tank gravity | 40.7 API |
| formation volume factor | 1.474 rb/stb |

This is a real prediction. The model can fail it, which makes it a validation rather than a calibration, and that distinction was the subject of the simulation course's Expert tier.

## What it returns

| quantity | measured | untuned model | error |
|---|---|---|---|
| saturation pressure | 2634.65 psia | 2791.100735294379 psia | +5.938198064045652 percent |
| total gas-oil ratio | 768 scf/stb | 793.8042771796476 scf/stb | +3.3599319244332757 percent |
| stock tank gravity | 40.7 API | 31.8056416463794 | -8.894358353620603 API |
| formation volume factor | 1.474 rb/stb | withheld | no basis |

## How to read that

Two of the four are respectable and two are not.

Six percent on a saturation pressure from an untuned equation of state with a single pseudo-component is ordinary. Three percent on a gas-oil ratio is ordinary.

Nine API on stock tank gravity is not ordinary in the sense of being acceptable, but it IS expected: it is the volume shift correlation applied outside its range, which the previous module traced. It is documented, it is pinned by a gate, and it is the first thing the Expert tier's tuning goes after.

The withheld formation volume factor is not an error at all. It is the model declining to answer, and the reason is the subject of a later lesson in this module.

## What this tells you about untuned models

That they are useful and they are not accurate.

Useful, because the model reproduced the shape of the fluid's behaviour from composition alone. It knew this was a black oil, it put the saturation pressure in the right region, and it partitioned the gas roughly correctly.

Not accurate, because six percent on the saturation pressure would put a depletion forecast's bubble point crossing in the wrong year, and nine API would misprice the crude.

Both statements are true at once and a report should contain both.

## Why the comparison is worth doing before anything else

Because it is the only chance to find out how wrong the model is before its answers start being used.

Once the model is tuned it will reproduce these four numbers by construction, and the comparison stops carrying information. The untuned run is the last honest look.

That is the same argument the simulation course made about running the four external comparisons before trusting a deck, and the material balance course made about checking a tank model against an independent volumetric estimate.

## The misconception to avoid

"The model got two out of four right, so it is half correct." Errors in a fluid model do not average. The nine API bias will affect every stock tank volume the model produces, and it does not become less important because the saturation pressure was better. Report each target separately and let the reader decide which ones their question depends on.

## Exercise

First, write out the four-row comparison table with the measured value, the model value and the error for each.

Second, explain in two sentences why the untuned comparison stops carrying information once the model has been tuned to these same four numbers.
