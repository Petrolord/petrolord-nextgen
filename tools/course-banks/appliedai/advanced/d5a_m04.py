import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D5 Expert m04, Judged Sets and Leakage. Figures from the course's judged-set
# section (the pooling rule, the runs outside the pool, the second annotator as
# a check, test questions in a prompt) and the Ekene document set's queries,
# systems and planted defects.

K = [0, 2, 1, 3, 3, 1, 0, 2, 2, 0, 3, 1, 1, 3, 0]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("How was the Ekene judged set built, and what grade does a passage outside it carry?",
 "Every passage in the top 5 of either system was judged, plus the assessor's additions; an unjudged passage counts as grade 0",
 ["Every one of the 60 passages was judged against every query, so no passage is ever unjudged in any ranked list",
  "Passages were drawn at random for judging with the bootstrap seed; an unjudged passage is left out of every metric",
  "The top 10 of BM25 alone was judged, since system A retrieves by BM25; an unjudged passage is scored as grade 1"],
 "The fixture states the pooling rule: the top 5 of both systems at default settings, plus passages the assessor added, and unjudged passages count as grade 0. That is a pool, 183 judged pairs, far fewer than every passage against every query. No random draw chose the pairs, the engine does not drop unjudged passages, and grade 0 credits nothing, where grade 1 would count them as relevant.")

# 2
x("At k 5, how many unjudged passages do systems A and B retrieve on the Ekene queries, and why?",
 "0 each: the pool was built from both systems' own top 5 lists",
 ["80 for A and 16 for B, as each system fills its lists from outside the pool",
  "0 each: the engine refuses to rank a passage that nobody has judged",
  "16 each: the assessor's additions sit outside the lists of both systems"],
 "The judged set was pooled from the two systems' top 5, so every passage either shows at k 5 carries a grade and unjudgedRetrieved is 0 for both. The engine ranks any passage with a score above 0, judged or not; it simply counts the unjudged ones. 80 and 16 are the unjudged counts of two runs the pool did not come from, BM25 at k 10 and BM25 with b 0.4 and the stop list on.")

# 3
x("BM25 at k 10 brings 80 unjudged passages into its lists, on 22 of the 24 queries, and its mean precision falls to 0.291304. What can be said of that fall?",
 "Part may be real and part an artefact: each unjudged passage scores as grade 0 although some may answer their query",
 ["It is all real, since grade 0 means an assessor read each of those passages and judged it not relevant to the query",
  "It is all an artefact, so the right precision at 10 is the precision at 5 of the same run, which is 0.443478",
  "None, since a cutoff of 10 lies outside the judged set and every metric is returned as null with the reason"],
 "Precision at 10 divides by 10, and 80 of the new places hold passages nobody judged, each scored as grade 0. Some may answer the query and count as misses only because nobody looked, so the fall mixes real and artefact and cannot be split from the table. An unjudged grade 0 is no assessor's verdict, the precision at 5 answers a different cutoff, and the engine returns every metric at k 10.")

# 4
x("A new run, BM25 with b 0.4 and the stop list on at k 5, retrieves 16 unjudged passages on 11 queries and scores MAP 0.656854 against system A's 0.600278. What does the course conclude?",
 "On the judged passages it ranks the relevant ones higher; its standing once the 16 are judged is open",
 ["It is the better retriever, since it wins on MAP although its 16 unjudged passages all count against it",
  "Its figures are void, as the engine returns a null MAP for any run with an unjudged passage in its list",
  "It ties with system A, since its mean precision at 5 is the same 0.443478 and precision is the key figure"],
 "The table can say that, on the passages the pool judged, the new run places the relevant ones higher on average; it cannot say how the run would score if its 16 unjudged passages were judged. Judging them can raise or lower its figures, and the other systems' too, so no verdict is final. The engine scores the run and counts the unjudged passages, and equal precision at 5 settles nothing about the order.")

