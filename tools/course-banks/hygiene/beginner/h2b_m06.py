import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H2 Associate m06, The Associate Capstone.
# Sources: digest sections 1, 5, 7, 9, 23, 24 and 25 (Associate-owned). Method only:
# no capstone site, input, condition or graded answer appears here.

q(2, "Walking a dosimeter record from download to report, which step comes first?",
 "Name the criterion, since it sets the threshold and every reference duration.",
 ["Add the contributions, since the total is what every criterion reports.",
  "Restate the TWA, since the percentage is easier to read as a level.",
  "Find the loudest period, since it decides the noise dose of the whole day on any criterion."],
 "Naming the criterion first is the habit that makes the rest mean something: it decides which periods pass the threshold and what each reference duration is. On the OBEN day, changing it alone moves the noise dose from 27.748183 to 72.054478 or 265.610944 percent. The loudest period is one term in the sum and decides nothing on its own.")

q(0, "A draft report gives the OBEN day's NIOSH figure of 265.610944 percent with the acronym unqualified and a closing verdict word. Which rewrite follows this course's rules?",
 "The noise dose on the NIOSH noise REL was 265.610944 percent, against a limit noise dose of 100 percent.",
 ["The NIOSH noise REL figure was 265.610944 percent, so the worker's noise exposure fails on that day.",
  "The NIOSH noise dose was 265.610944 percent, which is over the limit on that criterion's scale.",
  "The noise exposure was 89.242460 dBA on the NIOSH noise REL, which is over the limit and fails."],
 "Digest section 24 requires \"noise dose\", a qualified noise exposure and \"NIOSH noise REL\" written in full, and the course never grades a verdict word: a comparison names the criterion and its limit noise dose in the same sentence. The rewrite ending in \"fails\" still closes on a bare verdict, and the one saying \"NIOSH noise dose\" names only the agency, which leaves open which NIOSH limit is meant. The one in dBA swaps the noise dose for its TWA and keeps the verdict.")

q(3, "The same three letters name two different NIOSH limits in this course. How must each be written?",
 "As \"NIOSH noise REL\" or \"NIOSH heat REL\", every time.",
 ["As the bare acronym, once the tier makes plain which is meant.",
  "As the agency and acronym alone, since NIOSH publishes both.",
  "With the qualifier on first use only, and bare after that."],
 "Digest section 24 legislates it: the NIOSH recommended exposure limit for noise in this tier and the NIOSH recommended exposure limit for heat stress in the Expert tier share an acronym, so the qualifier goes in every time. Naming the agency alone leaves the limit ambiguous, which is the whole problem, and a reader may open any page without the first use in view.")

q(1, "Why does this course write \"decibel exchange rate\" in full?",
 "Because the Economics courses use \"exchange rate\" for currency.",
 ["Because OSHA's text defines it only under that full name in Appendix A.",
  "Because a bare rate could be read as a sampling frequency on the instrument.",
  "Because the engine refuses the field name `exchangeRateDb`."],
 "Digest section 24, rule 4: the words already mean a currency rate in the Economics courses, so this course always writes \"decibel exchange rate\" or \"an exchange rate of 5 dB\". It is a rule about readers arriving from other courses. `exchangeRateDb` is a valid engine field, refused only when it is not a finite number of dB above zero.")

q(0, "Why does this course call a reading from a sound level meter a sound level?",
 "Other courses use noise for scatter in data, so the word is kept for noise exposure.",
 ["OSHA's Appendix A has no other word for a reading taken by an instrument.",
  "The engine refuses any input field whose name refers to noise directly.",
  "A sound level is a percentage of an allowance, while a reading is in dBA."],
 "Digest section 24, rule 3: noise already means scatter in data in the Decline Curve Analysis, Well Test and Seismolord courses, so a reading is a sound level and noise exposure is kept for a noise dose. It is a rule about readers arriving from other courses. A sound level is in dBA; the percentage of an allowance is the noise dose.")

q(3, "The capstone TWAs are graded on which coefficient, and why?",
 "The printed ones, 16.61 and 10.0, as judgement J1 has each preset use.",
 ["The exact ones, since a graded answer must use the most precise values.",
  "Either, since the two land within the grading tolerance on both scales.",
  "The exact one on NIOSH and the printed one on OSHA, where tables agree."],
 "The TWAs are graded on the coefficient each source prints: 16.61 on OSHA, as the mandatory Appendix A text writes it, and 10.0 on NIOSH. A TWA worked with the exact coefficient will disagree, and on NIOSH the gap can reach the second decimal, far outside a graded answer. That is judgement J1, the same rule the engine's presets follow.")

q(2, "Working a capstone record by hand, when should a figure be rounded to the printed six decimals?",
 "Only at the end, after full precision through every step.",
 ["At each step, so that every figure matches the digest.",
  "Only the reference durations, which print to one decimal.",
  "Never; the answer is graded at twelve decimals throughout."],
 "The capstone brief says to carry full precision through each step and round only at the end, because a rounded reference duration carried into a sum moves the last printed digit. Rounding at every step is exactly how a correct method loses the sixth decimal. The published tables print a decimal or two, and the course itself prints six.")

