# Block-centred geometry

The Ekene deck's grid is a box of rectangular cells. That sounds too simple to need a lesson, and the simplicity is exactly what has to be pinned down, because a block-centred grid makes several silent decisions on your behalf.

## The shape

Thirty cells east, thirty cells north, five layers down. That is

$$30 \times 30 \times 5 = 4500 \text{ cells}$$

Each cell is 328.0839895013123 ft on both horizontal sides, which is 100 m, the cell size the geoscience courses mapped this field on. The vertical size varies by layer and is the subject of lesson 3.

## What block-centred means

Every cell is a rectangular box, and everything about it is stated at its CENTRE. The cell has one pressure, one saturation, one porosity, one permeability. There is no variation inside it; a cell is the smallest thing the model can distinguish.

Its position follows from the cell sizes rather than from any stated coordinate. Cell (1, 1) starts at the grid origin, cell (2, 1) starts one DX further east, and so on. The grid has no rotation, no corner points and no faults. Depths come from the top surface, which lesson 2 takes up.

That is a Cartesian block-centred grid, and it is the simplest geometry a simulator supports. Real studies often need more, and the more general form is corner-point geometry, where every cell's eight corners are given explicitly so layers can pinch out and faults can offset. This deck does not need it.

## Where the cells sit relative to the field

The deck's origin is placed half a cell south-west of the field's map origin, so that cell (i, j) has its centre at field coordinates

$$x = (i - 1) \times 100 \text{ m}, \qquad y = (j - 1) \times 100 \text{ m}$$

That offset is deliberate and it is worth understanding. Ekene's wells are posted at map coordinates that are mostly multiples of 100 m, and with this offset such a well lands exactly on a cell CENTRE rather than on a cell boundary. Ekene-1 at (1000, 1000) sits at the centre of cell (11, 11). A well on a boundary is a well the grid cannot place without an arbitrary tie-break.

Not every well cooperates. Ekene-2 sits at (2200, 1150), and 1150 is not a multiple of 100, so it falls in cell (23, 13) whose centre is at y = 1200. That well is half a cell away from where the grid thinks it is. The Professional tier measures what that costs.

## Consequences you should expect

**A cell is a resolution limit.** Anything smaller than 100 m by 100 m by a few feet is invisible to this model. A thin high-permeability streak, a small fault, a local shale: none of them exists unless it happens to fill a cell.

**Averages are unavoidable.** A cell's permeability is one number standing for whatever the rock does across 100 m. That average is a modelling decision, and different averages give different answers.

**Flow between cells is between centres.** The simulator computes a transmissibility from cell centre to cell centre. Two cells touch across a face, and the flow across that face depends on both cells' properties and the distance between their middles.

## The misconception to avoid

"A finer grid is a better model." A finer grid resolves more, and it also demands more: more cells to populate, more data you do not have, and much more run time. A model whose 100 m cells carry averaged properties nobody measured at 100 m does not improve by becoming 25 m cells carrying the same averages interpolated four ways. Refine when you have information at the finer scale, or when a coarse cell is demonstrably smearing something that matters.

## Exercise

First, compute the map coordinates of the centre of cell (15, 24), and confirm they match Ekene-3's posted position.

Second, the grid is 30 cells across at 100 m. State the total east-west extent in metres and in feet, and say whether that comfortably contains a field whose wells span x from 600 to 2600 m.
