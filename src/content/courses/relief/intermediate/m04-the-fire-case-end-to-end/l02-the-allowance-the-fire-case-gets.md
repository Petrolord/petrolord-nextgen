# The allowance the fire case gets

{{panel:fc-fire-drum-explorer}}

The overpressure allowance is the percentage above set pressure the valve is permitted to reach while relieving. It is stated rather than computed, and the fire case is customarily allowed more of it than a process case. That one number moves the answer in a direction most readers guess backwards.

## How the relieving pressure is built

| step | value |
| --- | --- |
| set pressure, stated | 275.000000 psig |
| overpressure, stated | 21.000000 percent |
| atmospheric constant, measured out of the engine | 14.700000000000 |
| relieving pressure | 347.450000 psia |

The set pressure is raised by the allowed overpressure fraction and then converted to absolute with the atmospheric constant. That constant is measured rather than typed: three separate questions all recover the same figure, which is how the course knows the whole module shares one atmosphere.

Note the units. A set pressure arriving in psig and a relieving pressure leaving in psia is where a great many errors on this step live.

## The same chain at two allowances

| overpressure | relieving psia | required area in2 | orifice |
| --- | --- | --- | --- |
| 21.000000 percent | 347.450000 | 1.578271 | K |
| 10.000000 percent | 317.200000 | 1.728783 | K |

Read the direction. A larger allowance gives a higher relieving pressure, and a higher relieving pressure gives a smaller required area. The same load through a higher pressure needs less flow area, because a critical nozzle passes more mass per unit area as the upstream pressure rises.

That is the part people get backwards. A bigger allowance sounds like a concession that ought to cost something. In the sizing arithmetic it buys area back.

Both rows land on the same letter here, which is a useful reminder about the ladder: a change in the required area only shows up as a change in the answer when it crosses an orifice boundary.

## Why the fire case gets more

A process case overpressure is an allowance for normal relieving duty. A fire case is a survival scenario, so the standards permit a higher accumulation. That is a published convention, and the engine holds no opinion about it: the allowance is a number you type, and it will accept any positive one.

So the discipline is yours. Type a fire allowance into a process case and you have sized the valve small for the case you claimed. The number looks ordinary on the screen.

## The allowance and the load are independent

One more thing the table settles. The overpressure allowance moves the relieving pressure and nothing else in the chain. The wetted area, the duty and the relief load are identical on both rows, because none of them takes a pressure. The allowance enters at the sizing step and only there.

So a fire case has two pressure questions in it: what pressure the vessel may reach, and what pressure the liquid is boiling at. They are related on the plant and unrelated in this engine, and the second never appears as an input.

## The record this step demands

Three things go together in a case record and none is meaningful alone: the set pressure with its unit, the overpressure percentage, and the case name justifying it. A relieving pressure quoted without the allowance behind it cannot be checked, because several set pressures reach the same one.

## Exercise

Build the relieving pressure from the stated set pressure, the stated overpressure and the atmospheric constant, quoting all four figures. Then give the required area at both allowances, state which direction the area moves as the allowance grows, and explain in one sentence why it moves that way.
