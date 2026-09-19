# Losses out of the stack

Modules one and two built the Isiokpo heater's flue gas from its fuel analysis and its stack oxygen. This module turns that flue gas into an efficiency with stackLossEfficiency, one of the energyEfficiency functions SECTION 1 lists.

{{panel:carbon-efficiency-explorer}}

## The heater's inputs

SECTION 13 prints the Isiokpo heater's inputs, each invented for this course: a stack at 238 C, combustion air at 28 C, a radiation and convection loss of 1.8 percent read off the heater vendor's chart, and an unburned loss of 0. The heater burns the fuel gas of module one, and its excess air comes from module two.

Three more figures are the engine's typical values, printed in SECTION 1 as PROPERTY_REFERENCE, each labelled typical:

| property | typical | range | note |
| --- | --- | --- | --- |
| fluGasCpKJkgK | 1.1 | 1.05-1.20 over 150-400 C | Mean specific heat of flue gas. Varies with temperature and composition. |
| waterVapourCpKJkgK | 1.95 | 1.9-2.1 | Mean specific heat of water vapour in the stack. |
| waterLatentHeatKJkg | 2442 | at 25 C reference | Latent heat of vaporisation of water at the reference temperature. |

SECTION 13 uses a flue gas cp of 1.1, a vapour cp of 1.95 and a latent heat of 2442 kJ/kg. The range column shows that each is one choice inside a span, and the note on the flue gas cp says it varies with temperature and composition.

## Four losses and an efficiency

SECTION 13 prints the heater at its current reading of 5.5 percent oxygen on LHV:

| case | basis | excess air percent | dry flue gas loss | moisture loss | radiation | unburned | total loss percent | efficiency percent |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| current, 5.5 percent O2 | LHV | 32.1223 | 9.9883 | 1.8088 | 1.8000 | 0.0000 | 13.5971 | 86.4029 |

The row names four losses. The dry flue gas loss is 9.9883 percent, the moisture loss 1.8088 percent, the radiation loss 1.8000 percent and the unburned loss 0.0000 percent. The total loss is 13.5971 percent and the efficiency is 86.4029 percent, both on LHV. SECTION 13 prints the ledger that ties them, checked on all four rows: the four losses add to the total loss, and the efficiency is 100 less the total loss.

In practice, a stack loss method finds a heater's efficiency by naming the heat that leaves by each route and counting everything else as delivered.

## What each loss is made of

The dry flue gas loss and the moisture loss are the two SECTION 13 prints masses for. At 5.5 percent oxygen, dryFlueGasKgPerKmolFuel is 363.6388 and moistureKgPerKmolFuel is 36.6245, both per kmol of fuel. The dry flue gas is the gas module two built, now weighed, and the moisture is the water of module one, weighed the same way.

The radiation loss is different in kind. It is typed, 1.8 percent off a vendor's chart, and lesson four reads why the engine asks for it. The unburned loss is typed too, and at Isiokpo it is 0.

## The basis is part of the answer

The row above says LHV in its basis column. The same heater has a second row on HHV with a different efficiency, and lessons two, three and five read why. SECTION 13 prints a basis column beside every efficiency it reports, and the engine's comparison warning, which lesson five reads, is the reason a percent is never quoted without it. The four rows of SECTION 13 are two cases on two bases, and each row is read on its own basis.

## Exercise

Read the current LHV row of SECTION 13: the four losses, the total loss of 13.5971 percent and the efficiency of 86.4029 percent. Say what relationship the four losses bear to the total, and what the total loss and the efficiency together show about where the heat of the fuel goes.
