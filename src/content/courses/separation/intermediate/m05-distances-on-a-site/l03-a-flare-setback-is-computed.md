# A flare setback is computed

The ERHA flare relieves 18.000000 kg/s of gas at 46000.000000 kJ/kg, which is 828000.0000 kW of heat release, and at an allowable of 4.730000 kW/m2 with 0.300000 of the heat radiated the setback comes out at 64.6458 m.

{{panel:fc-layout-explorer}}

## A duty, a fraction and an allowable

The chain has three steps. The mass rate times the heat of combustion gives the heat release. A fraction of that is radiated rather than carried away in the plume, 0.300000 on this flare. The point source model then asks at what distance the radiated power, spread over a sphere, falls to the allowable intensity.

Every input is a property of this flare on this day. Change the relief rate and the setback moves, which is the whole difference between a computed setback and a table figure.

## Two published flares

| case | kg/s | kJ/kg | allowable kW/m2 | heat release kW | setback m |
| --- | --- | --- | --- | --- | --- |
| flare20kgsAt4p73 | 20.000000 | 46000.000000 | 4.730000 | 920000.0000 | 68.1427 |
| flare5kgsAt1p58 | 5.000000 | 43000.000000 | 1.580000 | 215000.0000 | 49.3602 |

Both cases are checked by walking the calculation backwards: the intensity at 68.1427 m reads 4.7300 kW/m2 and the intensity at 49.3602 m reads 1.5800 kW/m2, which is the allowable each was solved for. The second case carries a transmissivity of 0.900000 and radiates 0.250000 of its heat, so a quarter of the first case's duty does not give a quarter of its setback.

## Two fractions in the chain

Two of the inputs are fractions and both belong to the case rather than to the model. The radiated fraction says how much of the heat release leaves as radiation instead of going up with the plume, 0.300000 on the ERHA flare and 0.250000 on the smaller published case. The atmospheric transmissivity says how much of that radiation survives the air between the flame and the target, 1.000000 on the first published flare and 0.900000 on the second.

Neither is a property of the flare tip. They are assumptions, and a setback quoted without them cannot be reproduced by the next reader.

## The allowable is a label

| level kW/m2 | what the label says |
| --- | --- |
| 1.580000 | Continuous exposure, no time limit (site boundary, control room) |
| 4.730000 | Emergency action of several minutes, with clothing |
| 6.310000 | Emergency action up to about a minute |
| 9.460000 | Seconds only: escape route |

These are the API 521 customary levels as this engine records them, and the labels are HELD FOR LITERATURE with no source checked. The arithmetic that turns an allowable into a distance is the engine's own and is checked against the published cases. The choice of which allowable applies to a control room is a judgement the labels only describe, so the label is not the authority for that choice.

## The table and the computed answer disagree

On ERHA the flare stands 46.1777 m from the control room. The table asks for 90.000000 m and the computed radiation setback asks for 64.6458 m, and the layout fails both. They are different findings: one says the plot breaks a spacing convention, the other says this flare at this duty puts more than 4.730000 kW/m2 on that building.

## The mistake

The mistake is letting the table figure stand in for the calculation. A table cannot know the relief rate, so a flare well inside a 90.000000 m rule can still exceed its allowable when the duty is large enough, and a small flare can clear its radiation setback while breaking the table.

## Exercise

Work the ERHA flare from 18.000000 kg/s to its setback, naming each input. Give the heat release and setback for both published flares. Then state which part of this lesson is held for the literature and which part is checked against the published cases.
