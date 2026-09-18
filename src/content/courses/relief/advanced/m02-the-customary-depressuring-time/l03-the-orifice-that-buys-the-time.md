# The orifice that buys the time

The sweep in the last lesson answers what time a given orifice gives you. The design question runs the other way: what orifice meets a stated time. This engine has no route for that, and the way the gap gets filled is worth a lesson of its own.

{{panel:fc-blowdown-explorer}}

## Two ways to answer an inverse question

The first way is to rearrange. Take the closed form of the march, solve it for the orifice diameter at a fixed time, and evaluate. It is quick, and it answers a question about the closed form rather than about the engine. Every difference between the two, the step error included, lands silently in the answer.

The second way is to bisect on the engine's own output. Guess a diameter, run the march, read the time, and narrow the bracket until the time is the one you asked for. It is slower, and it answers the question you actually asked.

The digest takes the second way. The orifice at which the AFIESERE vessel takes exactly fifteen minutes, bisected on the engine's own time, is 0.682646 in, where the march returns 900.000000 s.

## Why the second way is worth the cost

Read that result against the sweep. An orifice of 0.750000 in gives 745.608268 s and an orifice of 0.500000 in gives 1677.618587 s, so the answer had to lie between them and the bisection put it at 0.682646 in.

Anything you could have got wrong in a rearrangement is now impossible to get wrong, because the answer is defined as a diameter at which the engine returned the target. The digest says it bisects, and names the function it bisected on, so a reader can repeat it. A figure produced by a solve against the engine and a figure produced by algebra beside the engine are different kinds of claim, and only one of them can be reproduced by running the thing under test.

## What the answer is and is not

0.682646 in is not an orifice you can buy. It is the diameter at which this march, on this vessel, with these gas properties and this discharge coefficient and this step size, reaches 145.000000 psia in 900.000000 s. Turning it into hardware is a separate step, and the ladder of standard orifices the Associate tier worked through is a table for pressure relief valves rather than for blowdown restrictions, so it does not apply here.

What the figure is good for is the decision. It tells you which side of the customary time your candidate orifice falls on and by how much margin, and it does so in the currency the decision is made in.

## The habit

Whenever a route answers a question in one direction and you need the other, ask whether the inverse was solved against the route or beside it, and say which.

## Exercise

Describe the two ways of answering an inverse question and say which one the digest uses. Record the orifice that gives exactly fifteen minutes and the time the march returns at it, then record the two sweep rows that bracket it. Write one sentence on what that diameter is a property of, and one on why the standard orifice ladder does not apply to it.
