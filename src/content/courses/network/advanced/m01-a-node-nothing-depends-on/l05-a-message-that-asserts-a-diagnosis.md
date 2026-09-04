# A message that asserts a diagnosis

The warning names the node and then tells you what kind of node it is. It has not checked the second half.

{{panel:pd-fight-explorer}}

## The sentence

"One node carried nothing and nothing depended on its pressure, so it was left where it sits: t4. That is what a shut-in well on a dead line looks like."

The first clause is a fact about the Jacobian and it is true whenever the warning fires. The second sentence is a story about the field, and the module has no evidence for it.

## What the case actually is

On AGBADA WEST, AGBADA-12 is producing 985.000000000 lb/d and its flowline is passing 640.000000000 lb/d. It is neither shut in nor on a dead line. Both halves of the diagnosis are wrong on the case the engine is describing while it says them.

`diagnose`, in the same module and on the same answer, reports dead legs as none. The module's reading function and the module's warning contradict each other, and only one of them looked.

## The gate's fixture says it too

The published fixture prints the same sentence with `w` in place of the node name, on a well making 2000.000000 lb/d over a line passing 1000.000000 lb/d. That is not a shut-in well either. The sentence is a template with a node id substituted in, and it tells the one story in which pinning is harmless.

## What it would cost to fix

The node's net imbalance is 345.000000000 lb/d on AGBADA WEST and 1000.000000 lb/d on the fixture. The engine already carries both in the returned imbalance object. Naming that number in the message would make the difference between a harmless pin and a lost well visible at no cost.

## What the module does refuse

A singular Jacobian comes back `ok = false` with a real diagnosis: two or more nodes move together, so their pressures are not separately determined, usually because a branch is connected differently from the way the drawing suggests. A pinned node comes back `ok = true` with a story. The module can write an honest failure sentence. It did not write one here.

## The mistake

Reading the message as a diagnosis and closing the case. A reader who accepts "a shut-in well on a dead line" concludes the pin is bookkeeping about a well that was not producing, and stops. What the answer actually holds is a well the engine says makes 985.000000000 lb/d, a line the engine says passes 640.000000000 lb/d, `converged = true`, a reported residual of 1.546141e-11 lb/d, and a `checkConservation` gap of 345.000000000 lb/d that no field in the return mentions.

## Exercise

Solve AGBADA WEST and read the warning text, then read `wellRates` and `flows` for the node it names.

Then write the sentence the module should have printed, using the imbalance it already has.
