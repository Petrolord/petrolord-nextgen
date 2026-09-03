# Underbalance is a band

The one part of this tier that is field guidance rather than a correlation, and how it is returned.

{{panel:ps-skin-explorer}}

## What underbalance is

Perforating with the wellbore pressure BELOW the reservoir pressure, so that the instant a tunnel is formed, reservoir fluid surges into it and carries the crushed debris back out.

It is the standard way of attacking the one skin component that is not geometry.

## How much is needed

Enough to move the debris, and not so much that the surge itself destabilises the formation. Too little leaves the tunnel dirty; too much can produce sand on the spot.

The published guidance relates the minimum to the permeability and to the fluid. Tighter rock needs more, because the flow that has to do the cleaning is slower. Gas needs more than oil, by roughly a factor of four in these bands.

## What the engine returns

A RANGE, in both pascals and pounds per square inch, with a permeability class label, a flag saying it is approximate, and a provenance string naming what it is and what would replace it.

Not a point value. There is no single right underbalance, and returning one number would imply a precision that the underlying guidance does not have.

## The three classes

High permeability, at or above a hundred millidarcies. Moderate, from ten up to a hundred. Low, below ten. The boundaries are inclusive from below, so a hundred millidarcies is high and ninety nine point nine is moderate.

Within each class, an oil band and a gas band, and the gas band is several times the oil one.

## What the bands do not carry

The upper limit against sanding. The bands say how much underbalance is needed to clean; they do not say how much the formation can take before the surge produces sand.

That cap comes from the rock strength, which is the Expert tier's calculation, and the engine deliberately composes the two outside the perforation module rather than pretending one function knows both.

## Why a band with provenance beats a number

Because a reader can see what kind of thing it is. A number invites arithmetic; a band with a provenance string invites a decision.

## Exercise

Explain what underbalance is and which skin component it attacks.

State the three permeability classes, their boundaries and which side of each boundary is inclusive.

Then say what the bands do not include, where that missing piece comes from, and why the engine keeps the two apart.
