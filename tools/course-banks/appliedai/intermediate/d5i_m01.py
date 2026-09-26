import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D5 Professional m01, Average Precision and MAP.
# Every figure is quoted from digest.txt. Teaching settings unless a question
# states otherwise: k 5, relevant at grade 1 or more, the no-relevant rule
# exclude. No capstone name, id, query, answer or value appears.

q(2, "The course's stated ranking is c, a, x, b, d, with judgments a 3, b 2, c 0, d 1 and e 2, and x unjudged. At k 5 and relevant at grade 1 or more, what average precision does the engine return?",
 "0.400000, the three precisions at the relevant ranks summed and divided by 4",
 ["0.533333, the same sum divided by the 3 relevant passages retrieved",
  "0.600000, as three of the five listed passages are relevant",
  "0.500000, which is one over the rank of a, the first relevant passage the list reaches"],
 "The basis reads \"(1 / relevant judged) x sum of precision at each relevant rank up to 5\". The precisions at ranks 2, 4 and 5 are 0.500000, 0.500000 and 0.600000, and four judged passages are relevant (a, b, d and e), so AP is 0.400000. Dividing by the 3 retrieved gives 0.533333, a figure the engine does not compute. 0.600000 is precision at 5 and 0.500000 is the reciprocal rank; neither reads every relevant rank.")

q(0, "On that same stated ranking at k 5, at which ranks does average precision read a precision?",
 "At ranks 2, 4 and 5, where a relevant passage sits",
 ["Every rank from 1 to 5, whatever sits there, with the five precisions then averaged",
  "Only rank 2, where a sits, the way reciprocal rank reads the first hit",
  "Ranks 2 and 4 alone, the two places holding a passage graded 2 or more"],
 "Average precision asks the precision question again at each rank that holds a relevant passage at the stated threshold: a at 2, b at 4 and d at 5. Ranks 1 and 3 hold c, graded 0, and the unjudged x, so nothing is read there. Reading rank 2 alone is what reciprocal rank does. Leaving d out would apply a grade 2 threshold, and the stated threshold is grade 1.")

q(3, "Passage e carries a grade 2 judgment and appears in no ranked list. What is its effect on the hand-worked AP?",
 "It adds 1 to the divisor, which takes AP from 0.533333 down to 0.400000",
 ["Nothing, since a passage no list retrieved is left out",
  "It adds a precision of 0 to the sum and leaves the divisor exactly where it was",
  "It makes the engine refuse the call, since every judged passage must also be ranked"],
 "The divisor is every relevant judged passage, retrieved or not: a, b, d and e make 4. Without e it would be 3 and AP 0.533333; with it AP is 0.400000. The sum still holds three precisions, because precision is read only at ranks inside the list. A judged passage outside the ranking is ordinary and refuses nothing. The course states the reason for the choice in one line: a missed passage lowers AP.")

q(1, "System A's BM25 list for Q02, \"initial oil rate of Ekene-3\", holds one of the query's 5 relevant judged passages, at rank 4 (k 5, grade 1 or more). Its AP at 5 is 0.050000. How does the engine reach it?",
 "Precision at rank 4 is one in four, and that single term is divided by the 5 relevant judged passages",
 ["It multiplies the reciprocal rank, 0.250000, by the list's precision at 5, 0.200000",
  "Precision at 5, 0.200000, is divided by the 4 ranks that sit at or above the relevant passage",
  "Every rank from 1 to 5 adds its precision to the sum, and the five are then averaged"],
 "AP sums precision at each relevant rank and divides by relevant judged. The only relevant passage is at rank 4, where precision is 1 in 4, and 5 passages are relevant, so 0.050000. Multiplying reciprocal rank by precision at 5 lands on the same figure here by coincidence; it is no rule the engine states. Precision is read only at relevant ranks, so ranks 1 to 3 and 5 add nothing, and nothing is divided by a count of ranks.")

