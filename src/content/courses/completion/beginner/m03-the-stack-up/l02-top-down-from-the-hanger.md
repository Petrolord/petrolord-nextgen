# Top down from the hanger

Why the tally is built downward from a fixed point at surface, and what the hanger depth is doing in the arithmetic.

{{panel:cd-string-explorer}}

## The fixed point

The tally needs one depth it can trust, and everything else is measured from it. That depth is the tubing hanger, which sits in the wellhead at a known elevation and does not move.

In the published string the hanger is at zero, which means depths are measured from the same datum the casing depths are measured from. That is the normal case for a completion run from surface.

## When the hanger is not at zero

A completion run on a work string, or a string hung off a liner top rather than at surface, has a hanger depth above zero. The engine accepts it and adds it to every depth.

It refuses a negative hanger depth, because a hanger above the datum is not a well configuration, it is a sign error.

## Why not build it bottom up

You could measure from total depth upward instead, and some operations do think that way, because what matters is where the packer sets and where the perforations are.

The engine does not, for a simple reason: the length of the string is known before it goes in the hole and the depth of the bottom is not. You know every joint you have on the rack. You find out where the bottom ends up by adding them.

Building bottom up would mean assuming the answer and back calculating the tally from it, which reverses the direction the information actually flows.

## The consequence for space out

This is the seed of a problem the advanced tier spends a whole module on. If the tally is built downward from the hanger, then the depth of the packer seal assembly is whatever the accumulated lengths make it, and it will not land exactly where the design wanted.

The gap between where it lands and where it should land is taken up by a pup joint, and if the seal assembly is landing in a polished bore, the gap is taken up by choosing where in that bore to land. That choice is the space out.

## Exercise

Write down the two rules the engine enforces about the hanger depth.

Then explain, in two sentences, why the tally is built downward rather than upward.

Finally, say what would have to be true about a rig operation for the bottom up view to be the natural one.
