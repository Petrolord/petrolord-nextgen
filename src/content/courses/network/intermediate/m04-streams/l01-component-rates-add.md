# Component rates add

A header carrying a dry well and a wet one carries the sum of both, and its water cut is a consequence rather than an input.

{{panel:pd-network-explorer}}

## The whole algorithm, on two wells

The gate fixture puts a big dry well of 2700 stb/d oil, 300 stb/d water, 1600 Mscf/d gas and 30000 lb/d of mass on the same trunk as a small wet one at 200 stb/d oil, 800 stb/d water, 90 Mscf/d gas and 10000 lb/d. The trunk carries oil = 2900.000000 stb/d, water = 1100.000000 stb/d, gas = 1690.000000 Mscf/d and mass = 40000.000000 lb/d.

Every component added. Propagation is arithmetic along the directions the solve found, and it introduces no error of its own.

## Four wells into one trunk

On AGBADA WEST the wells are tested at oil 1690, 605, 1042 and 118 stb/d, water 214, 738, 369 and 401 stb/d, and gas 1305, 542, 1613 and 76 Mscf/d, each handed in with the mass the solve gave it. What arrives at the separator is oil = 3455.000000000 stb/d, water = 1722.000000000 stb/d and gas = 3536.000000000 Mscf/d.

The four tests come to 3455.000000 stb/d oil, 1722.000000 stb/d water and 3536.000000 Mscf/d gas between them. The components close exactly, because addition is all that happened to them.

## What the check says about the same answer

That solve reported converged = true after 11 iterations with a residual of 1.546141e-11 lb/d. `checkConservation`, on the same answer, reports produced = 13300.677150912 lb/d against delivered = 12955.677150912 lb/d, a gap of 345 lb/d, which is 2.593852900 percent of what the engine says was produced.

So the stream on the trunk carries mass = 13300.677150912 lb/d while the solve says that trunk passes 12955.677150912 lb/d. The components closed. The mass did not, and the propagation is why it looks as though it did: it was handed the well test masses rather than the solved well rates.

## What it refuses

`propagateStreams` never compares the mass on a well stream against the rate the solve gave that well. One comparison at the top of the function would catch both a caller who typed the wrong mass and the hole this solve left.

It does refuse one thing outright. If the solved directions form a cycle it stops: "The solved flow directions form a loop, so the network is recirculating. A gathering system does not do that; check for a branch connected backwards."

## The careful mistake

Reading a closed component balance as a checked answer. Oil, water and gas tie out to the tested totals on any network, converged or not, because they were added rather than solved. The only quantity in a stream result that can disagree with the solve is the mass.

## Exercise

Propagate streams on the panel and record the trunk oil, water, gas and mass.

Then read the solved flow on that same trunk and say what the difference between the two masses is, and which well it came from.
