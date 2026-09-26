import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D5 Associate m02, Tokens.
# Sources: the tokeniser's basis and its stated texts with their token counts,
# with and without the stop list; the stop list and the words it removes; the
# query "the well top" and Q14 with the list on; the counted passages EKD-001,
# EKD-018 and EKD-030; the corpus vocabulary and mean length with the list on
# and off; the hand set lengths; the tokenize refusals. Every figure is printed
# in the digest.

q(1, "How many tokens does the engine make of `Ekene-3 flowed 1.25 MMscf/d; Top WELL at 1548 m TVD.` with the stop list off?",
 "13",
 ["10, since the stop list is applied before the text is split into its tokens",
  "9, because \"1.25\" and \"MMscf/d\" each stay whole as a single token",
  "11"],
 "The engine splits on every run of characters outside [a-z0-9]: ekene 3 flowed 1 25 mmscf d top well at 1548 m tvd, 13 tokens. The decimal point and the slash both separate, and so does the hyphen in Ekene-3. 10 is the count with the stop list on, which removes top, well and at, and the list is off by default."),

q(3, "What does the tokeniser make of the figure \"2,096\" in `Average reservoir pressure 2,096 psia on 2023-01-01.`?",
 "Two tokens, 2 and 096",
 ["One token, 2096",
  "The single token 2,096, because a comma between digits is read as part of a number",
  "One token, 2, since the engine drops any piece that starts with a zero after splitting"],
 "A comma is outside [a-z0-9], so it separates: \"2,096\" becomes 2 and 096, and the leading zero stays because nothing but case is changed. The tokeniser keeps no comma inside a token and joins no digits across one, and an empty piece is the only piece it drops."),

q(0, "What tokens does `Café Überprüfung naïve` give?",
 "caf berpr fung na ve",
 ["cafe uberprufung naive, with each accent folded to its plain letter",
  "café überprüfung naïve, lowercased with the accents left in place",
  "no tokens at all"],
 "Only ASCII A to Z are lowercased, and every character outside [a-z0-9] separates, so each accented letter splits the word: caf berpr fung na ve, 5 tokens. The engine folds no accents and keeps no accented letter in a token, and the text is accepted, since the only text refusals are for a text that is not a string or one above 20000 characters."),

q(2, "How does the tokeniser split `Core plug EK1-P: permeability 420 md.`?",
 "core plug ek1 p permeability 420 md, with ek1 kept as one token",
 ["core plug ek 1 p permeability 420 md",
  "core plug ek1-p permeability 420 md",
  "just core plug permeability md"],
 "Letters and digits that sit together stay together, so EK1 is the single token ek1, and the hyphen splits off p: 7 tokens in all. The rule cuts only at characters outside [a-z0-9], so a letter-digit boundary is no cut, a hyphen always separates, and single characters and numbers are kept."),

q(3, "Which tokens does `Bit graded 2-3-WT at 1760 m MD.` give?",
 "bit graded 2 3 wt at 1760 m md, 9 tokens",
 ["bit graded 2-3-wt at 1760 m md",
  "bit graded 23wt at 1760 md",
  "only bit graded wt 1760 md, dropping the single characters 2, 3 and m as too short"],
 "Each hyphen separates, so the grade 2-3-WT becomes 2, 3 and wt, and the text gives 9 tokens. The rule never keeps a hyphen inside a token, never joins pieces across a separator, and keeps single-character tokens such as 2, 3 and m: a common alternative that keeps only two characters or more is the one this engine did not take."),

q(1, "A report says \"producing\" and a query says \"produced\". How many tokens do the two words share?",
 "None, since no stemming is done and the words stay different tokens",
 ["One, since both are cut back to the root produc",
  "Both, since lowercasing maps them to one token",
  "One, through a synonym list that pairs the forms"],
 "The rule ends \"no stemming\": nothing is cut back to a root, so \"producing\" and \"produced\" are different tokens and a query for one does not match the other. Lowercasing changes only A to Z, and the engine has no synonym list whatever the stop list setting."),

q(0, "Why does the engine leave scikit-learn's stop list off by default?",
 "It removes words with oilfield meaning, among them well, top, bottom, fire and system.",
 ["It holds too few words to matter, so it changes no token count on the Ekene passages.",
  "Using it slows every call past the engine's limits, so each call is refused whenever it is on.",
  "Its licence forbids use in a commercial engine, so it is shipped only for reading."],
 "The engine's stated reason is that the list removes well, top, bottom, fire and system, words that carry meaning in oilfield text. The list holds 318 words and cuts the corpus vocabulary from 574 to 505 tokens, so it matters. Switching it on is accepted, and the list is scikit-learn's, under BSD-3-Clause, exported by the engine."),

