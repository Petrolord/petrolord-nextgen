# What drilling a hole does

Removing rock does not remove the load it was carrying.

{{panel:gm-stability-explorer}}

## Before the bit arrives

The rock at 2500 m is carrying an overburden of 56388237.49999999 Pa, a maximum horizontal stress of 48475574.40277777 Pa and a minimum horizontal stress of 44569324.402777776 Pa, with a pore pressure of 28880584.25 Pa in its pore space.

Every element is in equilibrium with its neighbours. Nothing is moving.

## What the bit does

It removes a cylinder of rock and replaces it with mud.

The load that cylinder was carrying does not disappear. It has to be carried by something, and the only candidate is the rock immediately around the hole.

## The consequence

The stresses concentrate. The rock at the wall now carries what it was carrying before PLUS what the removed cylinder used to carry, redistributed around the circumference.

That concentration is the entire subject. A hole is a stress raiser, and drilling one is an act of loading the rock, not of relieving it.

## How much concentration

For a circular hole in a uniform far field, the classic answer is a factor of three on the difference. The hoop stress at the wall runs from three times the smaller far-field stress less the larger, up to three times the larger less the smaller.

With this depth's horizontal stresses that is a range from 27471230.30555556 Pa to 43096230.30555553 Pa of effective hoop stress, from a far field whose two horizontal stresses differ by only 3906250 Pa.

The amplification is exactly four: the wall range is 15625000 Pa wide, which is four times the far-field difference. That factor of four falls straight out of the Kirsch form, and it is why a modest stress anisotropy makes such a difference to a hole.

## Why the mud helps

The mud pushes back. It supplies a radial stress at the wall equal to the difference between the well pressure and the pore pressure, and it reduces the hoop stress by the same amount.

So a heavier mud lifts the smallest wall stress and lowers the largest, closing the gap that breaks the rock. That is the mechanism, and it has a limit: keep going and the hoop stress goes into tension.

## The three stresses at the wall

**Hoop**, around the circumference. **Axial**, along the hole. **Radial**, outward, which is just the mud.

Everything in this tier is those three, evaluated at every angle round the hole, compared against two failure criteria.

## Exercise

Compute three times the effective Shmin less the effective SHmax at 2500 m, and then three times the effective SHmax less the effective Shmin.

Then say what fraction of the second is the first, and compare that against the ratio of the two far-field stresses.
