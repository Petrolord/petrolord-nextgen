import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D5 Professional exam, the final exam.
# Every figure is quoted from digest.txt. Teaching settings unless a question
# states otherwise: k 5, relevant at grade 1 or more, linear gain, the
# no-relevant rule exclude, numericRelTol 0, the bootstrap at seed 7, 2000
# replicates, level 0.95. The exam asks each module's question from another
# angle, with figures the module banks do not key. No capstone name, id,
# query, answer or value appears.

# Average precision and MAP

q(3, "System A's list for Q15, \"decline curve parameters for Ekene-1\", has 3 relevant judged passages, 2 of them in its top 5, the first at rank 2, and an AP at 5 of 0.388889 (grade 1 or more). Where does the second relevant passage sit?",
 "At rank 3, so the sum is 0.500000 plus two in three",
 ["Rank 4, giving 0.500000 plus 0.500000 over the 3 relevant passages",
  "The last place, rank 5, adding two in five to the sum",
  "Just ahead of the first reported hit, at rank 1"],
 "Precision at rank 2 is 0.500000 and at rank 3 two in three, 0.666667; their sum over 3 relevant judged passages is 0.388889. A second hit at rank 4 would give (0.500000 + 0.500000) / 3 and at rank 5 (0.500000 + 0.400000) / 3, both below the printed AP. Rank 1 cannot hold a relevant passage when the first relevant rank is 2.")

q(1, "MAP at 5 for system B is 0.593007. What exactly does the engine average to get it?",
 "The per-query AP of the 23 included queries, each counted once",
 ["Every precision read at a relevant rank, pooled across all 24 queries",
  "Each query's AP weighted by its relevant passages",
  "The AP of one long ranking built by merging B's 24 lists together"],
 "The basis states an arithmetic mean over the included queries: map is the mean average precision. Q24 has no passage at grade 1 or more and is excluded under the default rule, leaving 23, each with equal weight. Pooling precisions or weighting by relevant counts would give other figures, and no merged ranking is ever built.")

q(0, "Under the zero rule, system B's MRR at 5 falls from 0.923913 to 0.885417. Where does the fall come from?",
 "Q24 joins the mean at 0, so the 23 queries' sum is spread over 24",
 ["B's Q24 list holds a relevant passage further down, which now counts against it",
  "The zero rule also scores any query with a late first hit as a 0",
  "Every reciprocal rank is recomputed at a stricter relevance threshold"],
 "Under zero, a query with nothing relevant stays in every mean and scores 0 on what it cannot give, so the sum over 23 queries is divided by 24: 0.923913 x 23 / 24 = 0.885417. Q24 has no relevant passage for any list to hold. The rule touches only the no-relevant query, and the threshold stays at grade 1.")

q(2, "At relevantGrade 2, system A's MRR at 5 falls from 0.880435 to 0.840580. How can a stricter threshold lower it?",
 "Where a grade 1 passage was the first hit, the first relevant rank moves down or is lost",
 ["The stricter threshold excludes some queries from the mean, and a mean over fewer queries falls",
  "MRR divides by the relevant judged count, a count that grows at grade 2",
  "Reciprocal rank weights each hit by its grade, and grade 1 weighs less"],
 "Reciprocal rank is one over the rank of the first relevant passage. At grade 2 a passage graded 1 stops counting, so a list whose first hit was grade 1 now finds its first relevant passage lower, or not at all in the top 5. The queries in the means stay 23, the relevant judged count shrinks at a stricter threshold, and reciprocal rank reads no grade beyond the threshold.")

q(2, "BM25 ranks only 2 passages for Q10, \"diesel spill during bunkering\", both relevant, yet system A's precision at 5 is 0.400000. Why?",
 "Precision at 5 divides by 5 even when fewer passages are ranked",
 ["One of the two is a duplicate passage, which the engine counts only once",
  "Precision is split between the tied EKD-046 and EKD-058",
  "The three empty ranks are filled with unjudged passages at grade 0"],
 "Only 2 passages contain a query word, so the list is shorter than k, and the basis reads \"relevant in the top 5 / 5 (5 even when fewer are ranked)\": 2 / 5. EKD-058 is a copy of EKD-046 and both are ranked and counted. Ties are broken by id and nothing is shared. No passage is added to fill the list.")

