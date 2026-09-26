# When a model helper is never graded

{{panel:ae-trust-explorer}}

This course is about evaluating AI systems, and it uses no language model to do it. That is a design rule with a reason, and the reason is the same one that makes a capstone gradable.

## Every graded number is a return value

Every graded number in this course is a return value of this engine on fixed inputs. Each is computed by a named function on inputs written down in advance. The same inputs give the same number on any machine, so there is exactly one right answer.

Three things make that so, and each is checked:

- The engine calls no model. Its imports and its source are checked, and it makes no network call.
- The two systems' answers are fixture text, written once and committed. No model wrote or scores any of it.
- The bootstrap is the only random draw, and it is seeded: a seed and a replicate count name its result exactly.

## What a model helper may do

A tool built around this engine may use a language model to draft an answer, suggest a label or summarise a report. Such output changes from run to run and from model version to model version, so a key, a label or a judgment resting on it would have no fixed right answer. The rule this course follows is that a model's output is an INPUT to be scored, and it is never a key. It is scored exactly as the fixture answers are scored, by the deterministic checks: claims against cited and retrieved passages, exact match and token F1 against a reference, extraction outcomes against labels.

## Why a model cannot be the judge here

Suppose a model graded the Ekene passages instead of an assessor. Every metric would rest on judgments that could change on the next run. The annotator agreement module showed that even two fixed sets of grades, with a kappa of 0.579841, can reverse the order of two systems on nDCG. A judge whose grades are not even fixed makes that worse.

## What a deterministic score does not say

The engine's scores are fixed, and they are also narrow. A supported claim is found in a cited passage; it is not thereby true. System B's Q05 date is supported by EKD-027, which is about another well, and its short answer scores exact match 0. An exact match compares normalised strings; it does not know that "45.0 percent" and "45 percent" are the same quantity. A high nDCG says the judged passages were ranked well, and says nothing about passages nobody judged. Each score is quoted with its settings for that reason.

## Exercise

Open the trust explorer on "A seeded bootstrap of a mean" with system A's nDCG values loaded. Read the interval on seed 7 with 2000 replicates at level 0.95. Change nothing, switch to another view and back, and read it again. Then change the seed to 8 and read the interval. Write two sentences: one on why the first two readings agree to every digit, and one on what a figure would need before it could serve as a key if it came from a source with no seed.
