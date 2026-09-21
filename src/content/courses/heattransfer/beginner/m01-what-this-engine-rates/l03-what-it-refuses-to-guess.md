# What it refuses to guess

A refusal is an answer. Every door in this module refuses the same way, by putting a named string on an `error` key, so a caller writes one guard and it works at all twelve doors. What the string says is the interesting part, and reading a few of them teaches more about this engine than reading a few of its answers.

{{panel:fc-exchanger-explorer}}

## A refusal names the box rather than the physics

Look at what a refusal talks about. A hot outlet above the hot inlet comes back as a hot outlet of 320 F against a hot inlet of 300 F, with the reason spelled out as a sentence about an exchanger taking heat out of that stream. A cold outlet below the cold inlet comes back as 94 F against a cold inlet of 100 F. An arrangement this module does not carry comes back naming the three it does carry and saying that it will not fall back to one of them.

In each case the message names the input that is wrong, quotes the value it was given, and then says what that input means. A message reading only that the balance is infeasible would be true and useless. Somebody with a saved study open needs to know which box to change.

## Three doors hand back more than a message

On the probes this course runs, three of the twelve doors handed back more than a message: they returned the numbers that produced the state they refused. A refusal that carries its evidence lets an interface show why a state is impossible rather than only that it is.

The clearest pair is on the balance. A duty that crosses the two streams comes back with the two temperatures that duty implies, labelled `thOutIfReached` and `tcOutIfReached`, sitting beside the message. That is the whole argument in two numbers. The log mean carries evidence of its own in the same spirit: asked for a driving force across streams that have crossed, it hands back the two end differences it found, which are 0.000000 and 0.000000 degF on the case this course probes.

Three is what those probes measured rather than a property of the engine, so read it as a floor rather than a ceiling.

## An interface that shows only the string throws that away

A panel that renders `error` and stops has discarded numbers the engine went to the trouble of computing. The two implied outlet temperatures are what make a crossing duty obviously wrong to a reader who has not done the arithmetic.

## What a refusal is protecting

Every refusal here stands between you and a number that would look fine. A negative surface, an infinite coefficient and an outlet on the wrong side of an inlet all print perfectly well. The refusals are the places where this engine declines to invent, and knowing where they sit is knowing where the method ends.

## Exercise

Write out three refusal messages from this lesson and mark, in each one, the part that names the input, the part that quotes the value and the part that explains the meaning. Then say which of the three would still be useful if the quoted value were removed, and why.
