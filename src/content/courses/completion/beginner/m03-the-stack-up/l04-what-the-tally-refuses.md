# What the tally refuses

Three inputs the stack up will not accept, and why refusing each one is better than returning a number.

{{panel:cd-string-explorer}}

## An empty string

A completion with no components is not a short completion, it is a missing input. The engine refuses rather than returning a zero length string, because a zero would flow into the volume calculation and come out as a completion that holds nothing, which is a plausible looking answer to a question nobody asked.

## A component with no length

Zero or negative length is refused by name. A zero length component is usually a row that was added to the tally and never filled in, and it is dangerous because it is invisible: the sum comes out right for every other component and the missing one contributes nothing.

Negative length is a data entry error and would silently shorten the string above the point it appears.

## A component whose bore is not inside its body

Refused, with the outside and inside diameters named. This one catches a swapped pair of columns, which is the single most common way a component row goes wrong, because the two numbers are the same kind of thing in the same units.

The consequence of not catching it is severe. A swapped pair makes the outside diameter smaller, which makes the component clear easily, and makes the inside diameter larger, which makes the through bore look better than it is. Both errors point the same way: the string looks more runnable than it is.

## The pattern in all three

Each refusal is a case where a plausible number could have been returned and would have been believed.

The empty string returns zero. The zero length component contributes nothing and disappears. The swapped diameters make everything look better. None of the three produces an obviously wrong output, and that is exactly why each one has to be caught at the input rather than spotted at the output.

## What it does not refuse

It does not refuse a component wider than the casing. That is a legitimate input with a legitimate answer, and the answer is a failed clearance check. Refusing it would confuse a data error with a design result.

The line between the two is worth stating: an input that cannot describe any physical object is refused, and an input that describes an object that will not work is computed and reported as failing.

## Exercise

For each of the three refusals, write down the wrong number the engine would have returned if it had guessed instead.

Then say which of the three wrong numbers would have been hardest to notice in a finished tally.

Finally, explain the difference between an input the engine refuses and a design the engine fails.
