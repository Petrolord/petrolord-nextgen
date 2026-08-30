# Initial circulating pressure

The first number on the schedule, and why it is a sum.

{{panel:wc-killsheet-explorer}}

## The expression

    ICP = slow circulating rate pressure + SIDPP

Exactly. No scaling, no correction, no rounding.

## Why

Because at the start of the circulation the string is full of ORIGINAL mud, exactly as it was when the well was shut in.

The pressure needed at surface to hold the bottom hole pressure at the formation pressure with static mud is the SIDPP. Add the friction of circulating at the chosen rate, which is the slow circulating rate pressure, and you have what the gauge should read once the pump is up.

## The numbers

| well | scenario | SCR pressure | SIDPP | ICP |
|---|---|---|---|---|
| horizontal | moderate | 4500000 | 2000000 | 6500000 |
| horizontal | small | 4500000 | 800000 | 5300000 |
| slant | moderate | 4500000 | 2000000 | 6500000 |
| slant | small | 4500000 | 800000 | 5300000 |

Read across. The ICP is the same on both wells for the same scenario, because it depends only on the two pressures and not on the geometry at all.

That is worth noticing: it is the one number in the kill sheet that does not care which well it is.

## How it is used

As a CHECK. Bring the pump up to the slow circulating rate while holding the casing pressure constant, then read the drill pipe gauge.

If it reads the computed ICP, everything is consistent: the mud weight is what you think, the SIDPP was read correctly, and the slow circulating rate pressure is current.

If it does not, something in that list is wrong, and finding out which before proceeding is worth the minute it takes.

## The commonest reason it does not match

A stale slow circulating rate pressure. It is a measurement and it drifts with the mud, the bit and the depth, and it is the input most likely to be out of date.

## What to do about a mismatch

Use the OBSERVED value rather than the computed one, and recompute the final circulating pressure from it by the same scaling.

The observed pressure is a measurement of the actual system; the computed one is a measurement of the system as it was when somebody last checked.

## Exercise

If the observed ICP is 6.7 MPa instead of the computed 6.5, work out what the actual slow circulating rate pressure must be.

Then recompute the final circulating pressure for the horizontal well's moderate scenario, and say how much the whole schedule shifts.
