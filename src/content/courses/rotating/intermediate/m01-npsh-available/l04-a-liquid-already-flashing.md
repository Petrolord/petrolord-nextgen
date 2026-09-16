# A liquid already flashing

There is a state a suction can be in where the arithmetic keeps working and the answer stops meaning what it looks like it means. The engine computes through it, returns a number, and attaches a warning.

{{panel:fc-suction-explorer}}

## Two suctions at or under the boiling pressure

A suction sitting exactly at the vapour pressure, 6.200000 psia against 6.200000 psia, returns a pressure head of 0.000000 ft and an NPSH available of 25.000000 ft, and it warns:

"the suction pressure is at or below the vapour pressure: the liquid is already flashing before it reaches the pump"

A suction under it, 4.400000 psia against 6.200000 psia, returns a pressure head of -5.856338 ft and an NPSH available of 19.143662 ft, with the same warning.

## The second one is the dangerous shape

Read the 4.400000 psia row twice. The pressure head is negative, the static column still leaves the available head positive, and the figure that comes out is 19.143662 ft. A caller that reads only the number sees an ordinary suction with a respectable head on it. Nothing in that number is marked.

The warning is the only thing on the return that says the liquid is already flashing. A caller that checks for an error key finds none, because this is not a refusal, and a caller that checks the sign of the available head finds it positive. Reading the warning is the only way to know.

## What the warning does establish, and what it does not

It establishes one thing precisely: the suction pressure is at or below the vapour pressure of the liquid. That is a statement about the state the liquid arrives in.

It is not a cavitation verdict. This call has never been told the pump's required NPSH, so it has no verdict to give and does not pretend to one. It is not a refusal either: the engine returns the full answer, because the arithmetic is still correct arithmetic. A static column really does add feet of head, and it adds them to a negative pressure head as readily as to a positive one.

## The mistake

The mistake is a program, or a person, that treats a positive available head as a pass. On the 4.400000 psia row that gives 19.143662 ft and a clean conscience, and the condition it stepped over is a liquid that was already boiling before it reached the flange. The number was never wrong. It was answering the supply side of a question while the warning answered a different part of it.

The second mistake is the opposite reflex, deleting the row because it warned. The warning does not make 19.143662 ft the wrong figure. It makes the case one where the available head is the second thing to know about the suction.

## Exercise

Write the pressure head and the NPSH available for both the 6.200000 psia and the 4.400000 psia suctions against a vapour pressure of 6.200000 psia, and quote the warning. Then say what a caller checking only for an error key, and a caller checking only the sign of the available head, would each conclude from the second row.
