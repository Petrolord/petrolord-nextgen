import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D5 Expert m06, Reading the Engine Honestly. Figures and rules from the
# course's sections on what the engine computes and declines, what is graded,
# the conventions that are choices, what is not built and the evaluation
# report, with figures quoted from the retrieval, comparison, agreement and
# calibration sections they summarise.

K = [2, 0, 1, 3, 0, 2, 3, 1, 3, 1, 0, 2, 1, 3, 0]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("What does the evaluation engine import, and what does it call beyond them?",
 "lib/stats, lib/conventions/percentile.js and engines/dataai/ml.js, and it makes no network call",
 ["lib/stats and a hosted language model, which it calls once for every answer in order to judge each claim",
  "Nothing at all: every function, log loss included, is written out again inside the engine",
  "scikit-learn through a bridge, which it calls for TF-IDF, kappa and the calibration curve"],
 "The course checks the engine's imports and source: lib/stats (mulberry32 and quantile), lib/conventions/percentile.js and, from the machine learning engine, logLoss, with no network call. It runs no language model. Log loss is imported and never re-implemented. scikit-learn is a witness the engine's figures are compared with, never a dependency.")

# 2
x("A tool built around the engine uses a language model to draft answers. How does the course treat that output?",
 "As an input, scored by the same deterministic checks as the fixture answers, and never as a key, label or judgment",
 ["As a second annotator, whose grades are compared with the primary ones by kappa and then averaged into the key",
  "As the key for any query with no reference answer, since a model can answer where the judged set cannot",
  "As a check on the engine: a claim the model accepts is marked supported even when no cited passage holds it"],
 "A model's output changes from run to run and between model versions, so a key resting on it would have no fixed right answer. The course's rule is that it is an input to be scored, by claims against cited and retrieved passages, exact match and token F1, and extraction outcomes. It never becomes a key, a label or a judgment, and it overrides no check.")

# 3
x("Why does a capstone field in this course have exactly one right answer?",
 "It is a return value of the engine on inputs written down in advance, so the same inputs give the same number on any machine",
 ["It is the median of several model runs on the same prompt, which removes the variation between one run and the next",
  "Its tolerance is wide enough that any reasonable method lands inside it, whatever the settings the learner chooses",
  "It is typed by hand into the grader from the lesson text, so the grader and the learner read the same figures"],
 "Every graded number is computed by a named engine function on fixed inputs, and the only random draw is the seeded bootstrap, named exactly by its seed and replicate count. No model output enters. Tolerances are made in one place and never typed, and they exist to absorb rounding, never method choice.")

# 4
x("System B's Q05 answer dates Ekene-6's water breakthrough 2024-09-01, and the date is in EKD-027, which it cites and retrieved. What do the checks return, and what does that show?",
 "The claim is supported and the short answer scores exact match 0: grounded says nothing about truth",
 ["The claim is unsupported, since EKD-027 is about another well and the check reads which well a passage covers",
  "The claim is supported and exact match 1, since a supported date is scored as a correct short answer",
  "The claim is flagged notRetrieved, since EKD-027 was not in system B's top 5 for the query Q05"],
 "The check finds the date in a cited, retrieved passage, so the claim is supported; EKD-027 is about Ekene-3's breakthrough, and Ekene-6 broke through on the reference date 2024-03-01, so the short answer scores exact match 0. The check cannot know a passage is about another well. EKD-027 was retrieved and cited, so no flag is raised.")

# 5
x("The engine keeps the (k1 + 1) factor in the BM25 numerator, where Lucene 8 and later drop it. What does that choice change?",
 "The size of every score by one common factor, leaving the order of the passages identical",
 ["The order of the passages, since dropping the factor favours those passages with repeated terms",
  "Nothing at all: the two forms give the same scores to every printed decimal on the Ekene corpus",
  "The idf of each term, since Lucene 8 moves the factor inside the logarithm of the idf"],
 "The course names this choice as Robertson and Zaragoza's form: dropping (k1 + 1) scales every score and leaves the order. So a BM25 score from this engine and one from Lucene 8 differ in size for the same passage while the rankings agree. The idf is unaffected, and the scores do differ, so the choice is named whenever a score is compared across tools.")

