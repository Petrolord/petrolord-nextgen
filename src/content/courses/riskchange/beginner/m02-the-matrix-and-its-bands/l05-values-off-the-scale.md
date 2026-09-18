# Values off the scale

A level that arrives as 3, "3" or "3.0" is still level 3. This lesson is about everything that is not a level: a zero, a six, a fraction, a blank, nothing at all and a negative number. The engine has one answer for all of them, and it is the most important answer in the tier.

{{panel:rc-risk-explorer}}

## The probes

Each of these is a likelihood handed to the engine against an impact of 4.

| the likelihood given | as | impact | score | band |
| --- | --- | --- | --- | --- |
| a zero likelihood | 0 | 4 | 0 | "None" |
| a likelihood of 6 | 6 | 4 | 0 | "None" |
| a likelihood of 2.5 | 2.5 | 4 | 0 | "None" |
| a likelihood of 3.5 written as text | "3.5" | 4 | 0 | "None" |
| a blank likelihood | "" | 4 | 0 | "None" |
| no likelihood at all | null | 4 | 0 | "None" |
| a negative likelihood | -2 | 4 | 0 | "None" |

Every row scores 0 and bands "None". The scale is five WHOLE levels. A fraction is off the scale and unscored, the same as a level of 6 or a blank. The engine returns a score of 0 and the band "None" rather than guessing a level.

## Why a fraction is unscored

A likelihood of 2.5 looks reasonable. It sits between two levels, and an assessor who could not decide between 2 and 3 might well write it. The engine could round it, up or down, and produce a band. It does neither, because either choice is a guess about what the assessor meant, and the band that followed would carry that guess into every count and every report. The scale has five whole levels, so 2.5 is not one of them, and the honest answer is that the risk has not been scored.

The same reasoning covers a level of 6. The scale stops at 5. A 6 might be a typing error for 5, or a level from a company scale with more steps. The engine does not know, so it does not pick.

## What 0 and "None" mean here

Be careful with the 0 in the score column. It is a score of zero in the arithmetic sense only. The band "None" is the one band that means no score, and it is kept apart from "Low" so that an unscored risk can never be counted as a low one. On the OBODO register, OB-11 has a likelihood of 3 and an impact of 6. Its inherent score is 0 and its band is "None", because 6 is off the scale.

## A blank on the inherent axes

A blank likelihood and a missing one both score 0 here, for the same reason: there is no level to multiply. The next module shows that a blank behaves differently on a RESIDUAL axis, where there is an inherent level to fall back to. On the inherent axes there is nothing behind the blank.

## The mistake

The mistake is to see a score of 0 and read it as a very small risk. A score of 0 with the band "None" says the engine could not score the record. The fix is on the record: somebody has to choose a whole level from 1 to 5.

## Exercise

Record the score and band for a likelihood of 2.5, of 6, of "3.5" and of a blank, each against an impact of 4. Record OB-11's likelihood, impact, inherent score and inherent band. State the rule that produces every one of these answers.
