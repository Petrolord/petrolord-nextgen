# Bays are whole numbers

The offered load at IBAFO is 3.6000 erlangs. That figure is the arrivals an hour over the loads one bay manages an hour. It is tempting to read it as a bay count and to conclude that the rack needs 3.6000 bays. A rack cannot have a fraction of a bay, and the engine refuses to pretend otherwise.

{{panel:supply-depot-explorer}}

## What the engine refuses

The engine refuses a bay count that is not a whole number, one or more:

| bays (stated) | the engine answers |
| --- | --- |
| 0 | REFUSED: The number of bays must be a whole number, one or more. |
| 2.5 | REFUSED: The number of bays must be a whole number, one or more. |
| none | REFUSED: The number of bays must be a whole number, one or more. |

Each row keeps IBAFO's 9 arrivals an hour and 24 minute loads. A rack of no bays loads nothing. A rack of 2.5 bays does not exist. A blank bay count is a missing input, and the engine does not fill it with a typical figure. In every case the refusal is the answer, and a panel or a spreadsheet that quietly rounds 2.5 up has changed the question without saying so.

The load time is checked the same way. With 9 arrivals an hour and 4 bays, a load time of 0 minutes is refused: "Arrival rate and load time are both needed." A load that takes no time is a missing measurement, and the engine treats it as one.

## From offered load to bays

The offered load is a property of the traffic. The bay count is a design decision. The link between them is the stability test: a rack is stable only when its utilisation, the offered load over the bays, is below one. The bay sweep at 9 arrivals an hour shows where that line falls:

| bays | utilisation | stable |
| --- | --- | --- |
| 3 | 1.200000 | false |
| 4 | 0.900000 | true |
| 5 | 0.720000 | true |

At 3 bays the rack is unstable and the queue grows without limit. At 4 bays it is stable. So the smallest whole rack that can keep up with IBAFO's traffic has 4 bays, and it runs at a utilisation of 0.900000.

Stable is a low bar. The earlier lessons showed that at 4 bays an arriving truck waits with a probability of 0.787753. Being able to keep up on average and serving trucks promptly are separate standards, and a design is judged against the second. Module two's last lesson reads the sweep as a design choice.

## Why the refusal protects you

A fractional bay count can enter a model by accident. A spreadsheet divides throughput by a bay rate and passes the quotient straight on. A form field is left empty and a default fills it. Each produces a queue figure that looks as precise as a real one. The engine's refusal makes the mistake visible at the point it is made, which is the cheapest place to catch it.

The same rule appears later in this tier with other whole things: trucks in a fleet and nozzles on a forecourt. In each case the engine works in whole units and reports what the ceiling buys.

## Exercise

Read the three refused bay counts and the engine's sentence for each. Then read the bay sweep rows at 3, 4 and 5 bays. Say what the offered load of 3.6000 erlangs tells you about the bay count, why the engine will not accept it as one, and which whole rack in the sweep is the smallest that is stable.
