# What the driller gets

The deliverable, and what it has to say.

{{panel:gm-window-explorer}}

## The chart

Measured depth down one axis, equivalent mud weight across the other, with four curves:

- The pore pressure gradient.
- The collapse gradient.
- The fracture initiation gradient.
- The planned mud weight.

The planned mud weight has to sit above the higher of the first two and below the third, at every depth in the section.

## Why four curves and not two

Because the lower bound is the maximum of two things, and reading which one is doing the work is the difference between knowing what to do about a tight section and guessing.

The panel plots the lower bound as a heavy line and the two candidates underneath it for exactly that reason.

## The table alongside

Per hole section:

| item | why |
|---|---|
| tightest measured depth | where the section is designed |
| window width there | how much room there is |
| lower bound and which candidate | what to do if it is exceeded |
| upper bound | what to do if it is exceeded |
| breakout angle at the tightest point | where the cavings will come from |
| tolerated breakout width | what the collapse number assumes |

## The last row is the one usually missing

A collapse gradient with no stated breakout width is an unlabelled number. This engine's is at zero width, which is the most conservative possible statement, and a reader who assumes otherwise will use a mud weight that is too light.

## What NOT to put in it

**Ten decimal places.** The sensitivity module showed the Poisson ratio alone moves the answer by hundreds of kilograms per cubic metre. Quoting to the gram is a claim the model cannot support.

**A single number where a band belongs.** If the stress azimuth is a guess, say so and give the range.

**A curve above the last calibration depth.** Extrapolating a stress model into the shallow section is the Associate tier's finding, and the honest thing is to stop the curve and say why.

## What the driller does with it

Picks a mud weight for the section, usually near the middle of the window with a bias toward the bound that is less well known.

Then watches the hole. Cavings mean the mud is too light for the collapse gradient; losses mean it is too heavy for the fracture gradient. Both are calibration data for the next section.

## What the well planner does with it

Compares it against the casing programme. A section whose window closes before its planned total depth needs a shallower shoe, and that is a decision that has to be made before the section is drilled.

## Exercise

Sketch the four-curve chart for the horizontal well from 900 m to 1200 m using the numbers from module 1.

Then choose a mud weight for that interval and justify where in the window you put it.
