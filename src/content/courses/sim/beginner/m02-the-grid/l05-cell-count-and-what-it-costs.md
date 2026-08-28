# Cell count and what it costs

Four thousand five hundred cells is a small model. This lesson is about what that number buys, what it costs, and how to think about the trade when someone asks for a finer grid.

## What the number is

$$30 \times 30 \times 5 = 4500$$

For scale: full-field studies routinely run hundreds of thousands to a few million cells, and a sector model might be tens of thousands. Ekene at 4500 is a teaching-scale model, and it is deliberately small so that a run finishes in seconds and every number stays hand-checkable.

## What cell count costs

Run time grows faster than linearly with cell count, because the simulator solves a system of equations whose size is set by the number of cells and whose difficulty grows with it. Doubling the cells in each of three directions is eight times the cells and considerably more than eight times the work.

Memory grows with cell count directly. Output grows with cell count times the number of report steps, and that product is what fills a disk.

None of that is the main cost. The main cost is DATA. Every cell needs a porosity and a permeability, and those come from somewhere. Refine a 100 m grid to 25 m and you have sixteen times as many cells to populate from exactly the same six wells. The extra cells are interpolation, and interpolation between the same control points at higher resolution does not add information.

## What cell count buys

**Resolution of geometry.** A coarse grid cannot represent a feature smaller than a cell. If a thief zone is 3 ft thick and your layers are 7 ft, the model has no thief zone.

**Reduced numerical smearing.** A displacement front spreads over roughly one cell as it moves, so a coarse grid predicts a smoother, earlier breakthrough than a fine one. This is numerical dispersion and it is a real error, not a physical effect. It is the strongest argument for refinement in a waterflood study.

**Well resolution.** A well in a 100 m cell has its pressure computed against an average over 100 m, which is a long way from a wellbore. Simulators correct for this with a well index, and the correction is a model of its own.

## The honest position for Ekene

Five layers is enough to carry the permeability contrast the waterflood course established, because that course's own sweep calculation used exactly these five layers. The deck is as resolved vertically as the analysis that fed it.

Thirty by thirty at 100 m spans the field and puts every well in its own cell, with the nearest two wells about seven cells apart. That is enough to separate the wells, which is the minimum a pattern study needs.

Whether it is enough to forecast is a different question and this course does not claim it is.

## When to refine

Refine when you can answer yes to one of these:

- Do I have data at the finer scale that the coarse grid is currently averaging away?
- Is a feature I care about smaller than a cell?
- Have I shown that the answer changes when I refine, and stops changing when I refine further?

That last one is a grid sensitivity study, and it is the only real test. If halving the cell size changes the forecast materially, the coarse answer was resolution-limited. If it does not, the coarse grid was adequate and refining further is a purchase of run time.

## The misconception to avoid

"More cells means a more accurate model." More cells means less numerical error from the DISCRETISATION. It says nothing about whether the properties in those cells are right, and property error usually dominates. A million-cell model populated by interpolating six wells is a very finely resolved guess.

## Exercise

First, this grid has 4500 cells. Compute the cell count if every cell were halved in each direction, and state how many wells would still be supplying the property data.

Second, describe a grid sensitivity study in three steps, and say what result would justify keeping the coarse grid.
