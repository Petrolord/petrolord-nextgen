# A programme is a list of activities

The whole model is an ordered list, and the order is load bearing.

{{panel:wc-time-explorer}}

## The unit of the model

There is no concept of a section, a phase or a run in this engine. There is one unit: the activity. A programme is an array of them, and the engine walks that array once, front to back, keeping a running clock and a running hole depth.

## The golden programme

| Activity | Kind | Productive hours |
| --- | --- | --- |
| Rig move and spud | flat | 24 |
| Drill 26in surface hole | drill | 20 |
| Run and cement 20in casing | casing | 12 |
| Drill 17.5in intermediate hole | drill | 100 |
| Round trip at 2000 m | trip | 8 |
| Run and cement 13-3/8in casing | casing | 24 |
| Drill 12.25in production hole | drill | 100 |
| Round trip at TD | trip | 12 |
| Run and cement 9-5/8in casing | casing | 24 |
| Completion and handover | flat | 60 |

Ten activities, 384 productive hours, 3,000 m of hole.

## Why the order matters

Two reasons.

The first is the clock. Each activity starts where the previous one ended, so the start and end hours of every activity depend on everything above it. Add ten hours to the surface hole and the completion moves ten hours later.

The second is the hole. Depth is a state the engine carries forward, and a drill activity must begin at the depth the hole has actually reached. Write a drill activity from 2,000 m when the hole is at 500 m and the engine stops with an error naming both depths. It will not silently create 1,500 m of hole that nobody drilled.

## What the walk produces

The walk gives a row per activity with its start hour, end hour, productive hours, stretched duration and drilled depth, plus a curve of eleven points: one at spud and one per activity.

That curve is the drilling curve, and everything later in this course reads off it.

## Exercise

In the panel, move the completion activity from the end of the programme to the middle and confirm that the total hours do not change.

Then move the 17.5in drill activity above the 20in casing activity and record the exact error the engine raises.

Finally, count how many of the eleven curve points sit at a depth the hole had already reached.