q(1, "Why can judgement J2, the inclusive threshold, never decide a graded capstone answer?",
 "Because no capstone input sits exactly on a threshold.",
 ["Because the capstone only uses the OSHA PEL criterion.",
  "Because the capstone rounds every level to whole decibels.",
  "Because J2 applies only to NIOSH and never to OSHA."],
 "Digest section 23: the judgement calls are taught by name and never tested at their boundary, and no capstone input sits on a threshold. The rule still matters for real records, which do put periods on the line. J2 holds for every criterion, and the capstone names several criteria, one per field.")

q(0, "Which of these is never graded in this course, in any tier?",
 "A verdict word such as exceeds or passes, standing for the number.",
 ["The TWA of a noise dose on a named criterion, worked from its printed formula.",
  "The noise dose of a record on the OSHA action level, in percent.",
  "The minutes left at a stated level on the OSHA PEL, from a record."],
 "Digest section 23 lists any verdict word, exceeds, passes or at or above an action value, among the things never graded, because a verdict means nothing without its criterion and the same record gives different verdicts on different criteria. The other three are exactly the kind of number the Associate tier grades.")

q(3, "A site manager asks for the OBEN worker's ACGIH noise limit to set beside the figures. What does this course do?",
 "It never quotes one, since ACGIH values are licensed and every limit is an input.",
 ["It quotes the ACGIH value from the engine's own table of licensed limits.",
  "It uses the NIOSH noise REL, since ACGIH and NIOSH publish the same values.",
  "It asks the engine for the preset 'ACGIH', which returns the licensed limit."],
 "Digest section 25: ACGIH TLVs, ISO 9612 and ISO 7243 text are licensed and never quoted, the engine embeds no limit table, and every limit is typed as an input from a public OSHA or NIOSH value. Asking for the preset 'ACGIH' is refused on `criterion`. Claiming two bodies publish the same value is itself a licensed claim this course does not make.")

q(2, "A question about the same day asks for the incident rate of the crew. Which course owns it?",
 "Safety Performance Statistics, the first course of this module.",
 ["This course's Professional tier, in its chapter on hearing protection.",
  "Risk, Change and Learning, which owns the 5x5 risk matrix.",
  "Gas Processing, which owns BTEX as an emission from a glycol unit."],
 "Digest section 25 cites the seams: incident and injury rates belong to Safety Performance Statistics (safetystats), the first course of this module. Risk, Change and Learning owns the risk matrix and Gas Processing owns BTEX as an emission, each a different question. The Professional tier of this course teaches protectors and chemical averages.")

q(1, "The Professional tier's LEX,8h looks like a TWA. Why should it never be set beside an Associate TWA as the same quantity?",
 "It is an energy average with no threshold, a different quantity.",
 ["It is measured in percent, while the TWA is always in dBA.",
  "It uses a 5 dB decibel exchange rate, and the TWA always uses 3 dB instead.",
  "It is the same quantity, only rounded to one decimal place."],
 "This tier's closing lesson says it: the LEX,8h is an energy average with no threshold, so a figure from that tier is a different quantity from a noise dose restated as a TWA against a criterion with a threshold. Both are levels in dBA. The OSHA TWA carries a 5 dB decibel exchange rate and the NIOSH one 3 dB, so no single rate separates them.")

q(0, "A question asks for an octave-band protector estimate or an ISO 9612 uncertainty budget. What is the honest answer from this engine?",
 "It has no door for either, so this engine does not compute them.",
 ["It computes both through `hearingProtectorEstimate` with a method name.",
  "It computes them after the noise dose, from the day's contributions.",
  "It computes them only on the NIOSH noise REL."],
 "Digest section 1 lists what the engine does not provide and says so by having no door: spectral (octave-band) protector methods, ISO 9612 uncertainty budgets, ISO 7243 adjustments and any licensed limit table. `hearingProtectorEstimate` takes a named method from a fixed list, and none of them is spectral.")

q(3, "A reading taken on the C-weighting is typed into a report. How should it be written?",
 "In dBC, since it is a different weighting from dBA.",
 ["In dBA, since every level in this course is written that way.",
  "In dBA after adding 7 dB, the Appendix B A-weighted step.",
  "As a noise dose, since the weighting drops out in percent."],
 "Digest section 25: levels are in dBA unless a row says dBC, and a level read in dBC is a different weighting that must never be written as dBA. Adding a fixed step to turn one weighting into the other is no conversion this tier teaches, and a noise dose is built from A-weighted levels.")

q(2, "A report of the OBEN day on the OSHA PEL lists each period's contribution. What does that list let a reader see that the total alone cannot?",
 "That the 94.600000 dBA period carries more than the 99.100000 dBA one.",
 ["That the day's noise dose would pass on every criterion it was read on.",
  "That the TWA was computed with the exact coefficient throughout.",
  "That every period on the record was above the 90 dBA PEL threshold."],
 "Listing contributions shows where the percentage came from: 18.921153 percent from the 94.600000 dBA period and 8.827030 percent from the louder 99.100000 dBA one. A reader can check the arithmetic in a minute. Four of the six periods sit below the PEL threshold, and the same day is over two other criteria.")

emit(Q, '/root/hse-wip-hygiene/banks/h2b_m06.json', expect_n=15)
finish()
