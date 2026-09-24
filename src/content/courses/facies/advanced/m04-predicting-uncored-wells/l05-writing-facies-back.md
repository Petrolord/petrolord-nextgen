# Writing a predicted facies back honestly

{{panel:ef-classify-explorer}}

A predicted facies outlives the session that made it. It goes into a well database beside the logs, and a year later someone builds a map from it who never saw the held-out score or the range check. The last step of this module is to write the prediction back so that it cannot be mistaken for core. The course's rule, with every value taken from the steps of this module:

| item | what is written |
| --- | --- |
| channel name | a new channel, FACIES_PRED, beside the empty core facies; the core facies stays null |
| method | kNN, k 5, standard scaling fitted on the training rows, logs GR, RHOB, NPHI, PEF |
| wells trained on | EKENE-1, EKENE-2, EKENE-3, EKENE-4, EKENE-5, EKENE-6, 180 cored rows |
| expected agreement | on EKENE-6 held out, kNN k 5 trained on the other five cored wells scored 0.833333 |
| rows outside the training range | EKENE-8: 10 of 30 rows above the cored GR maximum 141.200000 gAPI; flagged row by row, and the whole well flagged for a gamma ray to be normalised |
| what is not claimed | no core facies and no accuracy for an uncored well |

## Item by item

**A new channel.** The prediction goes into FACIES_PRED, and the core facies of the uncored wells stays null. Writing a prediction into the core channel would erase the one fact about these wells that is certain: nobody cored them. A later training run that read FACIES would then learn from predictions as if they were rock.

**The method, in full.** kNN with k 5, standard scaling fitted on the training rows, and the four logs by name. Each of those was a choice in this tier, and each changes the prediction: the scaling moved the held-out score on EKENE-6 from 0.833333 to 0.466667 when the well was scaled on its own statistics, and the k moved it between 0.766667 and 0.866667. The course writes back kNN, the method with the higher held-out score on EKENE-6; the tree scored 0.766667 there at its default depth.

**The training wells.** All six cored wells, 180 rows. A reader who later cores a new well needs to know whether its rows were already in the training set.

**The expected agreement.** The only accuracy the prediction can honestly carry is the held-out score, 0.833333 on EKENE-6, named as a score on one held-out cored well. It is an expectation for wells like the training wells. It says nothing about a well whose logs leave the training range.

**The range flags.** EKENE-8's 10 rows above the cored GR maximum of 141.200000 gAPI are flagged one by one, and the whole well is flagged for its gamma ray to be normalised. The whole-well flag is the one that matters, because the offset sits on every row and the range check sees only the rows that leave the range.

**What is not claimed.** No core facies for an uncored well, and no accuracy for one. The withheld facies that scored EKENE-7 and EKENE-8 exist only because this field is synthetic, and they never enter the write-up.

## Why the rule is strict

The course states it in one sentence: a predicted facies written back without its method, its training wells, its held-out score and its range flags will be read later as core. Each item on the list answers a question a later reader will ask and cannot answer from the channel alone. The list is the minimum. A tied-vote count, or the rows where the tree disagreed, can be written beside it when they are known.

## Exercise

Open the view "An uncored well: predict and check the range" with EKENE-7 as the uncored well. Read the kNN counts and the range check for every log. Then write the six items of the table above for EKENE-7, with the range flags as the panel reports them, and mark which items are the same as EKENE-8's and which differ.
