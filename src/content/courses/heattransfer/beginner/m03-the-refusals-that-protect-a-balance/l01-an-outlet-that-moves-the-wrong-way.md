# An outlet that moves the wrong way

An exchanger takes heat out of the hot stream and puts it into the cold one. That fixes the direction both outlet temperatures may move in. The hot stream must leave cooler than it entered and the cold stream must leave warmer. Neither is a subtlety, and both are typed the wrong way round often enough that the balance checks them before computing anything at all.

{{panel:fc-exchanger-explorer}}

## The hot stream cannot leave hotter

Give the studio streams a hot outlet of 320 F against a hot inlet of 300 F and the balance refuses. The message quotes both temperatures back, in that order, and then says what the direction means: an exchanger takes heat out of this stream.

Work out what would happen without the check. The hot drop would come out negative, the duty with it, and the cold outlet would land below the cold inlet. Every one of those prints perfectly well. A negative duty in a report looks like a sign convention rather than a mistake.

## The cold stream cannot leave colder

The mirror of it. A cold outlet of 94 F against a cold inlet of 100 F is refused, the two temperatures are quoted, and the message says an exchanger puts heat into this stream. Same shape, same place in the sequence, opposite stream.

Having both guards rather than one matters because the two statings are independent. You can reach the balance through either outlet, so each door needs its own check. A module that guarded only the stating it expected people to use would pass the other one straight through.

## A duty of zero is not an exchanger

The third guard is on the duty itself. A stated duty must be positive Btu an hour, and a duty of 0 is refused with a named string that quotes the zero it was given. A negative duty is refused the same way.

A zero is what an empty box and a cleared field both look like by the time they reach a number. A saved study reopened with one field blank arrives here, and the difference between a refusal and a zero duty carried quietly onward is the difference between a question and a wrong answer with a surface attached to it.

## All three are checked before anything is computed

Notice where these three sit. They run before the duty, before the outlets, before any arithmetic at all. That ordering is deliberate. A guard that runs after the computation is a guard on a number that has already been used, and by then the wrong value may have reached a log mean or an area.

It also keeps the messages readable. Because nothing has been computed yet, each message can quote only the inputs, which is exactly what the person reading it needs to change.

## Exercise

Write down the two wrong-way refusals with the temperatures each one quotes. For each, work out by hand what the duty would have been if the check had not run, and say what sign it would have carried. Then say what an empty input box looks like by the time it reaches the duty guard.
