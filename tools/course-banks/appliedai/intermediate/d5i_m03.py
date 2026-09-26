import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D5 Professional m03, Short Answers.
# Every figure is quoted from digest.txt: SQuAD normalisation, exact match and
# token F1 on both fixed systems' short answers. No capstone name, id, query,
# answer or value appears.

q(2, "What does SQuAD normalisation turn \"45.0 percent\" into?",
 "\"450 percent\"",
 ["\"45 percent\", once the trailing zero after the point is read off as a number",
  "\"45 0 percent\", three tokens, with the decimal point read as a split",
  "\"45.0 percent\" unchanged, since a decimal point belongs to its number"],
 "The rule is lowercase, drop ASCII punctuation, replace a, an and the by a space, collapse whitespace. Dropping the point joins the digits, so \"45.0\" becomes \"450\". Nothing parses numbers, so no zero is read off. Splitting on the point is the retrieval tokeniser's rule, a different job. The point is ASCII punctuation and is dropped.")

q(0, "System A's short answer to Q13 is \"45 percent\" and the reference is \"45.0 percent\". What does answerMatch return?",
 "Exact match 0, token F1 0.500000",
 ["A match on both scores, 1 and 1.000000, as the quantity is the same",
  "Zero on both, since 45 and 450 share no token at all",
  "Full exact credit, with F1 halved by the missing decimal"],
 "Normalised, the answer is \"45 percent\" and the reference \"450 percent\": the strings differ, so exact match is 0, and the two share one token of two on each side, \"percent\", so F1 is 0.500000. The engine does not know the two figures are the same quantity. The shared unit is why F1 is above 0, and exact match gives no partial credit.")

q(3, "System B answers Q04 with \"2,000 psia\" against the reference \"2000 psia\". Why is that an exact match?",
 "The comma is ASCII punctuation and is dropped, which closes the digits up",
 ["The engine reads both sides as numbers and compares them within a tolerance",
  "A comma splits \"2,000\" into two tokens, and token order is then ignored",
  "Exact match forgives any change in the digits once the units agree"],
 "SQuAD normalisation drops the comma, so \"2,000 psia\" becomes \"2000 psia\" and the normalised strings are equal. Exact match parses no number and has no tolerance; a number field in extraction is where a tolerance lives. Splitting on the comma is the retrieval tokeniser. A change in digits, as in B's Q11 \"12.6 ppg\", is a miss.")

q(1, "System B answers Q03 with \"Ekene 2 and Ekene 4\"; the reference is \"Ekene-2 and Ekene-4\". It scores exact 0 and F1 0.250000. What drives both?",
 "The hyphen is dropped so the reference reads ekene2, while B's space keeps ekene and 2 apart",
 ["The word \"and\" is treated as an article and removed from one of the two sides",
  "Hyphens split words, so the reference ends up with more tokens than B's answer",
  "Exact match compares the raw text before normalisation, so a space change misses"],
 "Normalised, the reference is \"ekene2 and ekene4\", three tokens, and B's answer \"ekene 2 and ekene 4\", five. Only \"and\" is common, so precision is 1 in 5, recall 1 in 3 and F1 0.250000; the strings differ, so exact match is 0. Only a, an and the are articles. Dropping the hyphen joins the words, and both scores are read after normalisation.")

q(0, "Scored against the references, how many exact matches do the two systems' short answers make?",
 "A 20 of 24 and B 13 of 24, with Q24 in the denominator",
 ["20 of 23 for A, 13 of 23 for B, Q24 left out",
  "For A 19 of 24, its empty Q24 answer scoring 0; for B 13 of 24",
  "21 of 24 for A, once its \"45 percent\" on Q13 counts as the same quantity"],
 "Every query's short answer is scored against its reference, Q24 included: the no-relevant rule belongs to retrieval means. A's empty answer to the empty Q24 reference is an exact match, a correct abstention. Q13's \"45 percent\" normalises differently from \"45.0 percent\", and exact match does not treat them as one quantity.")

q(3, "What is token F1 for the stated answer \"oil oil water\" against the reference \"oil water water\"?",
 "0.666667, from 2 common tokens of 3 on each side",
 ["1.000000, since the two share every distinct word they hold",
  "0.888889, the figure for an answer missing one reference token",
  "0.500000, since each side repeats a different word and repeats halve"],
 "Overlap is counted by multiset: oil is common once (twice in the answer, once in the reference), water once, so 2 tokens are common, precision 2 of 3, recall 2 of 3 and F1 0.666667. Counting distinct words would give full credit and reward repetition. 0.888889 is A's Q08 figure, a different pair of strings. No rule halves a repeat.")

q(1, "System A answers Q08 with \"0.5 to 0.35 bbl/d/psi\"; the reference is \"from 0.5 to 0.35 bbl/d/psi\". Token F1 is 0.888889. What keeps it below 1?",
 "Every answer token is in the reference, and the reference's \"from\" is missing, which lowers recall",
 ["The decimal points are dropped differently on the two sides, splitting 0.35",
  "The slashes in bbl/d/psi split into three tokens on the answer side alone",
  "Precision falls because the answer adds a token the reference lacks"],
 "Both sides go through the same normalisation, so 0.35 and bbl/d/psi become the same tokens on each side. The answer's four tokens are all in the reference's five, so precision is 1 and recall 4 of 5, which gives F1 0.888889. Nothing is added, so precision stays at 1; the missing \"from\" costs recall.")

