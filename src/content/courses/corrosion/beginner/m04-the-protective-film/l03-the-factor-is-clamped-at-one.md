# The factor is clamped at one

{{panel:fc-rate-explorer}}

Below its computed onset the protective film multiplier is exactly one. Not close to one, and not one after rounding: the engine returns 1.000000000000 and the rate passes through untouched. Above the onset the multiplier falls below one and the rate is reduced by it.

The clamp is what makes the multiplier safe to apply everywhere. It states a direction rather than a magnitude: a film can slow the attack down and it can never speed it up, so the multiplier is allowed below one and never above it. Applying the same expression with no ceiling would let a correction that is meant to be protective increase a rate instead.

## Most of the engine's own streams sit below their onset

Of the six worked streams in this course's source material, 5 have a multiplier of exactly one, which means no film credit is in their rates at all. The shipped studio case sits below its onset as well, at 60.000000 C with a computed onset of 80.984504 C.

That has a consequence worth carrying into the next lesson. Where the multiplier is exactly one, multiplying by it changes nothing at all, so a question about where in the chain it should be applied cannot move the answer by a single bit. Every capstone scenario in this course is deliberately set below its own computed onset for that reason, and the generator behind them asserts it rather than assuming it.

## Reading the clamp on the screen

The panel prints the multiplier and the computed onset together. Three readings are worth telling apart. A multiplier of 1.000000000000 with the temperature below the onset means the film is not credited. A multiplier below one means the film is credited and the rate you are reading is lower for it. A multiplier at exactly one with the temperature above the onset would be a contradiction, and you should trust neither figure until you have found out why.

The clamp itself is arithmetic and it is not held. What is held is everything that decides where the clamp releases: the three constants of the expression and the temperature at which the published correlation turns protective. So the shape of the behaviour is dependable and the position of the turn is not sourced here.

## Exercise

Set the conditions so that the temperature sits below the computed onset and record the multiplier, then raise the temperature past the onset in small steps and record the multiplier at each step until it is clearly below one. Write down the temperature at which it first leaves 1.000000000000 and compare it with the computed onset the panel prints. Then say what a multiplier above one would do to a rate, and why a screening tool should refuse to produce one.
