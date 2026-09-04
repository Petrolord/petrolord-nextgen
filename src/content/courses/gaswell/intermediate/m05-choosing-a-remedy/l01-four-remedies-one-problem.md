# Four remedies, one problem

The liquid is losing at the bottom of the string and the gauge is at the top, so every remedy has to be argued at a station nobody reads.

{{panel:pd-profile-explorer}}

## The well that needs one

EBOCHA-5 is 7500.0 ft of 3.548 in tubing, gas gravity 0.620, produced brine at 62.0 dyne/cm and 66.2 lbm/ft3, making 3100.0 Mscf/d. It is a teaching well, not a published case.

Under the correlation its wellhead pressure of 880.0 psia selects, the ratio runs 1.1605604334 at 0.0 ft, 1.1184659554 at 1500.0 ft, 1.0761623743 at 3000.0 ft, 1.0340528848 at 4500.0 ft, 0.9979085215 at 6000.0 ft and 0.9619521855 at 7500.0 ft. The verdict is `loaded = true`, controlling station 7500.0 ft, margin -3.80478145 percent.

## Only three quantities enter that ratio

A critical velocity at the station, a flow area, and a rate. Everything anybody does to a loading well moves one of the three.

**A smaller string** cuts the area, so the same gas moves faster. Nothing about the well changes.

**More gas** raises the actual velocity directly. Compression, a stimulation, a choke opened.

**Lower pressure at the station** cuts the gas density, which raises the critical velocity and lowers the critical rate at once. The published water rows at 540.0 degR run from 4.8885576115 ft/s and 2496.154595078 Mscf/d at 2500.0 psia to 14.5723108360 ft/s and 892.895047041 Mscf/d at 300.0 psia. The actual velocity rises too: the same 3100.0 Mscf/d on EBOCHA-5 moves at 5.8895500931 ft/s at 1500.0 psia and 8.6650712734 ft/s at 880.0 psia.

**A plunger** stops arguing about velocity altogether and lifts the liquid mechanically, one slug at a time.

## The lever that is only an input

Changing the fluid, with a foamer or a soap stick, works on interfacial tension and liquid density. Both of those are inputs to these modules and neither is a function of anything the engine knows. Water at 60.0 dyne/cm and 67.0 lbm/ft3 gives a published critical rate of 1614.343188395 Mscf/d at 1000.0 psia and 540.0 degR through 2.441 in; condensate at 20.0 dyne/cm and 45.0 lbm/ft3 gives 1102.641685283 Mscf/d at the same station. The engine will score a fluid change and will never propose one.

## The mistake

Choosing the remedy against the wellhead number. A point check at 0.0 ft on this well reads a ratio of 1.1605604334, `loaded = false` and a margin of 16.05604334 percent, so it argues for no remedy at all while the bottom two stations are losing liquid.

## What none of them touch

The traverse. `loadingProfile` takes a list of stations with their own pressure, temperature, z and diameter, does not solve multiphase flow and does not invent a gradient. A remedy that would change the pressure profile has to be handed back in as a new traverse, by you.

## Exercise

Name the three quantities in the ratio and put each of the four remedies against the one it moves.

Then say which remedy the engine can score without any new input, and which two need a traverse you do not have yet.
