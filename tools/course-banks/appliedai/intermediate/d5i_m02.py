import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D5 Professional m02, Graded Relevance and nDCG.
# Every figure is quoted from digest.txt. Teaching settings unless a question
# states otherwise: k 5, linear gain, relevant at grade 1 or more. No capstone
# name, id, query, answer or value appears.

q(1, "Discount each grade of the hand-worked list by log2(rank + 1) and add them up. Which DCG at 5, linear gain, results?",
 "3.140995, the sum of 1.892789, 0.861353 and 0.386853",
 ["5.692536, the DCG of the judged grades sorted 3, 2, 2, 1, 0",
  "6.095391, the same five ranks scored with the gain 2^g - 1",
  "0.551774, the list's DCG after division by its best possible"],
 "DCG sums gain over log2(rank + 1). With linear gain, a adds 3 / 1.584963 = 1.892789, b adds 0.861353 and d 0.386853, and c and the unjudged x add 0, so DCG at 5 is 3.140995. 5.692536 is the ideal DCG, 6.095391 the DCG under exponential gain, and 0.551774 the nDCG, each a different quantity.")

q(3, "Passage a, grade 3, sits at rank 2 of the stated list and adds 1.892789 to linear DCG. What would it add from rank 1?",
 "Its full gain of 3, since the discount log2(1 + 1) is 1",
 ["1.892789 again, since DCG reads a passage's grade and ignores where it sits",
  "4.416508, the value exponential gain gives a grade 3 passage at rank 2",
  "Less than it adds now, because rank 1 carries the heaviest discount"],
 "The discount at rank r is log2(r + 1): 1.000000 at rank 1 and 1.584963 at rank 2. A grade 3 passage keeps its whole gain of 3 at rank 1. DCG reads position, which is what separates it from precision at 5. 4.416508 is a's exponential contribution at rank 2, gain 7 over the same discount. The discount grows down the list, so rank 1 is the lightest.")

q(0, "The ideal DCG for the stated query sorts the judged grades 3, 2, 2, 1, 0. Why is the second 2 there when no list retrieved e?",
 "The ideal uses every judged grade, so a missed good passage costs nDCG",
 ["It is the grade of x, copied across from the nearest judged passage in the list",
  "The engine fills the ideal up to k with the highest grade the list already holds",
  "Any corpus passage not judged 0 enters the ideal at grade 2 by default"],
 "The basis says the ideal ranks every judged grade descending. e is judged grade 2, so it enters the ideal whether or not a list retrieved it, and the ideal DCG is 5.692536. Building the ideal from the retrieved grades alone would reward a system for missing a good passage. x is unjudged and counts as 0; nothing is copied or filled in, and an unjudged corpus passage carries no gain.")

q(2, "With exponential gain on the stated ranking, the engine returns DCG 6.095391 and ideal DCG 10.823466. What is nDCG at 5?",
 "0.563164",
 ["0.551774, the figure the same list gives under linear gain",
  "0.400000, the average precision of the list at grade 1",
  "5.692536, the ideal DCG of the list under linear gain"],
 "nDCG is DCG over the ideal DCG at the same gain: 6.095391 / 10.823466 gives 0.563164. 0.551774 is the linear-gain nDCG of the same list. 0.400000 is its average precision, a binary score at a threshold. 5.692536 is a linear ideal DCG, which is no ratio at all.")

q(3, "Exponential gain 2^g - 1 values grades 0, 1, 2 and 3 at 0, 1, 3 and 7. What does it change about nDCG against linear gain?",
 "A grade 3 passage now outweighs two grade 2 passages, so putting the answering passage first matters most",
 ["Nothing about how credit is ordered, since both gains are the grade rescaled by the ideal",
  "Grades 0 and 1 part company, so a related passage stops counting at all",
  "The ideal DCG is built from the retrieved list alone under this gain"],
 "Under exponential gain a grade 3 passage is worth 7 against a grade 2's 3, so answering is worth much more than being relevant and the first rank of the answering passage dominates. Grades 0 and 1 carry the same gain on both scales, 0 and 1. The ideal is built the same way under both gains, from every judged grade, which keeps the ratio between 0 and 1.")

