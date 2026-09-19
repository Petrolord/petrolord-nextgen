# What the next tier changes

This tier read flareToValue: the routes, their envelopes and ceilings, a route's year, the counterfactual, the credit and the bid. The next tier reads the second module the course covers, lpgCng, behind the LPG & CNG Rollout Studio.

## Two new cases

The next tier leaves EGBEMA's flare and takes up two new cases. KANO is an LPG storage and bottling plant. IBAFO is a CNG mother station on the Lagos-Ibadan expressway, with a Lagos bus operator switching to CNG. Kano, Ibafo and Lagos are real places. The plant, the station, the operator and every figure attached to them are invented and illustrative, like every figure in this course.

## The questions lpgCng answers

The course's question table pairs each rollout question with the lpgCng function that answers it:

| question | function |
| --- | --- |
| how much LPG can the vessel hold, and when to reorder | lpgBlendProperties, lpgStorageSizing |
| how big a vaporizer, how many carousel positions, how many cylinders | vaporizerDuty, bottlingPlant, assetFloat |
| how much gas is in a bank, and how many vehicles does a cascade fill | gasMassInVessel, cascadeFills |
| what does the station compressor and forecourt need | cngCompression, cngDispensing |
| does the customer save by switching fuel | conversionEconomics |

lpgCng exports ten functions, and those ten are the ones in the table.

## The two modules side by side

| module | exported functions | exported constants and tables |
| --- | --- | --- |
| flareToValue | 7 | 8 |
| lpgCng | 10 | 9 |

The Associate tier and this tier together used all seven of flareToValue's functions: characteriseGas and abatement for the gas and the flare, and screenRoute, yieldCeiling, routeEconomics, creditSensitivity and compareRoutes for the routes. The next tier moves to lpgCng's ten.

## What lpgCng calls

The rollout studio does not write its own queue, its own Z factor or its own compressor train. lpgCng calls the loading-rack queue in terminalDepot for its carousel and forecourt, the gas Z factor in production/gasProperties, and the compressor train in facilities/compression. The loading-rack queue is the `supply` course's, and the carousel and the forecourt call it.

## Constants the next tier uses

lpgCng exports nine constants and tables. Three of its unit constants were printed in the Associate tier beside flareToValue's own:

| constant | value | what it is |
| --- | --- | --- |
| M3_PER_SCF (lpgCng) | 0.02831684659 | cubic metres in one standard cubic foot |
| KJ_PER_KWH (lpgCng) | 3600 | kilojoules in one kilowatt hour |
| PSI_PER_BAR (lpgCng) | 14.503773773 | psi in one bar |

The standard cubic foot in M3_PER_SCF is the one the Associate tier opened on: a standard cubic foot counts gas at 60 F and 14.696 psia, so a volume of gas is a number of moles.

Two more of its exports carry the word basis in their names: FILL_RATIO_BASIS and PRESSURE_BASIS. The next tier reads what each states.

## What carries over from this tier

Three habits of reading carry over, each one this tier practised on a printed figure.

**A basis is named.** Every route here carried a ceiling basis word: gas mass, propane and heavier, heating value. lpgCng's two basis constants are named above, and the reader quotes a basis as it is printed.

**A blank is handled one of a few printed ways.** Here a blank cost was named in assumedZero, a blank recovery was refused, and a blank reference cost gave a null capital with a note.

**A cash flow is handed on.** routeEconomics handed its cash flow to the sanctioned economics engine undiscounted. This course computes no discounted figure.

## Exercise

Read the question table. Name the lpgCng functions that answer the vessel question and the cascade question. Then name the three modules lpgCng calls, and give the value and meaning of the constant PSI_PER_BAR.
