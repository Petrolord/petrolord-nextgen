# What is graded and what never is

{{panel:ae-retrieval-explorer}}

A course about language-model copilots might be expected to run one. This course does not, and the reason is the grading. A graded answer needs exactly one right value, the same on any machine and on any day. Output from a language model changes from run to run and from one model version to the next, so a grade resting on it would have no fixed right answer.

## Every graded number is an engine return on fixed inputs

Each capstone field, each question key and each panel figure in this course is computed by a function of one engine, on inputs written down in advance: documents, queries, judgments and answers. The same inputs give the same number on any machine. The engine's own record of its imports shows no model and no network call.

## Three things keep a model out of every grade

| what | why it holds |
| --- | --- |
| the engine calls no model | its imports and its source are checked |
| the systems' answers are fixture text | written once, committed, and scored as a stand-in for what a copilot returns |
| the only random draw is seeded | a seed and a replicate count name its result exactly |

The seeded draw belongs to a later tier. Nothing in this tier draws at random at all.

## What a model helper may do

A tool built around this engine may use a language model to draft an answer, suggest a label or summarise a report. The rule this course follows is that a model's output is an input to be scored, never a key. A drafted answer is scored exactly as the fixture answers are scored, by the deterministic checks, and those scores are what a person reads. A question whose key would change when a model changes is never written.

## What a deterministic score does not say

Each score in this tier answers one narrow question, and it is quoted with its settings for that reason.

A supported claim is found in a cited passage. It is not thereby true: the passage itself may be about another well or another date, and the check cannot know. A retrieval figure says the judged passages were ranked well or badly at the stated cutoff and threshold. It says nothing about passages nobody judged, and in the Ekene set a passage nobody judged counts as grade 0.

## The word AI in this course

In this course "AI" names the system being evaluated: a copilot, a search box, a drafting tool. It never names a method this engine runs, because the engine runs none. Every method is named by what it is: tokenising, TF-IDF, BM25, a ranking rule, a metric at a cutoff, a claim check.

## Why this matters for you

To evaluate a copilot at work, fix the documents, questions and judgments first, freeze the copilot's answers as text, and score that text with checks that give one answer.

## Exercise

In the retrieval explorer choose "BM25, read term by term" with the hand set and the query "oil rate". Note d1's score. Change k1 to 2, read the new score, then set k1 back to 1.2 and confirm d1 returns to exactly 2.191027. Then open "Claims in cited answers", pick any answer in the box, change one number in its text to a figure you invent, and watch that claim turn unsupported. Write one sentence on why a drafted answer from any source would be checked the same way.
