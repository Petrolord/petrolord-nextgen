# The kinetics panel map

This tier has one panel and you will use it in almost every module. It runs the same engine code the capstone grades against, on the same fixtures, so every number it shows is a number you can be asked for. This lesson is a guided tour.

{{panel:bs-kinetics-explorer}}

## The controls

There are three. The heating rate selects which of the golden ramps the reflectance chart highlights: 1, 3 or 10 degC per Ma, all running 20 to 200 degC. The isothermal temperature sets the constant temperature of the kerogen clock, and the kerogen type selects which potential spectrum that clock integrates. The ramps always show all three rates so the separation between them stays visible; the control chooses which one the tiles read.

## The reflectance chart

The upper chart is Ro against temperature for the three ramps, drawn on a logarithmic reflectance axis. Three features are worth fixing in your mind now, before the modules that explain them.

First, the curves rise smoothly through two orders of magnitude with no steps and no plateaus. That smoothness is the twenty-bin ladder at work: as the temperature climbs, successive bins take over the reacting, and their staggered energies blend into one continuous rise.

Second, the three curves are ordered, and the slowest ramp sits highest at every temperature. At 150 degC the 1 degC per Ma curve reads 1.1129254516555198 while the 3 degC per Ma curve reads 0.9871413464062039. Same rock, same temperature, different history. Module 3 makes this quantitative; the Associate tier already told you it would happen.

Third, the vertical gaps between the curves widen as temperature rises. Heating rate matters more, not less, as a rock matures.

The 150 degC marker line is drawn because two of your graded values live on it.

## The transformation chart

The lower chart is the kerogen clock: transformation ratio against time at the constant temperature you chose, for the type you chose, over 100 Ma. Its shape is the lesson. The curve rises steeply at first, then bends over and crawls, and the bend is not an artefact. At 100 degC the Type II curve passes 0.022481215976523083 at 10 Ma and only 0.05477927380797565 at 50 Ma: five times the time for less than two and a half times the conversion. Module 4 explains the stall by looking inside the bins.

Move the temperature control up by 20 degC and watch the whole curve change character. That contrast, between what time buys and what temperature buys, is the single most practical instinct this tier can give you.

## The tiles

The tiles under the charts are the graded surface. The first pair is the closed-form anchors, Ro at zero reaction and at full reaction, which the panel computes from $e^{-1.6+3.7F}$ and not from a lookup. The ramp tiles read Ro at 150 degC for the selected rate. The clock tiles read TR at 10 and at 50 Ma for the selected temperature and type. Set the rate to 3, the temperature to 100 and the type to II and the six tiles in view are exactly the six fields of your capstone.

One quality-control habit to start now: whenever you change a control, predict the direction of every tile before you look. Slower rate, higher Ro. Hotter clock, higher TR. Type III instead of II, lower TR. The panel is not there to give you numbers, it is there to correct your predictions, and by the capstone you should not need it.

## Exercise

Set the panel to the capstone configuration and read off all six values. Then set the heating rate to 10 and answer: did the Ro tile at 150 degC rise or fall, and by roughly how much relative to the rate-3 value?

As a self check: at the capstone configuration the tiles read 0.20189651799465538 and 4.687971627022019 for the anchors, 0.9871413464062039 for Ro at 150 on the 3 degC per Ma ramp, and 0.022481215976523083 and 0.05477927380797565 for TR at 10 and 50 Ma. Switching the rate to 10 drops the 150 degC reflectance to 0.8795791051334334, about 11 percent below the rate-3 value, because the faster ramp gives every temperature on the way less time to react.
