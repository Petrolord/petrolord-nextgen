# After the bit

The longer half of the operation, with nothing on the schedule.

{{panel:wc-killsheet-explorer}}

## What happens

Once the kill mud reaches the bit, the string is full of kill mud and stays that way.

Nothing about the drill pipe side changes for the rest of the circulation. So the drill pipe pressure is held at the final circulating pressure, constant, until the annulus is displaced.

## How long that is

Bottoms up. On the horizontal well, 5613.784216003705 strokes from the bit to surface, against 2019.2214924632256 to reach the bit, for a full cycle of 7633.0057084669315.

So the schedule covers 0.26453818712900984 of the full cycle and the constant-pressure phase covers the rest.

## What the annulus is doing meanwhile

Everything interesting. The influx is rising and expanding, kill mud is displacing original mud upward, and the casing pressure is changing continuously.

The choke is doing all the work to keep the drill pipe gauge on one number.

## The casing pressure history

It rises as the gas expands, peaks around the time the influx reaches the choke, and then falls sharply once the influx is out.

That peak is the number to compare against the MAASP, and this engine does not compute it. The kick tolerance calculation in the Expert tier is the closest available check: it asks whether the influx expanded up to the SHOE would fracture it.

## The end

When the kill mud reaches surface, the well is full of kill mud from top to bottom. Shut in and both gauges read zero.

Then a flow check, and then the operation is over.

## What can go wrong in this phase

**The drill pipe pressure drifts.** Something has changed: a washout, a plugged nozzle, a second influx, or a pump rate change. Module 4 of this tier is about diagnosing which.

**The casing pressure approaches the MAASP.** The influx is expanding more than expected, or the kick was larger than the pit gain suggested. The choke cannot be opened further without underbalancing.

**Gas at the choke.** The peak is arriving, and the choke's control becomes difficult because a compressible fluid responds differently.

## Why the schedule stops at the bit

Because there is nothing left to schedule. The drill pipe side is a known constant and the annulus side was never computable.

## Exercise

Compute what fraction of the total strokes the schedule covers on each of the two wells.

Then say which of the two would give the choke operator more time on a changing schedule, and whether that is an advantage.