# 5
x("Which way does pooling bias tilt a comparison between a new system and the systems the pool was built from?",
 "Toward the pooled systems: they never meet an unjudged passage at the pooled cutoff, and a new system is marked down for good passages the pool never saw",
 ["Toward the new system, because its unjudged passages are left out of its denominators and so raise its precision",
  "Neither way on average, because an unjudged passage is as likely to be relevant as irrelevant, so it cancels out",
  "Toward whichever system retrieves the shorter lists, since unjudged passages only appear at the foot of long lists"],
 "Every unjudged passage counts as grade 0. A pooled system shows only judged passages at its pooled cutoff, so it is never penalised for one, while a new system that finds good unseen passages is charged for each. That is pooling bias, and it favours the systems the pool came from. Unjudged passages stay in every denominator, nothing makes them cancel, and list length is not the mechanism.")

# 6
x("What does the course ask of any report that scores a system the pool was not built from?",
 "Report unjudgedRetrieved beside every score, and judge the unjudged passages before comparing it with the pooled ones",
 ["Drop every query on which the new system retrieved an unjudged passage, then compare the systems on the queries left over",
  "Score the new system at grade 2 or more, where unjudged passages matter less, and compare them at that threshold",
  "Rescore the pooled systems at k 10 so that they meet unjudged passages too, then compare all four runs just as they stand"],
 "The count of unjudged retrieved passages tells a reader how much of a score rests on assumed zeros, and judging those passages removes the assumption. Dropping queries changes the question and hides the problem. A higher threshold still scores every unjudged passage as grade 0. Pushing the pooled systems outside the pool adds unjudged passages to every run without judging any of them.")

# 7
x("Scored at k 5 and grade 1 against the second annotator's grades instead of the primary ones, which system has the higher mean nDCG?",
 "System A, 0.718064 against B's 0.701037, where on the primary grades B leads, 0.764137 against 0.762753",
 ["System B on both keys: 0.764137 on the primary grades, 0.701037 on the second annotator's, so the order holds",
  "Neither: on the second annotator's grades every query is excluded, so both means are returned as null",
  "System A on both keys: 0.762753 on the primary grades and 0.718064 on the second, so A leads throughout"],
 "Under the second annotator A's mean nDCG is 0.718064 and B's 0.701037; under the primary grades B's 0.764137 is above A's 0.762753. The order flips when the key changes and nothing else does. Under the second annotator no query is excluded, so 24 queries enter the means. Each distractor misreads one of the four figures.")

# 8
x("Why do 24 queries enter the means under the second annotator's grades, where the primary grades give 23?",
 "Under the second annotator no query is excluded: some Q24 passage reaches grade 1 or more",
 ["Q24 is zeroed under a second key in place of being excluded, as the zero rule asks",
  "The second annotator judged one extra query, Q25, which the primary grades never covered",
  "The means are over all queries whatever the key, and 23 was a count of the queries answered"],
 "The no-relevant rule excludes a query with no judged passage at grade 1 or more. On the primary grades that is Q24; under the second annotator no query is excluded, so Q24 has a passage at grade 1 or more there and enters the means. The default rule is exclude, whatever the key; there are 24 queries, Q01 to Q24; and 23 is the number of included queries.")

# 9
x("On nDCG, system A and system B differ by less than two hundredths under either key, while switching keys moves each system by more than four hundredths. What rule does the course draw?",
 "A difference between two systems smaller than the difference between two annotators is no finding",
 ["The second annotator is wrong, since the primary grades came first and the key is fixed at the start",
  "The larger of the two means decides the verdict, whichever key it was computed on at the time",
  "Average the two keys' figures and report the system with the higher mean nDCG as the winner"],
 "When the key itself moves each system further than the systems differ, the comparison is inside the noise of judging, and the course says so in those words. Neither annotator is privileged: the second set was drawn as a check. Picking the larger mean or averaging keys hides the flip. The paired bootstrap, seed 7, 2000 replicates, level 0.95, reaches the same verdict: its interval for the difference runs from -0.068015 to 0.058726.")

# 10
x("Each of the 24 reference answers is scored as a short answer against itself. What does the engine return, and what follows for a test set?",
 "24 exact matches of 24, so a leaked key scores perfectly and has to be prevented by process",
 ["23 of 24, since Q24's empty reference cannot match itself, which reveals a leak on that query",
  "An error, since the engine refuses a prediction that is textually identical to its truth string",
  "24 of 24, and the groundedness check then flags every one of them as an unsupported claim"],
 "Each reference normalises to itself, so all 24 match, including Q24, whose empty answer against an empty reference scores exact 1. That is the score a system earns if the key reached it, whatever it can do, and no score can tell a leaked key from skill. So the queries and references are kept out of every prompt, example and fine-tuning set. The engine accepts identical strings, and groundedness checks cited passages, which a reference alone does not have.")

