# The studio's opening gas

The Flare Gas to Value Studio opens on a gas of its own. This lesson reads that gas the way the last lesson read EGBEMA's, and stops where the engine stops: at the flare.

{{panel:gasvalue-flare-explorer}}

## The gas

The studio's opening gas is C1 0.78, C2 0.09, C3 0.05, IC4 0.01, NC4 0.02, C5 0.01, N2 0.02, CO2 0.02.

Read the same way as EGBEMA, the studio's opening gas gives:

| step | figure |
| --- | --- |
| heating value, Btu/scf | 1210.7800 |
| hydrocarbon carbon per mole | 1.2800 |
| mass, kg/Mscf | 25.4954 |
| propane and heavier, kg/Mscf | 5.5819 |
| liquids, gal/Mscf C3+ | 2.6894 |
| richness | rich |

The table stops at the richness word. There is no flare CO2, no flare methane and no CO2e in it.

## The figures behind each line

The studio's opening gas has a heating value of 1210.7800 Btu/scf, the mole-weighted heating value over the normalised analysis. Its inert mole fraction is 0.0400, its CO2 mole fraction 0.0200 and its methane mole fraction 0.7800.

Its carbon per mole is 1.3000 and its hydrocarbon carbon per mole 1.2800. carbonPerMol minus hydrocarbonCarbonPerMol is the CO2 mole fraction, 0.0200, the carbon already in CO2.

Its molar mass is 21.3303 lb/lbmol, and one Mscf of it carries 25.4954 kg.

It carries 5.0897 gallons of ethane and heavier and 2.6894 gallons of propane and heavier in each Mscf, and the ethane gap between them is 2.4003. Its richness word is read off gpmC3Plus: at 2.6894 it is at or above the upper edge of 2.5000, and it reads rich.

## The flare is refused

The studio opens with both efficiencies and the GWP blank. On the studio's opening gas with its opening parcel, 10 MMscfd on 350 days, with the efficiencies blank, abatement answers:

REFUSED: A flare destruction efficiency in (0, 1] is required. For a flare it is most of the answer and it is contested, so it is not assumed.

The flare is refused until the efficiencies are typed. The efficiencies have no default.

The GWP is blank too. Module five read what a blank GWP does on EGBEMA's flare: the CO2e and the methane share read null, and the engine names the missing input: no methane global warming potential supplied.

## What the opening state teaches

The studio's opening gas is a complete answer to the first of characteriseGas's questions: what is in this gas, and how much liquid could it give. It is not yet an answer to abatement's: what the flare emits. That answer needs a destruction efficiency from the case, and its CO2e needs a GWP, and the studio opens with both blank.

## Reading it in the explorer

Load the studio's opening gas in the flare explorer and read each line of the table above. Then set the flare to 10 MMscfd on 350 days, leave the efficiencies blank and read the refusal.

## Exercise

Read the studio's opening gas table, heating value 1210.7800 Btu/scf through the richness word rich, and the refusal abatement returns on its opening parcel. Say where the table stops, why the flare lines are missing from it, which input the refusal names, and what the CO2e needs beside it.

Self check: the table stops at the richness word, rich at gpmC3Plus 2.6894. The flare lines are missing because the studio opens with both efficiencies blank, and abatement refuses a blank destruction efficiency: for a flare it is most of the answer and it is contested, so it is not assumed. The refusal names the destruction efficiency, and the CO2e needs a GWP as well.
