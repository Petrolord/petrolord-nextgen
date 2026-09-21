# Where the probability of death comes from

{{panel:qr-event-tree}}

Every individual risk in this course is a sum of a frequency times a probability of death. This course computes the frequency. It never computes the probability of death. That number, written Pd, is the answer to a physical question about a fire, a toxic cloud or an explosion reaching a place, and answering it is consequence modelling, which belongs to the consequence course. Here a probability of death is always a stated input.

## What a QRA needs, and who supplies it

| what a QRA needs | where it comes from | what this course does with it |
| --- | --- | --- |
| a scenario frequency | a release frequency and an event tree | computes it |
| a probability of death at a place, Pd | a consequence model, in the consequence course | takes it as a stated input |
| who is where, and for how long | the roster and the plot plan | takes it as a stated occupancy |
| a tolerability criterion and the values for a measure | published guidance and the duty holder | takes each as a stated input |

A consequence chain runs from a source term through dispersion or a flame model to a dose and a probit, and every link of it belongs to the consequence course. This course picks up the result at the end, the probability of death, and multiplies. You will never be asked in this course to justify a stated Pd, only to use it correctly.

## EREMOR's stated probabilities

EREMOR states a probability of death for each outcome at each place. The flash fire has a stated Pd of 1 at the process deck, because the deck lies inside the flammable cloud. At the control room the same flash fire has a stated Pd of 0, because the control room lies outside it. The frequency of the flash fire, 0.000081000000 per year, is the same in both places. Only the stated Pd changes, and so the flash fire adds 0.000081000000 per year to the deck and 0.000000000000 to the control room.

## The other seams

The same line runs through every neighbouring course. The risk matrix and its scoring belong to the risk and change course, and this course never scores one. LOPA, independent protection layer credit and SIL determination belong to the LOPA course. Flare radiation and setback distances belong to the facilities courses. Present value mechanics belong to the economics courses.

The engine does expose three functions that call the consequence engine to make a probability of death. This course never asks for their inputs. When a published chain appears later in this tier, it is taught from the probability of death onward, with every earlier step left to the consequence course.

## Why the seam is kept strictly

Two courses computing the same number would soon disagree about it. Keeping the probability of death as a stated input means a change to it has one owner and one place to be argued. If the consequence course revises a Pd, this course reruns the same sums on the new input and nothing else moves.

## Exercise

The flash fire happens at 0.000081000000 per year. Multiply it by the stated Pd at the process deck and by the stated Pd at the control room, and write both contributions to twelve decimals. Then suppose the consequence course revised the control room Pd upward. Say which of the two numbers in your multiplication would change and which course would change it.