q(0, "A list of 10 passages holds a relevant passage at rank 7. At k 5, what does that passage do to average precision?",
 "Adds nothing to the sum, while it still counts in the divisor",
 ["Adds its precision at rank 7 to the sum, since AP reads every relevant rank",
  "Leaves both the sum and the divisor alone, as it sits beyond the cutoff",
  "Makes the engine raise k to 7 so that the passage can be read"],
 "The sum runs over relevant ranks \"up to 5\", so rank 7 adds no precision. The divisor is every relevant judged passage, which includes it, so the passage lowers AP by being missed at the cutoff. The cutoff is the stated k, and the engine never moves it.")

q(3, "An evaluateRetrieval call sets noRelevant to 'drop'. What comes back?",
 "\"noRelevant must be 'exclude' or 'zero'\"",
 ["Q24 removed with no listing at all, just as 'drop' asks",
  "The default exclude rule, with a note that 'drop' was read that way",
  "The zero rule, the offered rule nearest in meaning to 'drop'"],
 "The engine offers two rules for a query with nothing at grade 1 or more and refuses any other word in its own words, naming the field. It never guesses a meaning or substitutes the default. Under exclude, the default, Q24 is listed in excluded with its reason; nothing is removed silently.")

q(1, "evaluateRetrieval is run on Q24 alone, with its judgments and a ranking. What do the means come back as?",
 "Every mean returned as null, the note saying no query is left to average",
 ["0.000000 each, the only value a query that nothing answers can take",
  "A refusal, because the judgments for Q24 hold nothing at grade 1 or more, so there is nothing to score",
  "Q24's own per-query figures, since one query is its own mean"],
 "Under the default rule Q24 is excluded, which leaves no query to average, so the engine returns each mean as null with the note \"no query has a judged document at grade 1 or more, so every mean is null\". The call succeeds: a judged query with no relevant passage is a result and draws no refusal. Zeros would need the zero rule, and an excluded query contributes nothing to a mean.")

# Graded relevance and nDCG

q(1, "Under exponential gain, what does passage a (grade 3, rank 2 of the hand-worked list) add to DCG at 5?",
 "4.416508, a gain of 7 over the discount 1.584963",
 ["1.892789, its grade of 3 over the same discount",
  "7, since exponential gain is never discounted by rank",
  "1.292030, the amount passage b adds from rank 4"],
 "Exponential gain is 2^g - 1, so grade 3 is worth 7, and every gain is divided by log2(rank + 1), 1.584963 at rank 2: 4.416508. 1.892789 is the linear contribution. The discount applies under both gains. 1.292030 is b's exponential contribution, gain 3 over 2.321928.")

q(2, "Which order of passages from the hand-worked query reaches the ideal DCG at 5 of 5.692536 under linear gain?",
 "a, b, e, d, c: the grades 3, 2, 2, 1, 0",
 ["c, a, x, b, d, the list exactly as it was retrieved",
  "a, b, d, c, x, the retrieved passages sorted by grade",
  "e, a, b, d, c, led by the passage that no list retrieved"],
 "The ideal ranks every judged grade descending, retrieved or not, so e's grade 2 sits beside b's and the order is 3, 2, 2, 1, 0 (b and e may swap). The list as retrieved scores 3.140995. Sorting the retrieved passages alone leaves out e and ends 1, 0, 0, a lower sum. Putting e first places a grade 2 ahead of the grade 3.")

q(0, "On Q18, \"voidage replacement ratio target for the flood\", system A's nDCG at 5 is 0.894999 linear and 0.946768 exponential; system B's is 0.817494 and 0.789596. What does switching the gain do on this query?",
 "Raises A's nDCG and lowers B's, so the gap between them widens",
 ["Raises both, since exponential gain always favours the higher grades",
  "Lowers both, the exponential ideal being larger than the linear one",
  "Reverses the order of the two systems on this one query"],
 "A moves up from 0.894999 to 0.946768 and B down from 0.817494 to 0.789596, so A stays ahead by more. Exponential gain can move a query either way, depending on where each list puts its higher grades, and the ideal is rescaled under the same gain, so no direction is fixed. A leads under both gains.")

