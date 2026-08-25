# Where the peak actually sits

Every amplitude in this tier is read from a window around the top interface rather than from the top interface itself. This lesson shows what the window is compensating for: on thin beds the peak of the composite is not at the top of the bed, and the offset is large enough to move a pick.

## The measurement

For each trace, record where inside the search window the largest absolute value was found, expressed as a time relative to the top interface. Negative means early.

At 25 Hz:

| Thickness | Peak position |
| --- | --- |
| 2 ms | 6 ms early |
| 4 ms | 4 ms early |
| 6 ms | 4 ms early |
| 8 ms | 2 ms early |
| 10 ms | 2 ms early |
| 12 ms | 2 ms early |
| 14 to 20 ms | at the top interface |
| 22 ms | 2 ms late |
| 24 ms | 2 ms late |
| 26 ms and above | at the top interface |

At 40 Hz the same effect is smaller and shorter lived: 4 ms early at 2 ms thickness, 2 ms early at 4 and 6 ms, and at the top interface from 8 ms onward.

## Why the peak leaves the interface

The explanation is the antisymmetry established in module 2. The composite of an equal and opposite pair is antisymmetric about the **midpoint of the bed**, not about the top of it. Its peak and its trough sit at mirrored positions either side of that midpoint.

On a thick bed the midpoint is far from both interfaces and the two events are independent, so the peak sits on the top reflection where it belongs. As the bed thins, the midpoint moves up toward the top interface and the two halves of the composite start to interact. In the thin bed limit the composite becomes a single symmetric doublet centred on the midpoint, with its peak roughly 7 ms above the midpoint at 25 Hz. Since the midpoint is only $T/2$ below the top, the peak ends up earlier than the top interface by roughly $7 - T/2$ milliseconds, which is exactly the pattern in the table.

At 40 Hz the same offset from the midpoint is about 4.5 ms rather than 7, because it scales with the wavelet's own time scale and therefore inversely with frequency.

The 2 ms late readings at 22 and 24 ms have the mirror explanation. There the base reflection's side lobe is adding slightly more one sample below the top interface than at it, which pushes the maximum one sample down.

## What it costs a pick

An interpreter picking the peak of a thin bed is picking a time that is early. On this model at 25 Hz the error reaches 6 ms, which at 2000 m/s is 6 m of depth on a surface that is being mapped for structural closure.

Three features of the error make it worse than a random 6 ms.

It is **systematic**. Every thin part of the bed picks early by a similar amount, so the error does not average out over a map. It bends the surface.

It is **correlated with thickness**. The thinnest areas pick earliest. If the bed thins toward the flanks of a structure, the flanks lift and the closure grows. The map develops a structure that follows the isopach rather than the geology.

It is **invisible on the section**. Nothing about the trace announces that its peak is 6 ms early. The event looks clean.

## The defence

Pick the **zero crossing** rather than the peak where thin beds are in play. Module 2 showed that the composite passes through exactly zero at the bed midpoint for every thickness, which makes the zero crossing the one feature whose position is known analytically. It is not at the top of the bed, but it is at a known distance from it, half the bed thickness, and it does not drift.

Where a peak pick is unavoidable, quote the bed thickness with the pick and state the expected bias. A pick reported as *top sand, peak pick, bed near 6 ms, expect 4 ms early at this bandwidth* is a usable pick. The same pick reported as a time alone is not.

## Worked example

The model at 25 Hz and 4 ms thickness has its peak at 56 ms while the top interface is at 60 ms. Confirm the offset from the antisymmetry argument.

The midpoint of the bed is at $60 + 4/2 = 62$ ms. The peak sits 6 ms above the midpoint, at 56 ms, and the trough sits 6 ms below it at 68 ms with the same magnitude, 0.04683064. The offset from the top interface is $62 - 6 - 60 = -4$ ms, which is the table's entry.

## Exercise

Predict the peak position relative to the top interface for a 25 Hz wedge at a thickness of 6 ms using the midpoint rule with an offset of 7 ms, then compare it with the model's answer of 4 ms early and account for the difference.

As a self-check: the midpoint is 3 ms below the top, so the rule predicts the peak at $3 - 7 = -4$ ms, that is 4 ms early, which matches the model. The rule is approximate rather than exact because the composite is only a pure symmetric doublet in the thin bed limit and the offset itself drifts with thickness, and because the model can only report positions on the 2 ms grid, so anything between 3 and 5 ms early is reported as 4.
