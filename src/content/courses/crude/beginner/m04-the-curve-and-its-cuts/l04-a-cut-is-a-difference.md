# A cut is a difference

A refinery sells a barrel of crude as cuts: fractions that boil between two temperatures. cutYields returns each cut's yield in volume percent of the whole crude, and every yield is one subtraction: the curve at the cut's upper bound minus the curve at its lower bound.

{{panel:crude-assay-explorer}}

## The studio's default cut set

| cut | from F | to F |
| --- | --- | --- |
| LPG / Light ends | start of the curve | 90 |
| Naphtha | 90 | 350 |
| Kerosene / Jet | 350 | 500 |
| Diesel / Gasoil | 500 | 650 |
| Vacuum gasoil | 650 | 1000 |
| Vacuum residue | 1000 | end of the curve |

A first cut with no lower bound starts at nothing distilled. A last cut with no upper bound runs to the end of the curve. Every cut in between has two temperatures, and the curve is read at both.

## Yields of the four full crudes

| crude | LPG / Light ends | Naphtha | Kerosene / Jet | Diesel / Gasoil | Vacuum gasoil | Vacuum residue |
| --- | --- | --- | --- | --- | --- | --- |
| Obigbo Light | 0.4167 | 25.2590 | 18.2484 | 16.5914 | 25.7110 | 13.7736 |
| Egbema Medium | 0.0000 | 16.3636 | 13.6364 | 17.8571 | 29.0000 | 23.1429 |
| Asarama Heavy | 0.0000 | 8.8462 | 11.5886 | 14.0097 | 35.5556 | 30.0000 |
| Ubie Condensate | 2.8571 | 52.5974 | 22.7807 | 14.8897 | 6.8750 | 0.0000 |

Read the LPG column. Obigbo Light's curve starts at 85 F, so a little of it has distilled by 90 F, and the cut returns 0.4167. Egbema Medium's curve starts at 95 F, above the cut's upper bound of 90, so nothing has distilled by then and the cut returns 0.0000. That zero is a real answer. The curve's first point is at 0 percent, and below it the curve says nothing has distilled.

Read the residue column. Ubie Condensate's curve ends 100 at 760, below the residue cut's lower bound of 1000 F. Everything has distilled by then, so the residue cut returns 0.0000. Asarama Heavy's curve reads 70 at 1000, and its residue cut, which runs from 1000 F to the end of the curve, returns 30.0000.

## Why yields are differences

A cut is a band of temperature, and the curve is cumulative. What boils in the band is everything distilled by the top of the band, less everything distilled by the bottom. The engine never measures a cut directly. It reads the curve twice and subtracts, with the same straight-line reading between measured points that the last lessons set out.

That is why a cut can be no better than the curve at its two ends. If either reading is unknown, the cut has no yield.

## An inverted cut

A cut drawn backwards, from 500 F to 350 F on Obigbo Light, has no yield. The engine names it in its list of unknown cuts, marked inverted, 500 to 350 F. A negative yield would be a number with no physical meaning, and the engine will not return one.

## What the cut set tells a buyer

Put the rows side by side and each crude's product slate is visible at a glance: which crude is rich in naphtha, which in vacuum gasoil and residue. That is the first thing a refinery asks of an assay, and it is two readings of a curve per cut. The planner who reads it still has to check each column against the curve it came from, because a yield is only as good as the two readings behind it.

## Exercise

Read the Naphtha and Vacuum residue columns for Obigbo Light and Asarama Heavy. Quote all four yields. Say what they show about the two crudes as refinery feed. Then explain, from each crude's curve, why Egbema Medium's LPG yield is 0.0000 and why Ubie Condensate's residue yield is 0.0000, and say why neither zero is a blank.
