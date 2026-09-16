# What it refuses to answer

An engine that answers everything is telling you something false. This one refuses in two different ways, and the two are worth separating before any number is read.

{{panel:fc-water-explorer}}

## A state the method has no answer for

When the method cannot answer, the engine hands back an object carrying an error string. It does not throw. A caller gets a result that can be looked at and reported, so the studio can print the refusal rather than falling over. The refusal says what was wrong and what would fix it.

One export breaks that contract by returning a bare number instead. The Expert tier audits it, and it is worth knowing early that the contract has an exception, because an exception you have not been told about is how a caller ends up treating a refusal as a result.

## A question it never had

The second refusal is quieter and much easier to walk into, because nothing prints. There is no hydrate boundary in this engine. There is no compositional flash, no rate based absorber model, no stage efficiency, no molecular sieve, no refrigeration and no NGL recovery.

None of those absences is a gap in the code. Each of them is a question that belongs somewhere else. A hydrate margin belongs to the Flow Assurance engine in the Production module. The phase envelope of a reservoir fluid belongs to the Fluid engine. Asking this engine for either one does not produce a wrong answer. It produces no answer at all, and a reader who assumes otherwise goes looking for a figure that does not exist.

## Why absences are the harder half

A refusal with an error string is loud. You cannot miss it and you cannot accidentally use it. An absence is silent, and the way it bites is that a reader fills it in themselves. A dehydration answer of 6.399830 gpm and 0.697269 MMBtu an hour says nothing whatever about whether the dried gas is still inside a hydrate margin at line conditions. That question does not arise anywhere in the chain, so nothing in the answer addresses it.

The honest reading of an engine is therefore two lists. What it returns, and what it is in no position to return. The second list is the one that has to be carried to the next engine rather than assumed away.

## Exercise

Write down the two kinds of refusal this lesson separates, and give one example of each. Then take the OBIAFU answer of 2879.9235 lb a day, 6.399830 gpm and 0.697269 MMBtu an hour, and name one question about that stream which the engine did not refuse and did not answer either.
