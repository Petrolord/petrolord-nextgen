# The mud is the radial stress

The one term the driller sets, and both things it does.

{{panel:gm-stability-explorer}}

## The single lever

Of everything in the wall stress calculation, exactly one quantity is under anybody's control at the time of drilling: the pressure in the hole.

The stresses are what they are. The rock strength is what it is. The trajectory was fixed before the section was drilled. The mud weight is the lever.

## What it does, twice

**It raises the radial stress.** Directly, one for one: the radial effective stress at the wall IS the well pressure less the pore pressure.

**It lowers the hoop stress.** Also one for one, because the differential pressure enters the hoop formula with a minus sign.

## Why that gives a factor of one plus q

The Mohr-Coulomb criterion compares the largest effective principal stress against q times the smallest, plus the strength.

At low mud weights the hoop stress is the largest and the radial is the smallest. Raise the well pressure by one unit and the largest falls by one while the smallest rises by one, so the quantity

    sigma1 - q x sigma3

falls by 1 + q per unit of pressure.

That is why a small increase in mud weight has such a large stabilising effect: with a friction angle of 32 degrees, q is 3.254588303299863 and every megapascal of extra mud weight buys 4.254588303299863 megapascals of margin against collapse.

## The other end

The fracture criterion watches the SMALLEST wall stress, which is the hoop stress at its dip.

That one falls one for one with the well pressure, with no amplification. So the collapse margin improves at 1 + q per unit while the fracture margin worsens at 1 per unit.

The window is asymmetric for that reason: a heavy mud is a strong medicine against collapse and a mild poison against fracture.

## What it cannot do

**It cannot change which angle fails.** The peak and the dip stay where the stress field and the trajectory put them.

**It cannot fix a hole that is failing for a reason other than pressure.** Chemical instability in a reactive shale, bedding-plane slip, and time-dependent creep all look like collapse and none of them responds to mud weight the way this model predicts.

## Why the window is quoted as a mud weight

Because it is a bound on this one lever. Everything else in the model is a description of the situation; the mud weight is the decision.

## Exercise

At 2500 m with a friction angle of 32 degrees, compute how much the Mohr-Coulomb margin improves per megapascal of extra mud pressure.

Then say what the same figure would be in a rock with a friction angle of 20 degrees, and what that implies about drilling shale.
