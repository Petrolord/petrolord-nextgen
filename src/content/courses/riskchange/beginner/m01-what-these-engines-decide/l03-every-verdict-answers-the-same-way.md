# Every verdict answers the same way

An engine that only ever says yes is easy to build and useless to rely on. The engines in this course say no, or decline to answer, whenever the record does not support an answer. Learning to read that answer is as important as reading a band.

{{panel:rc-risk-explorer}}

## A refusal has one shape

Every verdict that can be refused comes back as an object with a field called `ok`. When `ok` is true the move or check is allowed. When it is false the object carries a `reason`, a sentence written for a user to act on. The four engines refuse in the same shape, so an app can show any refusal from any register in one place and the user reads the same kind of message every time.

A reason is written to be acted on. It names what is missing or who is not allowed, so that the next step is clear. You will meet those sentences word for word in the later tiers, where moving a change or a comment is refused. The scoring rules of this tier do not refuse a move, because a risk score moves nothing. They answer with a value, and when they have no basis for a value they say so in a value of their own.

## The declining answers of this tier

Three answers in this tier are the engine declining to guess.

| where | the declining answer | what it means |
| --- | --- | --- |
| a score read against the bands | "None" | there is no score to band |
| appetite | "Not set" | there is no basis to report a pass or a fail |
| days until a date | null | the date could not be read |

A likelihood of 2.5 against an impact of 4 scores 0 and bands "None", because a fraction is off the scale. A residual score of 6 with no target set reads "Not set" for appetite. The date "2026-02-30" parses to null, and its days until, counted from 2026-10-01, is null. In every case the engine could have produced a plausible number. It returns a named answer that means no answer instead, and it never guesses a level, a target or a date.

## Why a named answer beats a guess

A guessed answer is worse than no answer, because it looks exactly like a real one. A risk with a made-up level would sit in a band and be counted. A missing target read as a pass would put a risk inside appetite that nobody ever measured against anything. By returning "None", "Not set" or null, the engine keeps the gap visible, so the person who owns the record can fill it.

## The mistake

The mistake is to read "Not set" as a mild form of "Within appetite", or to read "None" as the lowest band below "Low". Neither is a grade. "None" is the one band that means no score, and "Not set" is the engine declining to report a pass it has no basis for.

## Exercise

Record the score and band for a likelihood of 2.5 against an impact of 4, the appetite answer for a residual of 6 with no target, and the parsed value of "2026-02-30". For each, state the rule that produced a declining answer, and record the two fields a refused verdict object carries.
