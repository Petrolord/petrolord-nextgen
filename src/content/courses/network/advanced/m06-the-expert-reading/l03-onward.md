# Onward

A network answer reaches further than any single well study can, and it hands over sooner than its shape suggests.

## What it earns

It gives one answer for the whole system at once, and the rate a well makes falls out of it rather than out of a wellhead pressure somebody typed in. On the teaching network the four solo rates add to 15683.052292561 lb/d while the system produces 13300.677150912 lb/d, so being on the header costs 2382.375141650 lb/d, 15.190761959 percent. The ranking by loss is not the ranking by rate: AGBADA-6 loses 24.162893177 percent of itself while the strongest well loses 12.857585591. It also refuses well: eleven malformed networks come back with a sentence naming the node or branch, and a singular Jacobian is reported as a diagnosis rather than repaired.

## Where it hands over

The pipe hydraulics are a callback the consumer supplies and so is the well inflow, so nothing here computes either. There is no temperature anywhere, so no thermal coupling and no cooldown. Every equation is steady state, so no slugging, no holdup and no transient. Mass in equals mass out on every branch by construction, so no compressibility along a branch. There is no pump, no compressor and no choke as a node kind: a well injects, a junction passes everything through, a sink holds a fixed pressure and takes what arrives, and anything else has to be written as a branch relation or left out.

## The limit worth remembering

A solve that reports itself converged has told you about its own residual and nothing else. On that same network the engine returns `converged` true at 1.546141e-11 lb/d while `checkConservation` reports 13300.677150912 lb/d produced against 12955.677150912 lb/d delivered, a gap of 345.000000000 lb/d, 2.593852900 percent, from a check that sits in the same file and is never called. The one number that would have caught it was already in the returned object, at a node nothing consults.

## What you have finished

Which node was pinned and why its pressure is not an answer, what a residual is measured over, what a tolerance is multiplied by before it decides, what a drawn arrow is worth against a solved sign, and which failures come back wearing `ok` true. The habit under all of it is one question asked of every returned number: what would have had to be true for this function to refuse.

## Exercise

Write the three things a network solve establishes that no single-well method can, and the four it never models at all.

Then say what you would compute, from the returned object alone, before quoting any pressure in it to somebody else.