q(3, "Q24's eight judgments are all grade 0. Scored one list at a time, what does nDCG come back as for system A?",
 "A null whose note names 8 judged documents all at grade 0",
 ["0.000000, since the list holds no gain",
  "A null whose note says the query has no judged documents at all",
  "A refusal naming judgments, since no grade on Q24 reaches 1"],
 "Every judged grade is 0, so the ideal DCG is 0 and the ratio cannot be taken. The engine returns null and states the case: \"nDCG is undefined: the 8 judged documents all have grade 0, so the ideal DCG is 0\". The other wording is kept for a query with no judgments. A 0 would be a false figure, and nothing here is refused.")

q(1, "What is unjudgedRetrieved for the hand-worked list c, a, x, b, d, and what do precision and nDCG make of x?",
 "1; both score x as grade 0, exactly as they score c",
 ["0, since x is dropped from the list before anything is counted",
  "1, and nDCG rises, since an unjudged passage carries no discount",
  "2, counting x and the unretrieved e as the list's two unjudged passages"],
 "x is the one unjudged passage in the list, so the count is 1. It stays in the list and scores as grade 0, the same as the judged c, so precision at 5 is 0.600000 and nDCG 0.551774 either way; only the count shows the difference. e is judged, and it is not in the list at all.")

q(3, "Why does the engine divide DCG by an ideal DCG before averaging over queries?",
 "DCG has no upper limit of its own, so raw values do not compare across queries",
 ["To take out the rank discount, which only the ideal ranking carries in the engine",
  "Because the gain moves with the relevance threshold and the ideal undoes that move",
  "So that unjudged passages add a gain of 1 in place of 0"],
 "A query with many grade 3 passages can reach a far higher DCG than a query with one, however well both are ranked, so each DCG is scaled by the best the query allows and nDCG runs from 0 to 1. The ideal is discounted too. The gain ignores the threshold. Unjudged passages keep a gain of 0.")

q(0, "Linear gain and exponential gain 2^g - 1 agree on some grades. Which?",
 "Grades 0 and 1, worth 0 and 1 on both scales",
 ["Grade 3 alone, which is worth 3 on both scales",
  "Grades 2 and 3, the only grades that carry any gain",
  "None of them, since exponential gain doubles every grade"],
 "2^0 - 1 is 0 and 2^1 - 1 is 1, so the scales part only on grades 2 and 3, worth 3 and 7 under exponential gain. Grade 1 carries gain under both. Nothing is simply doubled: grade 3 goes from 3 to 7.")

# Short answers

q(2, "System B answers Q10 with \"about 5 bbl\"; the reference is \"0.5 bbl\". Token F1 is 0.400000. Why is 5 no shared token?",
 "Normalisation turns \"0.5\" into \"05\", a different word from \"5\"",
 ["The engine reads 5 and 0.5 as numbers and finds them ten times apart",
  "\"about\" counts as an article here",
  "Token F1 skips numbers entirely and scores the unit bbl on its own"],
 "Dropping the point joins the digits, so the reference is \"05 bbl\" and the answer \"about 5 bbl\". Only bbl is common: precision 1 in 3, recall 1 in 2, F1 0.400000. F1 compares tokens as strings and never parses a number, which is also why the numbers count as words. Only a, an and the are articles.")

q(1, "System B answers Q09 with \"a wrench\"; the reference is \"a 2 kg wrench\". What does answerMatch return?",
 "No exact match, and F1 0.500000 from precision 1 and recall one third",
 ["Exact 1, since both name a wrench once the articles have been removed",
  "F1 0.666667, from 2 common tokens that include the article a on each side",
  "F1 0.333333, the share of the reference words the answer holds"],
 "The article goes on both sides, leaving \"wrench\" against \"2 kg wrench\": the strings differ, so exact is 0, and precision is 1 with recall 1 in 3, which gives F1 0.500000. The article is removed before any token is counted. One in three is the recall alone, and F1 combines it with the precision.")

