# Why viscosity needs an index

Gravity blends on a straight line in specific gravity, and sulfur on a straight line in mass fraction. Viscosity mixes nowhere near linearly on any fraction, so the engine does not average it at all. It blends it through an index.

{{panel:crude-assay-explorer}}

## How far apart the viscosities sit

The four field streams in the library carry these viscosities, in cSt: Obigbo Light 4.6, Egbema Medium 22, Asarama Heavy 610 and Ubie Condensate 1.1. Each is typed as the library prints it, and the lessons in this module blend them in pairs.

## What a straight average gives

The engine's answer and a straight average of the cSt figures on mass, with no index, are printed side by side below. The engine never reports the straight average. It is here to be read against the answer.

| blend (by volume) | blend viscosity cSt (the engine) | cSt averaged linearly on mass | linear average minus the engine |
| --- | --- | --- | --- |
| Obigbo export blend, 65 and 35 | 7.4743 | 10.9576 | 3.4833 |
| Asarama Heavy and Ubie Condensate, 50 and 50 | 9.2496 | 339.5596 | 330.3100 |
| Egbema Medium and Asarama Heavy, 50 and 50 | 91.4520 | 324.3561 | 232.9041 |

Read the last column. The straight average minus the engine is 3.4833 cSt for the export blend, 330.3100 for Asarama Heavy with Ubie Condensate, and 232.9041 for Egbema Medium with Asarama Heavy. For Asarama Heavy with Ubie Condensate the engine gives 9.2496 cSt, and the straight average gives 339.5596.

## What the engine does instead

This course gives the reason in one line: "Viscosity mixes nowhere near linearly, so it is blended through an index." The engine does three things. It turns each crude's viscosity into an index, VBI = A x ln(ln(nu + 0.8)) + B with nu in cSt (viscosityBlendIndex). It blends that index. Then it turns the blended index back into a viscosity (viscosityFromBlendIndex). The table above sets the engine's answer beside the straight average, and on every row the last column is positive. For the export blend the engine's figure is 7.4743 cSt, and the straight average on mass is 10.9576.

The index this engine uses is the Refutas index. The next lesson sets out its formula and its two constants. The lesson after that deals with the fraction it is averaged on, which is a held question in this course.

## What the basis cell says

The engine names its basis beside every viscosity it returns: "Refutas index on mass fraction". The straight average in the table carries no basis from the engine, because the engine never forms it. When you quote a blend viscosity, quote the basis with it, so a reader can see which route produced the figure and which fraction the index was blended on.

## Exercise

Read the Asarama Heavy and Ubie Condensate row. Quote the two crudes' viscosities from the library, the engine's blend viscosity, the straight average on mass and the linear average minus the engine. Say what the last column shows for that pair, and quote this lesson's one-line reason for blending viscosity through an index.
