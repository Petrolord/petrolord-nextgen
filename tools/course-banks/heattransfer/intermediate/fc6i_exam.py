import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC6 Professional tier exam, 42 questions over all six modules.
# Every figure is from digest Sections 6 to 13 at the rendering they print.
# Nine questions are written to need two modules at once, so the exam samples
# the tier rather than re-asking a module bank. Nothing here asks a reader to
# tell the two published film rows at one flow, bore, viscosity, Reynolds and
# Prandtl apart from the printed table.

# --- the driving force half -------------------------------------------------

q(2, "Three quantities stand under the duty when this engine sizes a surface. Which three?",
 "The overall coefficient, the correction factor and the log mean driving force.",
 ["The overall coefficient, the tube count and the log mean driving force.",
  "The two film coefficients and the log mean driving force.",
  "The overall coefficient, the correction factor and the arithmetic mean of the two ends."],
 "Two of those three are what this tier is about. An error in any one of them arrives in the area unchanged, and the area is what gets bought.")

q(0, "What question do P and R exist to answer?",
 "How far from counter-current flow the arrangement sits.",
 ["How much of the duty the shell side is carrying.",
  "How far the coefficient sits below its clean value.",
  "How much surface the duty will need at this coefficient."],
 "A shell and tube unit with one shell pass and two tube passes runs partly counter-current and partly parallel, so its true driving force sits below the counter-current log mean. The factor is that shortfall as a multiplier.")

q(1, "The groups door hands back two keys and no more. What are they?",
 "P and R.",
 ["P and the correction factor.",
  "R and the log mean.",
  "P and the equivalent single-shell P."],
 "The correction factor is a separate call and it carries four keys of its own. Reading the pair before anything downstream is what the groups are for.")

q(3, "Of the two teaching exchangers, which sits lower on the correction curve at one shell pass?",
 "ORON, at 0.957197.",
 ["The studio case, at 0.964693.",
  "ORON, at 0.204107.",
  "The studio case, at 0.171875."],
 "Neither reaches one, because neither has a vanishing cold rise. The two cases share nothing else, so a figure from one never belongs to the other.")

q(2, "Walking P upward at a fixed R of 0.900000 produces three kinds of return in order. Which order?",
 "An answer, then an answer with a warning, then a refusal.",
 ["An answer, then a refusal, then an answer with a warning.",
  "An answer with a warning, then an answer, then a refusal.",
  "An answer, then a warning with no factor, then a refusal."],
 "The factor falls as P rises and it falls faster the further up the sweep it is read. The engine never walks off the end of the curve quietly.")

q(0, "High on that curve the four terminal temperatures are measurements. What does the warning say a small error in one of them costs?",
 "A badly swung area, because the factor moves enough up there to change the tube count.",
 ["A badly swung log mean, because the warning is attached to the driving force rather than to the factor.",
  "Nothing at all yet, because the factor is capped by this module before the area is ever formed.",
  "A refusal, because the sweep is one row below the unreachable configuration."],
 "The four temperatures behind a factor are measurements. Low on the curve an uncertainty in one of them is harmless, and high on it the same uncertainty turns into a surface the plant falls short of.")

q(1, "Why does the limit at a vanishing P need no publication behind it?",
 "It is analytic, so nobody has to have measured an exchanger for it to be right.",
 ["It is measured, and the measurement is in the published case file.",
  "It is declared by this module, like the bound on the shell count.",
  "It is fitted, and the fit is pinned by literal in the engine gate."],
 "It also discriminates. A wrong constant anywhere in the closed form shows up as a column that fails to climb, or climbs to something other than one.")

q(3, "One column of the limit table is reached by a branch of the closed form written for that case alone, and it climbs to one as the others do. What does that agreement check?",
 "Both branches, because each has to satisfy the same limit.",
 ["The general branch only, since the special one is a special case of it.",
  "The special branch only, since the general one is checked by the published cases.",
  "Neither, since a function agreeing with itself at a limit is an identity."],
 "A ratio of exactly one makes the general form indeterminate. If the special branch carried the wrong sign or the wrong grouping, its column would part company with its neighbours on the way down.")

