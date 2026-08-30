# The wear factor

The empirical constant, its units, and what moves it.

{{panel:td-buckling-explorer}}

## The units

    mm3 per kN.m

Volume of casing removed per unit of contact force per unit of sliding distance.

In SI that is 1e-12 m3 per N.m, which is the conversion the engine applies. Getting that conversion wrong by a factor of a thousand is the classic error in this calculation, and it produces answers that are obviously absurd, which is the good kind of error.

## The values

Typical wear factors run from about 0.5 to 10 mm3/kN.m. This course uses 2, which is a mid-range value for a hardbanded tool joint against casing with a reasonable mud.

The range is a factor of twenty, and the answer is proportional to it in VOLUME, so the wear factor is by far the largest uncertainty in the calculation.

## What moves it

**Hardbanding.** Tungsten carbide hardbanding on the tool joint protects the joint and can destroy the casing; modern casing-friendly hardbanding materials are chosen specifically to give a low wear factor against steel.

**Mud type and solids.** Solids in the mud act as an abrasive slurry between the two surfaces. A clean oil-based mud gives a lower factor than a dirty water-based one.

**Contact pressure.** The linear model assumes the factor is constant. In reality it rises at high contact pressure, where the contact transitions from mild wear to a more aggressive regime.

**Casing grade and hardness.** Harder casing wears more slowly against the same joint.

## The sensitivity

On this course's case, at 50 hours and 120 rpm:

| wear factor | worst depth | worst wall loss |
|---|---|---|
| 1 mm3/kN.m | 2.1282387760018993 mm | 17.75189156547694 percent |
| 2 mm3/kN.m | 3.4259056218767463 mm | 28.575884341024505 percent |
| 5 mm3/kN.m | 6.510297887690423 mm | 54.30316535174848 percent |

The full plausible range of 0.5 to 10 spans from a couple of percent to essentially the whole wall.

## How it is actually obtained

By running a joint against a casing sample in a laboratory rig under controlled load and speed, and measuring the volume removed. That gives a number for that pair of materials in that mud.

It is a real measurement, unlike the friction factor, and it is a measurement made in a laboratory rather than in a well.

## The honest position

A casing wear prediction is a torque and drag answer, which is good, multiplied by a laboratory constant applied outside the conditions it was measured in, which is not.

So the prediction's VALUE is soft and its SHAPE is reliable: it tells you which joint is worst and by how much relative to the others, more confidently than it tells you the millimetres.

## Exercise

Compute the worst wall loss at a wear factor of 0.5 and at 10 mm3/kN.m using the panel.

Then say which of the two, the depth or the wall-loss percentage, you would put in front of a casing engineer, and why the choice matters.
