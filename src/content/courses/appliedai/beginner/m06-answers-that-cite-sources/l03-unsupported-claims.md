# Unsupported claims

{{panel:ae-retrieval-explorer}}

An unsupported claim is a figure, date or quote the answer states that the check could not find in a passage the answer cites and retrieved. This course calls that a hallucination, and it uses the word in that narrow sense only: an unsupported claim, named with the engine's reason. This lesson reads system A's answers claim by claim and reads the reasons the engine gives.

## System A, pooled

System A's 24 answers, each checked against the passages it cites and its retrieved lists:

| figure | value |
| --- | --- |
| claims | 49 |
| supported | 47 |
| pooled supported fraction | 0.959184 |
| answers with a claim | 22 |
| answers fully supported | 20 |

The pooled fraction is 47 over 49. Two answers carry one unsupported claim each.

## The two unsupported claims, in the engine's words

| query | claim | reason (verbatim) |
| --- | --- | --- |
| Q06 | 20.3 | the number 20.3 is not in the cited passage EKD-001; it appears only in passage EKD-007, neither cited nor retrieved |
| Q13 | 2025 | the number 2025 is not in the cited passage EKD-030; it appears in retrieved passage EKD-037, which the answer does not cite |

Each reason says where the figure is, which is what makes it useful. The Q06 answer states the maximum oil column, 20.3 m. That figure is in EKD-007, a passage system A neither retrieved nor cited, so the answer cannot show where it came from. Its supported fraction is 0.500000.

The Q13 claim is a different kind of slip. The query asks for the water cut "at the end of 2025", and the answer repeats the year. The claim reader takes 2025 as a number, and 2025 is in EKD-037, which was retrieved and not cited. The answer's supported fraction is 0.666667. Both slips were planted in the fixture. Reading the reason tells you which kind you have: a figure from outside what the system saw, or a figure from a passage it saw and failed to cite.

## Answers with no claim

Q14 and Q24 state no number, date or quote. Their supported fraction is returned as null, with the reason:

> the answer has no checkable claim (no quote, date or number), so the supported fraction is undefined

The pooled fraction counts only claims, so these two answers add nothing to it.

## What supported does not mean

A supported claim is found in a cited, retrieved passage. It is grounded in that passage, and that is a statement about the passage. The check does not decide whether the answer is true, whether the passage is about the right well, or whether the figure answers the question asked. A later tier shows an answer whose date is supported by a passage about another well. Supported is the first test an answer must pass; it is never the last.

## Exercise

In the retrieval explorer choose "Claims in cited answers" with system A's answers to Q01 to Q06. Find the Q06 row for 20.3 and read its reason. Add EKD-007 to the Q06 citations and read the reason again. Then add EKD-007 to the Q06 retrieved list as well, and predict the result before you read it. Last, write an answer of your own to Q01 that states one figure from EKD-018 and one figure you invent, cite EKD-018, and read both reasons.
