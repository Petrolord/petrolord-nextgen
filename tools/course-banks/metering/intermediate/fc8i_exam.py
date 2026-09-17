import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC8 Professional tier exam, 42 questions across the six modules of the tier.
# Digest SECTIONS 17 to 24 only, at the rendering those sections print. Nothing
# here reaches the tank sections, nothing rests on the capstone, and nothing
# keyed is a regime word, a verdict word, a characteristic word, a band, a
# screening threshold or a figure that rests on the engine's own style table.

# --- m01, the choking boundary ----------------------------------------------

q(2, "Which of the three pressure drop columns on the liquid march carries the same figure on every row?",
 "The allowable drop.",
 ["The stated drop.",
  "The drop used.",
  "None of them, since all three move as the outlet pressure is taken down."],
 "It belongs to the valve and to the fluid rather than to the operating point, which is why asking for a different outlet pressure does not move it.")

q(0, "The liquid valve is asked for 171.300000 psia. What stated drop goes with that row, in psi?",
 "75.600000",
 ["106.900000",
  "46.900000",
  "136.900000"],
 "The row at 140.000000 psia carries a stated drop of 106.900000 psi and the row at 200.000000 psia carries 46.900000 psi, both in psi.")

q(1, "At which outlet pressures does the engine report choked flow on the liquid march?",
 "60.000000, 40.000000, 28.740000 and 20.000000 psia.",
 ["80.000000, 60.000000, 40.000000 and 28.740000 psia.",
  "110.000000, 80.000000, 60.000000 and 40.000000 psia.",
  "40.000000, 28.740000 and 20.000000 psia."],
 "Four of the nine rows carry the flag, and the crossing that decides which four sits at an outlet pressure of 67.679968 psia.")

q(3, "Which words open the choked flow message?",
 "`choked flow: the stated pressure drop is beyond what the valve can use, so sizing on it would undersize the valve badly`",
 ["`choked flow: the stated pressure drop is beyond what the valve can use, so sizing on it would oversize the valve badly`",
  "`choked flow: the stated pressure drop is beyond what the valve can use, so the coefficient has been withheld for this row`",
  "`choked flow: the cavitation index sits below the last rung of the ladder, so the sizing basis moves to the allowable drop`"],
 "The message goes on to say that the allowable drop has been used instead and that this service wants a multistage or anti-cavitation trim.")

q(0, "What does the liquid critical pressure ratio factor read at the marched fluid's own vapour and critical pressures?",
 "0.892161",
 ["0.960000",
  "0.680000",
  "0.900000"],
 "That is the working value sitting inside the allowable drop that every choked row of the march is sized on.")

q(1, "What does the same factor read at the critical point?",
 "0.680000",
 ["0.892161",
  "0.960000",
  "0.666667"],
 "It is the far end of the factor's range, returned at the point where the vapour pressure and the critical pressure meet.")

q(1, "What is the crossing outlet pressure of 67.679968 psia useful for on a real project?",
 "Telling a designer whether a proposed turndown case sits on the safe side of the valve's own limit.",
 ["Telling a designer what inlet pressure the service was run at, since the stated drop is printed beside it.",
  "Telling a designer which valve style the engine used, since the crossing is unique to one row of the style table.",
  "Telling a designer what the cavitation index will be at any outlet pressure above it, since the index is linear there."],
 "The crossing belongs to the pressure recovery factor in force, so a valve supplied with a certified figure has its own crossing and a turndown study should be run against that.")

# --- m02, cavitation and flashing -------------------------------------------

q(3, "The engine's refusal spells out the arithmetic of the cavitation index. What sits on top of it?",
 "The inlet pressure less the vapour pressure.",
 ["The inlet pressure less the outlet pressure.",
  "The vapour pressure less the outlet pressure.",
  "The allowable drop less the stated drop."],
 "Leave the vapour pressure out and that term is the inlet pressure alone, which is why the quotient has no upper bound and the ladder hands back its safest rung.")

q(1, "A liquid sizing arrives with the vapour pressure box empty. What does the repaired engine do?",
 "It refuses the call by name and says why.",
 ["It substitutes a default vapour pressure for the fluid family.",
  "It returns the index and marks the result provisional.",
  "It returns the index and omits the regime word."],
 "The refusal names the quantity, gives the arithmetic that makes it necessary, and says where to find it, which is what makes it something a user can act on.")

