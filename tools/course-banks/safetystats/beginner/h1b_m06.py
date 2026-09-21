import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H1 Associate m06, One Report, End to End.
# Sources: digest sections 5, 7, 8, 10 and 12. Every figure is printed there.

# target rank 2
q(1, "Why does this tier's report start by reproducing the BLS worked example through the engine?",
 "It shows the tool gets a public, fully stated answer right: 3.500000 against a published 3.5.",
 ["It sets the benchmark that every site in the report is then measured against as the target to beat each year.",
  "The BLS figure supplies the base the engine would otherwise have to guess for the rest of the pack.",
  "It is the only case where the engine's formula can be checked."],
 "If the engine could not reproduce 3.5 from 7 cases in 400000 hours, nothing else it printed would be worth reading, so the report checks the tool against a published answer first. The engine carries no benchmark rates and never guesses a base, and the IOGP goldens are further published checks."),

# target rank 0
q(2, "Which report line about ABC Company states its recordable and DART results completely enough for a reader to check with a calculator?",
 "7 recordable cases in 400000 hours, a TRIR of 3.500000 per 200,000 hours, and 3 DART cases, a DART rate of 1.500000 on the same base.",
 ["A TRIR of 3.500000 and a DART rate of 1.500000, both in line with the BLS worked example.",
  "A TRIR of 3.5 and a DART rate of 1.5 per 400000 hours worked in the year.",
  "7 recordables and 3 DART cases in the year, rated at 3.5 and 1.5."],
 "A report line says what the number is, what it was built from and on what base, so every figure can be checked. Leaving out the base leaves 3.500000 open to be read on the IOGP base; quoting per 400000 hours confuses the hours worked with the base; and the counts without their hours cannot be divided by anyone."),

# target rank 1
q(0, "The engine prints 3.500000 where the BLS prints 3.5. How should a report treat the two?",
 "As the same number at different precisions: quote the engine figure, and the published one beside it labelled as published.",
 ["As a disagreement in the sixth decimal that the report must explain before any other figure can be trusted.",
  "As two different rates, since the engine's version includes a correction the BLS does not apply to its figure.",
  "Quote 3.5 only, since the published figure is the authority and the engine's extra digits add nothing a reader could use at all."],
 "3.500000 and 3.5 are the same value; the golden case reports a relative difference of 0. The course quotes engine figures to six decimals so a learner can see agreement to the last digit and a copied figure is never a rounded version of what the engine printed. Nothing in the engine corrects the BLS."),

# target rank 3
q(3, "IOGP published a FAR of 0.82 for 2023, from 27 fatalities in 3291382000 hours. What does the engine return?",
 "0.820324, which rounds to 0.82.",
 ["0.769438, the rate the engine gives for the fatalities in the most recent year IOGP has published so far.",
  "0.820324 on the base the caller names, since the FAR function takes its base from the call like every other rate.",
  "0.826095, the five year figure that sits behind the published yearly value for 2023 in the IOGP report."],
 "27 x 100,000,000 / 3291382000 is 0.820324, and rounded to two decimals it matches the published 0.82. 0.769438 is the 2024 FAR and 0.826095 the five year figure. The FAR function takes no base at all; its base is fixed at 100,000,000."),

# target rank 1
q(1, "Your report pack computes the 2024 FAR twice, once with `fatalAccidentRate` and once with `incidenceRate` on a base of 100,000,000. Both read 0.769438. What does that check buy?",
 "Confidence the inputs were typed the same: fed the same numbers the two must agree, so a mismatch means a mistyped input.",
 ["Confidence the FAR is right in the sense of the population it describes, since two independent methods agree on the same figure.",
  "Nothing, since the two functions share one line of code and must return the same figure whatever is typed.",
  "Proof that 32 is the right count."],
 "The fixed base function and the general function, fed the same numbers, must agree, so the check catches a mistyped count or hours. It says nothing about whether 32 fatalities was the right count or about the workforces inside the figure; the engine checks arithmetic and never classification."),

# target rank 2
q(0, "The engine reproduces IOGP's published 0.77 for 2024. What does that reproduction prove, and what does it not?",
 "That the engine's formula is the one IOGP used; the figure does not become a target, and nothing is said about any company in it.",
 ["That 0.769438 is the rate a well run company should aim to beat, since it is the published industry figure for the year 2024.",
  "That every IOGP member reported its fatalities correctly, because the engine rejects any count that fails one of its classification checks.",
  "That the IOGP figure is exact to six decimals."],
 "The engine carries no benchmark rates of its own; the IOGP figures are published inputs in the golden. Landing on the printed rate from the count and hours shows the formula matches. It cannot check anyone's classification, and IOGP prints two decimals, so the engine's six are its own arithmetic on those inputs."),

# target rank 0
q(2, "Which three keys appear in the basis block of every rate function this tier uses, and what question do they answer together?",
 "`base`, `baseLabel` and `formula`, which together answer the first thing a reader should ask of a rate: per what, and built how?",
 ["`base`, `standard` and `note`, which name the reporting body behind every rate.",
  "`count`, `exposureHours` and `formula`, so the division can be repeated.",
  "`base`, `baseLabel` and `windowPeriods`, which date the rate."],
 "Every basis block in this tier carries base, baseLabel and formula. `standard` appears only on the FAR and the PSE rate, `note` only on the severity rate and the pooled and rolling rates, and `windowPeriods` only on the rolling rate. The pooled count and hours are returned beside the rate, outside the basis block."),

