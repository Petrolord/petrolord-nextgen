# Closest approach on an arc

The geometry, and why scanning station to station is not enough.

{{panel:wd-clearance-explorer}}

## The naive method

For each station of the reference well, find the nearest station of the offset well, and take the distance between them.

That is wrong whenever the offset's stations are widely spaced, which is always: the true closest point is generally between two offset stations, and the station-to-station distance overestimates the separation.

On a thirty metre survey interval with two wells crossing at an angle, the overestimate can be metres, and metres is the whole margin.

## The right method

For each reference station, find the closest point on the offset well's PATH, which is a sequence of minimum-curvature arcs.

The engine does this in closed form. For a point Q and an arc starting at P0 with unit tangents rotating from t0 to t1 over a measured-depth span, it solves for the measured-depth offset along the arc at which the distance to Q is minimised.

A straight interval, where the dogleg is essentially zero, reduces to projecting Q onto the tangent line, which is the degenerate case the same routine handles.

## Why closed form matters

Because it runs at every reference station against every candidate offset interval, and a scan over two hundred-station wells is tens of thousands of evaluations. An iterative search at each one would be slow enough to stop a planner from adjusting a trajectory interactively.

It also removes a class of error: an iterative minimiser can converge to a local minimum on a curved interval, and on a well that curves back on itself there are several.

## The coarse pass first

The engine first finds the nearest offset STATION by brute force, then refines on the arcs adjacent to it.

That two-stage structure is what keeps it fast, and it has a limitation worth knowing: if the offset well doubles back so that a distant station is closer than the locally nearest one, a purely local refinement could miss it. The coarse pass over ALL stations is what prevents that.

## What comes out

At each reference station: the closest point on the offset, the centre-to-centre distance, the direction from one to the other, and the geometry needed for the uncertainty combination in the next module.

Plus two bearings: the horizontal bearing from reference to offset, and the toolface bearing, which is the direction to the offset expressed around the reference hole from high side. The second is what a directional driller steers by, because it says which way to point the bend to move away.

## The reference well's stations set the resolution

The scan produces one number per REFERENCE station. Between reference stations, nothing is computed.

So a scan of a well surveyed every thirty metres has a thirty metre resolution, and the true minimum may be between two of them. Where the wells are close, the reference survey is deliberately taken more often, or the plan is resampled to a finer step before scanning.

The engine's resample function exists partly for this: it produces a denser station list on the same arcs, which does not add survey information but does add scan points.

## The misconception to avoid

"The closest approach is where the two wells' measured depths are similar." There is no relationship. Two wells can be closest where one is at 800 m and the other at 2400 m, if one is crossing the other. The scan has to search, and the searched quantity is geometric distance rather than depth.

## Exercise

Two wells cross at right angles, each surveyed every 30 m, at a true closest approach of 12 m.

Estimate the worst overestimate a station-to-station distance check could make, using the geometry of a 30 m interval. State whether that error is larger or smaller than a typical no-go margin.
