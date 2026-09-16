# The story so far

This tier took the two questions a pressure drop cannot answer, the wall a code demands and the liquid a pig pushes, and then turned round and audited the whole engine. What follows is three questions, asked of the two pipes they belong to.

## As a hydraulic line

The OGBIA bore of 7.981000 in carries 12000.000000 bpd at 2.244621 ft/s, a Reynolds number of 48431.2523, and spends 25.660631 psi over 26400.000000 ft, against an erosional ceiling of 13.545709 ft/s that it uses 0.165707 of.

## As a pressure envelope

The SOKU pipe at 12.750000 in of outside diameter and 52000.000000 psi of yield needs 0.419231 in of wall at Class 3 and 0.329327 in at Class 1, and the 0.375000 in the mill rolled rates 1019.607843 psig. This is a different pipe from the hydraulic line above. Its bore is the outside diameter less twice the wall, 12.000000 in, which stands 4.019000 in wider than the OGBIA bore.

## As a volume

The OGBIA line holds 1633.5349 bbl, a sphere crosses it in 2.444444 hours, and at a measured holdup of 0.060000 it delivers 98.0121 bbl to whatever is waiting at the end, every 3.7997 days.

Three answers, and not one of them can be derived from the other two. Two of the three are asked of the same pipe and the independence does not rest on that, which is why the wall reading is stated on the pipe it belongs to. A reader who knows the pressure drop knows nothing about the wall, and a reader who knows the wall knows nothing about the slug.

## What the audit half added

The second three modules changed what a number means rather than adding new ones.

Where the correlations stop: a friction factor that jumps 1.603040 times across one unit of Reynolds number, a Colebrook curve that answers far outside the roughness it was fitted for and flags nothing, a friction law hidden inside Weymouth, four forms that never check their own regime, and two iterations that never report convergence.

What a refusal is: an object carrying an error string, with three deliberate exceptions, a boundary read on both sides of every guard, and two things the engine still accepts that arguably it should not.

What the method does not know: four held items, a set of goldens that are synthetic, and a multiphase half that is not here at all.

## The habit to keep

Ask of every figure whether the correlation that produced it applies where it was used, and whether the inputs behind it were computed, measured or assumed. A pressure drop, a wall and a swept volume can all be arithmetically perfect and still answer the wrong question.

## Exercise

Give the OGBIA line as a hydraulic answer, the SOKU pipe as a pressure envelope and the OGBIA line as a volume, naming the figures for each and saying which pipe each answer belongs to. Then say why none of the three can be derived from the other two, and list what each of the three audit modules established.
