# Outside the measured points

Between measured points the engine draws a straight line. Outside them it is far more careful. The curve answers outside its measured range only where it says so itself, and everywhere else the value is unknown.

{{panel:crude-assay-explorer}}

## Where the curve says so itself

Two statements are built into a curve's own points. If the first point is at 0 percent, nothing has distilled below it. If the last point is at 100 percent, everything has distilled above it. Those are not guesses. They are what 0 percent and 100 percent mean.

Obigbo Light's curve starts 0 at 85 and ends 100 at 1380, so both statements hold.

| crude | temperature F | volumePercentAt |
| --- | --- | --- |
| Obigbo Light | 60 | 0.0000 |
| Obigbo Light | 85 | 0.0000 |
| Obigbo Light | 1380 | 100.0000 |
| Obigbo Light | 1500 | 100.0000 |

At 60 F, below the first point, the engine returns 0.0000. At 1500 F, above the last point, it returns 100.0000. In the other direction, temperatureAtVolumePercent at 0 percent returns 85.0000 and at 100 percent returns 1380.0000, the two end points.

## Where the curve says nothing

The Ebocha partial assay starts at 4 at 110 and ends at 88 at 920. Its first point is not at 0 percent and its last is not at 100 percent. So neither statement holds, and outside its range the curve cannot say anything.

| crude | temperature F | volumePercentAt |
| --- | --- | --- |
| Ebocha partial assay | 60 | unknown |
| Ebocha partial assay | 110 | 4.0000 |
| Ebocha partial assay | 920 | 88.0000 |
| Ebocha partial assay | 1000 | unknown |

| crude | volume percent | temperatureAtVolumePercent F |
| --- | --- | --- |
| Ebocha partial assay | 2 | unknown |
| Ebocha partial assay | 4 | 110.0000 |
| Ebocha partial assay | 88 | 920.0000 |
| Ebocha partial assay | 95 | unknown |

At 60 F and at 1000 F the engine returns unknown. At 2 percent and at 95 percent, the temperature is unknown too.

## Why the engine refuses to extrapolate

The tempting move is to extend the last straight segment past the end of the data. Run Ebocha's segment from 70 at 760 to 88 at 920 out past 920 F, and you would get a number at 1000 F. That number would depend entirely on the slope of one segment, and nothing guarantees that a crude's heavy end follows the slope of the segment before it. The residue of a heavy crude can hold a large share of the barrel, and a guess at the heavy end is a guess at the most contested part of the valuation.

Clamping is just as tempting and just as wrong: reading anything below the first point as 4 percent, or anything above the last as 88. That treats the unmeasured light end and the unmeasured heavy end as if they did not exist.

So the engine returns unknown. An unknown is visible. It stops a cut yield from being formed out of a guess, and it tells the reader exactly where the assay ran out.

## What unknown asks of you

An unknown is a request for data. The remedy for the Ebocha partial assay is a full assay that measures the light end and the heavy end. Until then, any cut that reaches into those regions has no yield, and the next two lessons show how the engine reports that. In the assay explorer, the unmeasured ends of the Ebocha curve are drawn as unknown.

## Exercise

Read the Obigbo Light reading at 1500 F and the Ebocha reading at 1000 F. Quote both. Say what the two answers show about the difference between a curve whose last point is at 100 percent and a curve whose last point is at 88 percent. Then explain why the engine returns unknown for Ebocha at 60 F while it returns 0.0000 for Obigbo Light at the same temperature.
