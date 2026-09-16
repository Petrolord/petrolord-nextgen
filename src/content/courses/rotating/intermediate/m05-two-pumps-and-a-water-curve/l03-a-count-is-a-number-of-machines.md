# A count is a number of machines

Most inputs in this package are continuous. A machine count is not, and the engine guards it as a whole number rather than merely as a positive one.

{{panel:fc-suction-explorer}}

## Both refusals

Parallel:

{ error: "parallel operation needs a pump curve and a whole number of machines, at least one" }

Series:

{ error: "series operation needs a pump curve and a whole number of machines, at least one" }

Each message names its own operation and states both halves of what it needs: a pump curve, and a count that is a whole number and at least one.

## Why a fractional count is refused rather than rounded

Two and a half pumps is a question with no answer. There is no machine that is half a pump, no manifold that holds two and a half of them, and no curve that describes the arrangement.

A curve returned for it would be an answer to it. That is the point. Rounding the input quietly would turn a question nobody can ask into a plausible-looking result, and the reader would have no way of knowing which count the answer belongs to. Refusing puts the problem back where it started, in the input.

The same reasoning covers a count of zero or a negative one. A station with no machines has no combined curve, and no arithmetic on a pump curve produces one.

## The droop refusal travels with the stack

Combinations are built out of a single machine's curve, and they carry that curve's properties with them. If the curve does not fall with flow, the stack refuses a duty point for the same reason one machine does:

{ error: "this curve does not fall with flow, so it is not a centrifugal head curve and its crossing with a system curve is not a duty point: check the catalogue points" }

That message is worth reading for what it does not say. It does not say the crossing could not be found. It says the crossing is not a duty point, because the object it was asked to cross a system with is not a centrifugal head curve. And it names where to look: the catalogue points the curve was fitted from.

Putting four machines in parallel does not repair a curve that never drooped. It builds a combination out of it, and the combination inherits the problem.

## The mistake

The mistake is catching a refusal and retrying with the count rounded. The retry succeeds, the answer looks ordinary, and nobody ever learns which count was asked for.

The second mistake is reading the droop refusal on a stack as a fault in the stacking. The curve is the fault, and the count is not involved.

## Exercise

Quote both count refusals and name the two requirements each of them states. Then say what a curve returned for two and a half pumps would imply, and explain why a stack of four machines refuses a duty point when the single curve it was built from does not fall with flow.
