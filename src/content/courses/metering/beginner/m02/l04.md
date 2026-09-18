# The published beta range, and what the engine says outside it

A correlation is published over a band. Inside that band it is an equation
fitted to experiments. Outside it the same equation still evaluates, and what
comes out is arithmetic with no measurements underneath it.

## The two edges

The flange-tap correlation this module uses is published over a band of beta,
and both edges were found by bisecting the engine's own `betaInPublishedRange`
flag rather than by reading a constant:

   lower edge of the published range, beta                       0.100000
   upper edge of the published range, beta                       0.750000

The ABOH run came back with beta inside the published range true, and its beta
of 0.482523 is why.

## What happens above the top edge

The engine still returns a coefficient. It does not refuse, and nothing in
this course says why it answers here where it refuses elsewhere, so read it as
the behaviour it is. The result carries the coefficient and a warning, in the
engine's own words:

   > beta of 0.841 is outside the 0.1 to 0.75 range the flange-tap correlation is published
     for: resize the plate rather than trusting this number

Two things in that sentence do work. It names the beta it was asked about and
the band it is outside, so the message is specific to your run. And it tells you
what to do, which is to change the plate. The coefficient it hands back is an
extrapolation of the equation, and the honest description of an extrapolation is
that its error is unknown rather than large.

## The second warning, which fires inside the band

There is a second sentence, and it is the more interesting one because it fires
on runs that are entirely legitimate:

   > beta above 0.6: the permanent pressure loss falls but the uncertainty and the
     straight-run requirement both rise

   the trade warning starts above a beta of                       0.600000

Found by bisecting the beta at which the returned warning stops being null. A
run above that beta is inside the published range and its flag comes back true.
The warning is not telling you the number is wrong. It is telling you that you
have bought something and paid for it, which is the subject of the next lesson.

## Reading a warning line properly

The warning field is part of the result in the same way the flow is. On the ABOH
sheet it came back null, which is a statement and not an absence. A screen that
prints the flow and drops the warning has removed the only line that tells the
reader which kind of answer they are holding, and in this module there are three
kinds: a published evaluation, a published evaluation carrying a trade, and an
extrapolation.

## Exercise

A colleague sends a run at a beta above the upper edge and says the tool gave a
coefficient, so the plate is acceptable. Using the two edges and the warning
text above, write the two sentences you would reply with.
