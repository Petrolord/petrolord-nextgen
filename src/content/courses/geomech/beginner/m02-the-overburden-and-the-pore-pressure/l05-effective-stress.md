# Effective stress

The idea the whole subject runs on.

{{panel:gm-stress-explorer}}

## The statement

Rock deformation and rock failure depend on the stress carried by the grain framework, not on the total stress.

    effective stress = total stress - alpha x pore pressure

The coefficient alpha is the Biot coefficient, and this engine's published runs use 1.

## Why it is true

A grain surrounded by fluid at pressure feels that pressure from every side. Uniform pressure on all sides does not distort it: it compresses it slightly and does nothing else.

What distorts and eventually breaks a rock is the DIFFERENCE between the loads on different faces, and the pore pressure subtracts equally from every direction. So it cancels out of the differences and leaves the failure behaviour to the effective stresses.

## The Biot coefficient

A correction for the fact that a real rock is not a bag of incompressible grains. It runs between zero and one, and it is closer to one for a soft high-porosity rock and further below one for a stiff low-porosity one.

Setting it to 1 is the conservative and conventional choice when it has not been measured. This course's capstone runs 0.9 so that the effect is visible in a graded number.

## What it does to this profile

| depth | total overburden | pore pressure | effective |
|---|---|---|---|
| 1000 m | 22555295 Pa | 10100849.5 Pa | 12454445.5 Pa |
| 2000 m | 45110590 Pa | 22015929.25 Pa | 23094660.75 Pa |
| 2600 m | 58643766.99999999 Pa | 30253515.25 Pa | 28390251.749999993 Pa |

The effective stress roughly doubles from 1000 m to 2000 m and then adds only about a fifth more over the next 600 m, because the pore pressure ramp is eating the increase.

## Where it appears in this course

**In the horizontal stress estimate**, which multiplies the effective vertical stress by a ratio and adds the pore pressure back.

**In the frictional bounds**, which are limits on the RATIO of two effective stresses.

**At the wall of the hole**, where every stress in the failure criteria is an effective one.

**In the failure criterion itself**, where the Mohr-Coulomb line relates the largest effective principal stress to the smallest.

## The sign convention

This course takes compression as positive, which is standard in rock mechanics and the opposite of the convention in structural engineering.

So a large positive effective stress means strongly compressed, and a negative one means in tension. Tension at the wall of a hole is exactly what the fracture initiation criterion is looking for.

## Exercise

At 2000 m, compute the effective vertical, effective SHmax and effective Shmin using a Biot coefficient of 1, then again using 0.9.

Then say which of the three changes most in absolute terms, and which changes most as a fraction of itself.
