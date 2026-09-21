# A record longer than a day

{{panel:hy-noise-dosimeter}}

Hand the engine a dosimeter record whose periods total 25 hours and it refuses on the field `periods`, in these words:

> the periods total 25 h: a daily dose covers at most 24 hours

That is judgement J4: noise, LEX and chemical periods totalling over 24 hours are refused. A noise dose is a daily quantity. A record that runs past a day cannot belong to one day, so the engine will not add it up as though it did.

## Why refuse instead of trimming

The engine could quietly keep the first 24 hours and drop the rest. The course prints the refusal and judgement J4 and no remedy beside them. The reading behind it is the instructor's: nothing in the record says which hours belong to which day. A download spanning two shifts, or an instrument left running overnight, holds two days' worth of periods, and splitting them is a decision for the person who knows the work pattern. The refusal hands that decision back with the field named.

| golden id | refused field | message |
| --- | --- | --- |
| dose-over-24h | `periods` | the periods total 25 h: a daily dose covers at most 24 hours |
| dose-negative-duration | `periods[0].durationH` | periods[0].durationH cannot be negative |
| dose-empty | `periods` | periods must be a non-empty array |

The three rows are the record-shaped refusals of the `noiseDose` door. Each is about the periods as a whole or about one period's hours, and each is caught before any arithmetic runs.

## A long reference duration is a different thing

Do not confuse the record limit with the reference duration. A reference duration can be much longer than a day, because it is a statement about an allowance. At 80.000000 dBA the OSHA reference duration is 32.000000 h, and at 85.000000 dBA it is 16.000000 h. On NIOSH, 80.000000 dBA gives 25.398417 h. Nobody works those hours. They are how long the allowance would last at that level.

So a reference duration over 24 hours is normal and useful. A record over 24 hours is refused. The first describes a criterion, the second describes the data.

## What to do with a long download

The engine stops at the refusal, so this section is practice. Split the download into days at the points the work pattern says a day ends, and run each day as its own record. If the periods are in the right order and the day boundary falls inside a period, split that period into two with the hours on each side. Then report one noise dose per day and per criterion. Shifts that run longer than eight hours but still fit inside a day are accepted by this door; the Expert tier looks at what the regulations say about them.

## The field tells you where to look

Every refusal in this module names its field. `periods` points at the record as a whole. `periods[0].durationH` points at the first period's hours. When a refusal comes back, go to the named field in the download before changing anything else.

## Exercise

A download runs two shifts together as one record whose periods total 25 hours. Say which refusal the engine gives, name the field and quote its message. Then take a single period of 16.000000 h at 85.000000 dBA inside one day. Using the OSHA reference duration of 16.000000 h at that level, work out the share of the action level allowance it would use, say why the engine accepts it, and say what the PEL setup would report for the same period.
