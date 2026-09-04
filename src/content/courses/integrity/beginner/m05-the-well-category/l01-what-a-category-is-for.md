# What a category is for

A colour is not a mark out of ten. It is a trigger that tells you what has to happen next.

{{panel:wi-envelope-explorer}}

## The last step in the chain

You have already done the hard part. Elements carry one of four statuses. Each envelope rolls up to one of four verdicts, taken from the worst element it holds. The category is the step after that, and it takes only two inputs: the primary envelope verdict and the secondary envelope verdict.

Nothing else reaches it. Not how many elements there were, not which kinds they were, not how badly the degraded one was degraded. Two words in, one colour out.

## Why a colour and not a score

A score invites arithmetic. Somebody averages it, somebody trends it, somebody reports that integrity improved by four points this quarter. None of that means anything, because containment is not a quantity. Either there is a qualified barrier between the reservoir and the environment or there is not.

A traffic light refuses that arithmetic. There is no partial credit and no way to add two categories together. Each colour maps to a defined obligation on the operator, which is the subject of the fourth lesson in this module, and the whole point of the scheme is that reaching a colour commits somebody to an action rather than to a note in a report.

So read the category as a question already answered: given what has been demonstrated about these two envelopes, what is now required of us?

## What the category cannot see

It cannot see whether your envelopes are drawn correctly. Geometric closure, the question of whether the elements you listed actually form a sealed surface around the source, is your drawing and this engine says so plainly rather than pretending to check it.

It cannot see evidence quality either. An element you called verified on a ten year old pressure test and an element verified this morning are the same word by the time the category sees them.

## The vocabulary trap

`wellCategory` takes ENVELOPE statuses: intact, degraded, failed, empty. It does not take element statuses. Hand it `not-verified` and it throws, with a message naming both vocabularies, because it once accepted that string and answered green for a well nobody had checked.

## Exercise

In the panel, set every element to verified and note the category. Change one element to degraded and note it again.

Then say, in one sentence each, what the category told you and what it could not have told you.