q(1, "System A's Q01, \"What was the reservoir pressure when the waterflood started?\", has 8 relevant judged passages at grade 1 or more, and its AP at 5 is 0.262500. Why can its AP at 5 never reach 1?",
 "A top 5 holds at most five of the eight, and the divisor stays 8",
 ["The engine caps average precision at the list's precision at 5, which is 0.600000 for this query",
  "The divisor is min(k, relevant), and at k 5 that fixes it at 5 whatever the query holds",
  "Only a query with a single relevant passage can ever reach an AP of 1, at any cutoff"],
 "Dividing by every relevant judged passage means a list of five can find at most 5 of the 8, so even a perfect top 5 falls short of 1. Dividing by min(k, relevant) is the common alternative the engine does not take. No cap at precision exists, and system A reaches 1.000000 on Q04, Q10 and Q12, each with more than one relevant passage.")

q(0, "At k 5 and grade 1 or more, system A's MAP is 0.600278 against B's 0.593007, while B's MRR is 0.923913 against A's 0.880435. Which reading fits both?",
 "B tends to put a relevant passage first; A tends to find more of them in its top 5",
 ["One of the two means must be miscomputed, since MRR and MAP always name the same system",
  "MRR divides by every relevant passage and MAP by the first, so they swap",
  "B wins both, as a higher MRR outranks a higher MAP in any comparison"],
 "MRR reads only the rank of the first relevant passage. AP reads every relevant rank and divides by every relevant judged passage. The two can name different winners on the same runs, and here they do. The divisions are the other way round from the one option that swaps them, and no rule makes one mean outrank the other: a comparison states which mean it used.")

q(3, "Switch evaluateRetrieval's noRelevant rule from exclude to zero for system A, k 5 and grade 1 or more. What MAP does the engine return?",
 "0.575266 over 24 queries, with Q24 listed as zeroed",
 ["0.600278 over 23 queries, because Q24's average precision stays null under either rule",
  "0.568299 over 24 queries, which is the figure the zero rule gives on B's runs",
  "0.593007 over 23 queries, the default exclude rule read from system B's runs"],
 "Under zero, Q24 stays in the mean and every metric it cannot give is scored 0, so A's MAP falls from 0.600278 to 0.575266 and Q24 is listed in zeroed. 0.600278 is the exclude figure for A. 0.568299 and 0.593007 belong to system B, under zero and under exclude.")

q(2, "What does retrievalMetrics return for average precision on system A's Q24 list, where all 8 judged passages are grade 0?",
 "A null, with the note \"average precision is undefined: no judged document has grade 1 or more\"",
 ["An AP of 0.000000, which the default exclude rule then carries into the mean over queries",
  "A refusal naming judgments, because every judged query needs a passage at grade 1 or more",
  "An AP of 1.000000, since a list with nothing relevant to find has found all of it"],
 "AP divides by the relevant judged passages and Q24 has none at grade 1 or more, so the engine returns the metric as null with that reason in notes. That is a result, and the call succeeds. Under the default rule evaluateRetrieval then excludes Q24 from every mean and lists it. No refusal fires for a query with nothing relevant, and full credit for nothing is how two empty short answers are scored, a different check.")

q(1, "At k 5 over the 23 included queries, MAP at grade 1 is A 0.600278 and B 0.593007; at grade 2 it is A 0.750362 and B 0.771014. What changed between the two readings?",
 "Only the question: at grade 2 a passage graded 1 stops counting as relevant",
 ["Both systems re-ranked their passages, because relevantGrade feeds back into retrieval",
  "The judged set was pooled again, and every grade 1 passage was dropped from the judgments",
  "Q24 joined the mean at grade 2, lifting B more than A"],
 "relevantGrade is applied when a ranking is scored. The runs and the judgments are the same in both readings, and 23 queries are in the means both times. At grade 2 a related passage no longer counts, and the higher MAP moves from A to B. This is why the course states the threshold with every figure.")

q(0, "Raising relevantGrade from 1 to 2 moves system A's precision at 5 from 0.443478 to 0.252174 and its recall at 5 from 0.673188 to 0.869565. Why do the two move apart?",
 "Fewer top-5 passages count as relevant, and fewer judged passages are left to find",
 ["Precision divides by the relevant judged passages, so it falls as soon as that count falls",
  "Recall is held below precision, so a fall in one pushes the other up",
  "Grade 2 passages sit lower in each list, which lowers precision and raises recall with it"],
 "Precision at 5 divides by k, so it falls when fewer of the top 5 are relevant at the new threshold. Recall divides by the relevant judged passages, a count that shrinks as well, so recall rises. The course checked the direction for both systems. Precision never divides by the relevant judged count, nothing ties recall to precision, and the passages kept the ranks they had.")

