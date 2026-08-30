# Top of cement

The one number on the sheet that is a decision rather than a measurement or a guess.

{{panel:cm-volume-explorer}}

## What it is

The measured depth at which the cement column in the annulus is meant to stop. Everything below it is cemented and everything above it is whatever was in the hole before.

On the slant well the target is 1200 m and on the horizontal well 1000 m.

## What decides it

**Regulatory minimum.** Most jurisdictions require cement across and some distance above any hydrocarbon-bearing or fresh-water zone.

**The previous shoe.** Almost every programme brings the cement up INSIDE the previous casing by some margin, so that the lap between the two strings is cemented rather than relying on the shoe track of the string above.

On both of this course's wells the top of cement is 200 m above the previous shoe: 1200 against 1400 on the slant well, 1000 against 1200 on the horizontal one. That 200 m overlap is the design choice.

**Cost and risk.** A higher top means more cement, a heavier annular column and a higher circulating density. Bringing cement to surface on a deep string is often impossible for that reason.

## Where it enters the arithmetic

Once, in one line:

    annular slurry = volume between the top of cement and the shoe

So the top of cement and the shoe are the two endpoints of the annular integral, and nothing else about the top matters to the volume.

## The engine's constraints on it

Not negative, and not below the shoe. Both refused by name.

Nothing forces it above the previous shoe, because a job that stops inside the open hole is legitimate: a liner lap or a shallow shoe would both do it.

## Target and achieved

The Professional tier distinguishes the TARGET top of cement, which is an input, from the ACHIEVED one, which the placement simulation reports from where the cement actually ends up. They agree when the volumes and the geometry agree, and the engine warns when they differ by more than 30 m.

That warning is the check that catches an excess error, a volume error or a geometry error, all three of which show up the same way.

## The true vertical depth of it

The volume sheet also reports the TVD at the top of cement, which on the slant well is 1129.0397016870152 m against a measured depth of 1200. That is the number the hydrostatic pressure of the column is computed from, and it is not the number the volume is computed from.

## Exercise

The slant well's top of cement is at 1200 m and its previous shoe at 1400 m.

Compute the annular volume of the 200 m overlap inside the previous casing, and express it as a fraction of the total annular slurry of 24.34828356497546 cubic metres.
