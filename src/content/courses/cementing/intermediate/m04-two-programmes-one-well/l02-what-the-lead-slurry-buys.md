# What the lead slurry buys

Not mainly money, and the free-fall result is the proof.

{{panel:cm-placement-explorer}}

## The usual justification

A lead slurry is extended with water and extenders, so it is cheaper per cubic metre than a neat tail. On a job with a long lead section that is a real saving.

On THIS job the lead is 2.6713376091845076 of 25.123380942966243 cubic metres, about eleven percent. The saving is small.

## What it actually buys here

**Fifty five kilograms per cubic metre of peak circulating density at the previous shoe**, on the slant well: 1657.6738234800569 against 1712.1218125074865.

**Sixty two on the horizontal well**: 1652.9521977452723 against 1715.156233904509.

**And on the horizontal well it buys the difference between free falling and not.**

## The free-fall result, stated carefully

Same well. Same total slurry. Same rate. Same geometry.

With one heavy slurry: free fall at 24.891615007704534 cubic metres pumped, with a deficit of 104394.27505085245 Pa.

With a lighter lead across the cased annulus: no free fall anywhere, worst balance a positive 116697.07034800947 Pa.

The whole of the difference is a lighter fluid in 200 m of annulus.

## Why the mechanism is the annulus and not the inside

This is worth being careful about, because the intuition points the other way.

Free fall means the INSIDE column outweighs the annulus. The obvious fix is a lighter fluid inside. But the lead is in the ANNULUS at the moment that matters, and it makes the annulus HEAVIER than the mud it replaced, not lighter.

So the lead helps by adding to the side that was losing, not by subtracting from the side that was winning. A lead slurry heavier than the mud but lighter than the tail does both jobs at once: it is denser than the mud it displaces in the annulus, and it is lighter than the tail it replaces in the inside column while it is on its way down.

## The design rule that follows

The density hierarchy is not a rule about contamination alone. Mud, then spacer, then lead, then tail, each at least as dense as the one ahead, is also what keeps the annular column building steadily rather than in one step.

The engine checks it and warns:

    Density hierarchy: 'lead' (1560 kg/m3) is lighter than the fluid ahead of it (1500 kg/m3).

which on these programmes never fires, because 1440, 1500, 1560, 1900 is monotone.

## Exercise

The engine's hierarchy check skips fluids of kind `displacement`.

Say why, given that the displacement on this job is 1440 kg/m3 and the tail ahead of it is 1900.
