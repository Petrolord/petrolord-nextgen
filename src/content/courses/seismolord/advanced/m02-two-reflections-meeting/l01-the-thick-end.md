# The thick end

Every measurement needs a reference level, and the wedge supplies its own at the thick end of the panel. This lesson establishes what that level is, why it is exactly the top reflection coefficient, and how thick the bed has to be before the model actually reaches it.

{{panel:sl-wedge-explorer}}

## One reflection, on its own

Set the frequency to 25 Hz and the thickness to 60 ms, then look at the lower chart. The trace shows a clean positive event at the top interface and a clean negative event at the base, 60 ms apart, with a quiet stretch between them. Nothing about the display suggests the two are related.

Read the amplitude. The model reports **0.07999999821186066**, and the capstone grades that figure as the isolated reflector amplitude.

It is the top reflection coefficient, 0.08. The trailing digits are not a measurement result and they are not an error. The model stores its traces as 32 bit floats, and 0.08 has no exact representation in binary, so the nearest storable value is 0.07999999821186066. Every trace in the panel carries the same rounding. The capstone allows 0.002 either way, so entering 0.08 passes comfortably, and so does the full stored figure. What matters is understanding that the two are the same number rather than two different answers.

## Why the answer is the coefficient itself

A zero phase Ricker wavelet has the value 1.0 at its centre. Convolution places a copy of the wavelet at each reflection, scaled by that reflection's coefficient. At the top interface the trace therefore contains $0.08 \times 1.0$ from the top reflection plus whatever the base reflection's copy contributes at that same time.

At 60 ms of separation the base copy contributes essentially nothing. The wavelet has decayed almost to zero that far from its centre, so the sum is the first term alone. That is what **isolated** means here: not that the interface is alone in the earth, but that no other reflection is close enough in time to add anything measurable to it.

This is the one condition under which amplitude reports reflectivity directly. It is also the condition that most interpretation quietly assumes and that most real sections do not satisfy.

## How thick is thick enough

Isolation arrives gradually rather than at a boundary, so it is worth knowing how gradual. Walking the thickness down from 60 ms at 25 Hz:

| Thickness | Amplitude |
| --- | --- |
| 60 ms | 0.08000000 |
| 50 ms | 0.08000048 |
| 44 ms | 0.08001192 |
| 40 ms | 0.08007754 |
| 36 ms | 0.08040452 |
| 32 ms | 0.08168091 |

The departure from 0.08 grows steadily as the bed thins, and at 32 ms the amplitude is already 2.1 percent above the isolated level. The first thickness at which the model sits within one part in a million of 0.08 is **50 ms** at 25 Hz.

At 40 Hz the same test is met at **32 ms**. The higher frequency wavelet decays away from its centre faster, so its copies stop reaching each other sooner. That is the first quantitative appearance of a theme module 4 develops fully: interference has a reach, and the reach is set by the wavelet.

## What the side lobes are doing

Look again at the 60 ms trace away from the two main events. At 44 ms, which is 16 ms above the top interface, the trace reads $-0.03559476$. That is not noise and it is not the base reflection. It is the side lobe of the top reflection's own wavelet copy: the 25 Hz Ricker has the value $-0.4449345$ at a lag of 16 ms, and $0.08 \times (-0.4449345) = -0.0355948$.

The trace therefore shows three events per reflection, a peak with a trough either side, even though the earth contains a single interface. An interpreter who picks the strongest trough near an interface can be picking a side lobe of the peak above it. On this model the side lobes are 44 percent of the main event, which is large enough to look like a reflection in its own right.

Hold on to the number $-0.4449345$. It reappears as the central quantity of module 3.

## Worked example

Predict the amplitude of the 25 Hz wedge at 36 ms without running the model.

The Ricker at 25 Hz and a lag of 36 ms: $x = (\pi \times 25 \times 0.036)^2 = (2.827433)^2 = 7.994380$, so $w = (1 - 15.988760)\exp(-7.994380) = (-14.988760)(0.000337) = -0.005056$.

Then $s(t_0) = 0.08\,(1 - w) = 0.08 \times 1.005056 = 0.0804045$.

The model reports 0.08040452. The bed is 36 ms thick, more than twice the tuning thickness, and the base reflection is still adding half a percent to the amplitude at the top.

## Exercise

State the isolated reflector amplitude at 40 Hz and justify your answer without running the panel. Then explain why the isolated amplitude is the right thing to compare a tuned amplitude against, rather than comparing two tuned amplitudes at different frequencies.

As a self-check: the isolated amplitude at 40 Hz is the same 0.07999999821186066, because at the thick end the reading is the top coefficient itself and the coefficient does not depend on the wavelet. It is the right reference because it is the amplitude the interface would produce with no interference at all, so the ratio of a tuned amplitude to it measures the interference and nothing else, whereas comparing two tuned amplitudes mixes the interference with whatever else differs between the two runs.
