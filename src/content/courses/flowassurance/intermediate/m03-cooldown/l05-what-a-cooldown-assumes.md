# What a cooldown assumes

`cooldownTime` checks that the start is above ambient and that the target is above ambient. It never checks the start against the target, and on that pair it returns a negative number of hours with `ok = true`.

{{panel:pd-line-explorer}}

## Three branches, one of them missing

All three runs here are on TEACHING LINE AKASO SPUR, a teaching construct with a 45.0 degF seabed and not a published case.

A start of 40.0 degF, below the seabed, is refused: the fluid is already at or below ambient, so there is nothing to cool. A target of 40.0 degF, below the seabed, returns `ok = true`, hours as Infinity, a time constant of 8.6008917110 hr, 0 stations and a note saying the line settles at ambient (45 F), which is above the target, so it never reaches it.

That branch is handled well: an Infinity, a meaningful time constant, an empty station list and a sentence explaining it. It is the shape the third branch should have had.

## What the third branch returns

The line stops with its far end at 64.1160299527 degF, and once it packs up its hydrate boundary moves to 78.00 degF, above where the line is. Asked for the time to fall from 64.1160299527 degF to 78.00 degF against the 45.0 degF seabed, the engine returns `ok = true`, hours = -4.6959175559, a time constant of 8.6008917110 hr, no note and no error. The log term is ln((64.1160 - 45.0)/(78.0 - 45.0)) = -0.5459803139.

It also returns 25 stations, which run backwards in time and warm up.

| Station | t, hr | Temperature, degF |
| --- | --- | --- |
| 00 | 0.0000000000 | 64.1160299527 |
| 16 | -4.6959175559 | 78.0000000000 |
| 24 | -7.0438763338 | 88.3582812985 |

The table rises 24.2422513458 degF on a line just shut in against a colder seabed.

## The answer it should have given

There is no no-touch time. The line is inside the shut-in hydrate envelope from the moment it stops, and the honest return is a refusal, not minus 4.6959175559 hr.

## The same module gets it right elsewhere

Put the mirror question to `uForArrivalTemp`, an inlet of 64.1160 degF against a target of 78.00 degF, and it refuses: the fluid already enters below the target, so insulation is not the problem. Two functions in one file, one pair of temperatures, opposite positions.

## The careful mistake

Believing a sign. A procedure that takes the magnitude and drops the sign turns the module's most dangerous case into a comfortable 4.6959175559 hr of margin. Check the start against the target before you call, because nothing in the return will.

## Exercise

Run a cooldown whose target is above its start and record the hours, the note and the last station.

Then say what the honest answer is, and which branch already shows how to say it.
