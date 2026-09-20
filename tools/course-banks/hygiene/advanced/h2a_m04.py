import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H2 Expert m04, Errata in the Standards.
# Figures from digest Section 19 (the five errata, the golden's notes, the
# neighbours, truncation and rounding), Section 4 (Tables G-16a and 1-1),
# Section 5 (Tables A-1 and 1-2) and Section 11 (Figure 26). These are the
# SOURCES' printed values, current and permanent; nothing here describes the
# engine's past.

q(2, "NIOSH Table 1-2 prints a noise dose of 50000 percent as a TWA of 102.0 dBA, where its own formula gives 111.989700 dBA. What does the golden record the printed row as?",
 "A transposed digit for 112.0, the value the formula rounds to",
 ["A row computed with the exact coefficient 9.965784284662 in place of the printed 10.0, which shifts high noise doses",
  "A truncation of the formula value",
  "A row set against the OSHA criterion by mistake, since 90 dBA and 5 dB give lower TWAs at high noise doses"],
 "The golden's note reads: formula gives 111.99, printed 102.0 (a transposed digit for 112.0). The two share their digits in a different order, the signature of a keyboard slip. The exact coefficient moves a TWA by tenths of a decibel at these noise doses, never by ten. Truncation drops a fraction below one printed unit. No OSHA row prints a noise dose this large.")

q(0, "Which check shows that 102.0 dBA at 50000 percent is a slip in Table 1-2 and no fault in the formula?",
 "Its neighbours at 45000 and 60000 percent reproduce the formula, and the formula only rises",
 ["The row lies outside the table's printed tolerance of 0.050000, which alone makes it a slip",
  "The formula uses the printed 10.0, so any printed row that disagrees with the formula must be the one at fault",
  "The row is the only one above 100 dBA in Table 1-2, outside the formula's fitted range"],
 "The 45000 percent row agrees with its formula value of 111.532125 dBA and the 60000 percent row prints 112.800000 against 112.781513, so a printed TWA that drops to 102.0 between them as the noise dose rises is impossible for a formula that only rises. Being outside tolerance says the two disagree without saying which is wrong. Authority alone diagnoses nothing: the formula wins here because the neighbours confirm it. Table 1-2 prints many rows above 100 dBA.")

q(1, "An engine that copied the 102.0 dBA row of Table 1-2 would report that noise dose how far from the formula?",
 "Nearly ten decibels low, which understates the noise exposure by a factor of about ten in energy",
 ["Nearly ten decibels high, which overstates the noise exposure by a factor of about ten in energy",
  "Within the table's 0.050000 printed tolerance, so the noise exposure it reports would be unchanged",
  "Two decibels low, the difference between the leading digits of 102.0 and of 112.0 on the table"],
 "The formula gives 111.989700 dBA and the printed row 102.0, so the copy sits 9.989700 dB below, 199.794001 tolerances away. Ten decibels is a factor of ten in energy, and the copy errs on the low side, so it would understate the noise exposure. The miss is about two hundred tolerances wide, far outside one, and comparing leading digits is not how a TWA difference is read.")

q(3, "NIOSH Table 1-1 prints 18 min 59 s at 99 dBA, where the formula gives 18 min 53.9 s. Why is that row an erratum and no mere rounding habit?",
 "It sits 5.071055 tolerances of one printed second off while its neighbours reproduce",
 ["Its minutes disagree with the formula, and a rounding habit only ever moves the seconds of a row",
  "Any disagreement in the seconds is an erratum, since Table 1-1 is gated to the exact printed digit",
  "Table 1-1 rounds half up, so 53.9 s prints one second on"],
 "In hours the formula gives 0.314980 and the table 0.316389, a miss of 0.001409 h against a printed tolerance of 0.000278 h, one second: 5.071055 tolerances. Rounding or truncation moves a row by at most one printed unit, and the 98 and 100 dBA rows reproduce. The minutes agree. The table is gated at one second because it truncates at some rows, and no rounding of 53.9 seconds reaches 59.")

