# Temperature and compressibility

Two properties held constant that are not.

## Temperature

The rheology is measured at surface, usually at 120 F. The mud downhole is hotter: a geothermal gradient of 25 degrees per kilometre puts a 3000 m well's bottom at 75 degrees above surface.

A hotter mud is thinner. Its plastic viscosity and its yield point both fall, sometimes substantially.

## Which way that goes

The annulus loss falls, so the computed equivalent circulating density is HIGHER than the real one.

That is the conservative direction, which is a relief, and it is a systematic error of the order of five to fifteen percent of the uplift on a deep well.

## The complication

The mud is not at one temperature. It goes down cold, warms up, comes back up losing heat to the formation, and arrives at surface warmer than it left.

So the pipe and the annulus are at different temperatures at every depth, and a proper treatment needs a thermal model coupled to the flow.

Those exist. They matter most in deep water, where the mud in the riser is chilled by cold seawater and thickens dramatically.

## Compressibility

Mud is treated as incompressible. It is not: a typical water-based mud compresses by a fraction of a percent per 10 MPa.

At 3000 m the hydrostatic pressure is around 42 MPa, so the mud at the bottom is a fraction of a percent denser than at surface.

## Which way that goes

The real hydrostatic pressure is slightly HIGHER than a constant-density calculation gives, because the mud is denser at depth.

That partly offsets the thermal effect, which makes it less dense. On a deep hot well the two are of similar size and opposite sign, and a model with neither is often closer than a model with only one.

## Why that is not an argument for having neither

Because the cancellation is accidental and it does not hold at every depth or in every mud. An oil-based mud is far more compressible and far more thermally sensitive than a water-based one, and there the two do not cancel.

## What this engine does

One density, one rheology, both at the values supplied. No temperature input exists.

## Exercise

Estimate the density change from compressibility at 3000 m for a mud with a compressibility of 3e-10 per pascal.

Then estimate the density change from thermal expansion over 75 degrees at 4e-4 per degree, and compare the two.
