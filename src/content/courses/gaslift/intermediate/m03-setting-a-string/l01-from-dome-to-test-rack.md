# From dome to test rack

Setting one valve runs in a fixed order, and every step in it consumes a number that the step before produced.

{{panel:pd-valve-explorer}}

## The order

The stage supplies a surface pressure. The gas column carries it to the valve's own depth. The transfer line supplies the pressure on the other side of the port. R comes from the port and the bellows. The force balance turns those into a dome pressure at valve temperature. The nitrogen correction turns that into a 60 degF charge. One over one minus R turns the charge into the rack opening.

| Step | westTexasOil valve 3 | westTexasOil valve 6 |
| --- | --- | --- |
| Stage surface pressure, psia | 964.7000 | 889.7000 |
| Depth, ft | 4901.841136177 | 7030.204796212 |
| Injection at depth, psia | 1081.577737180 | 1042.637993700 |
| Production at depth, psia | 604.884113618 | 817.720479621 |
| Valve temperature, degF | 155.145712782 | 179.089803957 |
| Dome at temperature, psia | 1051.188589741 | 1028.299535707 |
| Dome at 60 degF, psia | 870.463855622 | 817.570604431 |
| Rack opening, psia | 929.734277193 | 873.239491858 |

## Which surface pressure

Valve 3 is set on 964.7000 psia and not on the 914.7000 psia the well will operate at. Every valve is set on the injection pressure its own stage shows at its own depth, because that is the moment the valve has to open. Use the operating pressure instead and the error changes sign down the string: on westTexasOil the stages above valve 5 sit higher than 914.7000 psia and the stages below it sit lower, so valves 1 through 4 would be set too soft and valves 6 through 8 too stiff, by amounts that grow with distance from the operating stage.

The engine does carry the operating pressure, but only to answer a separate question, whether the valve is shut once unloading is finished.

## The mistake

Reading the chain backwards from a rack sheet. Two valves can share a rack opening and have nothing else in common, because the same charge lands at different dome pressures at different temperatures. A rack sheet without depths is not a design, and a rack sheet copied to a well with a different temperature profile is a different set of valves.

## What it refuses

The chain never asks whether the well can flow at any of these depths. There is no IPR in the module and no multiphase outflow: the production pressures in that table come from a straight unloading gradient of 0.1 psi/ft above 114.7 psia, declared as an input. The engine does not pretend that line is a real flowing traverse.

## Exercise

Work the chain for westTexasOil valve 3 in the panel, from the stage pressure to the rack opening, and write down every intermediate number.

Then repeat it with the operating pressure of 914.7000 psia in place of the stage pressure and say which numbers move and in which direction.
