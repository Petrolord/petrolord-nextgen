# A standard cubic foot is a count of moles

EGBEMA's flare is given as a volume of gas a day. The engine reads a volume of gas as a count of moles, and this lesson reads the sentence and the constants that say so.

{{panel:gasvalue-flare-explorer}}

## A volume at a stated condition

A standard cubic foot counts gas at 60 F and 14.696 psia, so a volume of gas is a number of moles. A thousand standard cubic feet is written Mscf, and the table at the end of this lesson reads one Mscf of five different gases as the same count of moles.

## The engine's unit constants

flareToValue and lpgCng carry their conversions as named constants. These are printed from the modules:

| constant | value | what it is |
| --- | --- | --- |
| SCF_PER_LBMOL | 379.49 | standard cubic feet in one lb-mol |
| LB_PER_KG | 2.20462262 | pounds in one kilogram |
| GAL_PER_FT3 | 7.480519 | US gallons in one cubic foot |
| BTU_PER_MWH | 3412141.6331 | International Table Btu in one megawatt hour |
| M3_PER_SCF (lpgCng) | 0.02831684659 | cubic metres in one standard cubic foot |
| KJ_PER_KWH (lpgCng) | 3600 | kilojoules in one kilowatt hour |
| PSI_PER_BAR (lpgCng) | 14.503773773 | psi in one bar |

SCF_PER_LBMOL is the one this lesson is about. It is 379.49 standard cubic feet in one lb-mol: the constant that names how many standard cubic feet make one lb-mol. LB_PER_KG is the pounds in one kilogram, 2.20462262. GAL_PER_FT3 is the US gallons in one cubic foot, and module three counts the liquids in the gas in gallons. The last three are lpgCng's and return in the Expert tier.

## One Mscf of each pure gas

Asked about one Mscf of each pure component, characteriseGas gives the mass a thousand standard cubic feet carry:

| pure component | molar mass lb/lbmol (reference) | kgPerMscf |
| --- | --- | --- |
| Methane | 16.043 | 19.1757 |
| Ethane | 30.07 | 35.9417 |
| Propane | 44.096 | 52.7066 |
| Nitrogen | 28.014 | 33.4842 |
| Carbon dioxide | 44.01 | 52.6038 |

Every row is the same count of moles, so the mass follows the molar mass. Methane at 16.043 lb/lbmol gives 19.1757 kg in one Mscf. Carbon dioxide at 44.01 lb/lbmol gives 52.6038. Propane at 44.096 lb/lbmol gives 52.7066.

Read the table as five answers to one question. The volume is held at one Mscf in every row, so the count of moles is held too. The only column that changes from row to row, other than the name, is the molar mass, and kgPerMscf changes with it.

The engine states the same rule for a mixture in module two: the mass in one Mscf is the moles in a thousand standard cubic feet times the molar mass. A mixed gas is read the same way as the pure rows above, with a mole-weighted molar mass for the mixture.

## Where the flare meets the mole

In module four, EGBEMA's flare is given as 7.5 MMscfd on 355 days a year, and the engine reports its CO2 and its methane in tonnes a year. The molar masses the flare is weighed at are printed in that module: 44.009 kg/kmol for CO2 and 16.043 kg/kmol for methane.

Put the flare explorer on a single pure component and read the mass it returns for one Mscf. Then change to another pure component and read the mass again against the molar mass in the reference.

## Exercise

Read two rows of the pure component table: methane, 16.043 lb/lbmol and 19.1757 kg/Mscf, and carbon dioxide, 44.01 lb/lbmol and 52.6038 kg/Mscf. Say what the two rows hold the same, and which column the engine says the mass follows.

Self check: both rows are one Mscf, so both are the same count of moles, because a standard cubic foot counts gas at 60 F and 14.696 psia. With the count of moles held, the engine says the mass follows the molar mass, and the two masses are 19.1757 and 52.6038 kg for the two molar masses 16.043 and 44.01.