q(1, "Which refusal in this tier hands back the numbers that produced the state it refused?",
 "The tube-side film inside the transition band, which returns the Reynolds number.",
 ["The correction factor at a P of 0.620000, which returns the equivalent single-shell P.",
  "The shell count at seven, which returns the factor the sixth shell would have given.",
  "The wall conductivity at zero, which returns the flat plate value at that thickness."],
 "Three of the twelve doors on this engine hand back more than a message, and the film is the one in this tier. A panel that shows only the message throws that evidence away.")

# --- shells in series -------------------------------------------------------

q(3, "What is the difference between a bound a module declares and a limit a publication carries?",
 "You argue with a declared one by reviewing the declaration and with a published one by finding better data.",
 ["You argue with a declared one by finding better data, and with a published one by reviewing the code it sits in.",
  "A declared one is enforced by a refusal that names it, and a published one is enforced by a warning on the answer.",
  "A declared one is checked by the golden file and a published one is checked by an analytic limit."],
 "A limit that hides in a comparison somewhere in the code cannot be argued with at all, because nobody can find it. This module carries a declared bounds table and names the bound as declared where it enforces one.")

q(2, "Two entries in that declared bounds table come up in this tier. Which two?",
 "The shell count stopping at six, and the margin at which a controlling resistance is named.",
 ["The shell count stopping at six, and the transition band running from 2300 to 10000.",
  "The margin at which a controlling resistance is named, and the fouling allowance floor at zero.",
  "The transition band edges, and the tube passes the bundle constants are carried for."],
 "Both are reporting decisions rather than physics and both are labelled. The band edges are declared constants of the module, on a separate table from the bounds.")

q(1, "One duty is refused at one shell and answered at two. Another is refused at one, two, three and four. What separates the two cases?",
 "The first is reachable once a shell is added, and the second is reachable at no count that was tried.",
 ["The first sits inside the declared bound on the shell count and the second sits outside it.",
  "The first carries the steep-curve warning on its answer and the second carries none at all.",
  "The first is refused by the conversion and the second by the bound this module declares."],
 "The first case runs at a P of 0.720000 and an R of 0.850000, and the second at a P of 0.920000 and an R of 1.400000. A configuration can be infeasible rather than merely inefficient.")

q(2, "A tool that quietly rounded a request for 2.400000 shells would be worse than one that refuses. Why?",
 "The caller would never learn that a choice had been made on their behalf.",
 ["The caller would be handed a train longer than the declared bound allows.",
  "The caller would get a factor from a branch of the form written for whole counts.",
  "The caller would lose the equivalent single-shell P from the answer."],
 "Rounding down would hand back 0.800677 and rounding up 0.920456. Those are materially different factors, so the engine makes the caller choose.")

q(0, "What does the golden column beside those multi-shell rows tell you that a second copy of the engine could not?",
 "That a route which never evaluates the conversion reaches the same seven answers.",
 ["That the conversion in this module was transcribed into the oracle beside it without a typing error in it.",
  "That the seven rows in that table were taken from a publication on trains of shells in series.",
  "That the bound of six shells this module declares was the count the published data was gathered at."],
 "The oracle marches the shells in series and recovers the whole unit P from the march. Where a route could only have been a transcription, the golden file would tell you the two files agree and nothing more.")

# --- the coefficient --------------------------------------------------------

q(3, "Why is a coefficient assembled from five named parts worth more than the same coefficient as one figure?",
 "The parts say which side of the tube is worth spending money on.",
 ["The parts can be referred to either surface, while the figure cannot.",
  "The parts are graded in this course, while the figure is not.",
  "The parts carry the fouling allowances, while the figure leaves them out."],
 "A stack whose parts are visible turns a coefficient into a decision. Money spent on a term that carries a small share of it cannot move the answer far, and the share column is what says so before anybody prices the work.")

q(1, "The word series in that title is doing real work. What follows from it for the wall on the studio case?",
 "At 2.107398 percent of the stack, a better alloy is a poor use of money there whatever it costs.",
 ["At 2.107398 percent of the stack, the wall is the term to leave out of the sum.",
  "At 2.107398 percent of the stack, the wall sets the margin on the controlling verdict.",
  "At 2.107398 percent of the stack, the wall is the term the fouling allowance is compared against."],
 "The share column is worth as much as the resistance column, because it says what a term is worth improving before anybody prices the improvement.")

