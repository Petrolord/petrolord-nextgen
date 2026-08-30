# Achieved TOC

Where the cement actually ended up, against where it was asked to go.

{{panel:cm-placement-explorer}}

## How it is found

At the last step, look at the annulus segments, keep the ones whose fluid kind is `lead` or `tail`, and take the shallowest depth any of them reaches.

    achievedTocMd = min over cement segments of segment.fromMd

Note what is NOT counted: the spacer. A spacer sitting above the cement is not cement, and a top of cement that included it would be a lie of exactly the spacer's length.

## On this course's jobs

Both wells, both programmes, land on their target: 1200 m on the slant well and 1000 on the horizontal one, to within a rounding error of about two parts in ten to the sixteenth.

That agreement is not a coincidence and it is not a validation either. The volumes were computed from the same geometry the placement runs in, so of course they agree. It is a consistency check on the code, not on the world.

## The warning

    Achieved TOC 1160 m differs from target 1200 m by more than 30 m.

Thirty metres of tolerance, and the engine names both numbers.

## What makes them disagree

**A volume error.** Slurry ordered for one geometry and placed in another.

**An excess mismatch.** This is the important one. The volume sheet and the placement both take the same excess, so they cannot disagree inside the model. In the field they disagree constantly: the volume was ordered at 15 percent and the hole washed out 30, and the cement stops short.

**Losses.** Cement that went into the formation is not in the annulus. Not modelled.

**No cement at all in the annulus.** The engine reports null and warns separately:

    No cement reached the annulus; check volumes.

which happens if the slurry volume is smaller than the shoe track plus the casing bore, so the cement never turns the corner.

## Why 30 m

It is a judgement, and it is a reasonable one: 30 m is about the length of a mixing zone, so a disagreement smaller than that is inside the model's own resolution.

It is also a hard-coded number with no comment, which is the kind of thing worth noticing in an engine you are relying on.

## The check the field actually has

The plug bump at the calculated displacement volume. That confirms the INSIDE geometry and the displacement arithmetic, and says nothing about the annulus.

Where the cement actually stopped is found afterwards, by a temperature log or a bond log, and often not at all.

## Exercise

The slant well's cement top is at 1200 m and its previous shoe at 1400.

Compute how much annular volume would have to be missing for the achieved top to fall to 1400 m, and express it as a percentage of the annular slurry.