# 6
x("Which common alternative to the engine's BM25 idf does the course name, and why did the engine decline it?",
 "The Robertson form, which goes negative for common terms; the Lucene form is never negative",
 ["The smoothed TF-IDF idf, which adds 1 to both counts; BM25 needs no smoothing on small corpora",
  "The Robertson form, which ignores document frequency; the Lucene form was chosen for its speed",
  "Raw document frequency, which rewards common terms; the Lucene form divides by the corpus length"],
 "The engine uses the Lucene idf ln(1 + (N - df + 0.5) / (df + 0.5)), which adds 1 inside the logarithm, so even a term in every passage keeps a small positive idf; the Robertson form without that 1 goes negative for common terms. The smoothed idf belongs to TF-IDF. The Robertson form does use document frequency, and speed is not the stated reason.")

# 7
x("The engine divides average precision by every relevant judged passage. Which alternative does it decline, and what does its choice do to a missed passage?",
 "Dividing by min(k, relevant); under the engine's rule a relevant passage never retrieved lowers AP",
 ["Dividing by k; under the engine's rule a missed passage is left out of AP entirely and changes nothing",
  "Dividing by the relevant passages retrieved; under the engine's rule a missed one raises AP",
  "Dividing by the judged passages; under the engine's rule a missed one counts only at grade 3"],
 "The course's table names min(k, relevant) as the common alternative and trec_eval as the reason for the engine's choice: every relevant judged passage is in the divisor, so one never retrieved lowers the average. On the stated ranking c, a, x, b, d this gives 0.400000, where dividing by the 3 relevant passages retrieved would give 0.533333, which the engine does not compute. Dividing by k is precision's rule.")

# 8
x("The groundedness check accepts only cited and retrieved passages, with numericRelTol 0 by default. Which question does that make it answer?",
 "Could a reader trace this figure to what the system saw and cited?",
 ["Is this figure somewhere in our documents, whether cited or not?",
  "Is this figure true of the field on the very date the answer names?",
  "Did a language model agree that the figure was a well sourced one?"],
 "The course states the engine's reason: a claim must be traceable to what the system saw. Accepting any passage of the corpus is the alternative, and it answers whether the figure exists somewhere, a weaker question. No check in the engine decides whether a figure is true, and no model is asked anything.")

# 9
x("An evaluation report states system A's MAP at 5 as 0.600278 and system B's as 0.593007, and concludes that A retrieves better. What has it left out that the course's table shows can reverse the verdict?",
 "The relevance threshold: at grade 2 or more B leads, 0.771014 against A's 0.750362",
 ["The seed: on seed 8 the two MAP figures change places, so the seed must be stated",
  "The gain: under exponential gain B's MAP at 5 rises above A's, so the gain decides",
  "The bin count: MAP is read from bins, and at 15 bins the order of A and B reverses"],
 "At grade 1 system A's MAP is the higher, 0.600278 against 0.593007; at grade 2 system B's is, 0.771014 against 0.750362. The threshold is a choice that changes figures and order together, so it is stated with every figure. MAP draws no seed, uses no gain and no bins: the gain belongs to nDCG and the bins to calibration.")

# 10
x("Which of these does the course list among what is not built?",
 "A p-value, a reranker, stemming, and any fitting of the classifier behind the calibration set",
 ["The paired bootstrap, the tie key, the stop list and the reliability table at a stated bin count",
  "Cohen's kappa with linear weights, the SQuAD normalisation and the Murphy decomposition",
  "Log loss, which the engine computes with its own formula beside the Brier score"],
 "The course's list of what is not built includes no language model, no embedding or dense retrieval, no reranker, no stemming or synonyms, no query expansion, no model judging an answer, no truth check beyond finding a claim in a cited passage, no p-value, and no fitting of the calibration classifier. The paired bootstrap, the tie key, the stop list, weighted kappa, SQuAD matching and the Murphy decomposition are all built. Log loss is built by import from the machine learning engine.")

