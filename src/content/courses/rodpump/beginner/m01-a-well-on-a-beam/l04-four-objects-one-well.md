# Four objects, one well

Every number in a rod pump design belongs to exactly one of four objects, and naming the owner is most of what this tier is for.

{{panel:pd-string-explorer}}

## The four

| Object | What it is | What it owns |
| --- | --- | --- |
| the string | `rodString.js` | a compliance sum, Archimedes, a stepped bar eigenvalue |
| the linkage | `pumpingUnit.js` | a four-bar closure and the torque factor from differentiating it |
| the pump | `rodPumpDesign` | fluid load, plunger area, displacement, the groups and the Goodman check |
| the card | `rodDynamics.js` | a marched wave equation, and harmonics propagated from a measured card |

## Three numbers each

The string, on the published taper: buoyed weight 8673.757962 lb, spring rate 267.091373 lb/in, fundamental 53.362124 spm. The linkage, on the published unit: stroke 106.687717 in, largest torque factor 56.305307 in, upstroke fraction 0.544444. The pump, on the teaching well ODUMA-4: fluid load 4690.299657 lb, plunger area 2.405282 in2, rated displacement 380.874258 bbl/d.

The card owns everything the string, the linkage and the pump do not. The plunger stroke, both polished rod loads, the card area, the horsepower, the tension envelope, and every warning about them.

## The seam

Nothing in the first three objects needs a march. A compliance sum, a buoyancy factor, an eigenvalue, a four-bar closure, a differential times an area and a volume per stroke are closed form and timeless: they are the same at 5 spm and at 15 spm, at full barrel and at half. Everything the fourth object owns is different at every speed, and different again at a different node count.

That seam is why the three tiers are cut where they are.

## What no object owns alone

One function joins them. It takes the string, the unit, the pump and the fluid, calls the card solver internally, and returns a design. Because it holds the join, it is also the only place that can refuse a design for a reason that belongs to two objects at once: a speed is refused because it stands against the string's fundamental, not against anything the speed alone says.

## The mistake

Quoting the pump's rated displacement as production. On ODUMA-4 that number is 380.874258 bbl/d, and it is computed on the surface stroke of the linkage. The plunger never sees the surface stroke, and how much shorter its own travel is belongs to the fourth object.

## Exercise

Write out the nine numbers named here and label each one with its owning object.

Then say which object a polished rod horsepower belongs to, and name the one input it needs that none of the other three objects require.
