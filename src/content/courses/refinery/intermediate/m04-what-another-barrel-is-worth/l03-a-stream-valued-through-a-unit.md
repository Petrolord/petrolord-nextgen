# A stream valued through a unit

Two of ABUA's streams have a choice of homes: sold as they are, or fed to a unit that turns them into something else. For both, the plan prints a value that is neither export price. This lesson reads naphtha and gasoil, and follows their values through the five changes.

{{panel:refinery-plan-explorer}}

## The two rows

| stream | marginal value ($/bbl) | surplus (bbl) | product it goes into, at its price | unit it feeds |
| --- | --- | --- | --- | --- |
| naphtha | 91.4500 | 0.00 | Naphtha export 72.5000 | Naphtha reformer |
| gasoil | 94.1016 | 0.00 | Gasoil export 89.5000 | Diesel hydrotreater |

Module 3 found both streams consumed in full by their units, and both export products selling 0.00 bbl. So the plan is sending every barrel of naphtha to the reformer and every barrel of gasoil to the hydrotreater, and neither export price is what the next barrel earns.

## Naphtha through the reformer

One more barrel of naphtha arriving from outside can go to the reformer, which in the plan as typed runs at 97.07 percent and has room. Running it there makes reformate 0.8500 and offgas 0.1000, and charges the reformer's operating cost of 2.9000 dollars a barrel. Reformate is worth 111.0000 to the plan. Offgas is worth 0.0000. The plan's value of naphtha, 91.4500, is the value of that path: what the reformer's products are worth to the month, less what the reformer charges to make them. The digest prints the value. It does not print the working, so read it as the plan's answer and let the explorer show you the path.

## Gasoil through a full unit

Gasoil is harder, and more instructive. The hydrotreater is at capacity. One more barrel of gasoil from outside cannot be hydrotreated, because the unit has no room. Yet its value, 94.1016, is not the Gasoil export price of 89.5000.

The reason is that an outside barrel of gasoil does not have to go where the next crude barrel's gasoil would. It can take a place in the hydrotreater's full feed, and the plan can then run a little less crude to make that feed. The value prints what that rearrangement is worth. How the plan reaches 94.1016 exactly is inside the solution, and the digest prints the figure alone.

## The two values under the five changes

| change | naphtha | gasoil |
| --- | --- | --- |
| the plan as typed | 91.4500 | 94.1016 |
| the diesel hydrotreater typed as shut for a turnaround (capacity 0) | 91.4500 | 87.8029 |
| the diesel hydrotreater capacity left blank (no limit) | 83.6941 | 99.8560 |
| the crude unit at 1900000 barrels for the month | 91.4500 | 99.8560 |
| the Forcados cargo cancelled (availability typed 0) | 83.6941 | 99.8560 |
| a jet floor of 300000 and a fuel oil floor of 700000 | 72.5000 | 89.5000 |

Read three things.

Under the floors, naphtha prints 72.5000 and gasoil 89.5000, the same figures as their export prices. In that plan the next barrel of each is valued as an export sale.

With the hydrotreater left blank, gasoil prints 99.8560 and naphtha 83.6941. Removing a limit on one unit moved the value of the other unit's feed. A stream's value is a property of the whole plan.

With the hydrotreater shut, gasoil prints 87.8029, which is neither its value as typed nor the export price. A shut unit changes where the next gasoil barrel goes, and the plan prices the new path.

## The reading to carry

A stream that feeds a unit is valued through that unit when the unit is the better home and has room, and through whatever the plan rearranges when it does not. It is valued at its export price only when the export is where the plan would send the next barrel, as under the floors. Read the value beside the unit's utilisation, and the unit's utilisation will tell you which case you are in.

## Exercise

Read naphtha's value, 91.4500, beside Naphtha export's price, 72.5000, and the reformer's utilisation, 97.07 percent. Then read gasoil's value, 94.1016, beside Gasoil export's price, 89.5000, and the hydrotreater's utilisation, 100.00 percent. Say, for each stream, which home the plan is valuing the next barrel in, and why the full hydrotreater makes gasoil's case different from naphtha's.