q(0, "OSHA Table A-1 prints 90.9 dBA at 114 percent, 91.1 at 115 and 91.1 at 116. The formula gives 90.945190, 91.008191 and 91.070647 dBA. Which printed row fails?",
 "The 115 percent row: 91.008191 rounds away from 91.1, while 91.070647 rounds to it",
 ["The 116 percent row, since adjacent rows never share a tenth",
  "The 114 percent row, since 90.945190 rounds up past 90.9",
  "None, since each printed row sits within 0.1 dBA of its formula value, the resolution of a one-decimal table"],
 "A correct one-decimal rounding keeps 90.945190 at 90.9 and 91.070647 at 91.1, and takes 91.008191 below 91.1. The 115 row prints 91.1 for 91.008191, 0.091809 dB off, 1.836177 tolerances away at 0.050000. Adjacent rows can share a tenth when the formula rises less than a tenth between them; the 116 row is right. 90.945190 rounds down to 90.9. A table printing one decimal is held to half its last unit, so being within 0.1 is not enough.")

q(2, "Table A-1 cannot separate 16.61 from the exact coefficient, yet it convicts its own 115 percent row. What reconciles the two?",
 "The 115 row misses by 0.091809 dB, nearly twice the half-unit a one-decimal table holds; the coefficient gap is 0.000359525563 dB",
 ["The 115 row was computed with the exact coefficient, and the table shows that coefficient only in that row",
  "The table rounds rows below 115 percent and truncates rows above it, and the change of habit marks the row",
  "The coefficient gap and the row error are the same size, so the table can see both only where they happen to add"],
 "A table's resolving power is fixed by its printed precision: a difference well above half a unit, 0.050000 dB, shows; one far below it cannot. The row error is the first kind and the coefficient gap the second, so 0 of 150 rows reject the exact coefficient while one row fails the formula. With either coefficient the 115 row gives about 91.008 dBA. There is no change of rounding habit at 115 percent, and the two sizes differ by more than two orders of magnitude.")

q(3, "A printed row misses the source's own formula. What order does a critical reader follow before deciding the table slipped?",
 "Read the neighbours; if they match the formula, the row slipped",
 ["Correct the printed row to the formula value first, then check whether the neighbours need the same correction",
  "Widen the tolerance for that table until the row passes, since a source that prints it is the authority",
  "Drop the row from any check, since a row that disagrees with the formula says nothing about either of them"],
 "If the neighbours agree with the formula, the row between them is the slip; if they miss too, suspect the formula you are using before the table. That order keeps a reader from correcting a standard that was right. Correcting first skips the diagnosis, widening a tolerance hides a real slip, and dropping the row throws away the only check that exposed it.")

q(1, "Table G-16a prints 0.063 h at 125 dBA, where the formula gives exactly 0.0625 h. How does the golden treat that row?",
 "As ordinary printing, its fourth decimal rounded half up, well inside the row's 0.000500 h tolerance",
 ["As an erratum pinned for the engine to miss, like the Table A-1 row at 115 percent",
  "As proof that the table uses a decibel exchange rate other than 5 dB",
  "As a truncation of the fourth decimal, the Table 1-1 habit"],
 "0.0625 rounded half up to three decimals is 0.063, which is ordinary printing, and the golden gates the row at 0.000500 h. An erratum misses even that tolerance. A decibel exchange rate of 5 dB gives 8 over 2 to the power 7, exactly 0.0625, so the print says nothing about the rate. Truncation would print a figure below 0.0625, and it is Table 1-1 that truncates.")

q(0, "What tolerance does the golden hold NIOSH Table 1-1 to, and why that one?",
 "One printed second, 0.000278 h, since the table rounds most rows and truncates at 124 and 127 dBA",
 ["Half a printed second, since a table that rounds every row correctly can be held to half its last unit",
  "The 0.005000 h that Table G-16a uses for its short durations, so the two tables are gated alike",
  "No tolerance at all, since every printed digit of a NIOSH table is taken as exact by the golden"],
 "At its 124 and 127 dBA rows Table 1-1 drops the fraction of a second where it rounds elsewhere, so its own printing moves by up to one unit. Engine minus printed is 0.000143 h at 124 dBA and 0.000211 h at 127 dBA, both inside 0.000278 h. Half a second would fail the table on its own habits. Each source is gated at its own precision, and a gate demanding every digit of an inconsistent source fails on the source.")

