# Anisotropy

The one rock property in the skin calculation, and where it bites.

{{panel:ps-skin-explorer}}

## What it is

The ratio of horizontal to vertical permeability. A value of one is isotropic; typical clastic reservoirs run from about three to about ten, and laminated ones can be a hundred or more.

It is the only rock property the skin calculation takes, and it is a ratio rather than a level.

## Where it enters

Only the converging-flow term, and there twice.

The dimensionless spacing carries a square root of the anisotropy in the numerator, so more anisotropy makes the vertical journey look longer.

The dimensionless perforation radius carries one plus the square root of the RECIPROCAL, so more anisotropy makes the tunnel look relatively smaller at intercepting vertical flow.

Both push the converging term up.

## How much it matters

Going from isotropic to ten to one on the published high-shot-density gun roughly triples the converging term. The total still stays comfortably negative, because on that gun the converging term was small to begin with.

On a gun where the converging term already dominates, which means a low shot density, the same change is much more painful.

## What to do about it

Shoot more holes. Anisotropy hurts through the vertical convergence path, and shot density shortens that path.

That interaction is the practical content of this lesson: the right shot density is not a property of the gun, it is a property of the rock. A laminated reservoir needs more shots per foot than a massive one to reach the same skin.

## Where the model runs out

Anisotropy as a single ratio describes a medium that is uniformly anisotropic. A LAMINATED reservoir is not that: it is alternating layers, some of which are shale and contribute nothing.

A perforation that lands entirely in a shale lamina is not a poorly draining perforation, it is an absent one. No value of the anisotropy ratio represents that, and this is the point at which a perforation skin correlation stops being the right tool.

## Exercise

Say what the anisotropy ratio is and which of the four components it enters.

Explain the two separate ways it raises that component.

Then say what design change compensates for high anisotropy, and describe the case where the single-ratio model stops being adequate.
