import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D5 Associate m04, BM25.
# Sources: the BM25 basis (the Lucene idf, k1 and b, the distinct query terms),
# the hand set's "oil rate" scores and term contributions, k1 = 0, the
# saturation table, b on Q13, k1 2 on Q13, the repeated query word, Q02 read
# term by term, the (k1 + 1) numerator choice, and the rankBm25 refusals.
# Every figure is printed in the digest.

q(1, "System A weights each matched word by the Lucene idf. Over the five stated passages, with df 2, what weight does oil get?",
 "0.875469, adding 1 to (5 - 2 + 0.5) / (2 + 0.5) before the logarithm",
 ["1.693147, the smoothed idf that scikit-learn uses",
  "0.241162, the idf the six stated saturation passages give the word oil when b is set to 0",
  "0.707107, oil's weight in the unit query vector"],
 "BM25 uses the Lucene idf ln(1 + (N - df + 0.5) / (df + 0.5)); with N 5 and df 2 that is 0.875469. 1.693147 is oil's TF-IDF idf on the same passages, a different formula. 0.241162 is oil's idf over the six saturation passages, a different corpus, and 0.707107 is a TF-IDF query weight."),

q(3, "Why can the BM25 idf in this engine never be negative?",
 "The Lucene form adds 1 inside the logarithm, so even a word in every passage keeps a small positive idf.",
 ["The engine drops every word that appears in more than half the passages before it scores anything.",
  "A negative idf is refused, naming `k1`, so the call stops before it can be returned.",
  "It is clipped at 0 after the Robertson form is computed."],
 "The Lucene idf is ln(1 + (N - df + 0.5) / (df + 0.5)), and the 1 inside the logarithm keeps the argument above 1, so the idf stays positive; ekene, in 44 of 60 passages, still scores 0.315385. No word is dropped for being common, no refusal is involved, and the engine does not compute the Robertson form at all."),

q(0, "For \"oil rate\" on the hand set, d1 scores 2.191027 by BM25. How is that score built?",
 "oil and rate each contribute 1.095514, and the score is their sum",
 ["It is the cosine 0.715911 scaled up by k1 + 1",
  "oil contributes 2.191027 and rate adds nothing, having been counted already",
  "Each word's idf 0.875469 is multiplied by its count of 2, and the two products are then averaged"],
 "A BM25 score is a sum over the distinct query terms found in the passage of idf x tf (k1 + 1) / (tf + k1 (1 - b + b dl / avgdl)). In d1 oil and rate each have tf 2 and contribute 1.095514, which sums to 2.191027. The cosine is TF-IDF's score, every matched term adds its own part, and the count enters through the saturating fraction, never as a plain product."),

q(2, "oil appears twice in d1 and twice in d3, yet contributes 1.095514 to d1 and 1.024632 to d3. Why?",
 "d3 is longer, 12 tokens against 10, and b marks a longer passage down",
 ["d3 also holds rates, which BM25 treats as a second copy of rate and deducts from oil",
  "The idf of oil is lower in d3",
  "d3 ranks second, and each rank below the first loses a fixed share of every contribution it has"],
 "With the same tf and the same idf, the only difference is length: d3 has 12 tokens and d1 has 10, against an average of 7.400000, and the length term tf + k1 (1 - b + b dl / avgdl) grows with dl. The idf belongs to the word across the corpus, rates is a different token with nothing deducted, and rank is an outcome of the score."),

q(3, "With k1 set to 0, how do d1 and d3 compare for \"oil rate\"?",
 "1.750937 each, the sum of their matched terms' idf",
 ["0 each, since k1 = 0 switches the term weighting off entirely and every score collapses to nothing",
  "2.191027 and 1.722606, as k1 affects only passages longer than the average length",
  "The call is refused, naming `k1`, since 0 is below the accepted range for the parameter"],
 "At k1 = 0 the fraction is 1 for any count, so each matched term scores its idf alone: d1 and d3 both match oil and rate and both score 1.750937, although d1 says rate twice. 2.191027 and 1.722606 are the scores at the default 1.2. 0 is accepted: the refusal is for k1 below 0, and its message says 0 scores each matched term at its idf."),

q(1, "In the saturation table (b = 0, k1 1.2), a term's contribution divided by its idf climbs 1.000000, 1.375000, 1.571429, 1.774194, 1.941176 as tf goes 1, 2, 3, 5, 9. Where does it head?",
 "Toward k1 + 1 = 2.2, which it never reaches",
 ["Toward 9, the largest count in the table, which the ratio would reach at the next repeat",
  "It grows without limit, each repeat adding the same amount to the score as the one before",
  "Toward 1, since b = 0"],
 "The fraction tf (k1 + 1) / (tf + k1) climbs toward k1 + 1 = 2.2 and never reaches it: each extra repeat adds less, which is saturation. The table itself shows equal repeats adding less each time, so growth is neither linear nor unbounded, and b = 0 only removes length, leaving the climb from 1.000000 in place."),

q(0, "Q13 is scored at b = 0 and at b = 1. Which passage is first at each?",
 "EKD-030 (43 tokens) at b = 0, and EKD-029 (29 tokens) at b = 1",
 ["EKD-029 at both, since b changes scores and never the order of the top of a list",
  "EKD-006 (56 tokens) at b = 0, as the longest passage always wins without length normalisation",
  "EKD-030 at both, since b alters only the fifth place and the tie at the cutoff"],
 "At b = 0 length plays no part and the longer EKD-030 is first at 10.217811; at b = 1 the full ratio dl / avgdl applies and the shorter EKD-029 is first at 10.305812. So b does change the order. EKD-006 is fourth at b = 0, and length alone decides nothing without the matched words."),

