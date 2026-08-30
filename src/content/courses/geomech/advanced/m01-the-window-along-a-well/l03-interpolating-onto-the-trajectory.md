# Interpolating onto the trajectory

The join between a depth-indexed model and a measured-depth well.

{{panel:gm-window-explorer}}

## The mismatch

The mechanical earth model is indexed by TRUE VERTICAL DEPTH, at 50 m intervals from 50 m to 2600 m.

The walk asks for values at whatever true vertical depth the trajectory reaches at each 30 m of measured depth. Those almost never land on a profile sample.

## What the engine does

Linear interpolation between the two bracketing samples, on each of the five quantities separately: overburden, SHmax, Shmin, pore pressure and UCS.

Below the top of the profile it returns the first sample; past the bottom it returns the last.

## Why linear

Because the profile is already a discretisation of something smooth, and a higher-order interpolation would invent structure the samples do not support.

It also keeps the operation obviously reversible: a reader can check any interpolated value with two samples and a fraction.

## Where it is least safe

Where the underlying quantity is not smooth over 50 m.

The UCS in this profile climbs from 7354691.975767447 Pa to 161877171.58368286 Pa over the well, and it climbs FAST at the bottom: between 2550 m and 2600 m it rises by over 15 MPa. Linear interpolation across that interval understates the curvature.

The pore pressure has a corner at 1500 m where the hydrostatic section meets the ramp. Interpolating across a corner rounds it off.

## The clamping at the ends

Above 50 m the walk skips the depth entirely rather than extrapolating, which is the right choice: extrapolating a stress model above its shallowest sample is exactly the shallow-extrapolation problem the Associate tier warned about.

Below 2600 m it would hold the last value flat. Neither well in this course goes deeper than 2600 m of true vertical depth, so it never happens here.

## What a real study does

Samples the model at the same resolution as the log, which is a fraction of a metre, and interpolates onto the trajectory from that.

At log resolution the interpolation question disappears, and a different one appears: how much of the fine structure in the log is real and how much is noise that will produce a spiky and unusable window.

## The check worth running

Interpolate one value by hand and compare. At a true vertical depth of 1019.971130265933, which is where the horizontal well's tightest point sits, the profile brackets are 1000 m and 1050 m, and the fraction is 0.3994226053186594.

## Exercise

Using that fraction, interpolate the pore pressure and the UCS at 1019.971130265933 m of true vertical depth from the profile's 1000 m and 1050 m samples.

Then say which of the two interpolations you trust more, and why.
