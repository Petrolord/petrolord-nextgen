# The driller's question

The Professional tier answered the geoscientist's question: what is the pressure? This tier answers the driller's: what do I pump? The two questions meet in the wellbore, and this lesson is about why the second one reshapes everything the first one produced.

## What the mud column does

Drilling mud is a fluid column standing in the well from surface to bit. Its pressure at any exposed depth is its density times g times the height of column above that depth. That one column must, simultaneously, at every metre of open hole: exceed the pore pressure, or formation fluid enters the well, a kick; and stay below the fracture pressure, or the well fractures the rock and loses mud.

One density, one column, many depths, two constraints per depth. That is the driller's problem in full, and it explains the reshaping this tier performs: a curve of pressures in MPa answers no version of it, because the mud contributes pressure in proportion to depth, so the comparison must be made in pressure-per-column-height, which is a density.

## Why density is the natural unit

Convert every pressure constraint to the density of the mud that would just balance it, and the many-depth problem collapses. The mud density must exceed the pore pressure EMW at every exposed depth, so it must exceed the MAXIMUM of the floor curve over the open hole. It must stay below the fracture EMW at every exposed depth, so it must stay below the MINIMUM of the ceiling curve. Two curve extremes, one interval, and any single density inside it drills the whole section.

That collapse is the entire reason equivalent mud weight exists. It is not a unit preference; it is the change of variable that turns 401 pairs of constraints into one interval.

## The datum discipline, inherited and sharpened

The Associate tier taught that EMW is referenced to a datum, sea level in this course, and that a value on a different datum is a different number. At this tier the discipline stops being pedantic and starts being operational: the mud column stands from the rig floor, not sea level, and offshore the gap between the two is real. This course keeps sea level throughout, states it, and flags every place a rig-floor reference would shift a value; the exercise below quantifies the shift once, so you know its size, several kg/m3 for a typical air gap, an order of magnitude over the capstone tolerances.

The general rule to carry: an EMW without a stated datum is not yet a number. The capstone's expected values are sea-level referenced, as the capstone statement says.

## What this tier's window is not, yet

Honesty about scope before the module builds the window. The interval this tier computes is the STATIC window: pore pressure to fracture pressure, mud at rest. Real mud programs narrow it from both sides. From below: a trip margin, because pulling pipe swabs pressure down, plus a kick margin. From above: circulating pressure, because pumping adds friction to the column's effective weight downhole, the equivalent circulating density, plus a surge margin for running pipe. The static window is the honest first object, the margins are refinements inside it, and this well's window is wide enough, 724.82 kg/m3 at TD, that the refinements fit easily; module 2's last lesson prices them.

## Worked example

The two-constraint collapse, run on this well's TD numbers alone as a miniature. Suppose only the TD sample were exposed. Floor: pore pressure 47.408579625 MPa at 4100 m of column is 1179.1048116553065 kg/m3. Ceiling: fracture pressure 76.55157117548856 MPa at the same column is 1903.9238599165737 kg/m3. Any mud between them balances the one exposed depth: a 1200 kg/m3 mud exerts $1200 \times 9.80665 \times 4100 = 48.248718$ MPa there, over the pore pressure's 47.41, under the fracture's 76.55. The full-section problem is this check run at every exposed depth at once, which is what the curves in the next module do.

## Exercise

Quantify the datum shift once. A rig floor sits 25 m above sea level, so the mud column at TD is 4125 m, not 4100. State the rig-floor-referenced EMW of the TD pore pressure and the difference from the sea-level value.

Self check: $47408579.625 / (9.80665 \times 4125) = 1171.9587218876989$ kg/m3, against 1179.1048116553065 sea-level referenced: 7.14 kg/m3 lighter, because the same pressure spread over a taller column needs less density. Fourteen times the capstone's 0.5 tolerance, from 25 m of air. The datum line in a report is not boilerplate.
