# Beyond SIL three, a redesign

{{panel:lp-worksheet}}

Some rows demand more risk reduction than a safety instrumented function is credited with supplying. The engine has a state for them, BEYOND_SIL3_REDESIGN, and it returns the required PFDavg with it. What it never does is trim the demand to the largest band it knows and report that instead.

## Three rows past the end of the table

| required RRF, stated | outcome | required PFDavg | in the SIL 4 band |
| --- | --- | --- | --- |
| 10000 | SIL3 | 0.000100000000 |  |
| 50000 | BEYOND_SIL3_REDESIGN | 0.000020000000 | true |
| 100000 | BEYOND_SIL3_REDESIGN | 0.000010000000 | true |
| 500000 | BEYOND_SIL3_REDESIGN | 0.000002000000 | false |

At 10000 the row is still SIL3, on the inclusive edge of that band. At 50000 and 100000 the required PFDavg falls inside the SIL 4 band and the engine's note reads: "the required PFDavg lies in the SIL 4 band: redesign the process or add non-SIS layers rather than rely on a SIL 4 SIF".

At 500000 the required PFDavg is below the bottom of the table altogether and the note changes: "the required PFDavg is below the SIL 4 band: no SIF can supply it, redesign".

The two notes are different findings. The first says a function of that class is a thing the table describes and the process sector does not build. The second says no function supplies it at all.

## Why the demand is never clipped

The state carries the required PFDavg intact, so a worksheet shows how far beyond the table the row sits. A row at 0.000020000000 and a row at 0.000002000000 are both beyond SIL 3 and they are a decade apart in what they would need, and a project responds to them differently. Clipping both to SIL3 would report the same thing about two rows that are not the same.

It also keeps the conversation honest. A project told only that a row is beyond SIL 3 will reach for a bigger function, and the state exists to say that the answer is upstream of the function. The required PFDavg printed with it is what a reviewer uses to judge how much has to move and where.

## What a redesign means here

The demand can be reduced anywhere along the chain, and every one of those routes is outside the safety instrumented system.

| where to act | what it changes |
| --- | --- |
| the initiating event | remove the cause, and the frequency falls at the head of the chain |
| the enabling condition | change the configuration, and the fraction of time falls |
| an independent protection layer | add one, and the credited product falls by its IPL PFD |
| the consequence | change the inventory or the layout, and the row's tolerable frequency is set against a different consequence |

Most rows that land here are rows whose layers are thin, and adding one credited layer at an IPL PFD of 0.1 moves the demand by a decade on its own. That is usually cheaper and always easier to maintain than a function nobody in the sector builds.

ORONI shows the last route in reverse. The same row, unchanged, reads BEYOND_SIL3_REDESIGN at a tolerable frequency of 1e-9 per year with a required risk reduction factor of 13500.000000 and a required PFDavg of 0.000074074074. The plant did not change. The tolerance did.

## Exercise

Take ORONI's mitigated frequency of 0.000013500000 per year and the required risk reduction factor of 13500.000000 it reports at a tolerable frequency of 1e-9 per year. Work out the required PFDavg and check it against 0.000074074074. Then say which of the four routes in the table above you would examine first for that row, and what figure you would expect it to move.