# 11
x("System A scores 20 exact matches of 24 and system B 13. A third system whose instructions contained the reference answers would score what, and what would the score say about it?",
 "24 of 24, and nothing in the score would mark the difference between a leaked key and skill",
 ["24 of 24, and the engine would flag it, since a perfect score is refused as a sign of leakage",
  "About 20, like A, because the leak only helps on the queries that A already answers correctly",
  "A null score with the reason, since exact match is undefined once the key is in the prompt"],
 "A system that returns the key compares perfectly against it, so it scores 24 of 24 and beats both fixed systems. The score only compares an answer with a reference, so it cannot detect how the answer was obtained, and the engine has no leak check and refuses nothing for a perfect score. The leak helps on every query, and exact match is defined for any pair of strings.")

# 12
x("A document restating a reference answer word for word is added to the corpus, and a system retrieves it, cites it and copies the figure. How do the groundedness and exact-match checks treat that answer?",
 "Both pass it: the figure is in a cited, retrieved passage, and it matches the reference",
 ["Groundedness flags it, since a claim copied from a passage is marked unsupported by the check",
  "Exact match fails it, since a reference that appears in the corpus is removed before scoring",
  "Both refuse it, since a passage that restates a reference is not accepted in a corpus at all"],
 "Groundedness asks only whether the claim appears in a passage the answer cites and retrieved, which it does; grounded is a statement about the passage and says nothing of how the figure came to be there. Exact match compares normalised strings, and they are equal. The engine removes nothing and refuses no passage for its content, which is why a leak through the corpus has to be stopped by process.")

# 13
x("Q10 \"diesel spill during bunkering\" has only 3 judged passages. Why so few, when the pool takes the top 5 of each system?",
 "Only 2 passages contain a query word, so neither system ranks more than 2; the third came from the assessor",
 ["The pool took the top 5 of each system, and both lists overlap exactly, leaving 3 distinct passages to judge",
  "Two of the five pooled passages were duplicates, EKD-046 and EKD-058, and were judged only once between them",
  "The assessor removed the passages that scored 0, which left 3 of the 10 pooled passages judged"],
 "Only a score above 0 is ranked, and only 2 passages contain a word of the query, so each system's list holds 2 passages although k is 5. The pool therefore adds just those 2, and the third judged passage came from the assessor's additions. EKD-046 and EKD-058 are those 2 passages, each judged in its own right, and nobody removes a judged passage.")

# 14
x("Under the primary grades, Q24 \"subsea tree replacement on Ekene-5\" has 8 judged passages. What does the engine say when it computes nDCG for system A on Q24?",
 "nDCG is returned as null with the note \"nDCG is undefined: the 8 judged documents all have grade 0, so the ideal DCG is 0\"",
 ["A refusal naming `judgments`, because a judged query must hold at least one passage at grade 1 or more to be scored",
  "nDCG 0.000000, since system A retrieves no relevant passage for Q24 and so its DCG and nDCG are both 0",
  "nDCG is returned as null with the note \"nDCG is undefined: the query has no judged documents, so the ideal DCG is 0\""],
 "Q24's 8 judged passages all carry grade 0, so the ideal DCG is 0 and nDCG is returned as null with the note that names this case, quoted. The other wording is for a query with no judged documents at all, which Q24 is not. A query nothing answers is a result with a note and no refusal, and 0 over 0 is undefined, never 0.")

# 15
x("How many planted defects does the Ekene fixture record list, and what happens to the build if the engine fails to find one?",
 "22 items; the build fails if any one of them is not found",
 ["22 items; any defect not found is dropped from the list",
  "11 items, one per unsupported claim of system B's answers",
  "24 items, one per query; a missed one is logged and passed"],
 "The fixture tables 22 planted items, each with the engine behaviour that finds it, and the course states that the build fails if any is not found. Nothing is dropped quietly. 11 is the count of system B's unsupported claims, one kind of planted evidence among several, and the defects are not one per query.")

emit(Q, '/root/dai-wip-appliedai/banks/d5a_m04.json', expect_n=15)
finish()
