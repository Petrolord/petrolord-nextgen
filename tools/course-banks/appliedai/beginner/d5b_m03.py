import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D5 Associate m03, TF-IDF.
# Sources: the TF-IDF basis (raw counts, the smoothed idf, l2 unit vectors,
# the cosine, the ranking rule), the hand set's idf table and document
# vectors, "oil rate" ranked by cosine, Q04 on the corpus with its query
# vector, the dropped terms of Q24, sublinear tf on Q13, the repeated query
# word through rankTfidf, and the tfidfVectors and rankTfidf refusals and note.
# Every figure is printed in the digest.

q(3, "On the hand set of five passages, oil is in d1 and d3. What is its TF-IDF idf?",
 "1.693147, from ln((1 + 5) / (1 + 2)) + 1",
 ["0.875469, the Lucene form ln(1 + (N - df + 0.5) / (df + 0.5)) used by BM25",
  "2.098612, counting all 4 uses of oil",
  "0.707107, its weight in the query"],
 "The engine uses scikit-learn's smoothed idf, ln((1 + N) / (1 + df)) + 1 with N 5 and df 2, which is 1.693147. 0.875469 is oil's BM25 idf, a different formula. df counts passages, never occurrences, and 2.098612 is the idf of a word in 1 passage. 0.707107 is oil's weight in the query vector, after scaling to unit length."),

q(1, "Which hand-set words share the TF-IDF idf 2.098612?",
 "Every word in exactly one passage, such as injection, rates and the",
 ["Only the rarest content words, since the engine gives stop words such as the a lower idf",
  "oil and rate, the two words of the query \"oil rate\"",
  "Each word that appears twice in one passage"],
 "idf depends on df alone, so every word in exactly 1 of the 5 passages gets ln(6 / 2) + 1, 2.098612: 096, injection, rates and even the. The idf knows nothing about the word itself, and the stop list is off. oil and rate are each in 2 passages, so theirs is 1.693147, and a repeat inside one passage raises the count, never the df."),

q(0, "What TF-IDF idf would a word have if it appeared in every one of the five hand-set passages?",
 "1, because the final + 1 keeps it above 0",
 ["0, since a word found everywhere carries no information about which passage to pick",
  "A negative weight, as the logarithm of a fraction below 1 is negative",
  "2.098612, as for a rare word"],
 "With df equal to N the fraction (1 + 5) / (1 + 5) is 1, its logarithm is 0, and the final + 1 leaves the idf at 1: a term in every passage would still have idf 1, never 0. The fraction never falls below 1 in this form, so the idf is never negative, and 2.098612 belongs to a word in one passage."),

q(2, "d1's raw weights have norm 6.689301. What is oil's weight in d1's unit vector?",
 "0.506225, from 2 x 1.693147 / 6.689301",
 ["1.693147, the idf alone",
  "0.313727, as for every d1 word",
  "0.474658, the weight that scaling gives oil in d3, the longer passage"],
 "oil has count 2 in d1 and idf 1.693147, and dividing that raw weight by the norm 6.689301 gives 0.506225. Every weight is divided, the heaviest included. 0.313727 is the weight of 1, 120 and fell, which appear once with the higher idf, and 0.474658 is oil's weight in d3, whose norm is 7.134175."),

q(2, "Why does the engine scale every TF-IDF passage vector to length 1?",
 "So a score depends on which words are shared and in what proportion, and the passage's size drops out",
 ["So that a long report that mentions a word once is rewarded for its extra length",
  "Because the idf alone cannot tell a rare word from a common one without it",
  "To turn each weight into the chance that the passage answers a query"],
 "Dividing every weight by the norm keeps the vector pointing the same way and makes its length 1, so the passage's mix of words remains and its size drops out: a long report is not rewarded for its length. The idf already separates rare from common words, and a unit weight is a weight, never a chance of answering."),

q(0, "The hand-set passage d5 is empty. What happens to it in TF-IDF?",
 "It is a zero vector with norm 0, so it can never rank",
 ["The engine refuses the whole call, naming `documents`, because one passage has no token in it",
  "It ranks last, with equal weights",
  "It takes the mean vector of the other four passages, so it can still be matched"],
 "d5 has no tokens, every weight is 0 and its norm is 0; a vector of zeros cannot be scaled to length 1 and it can never rank. The empty-vocabulary refusal applies only when no passage in the call holds a token, and the engine invents no weights for an empty passage."),

q(3, "Ranked by TF-IDF cosine against the two-word query \"oil rate\", which figure does d1 reach, and from which products?",
 "0.715911, from 0.707107 x 0.506225 twice, summed",
 ["2.191027, the sum of d1's two matched terms, oil and rate, each weighted by BM25",
  "1.000000, since both of the query's words are in d1 and a full match scores 1",
  "0.506225, oil's weight in d1 alone"],
 "The query vector is oil 0.707107, rate 0.707107, and d1 weights each 0.506225, so the dot product is 0.715911. 2.191027 is d1's BM25 score for the same query, a different quantity. A cosine reaches 1 only when the two vectors point the same way, and d1 holds other words, and every shared query word is scored."),

q(1, "\"oil rate\" is ranked by cosine on the five hand-set passages at k 5. How many passages rank?",
 "2, d1 and d3",
 ["5, as k is 5 and a list is always filled to its cutoff",
  "4, since only the empty d5 is left out of the list",
  "3, d1, d3 and d2, since d2 holds water, a word near the query"],
 "Only a score above 0 ranks. d2 and d4 share no term with the query and d5 is empty, so 2 of the 5 passages rank and the list is shorter than k. d2's water is a different token from oil and rate, and the engine matches tokens only."),

