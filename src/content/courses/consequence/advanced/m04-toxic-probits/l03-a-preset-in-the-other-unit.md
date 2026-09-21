# A preset in the other unit

{{panel:cq-harm}}

{{panel:cq-release}}

A concentration arrives in one unit and a preset expects another more often than not. The Gaussian plume returns mg/m3; the Lees presets expect ppm; a gas detector reads ppm; the Purple Book presets expect mg/m3. The conversion between the two runs through a molar volume, and the molar volume depends on the temperature.

## The conversion

The engine's model string for the conversion, verbatim: "mg/m3 = ppm x M / Vm, Vm = R T / P (ideal gas)". M is the molar mass in g/mol and Vm the molar volume at the STATED temperature and pressure. At 101325 Pa the molar volume is 24.055117 L/mol at 293.15 K and 24.465404 L/mol at 298.15 K. A colder gas is denser, so the same ppm is more mg/m3.

The functions `ppmToMgM3` and `mgM3ToPpm` are exact inverses at the same temperature and pressure. The release panel's plume view returns mg/m3, and ppm beside it once you give a molar mass. The harm panel's toxic view accepts a concentration typed in either unit, with a molar mass and a temperature to convert it, and shows the concentration in the preset's own unit before it computes the toxic load.

## Hydrogen sulphide at two temperatures

Hydrogen sulphide at 800 ppm for 15 minutes on the pb-hydrogen-sulfide preset, which is in mg/m3, with a molar mass of 34.08 g/mol (stated). The engine converts at the temperature it is given:

| temperature K | concentration mg/m3 | probit | probability |
| --- | --- | --- | --- |
| 293.15 | 1133.397113 | 4.570702 | 0.333853 |
| 298.15, the default | 1114.389950 | 4.538569 | 0.322245 |

The warmer temperature moves the concentration from 1133.397113 to 1114.389950 mg/m3, and the probability from 0.333853 to 0.322245. The shift is small, but it is larger than the precision this course grades at. A temperature left to its default is an input the analyst did not state, and a note should state it.

## When the conversion cannot be made

Without a molar mass there is no conversion, and the engine refuses rather than guess:

> molarMassGMol: must be a molar mass above 0 g/mol

The refusal names the field. The molar mass is a physical fact the analyst supplies, and the preset's name does not stand in for it.

## The same care in the graded direction

The graded toxic probits use Lees presets, which are in ppm. A concentration in mg/m3 at a stated temperature, such as a plume result, must therefore be turned into ppm at that temperature before a Lees preset reads it. The steps are the same in reverse: the molar mass, the stated temperature, the molar volume and then the ppm. Use the temperature the problem states; the default of 298.15 K is right only when that is the temperature stated.

The pb-hydrogen-sulfide preset in this lesson is a Purple Book preset and so a teaching comparison. The unit handling it shows applies to every preset.

## Exercise

On the harm panel's toxic view, enter 800 ppm of hydrogen sulphide for 15 minutes on pb-hydrogen-sulfide with 34.08 g/mol, first at 293.15 K and then with the temperature left blank. Confirm both rows above. Then switch the concentration unit to mg/m3, type 1133.397113 at 293.15 K, and confirm the probit is unchanged. Remove the molar mass and record the field the refusal names. Finally, on the release panel's plume view, give a molar mass and read a ppm figure beside its mg/m3.
