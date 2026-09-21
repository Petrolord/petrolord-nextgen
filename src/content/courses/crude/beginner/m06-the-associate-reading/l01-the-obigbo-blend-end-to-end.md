# The Obigbo blend end to end

This lesson reads one blend the whole way through. Obigbo Light and Egbema Medium, 65 and 35 by volume, is the Obigbo export blend, and every module of this tier has touched it. Here it is as blendCrudes returns it, with each property beside the basis the engine names.

{{panel:crude-assay-explorer}}

## The blend, property by property

| property | value | basis |
| --- | --- | --- |
| specific gravity | 0.8611 | volume |
| API | 32.8173 | computed from the volume-blended specific gravity, never averaged directly |
| sulfur wt% | 0.2642 | mass |
| TAN mg KOH/g | 0.3915 | mass |
| nitrogen wt% | 0.1029 | mass |
| nickel ppm | 6.5980 | mass |
| vanadium ppm | 4.0673 | mass |
| viscosity cSt | 7.4743 | Refutas index on mass fraction |
| CII | 0.9163 | cii, band unstable, stable false |

Read the basis column from the top. Specific gravity is blended on volume. API is converted from it. The five per-mass properties are weighted by mass fraction, Obigbo Light at 0.6346 and Egbema Medium at 0.3654. Viscosity goes through the Refutas index on mass fraction, which is the held convention of module three. The CII is formed from SARA blended on mass.

## The shortcuts this blend refuses

Each of those bases has a wrong alternative that gives a plausible figure, and module two and module three printed them for this very blend. The volume-weighted mean of the API numbers is 32.9850, and the blend API minus that mean is -0.1677. Sulfur on volume is 0.2590, and mass minus volume is 0.0052. The Refutas index on volume fractions gives 7.3107 cSt, and the mass basis minus the volume basis is 0.1636. A straight average of the cSt figures on mass gives 10.9576.

None of those is in the engine's result. They are here so you recognise them when someone hands them to you.

## Stability: the index and the rule of thumb

With every SARA supplied, the export blend screens unstable on the CII, at 0.9163, with stable false. With the SARA taken away, the gravity screen gives no verdict: the API contrast is 10.9000, the rule of thumb did not raise its flag, and the engine says that this alone says nothing about whether the blend is stable.

The two answers are the clearest lesson in the tier. A screen that turned an absent flag into a clearance would have shipped a blend its own index calls unstable. The engine's CII route and its fallback agree with each other in the only way they can: the fallback declines to decide, and the index decides.

## What the barrel turns into

The blend's cut yields on the studio's default cuts, from the blend's own curve, are these. The Professional tier explains how that curve is formed.

| cut | yield volume percent |
| --- | --- |
| LPG / Light ends | 0.2708 |
| Naphtha | 22.1456 |
| Kerosene / Jet | 16.6342 |
| Diesel / Gasoil | 17.0344 |
| Vacuum gasoil | 26.8621 |
| Vacuum residue | 17.0528 |
| total | 100.0000 |

The six yields total 100.0000. Closes: true. Cuts with no yield: nothing. The digest takes these yields from the blend's own curve and says the Professional tier explains that curve, so this tier reads the yields as printed.

## Reading it in one pass

The blend in one pass reads a gravity of 32.8173 API, a sulfur of 0.2642 wt% on mass, a viscosity of 7.4743 cSt on the "Refutas index on mass fraction", six cut yields that close, and a CII of 0.9163 in the unstable band with stable false. Every one of those figures is the engine's, on a basis it names, and a reader can trace each back to the rule that formed it.

## Exercise

Read the blend table. Quote the sulfur, its basis, the viscosity and its basis. Then read the CII row beside the gravity-screen answer for the same blend with its SARA removed. Say what the two stability answers together show about the difference between an index that decides and a rule of thumb that declines to, and name the basis each figure in your answer was formed on.
