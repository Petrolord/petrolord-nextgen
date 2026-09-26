import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D5 Professional m05, Groundedness and Its Limits.
# Every figure is quoted from digest.txt: both fixed systems' answers checked
# against the passages they cite, k 5, numericRelTol 0 unless stated. No
# capstone name, id, query, answer or value appears.

q(1, "System B's Q15 answer cites EKD-059, which was outside B's top 5 for that query, and its figure 0.0012 is in EKD-059. How does the check treat the claim?",
 "Unsupported, and the citation is flagged as not retrieved for this query",
 ["Supported, since the figure sits in the very passage the answer cites",
  "Supported but flagged unknown, as EKD-059 lies outside the corpus",
  "Left out of the count, since a claim with a flagged citation goes unscored"],
 "A claim is supported only by a passage that is cited AND retrieved, so a citation the system could not have read supports nothing. The engine's reason: \"the number 0.0012 is unsupported: no cited passage is a retrieved passage of the corpus; it appears in EKD-059, cited but not retrieved\", with the flag \"citation EKD-059 was not retrieved for this query\". EKD-059 is a passage of the corpus, so the unknown flag does not apply, and the claim still counts among the 41.")

q(3, "System B makes 41 claims, 30 of them supported, across 24 answers that hold a claim. Which figure is its pooled supported fraction?",
 "0.731707",
 ["0.687500, the mean of its per-answer supported fractions",
  "0.756098, the figure B reaches at numericRelTol 0.002",
  "0.959184, a pooled figure over 49 claims"],
 "Pooled means every claim of every answer counted together: 30 of 41 is 0.731707. 0.687500 averages the answers, each weighted equally. 0.756098 is B's figure once a rounded number may stand, or once the retrieved lists are dropped. 0.959184 is system A's pooled figure, 47 of 49.")

q(0, "Run B's answers with no retrieved lists and the pooled fraction rises from 0.731707 to 0.756098. What caused the rise?",
 "Q15's citation of EKD-059 now counts, since every cited corpus passage can support",
 ["The unknown citation EKD-061 now supports the figures in B's Q21 answer",
  "The rounded 2,100 psia is read within a tolerance of 2,096 once lists go",
  "Claims found in retrieved but uncited passages are now supported too"],
 "Without the retrieved lists the basis says \"no retrieved list was given, so every cited passage of the corpus can support a claim\", so the Q15 figure in EKD-059 counts and B has 31 of 41. EKD-061 is still no passage. The tolerance is numericRelTol, still 0. A figure in a passage the answer does not cite is never supported. The same 0.756098 arises from a different change, numericRelTol 0.002, so report which rule ran.")

q(2, "At numericRelTol 0.002, is B's \"about 2,100 psia\" supported by the 2,096 psia in EKD-018?",
 "Yes: the gap of 4 is within 0.002 x 2096, which the course derives as 4.192",
 ["No: the check compares digits, and 2,100 and 2,096 share too few of them",
  "Yes, and so is every figure within that share of any number in the corpus",
  "No: \"about\" turns the figure into a quote, which needs the same run of tokens"],
 "A number is supported within numericRelTol x |passage value| of a number in a cited, retrieved passage. |2100 - 2096| = 4 and the allowance is 4.192, so the claim is supported and B rises to 31 of 41, 0.756098. The check compares values, and the passage must be cited and retrieved, so the rest of the corpus is irrelevant. Only a span in double quotes is a quote.")

q(0, "System B's reason for its Q12 claim 1800 reads: \"the number 1800 is not in the cited passage EKD-039; it appears in retrieved passages EKD-038 and EKD-042, which the answer does not cite\". Which kind of unsupported claim is it?",
 "Citation error: the system held the passage and cited another one",
 ["Fabrication: nothing anywhere in the corpus holds the number 1800",
  "Cited but never retrieved, which the notRetrieved flag marks",
  "Out of reach: only in passages neither cited nor retrieved"],
 "The reason names retrieved passages the answer does not cite, so the figure was in hand and the citation pointed elsewhere: 3 of B's 11 unsupported claims are of this kind. A fabrication's reason ends \"it appears in no passage of the corpus\". A cited passage that was not retrieved draws its own reason and flag, and the out-of-reach reason ends \"neither cited nor retrieved\".")

