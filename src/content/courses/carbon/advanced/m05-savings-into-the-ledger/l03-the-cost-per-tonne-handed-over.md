# The cost per tonne handed over

The Energy & Utilities Efficiency Studio prices a saving, and its cost per tonne comes from the carbon engine. SECTION 1 states the hand-over: the Energy Studio's cost per tonne is `carbonAbatement.abatementCost` called from inside `energyEfficiency.priceSaving`. So a saving's cost per tonne is built exactly as the curve's measures are costed. SECTION 23 prints it on the invented AGBOR saving.

{{panel:carbon-abatement-explorer}}

## How the call is made

SECTION 23 names the three arguments: abatementCost is called with the implementation cost as capital, the annual value as the saving and the annual tonnes as the abatement. On the Agbor saving, every figure invented for this course, that is:

| abatementCost argument | taken from | value |
| --- | --- | --- |
| capital | the implementation cost | 210000 USD |
| annual savings | annualValue | 88500.00 USD |
| tonnes abated a year | annualTonnesCo2e | 661.980 |
| life | the life of the implementation cost | 8 years |
| discount rate | the rate | 0.1 |

The answer is costPerTonneCo2e -74.2270 USD a tonne. It is negative: in the words of SECTION 18, a negative cost per tonne means the measure pays for itself and abates carbon as a side effect.

## The same rules, the same refusals

Because it is the same function, the cost per tonne of a saving follows the rules of module one. A capital cost is annualised by a capital recovery factor, which needs a life and a rate. SECTION 25 lists the rule in force: the cost per tonne of a saving is the levelised abatementCost, and needs a life and a rate. SECTION 23 prints the hand-over: priceSaving passes its life (8 years) and rate (0.1) to abatementCost. The same call made directly:

| output | value |
| --- | --- |
| capitalRecoveryFactor | 0.18744402 |
| annualisedCapital USD | 39363.24 |
| netAnnualCost USD | -49136.76 |
| costPerTonne USD | -74.2270 |
| paysForItself | true |

With no life and no rate, the call does not refuse. It returns costPerTonneCo2e none with this costPerTonneNote: "A cost per tonne needs the measure life and a discount rate, to annualise the implementation cost against a yearly saving."

## A figure marked computed here

SECTION 23 also sets the whole implementation cost against one year's value and one year's tonnes, computed here by the lab: 183.5403 USD a tonne. It is marked computed here, as SECTION 18 marks its one-year column. Levelised over 8 years at 0.1, the same saving prints -74.2270 USD a tonne.

## What SECTION 26 says of it

SECTION 26 says the energyEfficiency oracle computes "a levelised cost per tonne", and the carbonAbatement oracle levels the cost per tonne from a year-by-year present value ledger where the engine uses a capital recovery factor. The cost per tonne is not on SECTION 26's list of outputs neither oracle recomputes.

## Reading the sign

The saving pays for itself at -74.2270 USD a tonne. Of the six Agbor measures on the curve, three print negative costs: -167.4364, -156.4390 and -14.2492 USD a tonne. The saving is costed by the same function and at the same rate, 0.1, so its figure is read on the same scale as theirs.

## Why the hand-over matters

A saving priced in the Energy Studio and a measure costed in the Carbon Studio carry costs per tonne built by one function, with one set of rules. In practice that lets a saving be carried as a measure: its implementation cost is the capital, its annual value the saving and its annual tonnes the abatement, and it takes its place on the curve by its cost per tonne.

## Exercise

Read the implementation cost, the annual value, the annual tonnes, the life and the rate, and the costPerTonneCo2e the engine returns, with the one-year figure the lab computes. Say what the two costs per tonne, read with the life, show about why a saving's cost per tonne is handed to abatementCost.
