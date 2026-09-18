# Sigma, the input nobody measured

Of the two numbers that describe the droplet population, the median is the one people can usually put a hand on. The spread is the one that gets typed in from memory, left at a default, or copied from the last project. It is also the one that moves the answer hardest.

## One device, one water, five spreads

Hold everything still. The same stream, the same device, a cut size of 12 micron, and only the log standard deviation of the droplet population moved:

| sigma | removal at a 12 micron cut, percent | outlet median micron | warning |
| --- | --- | --- | --- |
| 0.5 | 84.480253 | 15.793311 | none |
| 0.7 | 80.243119 | 12.244813 | none |
| 0.8 | 78.263077 | 10.953502 | none |
| 1 | 74.748250 | 8.988225 | none |
| 1.5 | 68.402514 | 5.944722 | sigma outside the customary band |

## Why a wider spread treats worse

A wide distribution puts oil volume into droplets far below the cut size, and those droplets go straight through. It puts volume into very large droplets as well, but those were being caught anyway, so the coarse end has nothing left to give. The two effects do not cancel, and the result is the column above: at a fixed cut size, the wider the population, the less of the oil comes out. The device is unchanged throughout, so nothing in that column can be blamed on the equipment or on how it was sized.

## The outlet column is the other half

Read the outlet median column alongside it. A wide inlet population leaves a much finer outlet population behind, because the device has skimmed the coarse end off a distribution that reached further in both directions. The stream leaving the widest row is the hardest water in the table for the next device to treat, and it came out of the same equipment as every other row.

## The band, and where the module stops

The module warns outside a spread of 0.5 to 1 and refuses above 2. The warning says the figure is outside the customary band while still returning the answer, and the refusal says a log standard deviation above the stated maximum is wider than produced water carries. That pair is the ordinary pattern of this engine: doubt is reported and the number still arrives, while a value the method has nothing to say about is declined by name.

## What to do about an input you cannot measure

The honest response is a range. Run the population at the low end and the high end of what is plausible and look at the two answers, exactly as the table above does. If the design decision is the same at both ends, the missing measurement does not matter. If it is not, the measurement has just justified its own cost, and that is a far stronger argument for a droplet sizing campaign than any assertion about a single spread nobody measured.

{{panel:pw-water-explorer}}

## Exercise

Say why the removal column falls as the spread widens, using the outlet median column to support the answer. Then describe what you would do about a design whose verdict changes between a sigma of 0.5 and a sigma of 1.