q(0, "System B answers Q11 with \"12.6 ppg\" against the reference \"12.4 ppg\". What does it earn?",
 "Exact 0 and F1 0.500000, all of it for the unit ppg",
 ["Exact 1, the two mud weights lying within a tolerance",
  "F1 0.000000, since the figure is wrong and F1 scores figures",
  "F1 0.750000, with the digits 12 matching before the point"],
 "Normalised, the point goes and each figure becomes a single three-digit token, and the two differ: one token of two in common on each side, so F1 is 0.500000 and exact match 0. Short-answer scoring has no tolerance. A wrong figure still shares its unit, which is the partial credit. Because the point is dropped, no token holds the digits 12 alone.")

q(3, "System A answers Q18 with \"0.85 rising by 0.04 a month to 1.05\" against \"0.85 rising to 1.05\". F1 is 0.727273. What lowers it?",
 "Extra words: every reference token is found, and three answer tokens are not in it",
 ["A missing word, since the reference holds a token the answer leaves out",
  "The decimal points, which split 0.85 and 1.05 into two separate tokens apiece on each side",
  "The article a, a token that the reference does not have"],
 "Normalised, the answer holds 7 tokens (a is removed) and the reference 4, all of them found, so recall is 1 and precision 4 in 7: F1 0.727273. The three extra tokens are by, 004 and month. Points are dropped and join the digits. The article is removed before counting.")

q(2, "What does SQuAD normalisation make of \"The Ekene Sand\" and \"a 2 kg wrench\"?",
 "\"ekene sand\" and \"2 kg wrench\": the articles go",
 ["\"the ekene sand\" and \"a 2 kg wrench\", lowercased and nothing more",
  "\"ekene sand\" and \"a 2 kg wrench\", since the is the only article",
  "\"ekenesand\" and \"2kgwrench\", the spaces dropped with the punctuation"],
 "The rule lowercases, drops ASCII punctuation, replaces a, an and the by a space and collapses whitespace, so both articles go and the spaces between words stay. A space is no punctuation.")

q(0, "System B gives \"2024-03-01\" as its short answer to Q24, whose reference is empty. How is it scored?",
 "Exact 0 and F1 0.000000: one side has tokens and the other none",
 ["Exact 1, since a date is a valid answer to any query",
  "A null F1, as the reference holds no token to compare with",
  "F1 1.000000, since the date is found in a passage of the corpus and so earns full credit"],
 "The SQuAD 2.0 rule gives 1 only when both sides are empty, and 0 when one is, so a date against an empty reference scores 0 on both. The rule covers it, so nothing is null. Whether the date appears in a passage is the groundedness check's question; the planted defect is a fabricated event, and short-answer scoring never reads passages.")

q(1, "System B's short answer to Q05 is \"2024-09-01\" against the reference \"2024-03-01\". Why does it earn no partial credit at all?",
 "Each date normalises to one token, 20240901 and 20240301, and the two differ",
 ["Dates are compared as calendar dates, and a six-month gap between them scores 0",
  "F1 skips dates, so any date answer is scored 0",
  "The hyphens split each date into three tokens, and none of the three is shared"],
 "Dropping the hyphens joins each date into a single token, and one token against one different token gives no overlap: F1 0.000000. Short-answer scoring reads strings and knows nothing of dates. Splitting on hyphens is the retrieval tokeniser, and even there 2024 and 01 would be shared.")

# Field extraction

q(3, "System B writes 2230 for the reservoir pressure of EKD-017, labelled 2226, with absTol 0.5 and no relTol. What does the engine return?",
 "Wrong: a gap of 4 psi is far beyond the 0.5 the field allows",
 ["Correct, as 2230 is 2226 rounded to the nearest ten psi",
  "Unsupported, since 2230 appears in no passage of the corpus",
  "Correct, since the groundedness check's numericRelTol carries over to number fields"],
 "The field's tolerance is its absTol of 0.5 and the difference is 4, so both sides hold a value and they do not match; the engine's reason is \"2230 differs from 2226 by 4, above the tolerance 0.5\". Rounding earns nothing in a number field. Unsupported needs an empty label. numericRelTol belongs to the groundedness check and never reaches a number field, which reads only its own absTol and relTol.")

