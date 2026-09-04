# The rating term

The part of the row that has nothing to do with the well: what the element is rated to, times how much of that you are willing to use.

{{panel:wi-annulus-explorer}}

## Rating times factor

    ratingTerm = factor * limitPa

`limitPa` is the element's pressure limit at its own depth: a burst rating for a casing, a collapse rating for an inner string, a fracture strength for a shoe, a working pressure for a wellhead. The engine does not derive it and cannot check it. It is an input, and it is the input most often wrong on a real well, because it comes off a tally that may not describe the pipe actually in the hole.

`factor` is the fraction of that rating you will use. Nothing else in the row changes when you change it, which makes the derating easy to isolate.

## The same element at five factors

Hold one element fixed, a 40000000 Pa limit at 1435.457478934607 m vertical with the annulus at 1200 kg/m3 and 1030 kg/m3 behind it, and vary only the role factor:

| role | factor | rated limit, Pa | allowable, Pa |
|---|---|---|---|
| outer-casing-burst | 0.5 | 20000000 | 17606905.05541501 |
| inner-tubing-collapse | 0.75 | 30000000 | 27606905.05541501 |
| inner-casing-burst | 0.8 | 32000000 | 29606905.05541501 |
| shoe-formation | 1 | 40000000 | 37606905.05541501 |

The hydrostatic term is identical on all four rows, 2393094.944584991 Pa, because nothing that feeds it changed. Every difference in the last column is a difference in the first term, and the whole span from strictest to loosest, 17606905.05541501 to 37606905.05541501, is bought and sold by the factor alone.

## Why the factor cannot exceed 1

The engine throws if a factor is above 1, and it throws if it is zero or below.

A factor is a derate. It exists to hold something back for wear, corrosion, temperature or manufacturing tolerance, and to admit that a pressure limit is not a cliff edge. A number above 1 would be an uprate, a claim that the element is stronger than its rating, and no such claim belongs in an integrity calculation.

Zero is refused for a different reason. An element with no capacity is not an element with a factor of zero, it is a failed element, and that belongs in the barrier envelope from the Associate tier rather than in this table.

## Exercise

In the panel, set every candidate factor to 1 and read the governing name.

Then set the outer casing factor to 0.5 alone and read it again. Say what the factors did to the identity of the governing element, not just to the number.