q(3, "System B's Q07 answer gives the STOIIP as 12.1 million stb, a planted unit change, and the check marks 12.1 as in no passage of the corpus. Why can it not support the figure?",
 "It compares numbers as written and converts no unit, and 12.1 is in no passage",
 ["The figure rounds the reference badly, beyond what the default numericRelTol allows",
  "It is read as a quote, and a quote needs the same run of tokens in EKD-008",
  "EKD-008 was not retrieved for Q07, so nothing in it can count as support"],
 "The value is a fair rounding of the reference in millions, and the check still cannot see it: it reads the number 12.1 and looks for that value, with no unit conversion. The default numericRelTol is 0, and no tolerance turns 12.1 into a figure in whole barrels. Only double-quoted spans are quotes. The reason names EKD-008 as the cited passage and raises no notRetrieved flag.")

q(1, "System B's Q05 answer, \"Water broke through at Ekene-6 on 2024-09-01.\", cites EKD-027, which B retrieved. What do the groundedness check and exact match say?",
 "Fully supported, yet exact match 0: EKD-027 is about Ekene-3",
 ["Unsupported, since the date belongs to another well's passage",
  "Fully supported and exact match 1, since a supported date is right",
  "Unsupported and flagged, as the citation was never retrieved"],
 "The date is in EKD-027, which the answer cites and B retrieved, so the check supports it. EKD-027 is about Ekene-3's breakthrough, Ekene-6 broke through on 2024-03-01, and B's short answer scores exact match 0. The check reads figures and cannot know whose well a passage describes, so grounded is a statement about the passage and says nothing of truth.")

q(2, "The stated answer \"The spill was 5 bbl.\" cites EKD-025, with no retrieved list given, and EKD-025 says \"5 months\". What does the check return?",
 "Supported, 1 of 1: it matches the value 5 and ignores the unit",
 ["Unsupported, since bbl and months are different units",
  "A refusal, since the check needs a retrieved list for every answer",
  "No claim at all, since a number followed by a unit is an identifier"],
 "A number claim is matched by value; units are never read, so 5 bbl finds the 5 in \"5 months\". With no retrieved list every cited corpus passage can support, and nothing is refused. An identifier is a number glued to a preceding letter or joined by - _ or / to a letter or digit, and \"5 bbl\" is neither.")

q(3, "System A's Q13 answer says the water cut was 45 percent at the end of 2025 (2025-12-01), citing EKD-030. Why is one of its claims unsupported although the answer is right?",
 "The bare year is read as the number 2025, and EKD-030 writes only the date",
 ["The percent sign makes 45 a quote, and EKD-030 lacks that run of tokens",
  "The date 2025-12-01 is read as three numbers that EKD-030 does not hold",
  "EKD-030 was never retrieved for Q13, so every one of the claims that cite it fails"],
 "The claim grammar reads \"the end of 2025\" as the number 2025, and the engine's reason is \"the number 2025 is not in the cited passage EKD-030; it appears in retrieved passage EKD-037, which the answer does not cite\". A percent sign is ignored and 45 is a number. An ISO date is read as a date and is found. EKD-030 was retrieved and supports the other claims.")

q(0, "The course's stated answer cites d1 and d4 with d1, d2 and d4 retrieved: Ekene-1 made 120 bopd; the survey read 2,096 psia on 2023-01-01, a \"water injection\" start, and 45% water, -2 skin. How many claims are found, and how many supported?",
 "6 claims, 2 supported: 120 and 2,096",
 ["7 claims and 3 supported, counting the 1 in Ekene-1 as a number",
  "5 claims and 2 supported, since 45% is a share and makes no claim",
  "6 claims and 4 supported, since d2 holds the date and quote and was retrieved"],
 "The quote, the date and the numbers 120, 2,096, 45 and -2 make 6 claims; \"Ekene-1\" is an identifier and makes none, and \"45%\" is the number 45. Only 120 (in d1) and 2,096 (in d4) are in a cited, retrieved passage: 0.333333. The date and quote are in d2, retrieved but uncited, so they are unsupported with a reason that says so.")

