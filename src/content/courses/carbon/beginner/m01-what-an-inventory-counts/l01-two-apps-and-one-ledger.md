# Two apps and one ledger

## Two modules behind two studios

This course is built on two engine modules, and each one sits behind one app. The Carbon Footprint & Abatement Studio calls carbonAbatement. The Energy & Utilities Efficiency Studio calls energyEfficiency. Every figure the course prints is an answer one of those two modules returned, and neither module reads a date or a random number, so no figure depends on when or where it was produced. Every year in the course is an input.

Each module exports its rules as functions and its fixed data as constants. The counts are measured from the modules themselves:

| module | exported functions | exported constants |
| --- | --- | --- |
| carbonAbatement | 10 | 4 |
| energyEfficiency | 10 | 11 |

The carbonAbatement functions are abatementCost, abatementCurve, atomBalanceLines, buildInventory, carbonIntensity, combustionCo2FromCarbon, decarbonisationPath, emissionLine, makeFactor and makeGwpSet. Its four constants are MW_C, MW_CH4, MW_CO2 and SCOPE. The Associate tier works with the inventory side of that list: combustionCo2FromCarbon for burned carbon, atomBalanceLines to hand a combustion to the inventory as lines, makeGwpSet for the global warming potentials, makeFactor and emissionLine for each line, buildInventory for the totals and carbonIntensity for a figure per unit of output.

## Where the two apps meet

The two apps are separate pages. The Energy & Utilities Efficiency Studio prices a saving in carbon as well as in money, and the digest prints where its cost per tonne comes from: it "is carbonAbatement.abatementCost called from inside energyEfficiency.priceSaving." The function that costs a tonne saved by an efficiency measure is carbonAbatement's own abatementCost, a function of the module the Carbon Footprint & Abatement Studio calls.

## Three invented records

The course reads three records, and all three are invented:

| record | what it is |
| --- | --- |
| IGBOGENE | a Niger Delta flow station and gas plant: its fired heaters, its flare, its vented methane and its purchased power, rolled into one inventory |
| ISIOKPO | a gas plant: one fired heater, a failed steam trap, its condensate system and four process streams |
| AGBOR | a gas processing and distribution complex: six abatement measures, a curve, a target, a path, one priced saving and the plant energy intensity |

This tier reads Igbogene. Its four sources become five lines of one inventory, each line carrying a scope, a gas, a factor and a record of where that factor came from.

## What is invented and what is not

Every cost, saving, price, emission factor, flow, temperature and destruction efficiency in the course is invented for it and is not a published figure. The electricity factor and the fuel emission factor are synthetic. When a lesson quotes Igbogene's electricity factor, it is quoting Igbogene's invented factor, and it says so.

The global warming potentials are the exception, and they are inputs too. The engine ships none. The course types four sets in, each an IPCC 100-year value as tabulated in GHG Protocol, "IPCC Global Warming Potential Values", version 2.0, 7 August 2024, and it computes every inventory on the set "IPCC AR6 GWP100, fossil methane". Module four reads all four sets.

In practice, a real inventory replaces every invented input with a measured or documented one, and the engine is built so that each replacement carries its source with it.

## Exercise

Read the module table and the sentence about priceSaving. Say what the relationship between the two apps shows about where a tonne of CO2e is counted and priced.

Self check: carbonAbatement exports 10 functions and 4 constants and energyEfficiency exports 10 functions and 11 constants. The Carbon Footprint & Abatement Studio calls carbonAbatement and the Energy & Utilities Efficiency Studio calls energyEfficiency, and the efficiency app's cost per tonne is carbonAbatement.abatementCost called from inside energyEfficiency.priceSaving: the cost of a tonne saved by an efficiency measure comes from the carbonAbatement function.