q(2, "System A writes \"3,038\" in a number field whose label is 3038. How is the cell scored?",
 "Correct: a comma followed by three digits is a thousands group",
 ["Wrong: the comma splits the value into the numbers 3 and 038",
  "Wrong: a string holding punctuation is never a plain number",
  "Unsupported: the label has no comma, so the prediction adds a value"],
 "A number field reads a number or a string of digits with optional comma thousands groups and a decimal part, so \"3,038\" is three thousand and thirty-eight, equal to the label. Commas are allowed as thousands groups. Unsupported needs an empty label, and this one holds 3038.")

q(0, "On EKD-040 the event label reads \"losses\" and B predicts \"lost circulation\". Which outcome follows?",
 "Wrong: normalised \"lost circulation\" differs from \"losses\"",
 ["Correct, as the two name the same drilling event",
  "Correct once the token F1 of the pair passes one half",
  "Missed, since the label's word never appears in the prediction"],
 "A text cell matches only on exact equality of the normalised strings, and these differ, so the cell is wrong with that reason. The engine does not judge meaning, and no F1 threshold turns a cell correct. Both sides hold a value, so missed cannot apply.")

q(1, "System B's well field scores F1 0.857143, with 26 correct, 2 wrong, 1 missed and 1 unsupported. Which planted cases land there?",
 "\"Ekene 3\" and \"Ekene 5\" wrong, EKD-056 missed, a well on EKD-013 unsupported",
 ["Four missed cells, every one of them from the two records that B did not return",
  "\"Ekene 3\" wrong, and three unsupported wells taken from other passages",
  "Two wrong wells from the Q03 answer, which cited another passage"],
 "B wrote \"Ekene 3\" on EKD-003 and \"Ekene 5\" on EKD-005, each normalised to two tokens against ekene3 and ekene5: wrong. EKD-056 was not returned and its well label is missed; EKD-053's missed cells are a date and an event. B put a well on the EKD-013 field survey, whose label is empty. Extraction scores records and never reads the Q03 answer.")

q(0, "Field q allows relTol 0.01. Label 100 meets \"101\" and label 50 meets \"50.6\". Which cells match?",
 "Correct for 100, on its tolerance of 1; wrong for 50, where the tolerance is 0.5 and the gap larger",
 ["Wrong for both, since relTol 0.01 means a fixed allowance of 0.01 whatever the size of the label happens to be",
  "Correct for both, a one percent tolerance being generous enough",
  "Wrong for 100, since a difference equal to the tolerance fails"],
 "relTol is a share of the label: 0.01 x 100 = 1 and 0.01 x 50 = 0.5. The first difference is 1, on the tolerance, and the comparison is less than or equal, so it matches. The second is just over 0.6, above 0.5, so it is wrong. A fixed 0.01 would be absTol.")

q(3, "System B's precision and recall on filled cells are both 0.895238. What makes them equal?",
 "Its 4 unsupported cells match its 4 missed ones, so both denominators agree",
 ["Precision and recall on filled cells are the same rate by definition",
  "B's two unreturned records cancel the difference between the two rates",
  "They round alike at six decimals and differ in the seventh"],
 "Precision divides correct filled cells by wrong, unsupported and correct filled; recall divides the same count by wrong, missed and correct filled. B has 4 unsupported and 4 missed, so the two divisions are identical. For system A they differ, 0.962264 against 0.971429. B's unreturned records feed its missed count, which is part of the match. The engine computes the two as one figure here, exactly.")

q(2, "A system returns every record with every field empty. How do its accuracy over cells and its recall on filled cells behave?",
 "Recall is 0, while accuracy still counts every empty-label cell as correct",
 ["Both come out at 0, since the system predicted nothing anywhere in any record or field",
  "Accuracy is 0 and recall is left undefined, with no filled prediction to count",
  "Both equal the share of the cells whose label is empty"],
 "An empty prediction against an empty label is correct, so accuracy over cells equals the share of empty labels, which is far from 0. Recall divides correct filled cells by cells with a label value, and none is correct, so recall is 0. This is why accuracy is read beside precision and recall on filled cells.")

