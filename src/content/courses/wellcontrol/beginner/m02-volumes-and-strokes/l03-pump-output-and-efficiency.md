# Pump output, and efficiency

The conversion from volume to strokes, and the number that quietly ruins it.

{{panel:wc-volume-explorer}}

## The conversion

    strokes = volume / pump output per stroke

This course uses 0.012 m3 per stroke, which is a triplex mud pump with a particular liner size.

## Where the number comes from

The pump's geometry: the liner diameter, the stroke length and the number of cylinders. That gives a THEORETICAL displacement, and it is exact.

## The efficiency

A real pump does not deliver its theoretical displacement. Valves take time to seat, the fluid is slightly compressible, and there is slip past the pistons.

Volumetric efficiency is typically 90 to 98 percent for a well-maintained triplex, and it falls as the pump wears.

## Why it matters more than it looks

Because every stroke count in the kill sheet is a volume divided by this number.

A five percent error in the pump output is a five percent error in the strokes to the bit. On a count of 2000 strokes that is 100 strokes, which at a slow circulating rate of 30 strokes a minute is more than three minutes of holding the wrong pressure.

## How it is measured

By a pump stroke counter and a tank measurement: pump a known volume out of a calibrated tank and count the strokes.

That is done as part of the slow circulating rate check, which is also where the circulating pressure is recorded, and both are supposed to be repeated regularly.

## The engine's treatment

It takes one number and divides. There is no efficiency term, so the value supplied has to be the ACTUAL output rather than the theoretical one.

That is a real trap: entering a theoretical displacement from a pump chart gives stroke counts that are systematically too low, and every one of them is used during the kill.

## The check that catches it

Count the strokes for a real bottoms up during normal drilling and compare against the computed number. If they disagree, the pump output or the hole volume is wrong, and both are worth knowing about.

## Exercise

At a volumetric efficiency of 95 percent, compute the actual output of a pump whose theoretical displacement is 0.012 m3 per stroke.

Then recompute the horizontal well's strokes to the bit with that value, and say how many minutes of difference it makes at 30 strokes a minute.
