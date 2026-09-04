# What a plunger does

A plunger is a solid interface dropped down the tubing so the gas below stops blowing through the liquid it is meant to push. The engine models it as a static force balance and a stopwatch.

{{panel:pd-profile-explorer}}

## One trip, one slug

The teaching well OGUTA-2 is 8200.0 ft of 2.441 in tubing, cross-section 4.6797800340 in2, carrying a 160.0 ft slug of 1.060 SG liquid ahead of an 8.20 lb plunger, with a line pressure of 145.0 psia and a casing pressure of 720.0 psia. It is a teaching construct, not a published case and not a real well.

A trip lifts 0.9261160790 bbl. That is the slug and nothing else: length times area, converted at 5.614583 ft3/bbl. Length and volume are exact inverses here, worth checking once on the published case, where a 200.0 ft slug gives 1.1576450988 bbl and that volume gives back 200.0000000000 ft.

## The cycle is four times added up

| Phase | Minutes |
| --- | --- |
| rise | 10.93333333 |
| fall | 8.97023256 |
| afterflow | 30.0 |
| shut-in | 40.0 |
| total | 89.90356589 |

The rise is 8200.0 ft at 750.0 ft/min. The fall is split, 1000.0 ft/min through gas and 172.0 ft/min through the liquid the plunger meets near the bottom. Afterflow and shut-in were typed in.

That total gives 16.01716223 cycles a day, so 16.01716223 trips of 0.9261160790 bbl come to 14.83375148 bbl/d, and the same cycle count spends 141.82807355 Mscf/d of gas.

## Five of those numbers were never computed

The rise speed, both fall speeds, the afterflow and the shut-in are operating inputs carrying stated typical bands. They are not computed, they are not optimised, and the published plunger case carries the same 750.0, 1000.0 and 172.0 ft/min because they are defaults rather than results.

So the liquid a plunger lifts in a day rests on the shut-in time, and the shut-in time was chosen by whoever filled the form.

## The mistake

Reading 14.83375148 bbl/d as what the well will produce on plunger lift. It is the capacity of a cycle you specified, at a slug length you specified, repeated as often as your times allow. Cut the shut-in to 20.0 min and drop the afterflow, and the same well and the same plunger deliver 33.42075135 bbl/d with nothing about the well changed.

## What it refuses

The balance is static. There is no velocity in it, no gas slipping past the plunger and no slug falling back during the rise, so the 10.93333333 min rise is a distance divided by a speed rather than a solved motion.

It also refuses malformed input rather than guessing. A zero plunger weight returns `ok = false` and "The plunger needs a weight." A zero slug returns "A cycle lifts a slug, so it needs a slug length."

## Exercise

Rebuild the OGUTA-2 cycle from its five timing inputs and check that the phases sum to 89.90356589 min.

Then say which single input you would have to defend before quoting 14.83375148 bbl/d, and why the depth is not it.