q(2, "With the stop list on, a geologist types the query \"the well top\" into BM25. What comes back?",
 "An empty ranking with the note \"the query has no token after the stop list, so no document is ranked\"",
 ["A refusal naming `query`, since a query of stop words is not a string",
  "A ranking on the word well alone, as the and top are the only words removed",
  "Every passage at the same score, in id order, since nothing in the query can be weighed"],
 "the, well and top are all on the stop list, so the query loses every token and the call returns with the note \"the query has no token after the stop list, so no document is ranked\". That is a note on a result that ran; the query is still a string, well is removed as well as the and top, and only a score above 0 ranks, so nothing is listed."),

q(3, "Q14 is \"Is Ekene-5 producing water?\". What changes when the stop list is switched on?",
 "The word is drops out, and \"no\", the word the answering passages use, is a stop word too",
 ["Nothing, since every word in Q14 is a content word that the list leaves alone",
  "water and producing are removed, leaving only ekene and 5 to be matched",
  "ekene and 5 are removed, since the list drops every name and every number"],
 "With the list off Q14 keeps is, ekene, 5, producing, water; with it on it keeps ekene, 5, producing, water, so is goes. The word that answers it in the passages, \"no\", is itself a stop word, so with the list on no passage could match it. water and producing survive, and the list removes common words, never names or numbers as such."),

q(1, "EKD-001 has 56 tokens with the stop list off. What is its length for BM25 with the list on?",
 "33, since the length is the token count after the stop list",
 ["56, since a passage's length is fixed when it is read and the stop list touches only the query",
  "0, since BM25 drops length once the list is on",
  "38.316667, the corpus mean length"],
 "A passage's length for BM25 is its token count after the stop list, so EKD-001 is 56 with the list off and 33 with it on. When the list is on it applies to the passages, the query and every length at once. BM25 still uses those lengths, so none of them drops to 0. 38.316667 is the corpus mean length with the list off, avgdl, and each passage keeps its own length."),

q(0, "What do the corpus vocabulary and the mean passage length become with the stop list on?",
 "505 tokens and 27.483333, against 574 and 38.316667 with it off",
 ["574 tokens and 38.316667 again, since the list changes queries and leaves passages alone",
  "318 tokens and 27.483333, since the vocabulary shrinks to the size of the stop list itself",
  "505 tokens and 38.316667"],
 "The engine counts 505 tokens of vocabulary and a mean length of 27.483333 with the list on, against 574 and 38.316667 with it off. The list applies to passages as well as queries, so the lengths fall with it. 318 is the number of words on the stop list, which is a different quantity."),

q(2, "A call passes the word \"yes\" as the stop list switch. What does the engine return?",
 "A refusal naming `stopWords`: \"stopWords must be true or false\"",
 ["The list switched on, reading the word as yes",
  "Tokens with the list off and a note saying the switch was not understood",
  "A refusal naming `text`"],
 "The switch takes true or false and nothing else. The engine's own words are \"stopWords must be true or false\", and the refusal names `stopWords`. It never guesses a meaning for a word, never runs with a note in place of the refusal, and names the switch itself as the field."),

q(3, "A passage of 20001 characters is handed to `tokenize`. What is the engine's message?",
 "text has 20001 characters, above the 20000 this engine accepts",
 ["the passage is cut at 20000 characters and the tokens of the kept part are returned",
  "documents has 5001 entries, above the 5000 this engine accepts",
  "text must be a string of 20000 characters exactly, padded if shorter"],
 "The most characters in one text is 20000, and one above is refused naming `text` in the engine's words \"text has 20001 characters, above the 20000 this engine accepts\". The engine never truncates silently. \"documents has 5001 entries, above the 5000 this engine accepts\" is the refusal for too many documents, a different limit, and a shorter text is accepted as it is."),

q(1, "How does the tokeniser treat `oil_rate and water/cut`, with the stop list off and then on?",
 "oil rate and water cut, 5 tokens; with the list on, and is removed",
 ["oil_rate and water/cut, 3 tokens, since the underscore and the slash join words",
  "oil rate water cut, 4 tokens either way",
  "oilrate and watercut, 3 tokens, with each joiner deleted and the halves merged"],
 "An underscore and a slash are outside [a-z0-9], so both separate: oil rate and water cut, 5 tokens. With the list on, and is removed, leaving oil rate water cut. With the list off every token is kept, and a separator never merges the pieces on either side."),

q(0, "The hand set passage d3 reads \"Oil and water rates were tested; the oil rate was 150 bopd.\" What are its counts of oil and of rate?",
 "oil 2 and rate 1, with rates a different token",
 ["Two of each, since rates is counted with rate as the same word",
  "oil 1 and rate 1, since a word that appears twice in one passage is counted once",
  "oil 2 and rate 0, as the stop list removes rate from every passage"],
 "d3 has 12 tokens: oil appears twice and rate once, and rates is its own token because nothing is stemmed. A repeated token counts every time it appears in a passage, and rate is no stop word; the list is off in any case."),

emit(Q, '/root/dai-wip-appliedai/banks/d5b_m02.json', expect_n=15)
finish()
