# The transfer line

While a well is unloading, the tubing carries an aerated column, and the pressure that column shows at a valve is what the injection line has to beat.

{{panel:pd-column-explorer}}

## Wellhead pressure plus a lifted gradient

The transfer line is the unloading wellhead pressure plus a declared lifted gradient. On `westTexasOil` that is 114.7 psia and 0.1 psi/ft, and at the published valve depths it reads:

| Valve depth, ft | Transfer pressure, psia |
| --- | --- |
| 2119.249994721 | 326.624999472 |
| 3682.716497769 | 482.971649777 |
| 4901.841136177 | 604.884113618 |
| 5834.735588962 | 698.173558896 |
| 6530.440469862 | 767.744046986 |
| 7030.204796212 | 817.720479621 |
| 7368.624567624 | 851.562456762 |

The other published cases declare their own pairs: 214.7 psia with 0.12 psi/ft, 164.7 psia with 0.08 psi/ft, 154.7 psia with 0.09 psi/ft.

## It climbs about four times as fast as the gas

The injection column on that same well starts at 1014.7 psia with a local gradient of 0.025405143 psi/ft and falls to 0.024893071 psi/ft by 8000 ft. The transfer line climbs at 0.1 psi/ft the whole way. Two lines rising together where one rises about four times faster will meet, and where they meet is what ends a string. The gap at the top valve is the difference between 1014.7 psia at surface and 326.624999472 psia in the tubing, and by 7368.624567624 ft the tubing side alone has reached 851.562456762 psia.

## The differential is a decision

The design does not wait for the lines to touch. It demands a margin: 50.0 psi on `westTexasOil`, 75.0 psi on `deepHighPressure`, 100.0 psi on `constantPressurePPO`, 60.0 psi on `midDecrementKnifeEdge`. That number is chosen, not derived, and it moves every depth in the string. A larger differential is a safer transfer and a shallower well, and nothing in the engine will tell you which trade you wanted.

## The mistake

Reading the transfer line as the well's flowing production traverse. It is not. It describes the tubing during unloading with an assumed lifted gradient, and it takes no account of rate, of water cut, or of anything multiphase. The module has no outflow model at all: the flowing traverse it needs to locate the deepest injection point is passed in from outside as a depth and pressure table. Feed the transfer line into a production forecast and you have used an unloading assumption as a flowing answer, with no warning anywhere, because the number was never labelled as a forecast in the first place.

## What it refuses

Like the unloading line, it is a straight line on a constant gradient by declaration. A real lifted column is neither, and the engine does not claim it is.

## Exercise

Read the transfer pressure at the shallowest and deepest published `westTexasOil` valve depths, and note how much of the rise is the 0.1 psi/ft term.

Then say what happens to every one of those pressures if the lifted gradient is revised to 0.08 psi/ft.