q(2, "Two exports in this engines package are called an overall coefficient. What separates them?",
 "The surface each one is referred to, which each of them reports.",
 ["The number of named resistances each of the two is assembled from.",
  "Whether the two fouling allowances are inside the figure or left out of it.",
  "Whether the answer carries a controlling term and a margin."],
 "One of them belongs to this module and the other to the production domain. A duty through a wall is fixed by physics, and what changes with the convention is how that duty is written down.")

q(0, "A coefficient taken from one reference convention and used in the other is wrong by the ratio of two areas. Why is that dangerous rather than obvious?",
 "The answer looks entirely reasonable, and it carries straight into the surface.",
 ["The answer is refused by the engine, so the work stops and the whole case has to be retyped.",
  "The answer moves the controlling verdict onto the wall, where nobody checks it.",
  "The answer is off by a factor of two, which reads as a unit error."],
 "That is why the first question about any coefficient is which area it belongs to, and the second is whether the area it is about to be multiplied by is that one.")

q(3, "The inside terms are converted onto the reference surface and the outside fouling allowance is not. What decides which?",
 "Whether the term already sits on the surface the stack is referred to.",
 ["Whether the term is a film coefficient or a fouling allowance.",
  "Whether the term was typed by the caller or computed by the engine.",
  "Whether the term is larger than the wall resistance in the same stack."],
 "The wall is a third case again. Its expression already carries the geometry inside it, so there is nothing to refer afterwards. Three terms, three treatments, one reference surface.")

q(1, "How can a reader check the diameter ratio conversion on the screen rather than trusting it?",
 "Take one over the film coefficient and divide the printed resistance by it.",
 ["Take the ratio of the two fouling allowances as typed.",
  "Divide U clean by U dirty and compare against the printed penalty.",
  "Take the outside film share over the inside film share."],
 "The engine prints both ends of that conversion. A conversion nobody checks has been right for years or wrong for years, and the two look identical from a distance.")

q(2, "What does the fouling penalty of 31.495796 percent on the studio case mean for a surface?",
 "The exchanger is sized on the dirty coefficient, and the clean one is what it carries when new.",
 ["The exchanger is sized on the clean coefficient and then derated by that percentage once it is in service.",
  "The exchanger is sized on the mean of the two coefficients, and that penalty is what sets where the mean sits.",
  "The exchanger is sized on the dirty coefficient, and the penalty is the margin carried above the surface asked for."],
 "Clean is what it will do on its first afternoon, and what it will stop doing within weeks. The penalty is also the two fouling terms as a share of the total, which is an identity rather than a coincidence.")

q(0, "Where does the defence against an input nobody bounded belong?",
 "At the input, since an unbounded one can produce a figure that looks perfectly sensible.",
 ["At the output, since a figure that looks sensible will still fail a published case.",
  "At the golden file, since a second route disagrees wherever an input is unbounded.",
  "At the gate, since a pinned constant cannot be moved without a review."],
 "Watching the output only works while the output is absurd enough for somebody to notice, and the absurd one is the lucky case.")

q(3, "Which of the five resistances does a designer choose outright?",
 "The two fouling allowances.",
 ["The two film coefficients.",
  "The wall and the outside film.",
  "The inside film and the wall."],
 "The outside film arrives as an input and the inside one is computed or typed, but neither is a choice in the way an allowance is. The allowances are what the fouling penalty is the cost of.")

# --- the wall and the limits ------------------------------------------------

q(1, "This repository carries no published heat exchanger case for the wall term. What stands in for one?",
 "Route independence, the constant pins and the analytic limits.",
 ["A published case from a neighbouring module, converted into these units.",
  "The agreement of the engine and its oracle.",
  "The studio case, which a reader can check against the live app."],
 "The golden file is declared synthetic and says so rather than dressing an invented row as a citation. The limits are the strongest of the three, because they can catch a mistake the two routes share.")

q(2, "Both films were made negligible to measure the wall term. What does that technique do in general?",
 "It isolates one term inside a sum of five, so the answer is a reading of that term.",
 ["It removes the reference area from the answer, so the term needs no conversion.",
  "It drives the controlling verdict onto the term under test, which names it.",
  "It replaces the published case the repository does not carry for that term."],
 "The outside diameter was held at 1.000000 inches throughout and only the thickness moved, so nothing but the variable of interest changed between rows. The same trick works on any of the five.")