# 11
x("An evaluation report quotes a paired bootstrap interval for the nDCG difference. What must travel with it?",
 "The seed, the replicate count, the level, and whether the bootstrap was paired",
 ["The p-value, which the engine prints beside the share at or below 0 for each comparison",
  "The bin count and the edge rule, which decide where the replicates fall in the interval",
  "The model version that drew the replicates, so the interval can be regenerated later"],
 "A bootstrap figure is named exactly by its seed, replicate count and level, and the course's report checklist adds whether it was paired, since the unpaired interval is wider. On seed 7, 2000 replicates and level 0.95 the paired interval runs from -0.068015 to 0.058726; on seed 8 it is -0.063543 to 0.055562. The engine prints no p-value, bins belong to calibration, and no model draws anything.")

# 12
x("The course's worked report paragraph ends \"On this judged set the two systems cannot be told apart\". Which findings support that sentence?",
 "The paired nDCG interval runs across 0, and the second annotator's grades reverse the order of the systems",
 ["System B's MRR is higher, 0.923913 against 0.880435, which outweighs A's higher MAP on the same queries",
  "Both systems retrieved no unjudged passage at k 5, which makes their scores equal by the pooling rule",
  "The Brier score of 0.168382 shows the judged grades are poorly calibrated, so no comparison can hold"],
 "The paired bootstrap of A minus B, seed 7, 2000 replicates, level 0.95, gives an interval from -0.068015 to 0.058726, across 0; and on the second annotator's grades A leads on mean nDCG where B led on the primary grades. Two independent checks agree. MRR against MAP is a split verdict, zero unjudged passages says the key covers both systems, and the Brier score measures a classifier's probabilities.")

# 13
x("The tokeniser keeps single-character tokens, where scikit-learn's default word pattern needs two characters or more. Why?",
 "A learner can tokenise by hand, and single characters such as the 3 of Ekene-3 carry meaning",
 ["Single characters are stop words, so the engine keeps them only for as long as the stop list is off",
  "To match scikit-learn's default exactly, so that its TF-IDF figures compare to every decimal",
  "Single characters are removed later by stemming, so keeping them at this early stage costs nothing at all"],
 "The course's table gives the reason: a learner can tokenise by hand, and single-character tokens such as well numbers matter. \"Ekene-3\" becomes ekene and 3, and a two-character pattern would drop the 3. This is a departure from scikit-learn's default word pattern, and the engine does no stemming at all. The stop list is a separate switch, off by default.")

# 14
x("How does the course use the word \"AI\"?",
 "To name the system being evaluated; every method the engine runs is named by what it is",
 ["For any automated step, so the BM25 ranking and the claim check are both called AI here",
  "To name the engine itself, which the app and the course describe as an AI system",
  "For the bootstrap only, as the one part of the engine that draws random numbers to score"],
 "The legislated vocabulary says AI names the system being evaluated, and every method is named by what it is: TF-IDF, BM25, SQuAD matching, a claim check, kappa, a Brier decomposition, a seeded bootstrap. The engine runs no model, so it is never called AI. The bootstrap is a seeded resampling method and is named as such.")

# 15
x("An evaluation report gives ECE 0.209300 and MCE 0.723333 for a classifier's probabilities. What else must it name for those figures to be reproduced?",
 "The bin count, 10, and the edge rule, an interior edge opening the upper bin",
 ["The seed and replicate count, since ECE and MCE are bootstrap percentiles",
  "The cutoff k, since ECE and MCE are read from each query's top k passages",
  "Only the Brier score, 0.168382, from which both figures can be rebuilt exactly"],
 "ECE and MCE are computed on bins, so a reader needs the bin count and the edge rule; MCE is 0.660556 at 5 bins and 0.750000 at 15, and the library's edge rule moves the table. They draw no random numbers. No cutoff enters a calibration figure. The Brier score uses no bins and cannot rebuild a table.")

emit(Q, '/root/dai-wip-appliedai/banks/d5a_m06.json', expect_n=15)
finish()
