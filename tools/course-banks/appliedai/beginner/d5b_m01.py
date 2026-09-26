import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D5 Associate m01, What Copilots and Retrieval Do.
# Sources: the digest's function table and what the engine does not do, the
# Ekene document set (corpus, queries, grades, pooling, the two systems, the
# planted defects), the Associate refusals and notes, what is graded and what
# never is, system A's Q06 unsupported claim, and the vocabulary table. Every
# figure is printed there.

q(2, "Which language model does the evaluation engine call when it scores a copilot?",
 "None: its imports are lib/stats, the percentile conventions and the machine learning engine, and its source makes no network call.",
 ["A small model that it runs locally to judge whether each cited answer is true before the claims are counted.",
  "One that embeds every passage, so that BM25 and TF-IDF can compare meanings as well as words.",
  "Only the model behind system B, which it asks to rerank the TF-IDF list before scoring."],
 "The engine runs no language model: it writes no answer, embeds no text, reranks nothing and asks no model to judge an answer, and its imports are lib/stats, lib/conventions/percentile.js and the machine learning engine. There is no dense retrieval to compare meanings, and system B is a fixed TF-IDF retriever with hand-written answers, so there is nothing to rerank."),

q(0, "Q14 asks \"Is Ekene-5 producing water?\" and BM25 finds none of its 3 relevant passages in the top 5. What causes the miss?",
 "The passages say \"no water\" and \"water free\", and the engine matches tokens alone, with no synonym list and no stemming.",
 ["BM25 drops the word water because it appears in too many passages, so the query is scored on producing alone.",
  "System A ran with the stop list on, which removed every word in the query that the passages share.",
  "Q24 was excluded from the means, and its judgments were merged into Q14's by the pooling step."],
 "Q14 is a planted lexical trap: the answering passages say \"no water\" and \"water free\" while the query says \"producing water\", and the engine retrieves by words alone. A common word keeps a positive BM25 idf, so it is never dropped. System A ran with the stop list off. Q24's exclusion from the means has nothing to do with Q14's ranking."),

q(3, "EKD-058 is an exact copy of EKD-046, a spill note filed twice. What decides which of the two ranks first?",
 "The tie rule: equal scores tie and the id ascending puts EKD-046 first.",
 ["Each passage's date, so that the note filed earlier is always placed first in the list.",
  "Passage type, because an hse_note outranks every other type when two passages share a score.",
  "Whichever the fixture lists first, which makes the result depend on how the files were written."],
 "Every method scores the two copies alike, so their order comes from the ranking rule: scores that agree to 12 significant digits tie, and ties go to the document id ascending. The engine indexes the text alone, so a passage's date and type play no part, and a stated rule replaces input order so the same inputs always give the same list."),

q(1, "On the four-grade scale used for the Ekene judgments, what does grade 1 mean?",
 "Related, and at the default threshold it still counts as relevant.",
 ["Answers the query, which is the highest grade a judged passage can receive from the assessor.",
  "Judged not relevant, so it is left out of every metric in the same way as an unjudged passage.",
  "Relevant, the middle grade, which the course counts only when the threshold is raised to 2."],
 "The fixture grades are 3 answers the query, 2 relevant, 1 related and 0 judged not relevant. The course calls a passage relevant at or above a stated threshold, grade 1 by default, so a related passage counts. Grade 3 is the top grade and grade 0 is the judged not-relevant grade, and at a threshold of 2 grade 1 would stop counting."),

q(0, "A passage in System A's top 5 for a query was never judged by anyone. How is it graded?",
 "As grade 0, because unjudged passages count as grade 0.",
 ["As grade 1, since a passage the retriever found is assumed to be at least related to the query.",
  "It is removed from the ranked list first, and every passage below it moves up one rank.",
  "The engine refuses the call and names the passage, since every retrieved passage needs a grade."],
 "The stated rule is that unjudged passages count as grade 0. No grade is assumed for a retrieved passage, the ranking is never edited to drop it, and the call is not refused: an unjudged passage is an ordinary part of a ranked list."),

q(3, "How was the set of judged (query, passage) pairs for the Ekene queries built?",
 "By pooling: every passage in either system's top 5 was judged, plus passages the assessor added.",
 ["By judging every one of the 60 passages against all 24 queries, so no pair was left unjudged.",
  "From system A's top 5 alone, since BM25 is the retriever the course treats as the reference.",
  "By sampling passages with a seeded random draw so that each query received a similar count."],
 "The judged set was pooled: every passage in the top 5 of either system, BM25 and TF-IDF at default settings, plus passages the assessor added, 183 pairs in all. Judging every pair would give far more than 183, both systems fed the pool, and no random draw chose the judged passages."),

q(1, "Which settings did system A use to retrieve its top 5?",
 "BM25 with k1 1.2 and b 0.75, the stop list off.",
 ["TF-IDF on raw counts with the smoothed idf, and the stop list on for every query.",
  "BM25 with k1 2 and b 1.",
  "Its retriever was a dense embedding search followed by BM25 on the passages it kept."],
 "The fixture states system A as bm25 k 5 k1 1.2 b 0.75, stop list off, and system B as tfidf k 5, stop list off. TF-IDF is system B's method and neither system switched the stop list on. k1 2 and b 1 are settings the course explores on Q13, and system A kept the defaults; the engine has no embedding search."),

