# What the engine refuses

The vendored golden carries 57 refusal cases, and every one is called through the engine and must come back with `error` and the name of the field it refused. Every function the engine exports returns either a finite result or that refusal. It never returns a number it cannot stand behind.

This lesson reads the refusals that belong to the noise dose and its TWA. Each message below is the engine's own words.

## Refusals about the criterion

A criterion must be one of the three presets or a complete set of parameters. Ask for a preset the engine does not carry and it refuses on `criterion`:

> criterion 'ACGIH' is unknown: use one of OSHA_PEL, OSHA_ACTION_LEVEL, NIOSH_REL or pass the parameters

That refusal also keeps licensed material out of the course. The engine embeds no limit table of its own, and a licensed limit is never quoted here. A criterion someone types by hand must carry a usable decibel exchange rate and a criterion level:

> exchangeRateDb must be a finite number of dB above zero

> criterionLevelDbA must be a finite number of dBA

## Refusals about the record

A noise dose needs periods, and each period needs a level and a duration the engine can use.

| golden id | refused field | what was wrong |
| --- | --- | --- |
| dose-empty | `periods` | no periods at all |
| dose-negative-duration | `periods[0].durationH` | a negative duration |
| dose-missing-level | `periods[1].levelDbA` | a level that is missing |
| dose-over-24h | `periods` | a record longer than a day |

The messages, verbatim:

> periods must be a non-empty array

> periods[0].durationH cannot be negative

> periods[1].levelDbA must be a finite number

> the periods total 25 h: a daily dose covers at most 24 hours

The last one is judgement J4, and a later lesson in this tier reads it in full. Notice that each refusal names the exact period at fault by its position, so a hygienist can go straight to the row in the instrument download.

## Refusals about the TWA

A TWA restates a noise dose, and the restatement has an edge. A noise dose of zero, or below zero, has no TWA, and the engine says so on `dosePct`:

> dosePct must be a finite percentage above zero: a zero dose has no TWA

The same door refuses a coefficient below zero on `twaCoefficientDb` and a limit noise dose of zero on `limitDosePct`. The inverse door, `noiseDoseFromTwaPct`, refuses a TWA that is missing on `twaDbA`. A refusal is information about the input. A wrong number would carry no such signal and would travel into a report unnoticed.

## Reading a refusal

When the engine refuses, read the field before the message. The field says which input to go back to; the message says what the input must be. Neither is a verdict on the worker or the workplace. Both are statements about the data you handed over.

## Exercise

A colleague hands you a dosimeter download in which the periods add up to 25 hours and the second period has no level. Using the golden ids and fields in the table above, name the two refusals the engine gives, quote each message as it would appear, and say which one you would expect to see first if you fixed the other and ran it again.
