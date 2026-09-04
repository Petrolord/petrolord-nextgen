# What the march accumulates

`predictCard` computes far more than it reports. Knowing what it holds while it runs is what makes the reported numbers readable.

{{panel:pd-balance-explorer}}

## The march runs at the Courant step

The teaching well ODUMA-4 marches 6110 steps in one cycle at the shipped defaults, on 120 interior nodes, with a time step of 9.819967e-4 s and kappa of 1.279496094 per s. It settles after 4 cycles. The published taper marches 6516 steps at 9 spm and 11728 at 5 spm, because the step follows the wave speed and the node spacing.

At every one of those steps, at every node, the march updates a running maximum and a running minimum of the tension. That is the tension envelope, and nothing is thrown away from it.

## Two numbers a node, and no time with them

The envelope holds a maximum load and a minimum load for each node, with no position and no time index, so a card area never comes out of it. What it carries is the worst tension and the worst compression the string saw anywhere in the cycle, which is what a fatigue check needs. On ODUMA-4 the node spacing is 40.000000000 ft, so the shallowest sample sits at half a spacing, 20.000000000 ft, and the deepest at 4780.000000 ft.

| Node of 120 | Depth, ft | Maximum, lb | Minimum, lb |
| --- | --- | --- | --- |
| 1 | 20.0000 | 19800.044639 | 2331.994757 |
| 9 | 340.0000 | 18501.010904 | 1841.951656 |
| 17 | 660.0000 | 17061.289175 | 1365.041935 |
| 25 | 980.0000 | 15757.568254 | 907.384696 |
| 33 | 1300.0000 | 14545.281344 | -77.964630 |

## Where the string goes into compression

The minimum crosses zero between 980.0000 and 1300.0000 ft and stays low: -1440.008910 lb at 2900.0000 ft, -2405.811610 lb at 4500.0000 ft. The deepest node carries a maximum of 4836.173755 lb, close to the fluid load of 4690.299657 lb the plunger hangs on the string.

## The half node at the top

No envelope sample sits at the polished rod. The shallowest is 20.000000000 ft down, and the buoyed rod above it weighs 51.421146497 lb, 0.259029 percent of the load there. `sectionStresses` reads the sample nearest the top of each section, so the top section is priced one half node light. That is a discretisation choice, and its size is stated rather than guessed.

## What it refuses

The envelope refuses to say when anything happened, so it cannot be plotted as a card, and it refuses to price zero depth. It is also not what the function reports as the peak and minimum polished rod loads.

## Exercise

Read the envelope maximum and minimum at 20.0000 ft and at 2900.0000 ft in the panel.

Write down the depth at which the minimum first goes negative, and say in one sentence what a negative minimum tension asserts about the rods there.
