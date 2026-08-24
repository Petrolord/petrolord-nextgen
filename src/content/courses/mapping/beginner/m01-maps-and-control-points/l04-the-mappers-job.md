# The mapper's job

You have six control points. The software will happily turn them into a map in one click. So what is left for the mapper to do?

Four decisions, and every one of them changes the answer. The rest of this course is those four decisions, one module each. It is worth seeing them laid out together before you meet them in detail, because they are not independent: a choice made in the first one constrains what the third one can do.

## Decision one: the grid

A map surface is stored as a grid, a regular lattice of nodes covering a rectangle, each node holding one depth value. Two things have to be decided before a single value is computed.

Where does the map cover? The rectangle has to enclose the wells with some margin, because one that clips a well throws away control you paid for, and one that stretches far past the wells wastes effort on ground you know nothing about.

How finely is it sampled? That is the cell size, the spacing between neighbouring nodes. A coarse grid is blocky and can miss the crest entirely by stepping over it. A fine grid is smooth and can invite you to believe in detail that six wells cannot possibly support.

The capstone uses a 100 m cell. Module 2 is where you learn what that choice does and how to make it deliberately rather than by accepting a default.

## Decision two: interpolation

Once the grid frame exists, most of its nodes have no data. Something has to produce a value at each of them from the six known points. That something is the interpolation method, and different methods give genuinely different maps from identical wells.

The method used in this course is a thin-plate spline fitted through all six control points. The name describes the physics it borrows: the surface behaves like a thin sheet of metal bent to pass through every control point while minimising how hard it has to bend overall. It honours the data exactly, returning each well's own pick at that well's location, and it produces a smooth surface between wells rather than a faceted one.

Module 3 covers how that works, what honouring the control does and does not guarantee, and what interpolation invents.

## Decision three: extrapolation

Interpolation fills the space between control points. Extrapolation is what happens outside them, and it is a different and more dangerous activity. Inside the well pattern, the surface is pinned on several sides. Outside it, nothing constrains the trend, and a spline that was bending gently between wells can run away steeply once it has nothing left to hold it down.

The defence is a limit. This course caps extrapolation at 800 m: a grid node further than 800 m from the nearest control point is not given a value at all. It is masked, left blank, and drawn as nothing rather than as a confident colour.

The effect is worth stating now. The capstone grid holds 500 nodes. After the 800 m limit is applied, only 201 of them carry a value, and the other 299 are masked. Less than half the rectangle you drew is supported well enough to map, and the honest product says so on its face. Module 4 is that limit, the live and dead node distinction, and the awkward question of what happens to a crest that sits near the edge of support.

## Decision four: presentation

A grid of numbers is not yet a map anyone can read. The last step is display, and it carries its own decisions.

Contours are the main one. A contour is a line of constant depth, and the contour interval is the vertical spacing between successive lines. This course uses a 10 m interval on the Ekene map. Too coarse an interval and the structure flattens into featurelessness. Too fine and the sheet fills with lines that describe interpolation rather than geology.

The other half of presentation is sampling: reading a value off the map at a specific location, such as prospect P-1 at (1600, 1600). That is the question a well proposal asks, and answering it well means knowing not just the number but how far it sits from real control. Module 5 covers contours, intervals, reading structure, sampling a location, and the ways a well drawn map can still mislead.

## The destination

The Associate capstone grades six numbers from the Ekene TOP_SAND map at a 100 m cell size. Here they are, so that you know from the start what you are working toward.

1. Six control points, the six Ekene wells with a TOP_SAND pick.
2. A grid 25 nodes wide.
3. 201 live nodes, out of the 500 the grid frame contains.
4. A crest depth of 1539.72 m, the shallowest depth anywhere on the mapped surface.
5. A depth at P-1 of 1542.62 m, at a location where no well exists.
6. A contour interval of 10 m.

Look at the fourth one for a moment. The shallowest actual well pick in the fixture is Ekene-3 at 1541 m, and the mapped crest is shallower than that. The map places the highest point of the structure somewhere no well was drilled. That is not an error, and it is not a guarantee either. It is the most consequential thing a map ever does, and by the end of this course you will be able to say exactly which of those two it is here.

## Exercise

List the four mapping decisions in the order they are made, and for each one write down the value this course uses and the module that teaches it. Then answer one question: which of the four decisions is responsible for the fact that 299 of the 500 grid nodes carry no value?

As a self-check: the four are the grid, at a 100 m cell size, in module 2; interpolation, by thin-plate spline through all six control points, in module 3; extrapolation, capped at 800 m from the nearest control point, in module 4; and presentation, at a 10 m contour interval with sampling at locations such as P-1, in module 5. The 299 masked nodes are the work of decision three, the extrapolation limit, though decision one set how many nodes there were to mask in the first place. If you answered interpolation, re-read the difference between filling space between control points and extending beyond them.
