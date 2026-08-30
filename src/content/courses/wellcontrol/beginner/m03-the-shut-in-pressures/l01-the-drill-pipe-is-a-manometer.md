# The drill pipe is a manometer

Why one gauge tells you the formation pressure and the other does not.

{{panel:wc-killsheet-explorer}}

## The two gauges

When a well is shut in there are two pressures at surface: one on the drill pipe and one on the casing, which is the annulus.

They read different numbers, always, and the difference is not an error.

## What is in each of them

**The drill pipe** is full of mud of known weight, all the way from surface to the bit. Nothing else. The influx entered the annulus, not the string.

**The annulus** is full of mud from surface down to the top of the influx, and then influx from there to the bottom.

## Why that makes the drill pipe a manometer

A manometer is a tube of known fluid connecting a pressure you want to measure to a gauge you can read.

The drill pipe is exactly that. The pressure at its bottom is the formation pressure, because the bit is open to the formation. The fluid in it is mud of known density. So:

    formation pressure = mud hydrostatic to the bit + shut-in drill pipe pressure

One measurement and one number you already knew, and the formation pressure follows.

## Why the annulus is not

Because the fluid in it is not of known density. There is mud on top and influx below, and the influx's density is exactly what you do not know.

The casing pressure is therefore a reading you cannot invert without an assumption, and the assumption is the whole subject of module 2 of the next tier.

## The numbers

On the horizontal well with 2 MPa of shut-in drill pipe pressure and 1440 kg/m3 mud at 1214.859173174 m of TVD:

    17155726.143274635 Pa of mud column + 2000000 Pa = 19155726.143274635 Pa

Which is the formation pressure, and it is what the kill sheet uses.

## The one thing that breaks it

A float valve in the string, which stops flow up the drill pipe and therefore stops it acting as a manometer. There are procedures for that and there is a lesson on it later in this module.

## Exercise

For the slant well at 1440 kg/m3 mud and 0.8 MPa of shut-in drill pipe pressure, compute the formation pressure using the TVD from the volume explorer.

Then compute what you would get if you used the measured depth instead, and say which way the error goes.
