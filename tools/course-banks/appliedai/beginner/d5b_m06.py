import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D5 Associate m06, Answers that Cite their Sources.
# Sources: what an answer is, the claim and support basis, the citations
# basis, the stated hand-set answer and its six claims with their verbatim
# reasons, system A's 24 answers pooled, its two unsupported claims with their
# verbatim reasons, the answers with no claim and their note, and the
# vocabulary rules for hallucination and grounded. Every figure is printed in
# the digest.

q(1, "What does the engine take as an answer when it checks one?",
 "A text and the list of passage ids it cites",
 ["The short answer alone, compared with the reference answer for the query",
  "Any text at all, checked against the whole corpus for each figure",
  "The ranked list of passages, read as the answer"],
 "An answer in this course is a text and the list of passage ids it cites, and the engine checks the answer's claims against the passages it cites. It never checks figures against the whole corpus as support, and the ranked list is what the answer is checked with, never the answer itself."),

q(3, "A stated answer cites d1 and d4, with d1, d2 and d4 retrieved: Ekene-1 made 120 bopd; the survey read 2,096 psia on 2023-01-01, a \"water injection\" start, and 45% water, -2 skin. What is its supported fraction?",
 "0.333333, 2 of 6 claims",
 ["0.500000, 3 of 6 claims, since Ekene-1 is a claim found in d1",
  "0.666667, 4 of 6, as the date and the quote are found in d2, a retrieved passage",
  "1.000000, since every claim appears in some passage or another"],
 "The six claims are 120, 2,096, 2023-01-01, the quote, 45 and -2. 120 is in d1 and 2,096 in d4; the date and the quote are in d2, which was retrieved and not cited, and 45 and -2 are in no passage: 2 of 6, 0.333333. Ekene-1 is an identifier and makes no claim, and support needs a passage that is both cited and retrieved."),

q(0, "In that stated answer, why does \"Ekene-1\" make no claim?",
 "A number directly after - that follows a letter is part of an identifier",
 ["Well names are removed by the stop list before claims are read",
  "It does, and the claim is supported by d1, which names Ekene-1 in its text",
  "Only numbers above 100 are read as claims, so a well number such as 1 is too small to count"],
 "The claim rule says a number directly after a letter, or after - _ or / that follows a letter or digit, is part of an identifier and not a claim, so the 1 in Ekene-1 makes none. The stop list plays no part in reading claims, and any number standing apart is a claim, however small, as the -2 shows."),

q(2, "How does the claim reader treat \"45%\" in an answer?",
 "As the number 45, since a percent sign is ignored",
 ["A quote, since the percent sign marks it as a quoted span to be matched",
  "A fraction, since a percentage is divided by 100 before it is matched",
  "No claim, since a figure with a unit sign is skipped"],
 "The basis states \"a percent sign ignored\", so \"45%\" is the number 45. Quotes are spans in double quotes, the engine does not rescale a percentage, and a figure followed by a percent sign is still a claim."),

q(2, "The date 2023-01-01 in the stated answer is in d2, which was retrieved and not cited. What reason does the engine give?",
 "\"the date 2023-01-01 is not in the cited passages d1 and d4; it appears in retrieved passage d2, which the answer does not cite\"",
 ["\"the date 2023-01-01 is not in the cited passages d1 and d4; it appears in no passage of the corpus\"",
  "\"found in d2\"",
  "\"the date 2023-01-01 is not in the cited passages d1 and d4; it appears only in passage d2, neither cited nor retrieved\""],
 "The engine's reason names where the date is: in retrieved passage d2, which the answer does not cite. The date does appear in the corpus, so \"no passage of the corpus\" is wrong, a claim in an uncited passage is never \"found\", and d2 was retrieved, so \"neither cited nor retrieved\" is wrong too."),

q(3, "In the stated answer the text reads \"45% water, -2 skin\". Why is -2 a claim with value -2?",
 "The minus follows a space, a non-alphanumeric character, so it leads a negative number",
 ["Every hyphen before a digit makes a negative number, including the one inside the well name Ekene-1",
  "The claim reader drops signs, and 2 is what is matched",
  "Skin values are always negative, so the reader adds the sign"],
 "The basis allows a leading minus only after a non-alphanumeric character, so after a space -2 is a negative number, checked with value -2; it is in no passage. The hyphen in Ekene-1 follows a letter, so that is an identifier, the sign is kept, and the reader knows nothing of skin."),

q(0, "The tokeniser splits \"2,096\" into 2 and 096. What does the claim reader make of it?",
 "The single value 2096, since digits with comma thousands groups are one number",
 ["Two claims, 2 and 096, checked one by one",
  "No claim at all, since a comma between digits makes the figure an identifier",
  "A decimal value, with the comma taken as a decimal point, as some reports write it"],
 "The claim rule reads digits with optional comma thousands groups and a decimal part as one number, so \"2,096\" is the value 2096 and is found in d4. Retrieval and claim reading are stated separately: the tokeniser's split serves matching words. A comma never turns a figure into an identifier or a decimal point."),

