# Soil conductivity

One number decides what a trench is worth, and it is typed in. The engine cannot measure a seabed and cannot disagree with the figure it is handed.

{{panel:pd-thermal-explorer}}

## Four soils under the same 4.0 ft trench

The published pipe, films and 8.625 in coated diameter, with only the soil conductivity moved.

| Soil k, Btu/(hr ft degF) | Ground resistance | U of the buried build | Ground share, percent |
| --- | --- | --- | --- |
| 0.5000, dry soil | 0.9870172999 | 0.4317172866 | 67.658698 |
| 0.9000, concrete-like backfill | 0.5483429444 | 0.6173610374 | 53.751540 |
| 1.2000, wet soil, the published case | 0.4112572083 | 0.7132000377 | 46.571938 |
| 2.0000, a wetter and denser seabed | 0.2467543250 | 0.8764769611 | 34.340349 |

Resistances in hr ft degF/Btu per foot, U in Btu/(hr ft2 degF). Only the 1.2 row is a published case; the other three are sweep points on published inputs.

## The ground term is exactly inverse in k

That is the same rule a layer follows, because it is the same kind of term: a shape divided by a conductivity. Halve the conductivity and the resistance doubles, while the shape factor does not move, because the shape factor is geometry.

What is not inverse in k is the U. The films, the steel and the foam sit in the same stack and none of them cares about the soil, so U runs from 0.4317172866 at k 0.5 to 0.8764769611 at k 2.0, which is not the ratio the resistances moved by.

## What the catalog offers, and what it does not

Two soils ship as defaults: soilWet, wet soil or seabed, at 1.2000 Btu/(hr ft degF), and soilDry at 0.5000. Every trench still takes its own k as an input, so the catalog is a convenience rather than an authority.

An id the catalog does not recognise returns a NaN, and that is deliberate: the header records that an earlier version returned carbon steel for an unknown id, which made a mistyped insulation look far better than it was.

## The mistake

Carrying a dry soil number into a wet seabed, or the reverse. On this pipe at this depth the two catalog soils return 0.4317172866 and 0.7132000377 Btu/(hr ft2 degF). A line designed on the first and buried in the second loses heat faster than the design said, and nothing in the return complains, because both are valid answers to the question each was asked.

## What a single k assumes

One conductivity, everywhere, for the whole trench. Backfill that differs from native soil, a wet layer over a dry one, a line that crosses from mud into sand: all of them arrive as one figure, and the function returns a resistance to ten places for whichever figure it is given.

## Exercise

Set the published buried build in the panel and read the ground resistance at k 0.5, 0.9, 1.2 and 2.0.

Then say which of those four you could defend to a reviewer without a site measurement.