q(1, "A reviewer objects that setting Table 1-1's tolerance at one printed second is widening a gate to hide failures. What answers the objection?",
 "The tolerance comes from the table's printed unit and its known habits, and it was set before any row was compared",
 ["The tolerance was chosen after the comparison, at the smallest value that let every row of the table pass",
  "The objection is right, and the golden should gate Table 1-1 at every printed digit whatever that costs",
  "The tolerance does not matter, since the engine is checked against the oracle and never against a table"],
 "A tolerance fixed from the source's precision before any comparison is a fact about the table; one tuned afterwards to make rows pass is the defect the reviewer fears. The 99 dBA row still fails at 5.071055 tolerances, which shows the gate still convicts real slips. A gate demanding every digit would fail on the table's own truncation, and 372 golden cases are checked against printed values.")

q(3, "HSE L108 Figure 26 prints 6:21 for 6 h 20.97 min and 2:00 for 2 h 0.57 min. How does the golden read those prints?",
 "As rounding to the minute, gated at one minute",
 ["As one erratum, since 2:00 drops 0.57 min that a correct print would have rounded up to the next minute",
  "As two errata, since neither print shows the fraction of a minute the formula gives for that task",
  "As truncation, the same habit NIOSH Table 1-1 shows, which the golden gates at one printed second"],
 "6 h 20.97 min rounds up to 6:21 and 2 h 0.57 min rounds down to 2:00; both are ordinary rounding to the printed minute, so the golden gates the figure at one minute. 0.57 of a minute rounds to 1 only under a rule of rounding up, which the figure does not follow at 6:21 either. A print in minutes cannot show a fraction of one. Truncation would have printed 6:20.")

q(2, "Of the five errata the golden pins, which sits nearest its printed tolerance?",
 "The Table A-1 row at 115 percent, 1.836177 tolerances away",
 ["The RAL worked example, at 1.904167 tolerances",
  "The Table 1-1 row at 99 dBA, 5.071055 away",
  "The Table 1-2 row at 50000 percent, 199.794001 tolerances away, since a transposed digit is the smallest kind of slip"],
 "Ranked by tolerances away the five are 1.836177, 1.904167, 5.071055, 6.821223 and 199.794001. The A-1 row is closest, with the RAL example just behind. The distance is the miss over the printed tolerance, so neither the size of the miss alone nor the size of the unit settles it, and a transposed digit sits furthest of all.")

q(2, "Why is a pin that sits close to its tolerance worth more to a gate than one that sits far away?",
 "An honest-looking edit could slip the engine inside it",
 ["A pin near its tolerance is closer to being a reproduction, so it adds to the published evidence",
  "A pin far from its tolerance can never fail, so the golden reports it as a warning and moves on",
  "A near pin tests the oracle as well as the engine, since both are checked against the printed value"],
 "A small drift in `noiseTwaFromDoseDbA` could bring the engine within 0.050000 of the printed 91.1, and the pin would go red; nothing plausible brings it near 102.0. An erratum pin is a case to miss, never evidence of reproduction. A far pin still runs and would fail on a gross edit. Pins test the engine, and the oracle agreeing says nothing about a printed value.")

q(0, "What does the erratum pin on the NIOSH heat REL worked example leave untested?",
 "Whether 56.7 and 11.5 are the numbers section 8.1 prints; they stay the section 8.1 equation, checked for transcription only",
 ["Whether the engine follows the figure reading, since a pin only checks that the engine stays within tolerance of it",
  "Whether the engine returns a finite limit at 348.900000 W, since a pin is only run on rates inside the figures",
  "Whether 27.800000 C is really printed in section 1.1.3, since a pin takes the printed value on trust from the oracle"],
 "The pin shows the engine does not follow NIOSH's figure reading: it must stay outside 0.050000 C of 27.800000 C. It cannot show that the equation's constants were copied correctly, because the example was never computed from them. A pin checks that the engine is far from the printed value, the reverse of staying within it; 348.900000 W is inside the figure range; and the printed value is the golden's own reading of the source.")

q(1, "Where do the five published errata this module studies live?",
 "In the published sources as printed today, which every reader of those pages meets",
 ["In earlier versions of the engine, which copied the printed rows before the formula was put in their place",
  "In the oracle, which was typed from the tables and so carries their slips until the engine overrules it",
  "In the capstone scenarios, as traps"],
 "This module is about the SOURCES, which print values their own formulas refute, and that is current and permanent. The engine was written for this course and merged once, so it has no earlier behaviour to describe. The oracle computes from formulas, the golden pins the printed values as misses, and no capstone input sits on an erratum.")

emit(Q, '/root/hse-wip-hygiene/banks/h2a_m04.json', expect_n=15)
finish()
