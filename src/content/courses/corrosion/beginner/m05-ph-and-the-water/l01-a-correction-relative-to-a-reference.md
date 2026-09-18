# A correction relative to a reference

{{panel:fc-rate-explorer}}

The rate correlation behind this module was fitted on water at one pH. Everything the engine says about acidity afterwards is a correction relative to that fitted condition, and the engine reports the reference alongside the factor so you always know what the correction is being taken against.

The reference is a pH of 4.000000. At the reference the factor is exactly 1.000000, and it is one by definition rather than by a clamp: the correction is the ratio of the water you have to the water the fit was made on, so at the fitted condition it cannot be anything else. Above the reference the factor falls below one, which reduces the rate.

## The shipped case, read through the correction

The studio ships with an in situ pH of 4.500000 and the engine reports a pH factor of 0.562341. That multiplier is one of four the engine applies between the combined figure the two rate terms produce and the rate the screen finally prints, the other three being the protective film factor, the wetting regime and the corrosion inhibitor credit. The film factor is easy to miss on the shipped case, because there it is exactly 1.000000000000 and the chain closes to the last digit with it silently at one. Change the pH box alone and the pH factor moves with it, and nothing else in the chain moves at all. That is a useful property when you are trying to attribute a change in a printed rate to a cause.

The slope of the correction and the reference itself are both held for literature. They are measured out of the engine's behaviour and pinned against a literal in a third file, so the module is using what it declares, and no source in this repository says whether the declared values are the published ones.

## What the correction is, and what it is about

Read the factor as a statement about hydrogen ion activity in the water phase at conditions, which is what in situ pH means. It is not a sample of produced water measured at the surface, and the difference between those two numbers on a live system is not small. The box on the screen asks for the in situ value.

The engine also range checks the pH before it corrects anything, which is one of the few bands it does enforce. A pH outside nought to fourteen is refused and the message names the value that was typed. A blank box is refused separately, because a blank is a question rather than a value.

## Exercise

Run the shipped case and record the pH factor of 0.562341 beside the reference of 4.000000 the engine returns with it. Now set the pH to 4.000000 and record the factor there. Compare the two factors and say which direction the correction moves the rate as the water becomes less acid. Then type a pH of 14.500000 and copy down exactly what the engine returns, and write one sentence on why a range guard and a reference are two different pieces of protection.
