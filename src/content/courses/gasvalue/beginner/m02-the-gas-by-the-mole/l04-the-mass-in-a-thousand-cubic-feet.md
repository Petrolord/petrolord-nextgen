# The mass in a thousand cubic feet

A thousand standard cubic feet is a fixed count of moles. characteriseGas turns that count into a mass, and module three reads the liquids' mass against it.

{{panel:gasvalue-flare-explorer}}

## The engine's sentence

The engine states the rule: the mass in one Mscf is the moles in a thousand standard cubic feet times the molar mass. The molar mass of a mixture is itself a mole-weighted sum over the normalised analysis, built from the molar masses in the reference table: methane 16.043 lb/lbmol, ethane 30.07, propane 44.096, iso-butane and n-butane 58.122, pentanes plus 72.15, nitrogen 28.014 and carbon dioxide 44.01.

The molar mass is in lb/lbmol and the answer is in kilograms. flareToValue exports the constants for those units: SCF_PER_LBMOL, 379.49 standard cubic feet in one lb-mol, and LB_PER_KG, 2.20462262 pounds in one kilogram.

## The three gases

| gas | molarMassLbLbmol | kgPerMscf |
| --- | --- | --- |
| EGBEMA | 22.3436 | 26.7066 |
| OGUTA | 17.5880 | 21.0224 |
| studio opening gas | 21.3303 | 25.4954 |

EGBEMA's molar mass is 22.3436 lb/lbmol and one Mscf of it carries 26.7066 kg. OGUTA's molar mass is 17.5880 and one Mscf carries 21.0224 kg. The studio's opening gas reads 21.3303 and 25.4954.

## The pure rows beside them

Module one asked the engine about one Mscf of each pure component:

| pure component | molar mass lb/lbmol (reference) | kgPerMscf |
| --- | --- | --- |
| Methane | 16.043 | 19.1757 |
| Ethane | 30.07 | 35.9417 |
| Propane | 44.096 | 52.7066 |
| Nitrogen | 28.014 | 33.4842 |
| Carbon dioxide | 44.01 | 52.6038 |

Every row there is the same count of moles, so the mass follows the molar mass. The three gases above follow the same rule. Each is one Mscf, the same count of moles as every pure row, and each mass follows its own mole-weighted molar mass.

## A volume that carries different masses

Read the two tables together. One Mscf of methane carries 19.1757 kg. One Mscf of OGUTA carries 21.0224 kg, and one Mscf of EGBEMA carries 26.7066 kg. The volume is the same in all three. The mass is not, and the engine's sentence says what sets it: the molar mass.

A flare given in standard cubic feet is a count of moles first. Its mass in kilograms is read from the analysis, through the molar mass.

## Where the mass is used

kgPerMscf returns twice in this tier.

In module three, the engine reports c3PlusKgPerMscf, the part of kgPerMscf that is propane and heavier. The two figures are the most any route can take out of a thousand standard cubic feet, by mass. On EGBEMA, c3PlusKgPerMscf is 6.6647 against a kgPerMscf of 26.7066.

In module six, the Egbema flare is read end to end, from the sheet sum to the CO2e, and mass, kg/Mscf is one line of that table at 26.7066.

## Reading the mass in the explorer

Load each gas in the flare explorer and read its molar mass and its kgPerMscf against the table above. Then set the analysis to pure methane and confirm the mass reads the pure row, 19.1757.

## Exercise

Read three figures for one Mscf: pure methane, 19.1757 kg; OGUTA, 21.0224 kg with a molar mass of 17.5880 lb/lbmol; and EGBEMA, 26.7066 kg with a molar mass of 22.3436 lb/lbmol. Say what the three have in common, what the engine's sentence says the mass in one Mscf is, and which figure sets the mass for each.

Self check: all three are one Mscf, the same count of moles, because a standard cubic foot counts gas at 60 F and 14.696 psia. The engine's sentence: the mass in one Mscf is the moles in a thousand standard cubic feet times the molar mass. The molar mass sets the mass: 16.043 for methane, 17.5880 for OGUTA and 22.3436 for EGBEMA.
