# The sources and what each fixes

{{panel:cq-release}}

A number from a consequence model is only as good as the published method behind it. This engine names its methods in every result, and it exports the list of sources it draws on as `CONSEQUENCE_SOURCES`. Reading that list tells you where each figure in this course comes from, and which document to open when a reviewer asks.

## The six sources, verbatim

The engine strings, exactly as exported:

| key | the engine string, verbatim |
| --- | --- |
| YB | TNO Yellow Book CPR 14E (2005) |
| PB | TNO Purple Book CPR 18E (1999) |
| OSD | UK HSE SPC/Tech/OSD/30, Indicative human vulnerability to the hazardous agents present offshore |
| ALOHA | NOAA TM NOS OR&R 43, ALOHA Technical Documentation (2013) |
| KG | Kinney and Graham (1985) Explosive Shocks in Air, 2nd ed.; as printed by Guzas and Earls (2010) eq. 5 |
| CCOHS | CCOHS, Converting occupational exposure limits from mg/m3 to ppm (24.45 L/mol at 25 C, 760 torr) |

## What each one fixes

Each source fixes a particular part of the engine:

| key | what it fixes in this engine |
| --- | --- |
| YB | liquid and gas outflow through a hole, Mackay and Matsugu evaporation, the pool diameter, the Babrauskas and Burgess burning rates, Thomas with wind, the flame tilt, the surface emissive power, the Bagster transmissivity, the solid flame heat flux, the view factors and the TNT equivalence |
| PB | the probit to probability relation and its table, the toxic probit coefficients, the heat radiation probit and a worked carbon monoxide plume |
| OSD | the thermal probits by name, the Lees toxic probits in ppm and the overpressure probit |
| ALOHA | the continuous Gaussian plume with ground reflection and the Briggs rural sigma coefficients |
| KG | the free air peak side-on overpressure closed form |
| CCOHS | ppm and mg/m3 through a molar volume |

For the Associate tier three of these carry almost everything. The Yellow Book fixes the outflow through a hole, the pool diameter and the evaporation. ALOHA fixes the plume and its sigma coefficients. CCOHS fixes the conversion between ppm and mg/m3. The Purple Book adds one worked carbon monoxide plume, which module five reproduces. The other rows belong to the fire and harm tiers.

The CCOHS string carries a figure worth noticing: 24.45 L/mol at 25 C. The engine does not take that figure as a constant. It computes the molar volume from the ideal gas law at the temperature and pressure you state, which gives 24.465404 L/mol at 298.15 K, and the printed 24.45 is its rounding. A source can fix a method without fixing every digit.

## A result carries its own citation

Every basis block names the source it used, so a result travels with its citation attached. The plume at 500 m in class D reports, verbatim:

"NOAA TM NOS OR&R 43, ALOHA Technical Documentation (2013) section 4.3; sigmas Briggs rural (ALOHA Table 13)"

That string tells a reviewer two things at once: which document gave the plume expression, and which table gave the sigmas. A consequence note that copies the basis into its text never has to reconstruct afterwards which edition or which table was used.

## Why a source list matters

A consequence study is reviewed by people who were not in the room when it was run. The reviewer needs to check a figure against something printed. Where the engine reproduces a published worked case, this course shows both numbers side by side: the Yellow Book acrylonitrile outflow, the hydrogen release, the pool diameter and the Purple Book plume all appear in the modules ahead. Where a published value does not reproduce, the course says so and names the source as the one in error. Those errata are facts about the printed books.

## Exercise

Open the plume view and run the UBIT release at 500 m in class D as it loads. Read the model and source the panel shows beneath the result, and match each part of that citation to a row of the table above. Then switch to the outflow view, run the AMENAM gas line, read its basis, and name the source key that fixes it. Write one sentence on what a reviewer could check using each citation.
