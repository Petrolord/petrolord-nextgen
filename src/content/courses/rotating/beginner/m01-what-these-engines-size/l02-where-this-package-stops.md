# Where this package stops

These two modules size machines. The seam around them is large, and naming it is more useful than papering over it, because every one of the things listed below is something a reader might reasonably expect a rotating equipment tool to answer.

## The four absences

There is no compressor surge line anywhere in the engines package, and with it no surge margin, no recycle valve and no anti-surge calculation. A compressor that is turned down until it stops delivering is a real machine problem and this package is silent on it.

There is no mechanical seal calculation and no bearing calculation. Seals and bearings appear only inside returned prose: the engine will tell you, in a note, that bearing and seal life shorten below 70 percent of best efficiency flow, and that sentence is the whole of what the package knows about them.

There is no machine curve, no wheel selection, no valve dynamics and no rod loading. A vendor performance run on a specific frame answers those, and this course does not.

There is no required-NPSH-against-flow curve. The suction check further into this course carries the required NPSH as a single number, and the engine's own note about high flow says to read the vendor curve at the duty flow before the suction margin means anything.

## What belongs to a different engine

What the piping upstream and downstream costs in pressure is a line-sizing question. It lives in engines/facilities/lineHydraulics.js and the Line Sizing course teaches it.

The affinity laws as a design tool, the best efficiency point and the operating range either side of it are taught in depth by the Electrical Submersible Pumps course. This course uses them where the engine uses them and cites that course for the theory. Beam pumping belongs to the Rod Pump course, and nothing in either of these two modules describes a reciprocating rod string.

## What the package has been checked against

The published golden cases are thin and it is worth knowing how thin. The pump goldens carry 10 cases in five blocks and the compression goldens 6 cases in two, which is 16 published cases for the 22 exported functions of the two modules. Coverage of that shape means an export can be correct, incorrect or untested, and reading a green gate as a guarantee over all 22 is a mistake.

## The mistake

Reading an absence as a pass. Nothing in a pump return says the seal will survive, and nothing in a compressor return says the machine will stay out of surge. A result that says nothing about a failure mode is not a result that clears it.

## Exercise

List the four things this package does not calculate at all, and say for each one what would have to be consulted instead. Then name the engine module that owns line losses, and give the number of published cases the two modules are checked against.
