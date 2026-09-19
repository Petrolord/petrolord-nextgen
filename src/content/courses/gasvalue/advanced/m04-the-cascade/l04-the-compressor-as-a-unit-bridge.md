# The compressor as a unit bridge

IBAFO's banks are recharged by a compressor. lpgCng has a function for it, `cngCompression`, and it is a bridge. It does not compute compression itself. This lesson reads what the bridge does and what it hands back, and leaves the compression to the course that owns it.

{{panel:gasvalue-rollout-explorer}}

## What the bridge does

cngCompression converts the station's metric inputs to the field units the Facilities compression engine speaks, calls it, and converts the answer back. The thermodynamics belong to the Facilities course and are not graded here.

The result states its own basis: "Staging, polytropic head and real-gas Z from the Facilities compression engine; this converts units and does not reimplement the thermodynamics."

## IBAFO's compressor

400 kg/h of gas 0.62, suction 5 bar(a) at 32 C, discharge 255 bar(a). All invented.

| bridge | value |
| --- | --- |
| qMMscfd (the throughput as standard volume) | 0.4473 |
| suction, psia | 72.5189 |
| stageCount | 4 |
| pressureBasis | absolute (bar(a)) |

## Reading the bridge

The station types a mass rate, 400 kg/h. The bridge hands the Facilities engine a standard volume: qMMscfd 0.4473. The station types suction in bar(a), 5. The bridge hands it on in psia: 72.5189. The pressures on both sides are absolute, and pressureBasis prints absolute (bar(a)) on this result as on every CNG result.

stageCount is 4. That count comes back from the Facilities engine, and the bridge prints it as a whole number. The stage pressures come back the same way, and the bridge prints them in bar(a).

## The stages the Facilities engine returns

| stage | suction bar(a) | discharge bar(a) | ratio |
| --- | --- | --- | --- |
| 1 | 5.0000 | 13.3620 | 2.6723 |
| 2 | 13.3620 | 35.7070 | 2.6723 |
| 3 | 35.7070 | 95.4220 | 2.6723 |
| 4 | 95.4220 | 255.0000 | 2.6723 |

The bridge converts the stage pressures back to bar(a). Stage 1 takes the gas from 5.0000 to 13.3620 bar(a). Each stage's discharge is the next stage's suction. Stage 4 ends at 255.0000 bar(a), the discharge typed. Every stage prints a ratio of 2.6723.

## Where the course stops

This course reads the bridge: the standard volume, the psia, the stage count and the stage pressures. Head, efficiency and power are the Facilities engine's figures and belong to the Facilities course. They are not taught or graded here. The validation oracle here checks only the unit bridge; the compressor train's thermodynamics are the Facilities engine's and are validated there.

## What the bridge refuses

| probe | engine |
| --- | --- |
| discharge below suction | REFUSED: A suction pressure and a higher discharge pressure are required. |
| no throughput | REFUSED: A throughput is required. |

The first refusal holds the discharge above the suction. The second asks for a throughput, the figure the bridge turns into qMMscfd.

In practice, a station engineer takes the stage pressures from this bridge into the compressor vendor's own data sheet, and the Facilities course is where the head and the power are read.

## In the explorer

Open IBAFO's compressor. Read qMMscfd, the suction in psia, the stage count and the four stages. Set the discharge below 5 and read the refusal.

## Exercise

Read IBAFO's bridge: 400 kg/h becoming qMMscfd 0.4473, 5 bar(a) becoming 72.5189 psia, stageCount 4, and the four stages from 5.0000 to 255.0000 bar(a) at a ratio of 2.6723 each. Say which figures the bridge converts and which it takes back from the Facilities engine, and quote the result's basis sentence.
