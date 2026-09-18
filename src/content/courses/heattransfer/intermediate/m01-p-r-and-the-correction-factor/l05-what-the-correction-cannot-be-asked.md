# What the correction cannot be asked

Three questions about the correction factor come back as named refusals rather than as numbers. Each one names the box rather than the physics, and each is a state a saved study can carry into the app, which is why they are worth knowing by sight.

## The two bounds on the groups

The factor needs a P at or above zero and below one, and it refuses a P of exactly one by saying so in those terms. It needs an R above zero, and it refuses a zero R the same way. Both messages quote the value they were given back to the caller, which is the difference between a refusal a user can act on and an error a user has to guess at.

Neither bound is arbitrary. A P of one is a cold stream leaving at the hot inlet temperature, and an R of zero is a hot stream giving up no temperature at all. Those are states outside the domain the closed form is written over.

{{panel:fc-coefficient-explorer}}

## Repair history, and the second half of one refusal

The third refusal is the interesting one, and the engine's own message for it carries two things at once. Its second sentence describes the behaviour that the FC6-0 repair replaced. That half is history and is not what the engine does now, and the message is quoted whole here because shortening it would change what the engine says.

Asked for P and R on a cold stream that does not change temperature, the engine refuses in these words: the cold stream does not change temperature (100 F in, 100 F out), so R is undefined and no number of shell passes changes that. R used to come back as Infinity here and the F correction then blamed the shell count.

## Why the last clause matters

Read what the old behaviour did to a user. The real fault was upstream, in a cold stream that had no rise in it, and the message a user saw pointed at the shell count instead. So the remedy a user reached for was to add shells, which could not help, and the input actually at fault was never questioned.

A refusal that names the wrong box is worse than an unhelpful one. This is the general shape behind every named refusal in this module: the message points at the thing a caller can change, and it is the thing that is actually wrong.

## Exercise

Record the P the factor refuses and the R it refuses, and write down what each of those two states would mean physically. Then state which of the three refusals in this lesson carries a sentence about former behaviour, and say in your own words what the engine does now.
