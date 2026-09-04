# What flips it

Spaced on 26.80 psi per valve the string multipoints at stage 5. Spaced on 26.90 psi per valve it does not.

{{panel:pd-unloading-explorer}}

## A tenth of a psi per valve

Sweeping the decrement on the published midDecrementKnifeEdge inputs:

| Decrement, psi per valve | Stage 5 surface margin, psi | Multipointing stages |
| --- | --- | --- |
| 26.00 | 0.972936966 | 2, 3, 4, 5 |
| 26.75 | 0.124769727 | 2, 3, 4, 5 |
| 26.85 | 0.011681097 | 2, 3, 4, 5 |
| 26.90 | -0.044863189 | 2, 3, 4 |
| 27.50 | -0.723393096 | 2, 3, 4 |

The flip sits between 26.80 and 26.90 psi per valve, inside a decrement band nobody would look at twice. The margin walks smoothly across it, so on this axis the verdict has a location and a slope and a sweep can find it.

## The same verdict through a different door

Port and bellows reach the verdict through the port to bellows ratio, and so through the dome charge and the closing pressure.

| Change | R | Stage 5 surface margin, psi | Multipointing stages |
| --- | --- | --- | --- |
| bellows 0.62 in2 | 0.079173202 | 6.629477446 | 2, 3, 4, 5 |
| published, 0.77 in2 and a 0.25 in port | 0.063749851 | 0.124769727 | 2, 3, 4, 5 |
| bellows 0.9 in2 | 0.054541539 | -3.758264661 | 2, 3, 4 |
| every valve on a 0.3125 in port | 0.099609142 | 15.249903355 | 2, 3, 4, 5, 6 |

Two shapes of sensitivity sit in that table. Bellows area is continuous and moves the margin a few psi at a time. The port comes out of a catalogue, so one step from 0.25 in to 0.3125 in moves the stage 5 margin from 0.124769727 to 15.249903355 psi and adds a stage, with nothing available in between.

## What barely moves it

The transfer differential rebuilds the string without moving the verdict much: 40.0 and 50.0 psi give stages 2, 3 and 4, while 60.0, 70.0, 80.0 and 100.0 psi all give 2, 3, 4 and 5. The unloading gradient is blunter still. At 0.12 psi/ft the design falls to 6 valves reaching 7207.583657538 ft and multipoints only at stages 2 and 3.

## The mistake

Sweeping the input that is easy to type. A decrement sweep at whole psi steps walks straight over the flip on this design.

## What it refuses

None of these sweeps says which design is right. They say how far the published one sits from a different answer, on one axis at a time, with everything else held.

## Exercise

Run the decrement from 26.00 to 27.50 psi per valve in the panel and record the stage 5 margin at each step you take.

Then say what step size you needed to see the flip, and why that same step size buys nothing on the port.