q(0, "System A's Q04 scores nDCG at 5 of 0.935166 with linear gain and 0.863604 with exponential gain; its Q02 goes from 0.261097 to 0.336900. What do the two rows show?",
 "One query's nDCG can fall and another's rise when the gain changes, and a mean hides both",
 ["Exponential gain lifts every query's nDCG, so the Q04 figure has to be a rounding slip",
  "Linear gain ignores grade 3 passages, which is why Q04 loses and Q02 gains",
  "The gain decides which passages are retrieved, so each query sees a new list"],
 "The gain changes only what each grade is worth; the lists and the judgments stay as they were. Per query the two gains can move in opposite directions, as Q04 and Q02 do, and the mean over queries shows neither movement. Linear gain counts a grade 3 passage as 3, and retrieval never reads the gain.")

q(1, "Mean nDCG at 5 over the 23 included queries is A 0.762753 and B 0.764137 with linear gain, and A 0.786456 and B 0.786615 with exponential gain. Which reading is right?",
 "B has the higher mean under both gains, by 1.38e-3 linear and 1.59e-4 exponential",
 ["A has the higher mean under exponential gain, where its grade 3 passages count 7",
  "The two systems tie under exponential gain, since their means agree to three decimals",
  "B leads under linear gain alone, and exponential gain reverses the order"],
 "0.786615 is above 0.786456, so B is ahead under exponential gain as well as linear. Agreeing to three decimals is no tie: two figures are equal only when the engine returns them equal. Whether differences this small mean anything is the question the paired bootstrap answers later in this tier.")

q(2, "System A's mean nDCG at 5 is 0.762753 at relevantGrade 1 and 0.762753 at relevantGrade 2, while its MAP moves from 0.600278 to 0.750362. Why does nDCG stay put?",
 "The gain uses every grade, so the relevance threshold does not apply to nDCG",
 ["At grade 2 the engine recomputes the ideal DCG, and the change happens to cancel out",
  "nDCG is computed once, at the default threshold, and reused at any other threshold",
  "Both thresholds keep the same 23 queries, and that alone fixes every mean"],
 "The basis says the gain uses every grade: a grade 1 passage keeps its gain at relevantGrade 2, and the ideal is the same, so nDCG cannot move. MAP turns grades into relevant or not at the threshold, which is why it changes. The 23 queries are the same in both readings for MAP too, so the query count explains nothing.")

q(0, "A stated query has judged passages graded 1, 1 and 0, and the list ranks EKD-013 then EKD-014. At relevantGrade 2, what does retrievalMetrics return?",
 "Recall and average precision as null with the reason, and nDCG 1.000000",
 ["A refusal, because no judged passage reaches the relevance threshold of 2",
  "nDCG as null too, with a note that the ideal DCG is 0 at this threshold",
  "Recall, average precision and nDCG all 0.000000, since nothing counts as relevant"],
 "At grade 2 nothing is relevant, so recall and AP have no divisor and come back as null with \"recall is undefined: no judged document has grade 2 or more\". The call succeeds. nDCG ignores the threshold: grade 1 still carries gain, the ideal DCG is above 0, and this list scores 1.000000.")

q(3, "retrievalMetrics scores system A's Q24 list with the judgments for Q24 removed entirely. Which note does nDCG carry?",
 "\"nDCG is undefined: the query has no judged documents, so the ideal DCG is 0\"",
 ["\"nDCG is undefined: the 8 judged documents all have grade 0, so the ideal DCG is 0\"",
  "\"nDCG is undefined: the 1 judged document has grade 0, so the ideal DCG is 0\"",
  "\"recall is undefined: no judged document has grade 1 or more\", and nDCG is 0"],
 "The ideal DCG is 0 in exactly two cases, and the note names which one it met. With no judgments at all it is the first case, no judged documents. The 8-document wording belongs to Q24 as judged, and the 1-document wording to a single judgment at grade 0. The recall note is a separate note on a separate metric, and nDCG is returned as null, never 0.")

