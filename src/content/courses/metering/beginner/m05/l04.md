# Where the warning fires, and what it says

This module has two edges. One is at the bottom of the span, where the reading
has fallen far enough that the engine flags it. The other is at the top, where
the reading is outside the instrument altogether and the engine refuses.

## The bottom edge

   on a 200.000000 in H2O span the warning starts below a reading of, in H2O          22.222222

Found by bisecting the reading at which the returned warning stops being null.
That figure belongs to this span. A transmitter spanned differently has its own
reading at which the same rule bites, because the rule is written in turndown.

Look at the warning column of the table in the second lesson of this module and
you can see the state change between two of the rows. Above the threshold the
result carries no warning. Below it it carries one, and nothing else about the
number beside it has changed. The uncertainty of the reading did not jump there.
It has been climbing all the way down the span, and what changed is that the
engine has started saying so.

That is worth being clear about, because a flag invites a binary reading. Silent
is not a certificate and firing is not a failure. Firing means the flow turndown
has passed the limit the engine holds, and the response is to look at what the
reading is worth on that row and decide whether the measurement still supports
what it is being used for.

## The top edge

Ask for a reading above the span and there is no answer to give:

   > the reading is above the transmitter span

A transmitter cannot report a differential outside the range it was set up for.
It saturates, and what it sends is the top of its output range for as long as
the condition lasts. Treating that as a measurement would produce a flow figure
from an instrument that had stopped measuring.

This case arrives in real life the ordinary way. A well is opened up, a choke
is pulled, and a span chosen for last year's rate is too small.

## Both edges are the same question

Between the two edges is the range where this instrument can be trusted, and a
span choice decides where that range sits. Put it high and the meter saturates
rarely and spends its life low on the span. Put it low and the readings are good
until the day the rate goes up.

## Exercise

Your span is 200.000000 in H2O and the plant is going to double its throughput.
Say which of the two edges you are about to meet, and what the flag on the low
readings will have been doing for the year before that.
