# The controlling station

One station on EBOCHA-5 decides the well, and it is not the one with a gauge on it.

{{panel:pd-profile-explorer}}

## The worst ratio wins

The controlling station is the station with the lowest ratio, whether or not anything is loading. On EBOCHA-5 at 3100.0 Mscf/d under Coleman that is 7500.0 ft, critical rate 3222.613396799 Mscf/d, ratio 0.9619521855. The well-level verdict is `loaded = true` with a `marginPct` of -3.80478145 percent, and both of those numbers come from that one row.

The critical rate rises monotonically with depth on a normal traverse, from 2671.123287413 Mscf/d at the gauge to 3222.613396799 Mscf/d at the shoe, and the actual velocity falls the whole way. That is why the shoe controls: it is the hardest station in the string, and on a normal well it always will be.

## The same well, read two ways, on the same day

| Reading | Ratio | Loaded | Margin, percent |
| --- | --- | --- | --- |
| Point check at the wellhead alone | 1.1605604334 | false | 16.05604334 |
| The controlling station | 0.9619521855 | true | -3.80478145 |

The wellhead reads 1.2064637420 times the shoe. A well that reads 16.05604334 percent clear at the gauge reports -3.80478145 percent where the liquid is, and the second reading is the one that describes what the liquid does.

This is the whole thesis of the course in one table. A gas well drowns from the bottom, and every number that says otherwise was read at the top. Neither row is a mistake in arithmetic. Both are correct evaluations of the same equation, on the same well, at the same 3100.0 Mscf/d, and they disagree because they were evaluated at 880.0 psia and at 1500.0 psia.

## What the controlling point carries

The controlling profile point returns `pPsia` 1500.0, `tempR` 653.67, `z` 0.9142643742, `idIn` 3.548 and `depthFt` 7500.0. Everything a tubing sizing needs is already on it, in the right units, ready to hand straight in.

Nothing makes a caller do that. The sizing function takes a bare pressure, temperature and z from wherever the caller found them, and it has no opinion about which station that was.

## The mistake

Assuming the controlling station is the loaded station, so a well with no loaded stations has no controlling station. At 3450.0 Mscf/d the margin is 7.055969 percent and nothing on EBOCHA-5 loads, but 7500.0 ft is still the worst station and still the one the margin was measured at. A healthy well has a controlling station too, and watching that one number is how you see the well approach the line before it crosses.

## What it refuses

The controlling station is a minimum over the stations supplied. It is not a search, not an optimum and not a depth the module found. Give the profile only a wellhead station and 0.0 ft becomes the controlling station, at a ratio of 1.1605604334, with no complaint and no flag saying the survey stopped at surface.

## Exercise

Read the six ratios on EBOCHA-5 at 3100.0 Mscf/d and identify the controlling station and its margin.

Then re-read the well at 3450.0 Mscf/d, record the new margin, and say whether the controlling station moved.
