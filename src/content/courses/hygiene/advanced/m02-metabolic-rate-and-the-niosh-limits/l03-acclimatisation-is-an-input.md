# Acclimatisation is an input

{{panel:hy-heat-stress}}

The teaching hour, a time weighted WBGT of 29.066667 C at a time weighted metabolic rate of 300.000000 W, assessed as acclimatized, meets the NIOSH heat REL of 28.213106 C with a margin of -0.853561 C. Assessed as unacclimatized, it meets the RAL of 24.972590 C with a margin of -4.094076 C. The limits and both margins are the NIOSH 2016-106 section 8.1 equation, checked for transcription only, and no margin is graded in this course.

## One hour, two assessments

The engine's door `nioshHeatAssessment` takes a WBGT hour, a metabolic hour and one more input: whether the worker is acclimatized. True selects the NIOSH heat REL and false selects the RAL. The two averages are the same either way. Only the limit changes.

Every limit and margin in this table is the NIOSH 2016-106 section 8.1 equation, checked for transcription only.

| acclimatized | criterion | time weighted WBGT, C | time weighted M, W | limit by the equation, C | margin, C | engine flag `exceeds` |
| --- | --- | --- | --- | --- | --- | --- |
| true | NIOSH_REL | 29.066667 | 300.000000 | 28.213106 | -0.853561 | true |
| false | NIOSH_RAL | 29.066667 | 300.000000 | 24.972590 | -4.094076 | true |

The margin is the limit less the measured average, so a negative margin is an hour above its line. The engine's flag reads true both times. That flag is a verdict word, and no verdict word is graded in this course; it is shown here so you can see what the engine returns.

## Why the engine cannot infer it

Acclimatisation is a fact about the worker. A body that has worked in heat stress for days sweats sooner and more, and tolerates more. Nothing in a WBGT record or a metabolic record carries that fact, so the engine refuses to guess. It demands a boolean and refuses anything else on `acclimatized`:

> acclimatized must be true (REL) or false (RAL)

The refusal fires on a missing value and on a word typed in place of a boolean. A form that offered a default would hide the most consequential choice in the assessment behind whatever the default happened to be.

## How much the choice moves

On the teaching hour the two margins differ by the NIOSH heat REL minus RAL gap at 300.000000 W, which is 3.240515 C by the section 8.1 equation, checked for transcription only. That is larger than the gap between the time weighted WBGT and the plain mean of its two readings. In this hour, the choice of criterion moves the answer more than the choice of averaging.

A new starter, a worker back from leave, or a crew rotated in from a cooler site is unacclimatized. The hygienist records the status for each worker, and the report names which limit it used. Where the status is unknown, the panel beside this lesson shows the hour assessed both ways, and a careful report quotes both rows with their status rather than picking the kinder one.

## Exercise

Take the two rows of the table and confirm that each margin is the limit less 29.066667 C. Then write the sentence a report would carry for the unacclimatized row, naming the criterion, the status of the equation and the fact that the verdict is the engine's flag.
