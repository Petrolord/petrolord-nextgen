import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H2 Expert m03, How Strong Is Each Equation.
# Figures from digest Section 2 (evidence classes and counts), Section 3 and
# Section 5 (the printed and exact coefficients, the two tables), Section 18
# (the worked example and the band summaries), Section 19 (the heat stress
# errata) and Section 23. Every RAL or NIOSH heat REL figure carries the
# section 8.1 label and none is keyed as something to compute.

q(3, "The golden behind this course carries 441 cases, of which 69 are checked against the oracle only. What does oracle only mean for one of those 69?",
 "Its expected value comes from the independent oracle alone, with no printed value known to set against it",
 ["It is a printed value the engine misses, pinned so that an engine matching the source would fail",
  "It is a case the engine refuses, carried with the field it names and the message in its own words",
  "It is a case whose constants were typed from the same page as the engine's, so the pair can share a slip unseen"],
 "The golden counts 372 cases against a value a source prints and 69 against the oracle only: the engine and an independent oracle agree, and nothing printed stands against either. A printed value the engine must miss is an erratum, and there are 5 of those. Refusals are counted separately, 57 of them. Constants copied twice from one page is the TRANSCRIPTION ONLY class, which is weaker still.")

q(1, "The golden holds 0 published cases and 4 oracle-only cases for `briefScalaWeeklyRf`. Which evidence class does the door carry?",
 "ORACLE ONLY: the engine and the oracle agree, and no printed value stands against either",
 ["PUBLISHED, REPRODUCED: the BC regulation prints its factors at 10, 12, 16 and 20 hours of work",
  "TRANSCRIPTION ONLY: the weekly constants 40, 168 and 128 were copied twice from one NIOSH page",
  "ARITHMETIC BY DEFINITION: the weekly factor is a time weighted average over the hours of a week"],
 "No value a source prints reproduces the weekly factor, so it is ORACLE ONLY, and the course keeps it out of grading on its own. The BC factors are DAILY factors and they reproduce `briefScalaDailyRf`. The weekly formula is Brief and Scala's and owes nothing to a NIOSH page, and it is a ratio of hours with fixed constants, so there is more in it than a window.")

q(0, "What separates the TRANSCRIPTION ONLY class from the ORACLE ONLY class?",
 "Under TRANSCRIPTION ONLY the engine and the oracle each copied the constants from one page, so a shared misreading passes",
 ["Under TRANSCRIPTION ONLY the golden holds more oracle-only cases, since the door was harder to check against a source",
  "Under ORACLE ONLY the oracle was typed from the engine's source code, so it repeats any mistake the engine makes",
  "Under ORACLE ONLY a printed value exists but sits outside the engine's printed tolerance, like the five errata"],
 "Both classes lack a printed value the engine reproduces. The difference is where the constants came from: under TRANSCRIPTION ONLY both files read them off the same page, and the engine's provenance record states that a planted shared error left the suite green. ORACLE ONLY is an independent agreement. The case counts do not define a class, the oracle is independent of the engine by construction, and a printed value the engine misses is an erratum.")

q(2, "`lexWeeklyDbA` is PUBLISHED, REPRODUCED on the strength of 1 case, five equal days at 85 dBA giving 85. What does that class name leave unsaid?",
 "That any averaging of five equal numbers reproduces that case, so its divisor of 5 is oracle only",
 ["That the case proves energy averaging over the arithmetic mean, since five equal days separate the two methods",
  "That the divisor of 5 is proven by the case, while the energy averaging behind it is oracle only on this door",
  "Nothing, since a single printed case reproduced at printed precision covers every part of the door it tests"],
 "A class names the strongest thing known about a door. Five equal days give 85 under an energy average, an arithmetic mean or any other average, so the case cannot tell them apart; the energy averaging rests instead on L108 Figure 26 through the daily LEX. No printed case with other than five days is known, so the divisor of judgement J10 is oracle only.")

q(2, "NIOSH Table 1-2 rejects the exact coefficient in 49 of its 83 rows, while OSHA Table A-1 rejects it in 0 of 150. Why can the NIOSH table tell its two coefficients apart?",
 "Its printed 10.0 sits 0.034215715338 dB above the exact one, and at large noise doses the gap outgrows half the table's printed decimal",
 ["Table 1-2 prints two decimals where Table A-1 prints one, so it resolves a smaller difference between the coefficients",
  "Table 1-2 truncates its rows where Table A-1 rounds them, and truncation shows up any change in the coefficient",
  "Table 1-2 carries 83 rows against 150, and fewer rows give each row more weight in deciding which coefficient fits"],
 "The TWA difference between two coefficients is their gap times log10 of the noise dose ratio. NIOSH's gap of 0.034215715338 dB, multiplied at noise doses of a few thousand percent and above, passes half of the table's printed 0.1. OSHA's gap is 0.000359525563 dB and never gets near it. Both tables print one decimal, truncation is a Table 1-1 habit, and a row count gives no row more weight.")

