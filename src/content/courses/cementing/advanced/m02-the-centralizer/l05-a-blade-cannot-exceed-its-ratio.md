# A blade cannot exceed its ratio

A rigid centralizer's best case is fixed by two diameters, before anything else happens.

{{panel:cm-standoff-explorer}}

## The ceiling

    standoff at the centralizer = (blade OD - casing OD) / (bore - casing OD)

No load in it, no spacing, no inclination. Whatever else the job does, that is the most a rigid centralizer can deliver at the centralizer itself.

## On this well

A 0.206 m blade on 0.1778 m casing:

**In the open hole**, bore 0.2159:

    (0.206 - 0.1778) / (0.2159 - 0.1778) = 0.7401574803149601

**In the cased section**, bore 0.2204974:

    (0.206 - 0.1778) / (0.2204974 - 0.1778) = 0.66046176113768

The SAME device gives 74 percent in the smaller hole and 66 in the larger one, which already fails the API target in the cased section.

## Which is the whole difference from a bow spring

A bow spring keeps pushing. Put it in a bigger hole and it expands further and still pushes, so a bow spring in an oversized hole still centralizes, with a lower spring rate.

A rigid centralizer is a fixed object. Put it in a bigger hole and it just rattles around in it.

## And a washed-out hole is a bigger hole

This is where it bites. The standoff calculation runs on the NOMINAL bore, so a 30 percent washout is invisible to it.

In a hole that has actually washed out to an effective bore of 0.22104932820526735, the same 0.206 m blade gives

    (0.206 - 0.1778) / (0.22104932820526735 - 0.1778) = 0.6520332493064135

against the 0.7401574803149601 the calculation reports. Nine points of standoff, lost to a washout the model does not see.

A bow spring in the same washed-out hole loses much less, because it expands to fill it.

## The clamp at both ends

    Math.min(1, Math.max(0, ...))

A blade larger than the bore would give a ratio above one, which is a device that cannot be run. A blade smaller than the casing gives a negative, which is not a centralizer.

Both are clamped rather than refused, which is a place the engine is less strict than it is elsewhere.

## The sag still applies

The rigid branch sets the standoff AT the centralizer. The mid-span sag is computed the same way for both types and subtracted afterwards.

So a rigid centralizer's reported standoff is its blade ratio less the sag, and the sag does not care what device is holding the ends up.

## Exercise

Compute the blade diameter that would give exactly 67 percent standoff in this well's open hole at the nominal bore.

Then compute what that same blade would give if the hole had washed out to 0.22104932820526735 m.