q(2, "System A leaves Q24 unanswered, and the Q24 reference is empty too. What do exact match and token F1 give?",
 "Exact 1 and F1 1.000000: two empty strings match, a correct abstention",
 ["Exact 0 and F1 0.000000, since an empty answer cannot earn any credit",
  "A null for both scores, with a note that there is no token to compare",
  "A refusal naming prediction, because an empty string counts as no answer"],
 "Two empty strings are equal, so exact match is 1, and the F1 rule reads \"when either side has no token, 1 if both are empty and 0 otherwise (SQuAD 2.0)\", so F1 is 1. Nothing is null or refused: an empty string is text. Scoring the abstention as a miss would punish a system for saying nothing when nothing answers the query.")

q(0, "System A's short answer to Q14 is empty; the reference is \"water free\". What does it score, and where did the failure start?",
 "F1 0.000000, a miss that began upstream, where the lexical trap left no answering passage",
 ["F1 1.000000, since an honest abstention earns full credit on any query",
  "A null F1, as an answer with no token leaves the score undefined",
  "F1 0.500000, half credit for abstaining when the passages say \"no water\""],
 "One side is empty and the other is not, so the SQuAD 2.0 rule gives 0, and exact match is 0. Full credit for an empty answer needs an empty reference, as on Q24. The rule covers the empty case, so nothing is null, and there is no half credit. The miss began in retrieval: Q14 is the planted lexical trap, with hit 0 at 5 for BM25.")

q(2, "An answer consists of the single word \"the\", scored against an empty reference. What does answerMatch return?",
 "Exact 1 and F1 1, since \"the\" normalises to nothing",
 ["Exact 0 and F1 0, as the answer holds a word and the reference holds none",
  "A refusal: \"the\" is a stop word",
  "Exact 0 with F1 1, the two scores reading the article in different ways"],
 "Empty is decided after normalisation. SQuAD replaces a, an and the by a space, so \"the\" becomes the empty string, equal to the empty reference: exact 1, and F1 1 by the rule for two empty sides. The stop list belongs to the retrieval tokeniser and is off by default; nothing here refuses. Both scores read the same normalised strings.")

q(3, "System B answers Q01 with \"about 2,100 psia\" against \"2,096 psia\" and scores token F1 0.400000. Where does the credit come from?",
 "The one shared token, psia; \"2100\" and \"2096\" are different words to F1",
 ["The figure 2,100 falls within a tolerance of 2,096, which earns part credit",
  "\"about\" is dropped as an article, leaving two tokens that half match",
  "The comma splits each figure, which gives a shared 2 token as well"],
 "Normalised, the answer is \"about 2100 psia\", three tokens, and the reference \"2096 psia\", two. Only psia is common, so precision is 1 in 3, recall 1 in 2 and F1 0.400000. Token F1 has no numeric tolerance. \"about\" is no article and stays a token. The comma is dropped and the digits join, so no 2 token appears.")

q(1, "Mean token F1 over the 24 short answers is A 0.921507 and B 0.712004. What is that figure?",
 "The mean of each system's per-answer F1 column, Q24 included",
 ["One F1 per system, from its 24 answers pooled into a single string",
  "Each system's share of answers whose F1 is above 0.500000",
  "A mean over the 23 queries with a relevant passage, Q24 left out"],
 "The course derives it as the mean of the F1 column over all 24 short answers, the same 24 that exact match counts. Pooling the text into one string is no rule the engine states, and a share above a cut is a different figure. Q24 is kept: A's abstention on it scores 1 and B's fabricated date 0.")

q(0, "A short answer is supplied as the number 45 where the text \"45\" belongs. What does answerMatch do?",
 "Refuses it, in its own words: \"prediction must be a string\"",
 ["Converts it to text and scores it as usual",
  "Scores it exact 0 and F1 0, noting that the prediction held no token",
  "Treats it as an abstention, which scores 1 against an empty reference"],
 "The engine checks its inputs before it compares anything, and a number where the answer text belongs is refused with the field named. It converts nothing. An abstention is written as an empty string, which is text and is scored.")

q(3, "System B's Q16 answer lists Ekene-1 91,667 stb and Ekene-5 153,506 stb, two of the four wells the reference names. How is it scored?",
 "Exact 0 and F1 0.666667, every answer token in the reference and half the reference found",
 ["Exact 1, since every figure the answer gives appears in the reference",
  "F1 0.500000, the share of the four wells that the answer names",
  "Exact 0 and F1 0.000000, since an incomplete list earns nothing"],
 "Normalised, the answer holds 6 tokens, all in the reference's 12, so precision is 1, recall one half and F1 0.666667: partial credit. The strings differ, so exact match is 0. F1 counts tokens, and half the wells is half the recall, which F1 combines with a precision of 1. Partial overlap is exactly what token F1 rewards.")

q(1, "The retrieval tokeniser and the SQuAD normaliser both meet \"Ekene-3\". What does each produce?",
 "Retrieval gives the two tokens ekene and 3; SQuAD gives the one token ekene3",
 ["Both give ekene and 3, since each splits on every character outside [a-z0-9]",
  "Both give ekene3, since each drops punctuation and closes the gap it leaves",
  "Retrieval gives ekene3 and SQuAD gives ekene and 3, the rules reversed"],
 "The retrieval tokeniser splits on every run of characters outside [a-z0-9], so the hyphen separates. SQuAD normalisation drops ASCII punctuation, so the hyphen goes and the two parts join. Both are the engine's stated rules for different jobs, and a figure from one is never compared with a figure from the other.")

emit(Q, '/root/dai-wip-appliedai/banks/d5i_m03.json', expect_n=15)
finish()