q(0, "The ratio of the wall resistance to the flat plate reaches 1.002005 at the thinnest wall in that table. What is the finding?",
 "The value the column converges to, rather than how close the last row gets.",
 ["The rate the column converges at, which fixes the factor in the denominator.",
  "The agreement at the thickest wall, which is where the two forms differ most.",
  "The sign of the difference, which tells you which of the two forms is wrong."],
 "An expression with a wrong factor of two would converge just as smoothly, on two or on one half. That is what makes this limit a check on a factor nobody can inspect.")

q(1, "Two analytic limits stand behind this tier: the factor tending to one at a vanishing P, and a thin wall collapsing onto a flat plate. What do they have in common?",
 "Each can be checked with no citation in hand, and each discriminates against a shared error.",
 ["Each is measured out of the published case file, which is why they need no citation.",
  "Each is pinned by literal in the engine gate, so moving one is a reviewed act.",
  "Each is declared by this module, like the bound on the shell count."],
 "This repository carries no published heat exchanger case, so the golden file is declared synthetic and says so. What stands in for published data is route independence, the constant pins, and limits of this kind.")

q(2, "How far ahead does the leading resistance have to be before its name stands on its own here?",
 "10 percent of itself.",
 ["2 percent of itself.",
  "10 percent of the whole stack.",
  "More than the runner up carries of the whole stack."],
 "A one word verdict decided by a narrow gap is a coin toss wearing the clothes of a result. The figure is a reporting decision this module owns and no publication carries it.")

q(0, "Why does this module apply that comparison itself rather than printing the margin and leaving it to a reader?",
 "A word on a screen is read and acted on, and a percentage beside it is noticed by whoever was already going to check.",
 ["A margin printed alone cannot be compared against a threshold that is declared.",
  "A reader cannot see the runner up, so the comparison would have no second term.",
  "A margin printed alone would have to be recomputed from the shares every time."],
 "A declared threshold turns that check into something the tool does every time, which is the only version of a check that survives a busy afternoon.")

q(3, "A coefficient answer arrives with the note about a narrow margin attached. What does the note ask a reader to do?",
 "Treat the leading term and its runner up as jointly controlling.",
 ["Take the leading term and act on it, since the engine still names one.",
  "Discard the verdict, since the margin sits under the declared threshold.",
  "Re-run the stack at another tube count."],
 "The module does not hide the verdict and it does not pretend it is sharper than the numbers behind it. Above the margin it declares, the word is left to stand on its own.")

# --- the film ---------------------------------------------------------------

q(1, "Sweep the flow through one studio bundle at 45000.0000, 120000.0000 and 400000.0000 lb an hour. What do the Reynolds number and the film do?",
 "Both rise, from 24779.163375 and 345.692714 to 220259.229998 and 1985.035182.",
 ["Both fall, from 220259.229998 and 1985.035182 to 24779.163375 and 345.692714.",
  "The Reynolds number rises and the film holds at 5.667097 across all three.",
  "The Reynolds number rises and the film falls, as it does along the tube count trail."],
 "The three rows are read for direction only. This course prints no ratio between them, because the engine computes none.")

q(0, "Which single number on a film answer decides which of the three treatments produced it?",
 "The Reynolds number.",
 ["The Prandtl number of the fluid.",
  "The tubes a pass on the bundle.",
  "The wall viscosity, when one is given."],
 "Below 2300 the laminar limit is used and the answer is warned about, above 10000 the turbulent fit answers plainly, and between the two the engine refuses. The Prandtl number is a property of the fluid and it does not move with the bundle at all.")

q(2, "A film coefficient that does not move when the flow is doubled. What is happening?",
 "The laminar constant wall temperature limit is being used, and the flow has dropped out of it.",
 ["The answer has been capped at the value the transition band edge would give.",
  "The correlation has been evaluated at the same Reynolds number twice.",
  "The Sieder-Tate correction has absorbed the change in the flow."],
 "Nothing is broken and nothing has been rounded. Every laminar answer carries a warning that says so in advance, along with the two other limitations that come with the limit.")

q(3, "A laminar tube side will not improve by pushing more fluid through the same bundle. What does that leave a designer?",
 "Changing the geometry, which is the tube count, the passes or the bore.",
 ["Changing the pump, until the flow crosses into the transition band.",
  "Changing the fouling allowances, which move the coefficient instead.",
  "Changing the service to heating, which takes the correction the limit declines."],
 "Those are the same three inputs the transition refusal names, and for the same reason. The regime is a property of the velocity inside a tube.")

