# The half that is not here

The held items are figures without a source. This is something else: a whole body of physics that is simply absent from the engine, and knowing where the edge runs is the last thing this tier has to teach.

{{panel:fc-wall-pig-explorer}}

## The multiphase half

There is no flow regime, no slip, no holdup correlation and no slug model anywhere in this engine. Two-phase pressure drop, flow regime and holdup are the Suite's Beggs and Brill correlation, which is app code rather than part of this module.

Wherever this engine needs a holdup it takes one as an input. That is honest and it is also a seam a reader has to see rather than infer, because the returned swept volume looks exactly like a computed result and half of it was handed in.

## Three more edges

**A system of lines is not this engine.** It sizes one line. Lines that share a header interact, and solving them together is a network solve that lives in its own module.

**A live-oil flowline is not this engine.** Liquid rates here are taken at line conditions, the dead-liquid case downstream of separation. Upstream of separation the fluid carries full PVT, gas comes out of solution as the pressure falls, and none of that is in these correlations.

**The catcher is not this engine.** The slug a catcher has to hold is computed here. The vessel that holds it is sized in the separation work, and the two halves meet at the swept volume.

## Why an absence is harder to see than a limit

A held item announces itself. Somebody writes down that the c factor is unsourced and the reader is warned.

An absence has no field to attach a warning to. Hand this engine a wet gas line and it will return a velocity, a Reynolds number, a friction factor and a pressure drop, all arithmetically correct for a single-phase fluid of the density it was given. Nothing in the answer says that the line has two phases in it and that the single-phase result is the wrong model rather than an imprecise one.

The engine cannot detect this, because a mixture density is a perfectly ordinary number.

## The mistake

The mistake is running a two-phase line through a single-phase form with an averaged density. The answer will arrive, it will look like every other answer, and it will be a different question's answer.

The second mistake is assuming a seam is a defect. Taking holdup as an input is a deliberate boundary between two pieces of software, and the failure is not the boundary. It is crossing it without saying so.

## Exercise

Name what is absent from this engine rather than held, and say where each of the four edges hands off to. Then explain why an absence is harder to notice than a held item, and describe what this engine returns when it is given a two-phase line.