q(2, "What does the engine return for b = 1.5?",
 "A refusal: \"b must be a number from 0 to 1 (0 removes length normalisation)\"",
 ["Scores computed at b = 1, with a note that the value was clipped",
  "A refusal: \"k1 must be a finite number, 0 or more (0 scores each matched term at its idf)\"",
  "Scores that mark long passages down harder than b = 1 does, by half again"],
 "b must lie from 0 to 1, and a value outside is refused naming `b` in the engine's words \"b must be a number from 0 to 1 (0 removes length normalisation)\". The engine never clips silently. The k1 message is the refusal for a negative k1, and no score is computed for a refused b."),

q(3, "BM25 is handed \"oil oil rate\" over the five stated passages. What is d1's score?",
 "2.191027, exactly the score of \"oil rate\", since a repeated query word counts once",
 ["More than 2.191027, as the repeated oil adds its 1.095514 a second time",
  "0.679173, the cosine TF-IDF gives the same query",
  "1.095514, since oil is doubled and rate is dropped"],
 "The engine keeps the distinct query terms, Okapi's query-frequency factor with k3 = 0, so \"oil oil rate\" returns exactly the scores of \"oil rate\": d1 2.191027, d3 1.722606. 0.679173 is d1's TF-IDF cosine for the repeated query, since TF-IDF does count the repeat, and no query word is dropped."),

q(1, "Q02 \"initial oil rate of Ekene-3\": which query term gives EKD-043 its largest contribution, and why is it so large?",
 "rate, at 2.176711, since rate is in only 6 passages and has the highest idf of the query, 2.239072",
 ["of, at 1.537842, since of appears twice in EKD-043 and a count of 2 doubles a term",
  "oil, since EKD-043 mentions oil three times",
  "initial, at 1.918143, the rarest query word"],
 "EKD-043's terms are rate 2.176711, of 1.537842, ekene 0.306601 and 3 1.108697; rate, in 6 passages, has the largest idf, 2.239072. of has tf 2 and gains less than double because counts saturate. EKD-043 never mentions oil or initial: 1.918143 is initial's contribution in EKD-010."),

q(0, "On Q02, which query term has the smallest BM25 idf, and what is it?",
 "ekene, in 44 of the 60 passages, at 0.315385",
 ["of, in 19 passages, at 1.140459, since a small word is always weighted least",
  "oil, in 24 passages, at 0.912201, since oil is the most common word in a field's reports",
  "3, which is a single character and so has an idf of 0"],
 "The idf falls as df rises: ekene is in 44 passages and has 0.315385, the smallest, yet still above 0. of and 3 share 1.140459 at df 19, well above ekene, oil has 0.912201 at df 24, and single-character tokens are kept and weighted like any other."),

q(2, "A caller sets k1 to -0.5, hoping to reward passages that say a word once. What happens?",
 "A refusal naming `k1`: \"k1 must be a finite number, 0 or more (0 scores each matched term at its idf)\"",
 ["Scores at k1 = 0, with a note that negative values are raised to 0",
  "A refusal naming `b`, since k1 is checked together with b",
  "Scores in which each repeat lowers a passage's score, since saturation turns downward below 0"],
 "k1 must be 0 or more, and the engine refuses -0.5 naming `k1` in its own words \"k1 must be a finite number, 0 or more (0 scores each matched term at its idf)\". It never raises a value silently, the field named is k1 itself, and no score is computed for a refused k1."),

q(3, "The engine keeps (k1 + 1) in the BM25 numerator, as Robertson and Zaragoza write it; Lucene 8 and later drop it. What does dropping it do?",
 "It scales every score by the same factor and leaves the ranking order unchanged",
 ["The ranking reverses, since the numerator then shrinks as a term repeats",
  "k1 then has no effect on the score at all, so every value of k1 gives the same scores",
  "Each score becomes a figure between 0 and 1"],
 "Dropping (k1 + 1) scales every score by the same factor and leaves the order, so a ranking from either form is the same list; only the scores differ, and a BM25 score should be compared with one computed by the same form. k1 still appears in the denominator, and no form bounds a score between 0 and 1."),

q(1, "A BM25 call is given passages made of punctuation only. What does the engine return?",
 "A refusal: \"documents has no token in any text: BM25 needs an average document length above 0\"",
 ["Every passage, ranked at score 0",
  "A note, \"no document contains a query term, so no document is ranked\", with an empty list and no refusal at all",
  "A refusal: \"documents has no token in any text: the vocabulary is empty\""],
 "BM25 divides each length by avgdl, and with no token anywhere avgdl is 0, so the engine refuses naming `documents`: \"documents has no token in any text: BM25 needs an average document length above 0\". The note is for a query no passage contains in a corpus that has tokens, the vocabulary message is TF-IDF's, and nothing is ranked at score 0."),

q(2, "Q13 is scored at k1 1.2 and at k1 2. What changes?",
 "Each top 5 score rises, EKD-029 goes from 9.951737 to 10.388779, and the order holds",
 ["Each top 5 score falls, since a larger k1 divides each term by more",
  "The order reverses, with EKD-037 moving from fifth place to first place once k1 is raised to 2",
  "Nothing, since k1 matters only when b is 0"],
 "A larger k1 lets repeats keep counting for longer, and on Q13 each of the five top scores rises at k1 2 while the order holds: EKD-029 9.951737 to 10.388779, EKD-030 9.798866 to 10.116345, down to EKD-037 at fifth, 6.222042 to 6.469637. The claim is about the top 5 the course prints; a larger k1 does not raise every score in the corpus. k1 applies whatever b is."),

emit(Q, '/root/dai-wip-appliedai/banks/d5b_m04.json', expect_n=15)
finish()
