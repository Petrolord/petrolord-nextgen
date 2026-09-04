# Pore volumes to breakthrough

The one number in the carbonate model that is measured rather than derived.

{{panel:st-acid-explorer}}

## What it means

Take a core of the reservoir carbonate. Flood acid into one end at a chosen rate and temperature, and keep going until a wormhole breaks through the far end and the pressure drop collapses. Count how many of the core's own pore volumes of acid that took.

That count is the pore volumes to breakthrough. It is an efficiency measure: how much acid the rock demands per unit of volume wormholed through. Low is good.

## It is calibrated, not predicted

Nothing in the engine computes it. It is an input, and the published case uses 1.

That value is deliberately clean. Real cores under good conditions can approach it, but the number depends on acid strength, temperature, rock texture and, above all, injection rate. Vugular and fractured rock behave differently again.

The optimum injection rate is precisely the rate at which this number is smallest. Pump slower and the acid spends near the face and the count rises. Pump faster and the flow front outruns the instability and it rises again. Finding that minimum is laboratory work, and the engine takes its result as given.

Carry one habit out of this lesson: ask where the pore volumes to breakthrough came from before believing any carbonate design.

## The only knob there is

Look at where it sits in the formula. The pumped volume is divided by the pore volumes to breakthrough, and that quotient is the only place either of them appears.

The consequence is exact. Doubling the pore volumes to breakthrough is identical to halving the acid. The engine cannot tell the two apart, and neither can the well.

So the sweep across pumped volume is also a sweep across the calibration. Pumping 32 m3 at a breakthrough count of 1 gives precisely the same effective radius of 0.76 m as pumping 8 m3 into a rock whose count is one quarter of that. Everything else in the model is fixed geometry.

## What that should make you nervous about

An optimistic laboratory number makes a carbonate job look cheap in exactly the same way that pumping four times the acid would. A design that assumed 1 and met a rock that needed four times as much acid per pore volume delivers the radius you would have got from a quarter of the job.

## Exercise

First, in the panel, hold the pumped volume at 8 m3 and vary the pore volumes to breakthrough, and confirm that only the quotient matters.

Second, write one sentence stating what laboratory conditions you would insist were matched to the well before accepting a measured breakthrough count.
