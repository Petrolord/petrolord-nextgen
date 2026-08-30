# The frame both wells must be in

The commonest reason an anti-collision scan is wrong.

## The requirement

Both wells' positions must be expressed in ONE coordinate frame, with one origin, one north reference and one depth datum.

If they are not, the calculation runs perfectly and answers a question about two wells that are not where it thinks.

## The three ways it goes wrong

**Different origins.** Each well's survey is usually stored relative to its own wellhead. Two wells from different slots have different wellheads, and combining their local coordinates without adding the wellhead offsets puts them both at the same place.

That error makes wells look far too close, which at least gets noticed. The reverse, adding an offset that was already applied, makes them look far apart and does not.

**Different north references.** One well's azimuths referenced to grid north and the other's to true north differ by the convergence. On a well 3000 m out, a degree of convergence is 52 m of position.

The standard clearance example's wells all state their reference in their headers, and they use grid north with zero convergence, which removes the issue from the example and does not remove it from real fields.

**Different depth datums.** A well drilled from a jack-up and one from a platform at the same location have different rig floor elevations. Their measured depths and TVDs are referenced differently, and a scan that compares them without correcting has one well systematically shifted vertically.

## Why the standard example gives positions directly

The clearance golden supplies north, east and TVD arrays for every well, not just measured depths and attitudes.

That is deliberate: it removes the frame question from the validation case so that what is being validated is the clearance mathematics rather than a coordinate transformation. The wells are given in one frame by construction.

Real data are not. Getting them into one frame is a step that happens before any of this, and it is where the errors live.

## The map projection question

Positions in a field are usually in a map projection, which is a flat approximation to a curved earth.

Over the scale of a field the distortion is small, and the standard treats the frame as Cartesian. Over a large area it is not negligible, and grid convergence is the visible symptom: north on the map and north on the ground diverge as you move away from the central meridian.

That is why the survey header carries a convergence, and why the Expert tier's fourth module is about the reference frame.

## The database question

Most anti-collision scans are run against a well database rather than against individual survey files.

Databases have their own conventions, their own history and their own errors, and the single most useful check before trusting a scan is to plot both wells in plan and section and confirm they are where you expect. A well that has been loaded with an unapplied wellhead offset is obvious on a plot and invisible in a separation factor.

## The misconception to avoid

"The software handles the coordinate transformations." It transforms what it is given, using the metadata it is given. If a survey's north reference is recorded wrongly, or its wellhead offset was applied at load time and again at scan time, the transformation is applied correctly to wrong information. The check is a plot, not a re-run.

## Exercise

Two wells are to be scanned. One is stored with local coordinates relative to its own wellhead, azimuths in grid north, depths from a rig floor 25 m above mean sea level. The other is stored in field coordinates, azimuths in true north, depths from mean sea level.

List every transformation needed to bring them into one frame, in order, and say which one, if forgotten, would make the wells look further apart than they are.
