# Test questions in a prompt

{{panel:ae-trust-explorer}}

A judged set has two parts that must stay secret from the system being evaluated: the queries and their reference answers. The reference answers are the key. A copilot whose instructions, examples or fine-tuning data contained them would not need to retrieve anything. It could return the key.

## What the score does with a leaked key

The course ran the extreme case. Take each of the 24 reference answers and score it against itself with the short-answer check. The engine returns 24 exact matches of 24. That is the score a system earns if the key reached it, whatever it can actually do.

Set it beside the two fixed systems, whose short answers are fixture text scored against the same references:

| answers | exact matches of 24 |
| --- | --- |
| the reference answers themselves | 24 |
| system A | 20 |
| system B | 13 |

A system with a leaked key beats both. Worse, nothing in the score marks the difference. No score can tell a leaked key from skill, because the score only compares an answer with a reference, and a leaked answer compares perfectly.

## Prevented by process

Because the score cannot detect a leak, the leak must be prevented before the score is computed. The rule the course follows: the judged queries and their references are kept out of every prompt, every example and every fine-tuning set. It also covers three less obvious routes:

- a few-shot example in the system's instructions that happens to be a test query with its answer;
- a document added to the corpus that restates a reference answer word for word;
- a fine-tuning set assembled from the same reports the test queries were written from, with the answers attached.

Each of these puts the key where the system can reach it. None of them shows up as anything but a good score.

## What the grounding check does and does not catch

The groundedness check looks for an answer's numbers, dates and quotes in the passages it cites and retrieved. A leaked key does not by itself fail that check: if the reference figure is in a cited, retrieved passage, the claim is supported. Grounded is a statement about the passage, and says nothing about how the system came to write the figure. A key that leaked through the corpus, as in the second item above, would pass the groundedness check and the exact-match check together.

## Why this belongs in the Expert tier

Every figure in this course assumes the key was kept apart from the system. That is a governance rule: who can see the test set, where it is stored, and how a prompt or training set is checked against it before a run.

## Exercise

Open the trust explorer on "A seeded bootstrap of a mean". Replace the values with system A's exact matches, one a query from Q01 to Q24, where a match is 1 and a miss is 0: A misses on Q08, Q13, Q14 and Q18 and matches on the other 20. Keep seed 7, 2000 replicates and level 0.95, and read the mean and its interval. Then replace the values with 24 ones, the leaked key, and read the interval and standard error again. Write two sentences on what the second interval tells you and what it cannot tell you.