q(1, "At k 5, system A retrieves 0 unjudged passages and system B 0. Why?",
 "The judged set pooled both systems' top 5, so every passage either system ranks there was judged",
 ["The engine drops an unjudged passage from a ranking before it scores the list",
  "An unjudged passage scores 0 and so can never enter a BM25 or TF-IDF top 5",
  "Both systems were tuned on the judgments until no unjudged passage appeared"],
 "The fixture states the pool: every passage in the top 5 of either system at default settings was judged, plus passages the assessor added. So both systems' top 5 lists are fully judged and the unjudged rule never fires for them. The engine keeps an unjudged passage in the list and scores it as grade 0. A BM25 score or cosine owes nothing to the judgments, and no system here was tuned.")

q(2, "A new retriever from outside the pool puts passages nobody judged into its top 5. What should a report do before comparing its nDCG with systems A and B?",
 "Quote its unjudgedRetrieved beside each score and have those passages judged first",
 ["Nothing, since an unjudged passage scores grade 0 exactly as a judged grade 0 does",
  "Drop every query on which it retrieved an unjudged passage from every mean",
  "Raise relevantGrade to 2, which takes the unjudged passages out of the score"],
 "An unjudged passage is scored as grade 0 by default, and some may answer the query, so a run that reaches outside the pool is marked down for finding passages nobody read. The count unjudgedRetrieved shows how often that happened, and judging those passages removes the doubt. Dropping queries changes the question, and nDCG ignores relevantGrade, so raising it changes nothing here.")

q(3, "A call passes the gain 'graded'. What does the engine say?",
 "\"gain must be 'linear' or 'exponential'\"",
 ["It falls back to linear gain and records the swap in its basis block",
  "It treats an unknown gain as exponential, the steeper of the two scales",
  "\"relevantGrade must be a whole number from 1 to 10\", as the gain reads grades"],
 "The engine offers exactly two gains and refuses any other in its own words, naming the field gain. It does not substitute a default. The relevantGrade message belongs to a threshold of 0 or above 10, a different input.")

q(0, "evaluateRetrieval receives a ranking for Q99, a query with no judgments at all. What happens?",
 "A refusal: \"runs.Q99 has no judgments: every ranked query needs judgments\"",
 ["Every passage in Q99's list counts as unjudged at grade 0, and the query is scored",
  "Q99 is excluded from the means and listed with the no-relevant reason",
  "nDCG comes back null with the note that the query has no judged documents"],
 "An unjudged passage defaults to grade 0, but a whole ranked query with no judgments is refused by evaluateRetrieval, which names the field runs.Q99. The no-relevant rule covers a judged query with nothing at grade 1 or more. The null note about no judged documents is what retrievalMetrics returns when one list is scored against an empty set of judgments.")

q(1, "Both systems score nDCG at 5 of 1.000000 on Q09, \"dropped object near miss on the drill floor\". What does that figure say?",
 "Each top 5 matched the ideal order of the query's judged grades at that cutoff",
 ["Each system's short answer to Q09 matched its reference exactly",
  "Every passage in each top 5 was judged grade 3, the answering grade",
  "Both systems retrieved every passage in the corpus that mentions a wrench"],
 "nDCG divides DCG by the ideal DCG. Q09 has one passage above grade 0, graded 3, and both lists put it first, which is the ideal order. The score reads the ranking alone, so it says nothing about the short answer. Q09 has only one grade 3 passage, and nDCG knows nothing of passages nobody judged.")

emit(Q, '/root/dai-wip-appliedai/banks/d5i_m02.json', expect_n=15)
finish()
