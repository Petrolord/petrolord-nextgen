# The Egbema flare end to end

This lesson reads it in one table, from the laboratory sheet to the flare's CO2e, and reads each line back to the rule behind it.

{{panel:gasvalue-flare-explorer}}

## The whole reading

| step | figure |
| --- | --- |
| sheet sum | 1.0000 |
| heating value, Btu/scf | 1248.4110 |
| inerts, mole fraction | 0.0460 |
| hydrocarbon carbon per mole | 1.3320 |
| mass, kg/Mscf | 26.7066 |
| propane and heavier, kg/Mscf | 6.6647 |
| liquids, gal/Mscf C3+ | 3.2205 |
| richness | rich |
| flare CO2, t/yr | 182079.024 |
| flare methane, t/yr | 1136.490 |
| flare CO2e, t/yr | 215946.438 |

## The gas, lines one to eight

The sheet sum is 1.0000. EGBEMA's sheet was typed in full, so the engine used it as typed and attached no normalisation note.

The heating value is 1248.4110 Btu/scf, blended on moles over the normalised analysis.

The inerts are 0.0460 of the moles: N2 and CO2, the two codes the reference table marks inert. The CO2 alone is 0.0280.

The hydrocarbon carbon per mole is 1.3320. It counts only the carbon that can burn. The carbon per mole, 1.3600, counts every carbon atom, and carbonPerMol minus hydrocarbonCarbonPerMol is the CO2 mole fraction.

The mass of one Mscf is 26.7066 kg, the moles in a thousand standard cubic feet times the molar mass of 22.3436 lb/lbmol. Of that, 6.6647 kg is propane and heavier. Those two figures are the most any route can take out of a thousand standard cubic feet, by mass.

The liquids are 3.2205 gallons of propane and heavier per Mscf, derived from the composition and the component liquid densities. The richness word is read off that figure, and at or above the upper edge of 2.5000 it reads rich.

## The flare, lines nine to eleven

EGBEMA flares 7.5 MMscfd on 355 days a year, scfPerYear 2662500000, at a destruction efficiency of 0.97 and a combustion efficiency of 0.955.

The flare's CO2 is 182079.024 tonnes a year. It is the CO2 in the gas plus the combustion efficiency times the hydrocarbon carbon: the 1.3320 per mole from line four, at 0.955, and the CO2 in the gas passing through at every efficiency.

The flare's methane is 1136.490 tonnes a year. It is the methane in the gas times one less the destruction efficiency: EGBEMA's methane, 0.7420 of the moles, at one less 0.97. Unburned ethane and heavier are not methane and carry no GWP here.

The flare's CO2e is 215946.438 tonnes a year, the CO2 plus the methane times the study's GWP of 29.8. The methane share of it is 0.1568.

## Every line has an input behind it

Each line above is the engine's answer to inputs that were typed. The sheet, the two efficiencies and the GWP are the case's, and every one of them is invented and illustrative. The heating values and liquid densities behind lines two and seven are the engine's typical figures. Leave a required one blank and the engine refuses or reports the line missing, as modules three and five read.

## Reading it in the explorer

Load EGBEMA in the flare explorer, type the flare's volume, days, efficiencies and GWP, and read every line of the table from the panel.

## Exercise

Read three lines of the table: hydrocarbon carbon per mole 1.3320, flare CO2 182079.024 t/yr and flare methane 1136.490 t/yr. Say which efficiency multiplies the hydrocarbon carbon, which efficiency sets the methane, and which figure from the gas the methane starts from.

Self check: the combustion efficiency, 0.955, multiplies the hydrocarbon carbon, and the CO2 in the gas is added beside it. The destruction efficiency, 0.97, sets the methane through one less the destruction efficiency. The methane starts from the methane in the gas, 0.7420 of EGBEMA's moles.
