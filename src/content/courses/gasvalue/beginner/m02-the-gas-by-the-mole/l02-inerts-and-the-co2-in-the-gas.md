# Inerts and the CO2 in the gas

The reference table marks two codes inert, and characteriseGas reports an inert fraction for every gas it is given, with the CO2 and the methane beside it.

{{panel:gasvalue-flare-explorer}}

## Two inert codes

In GAS_COMPONENT_REFERENCE, the inert column reads true on two rows: N2, nitrogen, and CO2, carbon dioxide. Both carry a typical heating value of 0 Btu/scf. They part company on carbon. Nitrogen carries 0 carbon per molecule. Carbon dioxide carries 1.

The engine's sentence on that row: the CO2 row carries one carbon per molecule and is marked inert: its carbon is counted when the carbon per mole is counted, and it is not a fuel.

## Three fractions the engine reports

characteriseGas reports three mole fractions for every gas. Each is a mole-weighted figure over the normalised analysis:

| gas | inertMoleFraction | co2MoleFraction | methaneMoleFraction |
| --- | --- | --- | --- |
| EGBEMA | 0.0460 | 0.0280 | 0.7420 |
| OGUTA | 0.0270 | 0.0150 | 0.9250 |
| studio opening gas | 0.0400 | 0.0200 | 0.7800 |

Read EGBEMA's row against its sheet. The sheet carries N2 0.018 and CO2 0.028. The engine reports inertMoleFraction 0.0460 and co2MoleFraction 0.0280. The methane on the sheet is C1 0.742, and the engine reports methaneMoleFraction 0.7420.

inertMoleFraction is the sum of the normalised fractions of the components the reference marks inert, nitrogen and CO2. The course prints that sum beside the engine's figure:

| gas | N2 (normalised) | CO2 (normalised) | N2 plus CO2 | inertMoleFraction (engine) |
| --- | --- | --- | --- | --- |
| EGBEMA | 0.0180 | 0.0280 | 0.0460 | 0.0460 |
| OGUTA | 0.0120 | 0.0150 | 0.0270 | 0.0270 |
| studio opening gas | 0.0200 | 0.0200 | 0.0400 | 0.0400 |

Module four reads the CO2 fraction and the methane fraction again at the flare, each in its own term of the flare rule.

## The inerts stay in the heating value

The mole-weighted heating value is formed over the whole normalised analysis, so the inerts' moles are in it.

The previous lesson showed the shortcut the engine does not take. Asked about the hydrocarbons alone, with the inerts left out and the rest scaled to one, the engine gives 1308.6069 Btu/scf for EGBEMA. On EGBEMA as analysed it gives 1248.4110. The difference column prints 60.1959.

## The CO2 in the gas and the flare

The CO2 row's carbon is counted in the carbon per mole, and CO2 is not a fuel. The engine's flare rule is 40 CFR 98.233(n), and its first half reads: CO2 = the CO2 in the gas plus the combustion efficiency times the hydrocarbon carbon. The CO2 in the gas is its own term in that sum. The engine's own probe shows it: the CO2 already in the gas leaves the flare as CO2 at every efficiency, and none of it is methane.

The methane fraction has its own term too. The second half of the rule reads: CH4 = the methane in the gas times one less the destruction efficiency. Its first factor, the methane in the gas, is the methane the analysis carries: methaneMoleFraction 0.7420 on EGBEMA.

## Reading the fractions in the explorer

Load each of the three gases in the flare explorer and read its inert, CO2 and methane fractions against the table above.

## Exercise

Read EGBEMA's row: inertMoleFraction 0.0460, co2MoleFraction 0.0280 and methaneMoleFraction 0.7420, from a sheet carrying N2 0.018, CO2 0.028 and C1 0.742. Say which two codes the reference table marks inert, what the engine says about the CO2 row's carbon and its use as a fuel, and which term of the flare rule each of the CO2 and methane fractions feeds.

Self check: N2 and CO2 are the inert codes, each with a heating value of 0. The CO2 row's carbon is counted when the carbon per mole is counted, and it is not a fuel. The CO2 fraction feeds the CO2 in the gas, the first term of the CO2 rule. The methane fraction feeds the methane in the gas, which the rule multiplies by one less the destruction efficiency.
