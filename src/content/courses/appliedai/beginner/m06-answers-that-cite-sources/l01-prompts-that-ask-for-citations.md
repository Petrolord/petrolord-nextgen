# Prompts that ask for citations

{{panel:ae-retrieval-explorer}}

The retrieval stage hands a copilot a few passages. What the copilot writes from them is the answer a person reads, and the person usually cannot see the passages. A citation closes that gap. It names the passage a figure came from, so a reader, or a check, can go and look. This lesson sets out what an answer is in this course and why the instructions given to a copilot should ask for citations.

## An answer in this course

An answer is two things: a text, and the list of passage ids it cites. System A's answer to Q01, "What was the reservoir pressure when the waterflood started?", cites EKD-018, and the check finds both of its figures there. Its answer to Q10, "diesel spill during bunkering", cites both copies of the spill note, EKD-046 and EKD-058.

| query | claims | supported | citations |
| --- | --- | --- | --- |
| Q01 | 2 | 2 | EKD-018 |
| Q03 | 2 | 2 | EKD-002, EKD-004 |
| Q10 | 2 | 2 | EKD-046, EKD-058 |
| Q14 | 0 | 0 | (none) |

The answers are fixture text, written once by hand as a stand-in for what a copilot returns. No model wrote them.

## Asking for citations

A copilot built on a language model follows written instructions, often called a prompt. The instructions can ask it to answer only from the passages it was given, and to put the id of the passage beside every figure, date and quoted phrase it uses. For example:

    Answer from the passages below and nothing else. After every number, date or quoted phrase, give the id of the passage it came from. If the passages do not answer the question, say so and give no figure.

Instructions like these do not make an answer right. They make it checkable. Whether the copilot obeyed is then a matter of evidence, and the check in this module supplies it.

## What the check does with a citation

The engine checks each claim only against passages the answer cites and that were retrieved for its query. Its basis states how it treats the citations themselves:

    citations: a citation that is not a passage of the corpus is flagged unknown; one that was not retrieved for the query is flagged notRetrieved and supports nothing

An unknown citation points at nothing. A citation to a passage the retrieval stage never returned is suspicious: the copilot could not have read it, so the engine flags it and lets it support nothing.

## When there is nothing to cite

System A's answers to Q14 and Q24 cite no passage and state no figure. For Q24 the answer reads:

> No retrieved passage mentions a subsea tree replacement.

That is the behaviour the example instructions ask for. The check has nothing to test, so the supported fraction is returned as null with the reason, and the lesson on unsupported claims reads it.

## Exercise

In the retrieval explorer choose "Claims in cited answers". The box holds system A's answers to Q01 to Q06, each with its retrieved list. In the Q01 answer, delete EKD-018 from the citations and read what happens to its claims. Put it back, then add the citation EKD-099, which is no passage of the corpus, and read the note the engine gives. Last, add to the Q01 citations a passage id that is in the corpus and absent from Q01's retrieved list, and read how that citation is flagged.
