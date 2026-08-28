# What this course does not do

Courses are as much defined by their edges as by their content, and this one has sharp edges in three directions. Stating them now saves you from expecting something that is not coming.

## It does not run a simulation

You will not run a deck in this course, and no exercise or capstone here grades a simulated result.

That is a deliberate boundary rather than an omission. A deck is an input artifact, and building one that is correct, complete and defensible is a distinct skill from operating a solver. It is also the skill that decides whether the solver's answer means anything.

Petrolord's Reservoir Simulation Studio is where a Petrolord deck goes to be run. What you learn here is what to hand it.

The Expert tier does spend a module on reading results, because a deck writer who cannot read a results file is writing blind. Nothing in that module is graded, for the same reason nothing else here is: the engines this course is built on emit decks and do geometry, and they do not solve flow equations. A course should grade what it can check.

## It does not re-derive the physics

The relative permeability curves in this deck came from the SCAL and Displacement course. The oil properties came from Material Balance. The layer column came from Waterflood Management. This course takes their answers and puts them in a file.

Where those answers disagree with each other, or with the volumetric booking, this course says so loudly, because a deck is exactly where such disagreements surface. What it does not do is re-open them. If you want to know why the Corey exponent is 2.5, that argument lives in the SCAL course.

## It does not teach gridding

The Ekene deck's structure comes from kriging six mapped well tops. The Professional tier explains what that means and what it costs, because you cannot audit a deck without knowing where its grid came from.

But geological modelling, upscaling, corner-point geometry, faults and local refinement are a different discipline with its own tools. This deck is a Cartesian box with a mapped top surface, which is the simplest structure that is still honest, and it is enough to teach every deck-construction idea in this course.

## What it does do

Three things, one per tier.

**Associate**: read a deck. Know what every section and every block is for, what the units are, and what the tables and the schedule are saying.

**Professional**: know where each number came from, and whether the deck adds up. The structure against the mapped data, the volumes against the booking, the fluid against the model it was matched to.

**Expert**: build one and prove it. Turn a trajectory into completions, turn a production history into a schedule, make the calibration decision and report it, and know what the validator will and will not catch.

## The misconception to avoid

"Deck literacy is a beginner topic and the real skill is running the simulator." The proportion of simulation studies that go wrong in the solver is small. The proportion that go wrong because the deck described something other than the field, or because a convention was assumed rather than stated, is large. The reason is simple: a solver error is loud and a deck error is silent.

## Exercise

First, write down one question about the Ekene field that this course could answer and one it could not, and say what you would need in order to answer the second.

Second, a colleague sends you a deck and a set of results and asks whether the forecast is credible. List the three things you would check in the deck before looking at the results at all.
