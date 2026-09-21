# The direct ignition table

{{panel:qr-event-tree}}

Where does an immediate ignition probability come from? One published answer is Purple Book Table 4.5, which gives the probability of direct ignition for stationary installations by substance class and release size. The engine carries it as `pbDirectIgnitionProbability`. This lesson reads the table, shows how the engine treats its band edges, and explains why no capstone in this course ever asks you to look a value up in it.

## Part of the table

| release | k1-liquid | gas-low-reactivity | gas-average-high-reactivity |
| --- | --- | --- | --- |
| continuous 5 kg/s | 0.065 (small) | 0.02 (small) | 0.2 (small) |
| continuous 10 kg/s | 0.065 (medium) | 0.04 (medium) | 0.5 (medium) |
| continuous 100 kg/s | 0.065 (medium) | 0.04 (medium) | 0.5 (medium) |
| continuous 200 kg/s | 0.065 (large) | 0.09 (large) | 0.7 (large) |
| instantaneous 1000 kg | 0.065 (medium) | 0.04 (medium) | 0.5 (medium) |
| instantaneous 20000 kg | 0.065 (large) | 0.09 (large) | 0.7 (large) |

The class and the size together pick one cell. A k1-liquid has the same probability at every size. A gas of average or high reactivity climbs steeply with size.

## The closed middle band

The printed middle band for a continuous release is "10 - 100 kg/s". A release of exactly 10 kg/s, or exactly 100 kg/s, could be read as belonging to either neighbour. The engine reads the middle band as CLOSED at both ends, so both edges fall in the middle band. The basis says, verbatim: "table lookup; the middle band is closed at both ends".

That is a reading, and the engine declares it rather than hiding it. An analyst who reads the band edges the other way will get a different cell at exactly 10 kg/s or 100 kg/s, and the basis string is where the two readings can be compared. The engine's validation record labels the band edge cells as its own reading and the interior cells as published.

## What the table rests on

The table cells and the 0.6 and 0.4 vapour cloud split are transcriptions of one source, read once. Nothing in the engine's validation checks them against a second reading. So this course teaches the table, and every capstone STATES the ignition probabilities and the split it uses rather than asking for a lookup. A lookup is never graded.

The substance class must be one the table has. The refusal, in the engine's own words:

> substance: must be one of k1-liquid, gas-low-reactivity, gas-average-high-reactivity (PB Table 4.7 classifies reactivity)

The same message comes back for a name every JavaScript object carries, because the engine looks a class up only among the names it defines itself.

## A golden case from the table

The golden case flammable-pb-table-4.5-large-gas runs a large gas release through the event tree with its immediate ignition taken from the table. Through the engine it gives jet or pool fire 0.000017500000, flash fire 0.000001350000, explosion 0.000000900000 and no ignition 0.000005250000 per year. Because the immediate ignition probability there is high, most of the release ends in the jet or pool fire.

## Exercise

Read the table for a continuous release of gas-average-high-reactivity at 100 kg/s and at 200 kg/s. Write both probabilities and their bands. Then say what the engine returns at exactly 10 kg/s for the same class, and name the words in the basis that decide it.
