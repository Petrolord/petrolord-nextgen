import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC4 Associate m01, Offshore Supply as a System.
# Sources: what the engine computes and declines to compute; the texts with
# their editions, licences and read date; the Ekene cluster; units and the
# twelve-digit tie rule; the calculator panels, refusals and what is graded;
# the vocabulary. Every keyed figure and message was re-run through the
# vendored engine (marine_engine.mjs) on the Ekene fixture and the golden inputs.

q(2, "When the engine will not accept an input, what does the call hand back?",
 "An object carrying an error and a field, where the field names the refused input and the message begins with that name.",
 ["A full voyage plan in which the refused input is swapped for a typical figure the engine keeps, with a warning added to the reasons.",
  "Zeros in every field of the plan, so that a bad input shows up as a voyage that adds up to nothing at all.",
  "A numbered error code with no message, which the learner looks up in a table printed at the end of the course."],
 "A refusal is an object with an error and a field, and the message starts with the name of the field it refuses and states the condition that failed. The engine keeps no typical figure to swap in, it never returns zeros in place of a refusal, and every message is printed in the engine's own words, so there is no code to look up.")

q(0, "Which five functions does the engine export for the course's calculator panels to call?",
 "voyagePlan, fleetSize, fleetVariability, deckPlan and shoreBase, one function for each question.",
 ["voyagePlan, fleetSize, deckPlan, shoreBase and a scheduler that sets each departure time by the clock.",
  "Only voyagePlan and fleetSize, since the deck and the base are worked in the Suite app alone.",
  "A single planner function that takes every input at once and returns the voyage, the fleet, the deck and the base together."],
 "The exported functions are voyagePlan, fleetSize, fleetVariability, deckPlan and shoreBase, beside ACCEPTED_KEYS, ACTIVITIES and DEFAULTS. The engine plans no schedule by the clock, the deck and the base have their own panels in the course, and each question is its own function with its own inputs.")

q(3, "The course's table of sources gives each text the date it was read. What is that date?",
 "2026-09-27, the same date for every text in the table, whatever the text's own edition.",
 ["26 March 2015, the date printed on Adan and Resing's queueing lecture notes.",
  "20 June 2001, the draft date of Iversen's handbook.",
  "1 February 2024, the issue date of the Skoko et al. paper, which is the main offshore source."],
 "Every text was read on 2026-09-27. The other three dates are real, and each is an edition date of one text: 26 March 2015 for Adan and Resing, 20 June 2001 for Iversen's draft and 1 February 2024 for Skoko et al. The table gives each edition beside the date it was read.")

q(1, "Aas, Halskau and Wallace, Maritime Economics & Logistics 11(3), 302-325 (2009), is under publisher copyright. How does the course use it?",
 "By concept only: its ideas on deck cargo by area, segregated tanks and weather limits are explained in the course's own words.",
 ["It quotes the paper's sentences with credit in each lesson, because the paper carries the same CC BY 4.0 licence as Skoko et al.",
  "Cited by table: a worked fleet-sizing example from the paper, with the inputs and the vessel count that the engine checks.",
  "It pastes the paper's wording under a share-alike notice, the way the Wikipedia article on first-fit decreasing is reproduced."],
 "A publisher's text is taught by concept only, and none of its prose appears. It is not CC BY 4.0, and the course found no openly readable paper that prints a fleet-sizing example with its inputs and a vessel count. The Wikipedia article is cited by section and example, and its wording is not pasted either.")

q(1, "Skoko et al. (J. Mar. Sci. Eng. 12(2), 263, 1 February 2024) is licensed CC BY 4.0. How does the course cite it?",
 "By table, with every explanation still written in the course's own words.",
 ["By long quotation with credit, as the licence allows.",
  "By concept only, like a publisher's text.",
  "It is left out of the course, since its PSV fuel total could not be reproduced by the engine."],
 "Both CC BY 4.0 texts would allow quotation with credit, and the course still cites them by table and equation so that every explanation is its own. Concept-only use is kept for the publisher's text. The paper is cited throughout: only its printed PSV month total is set aside, because the rounded days the table prints do not reproduce it, and its AHTS row is used.")

