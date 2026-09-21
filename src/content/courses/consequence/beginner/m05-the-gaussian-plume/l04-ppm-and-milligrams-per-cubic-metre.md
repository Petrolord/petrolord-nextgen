# Parts per million and milligrams per cubic metre

{{panel:cq-release}}

A gas concentration comes in two units. Milligrams per cubic metre is a mass in a volume, which is what the plume computes. Parts per million is a ratio of volumes, which is how many exposure limits and gas detectors read. Converting between them needs the molar mass of the gas and the volume a mole of gas occupies at the stated conditions. The engine does the conversion explicitly and asks for every input.

## The model, in the engine's words

The basis reads, verbatim: "mg/m3 = ppm x M / Vm, Vm = R T / P (ideal gas)". M is the molar mass in g/mol, the concentration unit of molar mass from the first module. Vm is the molar volume, the ideal gas R T / P at the STATED temperature and pressure. The two functions `ppmToMgM3` and `mgM3ToPpm` are exact inverses at the same temperature and pressure.

## The molar volume

| temperature K, stated | molar volume L/mol at 101325 Pa |
| --- | --- |
| 273.15 | 22.413970 |
| 293.15 | 24.055117 |
| 298.15 | 24.465404 |

At 298.15 K the molar volume is 24.465404 L/mol. The familiar CCOHS and NIOSH figure of 24.45 approximates it, and the golden test gates the engine against it at one part in a thousand. The engine computes the molar volume every time from the temperature you state, so a study at another temperature gets the right one without a new constant.

## Two gases at three temperatures

| substance | ppm, stated | mg/m3 at 273.15 K | mg/m3 at 293.15 K | mg/m3 at 298.15 K |
| --- | --- | --- | --- | --- |
| carbon monoxide, 28.01 g/mol | 50 | 62.483354 | 58.220461 | 57.244099 |
| carbon monoxide, 28.01 g/mol | 400 | 499.866834 | 465.763690 | 457.952795 |
| hydrogen sulphide, 34.08 g/mol | 50 | 76.024017 | 70.837320 | 69.649372 |
| hydrogen sulphide, 34.08 g/mol | 400 | 608.192135 | 566.698556 | 557.194975 |

Two patterns stand out. Across a row, a colder gas is denser, so the same ppm is more mg/m3. Down the table, a heavier molecule carries more mass per mole, so hydrogen sulphide at the same ppm is more mg/m3 than carbon monoxide.

## The plume and the conversion

The plume returns mg/m3 always, and ppm only when a molar mass is given. The UBIT release carries 28.01 g/mol for carbon monoxide, which is why its tables show both columns: 239.712839 mg/m3 at 500 m in class D appears beside 209.377772 ppm. Without a molar mass the conversion has nothing to work with, and the engine refuses:

> molarMassGMol: must be a molar mass above 0 g/mol

The field is `molarMassGMol`, in grams per mole. This is the second molar mass unit. The source terms took kilograms per mole, and a value carried from a gas outflow into a plume has to be converted on the way.

Report the unit the comparison needs. A detector alarm in ppm, an exposure limit in ppm or mg/m3, and a toxic probit whose coefficients expect one or the other all set the unit, and a probit preset states which one it expects. Always state the temperature the conversion used.

## Exercise

On the plume view, run UBIT at 500 m in class D and read both concentrations. Divide the mg/m3 figure by the ppm figure, multiply by a molar volume from the table, and compare the result with the molar mass typed on the panel. Write one sentence naming the temperature the plume's conversion must have used, and how you can tell.
