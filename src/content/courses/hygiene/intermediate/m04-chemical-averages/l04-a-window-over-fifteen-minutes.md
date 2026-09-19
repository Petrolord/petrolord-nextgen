# A window over fifteen minutes is refused

{{panel:hy-protection-chemicals}}

A STEL record totalling 17 minutes is refused. So is one totalling 16. A record of 11 minutes is accepted with a warning. The engine treats a record longer than its window and a record shorter than it in two different ways, and the difference is deliberate.

| record | what the engine does | field |
| --- | --- | --- |
| covers 11.000000 minutes | warns, averages over 15 | none |
| covers 15.000000 minutes | averages over 15 | none |
| covers 16 minutes | refuses | `periods` |
| covers 17 minutes | refuses | `periods` |

## The refusal, in the engine's words

The golden refusal on field `periods` reads:

> the periods total 16 min: a short-term exposure is a 15-minute window

The seventeen-minute record gets the same message with its own total:

> the periods total 17 min: a short-term exposure is a 15-minute window

## Why over is refused and under is warned

Under fifteen minutes, the unsampled remainder can be stated as zero and the arithmetic stays inside its definition: the sum of concentration x time over fifteen minutes. The assumption is visible and the warning names it. Over fifteen minutes, there is no rule in the source for what to do. Dividing seventeen minutes of samples by 15 would count seventeen minutes of chemical exposure inside a fifteen-minute window. Dividing by 17 would make it a seventeen-minute average, which is not a STEL. Trimming two minutes would mean choosing which two. Each is a decision the engine has no basis for, so it refuses and names the field. The judgement call J6 records it: the STEL divides by 15 and refuses over 15 minutes.

## The same pattern in the 8-hour TWA, with a difference

The 8-hour chemical TWA warns on both sides of eight hours and divides by 8 either way, because the regulation writes that division for any shift. It refuses a record longer than a day, because a shift cannot outlast the day it sits in, in its own words:

> the periods total 25 h: a shift covers at most 24 hours

It also refuses a concentration below zero, on the field that names the period:

> periods[0].concentration cannot be negative

The STEL's window is a definition, and the 8-hour TWA's divisor is a normaliser. That is why one refuses at sixteen minutes and the other accepts ten hours with a warning.

## A period with no length

A period whose minutes are missing is refused on the field that names it:

> periods[0].durationMin must be a finite number

Every refusal names the input it refused. When a STEL comes back as an error, read the field first: it tells you which sample to fix, and the message tells you why. A refused record is a record to repair and resubmit, and a figure produced by guessing around a refusal is a figure nobody can defend.

## Exercise

Open the protection panel's averages view and build a STEL record of two periods whose minutes total more than 15. Copy the refusal the engine returns and name the field it refuses. Then shorten one period until the total is 11 minutes, and copy the warning the engine gives instead. Finally, state in one sentence why the engine accepts a ten-hour chemical record with a warning and refuses a sixteen-minute STEL record.
