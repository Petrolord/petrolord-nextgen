# Unity, and why the shape changes there

An absorption factor of exactly one is a special case in the arithmetic and a boundary in the behaviour, and those two facts are worth keeping apart. This lesson is about what happens at one, and about how to tell a limit from a patch.

## The indeterminate form

At an absorption factor of exactly one the closed form is indeterminate, so the engine takes a separate branch: the stages over the stages plus one. A reader who has been burned before is right to be suspicious of that. A separate branch at a singular point is exactly where a different answer can be substituted without anything downstream noticing, and the substitution will look reasonable, because the general form genuinely has nothing to say at that point.

{{panel:fc-absorber-explorer}}

## The test that settles it

The way to tell a limit from a patch is to walk up to the point from both sides and see whether the branch is where the general form was heading anyway.

| A | removal at 12 stages | removal at 200 stages |
| --- | --- | --- |
| 0.999999999000 | 0.923076923 | 0.995024876 |
| 1.000000000000 | 0.923076923 | 0.995024876 |
| 1.000000001000 | 0.923076923 | 0.995024876 |

Either side of unity by a billionth the answer is continuous with the branch, which is what says the branch is a limit rather than a patch. The general form approaching from below, the branch at the point itself, and the general form approaching from above all land in the same place.

That is a test worth carrying to other engines. A special case in a formula is not a defect. A special case whose answer does not join up with the formula either side of it is.

## The shape on each side

The branch also tells you what kind of device the column is at that exact point. The removal there is set by the stage count alone, so every unit of separation is bought in steel and none of it in solvent. That is true nowhere else on the surface.

Move a hair below and a ceiling appears at the factor itself, and stages are walking the answer towards something they can never pass. Move a hair above and the ceiling is gone entirely, and stages keep buying removal all the way towards total. Nothing physical changes across that hair. What changes is which of the two dials is binding, and the relation is simply reporting which one it is.

That is why the surface is read by column. A single row of removals, read across, mixes the two regimes into one line of numbers that look like a trend and are nothing of the kind.

## Exercise

Record the removal at 12 stages and at 200 stages on each of the three rows above. Say what the engine does differently on the middle row, and state the test that distinguishes a branch which is a limit from a branch which is a patch.
