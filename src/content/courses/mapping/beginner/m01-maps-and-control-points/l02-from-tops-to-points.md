# From tops to points

A mapping algorithm does not know what a well is. It does not read logs and it has no opinion about which sand is which. It accepts a list of points and returns a surface. So before anything can be gridded, each well has to be reduced to the only three numbers the algorithm can use: an x, a y and a z. Together they are one control point, and the set of them is the control set for the map.

## The three numbers

The x and the y come from the well's location on the map. They are horizontal coordinates in a projected system measured in metres, which is what lets you talk about a well being 361 m from a prospect rather than some number of degrees of latitude. In this course the coordinates are plain metres in a local grid, so easting and northing behave like ordinary graph paper: x increases to the east, y increases to the north.

The z is the depth of the formation top picked in that well, the value correlation produced. Each well contributes exactly one z per surface mapped. If you map TOP_SAND, the z is the TOP_SAND pick. If you later map a deeper surface, you build a different control set from a different set of picks, on the same well locations.

Notice how thin this is. Everything the petrophysicist learned about the well collapses into a single number for the purposes of this map. That compression is the point, and it is also why a single bad pick is so damaging: there is nothing else in the control point to argue against it.

## Where the x and y come from

In this course the x and y are the well's surface location, the position of the wellhead on the ground or on the seabed. That works because the course fixture keeps every well vertical. A vertical well goes straight down, so the place where it cuts TOP_SAND is directly beneath the wellhead, and the surface location and the subsurface location of the pick are the same point on the map.

That is a deliberate simplification, and you should know what it hides. Real fields are drilled with deviated and horizontal wells, sometimes several from one platform. Such a well kicks off below the wellhead and lands its target some distance laterally away, often far enough to matter at map scale. Posting that well's pick at its surface coordinates puts a real depth measurement in a place where the drill bit never was, and the map bends around a point that is simply in the wrong location. The error is silent, because the control point still looks perfectly legal.

The professional answer is a deviation survey, which records measured depth, inclination and azimuth down the hole so you can compute the true position of every point in the wellbore. The pick is then posted at the x and the y of the wellbore where it crosses the surface, not at the wellhead.

## Where the z comes from

Similarly, this course posts the top depth as picked, which for a vertical well is close enough to a vertical depth. Real mapping works in true vertical depth subsea, usually written TVDSS. Two corrections get you there. Measured depth along a deviated hole is longer than the vertical distance covered, so the survey converts measured depth to true vertical depth. And depths are logged from a reference datum such as the rotary table or the drill floor, which sits above sea level, so the datum elevation is subtracted to reference everything to a common sea level zero.

Without both corrections, wells drilled from rigs with different drill floor elevations produce picks that appear to differ in depth when the rock does not. That is a false structure created entirely by bookkeeping, and it is one of the classic ways a map goes wrong. None of this changes the shape of the job. It is still three numbers per well. It just means that in real work the three numbers are computed, not read off a header.

## Wells without the top

Not every well contributes. A well that stopped short of the surface, or that sits on a different fault block, or where the interpreter honestly could not identify the surface, has no z to give. Such a well contributes nothing to the map and is simply absent from the control set.

This should feel familiar. In the correlation course, a missing top left the correlation line short: the line stopped at the last well that actually had the pick, and the panel showed the gap rather than inventing a value to bridge it. Mapping behaves the same way. A well with no pick is not a zero, not an average, and not a guess. It is one fewer control point, and the map over that part of the field is that much less supported.

The temptation is always to fill the gap so the map looks complete. Absent data expressed as absent data is information. Absent data expressed as an invented number is an error that no downstream user can see.

## Exercise

Write out, in your own words, the recipe that turns a correlated well into a control point, naming each of the three numbers and saying where it comes from. Then answer two questions. What happens to the control set when a well has no pick for the surface being mapped? And which of the three numbers goes wrong if a deviated well's pick is posted at its wellhead, and which goes wrong if depths are left on the drill floor datum instead of being converted to true vertical depth subsea?

As a self-check: the three numbers are x and y from the well's map location and z from the formation top picked in that well. A well with no pick is absent from the control set entirely, exactly as a missing top left a correlation line short, and the map over that part of the field is simply less supported. Posting a deviated well at its wellhead puts the wrong x and y on a correct z, and leaving depths on the drill floor datum puts the wrong z on correct coordinates. If you answered that a missing pick should be filled with an average of the other wells, re-read the section on wells without the top.
