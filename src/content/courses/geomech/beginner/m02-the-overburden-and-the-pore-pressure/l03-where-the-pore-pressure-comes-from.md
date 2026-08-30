# Where the pore pressure comes from

The one input this course takes entirely on trust.

{{panel:gm-stress-explorer}}

## What it is

The pressure of the fluid in the rock's connected pore space. It pushes outward on the grain framework and it is what a formation pressure tool reads.

## Why the model needs it

Twice over.

**As a lower bound on the mud weight.** Mud below the pore pressure lets formation fluid into the well, which is the well control course.

**As the thing that turns total stress into effective stress.** Rock strength depends on the stress carried by the grain framework rather than on the total stress, and the pore pressure is the difference between them.

## Where it comes from

Not from this engine. The profile arrives with a pore pressure column already in it.

Upstream, it comes from one of three places: direct measurements with a formation pressure tool, a calibrated model built from sonic or resistivity trends, or a regional expectation. The Pore Pressure course in the Geoscience module is the whole subject.

## Why the engine does not compute it

A deliberate design decision, stated in the engine's own header. Overburden and pore pressure sources live upstream, so the geomechanics module stays pure mechanics and imports nothing from another domain.

That is a good boundary. A module that both estimates pore pressure and consumes it can hide a circular argument, and this one cannot.

## What this profile carries

Hydrostatic at 1030 kg/m3 equivalent mud weight from 50 m down to 1500 m, then a ramp that climbs to 1186.5384615384614 kg/m3 by 2600 m.

That shape is the classic one: a normally pressured section over a mildly overpressured one.

## What the ramp implies

Something is holding fluid in below 1500 m. Usually that is a seal: a shale that dewatered too slowly for the pressure to equalise as the sediment compacted.

The geomechanical consequence is that effective stress stops growing as fast with depth below the seal, so the rock below it is weaker and the stresses more closely spaced than the depth alone suggests.

## The honest position

If the pore pressure is wrong, everything here is wrong, and this course cannot tell you whether it is.

That is why a geomechanics study and a pore pressure study are done together and calibrated against the same well events.

## Exercise

At 1500 m and at 2600 m, compute the pore pressure in pascals from the equivalent mud weights given.

Then compute the effective vertical stress at both depths, and say by what factor it grew over that interval. Compare that against the factor by which the depth grew.