q(2, "Why can no question key or capstone field in this course rest on a language model's output?",
 "Model output changes between runs and versions, so a key resting on it would have no fixed right answer.",
 ["The fixture answers were written by a model, so scoring a second model's output would count it twice.",
  "Language models refuse to cite passages, so there would be nothing for the claim check to read.",
  "The engine has a model built in, and letting a second one grade it would create a conflict of scores."],
 "A graded answer needs exactly one right value on any machine and any day. Output from a language model changes from run to run and from one model version to the next, so a model's output is an input to be scored and never a key. The fixture answers are hand-written and no model wrote them, and the engine contains no model."),

q(2, "What does the engine return when it refuses an input it cannot use?",
 "An object with `error` and `field`, where the message starts with the field it names.",
 ["A result object with every value set to null and no sentence explaining which input caused it.",
  "It throws an exception that stops the panel and asks the user to reload the page before trying again.",
  "A result with a `note`, since a refusal and a note are the same thing."],
 "Every function returns either a result or an object with `error` and `field`, where `field` names the input it refused and the message starts with that name. A refusal is never a silent null. A note is different: it comes with a result from a call that ran, and a refusal means the call did not run."),

q(3, "EKD-001 is passed twice in one documents list. Which field does the refusal name?",
 "documents[1].id, the position of the repeat",
 ["documents[0].id, the first copy of the id, which the engine treats as the offending entry in the list",
  "query, which is checked first",
  "documents, the list as a whole"],
 "The engine's own words are \"documents[1].id repeats EKD-001 (documents[0])\": the field names the position of the repeat, counted from 0, and the bracket points back at the first copy. It names the second entry, the one that repeats, and the message is about the documents list entry, so neither the query nor the whole list is named."),

q(0, "A call asks `retrieve` for a method this engine does not offer. What is the engine's message?",
 "method must be 'bm25' or 'tfidf'",
 ["the call is run with BM25 instead, and a note in the result says so",
  "method is unknown, and the passages are returned in the order they were given",
  "query must be a string"],
 "The refusal names `method`, and the engine's own words are \"method must be 'bm25' or 'tfidf'\". The engine never substitutes a method or returns an unranked list in place of a refusal. \"query must be a string\" is the refusal for a query that is not text, a different input."),

q(1, "The query helicopter is run by BM25 on the Ekene passages, and no passage contains the word. What comes back?",
 "A result with no ranking and the note \"no document contains a query term, so no document is ranked\"",
 ["A refusal naming `query`, with the message \"query must be a string\", because the word is unknown to the corpus vocabulary",
  "A ranking of all 60 passages at score 0, in id order",
  "The five shortest passages, since each scores the same when nothing matches"],
 "A query whose words appear in no passage is not refused: the call runs and returns an empty ranking with the note \"no document contains a query term, so no document is ranked\". \"query must be a string\" is the refusal for a query that is not text. Only a score above 0 is ranked, so no passage is listed at score 0 and no passage is chosen by its length."),

q(3, "System A's answer to Q06 states a maximum oil column of 20.3 m, a figure that is in EKD-007 only. What does the course call that claim?",
 "An unsupported claim, which this course calls a hallucination",
 ["A supported claim, since the figure does appear somewhere in the Ekene corpus and can be found",
  "A correct abstention, since it cites a passage",
  "An identifier with no claim in it"],
 "EKD-007 was neither retrieved nor cited, so the check could not find 20.3 in a cited, retrieved passage: that is an unsupported claim, which is what this course means by a hallucination, named with the engine's reason. Support needs a cited and retrieved passage; appearing elsewhere in the corpus is no support. An abstention states no figure, and 20.3 stands apart from any word, so it is a claim and no identifier."),

q(0, "In this course, what does the word \"AI\" name?",
 "The system being evaluated, such as a copilot or a search box.",
 ["BM25 and TF-IDF, the two ranking methods.",
  "Anything automated in the engine, including the tokeniser that splits every passage into words.",
  "The claim check and the tie rule, the steps that decide without a person looking."],
 "The vocabulary rule is that \"AI\" names the system being evaluated. The engine runs no model, and every method is named by what it is: tokenising, TF-IDF, BM25, a ranking rule, a claim check. Calling a ranking method, the tokeniser, the claim check or the tie rule AI would name a method this engine runs, which the rule forbids."),

q(1, "For Q02 \"initial oil rate of Ekene-3\", BM25 ranks the drilling report EKD-043 first at 5.129851. Why does it outrank EKD-003, the passage that answers the query?",
 "It shares the words rate and of with the query, and BM25 matches words without any sense of meaning.",
 ["It has the highest judged grade for Q02, and BM25 reads the judgments while it scores the passages.",
  "It is the shortest passage in the corpus, and BM25 always puts the shortest match first on any query.",
  "Its score is a probability of 5.129851 against the 4.084216 given to EKD-003, so it is more likely."],
 "EKD-043 is a drilling report about the rate of penetration and ranks first on the words rate and of. Its judged grade for Q02 is 0, and BM25 never reads judgments. It has 41 tokens, so it is not the shortest passage, and a BM25 score is a sum over matched words: a score is never a probability."),

emit(Q, '/root/dai-wip-appliedai/banks/d5b_m01.json', expect_n=15)
finish()