q(3, "A call to retrievalMetrics sets relevantGrade to 0. What happens?",
 "The engine refuses it: \"relevantGrade must be a whole number from 1 to 10\"",
 ["Every passage in the ranking, judged or unjudged, is scored as relevant",
  "The engine falls back to its default threshold of 1 and adds a note saying so",
  "It succeeds, with recall and average precision returned as null on every query"],
 "A threshold of 0 would make every passage relevant, judged or not, so the engine refuses it and names the field, in its own words. It does not fall back to the default quietly. A null with a note is how the engine reports a metric it cannot compute on a valid call, such as AP on Q24.")

q(2, "A ranking lists EKD-018 first and again third. What does retrievalMetrics do with it?",
 "Refuses it: \"ranking[2] repeats EKD-018 (ranking[0]): a document is ranked once\"",
 ["Counts EKD-018 at both ranks, so the list's precision at 5 gains two hits from one passage",
  "Keeps the first appearance, drops the repeat and says nothing about it",
  "Scores the list and adds EKD-018 to its unjudgedRetrieved count"],
 "Precision at a rank counts each passage once, and a repeated id would be counted twice, so the engine refuses the list and names the position of the repeat and where the id first appeared. It never drops the repeat silently. unjudgedRetrieved counts passages nobody judged, which has nothing to do with a repeat.")

q(0, "In one call system A's runs have no entry for Q01; in another, Q01 is present as an empty array. How does evaluateRetrieval treat the two?",
 "The missing entry is refused; the empty array is a ranking that retrieved nothing and scores AP 0",
 ["Both are refused, since every judged query needs at least one ranked passage",
  "Each is excluded from the means and listed with the no-relevant reason",
  "Both score 0 on every metric, since the engine reads the two the same way"],
 "The engine's own words for the missing entry: \"runs has no ranking for query Q01 (every judged query needs one; an empty array is a ranking that retrieved nothing)\". An empty array is scored, and with no relevant passage retrieved its AP is 0. The no-relevant rule is about a query with nothing judged at grade 1 or more, and Q01 has 8 relevant judged passages.")

q(3, "Which judged grades does retrievalMetrics accept?",
 "Whole numbers from 0 to 10; a grade of 2.5 or 11 is refused by name",
 ["Whole numbers 0 to 3 only, the four grades of the Ekene judging scale",
  "Any number from 0 to 10, a fractional grade included, since the gain is linear",
  "Whole numbers from 1 to 10, because a passage at grade 0 is left unjudged"],
 "MAX_GRADE is 10 and a grade must be whole: 2.5 and 11 each draw \"judgments.EKD-018 must be a whole-number grade from 0 to 10\". The Ekene scale runs 0 to 3, a property of the fixture and no limit of the engine. Grade 0 is a judgment, read and found not relevant; an unjudged passage is scored as 0 too, but nobody read it.")

q(1, "On Q14, \"Is Ekene-5 producing water?\", system A's AP at 5 is 0.000000 and B's is 0.216667 (grade 1 or more). What accounts for A's zero?",
 "BM25 retrieved none of the 3 relevant passages in its top 5, the planted lexical trap",
 ["Q24's rule applies to it, so the query is excluded from the mean and printed as 0",
  "System A gave an empty short answer to Q14, and average precision scores that answer",
  "BM25 placed all 3 relevant passages inside its top 5, each below a grade 0 passage"],
 "The passages that answer Q14 say \"no water\" and \"water free\", and the query says \"producing water\", so BM25's word matching finds none of the 3 relevant passages at k 5: hit 0 and AP 0.000000. Q14 has relevant passages, so it is included in the mean. AP scores the ranking alone; the empty short answer is scored by exact match and token F1. Any relevant passage in the top 5 would have added a precision above 0.")

emit(Q, '/root/dai-wip-appliedai/banks/d5i_m01.json', expect_n=15)
finish()
