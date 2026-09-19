# SARA blends on mass

SARA fractions are weight percent, per unit mass, like sulfur. So screenBlendStability blends each SARA fraction on mass and then forms the blend's CII from the blended fractions.

{{panel:crude-assay-explorer}}

## The blended fractions

| pair (by volume) | blended saturates | blended aromatics | blended resins | blended asphaltenes | CII | band |
| --- | --- | --- | --- | --- | --- | --- |
| Asarama Heavy with Ubie Condensate, 50 and 50 | 57.0828 | 24.7639 | 11.4498 | 6.7035 | 1.7614 | unstable |
| Asarama Heavy with Egbema Medium, 70 and 30 | 32.2493 | 38.7563 | 19.5153 | 9.4791 | 0.7161 | uncertain |
| Egbema Medium with Obigbo Light, 85 and 15 | 36.6357 | 41.3109 | 18.8084 | 3.2450 | 0.6634 | stable |

Each blended fraction is a mass-weighted average of the crudes' own fractions. The CII is then formed from the four blended fractions, exactly as it is for a single crude.

## The order of operations

The engine blends the fractions first and forms the index second. The CII is a ratio, and a ratio of averages is a different number from an average of ratios. Blending the four fractions keeps the blend's composition physical: it is the saturates, aromatics, resins and asphaltenes actually present in the mixed oil.

Look at the first pair. Asarama Heavy alone has a CII of 0.7668 and Ubie Condensate alone 8.3458, as the first lesson of this module showed. The blend's CII is 1.7614. The blend's index comes from the blend's composition, and there is no shortcut from the two single-crude indices to it.

## The wrong basis beside the right one

As with sulfur, the table can be read against the same index formed from SARA blended on volume instead. The engine never reports the volume figure.

| pair (by volume) | CII (the engine, SARA on mass) | CII from SARA blended on volume instead |
| --- | --- | --- |
| Asarama Heavy with Ubie Condensate, 50 and 50 | 1.7614 | 1.9718 |
| Asarama Heavy with Egbema Medium, 70 and 30 | 0.7161 | 0.7141 |
| Egbema Medium with Obigbo Light, 85 and 15 | 0.6634 | 0.6671 |

For Asarama Heavy with Ubie Condensate the engine gives 1.7614 and the volume route gives 1.9718. For Asarama Heavy with Egbema Medium the engine gives 0.7161 and the volume route gives 0.7141. For Egbema Medium with Obigbo Light the engine gives 0.6634 and the volume route gives 0.6671.

The volume figures are plausible on every row. They are formed on a basis the SARA fractions do not have, so they are the wrong numbers, however close they land.

## Why the basis matters near a band edge

A screen with thresholds turns a small difference into a different answer when a figure sits near a threshold. The uncertain pair's CII is 0.7161 on mass and 0.7141 on volume, and the lower band edge is 0.7. A blend with a CII near a band edge is exactly the case where the basis must be right. That is why the engine forms the mass shares once and uses them for every per-mass property, SARA included.

## The same rule, a fourth time

This module repeats a pattern from module two. Gravity goes through specific gravity. Sulfur and the metals go on mass. Viscosity goes through an index. SARA goes on mass, and the index is formed after blending. Each property has one basis, and the wrong basis gives a number that looks right. The only defence is to know the basis of every figure you read, and the engine prints it beside every property it returns.

## Exercise

Read the three rows of the second table. Quote the engine's CII and the CII from SARA on volume for each pair. Say what the pairs of figures show about whether the volume basis would have moved any of these blends into a different band, using the thresholds 0.7 and 0.9. Then explain why the engine blends the four fractions before forming the index.
