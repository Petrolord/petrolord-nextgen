# A tree of turbulent branches

Replace the resistors with square roots and the matrix inverse is gone for good. What replaces it is two methods with nothing in common landing on the same pressures.

{{panel:pd-network-explorer}}

## The case

The published `turbulent_tree` is three Vogel wells feeding two headers in series: turbulent conductances b1 = 140, b2 = 95, b3 = 160, b4 = 260 and b5 = 410 lb/d per root psi, wells w1 at 4200 lb/d at 2600 psia, w2 at 2900 lb/d at 2200 psia and w3 at 5100 lb/d at 3000 psia, separator at 180 psia. A turbulent branch carries mass proportional to the square root of the pressure difference across it, so nothing here has a closed form.

## Two methods, one answer

| Node | Engine pressure, psia | Difference from the referee, psia |
| --- | --- | --- |
| w1 | 1352.491889435 | -1.6912e-9 |
| w2 | 1284.365022329 | -2.0416e-9 |
| w3 | 1239.853017595 | -5.2681e-8 |
| h1 | 936.962342064 | -3.9037e-9 |
| h2 | 620.599162363 | -1.8767e-9 |
| s | 180.000000000 | 0.0000e+0 |

The referee is Gauss-Seidel with a bracketed bisection at each node, no Jacobian and no linear algebra anywhere. It took 48 sweeps. The engine took 6 Newton iterations.

## In a tree, downstream fixes everything

Engine flows are b1 = 2853.835862217 lb/d, b2 = 1770.680431190 lb/d, b3 = 3981.569878068 lb/d, b4 = 4624.516293382 lb/d and b5 = 8606.086171612 lb/d, and the well rates are the flowline flows: w1 = 2853.835862213 lb/d, w2 = 1770.680431189 lb/d and w3 = 3981.569878309 lb/d. Every branch flow here is decided by what sits downstream of it, because there is exactly one path from each well to the separator. The trunk b5 carries all of it.

## What converged is worth here

The engine reports converged = true in 6 iterations with a reported residual of 2.4176e-7 lb/d and nothing pinned. The audit on that same answer gives produced = 8606.086171711 lb/d against delivered = 8606.086171612 lb/d, a gap of 9.890573e-8 lb/d, relative 1.149253e-11. On this case the flag and the audit tell the same story, and that is a result about this case rather than a property of the flag.

## The mistake

Sizing a turbulent branch as if conductance were a resistance. A linear conductance of lb/d per psi and a turbulent conductance of lb/d per root psi are not the same quantity and never compare. Doubling a turbulent conductance does not halve a drop, and two of them in series collapse to nothing.

## What it refuses

The module models no hydraulics of its own. The branch relation and the well inflow are both callbacks the caller supplies. There is no temperature, no slugging and no transient anywhere: every equation is steady state, and mass in equals mass out on every branch by construction.

## Exercise

Solve `turbulent_tree` in the panel, then raise the trunk conductance and solve again. Record what happens to h2 and to the three well rates, and say which well moved least.