q(1, "System A's 24 answers make 49 claims, of which 47 are supported. What is its pooled supported fraction?",
 "0.959184, 47 over 49",
 ["0.666667, the fraction of the Q13 answer, the answer with the most claims",
  "0.500000, the Q06 answer's fraction, taken as the lowest",
  "1.000000, all found"],
 "The pooled fraction counts claims: 47 supported over 49, 0.959184. Answers with more figures weigh more. A single answer's fraction, such as Q06's 0.500000 or Q13's 0.666667, says nothing about the pool, Q13 has 3 claims where Q16 and Q18 have 5, and the check fails a claim whose figure is not in the cited passages even when every citation was retrieved, as the Q06 and Q13 claims show."),

q(1, "System A's Q06 answer states 20.3, which is in EKD-007. What is the engine's reason for it?",
 "\"the number 20.3 is not in the cited passage EKD-001; it appears only in passage EKD-007, neither cited nor retrieved\"",
 ["\"the number 20.3 is not in the cited passage EKD-001; it appears in retrieved passage EKD-007, which the answer does not cite\"",
  "\"found in EKD-007\"",
  "\"the number 20.3 is not in the cited passage EKD-001; it appears in no passage of the corpus\""],
 "EKD-007 was neither retrieved nor cited, so the figure came from somewhere the answer cannot show, and the reason says exactly that. EKD-007 was not in system A's retrieved list, so \"retrieved passage EKD-007\" is wrong; a claim is never found in an uncited passage; and 20.3 is in EKD-007, so it is in the corpus."),

q(3, "System A's Q13 answer repeats the year from \"the end of 2025\", and the check finds 2025 in EKD-037, which was retrieved and not cited. What kind of slip is it?",
 "A figure from a passage the system saw and did not cite, planted in the fixture",
 ["A figure from outside what the system saw, as in the Q06 answer",
  "A date claim, since 2025 is read as a year",
  "No slip, since a year repeated from the query is never read as a claim"],
 "The reason says \"it appears in retrieved passage EKD-037, which the answer does not cite\": the system saw that passage and failed to cite it. The Q06 slip is the other kind, a figure from a passage neither retrieved nor cited. A date claim needs the full YYYY-MM-DD form, so 2025 alone is a number, and the reader takes it as a claim like any other."),

q(0, "System A's answers to Q14 and Q24 state no number, date or quote. How are they treated?",
 "Their supported fraction is returned as null, with the reason, and they add nothing to the pooled fraction",
 ["They are refused, naming `text`, since an answer must hold at least one claim",
  "Each scores 1.000000, as an answer with no claim has nothing unsupported",
  "Each scores 0, pulling the pooled fraction down"],
 "The fraction is undefined for an answer with no claim, and the engine returns it as null with the note \"the answer has no checkable claim (no quote, date or number), so the supported fraction is undefined\". The call is not refused, the fraction is never filled in as 1 or 0, and the pooled figure counts only claims."),

q(2, "An answer cites one id that is no passage of the corpus and one passage that was not retrieved for its query. How are the two citations treated?",
 "The unknown id is flagged unknown; the other is flagged notRetrieved and supports nothing",
 ["Both are dropped silently, and the claims are then checked against every passage the system retrieved",
  "The unknown id is refused, naming `citations`, and the call stops",
  "Both support claims as usual, since a citation is taken at its word"],
 "The citations basis is exact: a citation that is not a passage of the corpus is flagged unknown, and one that was not retrieved for the query is flagged notRetrieved and supports nothing. Flags are reported, never dropped, an unknown id is flagged without a refusal, and an unretrieved citation supports no claim."),

q(3, "System A's Q01 answer has 2 claims, both found in its cited, retrieved passage EKD-018. What does \"supported\" tell you about that answer?",
 "Both figures appear in EKD-018; whether the answer is true is a question the check does not decide",
 ["The answer is right, since the passage was retrieved and cited and the figures were found in it word for word",
  "EKD-018 was judged by the assessor to answer Q01 at grade 3",
  "No other passage in the corpus contains a figure that contradicts it, since the check searches them all"],
 "In this course grounded is supported by a cited and retrieved passage, a statement about the passage and never about the truth of the answer; the check does not decide whether the answer is true or whether the passage is about the right well. The judgments play no part in the claim check, and the engine looks for no contradicting passage."),

q(0, "In what order does the claim reader pick claims out of an answer?",
 "Quoted spans first, then ISO dates, then numbers",
 ["Numbers first, then dates, then quotes, so each figure is claimed as early as possible",
  "Left to right as the words appear, each one read as a quote, a date or a number",
  "Dates first, then the rest"],
 "The basis states quoted spans first, then ISO dates YYYY-MM-DD, then numbers, so a date inside a quote belongs to the quote, and the digits of a date are never read again as numbers. The order is by kind, whatever the position in the text."),

q(1, "A quoted span in an answer, such as \"water injection\", is checked against a passage. What must match?",
 "The same run of tokens, so case and punctuation do not matter and the words must appear together and in order",
 ["The exact characters, capital letters and punctuation included",
  "Each word of the quote anywhere in the passage, in any order and with any gap between them, as separate tokens",
  "The first word alone, as the quote's key"],
 "A quote is supported as the same run of tokens under the tokeniser's rule, so case and punctuation fall away while the words must appear together and in the same order. An exact character match would fail on case, words scattered anywhere would not be a run, and every word of the quote counts."),

emit(Q, '/root/dai-wip-appliedai/banks/d5b_m06.json', expect_n=15)
finish()
