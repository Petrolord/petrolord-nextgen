# Gradients and mud weight

A geoscientist hands over a pressure in megapascals at a depth. A drilling engineer works in mud weight, which is a density. This lesson is the translation between the two, and it is where the frame you are building starts to look like something a rig can use.

Depths are metres below mudline.

## Why a density

The drilling engineer does not order a pressure. They order a fluid, and the fluid is specified by its density, because that is what the mud engineer can actually mix and measure.

The pressure a static mud column exerts at the bottom of the hole is its density multiplied by gravity multiplied by the height of the column. So for any pressure you care about, there is a mud density that would produce exactly that pressure at that depth. Quoting a pressure as that equivalent density puts it in the same units as the mud, so the comparison a driller has to make becomes a comparison of two densities.

That quantity is the equivalent mud weight.

## The definition used here

$$EMW = \frac{P}{g\,(z + d_w)}$$

with $P$ in Pa, $g$ in m/s2, $z$ the depth below mudline in m and $d_w$ the water depth in m. The result is in kg/m3.

The term $(z + d_w)$ is the piece to be careful about. The mud column in a marine well does not stand from the mudline. It stands from the rig floor, and for teaching purposes here from sea level, so its height is the water depth plus the depth below mudline. Every equivalent mud weight in this course is referenced to sea level, and a value quoted against a different datum is a different number.

This is the third quantity from the previous lesson, the average gradient from a datum expressed in density units rather than as pressure per metre. It is not the local rate of change of pressure with depth. It is a whole column, from sea level to the point of interest, collapsed into one density.

## The two bracket values

Apply that to the two computed curves at total depth in the golden well, which is 4000 m below mudline in 100 m of water.

| Pressure at total depth | Value | Equivalent mud weight |
| --- | --- | --- |
| hydrostatic | 41.408579625 MPa | 1029.878049 kg/m3 |
| overburden | 91.12306695073282 MPa | 2266.333384 kg/m3 |

Look at the hydrostatic line first, because it contains a check you can make in your head.

The pore fluid density is 1030 kg/m3, and the equivalent mud weight of the hydrostatic column comes out at 1029.878049 kg/m3, which is just under it. That is exactly what should happen. The column is not all pore fluid. The top 100 m of it is seawater at 1025 kg/m3, which is slightly lighter, so the average density of the whole column from sea level down is pulled a fraction below the pore fluid value.

If you compute a hydrostatic equivalent mud weight in a marine well and it comes out exactly at the pore fluid density, you have left the seawater out of the column and you happen to be dividing by the wrong height as well. If it comes out well below the pore fluid density, your water depth term is too large. The relationship between those two numbers is a free quality check and it costs nothing to make.

Now the overburden line. An equivalent mud weight of 2266.333384 kg/m3 at total depth is the density of a mud that would exert the full weight of the overlying section. No well is drilled with that, because at that mud weight the formation is carrying no effective stress and the rock parts.

## What the bracket means

Those two values, 1029.878049 kg/m3 and 2266.333384 kg/m3, bracket every pressure the well can hold at total depth. The pore pressure is somewhere between them. The fracture pressure is somewhere between the pore pressure and the upper value. The mud weight is somewhere between the pore pressure and the fracture pressure.

That is the entire structure of a well design, expressed in one unit that everybody in the room understands. Once the frame is in equivalent mud weight, the conversation stops being about megapascals and starts being about whether a section can be drilled with one mud weight or needs to be split by a casing string.

Notice how much of that structure you already have. Both bracket values come out of this tier, from the hydrostatic column of module 2 and the overburden integration of module 3. The two curves in between are what the higher tiers add, and they are both constrained by the bracket you have built.

## A note on other unit conventions

Mud weight is quoted in kg/m3 here, and in kg/l or specific gravity in parts of the industry, and in pounds per gallon in North America and much of the offshore world that inherited its conventions. The physics is identical and only the label changes, but a number handed across that boundary without its unit is a genuine hazard. The same rule as the previous lesson applies with more force here, because these numbers go to people who act on them.

The panel below reads the frame at a depth you choose, in both pressure and equivalent mud weight. Move the depth and watch how the two bracket values converge toward the shallow section and spread apart with depth.

{{panel:pp-frame-explorer}}

## Exercise

Explain in two or three sentences why the equivalent mud weight of the hydrostatic column at total depth is 1029.878049 kg/m3 when the pore fluid density is 1030 kg/m3, and say what you would suspect if the same calculation returned exactly 1030 kg/m3. Then state the two equivalent mud weights that bracket the pressures at total depth in this well and name which curve each one comes from.

Self check: the equivalent mud weight is referenced to sea level, so the column it averages is 100 m of seawater at 1025 kg/m3 on top of 4000 m of pore fluid at 1030 kg/m3, and the lighter seawater pulls the average of the whole column marginally below the pore fluid value, giving 1029.878049 kg/m3. A result of exactly 1030 kg/m3 would mean the seawater part of the column had been left out of both the pressure and the height, so the calculation had reduced to the pore fluid density by construction. The bracket at total depth runs from 1029.878049 kg/m3, which is the hydrostatic curve from module 2, up to 2266.333384 kg/m3, which is the overburden curve from module 3.
