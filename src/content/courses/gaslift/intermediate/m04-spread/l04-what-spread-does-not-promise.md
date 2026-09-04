# What spread does not promise

Spread as this module returns it is a statement about an injection operated valve. On a production operated string the number that comes back is not a narrow interval, it is the wrong question answered without hesitation.

{{panel:pd-valve-explorer}}

## The sign is the tell

`valveSpread` returns R times the opening side pressure less the other side. For a production operated valve it is handed the production pressure as the opening side and the casing as the other side, and on such a well the casing sits far above the tubing. Every valve of the published constantPressurePPO case therefore reports a negative number: -52.249540846, -45.958644888, -40.534581117, -35.856877306, -31.822047314 and -31.296561503 psi.

A pressure interval a valve stays open across cannot be negative. The sign alone settles it, before any stage table is opened.

## The same string, run both ways

Teaching well AKASO-3 is a teaching construct, not a published case, and no oracle has checked it. It exists so one string can be run as either family. Run as an IPO string it reports a valve 1 spread of 48.150321911 psi and a valve 5 spread of 18.078172618 psi. Run as a PPO string on the same depths, the same 0.25 in port and the same R of 0.063749851, valve 1 reports -48.150321911 psi and valve 5 reports -18.078172618 psi.

Equal magnitude, opposite sign. Nothing physical changed at either valve. The sign is carrying the order of two arguments and nothing else.

## Where the limit sits

That swapped pair is a pinned known divergence in the design module, and it drives the closing test on a PPO string as well. Spread is the quieter half of it and the easier half to see, needing no stages and no unloading sequence: one glance at the sign of a valve table says whether the family and the acting fluid agree. Nobody raised it.

So on a production operated string, do not read spread as a valve property, do not set it against a decrement, and do not use its magnitude to justify anything.

## The mistake

Reading -31.296561503 psi as the tightest valve in the string and specifying a larger port to widen it. That would change R, the dome and the closing pressure of a valve whose reported spread was never a measurement of the valve.

## What it refuses even when the sign is right

A positive spread is a pressure interval at the design condition. It does not say the valve passes what the well needs while open, it does not know that a real valve throttles on its stem, and both of its pressures come off a shut in gas column.

## Exercise

Read the spread of all six valves of constantPressurePPO and record the sign on each.

Then say what you would check on any valve table before quoting a spread out of it.
