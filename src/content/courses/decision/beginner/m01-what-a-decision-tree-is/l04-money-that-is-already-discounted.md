# Money that is already discounted

The rollback has no discount rate. Every payoff and every cost enters at the number typed, so a tree is only as well discounted as whatever valued its payoffs.

{{panel:ec-tree-explorer}}

## Two numbers that pass straight through

The EKPAN tree's drill success payoff is 420.0000 million USD and its dry hole is -25.0000. Both are values another engine has already discounted, and both enter the drill chance node unchanged:

0.350000 x 420.0000 + 0.150000 x 170.0000 + 0.500000 x -25.0000 = 160.0000

The drill cost of 55.0000 is then subtracted at face value, leaving a branch worth 105.0000. The tree has no year column and no rate: a payoff arriving late in a field's life and a cost paid today are added as if they fell on the same day.

## What that demands of the inputs

Every payoff and cost on one tree must be a present value at the same date and the same rate, and they must all mean the same thing: net to the company, after tax, in million USD. The develop cost of 90.0000 on the marginal find is spent only after the well has found something, so it must be discounted to the date of the root decision just as its 260.0000 is. The engine checks none of this, because nothing in a tree records when money moves.

## Where the payoffs come from

In the Decision Tree Builder a terminal can be linked to a saved Monte Carlo run. Linking stores a copy of the run's NPV mean, P90 and P10, in million USD, at the moment of linking. Nothing re-reads the run afterwards, so a revalued run leaves the old copy in the tree until the terminal is linked again. The discounting a tree inherits is whatever the run held on the day it was linked.

## The mistake

The careful mistake is typing an undiscounted value, cash summed over a field's life, as a terminal payoff beside a cost paid today. The tree rolls it back without complaint into a larger EMV that looks as authoritative as 105.0000. The reverse mistake is discounting twice: applying a rate by hand to an NPV that is already discounted before typing it. That shrinks every payoff and leaves costs untouched, which pulls the choice toward the cheaper branch. Neither error leaves any trace in the output.

## What it refuses

On time, nothing. There is no field for a date, a rate or a currency, and no warning for a stale linked copy. The only refusal that touches a linked payoff concerns its shape: a distribution with no mean is refused with `Distribution payoff has no finite mean`.

## Exercise

Write the EKPAN tree's drill weighting line and its cost subtraction, and say which engine is responsible for discounting 420.0000 and -25.0000. Then say what a Builder tree shows after its linked run is revalued, and how it comes to see the new value.
