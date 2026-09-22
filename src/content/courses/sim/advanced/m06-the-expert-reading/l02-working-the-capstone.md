# Working the capstone

Six numbers, every one of them a construction quantity. The capstone's brief states a setting of its own: a side-track toe, a revised booking target, a span of history periods. The panels open on the committed deck and the EK6-ST toe. This lesson walks each mechanism on the committed deck and names the mistake most likely to produce a plausible wrong answer. The capstone does not grade the teaching values.

## What you are given

The deck, its 30 by 30 by 5 grid with the origin half a cell south-west of the field origin, the six mapped well tops, a booking target, the RC4 monthly ledger, and a side-track from Ekene-6's heel at (1900, 1800). The teaching side-track, EK6-ST, runs to a toe at (1500, 2100), and the teaching booking is NG5's 12139208.107496763 stb.

{{panel:sim-build-explorer}}

Trajectory mode gives fields 1 and 2; set the toe the brief states. Validation mode gives field 5. The structure explorer takes the regional mean for field 3 and reads the datum for field 6. Field 4 is computed from the deck text.

## Field 1: the side-track's connection count

Intersect the trajectory against the grid and count the merged connections.

Two mistakes. Counting distinct COLUMNS gives field 2 instead. And failing to merge re-entries would give more, because a path grazing a boundary produces alternating steps that must be collapsed into one connection per cell.

The check: the count must be at least the number of distinct columns and at most the columns times the layers.

## Field 2: the distinct columns

Count unique (i, j) pairs in the connection list.

The likely mistake is counting connections, which is field 1. The check: it must be strictly less than the connection count, because at least one column is entered in two layers.

## Field 3: the calibrated regional mean

Bisect on the kriging regional mean until the deck's cell-centre oil volume crosses the booking target: type a mean into the structure explorer, read the deck STOIIP, and halve the bracket. The volume is a step function of the mean, because a layer is oil or water by its centre, so the answer is the mean where the volume crosses the target, and the tolerance says how finely to locate it.

Two mistakes. Bisecting on the COLUMN-CLIPPED volume converges on a different value, because that convention gives more oil at the same mean. And getting the search direction backwards diverges to the bracket edge, which is the tell that the sign is wrong: shallower means MORE oil.

The check: the answer should sit below the deepest well top of 1590 m and above the contact at 1560 m, which is what a structure that closes looks like.

## Field 4: the history oil total

Multiply each period's oil rate by the days that period spans and sum over all wells and the periods the brief names.

The likely mistake is a mean month of 30.4375 days instead of the real calendar month. That gives a total about a third of a percent high and is far outside the tolerance.

The check: summed over all 36 periods, your rates must reproduce the RC4 ledger's own oil sum, because the schedule was built from it. A span of periods reproduces the ledger's months over the same span.

## Field 5: the validator messages

Count the error messages the validator raises across the seven broken specifications. Validation mode lists every message under the case that raised it, so read each list to its end. The rules check the deck's form, so rebuilding it at another regional mean does not change what they say.

The likely mistake is reporting the case count, which the Rules exercised tile prints. A case can be coupled to a second rule, and then it raises more than one message.

The check: every case raises at least one message, and no case raises more than two.

## Field 6: the equilibration datum

The mean of the 900 column top depths, in feet.

Two mistakes. Taking the mean of the layer BASES rather than the tops gives a value one net pay deeper. And taking the midpoint of the depth range rather than the mean of the values gives something different, because the surface is not symmetric about its range.

The check: the datum must sit inside the range of column tops, and on the committed deck it falls below the contact, which surprises people. Read it at the mean you calibrated, since the datum moves with the mean.

## The general advice

Every one of these six is a computation on the deck rather than a reading of it, and every likely mistake is a defensible alternative computation. Before submitting, for each answer, write down the rule you applied and the alternative you rejected.

## Exercise

First, for each of the six fields, name the alternative computation that would produce a plausible wrong answer.

Second, apply the check on field 3 and state what a calibrated mean of 1450 m would have told you about your search.
