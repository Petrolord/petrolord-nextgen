# The workflow end to end

Five modules have taken the Beginner basin problem apart a piece at a time. This lesson puts it back in working order, because the pieces are not independent. Each step consumes what the step before it produced, and a lithology chosen carelessly in step one is still wrong at the last temperature without ever announcing itself.

The order is: lithology, porosity, solid thickness, restoration, column setup, solve, read, hand on.

## Step 1: choose the column and its lithologies

Nothing can be computed until every layer has a lithology, because the compaction curve is a property of the lithology and not of the basin.

The engine's library gives each rock a surface porosity, a compaction constant and a grain density.

| lithology | phi0 | c (per m) | grain density (kg/m3) |
| --- | --- | --- | --- |
| shale | 0.63 | 0.00051 | 2720 |
| sandstone | 0.49 | 0.00027 | 2650 |
| limestone | 0.45 | 0.00035 | 2710 |
| dolomite | 0.50 | 0.00040 | 2600 |

This step produces no result of its own and it controls every number that follows. Shale is the most porous of the four at the surface, at 0.63 against sandstone's 0.49, and by 2000 m the order has reversed, with sandstone holding 0.285547 and shale 0.227175. Assign the lithology from the log, not from the depth.

## Step 2: read porosity at depth

With phi0 and c fixed, porosity at any depth is $\phi(z) = \phi_0 e^{-cz}$. For shale that gives 0.63 at 0 m, 0.37831221465172754 at 1000 m and 0.22717481230903933 at 2000 m, the last of which is one of the six graded capstone numbers.

Porosity is a fraction in v/v at every stage of this workflow. Nothing downstream accepts a percentage.

## Step 3: convert thickness to grain

Porosity at a point is not yet a thickness. Integrating the pore space out of an interval leaves the solid thickness, the rock with the pores removed.

In 100 m of freshly deposited surface shale the solid thickness is 38.57953418711555 m, another graded number. The other three lithologies give 51.655586470092686 m for sandstone, 55.77839233115688 m for limestone and 50.98679894040397 m for dolomite in the same 100 m. So 100 m of fresh shale is only about 38.6 m of grain and the rest is pore.

## Step 4: take the grain of the buried layer

The same calculation on a layer in place is what makes restoration possible. A 100 m shale whose top sits at 1000 m has a solid thickness of 63.11728183077296 m.

Compare that with step 3. The same 100 m of rock holds more grain at 1000 m than at the surface, because compaction has already removed the pore space that the surface layer still has.

## Step 5: restore the layer

Hold the grain constant and ask what thickness it occupies at a shallower depth. Restoring the 63.11728183077296 m of grain to the surface gives 159.79553483785466 m, the third graded number. The layer has lost 59.79553483785466 m to compaction, which is 37.42 percent of its original thickness.

The check runs immediately. Taking the solid thickness of that restored 159.79553483785466 m at the surface returns 63.117281830772924 m, the same grain to within 1e-13.

## Step 6: build the heat column

Geometry is done. The heat column is a separate build with its own inputs: a surface temperature of 10 degC, a basal heat flow of 0.06 W/m2 which is 60 mW/m2, an upper layer 1000 m thick at conductivity 1.8 over a lower layer 1000 m thick at 3.5, and ten 100 m cells in each layer so the cell centres fall at 50, 150 and so on to 1950 m.

## Step 7: solve and read

In steady state with no internal heat production the solution is exactly $T = T_s + Qz/k$, applied layer by layer. Three readings from it are graded.

| depth | temperature |
| --- | --- |
| 50 m, the first cell | 11.666666666666671 degC |
| 950 m, the low-k base | 41.66666666666673 degC |
| 1000 m, the layer boundary | 43.333333333333336 degC |
| 1950 m, the deepest cell | 59.619047619047684 degC |

The gradient is 33.333333333333336 degC per km above the boundary and 17.142857142857142 degC per km below it, with the same 60 mW/m2 passing through both. The gradient is the ratio $Q/k$ rather than a property of the earth.

## Step 8: hand it on

The tier stops here, with a compaction curve, a set of porosities at depth, solid and restored thicknesses and a steady temperature column, every value quoted with its depth. Those are exactly the inputs a maturity model consumes, and the Professional tier is where a temperature history becomes a reflectance.

## Where each course fits

This is the tenth and last course in the geoscience path, so the ladder closes here.

Well Data Manager is the formal prerequisite and earns the place, because a depth reference settled there is what makes 1000 m mean the same thing in every well. Petrophysics turns the logs into the porosity and lithology this course assigns in step 1. Well Correlation names the layers, so a column is a sequence of stratigraphic units rather than a stack of gaps. Seismolord and Mapping carry those units away from the wells and give the layers their thicknesses across the basin. ReservoirCalc Pro turns a container into volumes. Rock Physics explains why a rock's measured properties change as its porosity falls, which is the same compaction this course integrates. Pore Pressure works the other consequence of that compaction, the fluid that cannot escape. Earth Modeling assembles all of it into one frame.

Every one of those courses describes the basin as it is today. This one asks how it got that way, which is why it comes last.

## Exercise

Write the eight steps in order and put beside each the single number from this fixture that it produces. Then answer in one sentence: which step produces no number of its own and yet controls every number after it?

As a self check: step 1 assigns shale with phi0 0.63 and c 0.00051 per m; step 2 gives 0.22717481230903933 at 2000 m; step 3 gives 38.57953418711555 m of grain in 100 m at the surface; step 4 gives 63.11728183077296 m of grain in the layer at 1000 m; step 5 restores it to 159.79553483785466 m; step 6 sets 10 degC, 0.06 W/m2 and conductivities of 1.8 over 3.5 in ten 100 m cells each; step 7 reads 11.666666666666671 degC at 50 m, 41.66666666666673 degC at 950 m and 59.619047619047684 degC at 1950 m; and step 8 hands those on with their depths attached. The step that produces nothing and controls everything is step 1, because phi0 and c set every porosity, every solid thickness and every restored thickness in the chain.
