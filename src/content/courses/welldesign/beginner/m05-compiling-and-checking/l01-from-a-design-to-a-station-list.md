# From a design to a station list

Turning a sequence of intentions into the same object a real survey produces.

{{panel:wd-survey-explorer}}

## The two representations

A **design** is a sequence of segments: hold 500 m, build at 3 degrees per 30 m to 40 degrees, hold 800 m. Compact, editable, and what a planner thinks in.

A **station list** is measured depths with inclinations and azimuths. Verbose, and the only thing the rest of the world can use: survey listings, well databases, anti-collision scans and log depth matching all take station lists.

The compiler turns the first into the second.

## What the compiler does

It walks the segments, starting from the tie-on attitude, and emits stations.

**A hold** is a straight interval at constant attitude. It is exact with just its endpoints, but the compiler subdivides it anyway so that plots against measured depth stay dense through a long tangent.

**A build** changes inclination at a constant rate, at constant azimuth. It is a circular arc in the vertical plane, exact with endpoints, and again subdivided.

**A turn** changes azimuth at a constant rate at constant inclination.

**A build-turn** does both.

**A toolface arc** applies a constant curvature in a constant toolface direction, which is the general primitive: every other kind is a special case of it.

## Why it subdivides

Two reasons, and only one of them is about accuracy.

Accuracy is not the reason for holds and pure builds: those are exact from their endpoints under minimum curvature. The subdivision is for PRESENTATION, so a depth-axis plot has points to draw and a listing does not jump 800 m between rows.

For a general toolface arc the subdivision does matter, because the exactness argument only holds for arcs that minimum curvature can reproduce, and the compiler keeps the step small enough that it can.

## What comes out

The compiler returns four things:

**The station list**, ready to be treated exactly like a survey.

**The well path**, positions at every station.

**The survey table**, the full listing with TVD, displacements, doglegs and vertical section.

**A QA report**, which is the subject of the next lessons.

That the design is put through the SAME survey mathematics as a real survey is the point. A planned well and a drilled well are then directly comparable, row against row, with no method difference between them.

## The tie-on

Every compilation starts somewhere: a measured depth, an inclination and an azimuth. For a surface hole that is zero, zero, and the plan azimuth.

For a sidetrack it is a station partway down an existing well, and the compiled list continues from there. Getting the tie-on wrong shifts the entire compiled well, and it is one of the few errors that produces a perfectly plausible-looking listing.

## The azimuth of a vertical segment

A vertical hold has no azimuth. The compiler carries the tie-on azimuth through it, which is a convention rather than a measurement, and it refuses to turn a vertical hole at all: an azimuth change at zero inclination is meaningless, so the compiler fails rather than producing a number.

That refusal is worth noticing. A tool that quietly accepted it would produce a station list with a turn nobody could drill.

## The misconception to avoid

"The plan is a curve and the survey is points, so they are different kinds of thing." After compilation they are the same kind of thing, and that is deliberate. Everything downstream, including the anti-collision scan in the Expert tier, treats a plan and a survey identically, which is why a plan can be scanned against a neighbour before a bit turns.

## Exercise

Write out, as a segment list, the design for a well that kicks off at 400 m, builds at 2.5 degrees per 30 m to 55 degrees, holds for 1200 m, then drops at 2 degrees per 30 m to 30 degrees.

State the measured depth at the end of each segment, and hence the total measured depth of the well.