q(0, "If Table A-1 cannot tell 16.61 from 16.609640474437, what makes 16.61 the coefficient this course grades the OSHA TWA on?",
 "The regulation's own words: mandatory Appendix A prints 16.61 in its formula, a decision the course records",
 ["The 150 rows of Table A-1, since each is reproduced to its printed decimal with 16.61 by the engine",
  "Table G-16a, whose reference durations follow 16.61 where they would fail with the exact coefficient",
  "Nothing: the engine uses 16.609640474437 and labels it 16.61, since the two agree to four significant figures"],
 "0 of Table A-1's 150 rows reject the exact coefficient, so the table reproduces 16.61 without proving it. What fixes it is the regulation's own words, and the engine uses the coefficient the regulation writes. Table G-16a is built from the 5 dB decibel exchange rate and never uses a TWA coefficient. The engine measures 16.610000000000, the printed value.")

q(1, "At 348.900000 W the section 8.1 equation gives a NIOSH heat REL of 27.458939 C and the section 1.1.3 worked example prints 27.800000 C, both NIOSH 2016-106 values, the first checked for transcription only. Why do they differ?",
 "The worked example read its value off Figure 8-2 instead of computing it from the section 8.1 equation",
 ["The worked example took 300 kcal/h as 300 W, so it evaluated the equation at the wrong metabolic rate for the hour",
  "The worked example used the RAL constants, since its worker had not yet been acclimatized to the work",
  "The engine rounds the equation to one decimal before comparing, which moves 27.458939 C up to the print"],
 "The golden's note says so: section 1.1.3 reads 27.8 C off Figure 8-2 at 300 kcal/h (348.9 W). A figure carries the resolution of the plot and the reader's eye, and the equation carries neither, so the two routes land in different places. The example's 300 kcal/h is that same 348.9 W, the RAL example is a separate erratum at 25 C, and the engine does not round.")

q(3, "The NIOSH heat REL example misses its equation by 0.341061 C and the RAL example by 0.952084 C, yet the RAL example sits closer to its printed tolerance. Why?",
 "The RAL example's printed tolerance is 0.500000 C against 0.050000 C, so it is 1.904167 tolerances away",
 ["The RAL is evaluated at a lower metabolic rate, so its equation is flatter and its error counts for less",
  "The RAL example is measured in minutes of work, so its difference is converted to hours before it is compared",
  "The two differences are divided by the equation values, and the RAL value is the larger of the two"],
 "Tolerances away is the difference over the printed tolerance: 0.952084 over 0.500000 is 1.904167, and 0.341061 over 0.050000 is 6.821223. Both examples are at 348.900000 W, both are in degrees C WBGT, and the comparison divides by the tolerance and never by the value. The equation values themselves are the section 8.1 equation, checked for transcription only.")

q(0, "The NIOSH document offers two routes to its heat stress limits, the section 8.1 equation and Figures 8-1 and 8-2. Which does the engine follow, and why?",
 "The equation: it is the stated criterion, reproducible at any rate, and a figure can only approximate it",
 ["The figures: they carry the document's own worked example, so they are the more tested route of the two NIOSH gives",
  "The equation at rates inside the figures and the figures outside them, where the equation is extrapolated",
  "The figures: reading a curve avoids the transcription risk that copying the constants carries"],
 "The engine evaluates the equation and the golden pins both worked example values as errata it must stay outside of. That pin tests the engine's choice; the constants 56.7, 11.5, 59.9 and 14.1 remain the section 8.1 equation, checked for transcription only. The figures stop at 116 and 580 W, so they have nothing to offer outside them, and a figure reading has a resolution problem of its own.")

q(2, "Three reasons keep every heat stress limit out of grading. Which one explains why the one-hour averages can be graded?",
 "An average's only constant is the sixty-minute window, so there is no page for two files to misread together",
 ["The averages are reproduced from values NIOSH prints, which gives them the PUBLISHED, REPRODUCED class",
  "The averages always sit inside the 116 to 580 W figure range, so no extrapolation warning can attach to them",
  "The averages are read off an instrument, and an instrument reading cannot carry a copying mistake"],
 "The three reasons: the equation constants and the WBGT weights are checked for transcription only, the worked example disagrees with its own equation, and the time weighted averages are ARITHMETIC BY DEFINITION. The third reason is the one that makes the averages safe. They have no printed case at all, a WBGT average is in degrees C and outside any watts range, and the metabolic rates in an average are estimates that no instrument reads.")

