# Fuel burn by activity

{{panel:marine-voyage-calculator}}

A supply vessel burns fuel at very different rates depending on what it is doing. Under way at service speed its main engines work hard; alongside an installation it holds position on thrusters; tied up at the base it runs little more than generators. The engine keeps a stated burn for each of the three activities and multiplies it by the hours spent in that activity.

## Fuel follows time

Fuel for an activity is its hours times the stated tonnes an hour for that activity. A voyage's fuel is the sum over sailing, port and field. There is no speed-cube law and no curve of fuel against speed or weather: the burn at the stated speed is an input, and the weather factor raises fuel only through the hours it adds.

The Ekene PSV burns 0.5 t an hour sailing, 0.03 t an hour in port and 0.3 t an hour at the field. On the milk run:

| weather | sailing t | port t | field t | total t |
| --- | --- | --- | --- | --- |
| calm | 9.363636 | 0.360000 | 6.900000 | 16.623636 |
| rainy season, factor on sailing and field | 11.236364 | 0.360000 | 8.280000 | 19.876364 |
| rainy season, factor on every activity | 11.236364 | 0.432000 | 8.280000 | 19.948364 |

Check one cell by hand. The rainy-season sailing hours are 22.472727; at 0.5 t an hour they burn 11.236364 t. The port hours are 12.000000; at 0.03 t an hour they burn 0.360000 t.

## Where the burn rates come from

Skoko et al. print a PSV's burn as 0.5 t an hour sailing and 0.03 t an hour in port (their Table 1), and the Ekene PSV uses those two figures. Its field burn of 0.3 t an hour is the fixture's own stated input. The AHTS Ekene Tide burns more in every activity: 0.600000 sailing, 0.040000 in port and 0.400000 at the field. A planner with a vessel's own consumption records states those figures in place of any published ones.

## Why port burn matters so little here

At 0.03 t an hour, even a long stay at the base adds little fuel. Naming port time in the weather allowance lifts the port hours from 12.000000 to 14.400000, yet the voyage's fuel moves only from 19.876364 to 19.948364 t. Sailing and field time carry almost all of the fuel, so the weather choice that matters most for fuel is whether the factor applies to them.

## A missing burn is refused

Every burn is required. Clear the port burn and the engine refuses by name:

> vessel.fuelTPerHour.port must be a finite number at or above 0; got nothing

A burn of zero is accepted, since a vessel might truly burn nothing in port on shore power; it must still be stated.

## Exercise

In the voyage and fleet calculator, set View to "The voyage plan" and Start from to "Ekene PSV milk run, rainy season". Multiply each hour column of the voyage table by its burn and check your three fuel figures against the fuel table the panel prints. Then clear "Fuel in port, t an hour (stated)" and read the refusal; type 0.03 back. Finally, set Start from to "Ekene AHTS milk run", read its three burns off the fuel controls, and compare its total fuel with the PSV's.
