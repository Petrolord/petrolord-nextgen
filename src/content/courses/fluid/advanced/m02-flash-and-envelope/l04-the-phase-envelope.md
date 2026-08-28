# The phase envelope

The saturation pressure at every temperature, traced out, and what the shape tells you.

## What it is

Plot pressure against temperature and mark, for each temperature, the pressure at which the mixture first splits. The locus is the phase envelope.

Its left branch is the bubble point curve, its right branch is the dew point curve, and they meet at the critical point. Inside the loop the mixture is two phase; outside it, one.

## The features that matter

**The critical point**, where the two branches meet and the phases become indistinguishable.

**The cricondentherm**, the highest temperature at which two phases can exist. To the right of it the mixture is a single phase at every pressure, which is what makes a dry gas dry.

**The cricondenbar**, the highest pressure on the loop.

**The retrograde region**, between the critical point and the cricondentherm on the dew point branch. Here, lowering the pressure at constant temperature causes liquid to CONDENSE rather than vaporise, which is backwards and is what gives gas condensates their behaviour and their name.

## Why the shape classifies the fluid

Where the reservoir temperature sits relative to the envelope decides everything.

**Left of the critical point.** Reservoir temperature below the critical temperature. Depletion crosses the bubble point branch and gas comes out of solution. A black oil or a volatile oil.

**Between the critical point and the cricondentherm.** Depletion crosses the dew point branch and liquid drops out in the reservoir. A gas condensate, and the dropped liquid is often unrecoverable.

**Right of the cricondentherm.** Depletion never enters the two-phase region at all. A dry gas.

So the envelope plus one temperature line tells you the fluid type, and it tells you it from composition rather than from a rule of thumb about methane fractions.

## How the engine traces it

By running the saturation pressure search at a series of temperatures and classifying each boundary it finds.

That is the straightforward method and it has the limitations the previous lesson named. Near the critical point the two branches approach each other, the two-phase window narrows, and a scan on a fixed grid can step over it. The engine truncates near-critical tracing rather than drawing a curve it cannot support.

More sophisticated methods trace the envelope by continuation, following the curve as a parametric path rather than solving independently at each temperature, and they handle the critical region better. The engine does not implement one, which is a stated scope limit.

## What it is useful for

**Fluid classification**, as above.

**Facilities.** Knowing whether a stream will be two phase at a given pipeline pressure and temperature is a phase envelope question.

**Checking a characterization.** An envelope with the critical point in an implausible place is telling you the plus fraction was characterized wrongly, and it is a far more sensitive check than any single saturation pressure.

That last one is worth using. The engine's own documentation notes that one of its test fluids comes out near-critical with retrograde behaviour at 200 F, which is a statement about the characterization as much as about the fluid.

## The misconception to avoid

"The critical point on the envelope is the critical point of the fluid." It is where the model's two branches meet, and it moves when the characterization moves. For a mixture with a lumped pseudo-component the critical point is a model output rather than a fluid property, and treating it as measured is how a characterization error becomes a physical claim.

## Exercise

First, sketch a phase envelope and mark the critical point, the cricondentherm and the retrograde region.

Second, for each of the three positions of reservoir temperature relative to the envelope, name the fluid type and say what happens on depletion.
