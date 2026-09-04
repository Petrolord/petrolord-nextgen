# What sizing cannot fix

A velocity string moves the same gas faster. It does not make more gas, and when there is not enough gas the sizing says so by returning nothing.

{{panel:pd-profile-explorer}}

## The refusal at the bottom of the list

Run the EBOCHA-5 candidate list at 40.0 Mscf/d and `largestUnloaded` comes back `null`. The best ratio anywhere on the list is 0.0502326405, on the smallest string offered. There is no least bad candidate and no clamp to the smallest diameter.

That is the right refusal, and it is worth holding beside the pick: the function that returns 3.476 in with ten digits of ratio returns nothing at all when nothing works.

## Rate is what a velocity string spends

The critical velocity at the EBOCHA-5 controlling station is 6.1224977520 ft/s under Coleman, built from a gas density of 4.2000760651 lbm/ft3 and brine at 62.0 dyne/cm and 66.2 lbm/ft3. No tubing size changes any of that. A smaller string only raises the actual velocity, from 5.8895500931 ft/s on the current 3.548 in to 6.1360629550 ft/s on 3.476 in, by making the same 3100.0 Mscf/d occupy less area.

Take the gas away and the mechanism has nothing to work with. On the current string, at 2400.0 Mscf/d, every station reads loaded, the shallowest at 0.0 ft, and the margin is -25.526282 percent.

## What the modules do not know

There is no inflow performance in them, so the rate is an input and the sizing assumes the well keeps making it through the new string. There is no pressure drop calculation either, so a smaller string carries no friction penalty in this answer at all.

Interfacial tension and liquid density are inputs. The balance models one droplet at its terminal velocity, so film flowing on the tubing wall, coalescence and break-up in transit are all outside it, and the drag coefficient of 0.44 is a rigid sphere.

## The mistake

Treating a returned diameter as a remedy. It is a diameter at which one ratio at one station clears one, computed under a correlation chosen from a pressure of 880.0 psia at the top of the well, against a rate somebody supplied. Each of those qualifications is a place the answer can be wrong while the number looks fine.

## What it refuses

The sizing refuses to invent a candidate. It scores the list it is given, 3.958 down to 1.610 in, and returns `null` rather than extrapolating past it. It also refuses to compare its pick to what is already in the hole, so whether 3.476 in against a current 3.548 in is a workover is a comparison you make.

## Exercise

Run the sizing at 40.0 Mscf/d and record what comes back, then read the best ratio on the list.

Then say what a caller would have to do to turn that refusal into a wrong answer.
