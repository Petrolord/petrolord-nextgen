# Contours

The grid is finished. Six picks have been spread across 500 nodes, 201 of them live, and every live node now carries a depth. That is a table of numbers, and a table of numbers is not a map. The device that turns one into the other is the contour.

A contour is a line of constant depth traced through the grid. Pick a value, say 1550 m, and draw the line along which the surface is exactly 1550 m deep. Do it again at 1560 m, and again at 1570 m, and the family of lines you get is a picture of a three-dimensional surface on a flat page. It is the oldest trick in cartography and it still has no serious rival, because it puts the shape of the surface and the values of the surface in the same drawing without needing a screen you can rotate.

## How the engine draws them

The contouring code does not know anything about geology. It knows about cells. A cell is the little square between four neighbouring nodes, and the whole grid is a mesh of them.

For each contour value the engine walks every cell in turn and asks a simple question of the four corner nodes: which of them are at or below this level, and which are above it. If all four fall on the same side, the contour does not pass through that cell and the engine moves on. If the corners are split, the line must cross the cell, and the engine works out where along each edge the crossing happens by straight-line interpolation between the two corner depths. The result is a short segment inside that cell.

Two details matter for reading the output. First, a cell with any dead corner is skipped entirely. The contour simply stops at the edge of the masked area rather than being drawn on invented ground, which is exactly the honesty rule from the previous module carried into the drawing stage. Second, the mesh of cells produces bitwise-identical endpoints along every shared edge, so the engine can chain the loose segments into continuous polylines by matching endpoints exactly. A polyline that comes back to its own starting point is a closed contour. One that stops without closing has run into either the mask or the edge of the grid frame.

Those polylines come out in grid index space, where x is a column index and y is a row index, and are converted into map coordinates for display. The conversion is the same frame arithmetic from module two: column times cell size plus the x origin, row times cell size plus the y origin. It is worth knowing this happens, because it means the contours inherit the grid's frame exactly. Contours are drawn from the grid, not from the wells.

## What the pattern tells you

Once the lines are on the page you read them by spacing and by shape. Three rules cover most of it.

Closely spaced contours mean steep dip. The lines are a fixed depth apart vertically, so if they are also close together horizontally the surface must be dropping quickly. A tight bunch of lines is a flank, a fault-adjacent steepening, or in a poorly built map a gridding artefact.

Widely spaced contours mean a flat area. The same fixed depth step is now spread over a long horizontal distance, so the surface is nearly level. Broad white space between lines is a plateau, a crestal area, or a basin floor.

Closed loops mean a high or a low. If a contour closes on itself, the ground inside it is on one side of that value everywhere and the ground outside is on the other. That is the map signature of a hill or a hollow, and in petroleum work it is the signature that matters most, because a closed high is the geometry that can hold hydrocarbons against buoyancy.

## The sign convention

Now the point that trips up every beginner at least once. Maps in this course are depth maps. The value contoured is depth below datum, measured positive downwards, so a larger number means deeper rock. Ekene-4 at 1590 m is the deepest mapped point on the fixture. Ekene-3 at 1541 m is near the shallowest.

That inverts the intuition you brought from hiking maps, where the numbers are elevations and the big numbers are the summits. On a depth map the small numbers are the summits. A closed contour drawn around a small number is a structural high, and a closed contour drawn around a large number is a structural low.

The industry does also produce elevation maps, usually as subsea true vertical depth expressed as a negative number, or as a structure map in time where the values are two-way travel times in milliseconds and again the small numbers are shallow. Different sign conventions, same reading skill. The professional habit is to check the convention on the map before saying a single word about the structure, because the difference between a crest and a sink is one minus sign and no amount of experience protects you from reading it backwards on someone else's map.

Try it yourself: the contours in the panel below are drawn from the grid, and they stop at the edge of the masked area.

{{panel:mp-map-explorer}}

## Exercise

Sketch, freehand, what the contours would look like in three situations on a depth map: a uniform ramp deepening east, a symmetric dome, and a flat shelf that drops abruptly along one edge. As a self-check: the ramp gives straight, parallel, evenly spaced lines running north to south with the values increasing eastwards; the dome gives a set of nested closed loops with the smallest number in the middle; the shelf gives widely spaced lines across the flat part that bunch together tightly along the drop. Then answer in one sentence: on a depth map, does a closed loop labelled 1540 m enclosing a smaller value indicate a high or a low? A high, because smaller depth means shallower rock.
