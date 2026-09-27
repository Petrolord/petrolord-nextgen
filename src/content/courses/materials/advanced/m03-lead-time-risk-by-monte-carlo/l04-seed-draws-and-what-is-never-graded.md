# Seed, draws and what is never graded

{{panel:materials-spares-calculator}}

A sampled figure answers a question approximately, and the approximation depends on two stated inputs: the seed that starts the stream and the number of draws. This lesson changes both on the mechanical seal, watches the estimates move, and sets out exactly what the course grades and what it does not.

## Another seed, another estimate

The same seal, the same triangles and the same reorder point of 3, run twice:

| run | stockout probability a cycle | reorder point for a cycle service level of 0.95 |
| --- | --- | --- |
| seed 20270301, 20000 draws | 0.058600 | 3.062282 |
| seed 20270302, 2000 draws | 0.065500 | 3.113782 |

Neither run is wrong. Each is an estimate of the same quantities, and they differ because the draws differ. The larger run is the steadier estimate: more draws average out more of the chance in any one stream. The engine's reason for the first run, verbatim:

> 1172 of 20000 draws have a lead-time demand above the reorder point 3: a stockout probability of 0.0586 a cycle

The reason prints the estimate to four places; the field, quoted with its seed and draws, is 0.058600.

## The draw cap

The engine accepts up to 200000 draws, its stated MAX_ITERATIONS. One more is refused, verbatim:

> iterations must be a whole number from 1 to 200000; got 200001

## What is never graded

Every graded number in this course is a return value of the engine on fixed inputs, so there is exactly one right answer on any machine. No graded figure is a Monte Carlo draw. The sampled P90, P50, P10, mean, stockout probability, cycle service level, expected units short and reorder point for a cycle service level are taught with their seed and draw count, and none of them is graded. A capstone may carry a Monte Carlo block to work with its seed and draws; no graded field reads it.

## How to quote a sampled figure

Quote it with its seed and its draws, call it an estimate, and keep it apart from every graded figure. "The seal's stockout probability is 0.058600" is incomplete. "The seal's stockout probability is estimated at 0.058600 on seed 20270301 and 20000 draws" is how the course writes it.

## What the estimate still tells you

An estimate is useful. The seal's two runs agree that a stated reorder point of 3 leaves a stockout in a few cycles out of a hundred, and that a reorder point a little above 3 meets a cycle service level of 0.95. A planner acts on that, and records the seed and draws beside the decision.

## Exercise

Open the spares calculator on the view "Lead-time risk by Monte Carlo (ungraded)" and start from "The same seal on another seed". Read the stockout probability and the reorder point for the cycle service level, and write each with its seed and draws. Now set "Seed (stated)" to 20270301 and "Draws (stated)" to 20000, and predict the figures before you read them: they are the mechanical seal's. Set the draws to 200001 and read the refusal. Restore 20000.
