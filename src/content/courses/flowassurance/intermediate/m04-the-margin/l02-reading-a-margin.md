# Reading a margin

A margin is a difference between two numbers with different owners. One came out of an engine and one came out of a laboratory, and the engine cannot tell you when the second one is wrong.

{{panel:pd-line-explorer}}

## The margin belongs to a station

TEACHING LINE AKASO SPUR returns 21 stations over 60000.0 ft at a spacing of 3000.00 ft. Its flowing hydrate boundary is 71.00 degF, a teaching input. Only the even stations are listed here, so the row spacing is twice the station spacing.

| x, ft | Temperature, degF | Margin against 71.00 degF, degF |
| --- | --- | --- |
| 30000.00 | 126.5316165233 | 55.5316165233 |
| 36000.00 | 117.1727098527 | 46.1727098527 |
| 42000.00 | 108.8880997287 | 37.8880997287 |
| 48000.00 | 101.5544690683 | 30.5544690683 |
| 54000.00 | 95.0626561939 | 24.0626561939 |
| 60000.00 | 89.3160299527 | 18.3160299527 |

At the inlet the margin is 124.0000000000 degF. Quoting that as the line's margin is not a rounding error, it is a different question answered.

## The same margin in insulation

`uForArrivalTemp` gives the second reading. On this line, against its own U of 0.452972856617 Btu/(hr ft2 degF):

| Target arrival, degF | U needed, Btu/(hr ft2 degF) | Ratio to the U this line has |
| --- | --- | --- |
| 90.00 | 0.447282863507 | 0.98743856 |
| 80.00 | 0.540647627826 | 1.19355414 |
| 71.00 | 0.651078288819 | 1.43734504 |

The 90.00 degF row reads below one, which is the same statement as the line arriving below 90.00 degF. The 71.00 degF row reads 1.43734504, and that is how much worse the thermal design could get before the arrival sits on the boundary. A margin of 18.3160299527 degF and a margin of 1.43734504 in U are one fact in two currencies, and the second is the one an insulation decision is argued in.

## What the margin is conditional on

Three things, none of them checked anywhere. The boundary, which is a laboratory number. The U, which is this line's U only if the trench, the coating and the films were entered correctly. And the diameter the U was referred to.

## The mistake

Reading the margin at the wrong place, and reading it once. A margin quoted without its station is not an answer. The other half of the mistake is quoting a flowing margin for a line that is not flowing: on this line the boundary moves to 78.00 degF once it packs up after a shutdown.

## What it refuses

Nothing in either module computes a margin, prints a boundary or flags a crossing. The subtraction is the reader's, at a station the reader chose, against a number the reader supplied.

## Exercise

Read the margin in the panel at 30000.00 ft and at 60000.00 ft and write both down.

Then say what U this line would have to have for the second of those to reach zero, and where you got that number.
