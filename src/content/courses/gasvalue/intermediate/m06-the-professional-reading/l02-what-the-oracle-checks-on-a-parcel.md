# What the oracle checks on a parcel

Every figure in this tier is computed by flareToValue. A validation oracle checks those figures independently of the engine. This lesson reads what that oracle checks on a parcel, and what it does not.

## Where the oracle lives

The oracle is oracle_flaretovalue.py, in packages/engines/tools/validation/downstream. It checks flareToValue independently of the engine.

## What it checks

The oracle's checks, as they are stated:

| what the oracle checks | how |
| --- | --- |
| the gas | in exact rationals, carried in kilograms and cubic metres |
| molar masses | rebuilt from atomic weights |
| the standard molar volume | derived from the gas constant |
| the flare by the rule | by moles, cross-checked by the rule's own volumetric route |
| the route, credit and comparison ledgers | as ledgers |

Read each row against the figures this course has quoted.

**The gas.** The Associate tier's characterisation of EGBEMA is the gas every route of this tier starts from: a heating value of 1248.4110 Btu/scf, a mass of 26.7066 kg/Mscf, a propane and heavier mass of 6.6647 kg/Mscf. The oracle carries the gas in exact rationals, in kilograms and cubic metres.

**The molar masses and the molar volume.** The oracle rebuilds the molar masses from atomic weights, and it derives the standard molar volume from the gas constant. On the engine's side, the reference table carries the molar masses in lb/lbmol, and the unit constants include SCF_PER_LBMOL, 379.49 standard cubic feet in one lb-mol.

**The flare.** The flare by 40 CFR 98.233(n) gave EGBEMA's 215946.438 t/yr of CO2e. The oracle checks the flare by moles and cross-checks it by the rule's own volumetric route.

**The ledgers.** The oracle checks the route, credit and comparison ledgers. Those are the oracle's words. This tier read the route in routeEconomics, the credit in creditSensitivity and the comparison in compareRoutes.

## What it does not check

The oracle does not validate the typical heating values and liquid densities: those are pinned, and the engine labels them typical. The engine's note on the component reference table reads: "Molar masses and carbon numbers are definitional. Heating values and liquid densities are typical: the gas analysis and the certificate govern, and a measured value should replace these."

EGBEMA's heating value of 1248.4110 is the mole-weighted heating value over those typical heating values, and the gas to power ceiling of 0.3659 MWh is built on it. EGBEMA's liquids content of 3.2205 gal/Mscf is derived from the composition and the component liquid densities.

## The inputs on this parcel

The oracle's list names checks on the gas, the flare and the ledgers. It names no input the study typed. On this tier's parcel those inputs include:

- every requirement limit, which ships null and is the study's to set;
- every yield, recovery, price and cost the study typed;
- the reference plant cost and capacity;
- the product combustion and the displaced fuel of each counterfactual;
- the methane GWP and the credit prices, which are case inputs, and the engine ships neither;
- the hurdle margin.

Each of those is invented and illustrative here. The flare efficiencies have no default either: the Associate tier stated that as a limit of the flare model.

## Exercise

Read the oracle's checks. Name what it rebuilds from atomic weights and what it derives from the gas constant, and say what the flare check is cross-checked by. Then quote what the oracle does not validate, and name two inputs the study typed on EGBEMA's CNG route.
