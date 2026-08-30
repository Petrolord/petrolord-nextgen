# The span walk

How the volumes are computed, and why they are exact.

{{panel:wc-volume-explorer}}

## The method

Walk down the inside of the string, span by span, and up the annulus, span by span. For each span:

    capacity = cross-sectional area
    volume   = capacity x length

Add them up. That is the whole calculation.

## Why it is exact

Because there is no model in it. A capacity is a geometric area computed from two diameters, and a length is a difference of two measured depths.

Everything else in this course rests on a measurement, an assumption or a correlation. The volumes rest on arithmetic, and they are the only part of well control that is exact.

## What can still be wrong

**The string description.** If the tally is wrong, the volume is wrong. That is a bookkeeping error and it is the commonest one.

**The hole size.** The annulus uses the hole diameter, and a washed-out hole is bigger than the bit that drilled it. So the annulus volume is a minimum, and the real one is larger.

That is why the annulus volume is checked against a bottoms-up circulation whenever there is an opportunity: pump a marker and count the strokes until it comes back.

## The two sides

The STRING side uses the components' inside diameters. The ANNULUS side uses the hole diameter and the components' outside diameters.

They are different lists with different lengths, because the annulus stops at surface and the string stops at the bit, and both are covered by the same survey.

## The horizontal well in this course

| quantity | value |
|---|---|
| string volume | 24.23065791 m3 |
| annulus volume | 67.365410592 m3 |
| total circulating | 91.59606850160318 m3 |
| bit measured depth | 2800 m |

The annulus is nearly three times the string. That ratio is typical and it is why bottoms up takes so much longer than pumping to the bit.

## Exercise

For the drill pipe in this course, 0.1086104 m inside diameter, compute the capacity per metre.

Then compute how many metres of drill pipe it takes to hold one cubic metre, and check it against the string rows in the panel.
