# The one-foot method, at two conditions

The shell thickness of a vertical tank comes out of a relation simple enough to write on a napkin. The head of liquid one foot above the bottom of a course sets the hoop stress in that course, and the thickness follows. What makes it a design calculation is that the engine runs it twice.

## Two conditions, one course

Every course is evaluated at the design condition, with the product in the tank, and at the hydrostatic test condition, with water in the tank. For the bottom course of this tank, carrying a product with a specific gravity of 0.912400 under a head of 34.600000 ft, the engine returns:

| quantity | value |
| --- | --- |
| t design, in | 0.214385 |
| t test, in | 0.218926 |
| required, in | 0.218926 |
| governed by | hydrostatic test |

The required thickness is the largest of what the two conditions ask for and what the stated minimum plate thickness asks for. On this course the water test is what governs, and the engine returns that word rather than leaving a reader to work out which of the three it used.

## Why a returned word matters more than a returned number

A thickness of 0.218926 in on its own is unreadable. It does not say whether a heavier product would change it, whether a lighter one would, or whether it is sitting on a floor that has nothing to do with either condition. The governing word is what makes the number diagnosable, because it tells you which input the answer is currently sensitive to.

This is the habit the whole tier is built on. When a package returns a word alongside a number, the word is the thing you sweep. Move an input, watch the word, and the boundary announces itself without anybody having to publish a threshold for it.

## What the method does not carry

The engine attaches a note to this calculation that a designer has to read before using the thickness:

> the one-foot method. API 650 sets a diameter above which the variable design point method is required instead, and that limit is not carried here, so a large tank must be checked against the standard before this thickness is used

That is a held item rather than a defect. The relation implemented here is the one-foot method and it is implemented correctly. What the package does not carry is the diameter at which the standard stops allowing it, so the engine says so on every course rather than letting a large tank through in silence.

Read that note as an instruction about scope. The answer is good inside the method's own range, the package cannot tell you where that range ends, so you check the diameter against the standard yourself.

## Exercise

Read the bottom course row in the shell view of the venting explorer and say which of the three candidates set the required thickness there. Then say which figure in that row would have to change, and in which direction, for a different candidate to govern.
