# The capstone walkthrough

The capstone asks for six numbers describing the Ekene property model. This lesson walks through each and says what it tests.

## The task

Replace the constant porosity with a per node grid: fit a porosity trend surface to the six well values with the population engine and rerun the volumetrics at the 1560 m contact. Report the trend porosity at prospect P-1 and its mean over the oil bearing nodes, the pore volume and the hydrocarbon pore volume, the STOIIP, and how much the trend model adds over the constant porosity booking.

## The settings

Set the population method to trend. That is the panel's default, so if you have not moved it you are already there. There is nothing else to set: the contact is fixed at 1560 m and the other three properties remain constants.

{{panel:rc-property-explorer}}

## The six values

**Trend porosity at P-1: 0.207142**, tolerance 0.001. Read the lime circle's label on the map, or evaluate the plane at an easting and northing of 1600 m. Because P-1 sits exactly on a grid node, the two routes agree exactly.

**Mean trend porosity over the oil nodes: 0.209368**, tolerance 0.001. The second mean tile. This is the plain average over the 169 oil bearing cells, not the volume weighted one.

**Pore volume: 3.755847** million cubic metres, tolerance 0.02.

**HCPV: 2.441300** million cubic metres, tolerance 0.02.

**STOIIP: 12.796077** MMstb, tolerance 0.05.

**STOIIP added over the constant model: 0.656868** MMstb, tolerance 0.02. The last tile, which reads plus 0.6569.

## What each tests

The porosity at P-1 tests that you evaluated the right model at the right place. A wrong method gives 0.206667 for constant or 0.220920 for krige, both well outside the tolerance.

The node mean tests that you averaged over the oil bearing cells rather than over the live area or the whole frame. Averaging over the 201 live nodes gives 0.206686, which fails.

The pore volume and HCPV test the chain below the divergence point. If either is right and the other wrong, an oil saturation has been applied twice or not at all.

The STOIIP tests the whole chain. The delta tests that you compared against the correct baseline, which is the Associate tier's 12.139208 MMstb at a constant 0.20, not against the well average booking of 12.543848.

## Three checks before submitting

Divide the pore volume by the net volume of 17.815229. The result must be 0.210822, the volume weighted mean, and it must be larger than the node mean you reported.

Confirm that the STOIIP and pore volume ratios agree: 12.796077 over 12.139208 and 3.755847 over 3.563046 must both give 1.054111.

Confirm that the delta plus the Associate booking gives your STOIIP: $12.139208 + 0.656868 = 12.796076$, which matches to the last decimal the tiles print.

## The two common errors

The first is reporting the volume weighted mean, 0.210822, where the node mean is asked for. Both are on the panel, they differ by 0.001455, and the tolerance on that field is 0.001, so the volume weighted value fails by half again the tolerance. Read the tile labels.

The second is computing the delta against the wrong baseline. The uplift is measured against the constant 0.20 booking from the Associate tier. Measuring it against the well average booking gives 0.252229, which is the spatial part alone and fails the tolerance by a wide margin.

## Worked example

Derive the STOIIP from the pore volume by hand, so the tile is confirmed rather than copied.

The pore volume is 3.755847 million cubic metres. Apply oil saturation, which is $1 - 0.35$:

$$3.755847 \times 0.65 = 2.441300 \times 10^6 \ \mathrm{m^3}$$

which is the HCPV field. Convert to stock tank barrels through the formation volume factor:

$$\frac{2.441300 \times 10^6}{1.2} \times 6.2898 = 12.796077 \times 10^6 \ \mathrm{stb}$$

which is the STOIIP field. Subtract the Associate booking of 12.139208 to get the delta of 0.656869, which is inside the 0.02 tolerance on 0.656868.

## Exercise

Record the six capstone values and run all three checks. State what each check confirmed.

Self check: pore over net gives 0.210822, confirming the pore volume is consistent with the net volume and that the volume weighted mean exceeds the node mean of 0.209368 as it should. The two ratios both give 1.054111, confirming the chain below the pore volume used the stated constants. The delta added to 12.139208 reproduces the STOIIP, confirming the baseline was the constant 0.20 booking.
