# Thickness at the prospect

One capstone field is a single number at a single location: the mapped thickness at prospect P-1. This lesson derives it two ways, checks it against the wells, and states what it is and is not evidence for.

{{panel:mp-isochore-explorer}}

## The number

P-1 sits at (1600, 1600). The isochore there reads **34.050048828125 m**, and the capstone grades it to 0.1 m.

It can be reached from either end of the workflow, and both routes are worth running once.

**From the two surfaces.** TOP_SAND at P-1 is 1542.619873046875 m, the value the Associate tier read. BASE_SAND at P-1 is 1576.669921875 m. The difference is 34.050048828125 m.

**From the isochore.** Sample the thickness grid at (1600, 1600) directly and it returns the same number.

They agree exactly because both sampling and subtraction are linear operations, so the order does not matter.

## Where it sits among the wells

| Quantity | Value |
| --- | --- |
| Thinnest well, Ekene-4 | 25 m |
| Mean of the six wells | 31.166666666666668 m |
| Nearest well, Ekene-6 at 361 m | 34 m |
| P-1, mapped | 34.050048828125 m |
| Thickest well, Ekene-2 | 36 m |

The mapped value at P-1 is essentially Ekene-6's thickness. That is not a coincidence and it is not a strong result either: Ekene-6 is 361 m away, the next nearest control is 728 m away at Ekene-3, and a spline near a control point mostly reports that control point.

Stating it that way is more honest than stating the number alone. The map says the prospect carries about 34 m of sand **because Ekene-6 does**, and the confidence in the 34 m is really confidence that the interval does not change much over 361 m.

## Why it does not depend on the cell size

Change the cell size to 50 m and re-read P-1: 34.050048828125 m. Change it to 200 m: 34.050048828125 m. The value is byte-identical at all three settings.

The reason is that P-1 at (1600, 1600) lands exactly on a grid node in all three frames, and **a node value is the fit itself**. The spline is a continuous function defined everywhere; the grid is a sampling of it. Where a sample lands on the function, the cell size has changed nothing.

That is a useful general rule with a sharp edge on it. Values read at nodes are grid-independent. Statistics computed **over** nodes, such as the mean, the minimum and the live count, are not, because changing the cell size changes which points are being averaged and how many there are. The next lesson but one takes that apart.

## What it is evidence for

**It is evidence that a spline through six wells predicts 34 m at that location.** That is a statement about the interpolation, and it is exactly true.

**It is not a measurement.** No well has been drilled at P-1. The only measurements on this field are the six pairs of picks.

**It is not an uncertainty statement.** The map offers one number with no spread attached. How wrong that number could be is the Expert tier's question, and the answer there turns out to be larger than most people guess.

The professional form of the reading is a sentence, not a number: *the isochore predicts 34.05 m at P-1, controlled principally by Ekene-6 at 34 m and 361 m away, on a field where the six wells range from 25 to 36 m.*

## Worked example

A colleague reports 34.05 m at P-1 to two decimal places and treats it as the reservoir thickness for a volume estimate. What should be said?

Two things. The precision is misleading: the picks are given to the metre, so a thickness carrying two decimals implies a resolution the input does not have. And the number is an interpolation between wells hundreds of metres away, so it belongs in the volume estimate as a central case with a range around it rather than as a fixed input.

Neither point says the number is wrong. Both say it needs its conditions attached.

## Exercise

Compute the thickness at P-1 from the two surface values, then state why the answer does not change when the cell size changes and name one quantity on the same panel that does.

As a self-check: $1576.669921875 - 1542.619873046875 = 34.050048828125$ m. It does not change with cell size because P-1 lands exactly on a node in all three frames and a node value is the underlying spline fit, which the grid only samples. The map mean does change, from 32.2873 at a 50 m cell to 32.2543 at 100 m and 32.2720 at 200 m, because it is an average over the node set and both the number and the placement of nodes change with the cell size.
