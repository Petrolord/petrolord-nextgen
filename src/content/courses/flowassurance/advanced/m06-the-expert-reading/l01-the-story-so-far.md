# The story so far

A flow assurance verdict has two halves, a temperature and a chemistry, and each half is a number the engine computes set against a number it does not.

## The half that is a temperature

On TEACHING LINE AKASO SPUR, a construct of this course and not a published case, the laboratory supplies a 71.00 degF flowing hydrate boundary and a 78.00 degF boundary once the line packs up after a shutdown. Neither engine computes either figure and both module headers say so. With heat loss alone the line arrives at 89.316029952695 degF on an ntu of 1.219288832549, which is 18.3160299527 degF outside the flowing boundary. Pass the same line its pressures and the engine returns an arrival of 64.1160299527 degF, which is below that boundary. One term, applied the way this module applies it, moves the answer from one side of a laboratory number to the other.

## The half that is a chemistry

The same line asks for 36.00 degF of shut-in subcooling plus a 5.00 degF margin. The requirement sizes 36.0035520084 weight percent methanol with the Hammerschmidt inverse, checks that concentration with Nielsen-Bucklin, and reports a delivered depression of 35.6195882812 degF. Both numbers come back in one object, `ok` reads true, and nothing in the function sets the second against the first. Above the concentration where the two relations part, that check is the whole argument, and it is never made.

## What both halves have in common

Neither half fails. Both return an answer with `ok: true`, no note and no error, and in both cases the evidence that the answer is wrong is a field of the same object, printed and unread. The ceiling shows the pattern in its clearest form: MAX_PRACTICAL_WT_PCT is 70.0 weight percent, and at that concentration the two relations read 170.0478568456 degF and 108.6168490752 degF. A limit is being enforced. It is being enforced in the coordinates of the relation the module itself says over-predicts.

## What the tier is actually about

Not that either engine is unreliable. Every published quantity agrees with an independent oracle, and the resistance stack, the relaxation length, the arrival and the depression relations are sound. The tier is about the seams: where two numbers that belong to each other are computed and never compared, and where a boundary somebody else measured is treated as though the engine owned it.

## The mistake

Reading a returned object as a conclusion. Each function answers exactly the question it was asked, correctly, and the question a design needs answered is usually one field further on.

## Exercise

Write down the two numbers in a flow assurance answer that no engine in this course computes, and say where each of them comes from.

Then name the two returns you would refuse to act on without reading a second field, and say which field.
