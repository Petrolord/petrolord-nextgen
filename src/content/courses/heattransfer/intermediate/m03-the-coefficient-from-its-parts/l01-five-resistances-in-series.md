# Five resistances in series

The overall coefficient on this engine is not a number anybody looks up. It is assembled, out of five named resistances in series, and the point of assembling it is that the parts stay visible. A coefficient that arrives as a single figure tells you what the surface will carry. A coefficient that arrives as five figures tells you which part of the surface to spend money on.

## The five, on the studio case

| term | resistance, hr.ft2.F per Btu | share of the total, percent |
| --- | --- | --- |
| outsideFilm | 0.005000000 | 46.055174 |
| outsideFouling | 0.001000000 | 9.211035 |
| wall | 0.000228791 | 2.107398 |
| insideFilm | 0.002208398 | 20.341632 |
| insideFouling | 0.002419355 | 22.284762 |
| the total | 0.010856543 | 100.000000 |

The five add to the total. That is stated rather than assumed: the five rows above added come to 0.010856543 against the engine's own total of 0.010856543. The coefficient then follows, as one over that sum. U dirty is 92.110348, and U clean, which is one over the three terms that are not fouling allowances, is 134.459410.

{{panel:fc-coefficient-explorer}}

## Where the two films come from

Both film coefficients are inputs to this door. The outside film is always an input in this module, because a rigorous shell side coefficient needs stream analysis that belongs in a dedicated rating package, and the module says so rather than inventing one. The inside film can be computed, and the fifth module of this tier is about that computation, but it can also simply be typed.

That has a consequence worth stating early: in this course the films arrive stated. Wherever a coefficient is worked here, the two films are given conditions of the case rather than things a reader derives. This is deliberate. It keeps every coefficient in this course clear of the one fitted correlation in the module, so that a figure you are asked to produce depends on nothing held for the literature and nothing pinned by a value that a review could change.

## The answer, and what it carries

This door returns thirteen keys, and everything this lesson reads sits on them. The two coefficients, the five resistances with their shares, the total, the reference area, the fouling penalty, and the verdict on which term is controlling. Counting the items in that sentence does not give thirteen, because several of them arrive grouped under one key. Nothing in the list is optional, and nothing in it has to be computed by the caller from the others.

So the reading discipline is simple. Read the shares before the coefficient. A reader who knows that the outside film carries 46.055174 percent of this stack understands the exchanger. A reader who knows only that U dirty is 92.110348 knows the answer and nothing about where it came from.

The word series is doing real work in the title as well. Resistances in series add, so the largest one dominates and the smallest one is nearly irrelevant, and improving a small term buys almost nothing however hard it is improved. That is why the share column is worth as much as the resistance column. On this case the wall carries 2.107398 percent of the stack, so a better alloy is a poor use of money here whatever it costs.

## Exercise

Record the five resistances on the studio case with their shares, and the total. Then record U dirty and U clean, and say which three of the five terms produce the clean figure. Finish by naming which of the two film coefficients is always an input on this engine and why.
