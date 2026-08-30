# The slow circulating rate

The pressure that is measured rather than computed.

{{panel:wc-killsheet-explorer}}

## What it is

The standpipe pressure when circulating at a reduced rate, typically a third to a half of the drilling rate, with the well open.

This course uses 4500000 Pa at a rate whose stroke count is not stated, because the pressure is what matters.

## Why a reduced rate

**The choke can control it.** A choke has a limited range and a full drilling rate leaves it little room.

**The friction is lower**, so the equivalent circulating density during the kill is lower and the shoe sees less.

**The crew can follow it.** A slower circulation gives time to read gauges and adjust.

## Why it is measured rather than computed

Because it is a system pressure loss, and computing it would need the whole hydraulics calculation from the previous course, plus a rheology that is current, plus a hole geometry that is right.

Measuring it takes two minutes and gives the actual number for the actual system.

## Where it appears in the kill sheet

Twice, and both are essential.

**In the initial circulating pressure:** ICP is the slow circulating rate pressure plus the SIDPP.

**In the final circulating pressure:** FCP is the slow circulating rate pressure scaled by the kill mud weight over the original.

So the whole schedule sits on top of this one measurement.

## How often it is taken

Every tour, at every bit change, at every significant mud property change, and at more than one rate.

More than one rate matters because the actual kill may be done at a different rate from the one recorded, and the pressure at a rate that was not measured has to be scaled, which is an approximation.

## What happens if it is stale

The whole schedule is offset by the error. If the recorded pressure is 4.5 MPa and the actual is 5.0, then the initial circulating pressure is half a megapascal low and the bottom hole pressure during the kill is half a megapascal below the formation pressure.

That is an underbalance for the whole circulation, and it means more influx.

## Why it is scaled by density for the FCP

Because the friction loss in the string is roughly proportional to density at a fixed rate and geometry. A heavier mud costs more pressure to pump.

That is an approximation: the rheology also changes when a mud is weighted up, and the engine's scaling ignores it.

## Exercise

For the horizontal well's moderate scenario, compute the final circulating pressure from the slow circulating rate pressure and the two mud weights.

Then recompute it with a slow circulating rate pressure of 5.0 MPa, and say how much of the drill pipe schedule moves.
