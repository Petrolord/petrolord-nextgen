# The high beta trade, in the engine's own words

A bigger hole in the same pipe is a higher beta. It is the most common change
anyone makes to a meter run, usually because the run is not passing enough flow
or because the pressure loss across it is being complained about. The engine has
a sentence about it:

   > beta above 0.6: the permanent pressure loss falls but the uncertainty and the
     straight-run requirement both rise

   the trade warning starts above a beta of                       0.600000

## Three clauses, three modules

Take the sentence apart. Two of its clauses are measured in this tier, and the
third is the engine's statement, which this tier reads at one beta only.

The permanent pressure loss falls. That is the thing the plant wants. A meter
run takes a permanent bite out of the line pressure, and a larger bore takes a
smaller one. Module four prints the loss across the published range of beta at
the ABOH differential, so the size of that gain is a table rather than a claim.

The uncertainty rises. Module six builds the budget for the ABOH run term by
term, at the ABOH beta and at no other. In that budget the beta reaches the
flow through the sensitivities to the two bores, while the coefficient's own
uncertainty is a typed default that does not move with beta. To see the rise you
would run the budget at a second beta, and this tier does not print one.

The straight-run requirement rises. Module four also carries the straight-run
table, where the requirement is read off against beta, and the engine's own
account of that table says a published requirement rises with beta. A plate that needs more
straight pipe than the platform has is a plate that will be installed anyway and
will read wrong, so this clause is the one that turns a paper decision into a
field problem.

## Why this is a warning rather than a refusal

Nothing above the trade threshold is out of range. The correlation is published
up to 0.750000 and the flag comes back true all the way there. The engine is not
stopping you. It is recording, on the result, that a choice with a cost was made
at this beta, so that somebody reading the calculation in two years can see the
cost was known at the time.

That is a good pattern to copy in your own work. A design decision that leaves no
trace on the deliverable becomes, six months later, a number that nobody can
explain and that everybody is afraid to change.

## Exercise

You are asked to raise a run from a beta near the ABOH value to one above the
trade threshold. Name the three things the warning says will move, and say which
module of this tier you would open to put a number on each one.
