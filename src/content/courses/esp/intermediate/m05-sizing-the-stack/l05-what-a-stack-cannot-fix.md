# What a stack cannot fix

Stages multiply one reading. Whatever is wrong with that reading is wrong in every stage.

{{panel:pd-lift-explorer}}

## A stack inherits its stage

The head a stack makes is the head per stage times a count, the power it absorbs is the brake power per stage times a count, and the efficiency it runs at is the stage efficiency unchanged.

So the region does not move. The published highWaterCut design is sized at 264 stages with the duty in downthrust, and its one warning says the stages run left of the recommended range and wear on the thrust washers. Stages do not move a duty rate, and the region is set by the rate.

## It cannot fix a fluid

The viscosity check flags at 10 cSt. A fluid of 20 cp at 58 lbm/ft3 is 21.517241 cSt, so a correction is required, and the note says the water curve overstates head and efficiency and asks for Hydraulic Institute factors before the stage counts are used. Factors applied: false. With none supplied the reading comes back unchanged.

An overstated head per stage understates the stage count, and multiplying an overstated stage by a count only spreads the error. Supplied factors of 0.85 on head and 0.70 on efficiency take a 28.00000000 ft stage to 23.80000000 ft and a 0.7000000000 efficiency to 0.4900000000: a different pump, not a longer one.

## It cannot fix a motor

The teaching well QUA-IBOE-4 sized at 172 stages raises motorOverloaded: the shaft needs 95.4 hp against a 100 hp motor derated 12 percent for thrust, a usable 88.0 hp, 108.4 percent of what it may carry. Read the first two numbers alone and the well looks comfortable, because 95.4 against 100 is not an overload. The derate is what makes it one, and the flag is computed against the usable rating rather than the plate. Move up a motor or take stages out, and taking stages out is on that list because stages are the only lever the sizing has, and it costs head to pull it.

## It cannot fix an extrapolation

`sizePump` warns when the duty falls outside the published range and returns the stack anyway. A stage count divides by the head per stage, so a stage reading that is too small is amplified rather than absorbed. All four cases here read inside the published range, which is the condition under which the rest of this module means what it says.

## The mistake

Answering a head shortfall with stages. That is right only when the head per stage is right. Where it is wrong, because the fluid is viscous or the reading came from off the end of the fit, more stages carry more of the same error and the design looks more confident for it.

## What it refuses

`stageCount` refuses exactly two things: a head per stage of zero and a negative one, both returning NaN. Everything else it computes. The verdicts and warnings around it name a class of problem and stop. None of them changes a stage count, and none declines to return one.

## Exercise

Take the case in the panel sized in downthrust, add stages until it makes more head, and read the region again.

Then apply the published viscosity factors to a stage and say what happens to the stage count.
