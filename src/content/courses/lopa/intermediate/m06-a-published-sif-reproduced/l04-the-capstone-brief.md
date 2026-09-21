# The capstone brief

{{panel:lp-sif-builder}}

The capstone for this tier asks one question, the question this whole tier has been about: what does the function achieve. It hands you a facility, a function and every input that function needs, and it asks you to verify it and report what you found. Nothing in it needs a number you have not been given, and nothing in it needs the Expert tier's material.

## What you will be asked to produce

You will compute subsystem PFDavg values from failure rates, a proof test interval, restoration times, a beta factor and betaD, then sum them into a function, read its risk reduction factor and band, and take the result back to the row it has to answer. That is the chain of this tier in order: the simplified forms, the full Annex B form with its equivalent down times, common cause, the architectures, the series sum, and the loop back to the tolerable mitigated event likelihood.

## The habits that will carry you through

| habit | why |
| --- | --- |
| quote PFDavg at twelve decimals | that is the precision the engine prints and the precision answers are read at |
| quote risk reduction factors, hours and years at six | the same reason |
| hold every input but the one being studied | a comparison that moves two things supports no conclusion |
| name the architecture before computing | the coefficient and the equivalent down times both follow from it |
| check the required PFDavg, and never the band alone | a function can sit in the right band and still miss |

## How to work a verification in order

Start by writing down what the row requires, so that the target exists before any answer does. Then take each subsystem in turn, name its architecture, list its rates and its times, and compute it on its own. Sum the subsystems only when each one is written down, because a total with no parts behind it cannot be reviewed. Read the risk reduction factor and the band last, as a summary of a number that already exists.

## Two traps worth naming

The first is the band. A function whose band matches the requirement can still be above the required PFDavg, and the engine will report that the row is not met. Compare numbers, and use the band as a label afterwards. The second is a missing input. If the engine refuses your call, read the field it names before changing anything else, because the refusal is telling you which decision you have still to make.

## What this tier does not ask

You will not be asked for the longest proof test interval a function may run, nor for what happens at a coverage floor, nor for a judgement about a published source's inferred inputs. Those belong to the Expert tier. You will also not be asked about the architectural constraint in the standards or about a high demand mode, because this engine computes neither and this course grades nothing it does not compute.

## Exercise

Take the teaching function value of 0.001792971954 and its risk reduction factor of 557.733208, and write the four lines you would put in a verification note for it: the function, the architecture of each subsystem, the achieved figure against the required 0.007407407407, and the one sentence you would add about what the engine did not check.
