# Every refusal, and why a refusal is the useful answer

A learner who has never seen an engine refuse has not really met it. This course counts its refusals, proves each one by calling it, and lists them by the function that raises them, because a refusal is a documented behaviour rather than an accident.

## The counts

The digest calls and proves twenty eight distinct refusals across the three engines. The tree it counts over is the assertion list the generator built while it ran, filtered to the ones labelled a refusal, and the rule is one count per distinct assertion text, every one of which asserted that the engine returned an error key.

It also calls and proves two hundred and thirty eight successes, over the same assertion list filtered the other way, where the rule is one count per distinct assertion text and every one asserted no error key and no non-finite number in the result.

## Label and call are checked against each other

There is a defect no numeric sweep can see. A generator that labelled a row a refusal and then called a case that succeeded would print numbers that are all real engine output under a sentence that is false, and every figure would verify.

The guard is to check the label against the call, and if any label disagrees with its call the file is not written at all. When you assert a behaviour and print evidence of it, have something check that the evidence is evidence of the thing you asserted.

## The tank engine's refusals

The list is broken out by the function that raises each refusal. These are the storage tank rows of it.

| function | refusals |
| --- | --- |
| evaporativeLosses | 1 |
| fireVenting | 1 |
| lossControl | 2 |
| movementVenting | 1 |
| tankCapacity | 1 |
| thermalVenting | 2 |

Those are evaporativeLosses on a product that boils at ambient, fireVenting with an environment factor above one, lossControl above a hundred percent and with no efficiency, movementVenting with a negative fill rate, tankCapacity with a fill height below zero, and thermalVenting at a latitude factor above what the package will apply and with no capacity.

## Proving a refusal by calling it

Notice what counting refusals requires. Each one has to be provoked: an input assembled that raises it, the call made, and the returned error key inspected. A list compiled by reading the source would be a list of refusals somebody believed were reachable, which is a weaker claim than it sounds.

## Why a refusal is the useful answer

Look at what those cases have in common. Each is a place where the relation would return a number and the number would be meaningless, and each is a place where a reader would have no way of knowing from the result that anything was wrong.

That is the value of the refusal. It converts a silent wrong answer into a loud absent one. A silent wrong answer travels through a design, gets built on, and is discovered by an incident. An absent one stops at the person who asked and tells them what to fix.

## Exercise

Read the refusal list in digest SECTION 30 and pick lossControl or thermalVenting, the two tank functions with two refusals each. Say what distinguishes its two cases, and which of them is an impossible input rather than an absent one.