q(3, "What does the fixture file of the Ekene cluster state about itself?",
 "That it is synthetic teaching data written by a stated script, and no real company, vessel, port, installation or contract appears in it.",
 ["That it reproduces an operating cluster in the Niger Delta, with the vessel and installation names changed so that no operator can be traced.",
  "That its distances, field hours and demand were read from the tables of Aas, Halskau and Wallace (2009) and then scaled to one week of supply.",
  "That its fuel burns and deck areas are the builder's figures for two named vessels now in service, as printed in their own data sheets."],
 "The file labels itself SYNTHETIC teaching data for the Ekene field, a fictional teaching field, given a fictional offshore cluster, and says no real company, vessel, port, installation or contract appears. A stated script wrote it. It was not scaled from any paper, and its figures are its own stated inputs.")

q(0, "The Ekene PSV is stated at 11 knots. What does the engine read that speed as, and what does it do with it?",
 "11 nautical miles an hour, and each leg's calm hours are its NM divided by 11.",
 ["11 kilometres an hour, which the engine converts to NM before any leg is divided.",
  "11 NM covered in a day of sailing, so each leg's days are its NM over 11 and its hours follow from the days.",
  "A cruising figure the engine slows as the deck fills."],
 "Speeds are in knots, nautical miles an hour, and sailing hours are the distance over the speed: the first Ekene leg of 62.000000 NM takes 5.636364 calm hours at 11 knots. The engine converts no units and reads no load into the speed; it applies the one stated speed to every leg.")

q(2, "Two figures the engine compares, a load and a capacity, differ only in their last binary digit. By the engine's stated rule, when do they count as equal?",
 "When they agree to 12 significant digits, the TIE_DIGITS the engine exports, so noise in the last binary digit cannot decide a check.",
 ["When they agree at six decimals, since six decimals is how the panel, the lessons and the course's tables print every figure the engine returns.",
  "When they agree at two decimals, the precision to which the published tables print their figures.",
  "Only when they are identical as binary doubles, bit for bit, since any looser test could hide a real overload of a constraint."],
 "Two figures tie when they agree to 12 significant digits. A capacity check passes when the twelve-digit figure of the load is at or below that of the capacity, and a count rounded up takes the ceiling of the twelve-digit figure. Six decimals is only how figures are printed: two figures printed alike are not thereby equal. Two decimals is a source's printing, and a bit-for-bit test would let decimal noise decide the answer.")

q(3, "How does the engine print a figure inside a sentence it writes, such as a reason?",
 "Money to the cent and a computed quantity to six decimals, half away from zero with trailing zeros dropped; a stated input as typed.",
 ["Every figure to six decimals with its trailing zeros kept, exactly as the numeric field beside it is printed in each of the panel's tables.",
  "Money rounded to the nearest whole unit and every quantity to two decimals, the way the published tables print theirs.",
  "Every figure in full double precision, so that the reason and the numeric field beside it always read the same, digit for digit, on every line."],
 "Inside a message the engine rounds money to the cent and a computed quantity to six decimals, half away from zero, drops trailing zeros and prints a stated input as it was given. So a reason reads 540 m2 of 600 m2 (90%) while the numeric field keeps full precision and the course quotes it as 0.900000.")

q(0, "Which figures does the engine hold as its own, with no input stating them?",
 "Only its caps and the twelve-digit tie rule in DEFAULTS; every speed, burn, capacity, fraction and price is a stated input.",
 ["A standard PSV speed of 10 knots and burns of 0.5 and 0.03 t an hour, read from Skoko et al. and applied to any vessel.",
  "A usable deck fraction of 0.75 for every vessel, which a call may override when it states a fraction of its own.",
  "The rainy-season weather factor of 1.2 on sailing and field time, applied whenever a call leaves the weather out."],
 "The only figures the engine holds are its caps and the tie rule in DEFAULTS. The 10 knots and the burns of 0.5 and 0.03 are Skoko et al.'s printed figures and enter only as stated inputs; 0.75 is the Ekene fixture's stated fraction; 1.2 is the Ekene planner's stated allowance. A call that leaves any of them out is refused by name.")

