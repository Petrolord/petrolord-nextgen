# One segment at a time

A traverse marches a line segment by segment and returns the pressure at every station, so a designer draws the hydraulic gradient instead of asserting one number.

{{panel:fc-liquid-explorer}}

## The OGBIA line, marched flat

| station | distance ft | elevation ft | pressure psia |
| --- | --- | --- | --- |
| 0 | 0.000000 | 0.000000 | 900.000000 |
| 1 | 8800.000000 | 0.000000 | 891.446456 |
| 2 | 17600.000000 | 0.000000 | 882.892912 |
| 3 | 26400.000000 | 0.000000 | 874.339369 |

Four stations over 26400.000000 ft, in three segments of 8800.000000 ft. Station 0 is the inlet, and it is an input rather than a result: the traverse is told the line enters at 900.000000 psia and every station after it is computed.

## What the march actually does

Each segment is a pressure drop calculation on a piece of pipe, and the pressure at the end of one segment is the pressure at the start of the next. The three losses stay separated inside each segment, so a segment that climbs carries its elevation term and a segment that runs level does not.

On this flat line the steps are even, because the segments are the same length carrying the same duty through the same bore. A line whose segments differ in length or slope produces uneven steps, and that unevenness is the information the station list exists to carry.

## Why the inlet has to be given

A single pressure-drop call answers what the line spends. A traverse answers where the line is, which is a different question and needs one more piece of information: where it started. Without an inlet there is no pressure at station 0 and nothing to subtract from, so the traverse takes an absolute inlet pressure and every station is reported as an absolute pressure.

That is also what lets the traverse notice something a single call cannot, which is a line running out of pressure part way along. A call that only knows what a line spends has no way to tell that the line did not have it to spend.

## The gradient, drawn rather than asserted

With four stations a designer can plot pressure against distance and see the line rather than a total. On this case the plot is a straight fall from 900.000000 psia to 874.339369 psia. The value of drawing it appears the moment the ground stops being flat, which is the next lesson.

## What a segment is

A segment is a length of pipe with an elevation change of its own, and the caller supplies the list. The engine does not decide where the stations fall, so the resolution of the profile is a modelling choice: three segments over 26400.000000 ft give three steps, and a survey with a station every few hundred feet would give a far finer picture of the same pipe. What a march cannot do is invent detail the profile it was handed does not contain.

## The mistake

The mistake is treating the station list as decoration on a number that was already known. The list is the product of this call, and the arrival is only its last row.

The second mistake is handing a traverse a gauge pressure. Station pressures are absolute, and the inlet it is given has to be absolute too.

## Exercise

Give the four stations of the flat OGBIA line with their distances and pressures. Say which station is an input rather than a result and why the traverse needs it. Then explain what a traverse can detect that a single pressure-drop call cannot.
