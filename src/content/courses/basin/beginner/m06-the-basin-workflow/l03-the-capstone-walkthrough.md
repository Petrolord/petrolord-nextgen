# The capstone walkthrough

The Associate capstone for this course is called Burial and heat on the golden fixtures, and it is short. It gives you the compaction fixtures and the two layer steady heat column, then grades six numbers. There is no essay and no hidden dataset. Every one of the six is read off the burial and heat panel or computed by hand from parameters this course has already given you. This lesson walks them in capstone order, says where each is read, and points out where marks are lost.

## The six graded fields

| Field | Unit | Value | Tolerance |
| --- | --- | --- | --- |
| Solid thickness in 100 m of surface shale | m | 38.57953418711555 | 0.05 |
| 100 m shale from 1000 m, restored to surface | m | 159.79553483785466 | 0.05 |
| Shale porosity at 2000 m | v/v | 0.22717481230903933 | 0.001 |
| Temperature at the first cell (50 m) | degC | 11.666666666666671 | 0.05 |
| Temperature at the low-k base (950 m) | degC | 41.66666666666673 | 0.05 |
| Temperature at the deepest cell (1950 m) | degC | 59.619047619047684 | 0.05 |

**Solid thickness in 100 m of surface shale, 38.57953418711555 m, tolerance 0.05.** The grain inside 100 m of freshly deposited shale, with phi0 0.63 and c 0.00051 per m. Read it from the panel with the lithology set to shale and the layer at the surface, and do not hand in the grain of a buried layer.

**100 m shale from 1000 m, restored to surface, 159.79553483785466 m, tolerance 0.05.** A 100 m shale whose top sits at 1000 m, restored to the surface. Its grain in place is 63.11728183077296 m, and that grain occupies 159.79553483785466 m at the surface. The graded field is the restored thickness, not the grain.

**Shale porosity at 2000 m, 0.22717481230903933 v/v, tolerance 0.001.** The Sclater-Christie value $\phi = 0.63 e^{-0.00051 \times 2000}$. The section below is about this field.

**Temperature at the first cell (50 m), 11.666666666666671 degC, tolerance 0.05.** The shallowest cell centre of the golden column, at 50 m. The surface node is at 10 degC, which is the boundary condition rather than a graded reading.

**Temperature at the low-k base (950 m), 41.66666666666673 degC, tolerance 0.05.** The centre of the deepest cell in the conductivity 1.8 layer, at 950 m and not 1000 m. The 1000 m boundary is at 43.333333333333336 degC, which is not this field.

**Temperature at the deepest cell (1950 m), 59.619047619047684 degC, tolerance 0.05.** The centre of the last cell in the conductivity 3.5 layer. The cells are 100 m thick, so the deepest centre is at 1950 m and not at the 2000 m base.

## The porosity field is graded in v/v to 0.001

The third field's unit label is v/v, and its tolerance is 0.001 in that unit. It is one thousandth of a fraction, not one thousandth of a percent.

So the entry is 0.22717481230903933 or anything within 0.001 of it. The same porosity written as a percentage is a hundred times larger, and it misses the window by a factor of a hundred. That is not a near miss and it is not partially credited.

The habit that protects the field is the one this course has used since module two. Porosity is a fraction of bulk volume everywhere in this workflow, and nothing in the chain takes a percentage. The 0.001 window is wide enough that you can compute the value by hand from phi0 0.63 and c 0.00051 per m at 2000 m as a check on the panel reading.

## The other five fields carry a 0.05 tolerance

The two thickness fields and the three temperature fields all have a tolerance of 0.05, in m and in degC respectively.

For the temperatures that window is generous if you use the exact solution and unforgiving if you estimate. In steady state with no internal heat production the column is exactly $T = T_s + Qz/k$ layer by layer, so 10 plus 0.06 times 950 divided by 1.8 gives the low-k base, and the deepest cell continues from the 43.333333333333336 degC at the 1000 m boundary through the conductivity 3.5 layer.

For the two thicknesses the window is useless against the wrong quantity. The classic loss on the second field is entering 63.11728183077296 m, the layer's grain in place rather than its restored thickness. The second is restoring from the wrong depth, since 100 m of shale restores to 134.010303 m from 500 m and to 194.513330 m from 2000 m. Both misses are far outside 0.05.

## The restored thickness is for a layer whose top is at 1000 m

That second field names its burial depth for a reason, so read the depth before you read the value.

The field is the restored thickness of a 100 m shale whose TOP sits at 1000 m. Not its midpoint, not its base, and not some other layer. That layer holds 63.11728183077296 m of grain, and the same grain occupies 159.79553483785466 m at the surface, so the layer has lost 59.79553483785466 m of thickness to compaction, or 37.42 percent of its original thickness.

The check is available while you work. Take the solid thickness of the restored 159.79553483785466 m at the surface and it returns 63.117281830772924 m, the grain you started with. If that round trip does not close, the number in your hand is not the one the field wants.

## Getting to the capstone at all

The platform enforces the order. Read every lesson in a module, then pass that module's quiz at 75 percent. Three consecutive failed attempts trigger a 24 hour cooldown, so a quiz is worth preparing for rather than probing. Clear all six modules that way, pass the final exam at 70 percent, and the capstone unlocks. Passing it is what grants the Associate certification for this course.

Try it yourself: open the panel below and locate all six values in capstone order first.

{{panel:bs-burial-heat-explorer}}

## Exercise

Without opening the panel, list the six graded fields in capstone order with the unit and tolerance of each. Then answer in one sentence: which field is graded in v/v and what would a percentage entry cost, and which field is most often lost by handing in the grain rather than the thickness?

As a self check: solid thickness in 100 m of surface shale in m, tolerance 0.05; the 100 m shale from 1000 m restored to surface in m, tolerance 0.05; shale porosity at 2000 m in v/v, tolerance 0.001; temperature at the first cell at 50 m in degC, tolerance 0.05; temperature at the low-k base at 950 m in degC, tolerance 0.05; and temperature at the deepest cell at 1950 m in degC, tolerance 0.05. The porosity field is the one graded in v/v, where the percentage form instead of 0.22717481230903933 misses by a factor of a hundred and scores nothing. The field lost to grain is the restored thickness, where 63.11728183077296 m is the layer's grain in place and 159.79553483785466 m is the answer.