q(0, "Two answers about damage come back on every liquid sizing row and they answer different questions. Which two?",
 "The regime word and the choked flag.",
 ["The regime word and the cavitation index.",
  "The choked flag and the flashing flag, which the march prints side by side.",
  "The cavitation index and the basis line beside it."],
 "A row can carry a cavitation word with the flag still false, which means the valve is being damaged while the sizing equation is still working normally.")

q(2, "What pressures does the digest state for the flashing case?",
 "An outlet pressure of 26.740000 psia against a vapour pressure of 28.740000 psia.",
 ["An outlet pressure of 28.740000 psia against a vapour pressure of 26.740000 psia.",
  "An outlet pressure of 20.000000 psia against a vapour pressure of 28.740000 psia.",
  "An outlet pressure of 26.740000 psia against a vapour pressure of 20.000000 psia."],
 "The engine returns flashing true and the regime word flashing on that case, and it turns the flag on at exactly the stated vapour pressure.")

q(3, "What is leaving the valve on a flashing service?",
 "A two-phase mixture, which stays that way rather than condensing back.",
 ["A liquid carrying dispersed bubbles that collapse a few diameters downstream.",
  "A vapour stream, since the whole of the liquid flashes across the restriction.",
  "A liquid at its bubble point, which the expanded outlet then returns to a single phase."],
 "The vapour occupies a great deal more volume than the liquid it came from, which is why the message calls for an expanded outlet.")

q(1, "Where does the damage happen on a flashing service?",
 "In the valve outlet and the downstream pipe.",
 ["At the plug and the seat, where the implosions are concentrated.",
  "In the body cavity, where the two phases separate out again.",
  "At the inlet, where the fluid first meets the restriction."],
 "A high velocity mixture of liquid droplets and vapour scours whatever it meets, which is an erosion problem rather than an implosion problem.")

q(2, "Why does this course grade no regime word?",
 "Neither of the two ladder thresholds came from a published document, and the engine says so where a reader can see it.",
 ["The regime word is derived from the choked flag, so grading it would grade the flag twice.",
  "The regime word changes between the stated drop basis and the allowable drop basis.",
  "The regime word is not exported by the module, so a learner cannot check it against anything."],
 "Acceptability on a cavitating service depends on the trim, the materials, the duty cycle and how much of the year the valve spends there, none of which the index knows.")

# --- m03, gas sizing and the style table ------------------------------------

q(1, "The gas valve is asked for an outlet of 230.000000 psia. What is x there?",
 "0.068449",
 ["0.189955",
  "0.306197",
  "0.432969"],
 "The ratio at an outlet pressure of 200.000000 psia is 0.189955 and at 171.300000 psia it is 0.306197.")

q(3, "And at an outlet pressure of 30.000000 psia?",
 "0.878493",
 ["0.797489",
  "0.716484",
  "0.680357"],
 "The engine's message on that row quotes the ratio as x of 0.878 against the terminal 0.680.")

q(1, "Which three rows of the gas march come back with the choked flag true?",
 "The rows at outlet pressures of 70.000000, 50.000000 and 30.000000 psia.",
 ["The rows at outlet pressures of 90.000000, 70.000000 and 50.000000 psia.",
  "The rows at outlet pressures of 110.000000, 90.000000, 70.000000 and 50.000000 psia.",
  "The rows at outlet pressures of 50.000000 and 30.000000 psia."],
 "The gas valve begins to choke at an outlet of 78.919821 psia, and the terminal ratio is what the sizing is done on below that.")

q(2, "Helium and argon service sits at a specific heat ratio of 1.660000. What factor comes back there?",
 "1.185714",
 ["0.928571",
  "1.000000",
  "0.857143"],
 "A specific heat ratio of 1.660000 covers the monatomic gases, which in a plant means helium and argon service.")

q(1, "The same factor is asked for a ratio of 1.300000. What comes back?",
 "0.928571",
 ["0.857143",
  "0.785714",
  "1.185714"],
 "The factor at 1.200000 is 0.857143 and at 1.100000 it is 0.785714.")

q(3, "What does the engine say about whether its pressure recovery factors are cited?",
 "They are not cited to a document in this repository.",
 ["They are cited to the sizing standard the coefficients are defined in.",
  "They are cited to the vendor catalogues the styles were averaged from.",
  "They are cited in the module's own source comments, which the digest quotes."],
 "Following them back to a published source from here is not possible, which is what a reader has to know before quoting one in a calculation.")

