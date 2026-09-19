# Where the differential term comes from

Five of the six terms in the budget are the engine's own default uncertainties.
The differential pressure term is the interesting one, because it can arrive by
two different routes and the result tells you which route it took.

## The transmitter route

Give the function a reading and a span and it derives the differential
uncertainty from the transmitter, exactly as module five does, and says so:

   > the differential transmitter: 0.075 percent of a 200 in H2O span read at 63.8 in H2O
     is 0.235 percent of reading

That is the ABOH case. The 0.235110 percent of reading that appears in the
budget table is the same figure the transmitter table in module five gives at a
reading of 63.800000 in H2O.

## The typed route

Give the function no reading and no span and it takes the typed figure instead:

   > a typed differential uncertainty

Both routes produce a budget. They do not produce the same budget:

   with the differential term from the transmitter, percent             0.581059
   with the engine's typed default differential term, percent             0.621539
   difference (first less second)                     -0.040480
   ratio (first over second)                           0.934872

Both figures are totals for the same run at the same beta. The only thing that
differs between them is where one of the six terms came from, which is a useful
demonstration of how much of a budget can be decided by a choice nobody wrote
down.

## Why the result says which route it took

This is the part worth taking away from the lesson, and it is about screens
rather than about arithmetic.

Imagine a metering page with a transmitter panel at the top and an uncertainty
budget underneath. The panel says the transmitter is worth some percentage of
reading at today's reading. The budget underneath was computed with a default
that has nothing to do with today's reading. Both halves of the screen are
correct in their own terms and the screen as a whole is telling a lie, because
the reader will naturally assume the budget used the figure printed above it.

A line on the result saying which route was taken removes that failure
completely. You read the budget, you read the basis line, and you know whether
the number in front of you belongs to your transmitter at your reading or to a
default that belongs to nobody.

## Which route you should want

The transmitter route, whenever you have a reading and a span, because the whole
argument of module five is that the differential term depends on where you are
on the span. A default cannot know that. The typed route exists for the case
where you have a real figure from somewhere else, such as a calibration
certificate, and it should carry that figure rather than a placeholder.

## Exercise

You are handed a budget with no basis line and a total that matches neither of
the two figures above. Say what you would ask for first, and what the basis line
would have told you if it had been there.
