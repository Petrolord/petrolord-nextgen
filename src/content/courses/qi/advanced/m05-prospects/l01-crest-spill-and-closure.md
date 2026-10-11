# Crest, spill and closure

A property map says what the rock may hold; a prospect also needs a trap. The Mapping course teaches gridding and closure mapping; this course reads a stated depth grid and asks three things of it: where the crest is, where the structure spills, and how much rock lies between. `spillAnalysis`, `closureAt` and `closureCurve` in lib/gridding/closure.js answer them, an engine with a golden and an independent oracle.

## How the spill is found

From the crest, the highest mapped node unless a seed is stated, a priority flood always expands the highest node on its frontier. The spill elevation is the running minimum when the flood first reaches the edge of the mapped area. Connectivity is four-neighbour. The mapped edge is any node on the edge of the grid or any node beside a null, so a gap in the map is an edge too. A contact at or above the spill leaves the closure closed; a contact below it lets the trap leak.

The engine reads elevation and spacing in one unit; the course runs it in feet.

## The Ekene Sand top grid

The grid is the kit's own, gridded from the six development wells' tops: 25 by 20 nodes every 328.083990 ft, 201 of them mapped. Its z is minus the depth below the kelly bushing, in feet, so a higher z is shallower.

| quantity | value |
| --- | --- |
| crest, ft | -5051.568570 |
| spill, ft | -5053.948819 |
| column from crest to spill, ft | 2.380249 |
| spill limited by the map edge | yes |
| nodes in the closure at the spill | 11 |
| area at the spill, ft2 | 1184030.145838 |
| gross rock volume at the spill, ft3 | 1519731.367693 |
| the oil-water contact of the wells, ft | -5118.110236 |
| closure at that contact closed | no |

## What the grid can and cannot say

The map spills at the edge of its own mapped area, 2.380249 ft below the crest, and above the contact the wells see. The wells hold oil down to 5118.110236 ft, far below that spill. Six wells grid too little of the structure to close the trap on the map. The engine says so: the spill is flagged as limited by the edge, and at the wells' contact the closure is reported open.

A closure figure from this grid is therefore the map's limit and no measurement of the trap. The column, the 11 nodes and the gross rock volume all describe how far the mapped area reaches before it runs out. A study reads the edge flag before it quotes any closure figure, and reports the flag beside it.

Gross rock volume is the only volume the engine returns, and it is no volume in barrels: turning rock into oil takes inputs the closure engine never sees.

## The seed and the contact are stated

A seed moves the start of the flood to a stated node, which matters on a grid with more than one high. A contact is a stated elevation: `closureAt` reports the closure at it, and `closureCurve` gives area against depth at a stated number of levels. Each is an input the report names.

{{panel:qi-prospect-explorer}}

## Exercise

In the prospect explorer, set View to "Crest, spill and closure" and Data to "Ekene teaching pack". Leave "Contact elevation, ft, blank for the spill (stated)" blank and check the crest, spill, column, edge flag, area and gross rock volume tiles against the table. Set the contact to -5118.110236 and read "Closed at that contact"; then set it to -5053.948819 and read "Nodes at the stated contact". Write two sentences for a report on what the closure figures of this grid may and may not be used for.