q(1, "A certified recovery factor is genuinely unavailable on a project. What does the course say to do?",
 "Say so explicitly in the calculation, quote the table value as the engine's own, and treat the boundary position as provisional until the vendor confirms it.",
 ["Use the style average silently, since it is the best figure available and a note about it invites a question nobody can answer.",
  "Use the largest figure the table carries, since the engine treats it as the default wherever nothing has been stated.",
  "Refuse to size the valve at all, since the boundary cannot be established and the coefficient past it cannot be defended."],
 "The failure to avoid is the silent one, where a style average gets copied into a document that later reads as though it had been confirmed.")

# --- m04, authority and the characteristic it chooses ------------------------

q(2, "A valve drop of 10.000000 psi sits in a circuit that takes 120.000000 psi in all. What comes back?",
 "0.083333",
 ["0.208333",
  "0.333333",
  "0.458333"],
 "The engine takes the valve drop over the total and returns the fraction, with no reference to the flow, the fluid or the trim.")

q(0, "What authority does a 55.000000 psi share of a 120.000000 psi circuit give?",
 "0.458333",
 ["0.583333",
  "0.333333",
  "0.708333"],
 "That figure sits between the two rungs the engine states for itself, which is the interesting place for a design to land.")

q(3, "The hydraulic figure for a circuit's total drop turns out to be a guess. What does that do to the word printed beside the authority?",
 "It inherits the guess without showing it.",
 ["It is withheld, because the engine refuses a verdict over an input it cannot check.",
  "It is unaffected, because the word is read off the valve drop rather than off the total.",
  "It is marked provisional, because the engine carries the provenance of every input into its result."],
 "A fraction is only as good as the arithmetic behind its denominator, and a word carries none of that provenance with it.")

q(1, "What happens to the drop available to the valve as the flow rises?",
 "It falls, because friction losses in the rest of the circuit rise with flow and the total is fixed.",
 ["It rises, because the valve is opening and its own resistance is falling away.",
  "It holds still, because the total drop and the circuit resistance both rise together.",
  "It falls, because the pump is being throttled back to hold the set point."],
 "If the valve was taking a small fraction to begin with, opening it hands most of the newly released pressure straight to the pipework.")

q(0, "Why is the characteristic recommendation read off the authority rather than off the service?",
 "The distortion the trim is chosen to cancel is produced by the circuit around the valve, so the fraction of the drop the circuit takes is the variable that says how much cancelling is needed.",
 ["The service is not an argument of the recommendation, which takes the characteristic already fitted and checks it.",
  "The authority is the only figure in the module that a vendor certifies, so it is the only defensible basis for a recommendation.",
  "The service decides the coefficient and the coefficient decides the travel, so reading the characteristic off the service would be circular."],
 "The trim is chosen to cancel a known distortion, and choosing it for a circuit that does not apply that distortion produces a loop that is bent the other way instead.")

q(2, "Where does the refusal on an unrecognised inherent characteristic fire?",
 "At the travel check, which is the function that was handed the unknown word.",
 ["At the recommendation, which is the function that produces characteristic words.",
  "At the authority calculation, which is the first function in the chain.",
  "At whichever function is called first, since both carry the same guard."],
 "The recommendation never produces a word outside the pair, so the guard belongs where an outside word can actually arrive.")

q(1, "Three things have to be true wherever two functions exchange a word rather than a number. What are they?",
 "The set one produces sits inside the set the other accepts, anything outside it is refused by name, and the refusal says which words are known.",
 ["The two sets are identical, anything outside them is mapped to the nearest member, and the mapping is reported in the result.",
  "The set one produces sits inside the set the other accepts, anything outside it is passed through untouched, and the caller checks it.",
  "The two sets are versioned together, anything outside them raises a warning, and the warning names the version the word came from."],
 "A silent default produces an answer of the right type and the wrong value, and nothing downstream can tell that it happened.")

# --- m05, noise as a screening indication -----------------------------------

q(0, "A one scfh bleed is put through the screen. What power in kW does it carry?",
 "0.00133650 kW",
 ["2312.85 kW",
  "34486.0 kW",
  "1000.000000 kW"],
 "Its message quotes that power as 0.00134 kW when it explains why the band was held down.")

q(2, "What stream power does the moderate station flow carry?",
 "2312.85 kW",
 ["1000 kW",
  "0.00133650 kW",
  "12.000000 kW"],
 "That probe sits at a pressure ratio of 6.000000, with a ratio band of high and a band of high.")

q(1, "A transmission volume is throttled and the screen is run. Which figure is its power in kW?",
 "34486.0 kW",
 ["1 kW",
  "0.00133650 kW",
  "1.898734 kW"],
 "The engine's message on that probe says the power is above 1000 kW, which is not a quiet valve at any pressure ratio.")

