# Contours on a plot plan

{{panel:qr-event-tree}}

A plot plan marked with individual risk usually shows contours: lines joining points of equal LSIR. The Purple Book asks for the individual risk contours 1e-4, 1e-5, 1e-6, 1e-7 and 1e-8 per year to be shown. Along a transect, a contour appears as a crossing distance, the point where the LSIR falls through that level. This lesson reads the crossings on the transect of the previous lesson, and explains why a crossing distance is a presentation and never an answer.

## The crossings

The transect runs a jet fire at 5e-5 per year and an explosion at 2e-5 per year, both stated, with a stated probability of death at each distance.

| crossing, m from the release | contour level per year |
| --- | --- |
| none on this transect | 1e-4 |
| 126.982958 | 1e-5 |
| 187.323816 | 1e-6 |
| 252.680255 | 1e-7 |
| 350.000000 | 1e-8 |

The 1e-4 contour has no crossing. The highest LSIR on the line is 0.000070000000 per year at the release itself, which is below 1e-4, so that contour never appears on this transect.

## How a crossing is found

The engine knows the LSIR only at the distances it was given. Between two of them it must interpolate. It interpolates in log10 of the LSIR between the two points that bracket the level, and linearly where one side is zero. The basis says, verbatim: "LSIR(x) = sum f_i P_i(x); contour crossings interpolated in log10(IR) between bracketing points (linear in IR when one side is 0)".

Take the 1e-6 contour. The LSIR is 0.000004500000 per year at 150 m and 0.000000600000 at 200 m, so the level lies between them, and the log10 interpolation places it at 187.323816 m. The 1e-8 contour lies between 300 m, at 0.000000020000, and 400 m, where the LSIR is zero, so there the engine interpolates linearly and places it at 350.000000 m.

## A presentation rule

The interpolation is a PRESENTATION rule the engine chose. Nothing published fixes it. A different rule, linear throughout for example, would draw the same contour at a different distance from the same LSIR values. The LSIR at each stated distance is arithmetic on stated inputs. The crossing between them is a drawing convention.

That is why a crossing distance is never graded. It depends on how finely the transect was sampled and on the interpolation chosen, and two honest analysts could place the same line differently. The values you can defend to twelve decimals are the LSIRs at the distances you stated.

When you read a contour on a plot plan, read it as a picture of the LSIR values behind it. If a building sits close to a contour, go back to the LSIR computed at that building's own location and read that figure instead.

## Exercise

For the 1e-5 contour, find the two distances in the transect of the previous lesson whose LSIRs bracket 1e-5 per year, and write both LSIRs to twelve decimals. Confirm that the crossing of 126.982958 m lies between the two distances. Then say whether a building standing just beyond that crossing would be better assessed from the crossing or from an LSIR computed at the building's own distance, and why.
