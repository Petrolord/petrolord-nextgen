# Formation temperature

The lab report in the typewell brief says the water sample measures 0.114 ohm.m at 75 degF. The formation the water came from sits at 180 degF. Those two numbers cannot be compared, mixed, or substituted for one another, because water resistivity depends strongly on temperature. Before the Arps correction can fix that mismatch, you need a formation temperature you can defend, and this lesson is about where that number comes from.

## The bench and the reservoir

A produced water sample rides to surface, cools for hours or days, and is measured on a laboratory bench at room conditions. The convention in most catalogs and lab reports is 75 degF, and that is what the typewell lab used. Meanwhile the formation at around 2000 m depth is far hotter. Every ohm.m the lab reports is a property of the water at bench temperature, and using it directly in Archie at reservoir depth builds a factor-of-two error into every saturation you compute. The next two lessons quantify that; here the point is simply that two temperatures are in play and only one of them belongs in the saturation equation.

## Where the 180 comes from

The typewell brief hands you 180 degF as a given. In a real study you would assemble it from one or more of these sources, in rising order of quality:

* **Bottom-hole temperature from log headers.** Every logging run records a maximum thermometer reading. It is the most available number and the most biased one: the borehole has just been circulated with cooler mud, so the reading sits below true formation temperature, sometimes by 10 to 20 degC. Practice is to correct it, classically by Horner-style extrapolation using several runs at different times since circulation, and to say so in the report.
* **Regional geothermal gradients.** Sedimentary basins typically run 25 to 30 degC per km below a surface or seabed reference temperature. A gradient plus depth gives a serviceable estimate where no better data exist, and a cross-check everywhere else.
* **Production and formation test temperatures.** A flowing test measures the fluid the formation actually delivers, after the near-wellbore has re-equilibrated. Where a stabilised test temperature exists, it usually wins.

## Worked example

Check the given 180 degF against a gradient estimate. Take a surface reference of 25 degC, a gradient of 28 degC per km, and the typewell's reservoir depth of about 2020 m:

1. Gradient contribution: $28 \times 2.02 = 56.6$ degC.
2. Add the surface reference: $25 + 56.6 = 81.6$ degC.
3. Convert to degF: $81.6 \times 1.8 + 32 = 178.8$ degF.

The estimate lands within about a degree of the given 180 degF, which is the kind of agreement you want before trusting a single-source temperature. Had the gradient estimate come out at 140 degF, you would stop and find out which number is wrong before correcting anything.

## How wrong it can be

Temperature errors propagate straight into Rw. An uncorrected bottom-hole temperature that reads 15 degC low pushes the corrected Rw high, which pushes every Archie saturation high, which erodes booked pay. The error is silent: the workflow runs, the numbers look plausible, and nothing flags the bias unless you cross-check the temperature the way the worked example just did. Treat formation temperature as an interpreted quantity with a provenance line in the report, exactly like a fitted $m$ or a chosen matrix density.

## A note on units

The Arps and SP formulas in the next lessons work in degF, because that is how they were defined empirically and the engine keeps them in their native form. This is the one corner of the app that is not SI; the interface converts at the boundary and labels it. When you work the arithmetic by hand, convert your Celsius temperatures first and keep degF throughout the Rw chain.

## Exercise

A well logs a reservoir at 2.5 km. Surface reference temperature is 20 degC and the regional gradient is 30 degC per km. Estimate the formation temperature in degC and convert it to degF. As a self-check: the gradient contributes $30 \times 2.5 = 75$ degC, giving $20 + 75 = 95$ degC, and $95 \times 1.8 + 32 = 203$ degF. Then state, in one sentence each: which direction an uncorrected bottom-hole temperature would bias this number, and which of the three temperature sources you would rank highest if all three were available.
