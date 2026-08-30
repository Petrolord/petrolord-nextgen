# The frictional bounds

The limits the estimate is clamped to, and why they are a different kind of statement.

{{panel:gm-stress-explorer}}

## The idea

The earth is full of faults. If a stress state would cause slip on a favourably oriented existing fault, it cannot persist: the fault slips and relieves it.

So there is a maximum ratio between the largest and smallest effective principal stresses that any point in the crust can sustain.

## The ratio

    q = (1 + sin(phi)) / (1 - sin(phi))

with phi the friction angle on the fault. That is the Mohr-Coulomb condition for slip on a cohesionless surface.

| friction angle | q |
|---|---|
| 0 deg | 1 |
| 20 deg | 2.0396067291614743 |
| 30 deg | 3 |
| 32 deg | 3.254588303299863 |
| 35 deg | 3.6901723321426636 |
| 40 deg | 4.598909932113389 |
| 45 deg | 5.828427124746189 |

A friction angle of 30 degrees gives exactly 3, which is the number most often quoted.

## The bounds it produces

    lower = sigma_v_eff / q + alpha x Pp
    upper = sigma_v_eff x q + alpha x Pp

The lower one is the active limit: horizontal stress low enough to cause normal faulting. The upper one is the passive limit: horizontal stress high enough to cause reverse faulting.

Both horizontal stresses are clamped into that interval.

## Why this is a different kind of statement

**The poroelastic formula is an ESTIMATE.** It says what the stress probably is, given a picture of how the rock got there.

**The frictional limits are BOUNDS.** They say what the stress cannot be, given that the crust contains faults and they have not all slipped.

Mixing the two is the classic error the engine's own header calls out: a legacy version of this model treated the limits as estimates, which is claiming to know a stress when all you know is a range it lies in.

## What clamping does in this profile

Four of the 52 samples are clamped at the published parameters, all of them at the top of the hole where the strain term has pushed the estimate above the passive limit.

At 50 m both horizontal stresses come out clamped to exactly the same value, 2531747.107419281 Pa, because both hit the same upper bound.

## Reading a clamped answer

A clamped stress is not a prediction. It is the statement "this is the most it could be", and the true value is somewhere at or below it.

The engine counts the clamps and reports the count, which is the right behaviour: a run with many clamps is a run whose estimate is being overruled by its own sanity check, and that is worth knowing before using the output.

## Exercise

At 2600 m, compute the two frictional bounds using the published friction angle, and check that neither horizontal stress is clamped there.

Then find the shallowest depth in the panel at which clamping stops, and say what that depth depends on.
