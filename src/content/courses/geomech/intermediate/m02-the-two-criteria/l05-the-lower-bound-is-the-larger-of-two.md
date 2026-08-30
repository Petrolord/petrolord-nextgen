# The lower bound is the larger of two

Two candidates for the bottom of the window, and they swap.

{{panel:gm-stability-explorer}}

## The two candidates

**The collapse pressure**, from the shear failure criterion.

**The pore pressure**, because mud below the pore pressure lets formation fluid in and that is a kick.

The mud has to be above BOTH, so the lower bound is the larger of the two.

## Why it is not always the same one

Because they depend on completely different things.

The pore pressure is a property of the rock's fluid. The collapse pressure is a property of the rock's strength, the stress field and the hole's attitude.

Nothing forces one to be above the other, and in this course's fixtures both cases occur.

## The deep case: pore pressure binds

At 2500 m in this profile, the rock is strong: the UCS is 132798979.91564198 Pa. A vertical hole there collapses only at 318.0216274260011 kg/m3 of equivalent mud weight, which is below the density of water.

The pore pressure at that depth is about 1178 kg/m3. So the pore pressure wins by a wide margin, and the collapse criterion is irrelevant.

## The shallow case: collapse binds

Higher up the rock is much weaker. At 1000 m the UCS is 17028767.50224198 Pa, less than an eighth of the value at 2500 m, while the overburden has fallen only to a little over a third of it.

There the collapse pressure for a vertical hole is 1374.158459503409 kg/m3 of equivalent mud weight, against a pore pressure gradient of 1030. Stability rather than well control sets the floor, by well over 300 kg/m3.

## Why that distinction matters

Because the remedies are different.

**Pore pressure bound.** Raise the mud weight. Nothing else helps, and the amount needed is known precisely.

**Collapse bound.** Raise the mud weight, or change the trajectory, or improve the hole cleaning and reduce the time the section is open. Several levers, and the mud weight is not always the cheapest.

A report that gives a lower bound without saying which of the two produced it has withheld the information needed to act on it.

## What the engine reports

Both. Every row of the mud window walk carries a pore pressure equivalent mud weight and a collapse equivalent mud weight separately, and the lower bound is computed as the maximum of the two.

The Expert tier's window explorer plots all three so the crossover is visible.

## The upper bound has no such competition

Fracture initiation is the only candidate the engine considers. In practice the minimum horizontal stress or a lost-circulation pressure is often lower, and the previous lesson said so.

## Exercise

At 1000 m in this profile, use the panel to find the collapse pressure for a vertical hole and convert it to an equivalent mud weight.

Then compare it against the pore pressure gradient there and say which binds.
