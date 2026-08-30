# Where the overburden comes from

An integral of a density log, and the part of it nobody logs.

{{panel:gm-stress-explorer}}

## The definition

The overburden stress at a depth is the weight of everything above it, per unit area:

    Sv(z) = g x integral of rho(z') dz' from surface to z

with rho the bulk density of the rock and the fluid in it.

It is the one principal stress that has a direct physical meaning requiring no model at all.

## How it is obtained

Integrate a bulk density log from surface. That is arithmetic, and the answer is as good as the log.

## The problem at the top

Nobody logs the top of a well. The conductor and surface sections are drilled fast, cased quickly, and often carry no density log at all.

So the shallowest few hundred metres of the integral, which is where the rock is least dense and least well known, is filled in from a regional trend or an assumed compaction curve.

## What this profile does

It carries a CONSTANT overburden gradient of 2300 kg/m3 equivalent mud weight at every depth from 50 m to 2600 m.

That is a simplification and it is stated as one. A real overburden gradient starts near the density of water at the mudline and climbs as the sediment compacts, reaching a value like this only at some depth.

## What the simplification costs

At depth, very little. By 2000 m a real gradient has usually flattened out and a constant value is close.

At the top, a lot. A constant 2300 kg/m3 gradient at 50 m gives an overburden of 1127764.75 Pa, and a real shallow section at that depth would be lighter.

## Why it matters here specifically

Because the horizontal stresses are computed FROM the overburden. An overburden that is too large at shallow depth gives horizontal stresses that are too large at shallow depth, and module 5 shows exactly that going wrong in this profile's upper 1150 m.

## What a real study does

Builds the overburden from a checkshot-calibrated density curve, extrapolates the shallow section with a published compaction relationship, and states which part of the curve came from which source.

## Exercise

At 50 m and at 2600 m, compute the overburden pressure from the constant 2300 kg/m3 gradient.

Then suppose the true shallow bulk density is 1900 kg/m3 rather than 2300 over the top 200 m, and say by how much the overburden at 2600 m would change. Compare that against the change at 200 m.
