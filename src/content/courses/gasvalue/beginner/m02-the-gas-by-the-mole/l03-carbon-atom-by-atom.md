# Carbon atom by atom

characteriseGas counts the carbon in the gas. It reports two counts per mole, and this lesson reads what the gap between them is.

{{panel:gasvalue-flare-explorer}}

## Two carbon counts

The engine states both in one sentence. The carbon per mole counts every carbon atom, the CO2's included. The hydrocarbon carbon per mole counts only the carbon that can burn.

Each is a mole-weighted sum over the normalised analysis, and the figure summed for each component is its carbon per molecule from the reference table: methane 1, ethane 2, propane 3, iso-butane and n-butane 4, pentanes plus 5, nitrogen 0 and carbon dioxide 1.

| gas | carbonPerMol | hydrocarbonCarbonPerMol | co2MoleFraction |
| --- | --- | --- | --- |
| EGBEMA | 1.3600 | 1.3320 | 0.0280 |
| OGUTA | 1.0580 | 1.0430 | 0.0150 |
| studio opening gas | 1.3000 | 1.2800 | 0.0200 |

## The gap is the CO2

The relationship between the two counts, read across every row: in every row, carbonPerMol minus hydrocarbonCarbonPerMol is the CO2 mole fraction: the only carbon that cannot burn is the carbon already in CO2.

EGBEMA's counts are 1.3600 and 1.3320, and its CO2 mole fraction is 0.0280. OGUTA's are 1.0580 and 1.0430, with CO2 0.0150. The studio's opening gas reads 1.3000 and 1.2800, with CO2 0.0200.

Nitrogen carries no carbon, so it is in neither count. Carbon dioxide carries one carbon per molecule, and that carbon is in the first count and outside the second.

## Why the engine counts atom by atom

The engine gives its own reason for counting carbon this way, and it gives it in a refusal. Asked about a component it cannot find a carbon number for, characteriseGas answers:

REFUSED: No carbon number for XX. The flare's CO2 is counted atom by atom, so it is not assumed.

The flare's CO2 is counted from these carbon figures, atom by atom, and a carbon number the engine does not have is refused. The last lesson of this module reads that refusal in full.

## Where the two counts go

The flare rule the engine follows is 40 CFR 98.233(n), and its basis sentence reads: CO2 = the CO2 in the gas plus the combustion efficiency times the hydrocarbon carbon.

The two counts split across the two terms of that sum. The hydrocarbon carbon, 1.3320 per mole on EGBEMA, is the carbon the combustion efficiency multiplies. The CO2 in the gas, 0.0280 on EGBEMA and the gap between the two counts, is added as it stands.

Module four prints a shortcut built from the other count. It computes the methane a flare gives if every unburned carbon atom is counted as methane, from carbonPerMol (every carbon atom, the CO2's included) times one less the destruction efficiency. The engine does not take that shortcut: its methane is the methane in the gas.

## Reading the carbon in the explorer

Load each gas in the flare explorer and read its two carbon counts against its CO2 fraction.

## Exercise

Read EGBEMA's row: carbonPerMol 1.3600, hydrocarbonCarbonPerMol 1.3320 and co2MoleFraction 0.0280. Say what each carbon count counts, what carbonPerMol minus hydrocarbonCarbonPerMol is in every row, and which of the two counts the flare's combustion efficiency multiplies.

Self check: the carbon per mole counts every carbon atom, the CO2's included, and the hydrocarbon carbon per mole counts only the carbon that can burn. In every row, carbonPerMol minus hydrocarbonCarbonPerMol is the CO2 mole fraction, because the only carbon that cannot burn is the carbon already in CO2. The combustion efficiency multiplies the hydrocarbon carbon, 1.3320 per mole on EGBEMA, and the CO2 in the gas is added beside it.
