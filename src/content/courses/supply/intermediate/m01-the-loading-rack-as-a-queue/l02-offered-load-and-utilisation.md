# Offered load and utilisation

Two figures carry the queue model before any probability appears: the offered load and the utilisation. Both are ratios of the three inputs, both are easy to compute, and both are easy to misread. This lesson sets them apart so that the next one can show what neither of them says.

{{panel:supply-depot-explorer}}

## The offered load

A bay that takes a mean of 24 minutes a load can manage 60 / 24 loads an hour. The engine divides the arrivals an hour by that rate:

offered load (erlangs) = arrivals per hour / (60 / load minutes)

At IBAFO, 9 arrivals an hour at 24 minutes a load give an offered load of 3.6000 erlangs. The digest gives the erlang no definition beyond that formula, so read the offered load as the formula prints it: the arrivals an hour over the loads one bay manages an hour. It is a property of the traffic and the load time. Adding or removing a bay leaves it where it is.

## Utilisation

The utilisation shares the offered load over the bays:

utilisation = offered load / bays

With 4 bays, IBAFO's utilisation is 0.900000. Read it as the share of each bay's hour spent loading, on average across the bays.

The arrivals sweep at 4 bays and 24 minute loads shows the two figures moving together, because the bays are held:

| arrivals per hour | offered load erlangs | utilisation |
| --- | --- | --- |
| 6 | 2.4000 | 0.600000 |
| 7 | 2.8000 | 0.700000 |
| 8 | 3.2000 | 0.800000 |
| 9 | 3.6000 | 0.900000 |
| 10 | 4.0000 | 1.000000 |

The bay sweep at 9 arrivals an hour holds the offered load at 3.6000 erlangs and moves only the utilisation:

| bays | utilisation |
| --- | --- |
| 3 | 1.200000 |
| 4 | 0.900000 |
| 5 | 0.720000 |
| 6 | 0.600000 |
| 7 | 0.514286 |

## The trap in a high utilisation

A utilisation of 0.900000 sounds like a rack with room to spare. The bays stand idle for part of every hour, and a site report that shows only utilisation will call the rack comfortable. What the figure hides is when the idle time happens. A truck waits only when every bay is busy at once, and idle time on some bay at some other moment does nothing for it. The next lesson puts a probability on that.

A utilisation of one or more is a different kind of figure. At 3 bays the utilisation reads 1.200000: the arriving work needs more bay time than the rack has, hour after hour, without end. The engine reports that case as unstable, and module two shows what it prints in place of a wait.

## Units matter here

The offered load is in erlangs and prints to four decimals. The utilisation is a plain fraction and prints to six. They are different quantities, and they happen to share their digits only on a rack of one bay. Quote each with its name, and quote the bay count beside any utilisation, because a utilisation without its bays cannot be turned back into traffic. The same care applies to the load time: it is the mean minutes a truck holds a bay, and the whole chain above depends on it being measured at the rack in question.

## Exercise

Read the offered load and the utilisation for IBAFO at 9 arrivals an hour, 24 minutes a load and 4 bays. Then read the bay sweep at the same traffic. Say which of the two figures stays fixed as the bays change and which one moves, and say what the row at 3 bays shows about a rack whose utilisation is above one.
