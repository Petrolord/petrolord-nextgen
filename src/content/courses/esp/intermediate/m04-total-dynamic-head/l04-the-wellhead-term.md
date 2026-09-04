# The wellhead term

The wellhead pressure has to be paid in feet, and the exchange rate is the fluid.

{{panel:pd-lift-explorer}}

## One division, four answers

The wellhead pressure divided by the gradient of the fluid inside the pump is the third part of the head.

| Case | Wellhead pressure, psia | Gradient, psi/ft | Wellhead term, ft | Share of the head |
| --- | --- | --- | --- | --- |
| gassyOffshore | 400.0 | 0.3736183828 | 1070.611133 | 21.5054 percent |
| highWaterCut | 30.0 | 0.4392779296 | 68.293893 | 1.7986 percent |
| QUA-IBOE-4 | 220.0 | 0.3095094152 | 710.802286 | 17.6282 percent |
| IBENO-2 | 180.0 | 0.4206373262 | 427.922081 | 59.0164 percent |

Each of those wellhead pressures is a teaching input, supplied so the three part split can be shown. They are not fields the golden cases carry, and a number written to make a report legible is not the same kind of thing as a number a case was cut on.

## Light fluid, expensive wellhead

The same pressure buys more feet in a lighter fluid, because a foot of it weighs less. QUA-IBOE-4 has the lightest of the four at 0.3095094152 psi/ft, and its 220.0 psia is worth 710.802286 ft. IBENO-2 carries 0.4206373262 psi/ft, and its 180.0 psia is worth 427.922081 ft.

That is why the term is expressed in feet at all. The pump makes head, not pressure, so everything crossing into the stage curve has to be converted at the gradient of what is actually inside the pump.

## Where it dominates

On IBENO-2 the wellhead term is 59.0164 percent of the requirement, larger than the net lift at 28.9634 percent and the friction at 12.0202 percent put together. A short lift with a live wellhead is a well where most of the pump is pushing into the flowline.

On highWaterCut the same term is 1.7986 percent, because 30.0 psia in a fluid at 0.4392779296 psi/ft is 68.293893 ft against a requirement of 3797.140461 ft.

## The mistake

Two of them, both units. The first is a gauge pressure: every pressure in this chain is psia, and a wellhead quoted in gauge shifts the term by an atmosphere nobody wrote down. The second is converting the wellhead pressure at the gradient of the whole stream rather than of the pumped fluid. Where a separator has taken gas out, those differ: on gassyOffshore the pumped fluid is heavier by 0.0226698733 psi/ft, so the same wellhead pressure is worth fewer feet than the stream gradient suggests.

## What it refuses

The wellhead pressure is an input. This module has no flowline, no choke and no separator pressure in it, so it cannot tell you whether 400.0 psia is the right thing to be designing against, nor that a wellhead pressure and a discharge pressure you supplied are inconsistent with each other. It converts the number you give it, at the gradient you give it, and stops.

## Exercise

Divide each wellhead pressure in the panel by its own gradient and check the four terms.

Then take the highest wellhead pressure of the four and say why it does not produce the largest share.
