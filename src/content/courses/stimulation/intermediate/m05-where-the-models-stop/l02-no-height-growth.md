# No height growth

The model is told the height. It can never discover that the height was wrong.

{{panel:st-frac-explorer}}

## An input that looks like an answer

The published case carries a fracture height of 30 m, and the perforated interval it belongs to runs from 2450 m to 2550 m measured depth. You typed the 30. The engine checked only that it was positive, then used it in every line that follows.

Nothing in the calculation can push back on it. If the real fracture climbed into the shale above or dropped into water below, the model would still report the width, net pressure and pump time for a fracture 30 m tall, with exactly the same confidence. This is the commonest way a two dimensional design misleads a job.

## What growth would do to each number

Height enters three places.

Net pressure. PKN divides the maximum width by twice the height, so a taller fracture is more compliant and its net pressure is lower. The published PKN net pressure is 2889735.9944400033 Pa. Growth relieves pressure, which is why a treating pressure that stops rising is a symptom rather than a relief.

Fracture volume. The stored volume is two wings times height times average width, which is 36.143836842230584 m3 in the published case against 209.09714590747427 m3 injected. Volume that goes into unwanted height does not go into length, so the half-length you actually create is shorter than the one you designed.

Leakoff. The leaking area is proportional to height as well, so a taller fracture leaks faster and the efficiency falls below the published 0.1728566723633056.

The three effects reinforce each other. Growth costs you pressure, length and efficiency at the same time.

## How a real job watches for it

Containment is a stress question, so the first defence is the stress profile from module one. Barriers are stress contrasts, and if the bounding layers carry little more stress than the pay, there is nothing holding the fracture in.

During the job, the net pressure history is the live instrument. Nolte and Smith read the slope of net pressure against time on log scales, and a slope that flattens or turns down while rate is steady says the fracture has found somewhere else to go.

Afterwards, the fracture is logged rather than argued about. Radioactive tracer and temperature logs show where fluid went, and microseismic or tiltmeter surveys map the created height directly.

## Exercise

In the panel, reproduce the published case and record the net pressure and pump time at a height of 30 m.

Then raise the height and record both again. Say which of the two moved more, and explain why using the place height enters each expression.

Finally, state what the job would have delivered if the true height had been that larger value all along.
