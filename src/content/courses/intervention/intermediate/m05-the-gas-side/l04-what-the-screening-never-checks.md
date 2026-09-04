# What the screening never checks

`screenTreatments` reads five fields off a well row and one field off a diagnosis. Everything else about the well, and most of the diagnosis, is not looked at.

{{panel:pd-channel-explorer}}

## The whole input

| Read | Never read |
| --- | --- |
| water cut, percent | any oil, water or gas rate |
| skin | any pressure, drawdown or permeability |
| gas-oil ratio and expected gas-oil ratio, scf/stb | the drainage radius and the wellbore radius |
| flowing, true or false | the two fit qualities in the diagnosis |
| the mechanism id | the window start the diagnosis returned |

## It prices nothing, and it could

The module knows what removing skin is worth. On the teaching geometry of ELELENWO-4, a case this course built rather than a published one, a drainage radius of 1180 ft and a wellbore radius of 0.354 ft, a designed acid job taking the skin from 7.5 down to -2.2 returns a multiplier of 2.879215612184. The screening returns matrix acid as candidate on that same skin of 7.5, by the rule that a skin above 2 is a candidate, above 0 is marginal, at or below 0 is no, and unknown when none was entered. It never calls the multiplier, and no verdict in the seven carries a cost, a volume, a duration or a rate.

## It never reads the reading it was handed

The diagnosis passed in holds a ratio fit quality of 0.921895186 and a derivative fit quality of 0.998513658, both as fractions, and a window start of 250.242976 days. The screening takes the mechanism id and leaves the rest, so a verdict issued on a 19-sample late window and one issued on a 35-sample window look identical in its output. The two inputs also arrive separately, and nothing checks that they describe the same well or the same period.

## The mistake

Reading a candidate as a decision. Three treatments come back candidate at once on this well and none has been sized, costed or set against the others. The verdict establishes that a treatment is arguable on the two or three fields it read, which is worth having and is not a recommendation.

## What you can now say

Read a diagnosis and say which of its numbers decided it, name the threshold it was compared against and the window it was measured over, then say what the screening did with the answer and which gate fired first. Every one of those verdicts is the engine asserting something with no golden behind it: `chanDiagnosis`, `screenTreatments` and `rankTreatments` are checked against nothing.

## Exercise

Screen one well twice in the panel, changing only the mechanism, and list every diagnosis field that moved and every field the screening acted on.

Then name the number the module can compute that would turn a candidate into a decision.
