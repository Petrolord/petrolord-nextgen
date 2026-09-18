# Four bands and their lower edges

A score on its own is hard to act on. A band groups scores so that a register can say which risks need attention first. This register has four bands, and the way the engine finds a score's band has one feature that surprises nearly everybody who reads the band table for the first time.

{{panel:rc-risk-explorer}}

## The band table

The bands, as the engine carries them, highest first:

| band | lower edge | upper edge as written |
| --- | --- | --- |
| "Critical" | 15 | 25 |
| "High" | 10 | 14 |
| "Medium" | 5 | 9 |
| "Low" | 1 | 4 |

Each band is found by its LOWER edge only. A reading that gives the engine's answer every time is to start at the top and ask whether the score reaches 15. If it does, the band is "Critical". If not, ask whether it reaches 10, and so on down to 1. The first lower edge the score reaches is its band.

## The edges either side

These are the engine's answers for the scores at and around every edge:

| score | band |
| --- | --- |
| 1 | "Low" |
| 4 | "Low" |
| 5 | "Medium" |
| 9 | "Medium" |
| 10 | "High" |
| 14 | "High" |
| 15 | "Critical" |
| 25 | "Critical" |

A score equal to a lower edge belongs to that band. 10 is "High" and 15 is "Critical". There is no gap between bands: the upper edge of one band sits one below the lower edge of the next.

## The upper edge is a label

Now the surprise. A score above the grid still bands. A score of 26, which no cell of the grid can produce, reads "Critical". A score of 14.5 reads "High" and 4.5 reads "Low". Because the band is found by the lower edge alone, the upper edge printed in the band table is a label rather than a limit. The engine never checks that a score is at or below 25, or that a "High" score is at or below 14.

This is a stated limit of the engine, and this course teaches it as one and grades nothing on it. On a well-kept register it makes no difference, because two whole levels from 1 to 5 can only produce scores the grid holds. It matters when a score arrives from somewhere other than the product of two levels, because then any positive score finds a band.

## Below the lowest edge

A score of zero or below reads "None". A score of 0 is "None" and a score of -3 is "None". "None" is the one band that means no score. It is kept apart from the four bands above so that an unscored risk can never be counted as "Low".

## The mistake

The mistake is to read the band table as four closed boxes, each with a floor and a ceiling. It is four floors. A score climbs until it reaches one, and the ceiling printed beside each floor is written for people. When you check a band, compare the score with the lower edges only, from the top down.

## Exercise

Record the lower edge of each of the four bands. Record the engine's band for scores of 9, 10, 14.5, 26, 0 and -3, and for each one state which lower edge decided it, or why no edge did.
