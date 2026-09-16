# The note that names its own limit

One of the four notes does something the others do not. It describes a hazard, and then it tells you that the module you are reading cannot assess that hazard properly, and then it tells you what to do instead. Read it carefully.

{{panel:fc-pump-explorer}}

## The note

At 130.000000 percent of best efficiency flow, in the band labelled "allowable, high", the engine returns: "above 120 percent of best efficiency flow: the required NPSH climbs steeply with flow here, and this module carries NPSHr as a single number rather than a curve, so the vendor curve has to be read at THIS flow before the suction margin means anything".

Three clauses, and the middle one is a confession.

## What the middle clause admits

The required NPSH of a pump is not a constant. It is a curve against flow, and it rises as the flow rises, steeply at the right-hand end. That is a property of every centrifugal pump.

This module carries it as a scalar. The suction check taught in the next tier of this course takes a required NPSH as a single number typed in by the caller, and there is no required-NPSH-against-flow curve anywhere in these two engine modules. That absence is one of the four the course names.

So the consequence is exact. If the caller typed in the required NPSH from the vendor curve at the best efficiency flow, and the duty then solves out at 130.000000 percent, the check will be run against a required NPSH that is too low. It will return a margin, a verdict and a severity, all of them computed correctly from a number that does not apply at the flow in question.

## Why saying so is the whole point

A warning that describes a hazard the reader cannot act on is close to useless. A warning that describes the hazard, names the specific limitation of the code producing it, and states the action that closes the gap is something a reader can do something about today. This one says: go back to the vendor curve, read the required NPSH at this flow, and put that number in.

It is worth noticing what the engine did not do. It did not invent a required-NPSH curve, and it did not suppress the suction check when the duty landed high. It ran the calculation it was asked for and marked the assumption that calculation rests on.

## The habit to take forward

Every result rests on something, and most of the time nothing in the return says what. When a return does say, that sentence is worth more than the numbers around it, because it tells you where to go looking next.

## The mistake

Reading the note as being about the pump. It is about the module. The pump in the note is fine, and it is running at a flow where the number you supplied about it has stopped being true.

## Exercise

Write the note out and separate its three clauses. Then say what form the required NPSH really takes, what form this module carries it in, and exactly what a suction check would get wrong if a required NPSH read at best efficiency flow were used at 130.000000 percent.
