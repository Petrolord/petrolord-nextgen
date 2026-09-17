# Sizing the plate, and both ends of the bracket

Everything so far has taken a plate and asked what flow it passes. Sizing is the
question the other way round. You know the flow you want to measure and the
differential you want at that flow, and you want the bore that delivers it.

## How the engine answers it

There is no rearranged formula for this, because the coefficient depends on the
beta you are solving for. So the engine searches. It picks a beta, computes the
flow that beta would pass, compares it with the target, and narrows the bracket,
staying inside the correlation's own published beta range while it does so.

   target mass flow, lb/hr                              42000.0000   stated
   solved beta                                            0.614193   returned
   solved bore, in                                        3.725084   returned
   the flow that bore passes, lb/hr                     42000.0000   returned
   the coefficient at that bore                           0.604313   returned
   the beta bracket it searched                        0.1 to 0.75   returned

The fourth line is the check on the first. The solved bore passes 42000.0000
lb/hr, which is the flow that was asked for, so the search converged rather than
stopping somewhere near. The coefficient at that bore comes back too, because by
now you know a bore without a coefficient beside it is half a result.

## The sentence that stops a plate being ordered

   > a plate is bored to a stock size, so 3.7251 in is the bore this duty asks for rather
     than the bore that will be ordered. Take the nearest stock plate and recompute the
     differential it gives at this flow

A solved bore is a mathematical answer to a duty. A plate is a physical object
that a shop makes in stock sizes, and the one you can buy is close to your
answer rather than equal to it. The engine says what to do about that: take the
stock plate, put it back through the flow calculation, and find the differential
it really gives at your flow. That second calculation sets the transmitter
range.

## Both ends of the bracket refuse by name

A search has two ends and this one refuses at each of them, carrying the flow
that end can actually pass:

   > even a 0.75 beta plate cannot pass this flow at this differential: it passes 69,326.8
     lb/hr. Raise the differential range or use a larger meter run

   > even a 0.1 beta plate passes more than this flow at this differential: it passes
     1,018.5 lb/hr. Lower the differential range

Each one carries the number you need to decide what to do next, and each one
says which two things to change.

## Never a bore beside an error

This function never returns a bore beside an error. A solver that fails to converge and hands back its
last guess along with a complaint produces a screen with a number on it, and the
number gets used. Here you get an answer or you get a reason.

## Exercise

You take the solved bore, order the nearest stock plate below it, and install it
at the same flow. Say which figure on the result sheet you would expect to have
moved, and what you would do with the transmitter range as a result.