q(1, "A prediction fills a field called choke that the call never declared. What does scoreExtraction do?",
 "Refuses: \"predictions[0].fields.choke is not one of the fields\"",
 ["Ignores choke and scores the declared fields as usual",
  "Scores choke as unsupported, its label being empty",
  "Adds choke as a text field and scores it by normalisation"],
 "Every prediction must line up with the declared fields, so an undeclared field is refused with its position named. The engine never drops an input silently or invents a field, and an outcome exists only for a declared field of a labelled record.")

# Groundedness and its limits

q(3, "The engine's reason for B's Q04 claim 1.2 says it is not in the cited EKD-018 and appears in three retrieved passages the answer does not cite. What would fix it?",
 "Citing a retrieved passage that holds the figure, since the system had it",
 ["Retrieving more passages, since the figure lies outside the top 5",
  "Raising numericRelTol, since 1.2 must be a rounded figure",
  "Removing the figure, since it appears in no passage at all"],
 "The figure is in EKD-010, EKD-011 and EKD-057, all retrieved and none cited, so this is a citation error and the fix is the citation. The passages are already in the top 5. Nothing suggests rounding, and a tolerance would not help a figure that is absent from the cited passage. A fabrication's reason would say it is in no passage.")

q(0, "For B's Q10 spill figure, the engine finds 5 only in EKD-025 and EKD-028, neither cited nor retrieved. How should a reviewer classify that?",
 "Out of reach: EKD-025 and EKD-028 hold it, and the system had neither",
 ["Citation error: it sits in a retrieved passage left uncited",
  "Fabrication: the figure is in no passage of the corpus",
  "Cited but unretrieved, the kind the notRetrieved flag marks"],
 "Both passages that hold 5 sit outside B's retrieved list and outside its citations. Of B's 11 unsupported claims, 5 are of this kind. The citation-error kind needs the figure in a retrieved passage, and the fabrication kind needs it absent from every passage. B's Q10 answer cites EKD-046, which B retrieved, so no flag is raised.")

q(2, "System B's Q24 answer reports a subsea tree replaced on 2024-03-01, a planted fabricated event. Which kind does the engine's reason give for the date?",
 "Only in passages neither cited nor retrieved, EKD-026 and EKD-035",
 ["Nowhere in the corpus, the fabrication kind",
  "A retrieved passage that the answer does not cite",
  "The cited EKD-031, whose citation the check flags as unknown to the corpus"],
 "The date is real elsewhere in the corpus, so the reason names where it is: \"it appears only in passages EKD-026 and EKD-035, neither cited nor retrieved\". The kind is read from where the figure sits; the event itself is invented. EKD-031 is a real passage and is cited, and it simply lacks the date.")

q(1, "System B supports 22 of 32 number claims, 7 of 8 date claims and 1 of 1 quote claim. How many of its 11 unsupported claims are numbers?",
 "10, and the other one is a date",
 ["11, since dates and quotes are always found",
  "9, with one date and one quote making up the rest",
  "7, which matches its count of supported date claims"],
 "32 - 22 = 10 numbers, 8 - 7 = 1 date and 1 - 1 = 0 quotes: 11 in all, of 41 claims. Dates can fail, as B's Q24 date does. B's only quote is supported.")

q(0, "System A's per-answer mean support is 0.962121 against a pooled 0.959184; for B it is 0.687500 against 0.731707. What explains the different gaps?",
 "Pooling weights each claim and the mean weights each answer, so where the misses fall decides it",
 ["Answers with no claim enter the per-answer mean at a fraction of 1, lifting it",
  "Flagged citations drop out of the pooled figure, and only B has any flagged citations at all in this set",
  "Different numericRelTol settings by default for the two figures"],
 "The basis: supportedFraction pools every claim of every answer; meanAnswerSupportedFraction averages the answers that have at least one claim. A miss in a short answer weighs more in the per-answer mean, and one in a long answer more in the pooled figure. Answers with no claim are left out of the mean, flagged claims stay in the pool, and both figures run at the same numericRelTol, 0.")