q(0, "For Q04 \"bubble point pressure of the Ekene oil\", TF-IDF ranks EKD-018 first at 0.553949. Where is EKD-010, the passage judged to answer the query?",
 "Second, at 0.328560",
 ["First, since the judged grade 3 lifts it above every passage graded 2 in the list",
  "Fifth, at 0.251461, the lowest place in the top 5 at the cutoff",
  "Outside the top 5, as its words do not match the query"],
 "The cosines run EKD-018 0.553949 (grade 2), EKD-010 0.328560 (grade 3), EKD-011, EKD-020 and EKD-057. A cosine measures shared words, so a passage can share more words with a query than the one that answers it, and the judgments play no part in the score. 0.251461 is EKD-057, graded 0."),

q(3, "In Q04's query vector, which word carries the smallest weight, and why?",
 "the, at 0.188200, since it is common across the corpus",
 ["bubble, at 0.549668, as the longest word is weighted down to keep the vector at length 1",
  "ekene, at 0.204740, since a field name in its own field's reports is always given the lowest weight",
  "oil, at 0.297012, as a title word"],
 "The query is weighted like a passage, so common words get low idf: the carries 0.188200, the smallest weight. bubble, at 0.549668, is the heaviest, being rare. ekene is also low at 0.204740, above the and never forced to the bottom. Word length and titles play no part, since the engine indexes the text alone and weighs words by df."),

q(1, "Q24 \"subsea tree replacement on Ekene-5\" is ranked by TF-IDF. What happens to the words subsea and tree?",
 "They are dropped, because no passage contains them, and the cosine uses 5, ekene, on and replacement",
 ["The engine refuses the query and names `query`, since two of its words are unknown",
  "They get the largest idf, as a word in no passage is the rarest word of all",
  "They are stemmed to sub and tre and matched against every passage holding those"],
 "Query terms outside the corpus vocabulary are dropped, so the cosine is computed on 5, ekene, on and replacement. Unknown words are no reason to refuse; if every query word were unknown the result would carry the note \"no query term is in the corpus vocabulary, so no document is ranked\". A word in no passage has no weight at all, and nothing is stemmed."),

q(2, "With sublinear tf on, what changes for Q13 \"Ekene-6 water cut at the end of 2025\"?",
 "A count c becomes 1 + ln c, EKD-029 stays first at 0.395996, and EKD-030 rises to 0.382844",
 ["Every passage's cosine is halved, since the idf is squared before the counts are applied",
  "The order flips, with EKD-030 moving above EKD-029 for the first time",
  "Nothing, since sublinear tf applies to BM25 alone"],
 "Sublinear tf replaces a count c by 1 + ln c before the idf, so a repeated word counts for less. On Q13 it moves the cosines and keeps the order: EKD-029 goes from 0.404014 to 0.395996 and EKD-030 from 0.355212 to 0.382844. The idf is unchanged, and sublinearTf is a TF-IDF switch."),

q(0, "Through rankTfidf, the hand-set query \"oil oil rate\" gives d1 a cosine of 0.679173. Why does it differ from 0.715911 for \"oil rate\"?",
 "TF-IDF weights the query like a passage, so the repeat shifts the query vector to oil 0.894427, rate 0.447214",
 ["The repeated word is refused, and the call is run again on rate alone as a fallback",
  "TF-IDF counts a repeated query word once, so the drop comes from d1's own vector",
  "Repeating a word adds a penalty to every passage that holds it"],
 "In TF-IDF the query is weighted the same way as a passage, raw counts times idf scaled to unit length, so \"oil oil rate\" gives oil 0.894427, rate 0.447214 and d1 moves to 0.679173. Nothing is refused and d1's own vector is unchanged. Counting a repeat once is BM25's rule, and there is no penalty term."),

q(3, "A TF-IDF call is given one passage, and it is empty. What does the engine return?",
 "A refusal: \"documents has no token in any text: the vocabulary is empty\"",
 ["A result with a note, since an empty passage is ranked with a note and no refusal",
  "An empty ranking and a vocabulary of 0 terms, without any refusal or note",
  "documents must be a non-empty array of { id, text }"],
 "A vocabulary needs at least one token somewhere; with none, the engine refuses naming `documents` in its own words \"documents has no token in any text: the vocabulary is empty\". The list itself holds one entry with an id and a text, so it is not the non-empty array message, and a call that cannot build a vocabulary does not run."),

q(1, "EKD-018 scores a cosine of 0.553949 against Q04. What does that figure tell you?",
 "How closely its weighted words line up with the query's, a score used only for ranking",
 ["The likelihood, 0.553949, that the assessor would judge EKD-018 relevant to Q04 on the four-grade scale",
  "The share of Q04's words that appear anywhere in the text of EKD-018",
  "That EKD-018 was judged grade 2, which the cosine records"],
 "A cosine is the dot product of two unit vectors: how closely the passage's weighted words line up with the query's. It is a score for ranking and never a probability, so it says nothing about how likely EKD-018 is to answer Q04. It is a weighted measure and counts no plain share of words, and the judged grade is fixture data the cosine never reads."),

emit(Q, '/root/dai-wip-appliedai/banks/d5b_m03.json', expect_n=15)
finish()
