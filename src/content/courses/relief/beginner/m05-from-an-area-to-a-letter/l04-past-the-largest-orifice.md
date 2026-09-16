# Past the largest orifice

{{panel:fc-sizing-explorer}}

The ladder ends. A required area above the largest listed orifice has no answer in the table, and what the engine does about that is a small masterclass in how a refusal should be written.

## The refusals

| required area in2 (stated) | refusal | multiple of the largest |
| --- | --- | --- |
| 26.000001 | required area 26.000001 in2 exceeds a T orifice (26 in2): use multiple valves | 2 |
| 26.000100 | required area 26.0001 in2 exceeds a T orifice (26 in2): use multiple valves | 2 |
| 40.000000 | required area 40 in2 exceeds a T orifice (26 in2): use multiple valves | 2 |
| 79.000000 | required area 79 in2 exceeds a T orifice (26 in2): use multiple valves | 4 |
| 105.000000 | required area 105 in2 exceeds a T orifice (26 in2): use multiple valves | 5 |

## Three things that refusal gets right

The first is that it refuses at all. Returning the largest orifice with a margin below one would be an answer that looks like an answer and is not, and a caller reading only the letter would install a valve that cannot pass the load.

The second is that the message carries the figure that made it true. Read the second row: the required area appears in the text of the message, to eight significant figures, so the statement and its evidence sit on the same line. A refusal reading only that the area is too large would leave a user guessing which of their inputs the engine had actually received.

The third is that it says what to do instead. Alongside the message the engine returns how many of the largest orifice the required area needs, which turns a dead end into the beginning of a design. At 79.000000 in2 the answer is four valves, and at 105.000000 in2 it is five.

## The shape of the return

This is the first refusal in this tier worth looking at as an object. A selection call returns an object either way. When it succeeds the object carries the letter, the purchased area, the required area it was asked about and the margin. When it refuses, the object carries an `error` string and the count of valves instead, and there is no partial answer hiding beside them.

That pattern holds across the module. Every route that returns an object returns either a finite result or an object carrying an `error` string, and a caller's guard on that field is enough. What that guard cannot see is a non finite number arriving with no error field, which is the failure the Expert tier audits every route against.

## A refusal is not a failure

Worth saying plainly, because it is easy to read a refusal as the tool breaking. The area above the ladder is a real engineering answer: one valve of a standard size will not do this job. The engine declining to invent a fifteenth orifice is the tool being correct about the limits of the table it was given.

## Exercise

Write out the refusal message for the second row and identify the figure inside it that came from the input. Then say what the engine returns alongside the message, and what a caller should check on every object this module hands back.