q(3, "In the course's stated answer, \"Ekene-1\" makes no claim while \"-2\" becomes the claim -2. What rule separates them?",
 "A number joined by a hyphen to a letter is an identifier; a minus after a space leads a number",
 ["Every hyphen is read as a minus sign, and whatever claim sits inside a well name is then dropped",
  "Numbers below 10 are skipped unless a unit follows directly after them",
  "A claim needs a unit, and skin counts as one while Ekene does not"],
 "The grammar reads a leading minus only after a non-alphanumeric character, and a number after - _ or / that follows a letter or digit is part of an identifier. In \"Ekene-1\" the hyphen follows a letter; in \", -2 skin\" the minus follows a space. Size and units play no part: 45% is read as the number 45.")

q(1, "System B's Q12 short answer \"1800 m MD\" is an exact match, yet two of its claims are unsupported. What does the pair of results show?",
 "Right and ungrounded: the figure is correct, and its citation points elsewhere",
 ["An error in exact match, whose score ought to have followed the groundedness check",
  "A failed check, since a correct figure always finds support",
  "Grounded and wrong, which is exactly the same case as B's Q05 answer on Ekene-6"],
 "B cites EKD-039, and the depth is in EKD-038 and EKD-042, retrieved and uncited, so the check cannot support it although the answer is right. Each score answers its own question and catches what the other misses. B's Q05 is the mirror case, fully supported with an exact match of 0.")

# Comparing two systems

q(2, "The paired nDCG comparison, seed 7, 2000 replicates, reports a standard error of 0.032083 and the unpaired one 0.066811. What is that standard error?",
 "The SD of the 2000 replicate differences, divisor nBoot - 1",
 ["The SD of the 23 per-query differences, over the root of 23",
  "Half the width of the percentile interval at level 0.95",
  "The mean absolute distance of the replicates from 0"],
 "The basis: standardError is the SD of the replicates with divisor nBoot - 1. It is read from the 2000 bootstrap replicates, so it moves with the seed like the bounds do. A formula on the 23 differences, a half-width or a mean distance would each be a different figure.")

q(0, "Which query gives system A its largest per-query nDCG win over B at 5, linear gain?",
 "Q15, a difference of 0.363114",
 ["Q20, a difference of 0.197904",
  "Q02, where the difference is -0.472652",
  "Q11, a difference of 0.085170"],
 "A minus B is 0.363114 on Q15, where A scores 0.515847 and B 0.152733. Q20 and Q11 are smaller A wins. Q02's difference is negative, the largest B win, where EKD-043's rate of penetration led BM25 astray.")

q(3, "Mean nDCG differs by 1.38e-3 and mean AP by 0.007271 between the systems. What decides whether either is a finding?",
 "Whether a paired interval on the same queries, its seed stated, excludes 0",
 ["A difference above 0.001, the smallest a report shows",
  "The system ahead also winning more queries than it loses",
  "Both differences pointing toward the same system"],
 "Both paired intervals at seed 7, 2000 replicates and level 0.95 cross 0: -0.068015 to 0.058726 for nDCG and -0.054879 to 0.064758 for AP, so neither difference separates the systems. No fixed size threshold exists, a count of wins ignores their size, and agreement in sign proves nothing when both intervals span 0.")

q(1, "bootstrapMean is given a single value. What does the engine return?",
 "A refusal: \"values has 1 value: the bootstrap resamples at least 2\"",
 ["An interval of zero width at that value, with a standard error of 0",
  "The value as its own mean, with null bounds and a note beside them",
  "An interval running from 0 up to the value, the widest it can be"],
 "Resampling one value always returns that value, so the engine refuses and names values, in its own words. It invents no interval. The note it returns with a result belongs to a different case, a single replicate, where \"one replicate: the standard error is undefined\".")

q(2, "An evaluation report quotes system A's MAP at 5. Which settings belong beside it?",
 "The cutoff, the relevance threshold, and the queries excluded with the reason",
 ["Seed and replicate count, since every mean here is resampled",
  "Only the gain, since MAP reads each passage's grade in full",
  "numericRelTol, since MAP checks the figures in each passage"],
 "MAP moves with the threshold (0.600278 at grade 1, 0.750362 at grade 2) and with the no-relevant rule (0.575266 under zero), and the course's report names every metric with its cutoff and the queries excluded and why. MAP draws no sample, turns grades into relevant or not at the threshold, and never reads passage figures.")

emit(Q, '/root/dai-wip-appliedai/banks/d5i_exam.json', expect_n=42)
finish()
