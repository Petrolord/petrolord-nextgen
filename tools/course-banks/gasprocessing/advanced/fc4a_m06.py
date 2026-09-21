import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC4 Expert m06, The Expert Reading. Digest section 16 for l01, the worked
# chain over the teaching stream for l02, and sections 14 and 16 for l03.
# 15 questions.

q(2, "Of the six things this course teaches as limits, one is held for literature and the other five are declared. Which is the held one?",
 "The real-gas departure of the saturated water content.",
 ["The water overhead the reboiler pays for, at 1100.000000 Btu a lb.",
  "The water density the amine gallons chain divides by, at 8.340000 lb a gallon.",
  "The BTEX absorbed fraction and the single molecular weight it is multiplied by."],
 "Nothing in this package stands behind a figure for the departure, and the engine warns above 1000.000000 psia that the correction reaches tens of percent. The other five are customary or chart values the module exports under their own names.")

q(0, "Why does every graded water content in this course sit below 1000.000000 psia?",
 "Above that pressure the answer carries the ideal-mixing warning and a chart reading is the design number.",
 ["Above that pressure the Magnus fit is extrapolated beyond the band its coefficients were published over, and the engine says so.",
  "Above that pressure the engine refuses the water answer by name, so there would be nothing to grade.",
  "Above that pressure the water content stops being an intensive property, because the compressibility enters the mole fraction."],
 "The real-gas correction of the McKetta-Wehe chart grows to tens of percent there, and no figure in this package stands behind it. Grading a screening number as though it were a design number is the thing that threshold exists to prevent.")

q(3, "The glycol density of 9.300000 lb a gallon is declared. What does the course make of the fact that the module holds only one of them?",
 "Both the loop balance and the vessel sizing read it, so a reader always knows which number they are holding.",
 ["The single value makes the density derived rather than declared.",
  "The single value is what lets the published cases check it.",
  "The single value is a limit on the module, since an amine column needs a different liquid density and cannot be sized here."],
 "The module builds an amine column's own liquid density from each amine's solution gravity. What matters about the glycol figure is that there is exactly one of it.")

q(1, "The water density in the amine gallons chain is 8.340000 lb a gallon. What does the module's own comment record about it?",
 "That it sits above the measured density of water at the standard temperature, because it is the figure the amine circulation charts are drawn with.",
 ["That it is the density of the amine solution rather than of water, which is why it is higher than a reader expects.",
  "That it is derived from the solution gravity of the three amines, which is why it cannot be checked on its own.",
  "That it is the one declared constant in the module which a published case can reach, through the amine circulation."],
 "It is declared, and declaring it is what makes the choice visible rather than leaving a reader to wonder why a density of water reads high.")

q(0, "Which columns of the three amines' property set are chemistry, and which are customary practice?",
 "The molecular weights are chemistry, and the strengths, the rich limits, the duties and the solution gravities are customary practice.",
 ["The molecular weights and the solution gravities are chemistry, and the strengths, the rich limits and the duties are customary practice.",
  "The rich limits are chemistry, since corrosion sets them, and everything else in the set is customary practice.",
  "All five columns are chemistry, and what is customary is only the choice of which of the three amines to use."],
 "The whole set is declared, and no source in this package fixes any of it. Naming which column is which is what stops a customary figure being read as a measured one.")

q(2, "What is the whole purpose of the DECLARED_CONSTANTS export?",
 "To say which numbers no check in this package can reach.",
 ["To hold the values the published cases compare against, so that changing one breaks a case rather than an answer.",
  "To collect the inputs whose defaults a caller is most likely to leave alone, so that a reader can see them in one place.",
  "To separate the constants the module derives from the constants it measures, which is the distinction the course is built on."],
 "Its own comment says that pinning them is the honest best available rather than a validation. A course that presented a pinned constant as a verified one would be making exactly the claim that export exists to refuse.")

q(1, "This tier ends by asking a learner to say whether they are looking at a limit or an absence. What is the difference?",
 "A limit is a number this package holds and cannot check, and an absence is a subject this engine does not contain.",
 ["A limit is a guard that refuses an input, and an absence is a guard that warns and answers anyway.",
  "A limit is a figure the course prints without a source, and an absence is a figure the course does not print at all.",
  "A limit belongs to this engine and an absence belongs to another one, so an absence is always a course boundary."],
 "A limit becomes an answer the day a source is read against it. An absence becomes an answer only in the engine that owns it, and the two therefore call for different actions.")

q(3, "Where does the hydrate boundary itself come from, given that neither this engine nor Flow Assurance computes one?",
 "From outside both engines, with the platform computing the margin against it.",
 ["From the Fluid engine, which forms it as part of the phase envelope of the stream.",
  "From the depression correlations in Flow Assurance, which give the boundary once an inhibitor dose is chosen.",
  "From the same chart the outlet water spec is read off."],
 "Flow Assurance owns subcooling, the depression correlations and the inhibitor dose. What this engine hands over is where the cold spot is and how much free water arrives at it.")

