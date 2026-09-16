# The four screening branches

The machine screen takes an inlet volume, an overall ratio and a brake power and returns a machine type with a reason. The reason is the part worth reading.

{{panel:fc-compressor-explorer}}

## Four duties, and the branch each one reached

A small high-pressure gathering duty at 14.6564 acfm, an overall ratio of 3.000000 and 180.0000 brake hp comes back "reciprocating", because only 14.7 acfm at suction is below about 500 acfm where a centrifugal wheel is too small to be efficient, and because under 200 bhp a packaged gas-engine recip is the usual answer.

A large low-pressure gathering duty at 43053.4421 acfm, an overall ratio of 2.600000 and 14500.0000 brake hp comes back "centrifugal": 43053 acfm at a modest ratio is centrifugal territory, and over 10,000 bhp is turbine-driven centrifugal territory.

A deep booster at 2015.0151 acfm, an overall ratio of 11.500000 and 2100.0000 brake hp comes back "reciprocating", because recips take ratio far more happily than centrifugals.

And a duty at 7962.6965 acfm, an overall ratio of 3.000000 and 5000.0000 brake hp comes back "either", where both machine types are viable and the decision goes on availability, footprint, maintenance philosophy and driver.

## Two roads to the same word

Across those 4 duties there are 4 distinct first reasons. There are not 4 distinct recommendations, because two of the duties reach "reciprocating" and they reach it by different roads: one because the inlet volume is too small for a wheel, the other because the ratio is too high for one.

That is the argument for reading the reason line. The branch is decided on the inlet volume first and on the ratio second, so a recommendation on its own does not say what would change it. A recip chosen for size becomes a wheel if the duty grows. A recip chosen for ratio does not.

## The honest fourth answer

"Either" is a real return. A screen that always named a machine would be pretending to a resolution it does not have, and the reason line for that branch hands the decision back with the criteria attached.

## The thresholds are held

The figures the screen turns on, 500 and 5000 and 20000 acfm, ratios of 4 and 6, and 200 and 10000 brake hp, are customary and unsourced in this repository. They are HELD FOR LITERATURE and no graded value in this course is a recommendation.

## A volume has to be positive

The screen asks for the compressibility before it asks for the volume, so a bad suction state is refused by name rather than arriving as a strange volume. Finiteness alone would not have caught it: a negative number is finite, a suction below absolute zero produces a negative volume, and a screen checking only for finiteness would find that volume to be below about 500 acfm and recommend a reciprocating machine on it.

## Exercise

Give the four screening duties, the recommendation each reached and the first reason for each. Explain why there are four distinct reasons and fewer distinct recommendations, say why "either" is a useful answer, and state why the screen checks the suction state before it computes a volume.
