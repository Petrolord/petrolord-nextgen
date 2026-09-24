# The median absolute deviation

{{panel:dq-outliers-explorer}}

The median gives a centre an outlier barely moves. The median absolute deviation, the MAD, gives a spread with the same property. Take the median of the series, take the absolute distance of every value from it, and take the median of those distances. That last median is the MAD.

| series | median | MAD |
| --- | --- | --- |
| EKENE-3 gauge | 212.500000 | 0.100000 |
| EKENE-7 core | 0.215500 | 0.007500 |

## Working the gauge by hand

The gauge median is 212.500000 degF. The ten absolute distances from it are small for nine readings, a few tenths of a degree at most, and large for entry 7 alone. Sorted, the one large distance sits at the top of the list, where it cannot reach the middle. The engine returns 0.100000.

Compare that with the sample standard deviation of the same ten readings, 8.732220. The standard deviation squares every deviation before averaging, so the one large deviation dominates it. The MAD takes the middle of the deviations, so the same one large deviation is simply the largest of ten and changes nothing.

## The raw MAD and its scaled form

The engine's MAD is the RAW median of the absolute deviations. It is not multiplied by anything. A raw MAD and a standard deviation sit on different scales even for well behaved data, so a rule that mixes them has to say how it converts one to the other.

Two conversions appear in this course, and each rule names its own:

* the modified z-score multiplies the deviation from the median by 0.6745 and divides by the raw MAD, as Iglewicz and Hoaglin wrote it and NIST/SEMATECH 1.3.5.17 prints it;
* the Hampel window multiplies the raw MAD by 1.4826 and calls the product a spread in standard deviation units, as the petrophysics conditioning engine does.

The lesson after next takes the two apart. Whenever a spread built from the MAD appears in a report, the report should say whether it is the raw MAD or 1.4826 x MAD. A reader who assumes the wrong one misreads every threshold by the same factor.

## The MAD on the core plugs

On EKENE-7's fourteen core plugs the median is 0.215500 v/v and the MAD is 0.007500. The median of fourteen absolute deviations is the midpoint of the two middle ones, and the fractured plug at entry 8 again sits at the top of the list.

## Where the MAD breaks

The MAD has one weakness, and it is the mirror of its strength. Because it looks only at the middle of the deviations, if more than half of the values sit exactly on the median, the middle deviation is zero. A spread of zero cannot be divided by, and the last lesson of this module shows the engine's refusal in that case.

## Exercise

Open the explorer's modified z view with the core plugs loaded and read the median, 0.215500, and the raw MAD, 0.007500. By hand, list the absolute deviation of each plug from 0.215500, sort them, and check that the midpoint of the two middle values matches the engine's MAD. Say which plug's deviation sits at the top of your sorted list.