q(0, "Nothing here models a real absorber. What does that mean for a stage count or a circulation this course produces?",
 "Turning either into steel needs a vendor, because a theoretical stage is not a tray.",
 ["Both are screening figures until the absorbed fraction is measured.",
  "Both have to be corrected for a stage efficiency, which the module carries as a declared constant with a customary default.",
  "Neither can be quoted without the rate, because a stage count and a circulation are both extensive quantities."],
 "There is no rate-based mass transfer and no approach to equilibrium anywhere in this module. The Professional tier gives a stage count and a circulation and stops there.")

q(2, "Working the cold end chain in order on the teaching stream, what has to be recorded before anything else, and why does the temperature derivative of the compressibility lead the answers?",
 "The conditions, because nothing downstream can be formed without them, and the derivative leads because it is the term the whole answer turns on.",
 ["The coefficient, because every later figure is formed from it, and the derivative leads because it is the last term the identity needs.",
  "The arrival temperature, because the water reads are taken at it, and the derivative leads because the march reports it first.",
  "The reduced pair, because the correlation is entered with it, and the derivative leads because it is the only figure the oracle checks."],
 "On the teaching stream the gravity sets the reduced pair, a reduced pressure of 1.771625 and a reduced temperature of 1.491161, and the compressibility at that state is 0.834003433. The derivative is 0.001161871583 per degR and the coefficient follows.")

q(1, "The two water reads on the teaching stream are taken at 1180.000000 psia and at 640.000000 psia. Why does the lesson say to check the warning field on each before quoting either?",
 "They do not carry the same status, because one is above the threshold the ideal-mixing warning starts at and the other is below it.",
 ["They do not carry the same precision, because the engine prints more decimals on a read that falls inside the published band.",
  "They are taken at different temperatures as well as different pressures, and the warning names the temperature it was formed at.",
  "One of the two is refused outright at the default gravity, so the warning is what tells a reader which of the two answers exists."],
 "A water content quoted without the note that came with it is a number stripped of what qualifies it.")

q(3, "A learner records a coefficient of 6.160796 and hands it across a seam. What has to be said about that figure for it to mean anything?",
 "That it is in degF per 100 psi, since the same quantity in degF per psi is the same answer at a different scale.",
 ["That it is the mean of the march rather than the value at the inlet, since only a mean can be quoted in that unit.",
  "That it was formed at the default step count, since a coefficient inherits whatever the march's step count cost it.",
  "That it carries the ideal-mixing warning, since it was formed above the pressure at which that warning starts."],
 "On the teaching stream the same figure is 0.061607962 degF per psi. Water contents, pressures, temperatures and ratios print to six decimals and counts are whole numbers.")

q(0, "The engine refuses one of the states a learner asks about. What belongs in the answer?",
 "The message and the fields beside it, because the refusal is the answer.",
 ["The nearest state the engine will answer for, since a refusal is a prompt to move the question rather than an answer in itself.",
  "A blank, with the refusal recorded separately, so that the answer carries only figures the engine produced.",
  "The figure the engine would have returned had the guard not fired, marked as being outside the band."],
 "A blank is what an empty input box also produces. Recording the message and the evidence fields is what tells a reader which of the two they are looking at.")

q(2, "Souders-Brown, the K value, the settling velocity and the mist extractor that sets it belong to another course. Which, and what does this course add?",
 "Separation and Slug Catching, and this course adds the duty of a contactor as a mass transfer column.",
 ["Flow Assurance, and what this course adds is the liquid density an amine column has to be sized against.",
  "The Fluid course, and this course adds the compressibility the gas density is formed from.",
  "Separation and Slug Catching, and this course adds the six published K rows a contactor is sized on."],
 "This course does not re-derive any of the four. The Professional tier teaches the contactor's own duty and cites that course for the equation.")

q(1, "What has to travel beside any number leaving this module?",
 "The state it was formed at, the inputs that were chosen rather than computed, and any note the engine attached to it.",
 ["The engine version it was formed on, the published case nearest to it, and the tolerance the course grades it at.",
  "The rate it was formed at, the step count the march used, and the gravity the pseudo-criticals were built from.",
  "The units it is expressed in, the precision it prints at, and the name of the export that returned it."],
 "A coefficient without its pressure and temperature, a water content without its warning, and a cooling without its step count are all the same failure, which is a conclusion passed on without the thing that qualifies it.")

emit(Q, '/root/wt-fc4-nextgen/tools/course-banks/gasprocessing/advanced/fc4a_m06.json', expect_n=15)
finish()
