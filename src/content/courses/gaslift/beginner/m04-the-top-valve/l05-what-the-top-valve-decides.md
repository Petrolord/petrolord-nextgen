# What the top valve decides

Valve 1 is not one answer among several. It is the origin every other mandrel is measured from, and it is the only depth in the string that later choices cannot move.

{{panel:pd-column-explorer}}

## Every depth below is measured from it

westTexasOil places eight valves and the increments shrink all the way down.

| From valve | To valve | Increment, ft |
| --- | --- | --- |
| 1 | 2 | 1563.466503048 |
| 2 | 3 | 1219.124638408 |
| 3 | 4 | 932.894452784 |
| 4 | 5 | 695.704880900 |
| 5 | 6 | 499.764326349 |
| 6 | 7 | 338.419771412 |
| 7 | 8 | 131.375432376 |

Move valve 1 and every one of those increments starts somewhere else. The surface pressure falls by a fixed amount per valve while the transfer pressure it must beat rises with depth, so the string runs out of room rather than out of valves.

## The one fixed point in a string that otherwise moves

The top valve comes from the kickoff pressure, the unloading wellhead pressure and the kill fluid gradient. The decrement is absent from that condition, so a decrement change reshapes the whole string and leaves valve 1 untouched. westTexasOil at 25.00 psi per valve stops on target depth with 8 valves; at 27.50 psi per valve it stops on minimum spacing with 7; at 35.00 psi per valve it stops with 6. Valve 1 sits at 2119.249955500 ft in all three, shifted by 0.000000000 ft.

## What it does not decide

Not the valve count: 8, 7, 6 and 7 across the four published designs. Not the stop reason, which is minimum spacing on deepHighPressure and target depth on the other three. Not a setting, a port or a dome charge. And not whether the string multipoints, which is settled stage by stage on closing behaviour valve 1 knows nothing about.

## The mistake

Treating a good top valve as a good design. westTexasOil places its first mandrel exactly where the condition says and still raises three multipointing warnings, at stages 2, 3 and 4. deepHighPressure raises none and stops on minimum spacing at 7 valves without reaching its 10500.0 ft target. A right first depth is necessary and nothing more.

## What the top valve refuses

It refuses to know about production. There is no inflow relation anywhere in the module, so nothing in this depth reflects what the reservoir gives, and nothing reflects a flowing annulus. It is a static pressure balance at one point, correct about exactly that.

## Exercise

Read the westTexasOil top valve, then change the decrement from 25.00 to 35.00 psi per valve and read it again along with the new valve count.

Write both, and state in one sentence what the decrement bought and what it left alone.
