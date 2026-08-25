# The window panel map

This tier's instrument converts the whole prognosis to mud units and draws the window as an object. This lesson is its tour; every later lesson assumes you can read it at a glance.

{{panel:pp-window-explorer}}

## The one control

A single selector: the Eaton exponent, 3 or 1.2. The capstone's two calibrations, nothing else. The trend, the threshold, the frame are all fixed at their capstone settings, because this tier's questions are downstream of the Professional tier's; if you want to watch a trend destroy a window, the Professional panel still exists and its damage converts to mud units at the usual 24.87 kg/m3 per MPa at TD.

The Bowers tiles ignore the control entirely, and that is deliberate: Bowers is the second method, computed from its own curves, and nothing about the Eaton calibration should move it. Seeing tiles NOT move when a control changes is information, the panel's way of showing independence.

## The plot

Equivalent mud weight on the horizontal axis, depth downward on the vertical, the standard window plot a well plan carries.

The red curve is the floor: pore pressure as EMW. Above the ramp top it creeps along near 1029.5 to 1029.8, the hydrostatic EMW with its seawater-fraction drift; below the amber line at 2500 m it breaks right and climbs to 1179.1 at TD. The green curve is the ceiling: fracture pressure as EMW, from 1647 at 1000 m to 1903.9 at TD. The shaded band between them is the window itself, the object this tier is named for.

The dashed curves are the frame in mud units: hydrostatic EMW on the left, overburden EMW on the right, the Associate bracket at every depth rather than only at TD. Floor and ceiling live strictly inside them everywhere; a plotted excursion outside the dashed pair is the fastest possible diagnosis of a broken conversion.

## The tiles

Ten tiles in four groups. The graded trio: floor at TD, ceiling at TD, window at TD, reading 1179.10, 1903.92, 724.82 on the capstone setting. The frame pair: hydrostatic and overburden EMW at TD, the bracket. The pressure tile: pore pressure at TD in MPa, which flips to 43.902 when the exponent control flips, the sixth graded field appearing in its native units. And the Bowers group: loading velocity at 5 MPa, 1949.94 m/s; the unloading inversion at 3125.8 m/s, 10.000 MPa; the loading read of that same velocity, 29.240, whose meaning is module 5's centrepiece; and the cross-check tile, Eaton against Bowers at TD, 0.038 MPa apart.

## Reading the window like a well planner

Three glances the plot rewards, in the order a planner makes them.

Glance one: the narrowest point. The usable single-mud interval for a section is set by the highest floor and lowest ceiling over the exposed hole, so the eye goes to where the band pinches. On this well the band is generous everywhere, narrowest in the shallowest section where the ceiling starts low.

Glance two: the floor's break. Where the floor leaves the hydrostatic is where mud programs start caring, and how fast it climbs after breaking sets how quickly a section must end. Here: a clean break at 2500 m, then a steady climb, no steps.

Glance three: the band's trend with depth. Widening, as here below 3000 m, means the deep section is comfortable; narrowing warns of a squeeze. Module 2's fourth lesson quantifies this well's shape, which has a subtlety the MPa picture hides.

## Worked example

Use the panel to perform the planner's first act: state the single mud density that could drill the whole open hole from 2500 m to TD, if one exists. The floor's maximum over that interval is at TD, 1179.10 kg/m3, since the floor climbs monotonically below the break. The ceiling's minimum over the interval is at 2500 m, 1780.09, since the ceiling climbs too. The interval 1179.10 to 1780.09 is non-empty, 601 kg/m3 wide, so yes: any mud in it, say 1250 kg/m3, balances every depth in the section. That interval, max-of-floor to min-of-ceiling, is the operational window, always narrower than or equal to the band at any single depth.

## Exercise

Flip the exponent to 1.2 and record which tiles move and which stay. Explain each stay in one clause.

Self check: the floor at TD falls to 1091.88, the window widens to 782.97, and the pressure tile falls to 43.902, all because the low exponent quiets the prognosis. The ceiling moves too, but only slightly, to 1874.85, one third of the floor's move passed through the coefficient form. The frame pair stays, because hydrostatic and overburden do not consult the exponent. All four Bowers tiles stay, because Bowers has no Eaton exponent in it, which is exactly its value as a cross-check.
