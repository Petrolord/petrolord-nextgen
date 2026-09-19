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

One more barrel of naphtha arriving from outside can go to the reformer, which in the plan as typed runs at 97.07 percent and has room. The digest prints the working: what the reformer makes from a barrel at the stream values, less its operating cost, is 0.8500 x 111.0000 + 0.1000 x 0.0000 - 2.9000 = 91.4500, and the plan's naphtha value is 91.4500. Reformate at 111.0000, offgas at 0.0000, and the reformer's 2.9000 a barrel: the value of naphtha is the value of that path.

## Gasoil through a full unit

Gasoil is harder, and more instructive. The hydrotreater is at capacity. One more barrel of gasoil from outside cannot be hydrotreated, because the unit has no room. Yet its value, 94.1016, is not the Gasoil export price of 89.5000.

An outside barrel of gasoil takes a place in the hydrotreater's full feed, and the plan runs less of the crude it only partly runs. Bonny Light (illustrative) runs 329032.26 of 1500000.00 bbl. A barrel of it costs 81.3000 + 1.2500 (crude unit) = 82.5500, and at break-even that equals what its streams are worth: (82.5500 - 0.2300 x 91.4500 - 0.1500 x 105.5000 - 0.2800 x 59.0000 - 0.0300 x 0.0000) / 0.3100 = 94.1016, the plan's gasoil value.

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

Under the floors, naphtha prints 72.5000 and gasoil 89.5000, the same figures as their export prices.

With the hydrotreater left blank, gasoil prints 99.8560 and naphtha 83.6941. Removing a limit on one unit moved the value of the other unit's feed.

With the hydrotreater shut, gasoil prints 87.8029, which is neither its value as typed nor the export price. The digest prints no working for that row, so read it as the plan's figure and nothing more.

## The reading to carry

Each value here is a reading of a printed row. In the plan as typed, naphtha's 91.4500 is the reformer's working, with the reformer at 97.07 percent, and gasoil's 94.1016 is Bonny Light's break-even, with the hydrotreater at 100.00 percent. Under the floors the two print their export prices, 72.5000 and 89.5000. Read each value beside its unit's utilisation and beside the working SECTION 14 prints for it, where one is printed.

## Exercise

Read naphtha's value, 91.4500, beside Naphtha export's price, 72.5000, and the reformer's utilisation, 97.07 percent. Then read gasoil's value, 94.1016, beside Gasoil export's price, 89.5000, and the hydrotreater's utilisation, 100.00 percent. Say, for each stream, which home the plan is valuing the next barrel in, and why the full hydrotreater makes gasoil's case different from naphtha's.
