# The heat input bands, edge by edge

The fire heat input is not one relation. It is a set of bands, each covering a range of wetted area, and the engine returns the band name with the duty so a reader knows which one they are in. This lesson walks the bands across their own edges.

## The bands, swept

| wetted area, ft2 | band | duty, Btu/hr | vent, scfh |
| --- | --- | --- | --- |
| 120.0000 | below 200 ft2 | 2400000.0000 | null |
| 199.0000 | below 200 ft2 | 3980000.0000 | null |
| 200.0000 | 200 to 1000 ft2 | 3998437.1717 | null |
| 640.0000 | 200 to 1000 ft2 | 7723340.1783 | null |
| 999.0000 | 200 to 1000 ft2 | 9937139.0067 | null |
| 1000.0000 | 1000 to 2800 ft2 | 9949623.3831 | null |
| 1800.0000 | 1000 to 2800 ft2 | 12136368.3356 | null |
| 2799.0000 | 1000 to 2800 ft2 | 14089436.4220 | null |
| 2800.0000 | above 2800 ft2 | 14089282.6074 | null |
| 4200.0000 | above 2800 ft2 | 19646433.0614 | null |

The engine carries four fire heat input bands. That count is taken over the band names the engine returns across the wetted areas swept here, and a band counts once for each distinct band string it returned over that sweep, which is the kind of rule a count has to carry to be checkable at all.

The vent column is null on every row. That is not a gap in the sweep. It is what this engine returns for a required vent capacity at every wetted area, and the two lessons after this one are about why.

## The edges, walked

| band edge | wetted area, ft2 | duty below, Btu/hr | duty above, Btu/hr |
| --- | --- | --- | --- |
| below 200 ft2 gives way to 200 to 1000 ft2 | 200.0000 | 3999999.9960 | 3998437.1740 |
| 200 to 1000 ft2 gives way to 1000 to 2800 ft2 | 1000.0000 | 9942767.8295 | 9949623.3865 |
| 1000 to 2800 ft2 gives way to above 2800 ft2 | 2800.0000 | 14091137.6199 | 14089282.6189 |

Each edge was found by bisecting the band name the engine returns, which is the same method the shell and the venting crossovers use. The duty either side of each edge is printed so a reader can see how the relation behaves across a change of band.

## The tank in this module

| quantity | value |
| --- | --- |
| wetted area, ft2 | 5881.0614 |
| heat input band | above 2800 ft2 |
| fire duty, Btu/hr | 25892440.2513 |
| environment factor | 1.000000 |

This tank sits in the top band at a duty of 25892440.2513 Btu/hr, with an environment factor of 1.000000, which is the case with no credit taken. The area that put it there, 5881.0614 ft2, is the one from the previous lesson, computed on an effective wetted height that the standard's own thirty foot limit had already capped.

## What a band is

A band is a range of wetted area over which one relation applies. The method the engine implements does not use a single relation across every size of tank, so the wetted area decides which relation the duty comes from, and the band name in the result is the engine saying which one it used.

The edge table above exists so that behaviour can be read rather than assumed. At the edge where the 1000 to 2800 ft2 band gives way to the band above it, the duty below the edge is 14091137.6199 Btu/hr and the duty above it is 14089282.6189 Btu/hr, and both figures are printed so a reader can see for themselves what happens to the duty as the band changes.

## Why banded relations need their band printed

A banded relation is a place where a small change in an input can move which relation is being used. Without the band name in the result, two duties computed either side of an edge look like two points on one curve. With it, a reader can see that they are two points on two, and can go and read what the standard says about the band they are in before quoting the duty.

## Exercise

Take the band edge table in digest SECTION 28 and say which edge you would expect a tank to sit near if its returned band changed after a small change in liquid level. Then say what the band name in the result tells you that the duty alone does not.
