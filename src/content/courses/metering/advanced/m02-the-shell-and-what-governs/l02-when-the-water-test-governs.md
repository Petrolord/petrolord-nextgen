# A light product makes the water test govern

A common shell design mistake is to design for the product. It sounds like the careful thing to do. On this tank, for any product below the crossover gravity this lesson ends on, it is the wrong condition, because the tank is tested full of water before it ever sees product. That crossover sits below the gravity of water, so a product can be lighter than water and still govern.

## The sweep that shows it

Holding the bottom course geometry fixed and moving only the product specific gravity, the engine returns:

| specific gravity | t design, in | t test, in | required, in | governed by |
| --- | --- | --- | --- | --- |
| 0.550000 | 0.129233 | 0.218926 | 0.218926 | hydrostatic test |
| 0.650000 | 0.152729 | 0.218926 | 0.218926 | hydrostatic test |
| 0.750000 | 0.176226 | 0.218926 | 0.218926 | hydrostatic test |
| 0.850000 | 0.199723 | 0.218926 | 0.218926 | hydrostatic test |
| 0.912400 | 0.214385 | 0.218926 | 0.218926 | hydrostatic test |
| 1.000000 | 0.234968 | 0.218926 | 0.234968 | product design |
| 1.150000 | 0.270214 | 0.218926 | 0.270214 | product design |

Three things are visible in that table at once. The test thickness never moves, because the test is always water and the water does not care what the tank will hold. The design thickness climbs with the gravity, because the head is the product. And the governing word changes partway down the column, which is the whole point of printing it.

## The note the engine writes when the test governs

Where the water test wins, the engine says so in its own words:

> the water test governs this course: a light product does not stress the shell as hard as the water it will be tested with, and designing for the product alone would under-thickness it

That sentence is quoted here exactly as the engine writes it, including its own phrasing. It names the failure it exists to prevent. A shell designed on a light product alone is thinner than the hydrostatic test will demand of it, and the test is not optional.

## What the two columns are telling you

The test column is a statement about the tank, and the design column is a statement about the service. That is why they behave so differently under the sweep. Change the product tomorrow and the design column moves; the test column stays where it is, because the tank was filled with water once and will be filled with water again if it is ever rebuilt.

A designer with only the design column cannot see this. The thickness looks like a smooth function of the gravity, and it is, right up to the point where it stops being the thickness that matters.

## Where the word flips

The course bisects the engine's own governing word on this tank and reports the gravity at which it changes:

> on this tank the water test takes the bottom course below a gravity of 0.931727

Below that gravity the water test governs the bottom course. Above it the product does. Nothing in the package publishes 0.931727 as a threshold, because it is not a published threshold. It is a property of this geometry and this test condition, and it was found by asking the engine which side of the boundary it was on and narrowing until the answer changed.

That is a method you can use on any engine that returns a word. You do not need the package to expose a boundary if it will tell you which side of one you are standing on.

## Exercise

Take the gravity sweep in this lesson and name the two adjacent rows the reported crossover gravity must lie between. Say how you would confirm it lies there using only the governing word the engine returns.
