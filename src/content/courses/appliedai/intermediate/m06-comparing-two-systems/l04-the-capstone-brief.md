# The capstone brief

{{panel:ae-scoring-explorer}}

The capstone for this tier grades six figures, and every one answers the Professional question: how do you score retrieval and answers honestly?

| graded quantity | the module it rests on |
| --- | --- |
| a MAP at a stated cutoff and relevance threshold | average precision and MAP |
| a mean nDCG at a stated cutoff and gain | graded relevance and nDCG |
| the mean token F1 of a set of short answers | short answers |
| the macro F1 of a field extraction | field extraction |
| one bound of a seeded paired bootstrap interval | comparing two systems |
| a pooled supported fraction of a set of cited answers | groundedness and its limits |

## What it grades and why

It grades scoring quantities only. It grades no BM25 score, no TF-IDF cosine and no precision or recall at a cutoff on its own, because those are the Associate question and the Associate capstone asks them. It grades no agreement between annotators and no calibration figure, because those are the Expert question.

Every graded figure is a return value of the engine on fixed inputs. No field depends on anything a language model wrote: the capstone's answers are fixed text, and the only random draws are the engine's seeded bootstrap replicates.

## The data are new

The capstone runs seeded variants of the Ekene document set, with their own passage ids, their own worded queries and their own answers. None of its values appears in any lesson, and none of the figures in this tier's lessons is a capstone answer. The Ekene documents and the two systems are worked examples. Use them to check that you drive the scoring explorer correctly.

## How to work it

The capstone states every setting: the method, k, k1 and b where retrieval is involved, the relevance threshold, the gain, the rule for a query with no relevant passage, the numericRelTol, and for the bootstrap its seed, replicate count and level. Set each view exactly as the brief states before you read anything.

For the MAP, check the threshold first: the same runs give a different MAP at another threshold. For the nDCG, check the gain. For the mean token F1, score every short answer the brief lists, and remember that an empty answer to an empty reference scores 1. For the macro F1, read the per-field table and make sure every field the brief declares is there. For the bootstrap bound, confirm paired or unpaired, and the seed. For the supported fraction, confirm whether the retrieved lists are used, and read the pooled figure.

## Before you submit

Keep every figure at full precision until the end, and quote the numeric field the engine returns. A figure inside a message or a reason is text to read. If a metric comes back as null, its reason names what could not be computed. If a call is refused, the refusal names the field it could not use, and the fix is in the input.

## Exercise

Before you open the capstone, rerun the worked figures on the Ekene set. System A's MAP at 5, grade 2 or more: 0.750362. System A's mean nDCG at 5, exponential gain: 0.786456. System A's mean token F1 over its 24 short answers: 0.921507. System A's macro F1 over the 180 extraction cells: 0.942735. The 97.5th percentile of the paired bootstrap difference in nDCG at 5, A minus B, seed 7, 2000 replicates, level 0.95: 0.058726. System B's pooled supported fraction with its retrieved lists and numericRelTol 0: 0.731707. For each of the six graded fields, write down which view and which setting you will check first.
