# Why this module grades nothing

Four quantities the engine will compute and this course will not certify.

## The rule

The course grades every tier except `screening`.

`screening` means an estimate nobody has checked against anything. Useful for ranking options and not for booking anything.

## Why teaching and grading are different acts

Teaching a number says: this exists, here is how it is produced, here is what it is worth.

Grading it says: producing this correctly is a competence we certify.

The second implies the number is worth producing to a standard. For a quantity whose error might be a factor of two, that implication is false, and certifying it would be telling a learner that a screening estimate is a deliverable.

## Why teach them at all

Because they appear on the screen and in reports, and a practitioner who cannot recognise one will use it as though it were measured.

That is the actual failure mode. Nobody is harmed by not knowing what an LBC viscosity is. People are harmed by seeing one in a table, next to a saturation pressure that is good to a tenth of a percent, formatted identically, and treating the two the same way.

So the module exists to make the difference visible.

## The precedent

The simulation course did the same thing. Its Expert tier had a module on reading a results file that graded nothing, because the engine emits decks and does not solve flow equations, so the course had no simulated result to check an answer against.

The reasoning here is different in its detail and identical in its shape: grade what can be checked, teach what a practitioner needs, and say which is which.

## The four

**LBC viscosity.** Every viscosity the compositional model reports. Untuned critical volumes make it order ten percent on gas and up to a factor of two on oil.

**Interfacial tension.** Weinaug-Katz with parachors, one of which belongs to a pseudo-component.

**The black-oil separator's gas partition.** A staged-liberation approximation that telescopes to the bubble point solution gas by construction.

**Anything the engine labels screening in the black-oil path**, which includes Glaso's solution gas and the Beal-Cook-Spillman viscosity, both flagged by audit.

## What a screening number is for

Ranking. Comparing two options where the systematic error is common to both and cancels in the comparison.

Deciding whether a quantity is worth measuring. A screening viscosity that comes out at 0.5 cp and one that comes out at 50 cp lead to very different decisions about how much to spend finding out.

Sanity checking. An order-of-magnitude answer that disagrees with a measurement by three orders of magnitude has found an error somewhere.

None of those requires the number to be right, which is exactly why they are the legitimate uses.

## The misconception to avoid

"A number the software computes is a number the software stands behind." The software computes what it was asked and labels what the answer is worth. Reading the label is the user's job, and a tool that makes the label available has done more than most. Ignoring it and then relying on the number is a choice the user made.

## Exercise

First, explain in two sentences why teaching a quantity and grading it are different acts.

Second, name the three legitimate uses of a screening number and say what they have in common.
