# Free fall

When the column falls faster than the pumps can fill behind it.

{{panel:cm-placement-explorer}}

## The condition

    uTubePa = annulus head + friction - inside head < 0

The inside column outweighs everything on the other side. Nothing at surface is holding it up, and it falls under its own weight.

## What actually happens in the field

The casing goes on vacuum below the falling interface. Surface pressure drops to zero, the pumps unload, and the fluid level inside the casing separates from the fluid the pumps are delivering.

The column falls at whatever rate the friction of the falling fluid allows, which is not the pump rate and is usually faster.

## What the engine does about it

Detects it, reports it, and refuses to model the transient.

    const freeFall = raw < -1;

and in the warnings:

    Free fall (U-tube) occurs during the job; the transient rate is not modeled,
    surface pressure reads zero over those steps.

That is exactly the right amount of honesty. The engine can tell you WHEN it happens and by how much the balance is negative. It cannot tell you the fall rate without a transient two-phase model, and it does not pretend to.

## Why it matters

**You lose control of the rate.** The whole of the next module is about choosing a pump rate to satisfy two competing constraints. During free fall the rate is set by physics rather than by the driller, and it is higher than planned.

**The annular velocity spikes.** A higher rate means a higher circulating density, at exactly the moment you were not watching for one.

**The returns stop matching.** Pumped volume and returned volume diverge while the level falls, which looks exactly like losing circulation to the formation. Distinguishing the two in real time is hard and getting it wrong is expensive.

**The plug can outrun the displacement.** In a severe case the top plug travels ahead of the fluid behind it.

## Where it happens on this course's wells

Once, on the HORIZONTAL well with the NEAT single-slurry programme, at 24.891615007704534 cubic metres pumped. One step out of 61, with the balance at minus 104394.27505085245 Pa.

The same well with a lead and tail does not free fall at all. Neither programme free falls on the slant well.

## Why a lighter lead prevents it

Because the free-fall condition is a comparison between the inside column and the annulus column. At the moment of the worst balance, the inside is full of heavy cement on its way down and the annulus is still mostly mud. Replacing part of that heavy cement with a lighter lead reduces the inside head directly.

## The vertical fixture free falls badly

The published vertical fixture has no rheology on any fluid, so its friction is zero and there is nothing at all to hold the column. It free falls over 50 of its 61 steps with a worst balance of minus 3636024.3799520545 Pa.

That is what a cement job looks like with the friction term switched off, and it is a useful thing to have seen.

## Exercise

At the worst step of the horizontal well's neat programme the balance is minus 104394.27505085245 Pa.

Say what the reported pump pressure is at that step, and what a driller watching the surface gauge would see.