q(3, "The engine's note says what to use the band for. What is it?",
 "To know whether to ask the question.",
 ["To answer the question at concept stage.",
  "To set an acoustic lagging thickness.",
  "To close an item on the noise register."],
 "The rest of the note names the method and the geometry a real prediction needs, which is what the band cannot supply.")

q(2, "Which of the three probes did the engine leave where the pressure ratio had put it?",
 "The moderate station flow at a pressure ratio near six.",
 ["The one scfh bleed at a pressure ratio near twelve.",
  "The hundred million scfh at a pressure ratio near two.",
  "None of them, since the stream power moved all three."],
 "Its ratio band and its final band both read high, so nothing was moved on it and the digest prints no reason to look further.")

q(0, "Whose are the two sets of thresholds the screen reads against?",
 "Both sets are this engine's stated screen.",
 ["Both sets are read from the method the note names.",
  "The ratio set is the engine's own and the power set is published.",
  "The power set is the engine's own and the ratio set is published."],
 "They are exported so that they can be read and, if an organisation prefers its own, replaced.")

q(1, "A valve is flagged by the screen. What goes into the design document?",
 "That the screening indication flagged it and that the proper calculation is outstanding.",
 ["That the valve is expected to exceed the site noise limit at the stated distance.",
  "That the valve has been sized for a low noise trim and the item can be closed.",
  "That the band was returned by a method the engine names, with the band word beside it."],
 "The practical rule is to act on the band and quote the method, so that a later reader cannot mistake a screening output for a prediction.")

# --- m06, travel and a verdict over checks that ran --------------------------

q(3, "A rangeability of 50 and an equal percentage curve. What normal duty travel does the check report?",
 "74.737770",
 ["37.222222",
  "47.956430",
  "83.997848"],
 "That figure is uninterpretable without its characteristic and its rangeability, and both are properties a vendor states for the specific trim.")

q(0, "How far open is the valve at its maximum duty on the clean case, in percent?",
 "83.997848",
 ["74.737770",
  "47.956430",
  "0.000000"],
 "Nothing was refused and nothing was withheld on that case, so the figure is one the engine is prepared to stand behind.")

q(2, "How many of its checks does the engine run when no maximum flow is given?",
 "2 of the 3.",
 ["3 of the 3.",
  "1 of the 3.",
  "None of them, since a missing flow stops the check running at all."],
 "The verdict is withheld on that case and the warning count is 0, because a warning is a finding and there is no finding.")

q(1, "What does the engine say is not known where no maximum flow was given?",
 "Whether the valve can pass its design case.",
 ["Whether the valve can control at turndown.",
  "Whether the valve is beyond its rangeability.",
  "Whether the minimum flow lands hard against the seat."],
 "Where no minimum flow is given it is the near-seat rangeability check that did not run, and what is then not known is whether the valve can control at turndown.")

q(3, "Rangeability is a property the vendor states. What span does it name?",
 "The span between the largest and the smallest coefficient the trim can meter with.",
 ["The span between the maximum and the minimum flow the check was given.",
  "The ratio of the travel at the maximum duty to the travel at the minimum duty.",
  "The fraction of the full stroke over which the inherent characteristic holds its shape."],
 "It is a property the vendor states for the specific trim, and one assumed rather than confirmed moves every travel figure the check produces.")

q(0, "Three things must never be rendered as the same empty cell. What are they?",
 "A number, a refusal and an absence.",
 ["A number, a warning and a refusal.",
  "A refusal, a warning and an absence.",
  "A number, an absence and a rounding to zero."],
 "A result has to carry its own coverage, and a table that renders all three as an empty cell has destroyed the distinction before any reader gets to it.")

q(2, "Why would a pass reported over the checks that happened to run be the more dangerous answer?",
 "It closes the item, so nobody looks again at a valve whose turndown behaviour is still unknown.",
 ["It reopens the item, so the review spends its time on a case the engine has already cleared.",
  "It contradicts the warning list, so a reader has to decide which of the two returns to believe.",
  "It reports a verdict the engine cannot reproduce, so the result fails to repeat on a second run."],
 "An answer refused by name leaves a reader with something to do. One quietly produced from incomplete work leaves them with nothing to do and no reason to look again.")

emit(Q, '/root/wt-fc8-nextgen/tools/course-banks/metering/intermediate/fc8i_exam.json', label='fc8i_exam', expect_n=42)
finish()