# target rank 3
q(3, "Two of the six functions this tier uses carry a `standard` key in their basis block. Which two, and why those?",
 "The FAR and the PSE rate, the two with an outside definition.",
 ["The severity rate and the pooled rate, the two whose results a reader is most likely to misread without help.",
  "The incidence rate and the FAR, since both can be computed on the 100,000,000 hour base and need the name.",
  "The rolling rate and the pooled rate, since IOGP's five year rule is a published standard for both of them."],
 "The FAR's standard reads IOGP safety performance indicators, FAR, and the PSE rate's reads API RP 754, API Guide to Reporting Process Safety Events section 3.3. `incidenceRate` has no standard line, because it cannot know what its count means. The severity rate and the pooled and rolling rates carry a `note` instead."),

# target rank 1
q(0, "The `note` key appears on the severity rate, the pooled rate and the rolling rate results. What do those three notes have in common?",
 "Each warns of the misreading a reader is most likely to make: no time charges, and the mean of rates is not the pooled figure.",
 ["Each names the published standard the figure was taken from, so that a reader can trace the definition back to its original source.",
  "Each records the base the caller chose, since those are the three functions where a base is optional.",
  "Each flags that the result was rounded."],
 "The severity rate's note says no ANSI Z16.1 time charges are added; the pooled rate's says the mean of the period rates is not the pooled rate; the rolling rate's says the mean is for comparison only and leaves out periods with no hours. A standard lives in `standard`, the base in `base`, and none of the three bases is optional."),

# target rank 2
q(1, "UGHELLI's severity rate is recomputed on the IOGP base: 96 days in 2318640 hours now read 41.403581. Which keys of the basis block changed?",
 "`base` and `baseLabel`; the formula and the note on time charges stay the same.",
 ["All four keys, since a new base means a new convention for the severity rate, with its own formula and note.",
  "Only the rate itself; the basis block describes the function and never the call.",
  "`formula` and `note`, since the IOGP base adds ANSI Z16.1 time charges."],
 "The block now reads base 1000000 and the label per 1,000,000 hours (IOGP); the formula is still daysLost x base / exposureHours and the note still says no time charges are added. The basis block describes the call, including the base chosen, and the engine adds time charges on no base at all."),

# target rank 0
q(2, "The capstone's rolling twelve month field names the month its window ends. What does working it take, by this tier's rule?",
 "Add that window's counts and hours and divide once: a month with no hours adds nothing, and a short month counts for its own hours.",
 ["Average the twelve monthly rates in the window, leaving out any month with no hours.",
  "Take the rate of the month named, as the latest month.",
  "Pool the whole series, since every window agrees."],
 "The rolling field grades one sum then divide per window, the rule AKASO's window 1 shows at 1.208038. Averaging the monthly rates gives the mean of rates, which for AKASO reads 2.026485. One month's rate is a monthly rate, and windows over different months read different rates, 1.208038 to 1.306019 on AKASO."),

# target rank 1
q(0, "A draft of an Associate report adds how sure anyone can be of each rate. How does the capstone brief treat that addition?",
 "As answering a question nobody asked: this tier states the rate correctly and completely, and how sure it is belongs to the next tier.",
 ["As required, since a rate on its own is incomplete at every tier and the capstone grades the rate together with its spread in every field.",
  "As optional extra credit, which the capstone grades whenever it is supplied beside the rate and simply ignores whenever it is left out.",
  "As a reason to drop the base, since how sure a rate is does not depend on the base."],
 "The capstone asks this tier's question, what is the rate, and every field is a count times a named base over hours. The brief says a capstone answer that brings in an interval or a limit has answered a question nobody asked. The base is never dropped; it is the first thing a rate needs."),

# target rank 3
q(3, "The capstone brief lists a worked twin for each field. For the lost time rate field, which twin and base apply?",
 "UGHELLI's lost time rate, 0.862575 on the IOGP base.",
 ["UGHELLI's lost time rate, 0.172515 on the OSHA base, since a lost time rate is always quoted per 200,000 hours.",
  "UGHELLI's DART rate, 1.725149 on the IOGP base, since lost time and DART are pooled in the capstone's own count.",
  "KWALE's pooled rate, 0.968312, since every capstone field is a pooled rate of the workforce in its separate parts."],
 "The brief pairs the lost time field with UGHELLI lost time, 0.862575, on the 1,000,000 base, and warns that the same count on the OSHA base is five times smaller. The DART count is a different class, and KWALE's pooled rate is the twin of the field for a workforce in parts."),

# target rank 0
q(1, "The capstone brief says most wrong answers at this tier come from two mistakes that are visible on paper before any division. Which two?",
 "The wrong base, and pooling the wrong way, which is why the brief says to write down the count, the hours and the base for each field first.",
 ["Rounding too early and quoting two decimals.",
  "Forgetting the interval and omitting a limit.",
  "Using headcount and forgetting the tier."],
 "The brief tells the learner to write down, for each field, the count, the hours and the base before computing anything, because a wrong base or a mean of rates is visible at that stage. Intervals are out of scope at this tier, and the engine has no headcount input to misuse."),

# target rank 2
q(2, "When reading any result from the engine, what order does this tier teach, and why?",
 "Read the basis block before the number: check the base, then the formula, then any note.",
 ["Read the number first, then check it against the published value, since the published value settles the base.",
  "Read the note first and skip the rest of the block, since only the note can change the meaning of the rate.",
  "Read the number and its label only."],
 "Checking the base against the base you meant, the formula against the quantity you meant, and the note for the likely misreading takes a few seconds and prevents the factor of five between OSHA TRIR and IOGP TRIR. Many results have no published value to compare against, and a note is only one of several keys."),

emit(Q, '/root/hse-wip-safetystats/banks/h1b_m06.json', expect_n=15)
finish()
