# Why inject at all

A waterflood is the most common thing an oil field does after primary depletion, and it is routinely described in one sentence: we inject water to push the oil out. That sentence is half the story, and the missing half is where most waterflood arguments come from. Water does two jobs. It holds reservoir pressure up, and it displaces oil along. Those jobs are separate, they are measured by different numbers, and a flood can be doing one of them well while failing at the other.

## The pressure job

An undersaturated oil reservoir produces by expansion. Oil, connate water and rock all expand very slightly as pressure falls, and that expansion is what pushes fluid to the wellbore. The compressibilities involved are tiny. For the Ekene sand the design oil compressibility is $1.2 \times 10^{-5}$ per psi and the formation compressibility is $4 \times 10^{-6}$ per psi, so recovering a fraction of a percent of the oil in place costs hundreds of psi of pressure.

That is a losing arithmetic if you let it run. Fall below the bubble point and dissolved gas comes out of solution, the oil viscosity rises, gas takes flow capacity away from the oil, and the well starts producing the field's energy instead of its oil. Ekene's bubble point is 2000 psia and its initial pressure was 3200 psia, so three years of primary production had already spent about a third of the available margin.

Injecting water replaces the volume that has been taken out. The reservoir does not care what fluid occupies the pore space; it cares whether the space is full. Put a reservoir barrel back for every reservoir barrel removed and the pressure stops falling. That is the pressure job, and voidage replacement is exactly the measurement of it. It is the subject of this whole tier.

## The displacement job

The second job is different in kind. Even at perfectly held pressure, oil only leaves the rock if something physically pushes it out of the pores, and water is a poor pusher in ways that depend on the rock, the wettability, the viscosities, and the geometry of the flood. A waterflood at a flawless voidage replacement ratio can still leave most of the oil behind if the water finds a fast path and runs down it.

That is displacement and sweep, and it is where the SCAL and Displacement course lives. This course imports its answers rather than re-deriving them. When we need the fraction of oil a water front removes from the rock it passes through, we take the number the fractional flow engine produced, and we spend our effort on what happens when that idealized front meets a real field with real wells in real places.

## The two jobs can disagree

Here is the case that makes the distinction concrete, and it is the case this whole course builds toward. Over three years the Ekene field replaced 1.034899536109 reservoir barrels of voidage for every barrel it produced. Read as a pressure statement that is a healthy flood: pressure was maintained, slightly more than maintained. Read as a displacement statement it says nothing at all, because it does not know where the water went. When the Professional tier splits that same number by which producer the injection actually supported, one half of the field sits at 1.2024353717815623 and the other at 0.6097477559533482. The field average was never wrong. It was answering a different question than the one people were asking of it.

## A worked orientation

Take Ekene's first flood month, January 2023. The field produced 4727.034315745669 stock tank barrels of oil and no water, and injected 4789.431168713511 barrels of water. On the raw counts injection exceeds production, which looks like more than replacement.

It is not. Oil at reservoir conditions occupies more space than it does in the tank, because dissolved gas is still in it. At the Ekene ledger's oil formation volume factor of 1.21584 reservoir barrels per stock tank barrel, that oil occupied

$$4727.034315745669 \times 1.21584 = 5747.317402456214 \text{ rb}$$

while the injected water, at a water formation volume factor of 1.02, occupied

$$4789.431168713511 \times 1.02 = 4885.219792087782 \text{ rb}$$

The flood replaced 4885 of the 5747 reservoir barrels it removed. The ratio is 0.85, which is not an accident: it is exactly the target the flood was designed to hit that month, and the next lesson explains why anyone would deliberately under-inject at start-up. The point here is narrower. Counting barrels at the surface got the sign of the answer wrong. Everything in the next module exists to stop that happening.

## The misconception to avoid

The phrase "voidage replacement ratio" invites people to read it as a recovery statement, as though a VRR of one meant the flood was working. It is a pressure statement and only a pressure statement. A field can hold a VRR of one for a decade while cycling water through a thief zone and recovering almost nothing extra. The number is necessary and it is nowhere near sufficient, and an engineer who treats it as a report card rather than a single instrument reading will be surprised by their own field.

## Exercise

First, in your own words, write two sentences: one describing a failure mode where the pressure job succeeds and the displacement job fails, and one describing the reverse. For each, name the observable that would reveal it.

Second, repeat the January 2023 arithmetic above but assume someone mistakenly used a formation volume factor of 1.0 for both fluids, as though reservoir and surface volumes were the same. Compute the ratio they would report, and state whether their error makes the flood look healthier or sicker than it was.
