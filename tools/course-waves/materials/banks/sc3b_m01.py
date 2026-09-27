import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC3 Associate m01, Materials and the Register.
# Sources: what the engine computes and declines to compute; the texts with
# their editions, licences and read date; the Ekene register and its stated
# policy; the calculator panels and the Planner; the refusals this module
# introduces; what is graded; the vocabulary. Every keyed figure and message
# was re-run through the vendored engine (materials_engine.mjs).

q(2, "When the engine will not accept an input, what does it hand back?",
 "An object carrying an error and the field it refused, with a message that starts with that field's name and states the condition that failed.",
 ["A full result in which the refused input is replaced by a figure the engine picks for itself, with a warning printed under the reason column so the learner can see which input was swapped.",
  "Figures of zero throughout, so that any calculation built on the bad input visibly adds up to nothing at all.",
  "A blank panel with a generic error code, which the learner looks up in a table printed at the end of the course."],
 "A refusal is an object with an error and a field, and its message begins with the field it names and says exactly which condition failed. The engine never substitutes a figure of its own for a refused input, it never returns a result of zeros in place of a refusal, and every message is printed in the engine's own words in the panel, with no code to look up.")

q(0, "Which four functions does the register calculator, the Associate tier's panel, call?",
 "criticality, abcClassification, eoq and slowMoving.",
 ["criticality, abcClassification, eoq and quantityDiscount.",
  "eoq, slowMoving, safetyStock and poissonStock, for the stock targets.",
  "criticality and eoq only."],
 "The register calculator calls criticality, abcClassification, eoq and slowMoving: the four questions of this tier. The price schedule and the stock targets belong to the Professional tier's stock calculator. Every view of the register calculator runs in the course itself, and the Materials & Spares Planner gives the same figures on the same inputs.")

q(3, "The course's table of sources gives each text a date it was read. What is that date?",
 "2026-09-27, the same date for every text in the table, whatever its own edition.",
 ["February 1913, the issue date of the trade magazine that printed the square-root lot size.",
  "1 October 1998, the date the reliability handbook the course quotes was issued.",
  "Fall 2006, the term in which the MIT logistics lectures were taught and published."],
 "Every text was read on 2026-09-27. February 1913 is the edition date of Harris's article, 1 October 1998 is the date of MIL-HDBK-338B and Fall 2006 is the term of the ESD.260J lectures. Each of those is an edition or a date of the text itself, which the table gives beside the date it was read.")

q(1, "C. Caplice's MIT ESD.260J Logistics Systems lectures (Fall 2006) are cited by lecture and slide, and none of their sentences appears in the course. Why?",
 "They are licensed CC BY-NC-SA 4.0, which is non-commercial, and this course is sold.",
 ["They were withdrawn by MIT in 2007, so only their slide numbers can still be checked by a reader today.",
  "Each slide is too short to quote, so the course lists slide numbers only.",
  "Their figures are all slips, so the course points at them only to show where each printed figure went wrong."],
 "The lectures are on MIT OpenCourseWare under CC BY-NC-SA 4.0. That licence is non-commercial and this course is sold, so it cites a lecture figure by lecture and slide, works it in its own panel and explains the idea in its own words. The PDFs are still published, and most of their printed figures agree with the engine at the precision printed.")

q(2, "Which texts does the course quote word for word, each with its citation?",
 "Harris's 1913 article, in its 1913 words only, and MIL-HDBK-338B (1 October 1998).",
 ["Every text in the source table, each with its edition.",
  "The ESD.260J lectures, whose slide titles the course copies as the headings of its lessons.",
  "Harris's article as typeset in the 1990 reprint, since the reprint is the copy the course read."],
 "Only public-domain texts are quoted: the 1913 words of Harris and the US Department of Defense handbook. The 1990 reprint's typesetting is copyright ORSA, so only the 1913 words are used. The lectures are cited by lecture and slide, and no slide title or slide text is reproduced.")

q(0, "Two well-known inventory textbooks are absent from the course's source table. What does the course say about them?",
 "They are not publicly readable, so they were not read and neither is cited.",
 ["They were read, and their worked examples are the goldens the engine is checked against.",
  "They are cited by chapter for every formula, as the lectures are cited by slide number.",
  "They are quoted in the Expert tier, once the learner has bought the course's reading pack."],
 "The validation record says Silver, Pyke and Thomas and Nahmias are not publicly readable, so neither was read or cited. The engine's published checks come from Harris, the MIT lectures and MIL-HDBK-338B. A text that was not read cannot be cited, by chapter or otherwise.")

q(3, "What does the EK-11 materials and spares register of the Ekene field state about itself?",
 "That it is synthetic teaching data, written by a stated script, with no real company, person, supplier or price in it.",
 ["That it is a year of real Niger Delta stores records, with the part numbers changed so that no operator or supplier can be traced.",
  "That its eighteen items were chosen by an audit firm as a fair sample of an offshore store's spend by value.",
  "That its prices are the list prices of named suppliers in 2026, converted to US$ at a stated exchange rate."],
 "The register's own label says it is SYNTHETIC teaching data for a fictional teaching field, and that no real company, person, supplier or price appears. It was written for this platform by a stated script. Its money is in US$, and every figure in it is a stated input a learner can read in the calculator's box.")

