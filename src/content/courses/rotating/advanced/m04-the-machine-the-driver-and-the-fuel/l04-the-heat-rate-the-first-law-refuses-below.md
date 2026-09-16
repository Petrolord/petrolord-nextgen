# The heat rate the first law refuses below

There is a heat rate below which a driver would be more than 100 percent thermally efficient. The engine refuses there, and the boundary it refuses at is not a policy. It is a unit conversion.

{{panel:fc-compressor-explorer}}

## Where the refusal sits

Hand the driver calculation a heat rate of 2000 Btu per hp hr and it returns an object carrying an error: "a heat rate of 2000 Btu per hp hr is below the 2544.4336 Btu that one horsepower-hour is: that driver would be more than 100 percent thermally efficient". Hand it 1 Btu per hp hr and the same guard fires with the typed value in it.

A horsepower-hour expressed in Btu is 2544.433577644024. A driver delivering one horsepower-hour of shaft work on less fuel heat than that would be creating energy.

## The boundary is the constant

That number is derived inside the units module from the foot, the pound, standard gravity and the definition of a mechanical horsepower, and it can also be measured out of the engine from the outside in two ways. Take the thermal efficiency the engine reports at a stated heat rate and it gives 2544.433577644024. Halve the heat rate until the refusal turns on and the bracket gives 2544.433577644024 again. The two routes differ by 0.

A refusal boundary that IS the constant is worth noticing. The guard is not a threshold somebody picked with a safety factor on it. It is the point where the arithmetic stops meaning anything.

## The other constants, measured the same way

The module's other constants come out of returns the same way. Standard cubic feet per lbmol reads as 379.483572 from the mass flow of one MMscfd of a gravity-one gas, and the molecular weight of air as 28.962500 from the same return. The universal gas constant in ft lbf per lbmol degR reads as 1545.350400 out of the polytropic head, the Rankine offset is exported as 459.670000, and ft lbf per minute per horsepower reads as 33000.000000.

The gas constant is the one to dwell on. The figure measured out of the head and the figure the gas properties module exports, times 144 square inches per square foot, give a quotient of 1.000000000000000 and a difference of 2.2737367544323206e-13 ft lbf per lbmol degR.

## Why two opinions would be intolerable

One value of one constant, in two modules where one imports it from the other. A package holding two values could not say which of them any given answer carries, however small the gap. The size of the error is not the problem. The problem is that the provenance of every downstream number becomes unknowable.

## The mistake

The mistake is treating the refusal as a validation limit to be widened when a datasheet looks unusual. A heat rate under the boundary is a typo, a unit error or a figure that was never a heat rate, and the message names the constant so a reader can work out which.

## Exercise

Quote the refusal the driver calculation returns below the first-law boundary and say what that boundary is in Btu. Describe the two ways it can be measured out of the engine, and explain why one value of the gas constant across two modules matters even at the gap seen here.
