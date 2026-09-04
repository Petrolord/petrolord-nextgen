# What a fit assumes

Five assumptions sit under every head this curve returns, and only one of them is checked.

{{panel:pd-stage-explorer}}

## That the points were transcribed correctly

The only guard is the rmse against two percent of the tallest published head point, 0.6400 ft on a curve whose tallest point is 32.0000 ft. The teaching curve BRASS-11 in its mild form reaches 0.58797473 ft with one head point mistyped and raises no warning, because that sits below 0.640000. A fit that passed its check is not a fit that describes the pump.

## That the fluid is the curve fluid

The golden vendor curve carries a curve specific gravity of 1.0. Gravity enters the power statement and nothing else, so at 2500 bbl/d and 60 Hz the head is 27.914286 ft and the efficiency 0.73657143 fraction on any fluid, while brake power per stage is 0.69851755 hp on specific gravity 1.00 and 0.62866580 hp on 0.90. This is the easy assumption, because the engine takes the pumped gravity as an input and applies it.

## That the fluid is not viscous

The curve is a water curve. Above 10 cSt a correction is normally needed, and this module reports the viscosity, says a correction is required, and applies nothing: at 20 cp on a 58 lbm/ft3 fluid the kinematic viscosity is 21.517241 cSt, correction required is true and factors applied is false.

Supply the factors and they are applied as multipliers: 0.85 on head and 0.70 on efficiency take an uncorrected 28.00000000 ft and 0.7000000000 fraction to 23.80000000 ft and 0.4900000000 fraction. Supply nothing and the reading comes back unchanged.

## That the impeller is the one the vendor measured, and the rate is inside the data

The affinity laws are exact for a fixed impeller, so a trimmed or worn one is outside the model entirely. And the published range of 1500 to 3500 bbl/d records where the vendor measured. The polynomial has an opinion at every rate, inside that range or not.

## The mistake

Treating the fit as the pump. The fit is five typed numbers, a degree and a normalising scale, and it inherits every transcription error without comment. The three most expensive assumptions, the transcription, the viscosity and the range, are reported as flags or notes rather than enforced, so a quietly wrong answer looks exactly like a right one.

## What it refuses

It refuses to guess a viscosity correction. The industry method is the Hydraulic Institute chart, ANSI/HI 9.6.7, and this module does not reproduce it from memory, because invented factors would be worse than none. The note it prints instead says the water curve overstates head and efficiency, and factors must be entered before the stage counts are used.

## Exercise

Read head, efficiency and brake power at 2500 bbl/d on specific gravity 1.00 and on 0.90, and say which of the three moved.

Then name the two assumptions in this list that the engine reports on without acting on.