q(2, "In the voyage plan view a box states the key fuelPrice where fuelPricePerT belongs, and also leaves the vessel's speed unstated. What does the engine return?",
 "A refusal naming fuelPrice as a key it does not accept, because every function checks its accepted keys before it reads an input.",
 ["A refusal naming vessel.speedKnots, because a required input that is missing is checked before any unknown key.",
  "Two refusals together, one for each fault, listed in the order the faults appear in the box.",
  "A plan with a fuel cost of zero, since the misspelt price is ignored, and the hours left blank."],
 "The unknown key is refused first. The engine's own words are: fuelPrice is not an accepted key; the accepted keys at the top level are vessel, products, installations, route, portHours, weather, fuelPricePerT. A call returns one refusal at a time, and the engine drops no key silently, so a misspelt price is refused where it would otherwise have seemed to apply.")

q(1, "Which of these does the engine answer with a refusal?",
 "A voyage plan box that leaves the vessel's speed unstated, an input the engine needs to time the voyage.",
 ["A milk run whose deck cargo is larger than the vessel's usable deck area, so deck area is overloaded.",
  "A voyage whose deadweight load, bulk included, comes out above the vessel's stated cargo deadweight.",
  "A plan whose binding constraint sits exactly at a utilisation of 1.000000, the capacity itself."],
 "A missing speed is refused: vessel.speedKnots must be a finite number above 0; got nothing, in the engine's own words. An overloaded deck area or deadweight is a result with its reasons, planned and marked not feasible, and a load exactly at capacity is feasible. The course keeps the word refused for an input the engine would not accept.")

q(0, "What is every graded number in this course?",
 "A value the engine returns on fixed inputs written down in advance, so each graded question has exactly one right answer.",
 ["A Monte Carlo estimate on a stated seed and draw count, graded within a band wide enough to cover the spread between machines.",
  "A figure read from a published table and rounded to two decimals, so it matches what the source prints.",
  "A planner's judgement on a written case, marked by a tutor against the course's checklist for checking a voyage plan before it sails."],
 "Every graded number is a return value of the engine on fixed inputs, so the same inputs give the same number on any machine. No graded figure is a Monte Carlo draw, none is a source's printed figure, and none is a judgement: each is quoted to six decimals as the panel prints it.")

q(3, "Which statement about the Marine Logistics Planner, the Suite app for this course, is true?",
 "It runs the same engine file as the course, and every practical also runs in the course's own panels.",
 ["A learner has to open it to finish each exercise, because the course panels only display the figures it sends them.",
  "It runs its own copy of the engine, tuned separately, so its figures can differ from the course's in the sixth decimal.",
  "It is where the capstone is graded, since the course's calculator panels cannot read a capstone case file at all."],
 "The planner, in the Suite's Midstream & Downstream module, runs the same engine file on the same Ekene fixture. The course's four calculator panels call the vendored engine on the learner's own inputs, so a learner without a Suite seat can work every exercise, and the Associate capstone is worked in the voyage and fleet calculator.")

q(2, "The course gives the word voyage a narrow meaning of its own. Which meaning?",
 "One sailing from the base and back: a milk run through all of its stops counts as one voyage.",
 ["Any leg between two points of the route, so a milk run with four stops is made of five voyages.",
  "Each call at an installation, so a milk run through four installations counts as four voyages.",
  "All the sailing one vessel does in a week, however many times it returns to the base in that week."],
 "The course legislates the word: a voyage is one sailing from the base and back. A leg is one stated distance inside a voyage, a call at an installation is a stop on it, and a week's sailing is several voyages, which the Professional tier counts.")

emit(Q, '/root/cat-wip-marine/banks/sc4b_m01.json', expect_n=15)
finish()