q(1, "Suppose the engine and the oracle both held a wrong NIOSH heat REL slope. What would that do to a graded answer built on the equation?",
 "Learners evaluating the equation would match a wrong key, and one using the printed slope would be marked wrong",
 ["The suite would turn red, since the oracle recomputes the slope from NIOSH's printed figure at every run of the golden",
  "The erratum pin on the worked example would catch it, since the engine would then fall inside 27.800000 C",
  "Nothing, since a slope enters the limit only at rates outside the figure range, where it is extrapolated"],
 "The engine's provenance record states that planting the same error in both files left the suite green for the NIOSH heat REL slope: a shared misreading passes every check. A graded key built on it would reward the copied error and punish the correct published value. The oracle copies constants and derives none; the erratum pin only checks that the engine stays away from 27.800000 C; and the slope enters the equation at every rate.")

q(3, "The rule that keeps heat stress limits out of grading removes three more things, each ORACLE ONLY. Which three?",
 "The NIOSH protector derating by type, the OSHA dual-protection 5 dB and the Brief and Scala weekly factor on its own",
 ["The OSHA field derating, the Appendix B subtraction of 7 dB and the Brief and Scala daily factor on its own",
  "The chemical STEL, the one-hour metabolic average and the extended-shift action level of Table IV-3",
  "The weekly LEX divisor, the exposure points pivot of 85 dBA and the EU exposure action values"],
 "The course names exactly these: NIOSH derating by type, dual protection and the weekly factor, all oracle only with no printed value to set against them. The field derating and Appendix B are reproduced by the OSHA Technical Manual example, and the daily factor by the BC regulation. The STEL and metabolic average are arithmetic by definition and the action level is published. The weekly LEX divisor is oracle only too but it is not on that list, and the EU values are exported constants.")

q(0, "At 233.000000 W the NIOSH heat REL equation gives 29.475407 C, the NIOSH 2016-106 section 8.1 equation, checked for transcription only, and Table 5-1 prints a band of 30.000000 C. Which route is the more permissive there?",
 "The band, which sits 0.524593 C above the equation, so an hour between the two reads under the band only",
 ["The equation, which sits 0.524593 C below the band, so it lets through WBGT hours that the band summary would stop",
  "Neither, since a band summary is the equation rounded to the nearest degree at the rate that it names",
  "The equation, since a curve at a point always allows more than a band that covers a range of work"],
 "A higher limit is more permissive. Here the band is above the equation value, so a WBGT hour lying between 29.475407 C and 30.000000 C would sit under the band and over the equation. A band is not the equation rounded: at 465.000000 W it sits below the equation, and 0.524593 C is more than a rounding to the degree would leave. Which way a band leans depends on the rate.")

q(1, "Why does the golden not gate NIOSH 2016 Table 5-1 against the engine?",
 "A band summary prints one round value for a range of work, and a band and a curve were never meant to agree at a point",
 ["Table 5-1 is licensed text, like the ACGIH tables, so its values can be neither quoted nor gated by the course",
  "Table 5-1 carries the RAL only, and the golden gates only the NIOSH heat REL equation against printed values",
  "Table 5-1 is one of the five errata, and an erratum is pinned as a miss rather than gated as a reproduction"],
 "A band differs from the equation at almost every rate inside it by construction, so comparing them at a point would test nothing. The course quotes the four bands, 30, 28, 26 and 25 C, as band summaries. Table 5-1 is a NIOSH table and quoted freely; its bands are compared here with the NIOSH heat REL equation; and it is absent from the five errata, which are specific printed values the formula refutes.")

q(2, "A site procedure quotes 28.000000 C for work at 349.000000 W. The equation at 349.000000 W gives 27.457508 C and the worked example prints 27.800000 C. What must a report using the procedure's number say?",
 "That 28.000000 C is a Table 5-1 band value, quoted as a band, since the three routes give three limits",
 ["That 28.000000 C is the NIOSH heat REL rounded to the nearest degree, so it can stand for the equation",
  "That 28.000000 C corrects the worked example's 27.800000 C, since the band table is the later and more rounded print",
  "Nothing further, since all three numbers come from NIOSH 2016-106 and carry the same evidence status"],
 "At 349.000000 W the equation, the figure reading and the band give 27.457508 C, 27.800000 C and 28.000000 C, three different limits for nearly the same work. A report states which route produced its number, and a margin taken against a band must not be reported as a margin against the NIOSH heat REL. The band is no rounding of the equation, and no route corrects another. The equation value is the section 8.1 equation, checked for transcription only, a status a band does not share.")

emit(Q, '/root/hse-wip-hygiene/banks/h2a_m03.json', expect_n=15)
finish()
