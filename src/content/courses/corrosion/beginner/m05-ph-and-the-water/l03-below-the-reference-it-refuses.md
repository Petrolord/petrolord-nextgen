# Below the reference it refuses

{{panel:fc-rate-explorer}}

Set an in situ pH below 4.000000 and this engine returns no factor at all. It does not return a factor of one, and the difference between those two behaviours is the whole of this lesson.

Here is the refusal in the engine's own words, for one pH below the reference:

> the pH correction is only defined at or above its reference pH of 4, and pH 3.5 is below it. What the correlation does below the reference is not established in this module, so no factor is returned rather than a factor of 1

The same answer comes back at a pH of 2.000000, at 3.000000, at 3.500000 and at 3.999900. Each refusal carries the reference of 4.000000 with it, so a caller can print the boundary to the user rather than saying only that something is wrong. At a pH of exactly 4.000000 the engine returns a factor of 1.000000000000, which is the boundary reached by definition.

## Why a factor of one would be the wrong silence

A more acid water is not a less corrosive one. A factor of one below the reference would mean the correction quietly declines to reduce the rate and quietly declines to raise it, which is the least limiting answer available to a question the module cannot answer. It would also make an input on the screen inert across a whole range: two decades of hydrogen ion activity would move the headline number by nothing while the box still accepted them.

Refusing instead puts the limit where the user can see it. The screening stops, the message names the reference, and the reader is left in no doubt that the model has run out of ground rather than that the acid does not matter. A refusal also travels well. It reaches a colleague reading the screenshot a week later, which a silently unremarkable number does not, and it forces the next decision to be made by a person with a reason instead of by a default.

## Two guards that say different things

The reference guard and the range guard are separate and it is worth keeping them apart. The range guard enforces a pH between nought and fourteen and its message names the value typed, for example that an in situ pH between 0 and 14 is required. The reference guard sits inside that range, at 4.000000, and refuses a chemically valid pH because the correlation has nothing to say there. A blank box is refused by a third message, because a blank is a question rather than a value.

What the published correction does below its reference is held for literature, like the slope and the reference itself.

## Exercise

Type a pH of 3.500000 into the shipped case and copy down the message you are given, word for word. Then type 3.999900, then 4.000000, and record what comes back at each. Write down the factor at the boundary and say what a screening would have reported for the rate at a pH of 3.500000 if the engine had answered with a factor of one instead. Compare that imagined rate with the 1.341754 mm/yr the shipped case gives at a pH of 4.000000.
