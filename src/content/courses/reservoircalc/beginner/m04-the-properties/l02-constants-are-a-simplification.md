# Constants are a simplification

At this tier every property in the chain is one number that applies everywhere. Porosity is 0.20 at the crest, 0.20 at the flank, 0.20 in the cell next to the dry well and 0.20 in the cell 800 m from the nearest control. That is not what the rock does, and this lesson is about the gap between the model and the rock.

## No property is uniform

Reservoirs are deposited by processes that vary in space, so their properties vary in space too.

Porosity varies with grain size, sorting, burial depth and cement. In a channel system the axis is cleaner and more porous than the margin. In a shoreface the porosity climbs upward as the sand coarsens. Across a structure, the crest may have been at a different diagenetic history from the flanks.

Net to gross varies for the same depositional reasons. Sand bodies thin and split laterally into interbedded sand and shale, so the fraction of the interval that is reservoir falls as you move away from the depocentre.

Water saturation varies most of all with height above the free water level. Capillary equilibrium means saturation falls as buoyancy pressure rises, so a cell near the crest with a tall oil column above the contact holds less water than a cell just above the contact. A single $S_w$ for the whole accumulation is a thickness weighted average of a curve, not a constant of the rock.

At Ekene, the six wells have their own petrophysical results and those results are not identical. A single value is what you get by averaging them, which throws away everything the spatial pattern was telling you.

## What the engine actually does

The engine that computed the module 3 numbers does not use a scalar for any property. It takes an array of values, one per grid node, and it works cell by cell:

$$\mathrm{HCPV} = \sum_j h_j \, A \cdot \mathrm{NTG}_j \cdot \phi_j \cdot (1 - S_{w,j})$$

The Associate tier fills those arrays with the same value at every node, which is why the chain collapsed into four multiplications on the total. The machinery for spatial variation is already there and it is being handed a flat surface. That matters for what comes next, because moving to varying properties does not require a different calculation, only different inputs.

## What a property grid would change

Suppose porosity is no longer a constant but a grid, built by interpolating the six well values across the map the same way TOP_SAND was interpolated.

The first change is that the answer stops being separable. With a constant, the total is the product of the summed volume and the constant. With a grid, each cell contributes its own product and only then are the contributions summed. A sum of products is not the product of the sums, so the two routes give different answers unless the property happens to be uncorrelated with the column.

The second change is that the difference has a sign you can predict. Structural highs often carry the cleaner, better sorted rock, so porosity tends to be higher where the oil column is tallest. When a property correlates positively with column height, the cells that carry the most volume also carry the best rock, and the volume weighted average porosity comes out above the plain arithmetic average of the wells. Using the plain average understates the booking. Where the correlation runs the other way the error runs the other way.

The third change is one of honesty rather than arithmetic. A property grid is an interpolation of six values across hundreds of nodes, which is exactly the situation the mapping course spent a module warning about. Replacing a constant with a grid adds realism and it also adds invented detail. A property map is not more true than a constant. It is more specific, and specificity has to be earned with data.

## Where this goes

The Professional tier splits the field on a sealing fault and books each block separately, which is the same idea applied to geometry rather than to rock quality.

The Expert tier is where the constant porosity goes. It fits a trend surface to the six well porosities, feeds that grid to the same engine in place of the flat 0.20, and reruns the chain at the same contact of 1560 m. The booking comes out at 12.796077 MMstb against the 12.139208 MMstb the constant produced, a difference of 0.656868 MMstb in the upward direction. That difference is computed from the unrounded engine values, so it differs in the last digit from what you get by subtracting the two rounded figures printed beside it. Both are correct at the precision each is quoted to, and the engine difference is the one to trust.

Treat that as a forward pointer and nothing more. Do not carry it into any answer at this tier, and do not treat it as a correction to the number you have been working with. The Associate booking of 12.139208 MMstb is the correct answer to the question this course asks, which is what the chain gives for the stated property set. The Expert number is the answer to a different question asked with different inputs, and the point of quoting it here is only to show that the choice between a constant and a trend is worth real barrels rather than being a matter of presentation.

Keep the scale of it in proportion, though. Module 4 finishes by comparing every property effect against what moving the contact does, and nothing in the property set has anything like that leverage.

## Exercise

A colleague proposes replacing the constant porosity with a grid interpolated from the six well values, and predicts that the booked volume will not change much because the average of the six values is close to 0.20. State the condition under which they would be right, and the condition under which the booking would come out clearly higher than the constant case.

Self check: they would be right if porosity were uncorrelated with oil column, since then the volume weighted average of the grid is close to the plain average and the sum of products is close to the product of the sums. The booking comes out clearly higher if porosity is systematically better where the column is tallest, typically near the crest, because the thickest cells then carry the best rock and the volume weighting pulls the effective porosity above the plain average of the wells.
