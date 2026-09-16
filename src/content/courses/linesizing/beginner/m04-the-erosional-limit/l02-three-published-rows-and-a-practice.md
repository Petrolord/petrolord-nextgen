# Three published rows and a practice

The module carries three c factor rows. Two of them come from API RP 14E and the third is recorded as operator practice. All three are overridable.

{{panel:fc-liquid-explorer}}

## The table

| id | label | c |
| --- | --- | --- |
| continuous | RP 14E continuous service | 100.000000 |
| intermittent | RP 14E intermittent service | 125.000000 |
| cleanInhibited | Clean, inhibited service (operator practice) | 175.000000 |

Continuous service is the line that runs all the time. Intermittent service is allowed more because it spends less of its life flowing. The third row belongs to clean, inhibited duty, where an operator has judged the fluid gentle enough to run faster.

## An unknown id does not refuse

Ask for a service the table does not carry and nothing objects. `erosionalC('sandLaden')` comes back as the continuous row, id `continuous`, label `RP 14E continuous service`, c 100.000000.

Read what that return actually does. It does not throw, it does not come back empty, and it does not carry the name it was asked for. It answers under its own label, so a caller who reads the label sees exactly which row it got. A caller who reads only the c factor sees a plausible number and no sign that the request was unrecognised. The label is the guard here, and it works for a caller who reads it.

## Held for the literature

These three figures are taught as a limit in this course and never graded. The recommended practice says its own figures are conservative, and the third row is labelled as operator practice with no publication behind it.

The discipline that follows is simple. Every graded erosional value in this course states its own c factor, so the c factor is a stated condition of the question rather than something a learner is expected to know. When a c factor is not stated, the honest answer names the one it assumed.

## Why an override exists at all

A c factor is a judgement about a fluid and a service life, and it is the kind of judgement an operating company makes for itself. Leaving all three rows overridable means a company figure can be used directly, and the resulting velocity carries that provenance rather than pretending to a published one. It also means the two RP 14E rows can be left exactly as published, with any local view expressed as an override rather than as a quiet edit to the table.

## The mistake

Treating 100.000000 as physics. It is a coefficient in a recommended practice that describes its own values as conservative, and the answer it produces inherits that status. A velocity computed from it is a design allowance with a source.

## Exercise

Give the three c factors and say which of them is not from the recommended practice. Then say what the engine returns for a service id the table does not carry, and what a graded question in this course always states beside an erosional velocity.
