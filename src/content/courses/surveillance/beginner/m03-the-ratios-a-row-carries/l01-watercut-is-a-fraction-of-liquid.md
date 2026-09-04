# Watercut is a fraction of liquid

`derivePoint` forms a watercut as water divided by liquid, where liquid is oil plus water on the same row. It is a 0 to 1 fraction everywhere in `surveillance.js` and `allocation.js` and a per cent in `liftScreening.js` and `liftAdvisor.js`.

{{panel:pd-ledger-explorer}}

## The denominator is the whole point

A watercut is not water over oil. A derived sweep on constructed rows, each holding the liquid at 1000.000000 stb and moving the split.

| oil, stb | water, stb | liquid, stb | watercut |
| --- | --- | --- | --- |
| 900.0 | 100.0 | 1000.000000 | 0.100000000000 |
| 500.0 | 500.0 | 1000.000000 | 0.500000000000 |
| 100.0 | 900.0 | 1000.000000 | 0.900000000000 |

Those are constructed demonstration rows, not published cases. The published golden gives the same arithmetic on a committed row: 800.000000 stb of oil and 200.000000 stb of water return `liquid` = 1000.000000000 stb and `watercut` = 0.200000000000.

## The two ends

A constructed row of 400.0 stb of oil and 0.0 stb of water returns `liquid` = 400.000000 stb and `watercut` = 0.000000000000. A constructed row of 0.0 stb of oil and 400.0 stb of water returns `liquid` = 400.000000 stb and `watercut` = 1.000000000000. Both ends are answers rather than refusals. A watercut of exactly one is a well making only water, and it comes back as an ordinary number.

## The hours column does not move it

Both terms of the ratio are volumes off the same row and neither is scaled to twenty-four hours. So the watercut on a row that was open for two hours and the watercut on a row that ran all day are formed the same way, and `hours_on` appears in neither. That is what makes a watercut comparable across days when a calendar volume is not.

## A field watercut is not an average of well watercuts

`buildFieldSeries` adds every row on a date together and then forms the field watercut volumetrically, water over liquid on the summed volumes. The published field day of 2025-06-04 carries 2100.000000 stb of oil and 770.000000 stb of water from 4 wells on stream, giving `liquid` = 2870.000000 stb and a watercut of 0.268292682927. That is the volumetric reading of that day. The mean of the contributing wells' own watercuts is a different quantity and is not what this function returns.

## The mistake

Multiplying a surveillance watercut by a hundred on the way into a lift calculation, or failing to. `liftScreening.js` wants a per cent and `derivePoint` returns a fraction, and nothing at the boundary converts. A watercut of 0.900000000000 handed to a screening rule as though it were already a per cent describes a well that is almost dry.

## Exercise

Build a row of 500.0 stb of oil and 500.0 stb of water in the panel and record the watercut.

Then say what number you would have to hand `liftScreening.js` to describe the same row, and what it would read the unconverted one as.
