# A result or a refusal

{{panel:cq-release}}

Every function in this engine returns one of two things. Either it returns a result object carrying a `basis` block, which names the model, its source and its units, or it returns an object with `error` and `field`, where `field` names the offending input. There is no third answer.

## What a result carries

A result is more than its headline number. Run the AMENAM crude line and the engine returns the hole area, the pressure at the hole, the driving pressure, the mass rate and the jet velocity together:

| quantity | engine key | value |
| --- | --- | --- |
| hole area, m2 | `holeAreaM2` | 0.001963495408 |
| pressure at the hole, Pa | `pressureAtHolePa` | 250013.915000 |
| driving pressure, Pa | `drivingPressurePa` | 148688.915000 |
| mass rate, kg/s | `massRateKgS` | 19.354651 |
| jet velocity, m/s | `jetVelocityMS` | 18.704445 |

Beside them sits the basis. For this call the model string reads, verbatim, "Bernoulli liquid outflow through a hole, qS = Cd Ah sqrt(2 (P - Pa) rhoL), P = rhoL g hL + PaL". A reviewer can see which equation produced the result without opening any code. The plume does the same with its citation: at 500 m in class D it reports "NOAA TM NOS OR&R 43, ALOHA Technical Documentation (2013) section 4.3; sigmas Briggs rural (ALOHA Table 13)".

## A warning is still a result

A result can carry a warning. The Briggs sigmas outside 100 m to 10 km come back with the words "treat the result as an extrapolation" attached. The engine hands over the number and tells you how far to trust it, and the panel shows that warning in its own box beside the answer.

## What a refusal carries

A refusal carries a field name and a message, and never a number. The course tables 37 refusals across 24 functions, each one a real call. Here is one, from a liquid call with a hole diameter of zero:

> holeDiameterM: a hole diameter above 0 m (or holeAreaM2) is required

The field is `holeDiameterM`, so you know exactly which input to fix. The message also offers a second route into the same function: a hole area stated directly would be accepted in its place.

## Why refuse instead of guess

The alternative to a refusal is a guess: clamp the input, substitute a default or return zero. Each of those produces something that looks like a result and is wrong in a way nobody can see. By refusing, the engine hands the decision back to the analyst, who states the input properly and records why.

For the same reason the panels in this course never write refusal text of their own. They show the engine's message exactly as it came back, so the words in a lesson are the words on screen.

## Exercise

On the outflow view, set the liquid hole diameter to 0 and run the call. Read the refusal and confirm the field it names. Restore the diameter to 0.05 m, check that the mass rate returns to 19.354651 kg/s, and then set the gas upstream pressure equal to 101325 Pa. Write one sentence for each refusal saying which input you would change and why.
