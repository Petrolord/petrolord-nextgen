# A bubble at Reynolds twenty

The Associate tier put a careful band around Stokes law and warned outside it. A flotation bubble is outside it, comfortably, and the model knows that before it starts.

{{panel:pw-device-explorer}}

## Why the settling law changes

Stokes law is the creeping flow balance. It holds while the Reynolds number of the rising object is small, and this module states it to a Reynolds number of 1 and warns above.

A 400 micron gas bubble in this water rises at 0.055485861717 m/s, which is a Reynolds number of 41.641016. It is tens of times outside the band, so the module computes the bubble rise from the FULL DRAG BALANCE instead, which solves the same force balance with a drag coefficient that keeps working as the Reynolds number climbs.

Notice what did not happen. The module did not apply Stokes and attach a warning. It used the method that is honest at these conditions, and it reports the Reynolds number so a reader can see which regime the bubble is in.

## The bubbles this module will describe

| bubble micron | rise m/s | Reynolds |
| --- | --- | --- |
| 40 | 0.001578813252 | 0.118487 |
| 80 | 0.005753723776 | 0.863611 |
| 150 | 0.016130502524 | 4.539606 |
| 300 | 0.040291028009 | 22.678201 |
| 600 | 0.083507115328 | 94.005599 |
| 1200 | 0.156122973645 | 351.501391 |

The module's default bubble of 300 micron sits at a Reynolds number of 22.678201, which is where this lesson's title comes from. The two smallest bubbles in the table are inside the creeping flow band, and every bubble from 150 micron up is outside it.

There is a second reading of that table. The Reynolds number climbs much faster than the bubble diameter does, because it carries both the size and the velocity the size produced. So a model that was tuned on fine bubbles and applied to coarse ones has moved much further from its origin than the bubble diameter alone suggests.

## Where the bubble rise velocity is used

The rise velocity is not an output a reader looks at for its own sake. It does one job in the chain.

It sets the HOLDUP, which is the superficial gas velocity divided by the bubble rise velocity, and holdup is the subject of the next lesson.

It does NOT reach the cut size. A faster bubble sweeps more water per second, and at the same gas flux the cell holds fewer bubbles, by the same factor, so the two cancel and the rate carries the gas flux and the bubble diameter alone. Across these six bubbles the rise velocity moves by a factor of 98.886283, and the cut on the same six, tabled in the lesson on interception, still goes as the bubble diameter to the three halves every time.

## The discipline underneath

A model that used one settling law everywhere would be wrong here by a large factor and would say nothing about it. This one carries two routes, states the band each is honest in, and reports the Reynolds number of every object it moves, whether that object is an oil droplet or a gas bubble.

The useful question about any velocity a model hands you is not whether the number looks plausible. It is which law produced it and whether the conditions are inside the band that law is stated to.

## Exercise

Read the Reynolds column and say which rows of the table this module would be entitled to use Stokes law on.

Then explain, in one sentence, why the module reports the Reynolds number of the bubble alongside its rise velocity.
