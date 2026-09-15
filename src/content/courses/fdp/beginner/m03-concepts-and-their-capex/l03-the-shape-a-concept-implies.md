# The shape a concept implies

Give the engine a peak rate and a life and it draws a production profile: a plateau at the peak, then a decline. The FPSO concept at 60.0000 kbpd over 20 years starts 60.0000, 60.0000, 60.0000, 54.0000, 48.6000, 43.7400 and ends at 10.0063.

{{panel:ec-plan-explorer}}

## Plateau, then decline

The plateau runs to year 3, so the first three years all sit at the concept's peak of 60.0000 kbpd. Year 4 is year 3 multiplied by 0.900000, which is 54.0000. Year 5 is 54.0000 times the same factor, 48.6000, and year 6 is 43.7400. The factor never changes, so the profile falls by a tenth every year from year 4 onwards and reaches 10.0063 kbpd in the final year.

Two inputs produced all of that. The peak rate sets the height, and the life sets how many years the decline runs for.

## It shows up in the money

The cash flow rows carry the same shape. Gross revenue in the Base case is 1533.0000 million USD in each of years 1, 2 and 3, then 1379.7000 in year 4, 1241.7300 in year 5 and 1117.5570 in year 6. Three flat years, then a fall of a tenth a year, because the price is flat and the barrels are doing all the moving. Operating cost falls too, from 204.5000 in year 1 to 166.8430 in year 7, because part of it is the 5.0000 USD a barrel that fewer barrels no longer carry.

## A screening shape, not a forecast

No reservoir was simulated to produce that curve. The engine did not look at the pressure, the drive mechanism, the well count or the water cut. It took a peak rate and a life, applied a plateau and a fixed decline, and would draw the identical shape for a field with completely different rock.

Nothing checks the profile against the reserves either. The plan's oil P50 is 130.0000 MMbbl, and the shape is drawn without consulting that number at all. A concept whose plateau and life cannot be supported by the volume in the reserves table will still return a full set of screening economics.

## What the shape is good for

It is good for comparison. Two concepts run through the same generator with their own peaks and lives can be ranked against each other honestly, because one assumption is applied to both. It is not good for anything that needs the year the water arrives or the date the plateau really breaks.

## The mistake

The mistake is to take the profile into a reservoir conversation. A curve that falls by exactly 0.900000 a year is an assumption wearing the clothes of a result, and a reader who has only seen the chart cannot tell the difference. Ask which two inputs drew it before treating any point on it as a forecast.

## Exercise

Give the first six years of the FPSO concept's profile and say which year the plateau ends in. Then show how year 5 follows from year 4, and name the two concept inputs that fix the whole shape.
