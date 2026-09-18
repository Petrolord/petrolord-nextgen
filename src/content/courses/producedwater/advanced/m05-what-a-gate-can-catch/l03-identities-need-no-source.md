# Identities, which need no source at all

Most validation is an argument about a source. Somebody's published case, somebody's vendor curve, somebody's field data, and a tolerance negotiated around it. An identity is different. It is true by construction, it needs no publication, and an engine that breaks one is wrong without anybody having to look anything up.

{{panel:pw-water-explorer}}

## The five this module carries

- half the volume is removed AT the cut size, by definition. The engine returns 0.500000000000 at twelve micron against a twelve micron cut.
- the volume median of a log-normal bin set equals its own d50. On the UZERE inlet it returns 26.000000 micron against a typed 26, on every grid.
- the truncated tail equals twice the cdf below the span edge. The ratio comes out at one.
- the flotation cell count makes no difference at equal total gas and equal total volume. A jest test asserts it to 1e-12.
- a plate pack cut does not depend on how the pack is sliced into channels. The golden carries that as `channelHeightIndependence`.

## Why they are the strongest checks in the file

Three reasons, and each is worth stating on its own.

They cannot go stale. A published case ages with the publication behind it. An identity is a property of the mathematics and it will be as true in twenty years as it is now.

They need no tolerance argument. The grade efficiency at the cut size is one half because that is what a cut size MEANS, so the assertion is exact and a discussion about what counts as close enough never starts.

And they survive a compromised oracle. This is the important one. If somebody bends the engine and bends the oracle to match, the golden regenerates and agrees perfectly. An identity does not care what the oracle says, because it is checked against the definition rather than against another program.

## Reading an identity as a design constraint

Notice that each of the five is also an engineering statement.

The cell count invariance says the arrangement of a flotation plant does not change its answer at equal gas and equal volume. The channel height independence says a plate pack cut is a property of the pack rather than of how the pack is drawn. Both are things a reviewer would want to be true of a real design tool, and both are checkable without leaving the module.

That is what makes them so useful in a course. They are simultaneously the cheapest check to write and the one a reader can verify with nothing but the definition in front of them.

## Exercise

Take the grade efficiency identity and confirm it at three different cut sizes in the panel. Then take the median identity and confirm it on two different grids.

Finally, invent a sixth identity this module could assert about itself, and say what defect it would catch.
