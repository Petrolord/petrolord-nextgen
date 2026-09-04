# The station the sizing was given

`sizeTubingForRate` takes a bare pressure, temperature and z. It has no opinion about which station they came from, and it does not say in its answer.

{{panel:pd-profile-explorer}}

## The same list at the wellhead

EBOCHA-5's controlling station is 7500.0 ft at 1500.0 psia, and the profile documentation says so. Hand the sizing the wellhead conditions instead, 880.0 psia, and it accepts them without a murmur. Same nine candidates, same 3100.0 Mscf/d, same Coleman correlation.

| Candidate, in | Wellhead rate, Mscf/d | Wellhead ratio | Controlling ratio |
| --- | --- | --- | --- |
| 3.958 | 3324.132229053 | 0.9325742138 | 0.7729815504 |
| 3.826 | 3106.108647454 | 0.9980333439 | 0.8272385726 |
| 3.740 | 2968.041135249 | 1.0444599177 | 0.8657201053 |
| 3.548 | 2671.123287413 | 1.1605604334 | 0.9619521855 |
| 3.476 | 2563.812418697 | 1.2091368219 | 1.0022156322 |
| 3.068 | 1997.272957665 | 1.5521163435 | 1.2865006128 |
| 2.441 | 1264.335319254 | 2.4518812002 | 2.0322875149 |
| 2.041 | 883.919511877 | 3.5071066521 | 2.9069308342 |
| 1.610 | 550.019976742 | 5.6361589235 | 4.6716355635 |

The wellhead sizing returns `largestUnloaded` of 3.740 in at 1.0444599177. The same list at the controlling station returns 3.476 in, so the station is worth 0.264 in of tubing.

## The answer that gets reported

EBOCHA-5's current string is 3.548 in. The wellhead sizing says the largest string that unloads this well is 3.740 in, which is bigger than what is already in the hole, so the study reports that no workover is needed.

The current string ratio at the wellhead is 1.1605604334 and at the controlling station it is 0.9619521855. The well is loading over the bottom 40.0000 percent of its tubing while that answer is returned.

Under Turner the same thing happens one size along: the wellhead list picks 3.476 in at 1.0076140183 and the controlling list picks 3.068 in, so the station is worth 0.408 in there.

## Nothing in the return says where it stood

A row carries `idIn`, `ok`, `correlation`, `adjustment`, `rhoGasLbFt3`, `terminalFtS`, `velocityFtS`, `constant`, `areaFt2`, `criticalVelocityFtS`, `criticalRateMscfd`, `actualVelocityFtS`, `ratio` and `loaded`. The correlation is recorded on every row. The depth is recorded nowhere.

Pressure and temperature reach the answer only through the density and the velocity they produced, so two sizings run at two stations on the same well are indistinguishable from their return values alone.

## The mistake

Taking the station from whatever number was to hand, which on a real study is the gauge, because the gauge is the reading the report already contains. The function is not wrong. It answers the question it was asked, at the station it was given, and it fails quietly because a plausible answer comes back either way.

The controlling profile point already carries `pPsia` 1500.0, `tempR` 653.67, `z` 0.9142643742, `idIn` 3.548 and `depthFt` 7500.0, ready to hand straight in. Nothing makes a caller do it.

## What it refuses

It refuses nothing here. There is no station argument to validate, no depth in the return to check and no warning attached to either answer.

## Exercise

Size EBOCHA-5 at the wellhead and at the controlling station and write both picks.

Then say which field in the returned object would have caught the substitution, and confirm it is not there.
