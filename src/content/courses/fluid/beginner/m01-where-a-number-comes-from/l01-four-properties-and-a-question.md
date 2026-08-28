# Four properties and a question

Everything a reservoir engineer computes about oil and gas rests on four numbers, and this course is about where those four numbers come from.

## The four

**Solution gas ratio, Rs.** How much gas is dissolved in a barrel of oil at reservoir conditions, in standard cubic feet per stock tank barrel. It sets how much gas comes out of solution when pressure falls.

**Formation volume factor, Bo.** How many reservoir barrels one stock tank barrel occupies down there, in rb/stb. It is always above one for a live oil, because dissolved gas swells it.

**Viscosity, mu.** How hard the oil is to move, in centipoise. It sets everything about how the fluid flows.

**Bubble point pressure, Pb.** The pressure at which the first bubble of gas appears. Above it the oil is undersaturated and holds all its gas; below it, gas separates and the reservoir behaves completely differently.

A gas description adds the z factor, the gas formation volume factor Bg and gas viscosity, and a water description adds Bw and water viscosity. That is the whole black-oil description, and every course before this one has used it.

## What they decide

The material balance course used Bo and Rs to convert produced volumes into reservoir voidage. The waterflood course used the viscosity ratio to compute a mobility ratio and from there a sweep efficiency. The simulation course put all of them into a deck as tables. None of those calculations is more accurate than the fluid description underneath it.

That is the reason this course exists. A five percent error in Bo is a five percent error in every oil-in-place number a study will ever quote, and it does not announce itself.

## The question

Where did each of those four numbers come from.

There are only a few possible answers and they are not equally good:

**A laboratory measured it** on a sample of this fluid, in an experiment designed for the purpose.

**A correlation produced it** from gravity, temperature and gas gravity. The correlation was fitted to somebody else's oils.

**An equation of state computed it** from the fluid's composition, and the equation was adjusted until it reproduced measurements of this fluid.

**Somebody estimated it** by a method nobody has checked against anything.

All four appear in real studies. All four are legitimate in the right place. Presenting the fourth as though it were the first is not.

## Why the question is hard to answer

Because a number in a report does not carry its provenance. A table of Bo against pressure looks identical whether it came from a laboratory or from a correlation, and by the time it reaches the third document that quotes it, nobody remembers.

The simulation course made the same point about a deck: a deck read on its own is self-consistent, because it is one file. A fluid description read on its own is exactly the same problem.

## What this course does about it

The engine this course runs on states the provenance of every quantity it returns. That is unusual and it is the reason the course can be built: instead of the learner having to reconstruct where a number came from, the engine says so, and the skill becomes reading what it says and knowing what to do about it.

The next lesson is that ladder.

## The misconception to avoid

"PVT is an input, so it is somebody else's problem." It is an input to everything and it is produced by a chain of decisions that are usually undocumented. An engineer who cannot say which of the four answers above applies to their Bo has not finished reading their own model.

## Exercise

First, list the four black-oil properties and say, in one sentence each, what a study uses them for.

Second, take a report you have read, or a model you have worked with, and try to say where its formation volume factor came from. If you cannot, note what you would have to go and find out.
