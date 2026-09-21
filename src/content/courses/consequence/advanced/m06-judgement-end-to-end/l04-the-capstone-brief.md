# The capstone brief

{{panel:cq-harm}}

The Expert capstone asks the tier's own question: who is hurt, by a blast, a fire and a toxic cloud. It hands you a facility with its inputs stated and asks for six graded answers, all worked on the harm panel. The facility and its numbers are in the capstone itself.

## What the capstone asks

The capstone states a TNT mass. It never asks you to derive one from a fuel mass, because the TNT equivalence is a single route quantity and never carries a graded answer. From that stated charge it asks for:

- the Kinney and Graham peak side-on overpressure at a stated distance;
- the distance at which the same charge gives a stated overpressure;
- the fatality probability of an overpressure by the overpressure probit;
- an Eisenberg thermal lethality probability for a stated heat flux and exposure time;
- a Lees toxic lethality probability for a stated concentration in ppm and a stated time;
- a Lees toxic lethality probability for a stated concentration in mg/m3 at a stated temperature, with the molar mass you need to convert it.

Every one of those rests on evidence this tier has read: the published conference column for Kinney and Graham, the OSD/30 printed points for the overpressure probit, the OSD/30 lethal doses for Eisenberg and the OSD/30 columns for the Lees presets.

## Working the blast parts

On the blast view, type the stated charge in the TNT charge field, then the distance. A refusal means the scaled distance lies outside the range the fit is used over. For the distance, type the stated overpressure in the field for finding a distance. Run the round trip: the distance you found, fed forward, should return the overpressure you asked for.

For the fatality probability, the probit view takes the overpressure in psig, the preset's own unit. Divide the pascals by `PA_PER_PSI` before you type it.

## Working the fire and toxic parts

On the probit view, choose the Eisenberg preset, type the heat flux in W/m2 and the exposure in seconds. The preset converts to its own unit.

On the toxic view, choose the Lees preset for the named substance. For the first toxic part, type the concentration in ppm and the exposure in minutes. For the second, switch the concentration unit to mg/m3 and give the molar mass and the stated temperature. The default temperature is right only when it is the one stated.

## How the answers are judged

Each answer is graded at the six decimals this course prints. The tolerance is set in one place, and nothing you type changes it. Quote the engine's figure as the panel prints it, unrounded.

## Exercise

Before opening the capstone, rehearse each part on the teaching streams. Take BONGA's stated 500 kg charge and find the overpressure at 100 m and the distance for 10000 Pa. Run 20000 W/m2 for 20 s on Eisenberg. Run 400 ppm of chlorine for 10 minutes on lees-chlorine. Confirm each against its lesson, and write down which panel field each capstone part will use.
