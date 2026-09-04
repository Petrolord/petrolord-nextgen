# The traverse comes from outside

Half of the deepest injection point calculation is a curve this module refuses to compute, and the caller hands it over as a table.

{{panel:pd-unloading-explorer}}

## What the caller supplies

The flowing production traverse arrives as a depth and pressure table. On the published case it is 9 rows at 1000.0 ft spacing:

| Depth, ft | Production pressure, psia |
| --- | --- |
| 0.0 | 164.7000 |
| 2000.0 | 372.7000 |
| 4000.0 | 606.7000 |
| 6000.0 | 864.7000 |
| 8000.0 | 1146.7000 |

The module solves no multiphase outflow and carries no inflow relation, so the entire production side of the crossing is somebody else's answer. That is a deliberate refusal stated in the engine header: the caller is expected to build the traverse from a validated nodal model rather than have this module invent a gradient.

## The rows are an input too

The spacing of those rows is a choice, and the answer moves with it. Resampling the same traverse and holding the gas column converged:

| Tabulation spacing, ft | Rows | Crossing depth, ft | Depth error, ft |
| --- | --- | --- | --- |
| 4000.0000 | 3 | 7718.332998046 | -22.800438454 |
| 2000.0000 | 5 | 7733.030152337 | -8.103284162 |
| 1000.0000 | 9 | 7739.814701427 | -1.318735072 |
| 250.0000 | 33 | 7741.132502829 | -0.000933670 |

Those refinement rows are a teaching construct, a monotone cubic built through the published rows and treated as the continuous traverse the table samples. They reproduce every published row exactly, and they are not themselves a published case. The published 9 row spacing sits a little over a foot shallow of that curve's crossing at 7741.133436499 ft.

## The function cannot see any of this

Nothing in the returned result reports the row spacing, the traverse's provenance or its curvature. The reported residual at the published crossing is 4.67696e-3 psi, against the 0.5 psi the gate allows, and it stays small at every spacing in that table while the depth error changes by more than twenty feet.

## The mistake

Refining the thing that is easy to refine. The gas column can be marched at any step count you like and it barely moves the answer: from 8 samples to 2560 the crossing goes from 7739.840298490 ft to 7739.814701286 ft. The traverse rows control the depth, and they usually arrive fixed, from a file or from somebody else's software.

## What it refuses

It refuses to validate the traverse. A table of nine numbers with the wrong holdup in it produces a crossing to nine decimal places, and the function has no way of telling that curve from a right one.

## Exercise

Read the published crossing in the panel, then coarsen the traverse to 3 rows and read it again.

Then write down what the reported residual did while the depth moved, and say what that residual is actually comparing.
