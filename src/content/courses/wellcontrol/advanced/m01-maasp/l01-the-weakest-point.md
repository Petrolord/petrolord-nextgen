# The weakest point

Where a well breaks, and why it is not the deepest part.

{{panel:wc-tolerance-explorer}}

## The candidates

Two things can fail under pressure during a kill: the casing and the open hole.

The casing is steel with a burst rating, and it is strong. The open hole is rock, and the rock's strength is its fracture gradient.

## Why the shoe

The casing shoe is the shallowest point of open hole. Everything below it is deeper, and deeper rock has a higher fracture pressure because it carries more overburden.

So the shallowest exposed rock is the weakest, and that is immediately below the casing shoe.

## The exception

A depleted zone deeper in the hole, whose pore pressure has been produced down and whose fracture gradient has fallen with it.

That is a real and common case, and it means the weakest point is not always the shoe. Every calculation in this module takes the shoe as the weakest point because that is the standard assumption, and a well with a depleted interval needs the check made at that depth instead.

## What that means for the calculation

The shoe's true vertical depth and the fracture gradient there are the two inputs. Everything else about the open hole below it does not enter.

## The two wells

| well | shoe TVD | bit TVD | gap |
|---|---|---|---|
| slant | 1282.248590311 m | 2507.919699301 m | 1225.671108990 m |
| horizontal | 1172.343525979 m | 1214.859173174 m | 42.515647195 m |

That gap is the single most important number in this module. It is how much true vertical depth of mud stands between the weakest point and the bottom of the hole.

## Why the gap matters

Because an influx that has been circulated up to the shoe has traded the mud column over that gap for its own much lighter column.

A big gap means a big trade and a big pressure rise at the shoe. A small gap means almost none.

That is the whole reason the two wells behave so differently, and the next module computes it.

## The number this module produces

MAASP: the maximum allowable annular surface pressure. The most the casing gauge may read before the shoe is at its fracture pressure.

## Exercise

For each of the two wells, compute the mud hydrostatic pressure at the shoe with 1440 kg/m3 mud.

Then compute the fracture pressure at the shoe at 1750 kg/m3 equivalent, and take the difference. That difference is what the next lesson is about.
