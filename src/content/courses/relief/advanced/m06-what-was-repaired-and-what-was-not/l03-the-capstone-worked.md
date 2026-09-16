# The capstone worked

This lesson is about the engine as it ships today. It is a working method for the Expert capstone, which asks for six readings on one plant and marks them at the precision the quantity class prints at.

{{panel:fc-blowdown-explorer}}

## The six, and what each rests on

Four of them come from one blowdown call: a starting inventory in lb, a time in s, a final temperature in degR, and the pressure below which the choked assumption stops holding, in psia. Two come from the point source: an intensity in kW/m2, and a distance in m at an allowable you are given.

Every one of the six is computed in the audit sense. None reads a held figure, and that is worth understanding rather than accepting.

## Why the four blowdown answers are clear of the held items

The march has one stated limit that could compromise an answer: the choked-flow assumption and the floor it stops holding below. The way to be clear of it is to work well above it and confirm that from the call itself. Read the returned floor, read your end pressure, read the warning field. An answer taken from a call whose warning reads `null`, at an end pressure comfortably above the returned floor, does not rest on the question at all.

Where a method has a stated limit, the cheapest way to a defensible number is to stay clear of the limit and show that you did.

## Why the radiation answers are clear of the labels

The customary allowable intensities and their labels are held for literature, and avoiding them is equally simple. State the heat release in kilowatts, so no rate and no heating value has to be converted for you, and state the allowable as a project figure. Then neither answer has read a row of the held table, and the distance you report is the inverse route's answer to a question you posed.

Say so when you report it. A distance beside a stated allowable is auditable. A distance beside an exposure label is not.

## The working method

Write the case down first: every input, with its unit, before any call.

Make one call per answer and keep the whole returned object rather than the field you wanted. The accounting fields are what let you check the answer, and you cannot check what you discarded.

Read the warning field before the answer, every time.

Record each figure at the precision its quantity class prints at, which is six decimals for a time, a temperature, a pressure, an intensity and a distance, and four for a mass. Rounding further is a different answer.

Then say, of every figure you hand in, whether the engine computed it, typed it, or holds it for literature. If you can do that for all six, you have understood this tier.

## Exercise

List the six readings the capstone asks for with their units, and say which call each comes from. Explain why a blowdown answer taken above the returned choked floor with an empty warning field does not rest on a held item. Explain why stating a release in kilowatts and an allowable as a project figure keeps the two radiation answers clear of the held table. Then write out the working method as five steps.