q(1, "A caller gives a wall viscosity of 0.320000 cp on the studio case. What happens to the film?",
 "It is corrected by 1.064473, to 583.078474.",
 ["It is corrected by 1.209677, to 583.078474.",
  "It is left at 547.762384, because the correction needs a turbulent regime.",
  "It is corrected by 1.064473, to 547.762384."],
 "The factor is reported on a key of its own, so the two film coefficients can be told apart by a reader holding only one of them. A correction folded silently into a result is a correction nobody can audit.")

q(0, "What does the engine hand a reader in place of a validity band it cannot state?",
 "The Reynolds and Prandtl numbers, on every call, so they can be checked elsewhere.",
 ["The two transition band edges, which bracket where the fit is trustworthy.",
  "The published film cases, which are the band the fit was taken over.",
  "A warning on every answer that the fit may be extrapolated."],
 "That is the honest shape for a held item. Name the gap, hand over what a reader needs to close it themselves, and grade nothing that depends on it.")

q(2, "A tube side is declared as condensing. How does the engine answer?",
 "With a short refusal naming heating as the only service it carries.",
 ["It refuses at length, saying the condensing exponent is not established here.",
  "It answers with the heating form and attaches a warning to the number.",
  "It answers, because condensation is what the laminar limit describes."],
 "This module carries no form for condensation at all, and it says so in its own description. The cooled tube side is the other refusal on that door, and that one states the size of what it is declining to guess.")

# --- the whole chain --------------------------------------------------------

q(3, "A screen prints a film coefficient computed at one tube count beside a different count. What does that tell you?",
 "One of the two numbers was never computed, and the loop has not closed.",
 ["The film was computed at a seed on the ladder rather than at the answer.",
  "The count was rounded up twice and the film was taken before the second rounding.",
  "The film belongs to the clean coefficient and the count to the dirty one."],
 "The fix is to close the loop rather than to choose a better constant. At the converged count the duty, the coefficient, the area and the driving force satisfy the equation they were built from.")

q(1, "At 60 tubes the studio film is 647.823324 with a U dirty of 95.098250, and at 74 tubes they are 547.762384 and 92.110348. Which pair belongs to this exchanger?",
 "The pair at 74 tubes, because that is the count the loop settled on.",
 ["The pair at 60 tubes, because the higher film is the better machine.",
  "Either pair, since both are engine answers.",
  "Neither pair, because the film at this tier arrives typed rather than computed."],
 "The rows above the last one are the trail the iteration left behind. Two tubes at the top of that trail give a film of 9843.591536, which belongs to a bundle nobody would build.")

q(2, "Why can moving the tube count change which resistance is named as controlling?",
 "The inside film moves with the count, and the inside film is one of the five.",
 ["The reference area moves with the count, so every term is rescaled.",
  "The declared threshold is measured against the count in that answer.",
  "The fouling allowances are converted by a ratio that follows the count."],
 "The stack was assembled at particular flows, allowances and a tube count, and each of those is an input a reader can change. The verdict belongs to the case rather than to the exchanger.")

q(0, "The studio case is sized at a correction of 1.000000, and the correction door returns 0.964693 on the same four temperatures. What separates the two?",
 "The second belongs to a one shell pass and two tube pass unit, and the case as sized is counter-current.",
 ["The second is the equivalent single-shell value, and the first is the whole unit value.",
  "The second was computed at the converged tube count and the first at the seed.",
  "The second carries the steep-curve warning and the first does not."],
 "The arrangement is an input, and the correction is what a shell and tube unit pays for running partly in parallel flow. A counter-current case has nothing to correct.")

q(1, "Which of these does this engine leave to another module entirely?",
 "The pressure drop along the tube side.",
 ["The overall coefficient referred to the outside surface.",
  "The correction factor at a stated shell pass count.",
  "The inside film coefficient in the turbulent regime."],
 "Pressure drop in a line belongs to the Pipeline and Line Sizing engine and machine work belongs to Rotating Equipment. The shell side film stays an input here as well, because a rigorous one needs stream analysis that belongs in a dedicated rating package.")

emit(Q, '/root/wt-fc6-nextgen/tools/course-banks/heattransfer/intermediate/fc6i_exam.json', label='fc6i_exam', expect_n=42)
finish()
