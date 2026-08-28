# Onward to Professional

You can now read this deck. The next tier asks a harder question about the same file: is any of it true?

## The one fact that motivates everything next

The deck contains 900 column depths. Six of them were measured.

The other 894 are the output of an interpolation through those six, sampled at cell centres. That is not a criticism, it is how every grid is built, and it means the structure of this model is a hypothesis with six data points behind it.

The Professional tier opens that up: which interpolator, what it does at the wells, what it does between them, and what happens to a well that does not sit where the grid can reach it.

## What the Professional tier builds

**Structure from mapped data.** The six well tops become a surface through simple kriging, which is an exact interpolator at the data points. Five of the six wells come back to the last figure, and one does not, for a reason that is about the grid rather than the maths.

**The volumetric reconciliation.** The model contains an amount of oil. The field has a booked volume from the geoscience courses. Those two numbers were computed by the same engine on the same contact and they do not automatically agree, because they clip the oil at the contact in different ways. Making them agree costs something, and what it costs is the tier's central lesson.

**Fluid provenance.** The oil in this deck was designed. Running the same field's API and gas gravity through a standard correlation gives a measurably different fluid. Both are defensible and only one can be in the deck, and the deck must carry the one the model was matched against.

**Rock curves from the lab.** Where the 22 SWOF rows came from, why the endpoints sit where they do, and what the tables assume that the lab did not measure.

**Wells on a real field.** How map coordinates become cell indices, how a monthly production ledger becomes a rate schedule, and why the injectors are in the water leg.

## What changes about the work

This tier asked what each block DOES. The next asks where each number CAME FROM, and whether the chain that produced it survives inspection.

That is a different kind of reading. It means holding the deck against something else: the mapping, the booking, the lab report, the production database. A deck read on its own is always self-consistent, because it is one file. A deck read against its sources is where the disagreements live.

## Before you go on

Two things from this tier the Professional tier assumes.

**Know which section a number lives in.** Every question in the next tier is about a specific block, and the answer usually involves comparing it against a block in another section. A reader who has to search for PVTO will lose the thread.

**Take the units seriously.** The next tier moves between metres and feet, between stock tank and reservoir barrels, and between scf and Mscf, several times per lesson. Every one of those seams is a place a real study has gone wrong.

## Exercise

First, write down the six numbers you were graded on in this tier and, for each, one question the Professional tier could ask about where it came from.

Second, the deck has 900 column depths and six measurements. Estimate how many cells lie more than 500 m from the nearest well, and say what that implies about how much of this model is interpolation.
