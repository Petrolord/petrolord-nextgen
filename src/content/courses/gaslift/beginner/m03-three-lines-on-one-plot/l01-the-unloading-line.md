# The unloading line

The kill fluid gradient is the exchange rate between pressure and depth. Every surplus psi of injection pressure buys a fixed number of feet, and the fluid decides how many.

{{panel:pd-column-explorer}}

## A gradient nobody computes

Each published case declares its kill fluid gradient outright: 0.45 psi/ft on `westTexasOil`, 0.5 psi/ft on `deepHighPressure`, 0.42 psi/ft on `constantPressurePPO`, 0.46 psi/ft on `midDecrementKnifeEdge`. No correlation produces those numbers and no measurement inside the module checks them. They are an input, and everything the unloading line does is downstream of a value somebody typed. That is a limit worth stating out loud before any of the arithmetic that follows it.

## What the exchange rate looks like

At each stage the design works out how much head the injection line has over the pressure it must beat, and the unloading line converts that head into depth at 0.45 psi/ft.

| Stage | Head available, psi | Depth it buys, ft |
| --- | --- | --- |
| Valve 2 | 703.559966806 | 1563.466592902 |
| Valve 4 | 419.802568739 | 932.894597198 |
| Valve 6 | 224.894159876 | 499.764799723 |
| Valve 8 | 92.707547126 | 206.016771390 |

The gradient never changes down that column. The head does, falling from 703.559966806 psi to 92.707547126 psi across the string, and the depth bought falls with it. Nothing about the fluid has changed between the top valve and the bottom one. Only the pressure available to push it has.

## Heavier fluid, less depth per psi

The same head buys less on `deepHighPressure` at 0.5 psi/ft than on `constantPressurePPO` at 0.42 psi/ft, and the effect runs through the whole string rather than one valve, because every stage divides by the same number. A kill fluid gradient revised late in a design does not adjust the string, it redraws it, and the deeper the valve the more of the change it inherits from the valves above.

## The mistake

Using the kill fluid gradient for the tubing during unloading. It is the gradient of the unaerated column standing above the gas, not the gradient of what the well is producing while it lifts. Those are declared separately and they are not close: 0.45 against 0.1 psi/ft on `westTexasOil`, 0.5 against 0.12, 0.42 against 0.08, 0.46 against 0.09. Two fluids, one hole, different moments. Carry the heavy one into the light one's job and the valves come out too shallow at every stage below the first.

## What it refuses

The unloading line is a straight line on a constant gradient, and the engine does not pretend otherwise. A real unloading column is neither straight nor constant. The module declares the gradient as an input precisely so it is not caught claiming to know it.

## Exercise

Take the four published kill fluid gradients and work out, for a head of 703.559966806 psi, how the depth bought would compare across them.

Then say which published case gets the least depth per psi, and what that costs a design that is already short of room.
