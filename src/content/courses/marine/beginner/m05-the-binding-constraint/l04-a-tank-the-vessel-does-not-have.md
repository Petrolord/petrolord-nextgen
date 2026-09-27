# A tank the vessel does not have

{{panel:marine-voyage-calculator}}

An overloaded voyage is a result: the cargo is too much for a limit the vessel has, and another voyage or a larger vessel could carry it. A product the vessel has no tank for is a different problem. No voyage of that vessel can carry it at all. The engine therefore treats it as an input it cannot plan with and refuses it by name. This lesson draws that line.

## A tank of zero

Every product in a call needs a stated tank on the vessel, stated as zero when the vessel has none for it. A zero tank is accepted as long as nothing is loaded into it: on the small case the course uses for this, the voyage is feasible and the empty zero tank reports a utilisation of 0.000000.

Load that product and the engine refuses. On the Ekene milk run, with the PSV's brine tank stated as 0:

> vessel.tanks.brine must be above 0 to carry brine: the installations on the milk run ask for 85 m3 of it; got 0

The message names the tank, the product, how much the stops ask for, and the value it refused. The 85 m3 is the jack-up's brine, the only installation on the milk run that asks for it.

## Why a refusal and no overload

A utilisation needs a capacity to divide by. With a capacity of zero and a load above zero there is no finite utilisation, and no number of voyages of that vessel would ever carry the product. The engine says so at once, where an overload would report a ratio and let the plan continue. The fix lies outside the voyage: another vessel with a tank for the product, or a separate supply for it.

## Three tank faults and their messages

| fault | what the engine does |
| --- | --- |
| a tank stated as 0 with nothing loaded | accepts it; utilisation 0.000000 |
| a tank stated as 0 with a load of its product | refuses, naming the tank and the m3 asked for |
| a tank left out of the vessel | refuses: every product needs a stated tank |

The third fault reads:

> vessel.tanks.mud must be stated for every product (0 when the vessel has no tank for it); got nothing

## Where the problem sits

Each message starts with the field it refuses, so the panel points to the vessel's tank. The same cargo on a vessel with that tank plans normally. A planner who meets this refusal checks two things: whether the vessel really lacks the tank, and whether the product really needs to travel on this voyage.

## Exercise

In the voyage and fleet calculator, set View to "The voyage plan" and Start from to "Ekene PSV milk run, rainy season". Change "Tank brine, m3 (stated, 0 for none)" from 400 to 0 and read the refusal. Now clear "installation EKJ: brine, m3 (stated; not stated carries none)" so that no stop asks for brine, and predict, before reading, whether the voyage plans and which constraint binds. Check your prediction, then restore the brine tank to 400 and EKJ's brine to 85.
