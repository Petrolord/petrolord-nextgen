# Why viscosity needs an index

Gravity blends on a straight line in specific gravity, and sulfur on a straight line in mass fraction. Viscosity mixes nowhere near linearly on any fraction, so the engine does not average it at all. It blends it through an index.

{{panel:crude-assay-explorer}}

## How far apart the viscosities sit

The four field streams in the library carry these viscosities, in cSt: Obigbo Light 4.6, Egbema Medium 22, Asarama Heavy 610 and Ubie Condensate 1.1. A pipeline or a terminal pump sees the viscosity of the blend, and a blend that pumps at one viscosity can stall at another.

## What a straight average gives

The engine's answer and a straight average of the cSt figures on mass, with no index, are printed side by side below. The engine never reports the straight average. It is here to be read against the answer.

| blend (by volume) | blend viscosity cSt, index on mass (the engine) | cSt averaged linearly on mass (no index) |
| --- | --- | --- |
| Obigbo export blend, 65 and 35 | 7.4743 | 10.9576 |
| Asarama Heavy and Ubie Condensate, 50 and 50 | 9.2496 | 339.5596 |
| Egbema Medium and Asarama Heavy, 50 and 50 | 91.4520 | 324.3561 |

For the export blend the engine gives 7.4743 cSt and the straight average gives 10.9576. For Asarama Heavy with Ubie Condensate the engine gives 9.2496 cSt and the straight average gives 339.5596. For Egbema Medium with Asarama Heavy the engine gives 91.4520 and the straight average gives 324.3561.

## Why the straight average fails

A small amount of a thin oil cuts the viscosity of a thick one hard. A straight average carries the thick crude's large cSt figure into the result at its full size. The physics does not work that way: the thin crude thins the whole blend. Blending practice has long found that viscosity becomes close to linear in blend share only after a double logarithm is taken of it. So blending engines transform each viscosity into an index, average the index, and transform the answer back.

The index this engine uses is the Refutas index. The next lesson sets out its formula and its two constants. The lesson after that deals with the fraction it is averaged on, which is a held question in this course.

## What this means for a blender

A heavy crude that will not pump at a terminal's temperature is often cut with a light crude or a condensate. A blender who sized the diluent on the straight average would be sizing it on a figure the engine does not recognise. The index route is the one a blending engine can defend, and the engine names its basis beside every viscosity it returns, so a reader can see which route produced the figure.

## Exercise

Read the Asarama Heavy and Ubie Condensate row. Quote the two crudes' viscosities from the library, the engine's blend viscosity and the straight average on mass. Say what the two blend figures show about how a straight average treats a very thick crude in a blend, and explain in one sentence why an index is needed.
