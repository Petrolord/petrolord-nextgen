# The Ibafo rack and farm end to end

This lesson reads the IBAFO depot's rack and tank farm as one morning's report. Every number is one the tier has already read. The point is to see them together, and to catch where a figure from one part could be misread as a figure from another.

{{panel:supply-depot-explorer}}

## The rack

The rack's inputs are 9 arrivals an hour, a mean of 24 minutes a load and 4 bays. The engine prints:

| item | value |
| --- | --- |
| offered load, erlangs | 3.6000 |
| utilisation | 0.900000 |
| probability of waiting (Erlang C) | 0.787753 |
| mean wait, minutes | 47.2652 |
| mean time on site, minutes | 71.2652 |
| mean queue length, trucks | 7.0898 |
| trucks per day at this arrival rate | 216 |

Read in order, these say: the traffic is an offered load of 3.6000 erlangs; each of the 4 bays is loading for 0.900000 of its time; an arriving truck finds every bay full with a probability of 0.787753; averaged over every truck, including those that load at once, the wait is 47.2652 minutes; and the yard holds 7.0898 trucks on average. Little's law ties the last two to the arrivals: 9 x 47.2652 / 60 = 7.0898.

The engine prints all of these for one rack. A report that quotes only the utilisation of 0.900000 leaves out the probability of waiting, 0.787753, and the mean wait, 47.2652 minutes.

## The margin of stability

The rack is stable. The sweeps show where stability ends: at 3 bays the rack is unstable, and at 10 arrivals an hour with 4 bays the engine refuses with its own sentence:

> REFUSED: The rack cannot keep up with arrivals. The queue grows without limit, so no average waiting time exists. Add a bay, load faster, or spread the arrivals.

A manager planning for traffic growth should read the arrivals sweep before the bay sweep. At 9.5 arrivals an hour the mean wait is 106.9703 minutes. The next step up has no average at all.

## The farm

The farm's four tanks, counted tank by tank:

| the farm | value |
| --- | --- |
| capacity m3 | 22500.000 |
| heel m3 | 655.000 |
| working capacity m3 | 21845.000 |
| stock m3 | 10732.700 |
| pumpable stock m3 | 10123.000 |
| ullage m3 | 11767.300 |
| daily throughput (liftings) m3 | 2640.000 |
| days of cover | 3.8345 |
| turns a year | 44.1108 |

The pumpable stock is the sum of each tank's stock above its own heel, never below zero. IB-T2 holds 164.700 m3 against a heel of 210.000 m3 and contributes 0.000 m3. The farm's stock less its heel, 10077.700 m3, is a figure the digest prints beside the engine's, with the note that it is not pumpable stock.

The days of cover divide the pumpable stock by the liftings, and they describe the farm as one pool of three products. The petrol that can be lifted today is IB-T1's 5078.400 m3.

## Where the two meet

The rack and the farm are separate engine calls, and they describe separate limits. The rack limits how fast product can leave. The farm limits how long there is product to send and how much room there is for the next receipt. The engine prints no figure that joins them. A report should keep them in separate tables with their own units.

## The questions a reader should ask

Of the rack: which Erlang figure is the probability, and what does the mean wait average over? Of the farm: is the pumpable stock counted tank by tank, and which tank is below its heel? Of both: which inputs were measured at IBAFO?

## Exercise

Read the IBAFO rack table and the farm table. Write two sentences a depot manager could put at the top of a morning report, one for the rack and one for the farm, each quoting the figures it rests on with their units. Then say which figure in each table a careless reader is most likely to lead with, and why it would mislead.
