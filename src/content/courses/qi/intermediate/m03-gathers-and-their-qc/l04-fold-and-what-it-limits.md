# Fold and what it limits

Fold counts the traces that fall in a bin. In offset, at a width of 200 m, every bin of gather 5 held one trace. Mapped to angle, the same 13 traces spread unevenly over the bins, and the fold of each angle bin decides how far out in angle an AVO study can go.

## Fold by angle

Each offset is given an angle at each sample, by the method of the next module. Mapped to angle bins, each bin's fold at a sample is the number of offsets whose angle falls in it. On gather 5 at the top, 1292.000000 ms:

| angle bin, degrees | fold |
| --- | --- |
| 5 to 15 | 2 |
| 15 to 25 | 3 |
| 25 to 35 | 2 |

The fold is read at one sample because the angle of an offset changes with time, so the fold of each bin moves along the gather.

## The usable angle

`usableAngle` counts from the nearest bin outwards and returns the far edge of the last bin that still has at least a stated minimum fold. Where even the first bin has too few, it returns none.

| minimum fold | usable angle, degrees |
| --- | --- |
| 1 | 35.000000 |
| 2 | 35.000000 |
| 3 | none |
| 4 | none |
| 5 | none |

## Reading the table

At a minimum fold of 1 or 2, all three bins qualify and the usable angle is 35.000000 degrees, the far edge of the 25 to 35 degree bin. At a minimum of 3 the answer is none, even though the middle bin holds 3, because the count starts at the nearest bin and the 5 to 15 degree bin holds only 2. One thin near bin ends the range before it starts.

## What fold limits

A bin is the mean of the traces that fall in it, so a bin of fold 2 is the mean of two traces. The minimum fold is therefore a stated trade between how far out in angle the study reaches and how many traces stand behind each bin.

Fold is one limit among several. The stretch mute bounds the offsets kept, and the gathers carry the kit's stated mute beyond 40 degrees, by the kit's own angle calculation; muted zeros count as live samples, so the mute and the bin edges are read together.

## What it means for the two questions

For data quality, the fold table says how many traces stand behind each angle bin at the target. For the fluid question, the usable angle is the largest angle the AVO fit can trust, and the gradient depends on the far bin. The next module computes the angles and stacks the bins that qualify.

{{panel:qi-prestack-explorer}}

## Exercise

In the prestack explorer, set Data to "Ekene teaching pack" and View to "Angle gathers and partial stacks", on gather 5. Set Angle bin edges to 5, 15, 25, 35 and Sample time to 1292 ms. Set Minimum fold to 1, 2, 3, 4 and 5 in turn and read the fold column and Usable angle. Then move Sample time later, read the fold again, and say which bin gains or loses traces and why.