q(1, "Which ABC policy does the Ekene register state?",
 "A to 80 percent of annual usage value and B to 95 percent, with the rule at-or-below.",
 ["A to 70 percent and B to 90 percent of annual usage value, with the rule include-crossing.",
  "A to 80 percent of the items by count and B to 95 percent of them, with the rule at-or-below.",
  "None: the engine applies its own cut-offs whenever the register leaves them out of the call."],
 "The Ekene policy states A to 80 percent, B to 95 percent, at-or-below, and the cut-offs are shares of annual usage value. The engine holds no cut-off of its own: a call without cut-offs is refused by name. Other figures would be another policy, and the course quotes every ABC class with the cut-offs and rule it came from.")

q(2, "The engine exports 12 figures of its own in DEFAULTS. What are they?",
 "Its tie convention of 12 significant digits, the weight sum of 100 and how far weights may miss it, and caps on the size of a call.",
 ["A holding rate of 0.22, a rounding multiple of 10 and the Ekene bands, used for any call that leaves them unstated.",
  "The Ekene criticality weights and class minimums, kept so that a blank case always produces a class for every item.",
  "Twelve service targets, one for each month of the year, which the calculator reads when a learner types none."],
 "DEFAULTS holds the tie convention, the weight sum and its tolerance, and caps such as 5000 items in one call and 20 criteria. None of them is a cost, a weight, a cut-off or a band. Every input a figure depends on is stated by the caller, and a call without one is refused by name.")

q(3, "An EOQ call types the key holdingrate in lower case. What does the engine return?",
 "A refusal, in its own words: \"holdingrate is not an accepted key; the accepted keys at the top level are annualDemand, orderCost, holdingCostPerUnitYear, unitCost, holdingRate, rounding\".",
 ["The EOQ computed as if the holding rate were missing, with the misspelt key dropped silently and nothing said about it anywhere in the result, so the learner sees a figure and no sign that an input went unread.",
  "An EOQ on the holding rate the key was meant to be, since the engine matches keys without regard to their case.",
  "A result with a note under the reason that one key was unread, so that the learner can correct it on the next run."],
 "The engine refuses any key it does not read, at every level, naming the key, where it sits and the keys it accepts. A key dropped in silence would leave an input unstated with nobody told, and the engine does not guess what a misspelling meant.")

q(0, "A box carries a key the function does not read and also lacks a required input. Which refusal comes back?",
 "The unknown key, because every function checks its accepted keys before it reads any input.",
 ["The missing input, since a required figure matters more.",
  "Both at once, listed in the order the fields appear in the box, so they can be fixed together.",
  "Neither: the engine repairs the spelling and computes the result, and the reason notes the repair."],
 "Every function checks its accepted keys first, so the unknown key is refused before the missing input is reached. The engine returns one refusal at a time, and it repairs nothing on its own. Fix the key, run again, and the next refusal names the missing input.")

q(1, "On the Ekene policy, CSG-958 scores 42.000000, below the E minimum of 44. What does the engine return for it?",
 "A result: class D, with a reason naming the minimum it reached and the E minimum it fell short of.",
 ["A refusal naming items[10].scores, since a score that falls below a class minimum cannot be placed in any class.",
  "A refusal naming classes, since the policy leaves a gap between the E and D minimums.",
  "A result with no class and a warning, since the item lies between two stated classes."],
 "An item below a class minimum takes the next class down, with a reason: \"CSG-958: weighted score 42 is at or above 0, the minimum for class D, and below 44 for class E\". A result with a reason is a result. The last class starts at 0, so every item takes a class and there is no gap to refuse.")

q(3, "In this course, what does the word EOQ name?",
 "The unrounded square-root figure; the quantity ordered is the one the stated rounding rule gives.",
 ["The quantity on the purchase order, whatever rounding the store applied on its way there.",
  "The quantity ordered plus the stock on hand, which is what the store holds after delivery.",
  "The nearest whole number to the square-root figure, since nobody orders part of a unit."],
 "The vocabulary is binding: the EOQ is the unrounded square-root figure, 137.408584 for the Ekene baryte, and the quantity ordered is what the stated rule gives, 140.000000 rounded up to a multiple of 10. A rounding to a whole number is one stated rule among several, and it produces a quantity ordered.")

q(2, "The Ekene register carries HEAT-TRC, a \"Heat tracing controller (obsolete model)\". When does this course call an item obsolete?",
 "Only against a stated band: in the Ekene policy, 36 months or more since the last issue.",
 ["Whenever its name or the vendor says the model is out of production, whatever the store records.",
  "Once its stock would last over 24 months of usage.",
  "After twelve months with no issue, a rule the engine applies to every register."],
 "Obsolete, slow and excess are always of a stated band or a stated cover limit. HEAT-TRC is band obsolete because 40 months have passed since its last issue, at or above the band's minimum of 36. More than 24 months of cover is the Ekene excess limit, a separate measure, and no band is built into the engine.")

q(1, "What does the course say about where its practicals run and what is graded?",
 "They run in the course's own calculator panels on the same vendored engine, and each graded number is a value that engine returns on fixed inputs.",
 ["They run only in the Materials & Spares Planner, so a Suite seat is needed before a learner can attempt any exercise.",
  "They run in a spreadsheet the course supplies, and grading compares the learner's figure with the class average.",
  "They run in the panels, and the graded figures are sampled afresh for each learner so that no two answers match."],
 "The register calculator calls the same vendored engine the lessons quote, and the Planner in the Suite gives the same figures on the same inputs, so no Suite seat is needed. Every graded number is an engine return on inputs written down in advance, with exactly one right answer, and this tier samples nothing.")

emit(Q, '/root/cat-wip-materials/banks/sc3b_m01.json', expect_n=15)
finish()
