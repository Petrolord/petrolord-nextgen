# The signature of each

Three events, three patterns, one table.

## The table

| observation | losses | kick | pack-off |
|---|---|---|---|
| standpipe pressure | falls slightly | falls slightly | rises sharply |
| pit volume | falls | rises | steady |
| flow out against flow in | less | more | less or steady |
| torque and drag | steady | steady | rises |
| hookload | steady | steady | may rise |

## Reading the table

**Pit volume is the discriminator between losses and a kick.** Both reduce the standpipe pressure a little and both change the returns, and only one adds volume to the system.

**Standpipe pressure is the discriminator for a pack-off.** It is the only one of the three that RAISES it, and it raises it sharply.

**Torque and drag confirms a pack-off**, because it is the only one of the three with a mechanical component.

## Why the standpipe pressure falls for both losses and a kick

**Losses:** part of the circuit now has a shorter path to a lower pressure, so less friction is being paid for.

**A kick:** the influx is lighter than mud, so the annulus column is lighter, so less pressure is needed to push it up. That is a subtle effect and it is why a small gas kick shows in the pit volume before it shows in the pressure.

## The one that all three share

Something has changed and nothing on the rig floor was changed. That is the trigger for looking at the table at all.

## What the hydraulics model contributes

The BASELINE. Every one of those observations is a departure from an expected value, and the expected value comes from a calculation.

A rig with no computed pump pressure has to detect a change against a remembered one, which is slower and less reliable.

## The habit

Compute the pump pressure at the current depth and flow rate, and compare it against the gauge. Do it often enough that the two are always close, so that a departure is visible immediately.

That is the same habit the torque and drag course asks for with hookloads, and for the same reason.

## Exercise

For each of the three events, write down which single observation you would check first and why.

Then say what you would conclude from a rising standpipe pressure with a steady pit volume and steady torque, which is none of the three.
