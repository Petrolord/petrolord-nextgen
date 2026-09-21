# A blank cost is refused

A blank maximum is no limit, and the optimizer solves. A blank cost is different, and the optimizer refuses. The two rules sit side by side in the same component table, and each follows from what the blank would mean to the kernel.

## The refusal

| asked | what the engine returned |
| --- | --- |
| Isomerate with its cost left blank | REFUSED: No cost for Isomerate. A least-cost recipe needs a price on every component; remove the component or give it one. |

The engine names the component and gives the two ways forward: remove it, or give it a price.

## Why a blank cost cannot be solved

The cost column is the objective. Every component's volume is multiplied by its cost, and the kernel minimises the sum. A component with no cost has no coefficient in the objective, and there is no honest number to put there.

Consider the two numbers a program might quietly substitute. A cost of zero would make Isomerate free, and a least-cost recipe would take as much of it as the specifications and its 1500 bbl tank allow, for a reason that has nothing to do with its value. A very large cost would keep it out of every recipe, again for a reason nobody stated. Either way the recipe would look optimal and be an answer to a question the user did not ask.

So the engine does neither. It refuses, and says why in the words above. This is the same stance the whole course takes toward missing data: a blank is not a zero, and the engine does not guess.

## Blank maximum, blank cost: why they differ

A blank maximum has a meaning the user can intend: no tank limit on this component. The engine can solve that question, and the previous lesson did, with Butane left blank at 438.1863 bbl.

A blank cost has no such meaning. There is no least-cost question to ask about a component whose cost is unknown. Solving it would require inventing the one number the whole problem is built on.

## Other refusals before the kernel

The optimizer checks the question before it builds any rows. Two more refusals come from the same place:

| asked | what the engine returned |
| --- | --- |
| no components | REFUSED: No components to blend. |
| a target volume of 0 | REFUSED: The target volume must be greater than zero. |

A recipe with no components has no variables. A target of zero is no cargo at all. Each is a malformed question, and the engine refuses it by name. A refusal is not a status. The kernel's three statuses, optimal, infeasible and unbounded, describe a problem that was posed. A refusal says the problem was not posed well enough to hand to the kernel.

## Reading a refusal

When the optimizer refuses, there is no recipe, no binding list and no price. The whole of the answer is the message. Read it as the engine wrote it: it names what is missing and says what to do.

{{panel:crude-recipe-explorer}}

In the panel, clear Isomerate's cost and read the message. Then clear its maximum instead, with the cost restored, and read the recipe that comes back.

## Exercise

Read the Isomerate refusal and the butane row left blank at 438.1863 bbl in the previous lesson. Say what each blank means to the kernel, the cost blank and the maximum blank, and say what the difference between a refusal and an optimal status with Butane at 438.1863 bbl shows about the two rules.
