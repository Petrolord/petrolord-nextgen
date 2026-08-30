# Rotating while you trip

The trade, its exchange rate, and when to take it.

{{panel:td-string-explorer}}

## The trade

Rotating while tripping moves friction out of the axial direction and into the tangential one. The hookload falls and the torque rises.

On the build-and-hold well, coming out of the hole:

| operation | hookload | torque |
|---|---|---|
| pick up, no rotation | 1063113.0483217717 N | 0 |
| back ream at 120 rpm | 755998.6171861527 N | 27066.488567454348 N.m |

307114.43113561894 N of hookload traded for 27066.488567454348 N.m of torque.

## The exchange rate

Divide: 11.346666944632915 N of hookload per N.m of torque on this well.

That number is not a constant. It depends on the ratio of trip speed to tool joint surface speed, which the driller sets, and on where the side force sits in the well.

## Which side of the trade you want

**Take it if the derrick or the pipe's tensile capacity is the constraint.** On a deep well with a heavy string, or when pulling on a string that is starting to stick, converting drag into torque buys margin where you need it.

**Refuse it if the top drive or the pipe's torsional capacity is the constraint.** On a long horizontal well the pipe is already close to its torsional limit and nowhere near its tensile one, and adding torque there is the wrong direction.

That second case is the common one on extended reach wells, and it is why back reaming a long lateral is not the free lunch it looks like.

## The rate you pull at

The share depends on `va / vt`. Pull slower and the axial share falls, so more of the friction goes into torque and the hookload falls further.

| trip speed | fa | ft |
|---|---|---|
| 0.1 m/s | 0.0942 | 0.9956 |
| 0.3 m/s | 0.2730 | 0.9620 |
| 0.6 m/s | 0.4935 | 0.8697 |

So back reaming slowly maximises the drag reduction. It also takes longer, and time on a rig is the other currency.

## The risks the model does not price

**Packing off.** Back reaming stirs cuttings into the annulus. If the hole is dirty, the annulus can pack off around the bottom hole assembly, and that is a much worse problem than the drag was.

**Casing wear.** Every rotating hour against the casing takes metal off it, and back reaming through casing is rotating hours with a high side force. The Expert tier computes it.

**Hole damage.** In soft or unconsolidated formations, rotating a stabiliser past the same interval repeatedly enlarges it.

## The rule

Rotate while tripping when the axial load is the problem, at the slowest speed the schedule allows, and only in a hole you believe is clean.

## Exercise

Compute the exchange rate, hookload newtons per newton-metre of torque, for all five wells by comparing pick up against back ream.

Then say which well gives the best exchange rate and whether that is the well you would most want to use it on.
