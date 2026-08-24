# Quality control

A burial and heat result that is wrong looks exactly like one that is right. Both come out of the same engine, both plot as smooth curves, and both report their numbers to more digits than anybody needs. What separates them is whether somebody ran a fixed set of checks before the result was allowed out of the office.

This lesson is that pass, written the way a reviewer would run it before anyone builds a maturity model on your work. Seven checks, in the order the questions would be asked.

## Check 1: are the compaction parameters stated and sourced

The reviewer's first question is which curve you used. A porosity at depth is meaningless without the phi0 and the c behind it, because a different lithology gives a different answer at the same depth.

For this fixture the answer is shale with phi0 0.63 and c 0.00051 per m, from the engine's library, with a grain density of 2720 kg/m3. Expect all three to be quoted, and expect the lithology to have come from a log rather than from an assumption about depth.

Where a column has several lithologies, ask for the table. Sandstone at 0.49 and 0.00027 per m, limestone at 0.45 and 0.00035 per m and dolomite at 0.50 and 0.00040 per m behave differently enough that the assignment changes the result.

## Check 2: is porosity a fraction and inside its bounds

Read the porosities and confirm they are fractions in v/v, between zero and phi0, and falling with depth.

Shale runs 0.63 at 0 m, 0.48819739371548104 at 500 m, 0.37831221465172754 at 1000 m, 0.22717481230903933 at 2000 m, 0.13641747040908445 at 3000 m and 0.08191808785340832 at 4000 m. Every value is below the surface value and each is below the one above it.

A value above 1 is a percentage in a fraction's place. A value above phi0 is the wrong lithology or a sign error on depth. Both are cheap to spot and expensive to leave in.

## Check 3: does every restoration conserve grain

This is the check that carries the most weight, because it is an identity and not a trend.

The 100 m shale at 1000 m has 63.11728183077296 m of grain. Restore it to the surface, get 159.79553483785466 m, then take the solid thickness of that restored layer at the surface and the answer is 63.117281830772924 m. The same grain to within 1e-13, which is arithmetic in the last digits and nothing else.

Ask for this round trip explicitly. A restoration that does not return its own grain is wrong, and no plot of the burial curve will show it.

## Check 4: is every restored thickness larger than the present thickness

Decompaction adds pore space back, so restoration always grows a layer. The fixture restores 100 m from 500 m to 134.010303 m, from 1000 m to 159.795535 m, from 2000 m to 194.513330 m and from 3000 m to 214.973300 m.

The trend is as informative as the values. The deeper a layer is found, the more it grows, because more of it had been squeezed away. A set of restorations that does not increase with the depth of burial has something wrong in it, and a restored thickness smaller than the present one means the two depths were supplied in the wrong order.

## Check 5: is the temperature column monotonic and hand checkable

Read the column top to bottom and confirm it rises at every step: 10 degC at 0 m, 11.666666666666671 degC at 50 m, 41.66666666666673 degC at 950 m, 44.190476190476254 degC at 1050 m and 59.619047619047684 degC at 1950 m.

Then check one value by hand. In steady state with no internal heat production the answer is exactly $T = T_s + Qz/k$, so 10 plus 0.06 times 950 divided by 1.8 gives the 41.66666666666673 degC at 950 m. A reviewer who can reproduce one value with a calculator has established that the solver was given the inputs the report claims.

## Check 6: do the gradient breaks sit where the conductivity breaks

The gradient is $Q/k$, so it is constant inside a layer of constant conductivity and it can only change where conductivity changes.

This column has one conductivity break, at 1000 m. Above it the gradient is 33.333333333333336 degC per km and below it 17.142857142857142 degC per km, nearly a factor of two apart, with the same 60 mW/m2 flowing through both. One break in the rock, one break in the gradient, and no change in heat flow at all.

A gradient that shifts inside a uniform layer means the conductivity is not what the model was told. A gradient quoted for the whole column as a single number means somebody has averaged across the break and will extrapolate it into the wrong formation.

## Check 7: is the scope of the result stated in the report

Last, the reviewer reads the report rather than the model. Three things must be on the page.

Every value carries its depth and its unit. Thickness in m, porosity as a fraction in v/v, temperature in degC with the depth it was read at, gradient in degC per km with its interval, and heat flow as 0.06 W/m2 or 60 mW/m2 with the unit written.

The column is described as steady state rather than as a history, so no reader takes it for the temperature the rock had in the past.

And the report says plainly that no maturity was computed. A burial and heat result handed on without that sentence will have a maturity read into it by the next person who picks it up.

Run checks 2 to 6 against the panel below, reading the compaction curve, the thicknesses and the heat column from the same view.

{{panel:bs-burial-heat-explorer}}

## Exercise

Run the seven checks on this fixture and write one line for each saying what passed. Then answer in one sentence: which check catches a percentage entered where a fraction was expected, and which catches a solver that was given a different conductivity from the one the report names?

As a self check: the parameters are shale phi0 0.63, c 0.00051 per m and grain density 2720 kg/m3; the porosities are fractions falling from 0.63 at 0 m to 0.08191808785340832 at 4000 m; the restoration returns 63.117281830772924 m against the 63.11728183077296 m it started with; the restored thicknesses grow with burial depth from 134.010303 m to 214.973300 m; the column rises from 10 degC at 0 m to 59.619047619047684 degC at 1950 m and 41.66666666666673 degC at 950 m reproduces by hand; the gradient takes its single step from 33.333333333333336 to 17.142857142857142 degC per km at the one conductivity break at 1000 m; and the report states depths, units, the steady state assumption and the absence of any maturity. Check 2 catches the percentage, since the value would sit above phi0 or above 1, and check 6 catches the wrong conductivity, since the gradient in that layer would not be the $Q/k$ the report implies.
