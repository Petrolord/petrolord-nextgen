# Nodes and steps

The node count is not a display setting. It sets the time step, the number of steps in a cycle and, through them, both reported loads.

{{panel:pd-balance-explorer}}

## One knob moves two things

The march is explicit, so the time step follows the Courant condition: halve the node spacing and the step has to shrink with it. Doubling the nodes therefore roughly doubles the steps in a cycle, and the cost of a run rises as the square.

| Nodes | Steps, published taper at 9 spm | Steps, ODUMA-4 |
| --- | --- | --- |
| 60 | 3258 | 3055 |
| 120 | 6516 | 6110 |
| 240 | 13032 | 12219 |
| 480 | 26063 | 24437 |
| 960 | 52125 | 48874 |
| 1920 | 104249 | 97747 |

On ODUMA-4 at the shipped 120 node grid the string is 4800 ft, so the node spacing is 40.000000000 ft, the time step is 9.819967e-4 s and one cycle takes 6110 steps.

## What the defaults are

`predictCard` defaults to 120 nodes, 180 card samples, 20 maximum cycles and a tolerance of 0.0001. `runRodPumpDesign` forwards none of them. It calls the card solver internally at the defaults, so every number a studio user sees was computed on a grid they cannot see or change.

The engine does warn when the grid and the step disagree: `timestep` is raised when the time step exceeded the Courant limit.

## How many cycles it marches

The march repeats the stroke until the card stops changing within tolerance. The published taper settles in 3 cycles at every node count from 60 to 1920. ODUMA-4 settles in 3 cycles at 60 nodes and in 4 at every finer grid. Neither number is a convergence in the node count: it is a convergence in time on one grid, and the engine reports it as `converged`.

## The route the sweep uses

`runRodPumpDesign` cannot be asked for a different node count, so a node study has to call `predictCard` directly and recompute the loading standalone through `sectionStresses` and `modifiedGoodman`. That route has to be checked before it can be used. On ODUMA-4 at the shipped defaults the design returns a worst section loading of 82.873308395930 percent and the standalone recomputation returns 82.873308395930 percent, strictly equal. That equality is what licenses reading a node sweep at all.

## What it refuses

The return carries no measure of grid error. `converged` says the march settled in time on the grid it was given, and says nothing about whether the grid was fine enough. A caller who sees `converged: true` on a 120 node run has been told the stroke repeats, not that the loads would survive a finer mesh.

## Exercise

Record the marched steps for ODUMA-4 at 60, 240 and 960 nodes.

Then state which two engine defaults decide those step counts, and which of them `runRodPumpDesign` lets you change.