q(2, "System B's Q21 answer cites EKD-061. What does the check report?",
 "The flag \"citation EKD-061 is not a passage of the corpus\"",
 ["The flag \"citation EKD-061 was not retrieved for this query\"",
  "A refusal naming citations[0], as every cited id must be in the corpus",
  "Nothing, as citations are only read when a claim needs support"],
 "The corpus runs EKD-001 to EKD-060, so EKD-061 is flagged unknown, a citation to nothing; it was planted. The not-retrieved flag is for a real passage outside the top 5, as B's Q15 citation of EKD-059. The engine flags an unknown id; it refuses citations only when they are not a list of non-empty ids. Every citation is checked, claim or no claim.")

q(1, "Why does the engine refuse a numericRelTol of 1?",
 "At 1, any number from 0 to twice a passage value would match it",
 ["At 1 every claim would have to equal a passage value exactly",
  "Only 0 and 0.002 are accepted, the two settings the course teaches",
  "numericRelTol is in absolute units, and 1 psi is too coarse for pressure"],
 "The allowance is numericRelTol x |passage value|, so at 1 the window runs from 0 to twice the value and would support almost anything. The engine accepts values from 0 up to just below 1: \"numericRelTol must be a number from 0 (inclusive) to 1 (exclusive)\". Exact equality is numericRelTol 0. The tolerance is relative to the passage value.")

q(3, "System A's answers to Q14 and Q24 state no number, date or quote. How do they enter A's groundedness figures?",
 "Each fraction is null with the reason, and the pooled 47 of 49 counts claims only",
 ["Each scores 1.000000, as an answer with nothing unsupported is fully supported",
  "Each scores 0.000000, which drags the mean of the per-answer fractions down",
  "The call is refused until every answer holds at least one checkable claim"],
 "The engine returns \"the answer has no checkable claim (no quote, date or number), so the supported fraction is undefined\": a result returned as null, with the reason. The pooled fraction counts claims, so A's is 47 of 49, 0.959184, and the per-answer mean covers the 22 answers that have a claim. Nothing is refused.")

q(0, "An answers list holds two entries for Q01. What does checkAnswers do?",
 "Refuses: \"answers[1].query repeats Q01 (answers[0]): one answer per query\"",
 ["Keeps whichever of the two entries has more supported claims and drops the other",
  "Scores both, counting the claims for Q01 twice in the pooled fraction",
  "Merges the two texts into one answer before it extracts the claims"],
 "The check scores one answer per query, and a second answer would count a query twice in the pooled fraction, so the engine refuses in its own words and names the position of the repeat. It never chooses between answers or merges them.")

q(2, "System A's Q06 claim 20.3 draws the reason \"the number 20.3 is not in the cited passage EKD-001; it appears only in passage EKD-007, neither cited nor retrieved\". What does that tell a reviewer?",
 "The figure is real, and it came from a passage the answer cannot show",
 ["Fabricated: no passage in the corpus holds 20.3 at all",
  "A citation error among the passages the answer retrieved",
  "EKD-001 is flagged unknown, as a passage outside the corpus"],
 "20.3 m, the maximum oil column, is in EKD-007, which A neither retrieved nor cited, so the figure came from somewhere the answer cannot show. A fabrication's reason says the figure is in no passage. A citation error names a retrieved passage the answer did not cite. EKD-001 is a real passage and draws no flag.")

emit(Q, '/root/dai-wip-appliedai/banks/d5i_m05.json', expect_n=15)
finish()
