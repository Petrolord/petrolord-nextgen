# The capstone walkthrough

The Associate capstone for this course is short. Its brief gives you a case of its own: a lithology with a burial depth and a porosity depth, and a two-layer steady heat column with its own surface temperature, basal heat flow and conductivities. It grades six numbers. There is no essay and no hidden dataset. Every one of the six is read off the burial and heat panel once you have typed the case into it, or computed by hand from parameters this course has already given you.

The panel opens on the golden fixtures, which are the teaching case: shale at 2000 m and from 1000 m, and the 10 degC, 60 mW/m2, k 1.8 over 3.5 column. None of their numbers is a capstone answer. This lesson walks the six kinds of field on the golden case, says where each is read, and points out where marks are lost.

## Setting the case

Pick the lithology the brief names with the buttons. Type the porosity depth and the burial depth of the 100 m layer. Type the heat column's surface temperature, basal heat flow in mW/m2 and the two conductivities. Read the subtitle after typing: it repeats the column the panel is using.

## The six kinds of field, worked on the golden case

**Solid (grain) thickness in 100 m of a layer.** On the golden case, 100 m of freshly deposited shale holds 38.57953418711555 m of grain, with phi0 0.63 and c 0.00051 per m. A capstone may ask it at the surface or for a buried layer; the panel prints both tiles, labelled with their depth.

**100 m restored to the surface from a burial depth.** A 100 m shale whose top sits at 1000 m holds 63.11728183077296 m of grain, and that grain occupies 159.79553483785466 m at the surface. The restored thickness is the answer, not the grain.

**Porosity at a depth.** The Sclater-Christie value $\phi = \phi_0 e^{-cz}$; for shale at 2000 m, $0.63 e^{-0.00051 \times 2000} = 0.22717481230903933$. It is a fraction, v/v, and nothing in this workflow takes a percentage.

**Temperature at the first cell (50 m).** On the golden column, 11.666666666666671 degC. The surface node is the boundary condition, not a reading.

**Temperature at the base of the low-conductivity layer (950 m).** The centre of the last cell of the upper layer, at 950 m and not 1000 m: 41.66666666666673 degC on the golden column.

**Temperature at the deepest cell (1950 m).** The centre of the last cell of the lower layer: 59.619047619047684 degC on the golden column.

The capstone's case moves every one of these. The method does not move.

## The heat column is a closed form

In steady state with no internal heat production the column is exactly $T = T_s + Qz/k$ layer by layer. On the golden column, 10 plus 0.06 times 950 divided by 1.8 gives the low-k base, and the deepest cell continues from the 43.333333333333336 degC at the 1000 m boundary through the lower layer. Run the same two lines on the brief's column as a check on the tiles.

## The restored thickness belongs to a named depth

The restoration field names its burial depth for a reason, so read the depth before you read the value: the layer's TOP sits at that depth. On the golden case, 100 m of shale restores to 134.010303 m from 500 m and to 194.513330 m from 2000 m, so a wrong depth gives an entirely reasonable number that is wrong.

The check is available while you work. Take the solid thickness of the restored layer at the surface and it returns the grain you started with. If that round trip does not close, the number in your hand is not the one the field wants.

## Precision

The panel prints thicknesses and porosity to eight decimals and temperatures to six, and a capstone grades each tightly. Copy the tile, and enter porosity as a fraction.

## Getting to the capstone at all

The platform enforces the order. Read every lesson in a module, then pass that module's quiz at 75 percent. Three consecutive failed attempts trigger a 24 hour cooldown, so a quiz is worth preparing for rather than probing. Clear all six modules that way, pass the final exam at 70 percent, and the capstone unlocks. Passing it is what grants the Associate certification for this course.

Try it yourself: reproduce the golden values on the panel below, then switch the lithology to limestone and the upper conductivity to 2.5 and watch which tiles move.

{{panel:bs-burial-heat-explorer}}

## Exercise

Without opening the panel, list the six kinds of field with the unit of each. Then answer in one sentence: which field is a fraction and what would a percentage entry cost, and which field is most often lost by handing in the grain rather than the thickness?

As a self check: grain thickness in m, restored thickness in m, porosity in v/v, and three temperatures in degC. The porosity field is the fraction, where the percentage form misses by a factor of a hundred. The field lost to grain is the restored thickness, where the grain in place is a real number on the panel and not the answer.
