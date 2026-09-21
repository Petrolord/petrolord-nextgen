import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC9 Expert final exam, 42 questions across all six modules.
# Seven questions reach digest section 17, which is owned by this tier and
# which no lesson in the tier reaches: the whole-screen door's field set and
# compute order, the two errors it swallows into a field, the h2sMolFrac
# default parameter, the mole-fraction sum guard and the class-of-defect lesson.

# ---- digest section 17, the unreached section ----
q(1, "The whole screening door returns 18 top-level fields, and the order in which it computes them is a design decision. What is computed first, and why?",
 "The wall shear, because the rate depends on whether the corrosion inhibitor film survives it, so a shear that cannot be computed means no rate is issued at all.",
 ["The rate, because every other field on the screening is either derived from it or reported beside it, and the shear is one of the things reported beside it.",
  "The sour comparison, because the H2S partial pressure decides which regime the stream is in and the regime decides whether a rate should be formed for it.",
  "The corrosion allowance arithmetic, because the design life is the only input that can make a screening incomplete and it is checked before anything is computed."],
 "A missing density is a refusal rather than a missing row: the screening reports itself incomplete and says that the film survival check did not run. Then the rate, the credited rate beside it, the sour comparison, the regime, the withholding, the category, the life and the binding constraint.")
q(3, "A whole screening is run with the corrosion allowance box left blank. What does a caller who checks only for a top-level error see?",
 "Nothing. The top-level error is undefined, the life is null, the withheld block is null and the screening reports itself complete.",
 ["A refusal naming the corrosion allowance box, as it does for a blank density.",
  "An incomplete screening, because the remaining life is one of the 18 top-level fields and a field that cannot be formed makes the whole screening incomplete.",
  "A withheld block naming the allowance, which is the mechanism the engine uses wherever a field cannot be issued and a reason for it can be stated."],
 "The summary rail simply has no remaining-life row and nothing on the screen says why. That case also returns mass transfer to the wall as its binding constraint, so the screen reads as a complete answer.")
q(2, "A whole screening is run with an allowance already consumed past its own depth. Where does the refusal end up?",
 "Inside the `life` field as an error object, so a reader who checks only the outside of the result sees a normal screening.",
 ["At the top level, because a consumed allowance is the one life-door refusal the whole screening door promotes out of the field it was raised in.",
  "In the withheld block, alongside the reason it was raised for.",
  "In the clamps field, because the consumed depth is clamped to the allowance."],
 "A caller's check for a top-level error passes, the remaining years are undefined, and the refusal message never reaches anyone. That is the same shape as the shear case one field along, and the shear case is the one the engine handles properly.")
q(0, "The general lesson the whole screening door teaches is about a class of defect rather than an instance. What is it?",
 "A repair that names a defect and fixes one instance of it has not removed the class. Read what a function returns rather than what its comment says it returns.",
 ["A repair that fixes an instance has removed the class wherever the class is defined by a single shared helper, which is why the shear case covers the life case too.",
  "A defect of this kind is found by reading the module's exported lists, since a field whose absence is not on either list is a field nobody has thought about yet.",
  "A defect of this kind is found by comparing the engine against its oracle, since a swallowed error produces a value the independent route will not reproduce."],
 "Ask of every field whether its absence is declared or merely missing. This module declares the withdrawn region's absence in two fields and does not declare the swallowed remaining-life refusal at all.")
q(3, "The whole screening door takes an H2S mole fraction. A direct caller omits the key entirely. What happens?",
 "The signature's default of zero is used, so the H2S partial pressure is 0.000000 bar, the stream is not sour, the regime is carbonate and a category is issued.",
 ["The door refuses with a message saying a finite H2S mole fraction is required, which is the same message it gives for a mole fraction that is not a number.",
  "The door refuses with a message saying the CO2 and H2S mole fractions sum above one, because an absent fraction is compared against the total as a null.",
  "The door carries the H2S mole fraction from the CO2 mole fraction, so the regime comes back mixed as it does at the shipped defaults and the category is issued."],
 "That is the least limiting direction. An H2S mole fraction that is not a number does refuse, and the studio layer produces not-a-number from a blank box, so the live screen is protected by the layer above rather than by this default.")
q(2, "Two mole fractions are each inside nought to one and they sum to 1.1000. What does the whole screening door do, and why does that guard exist?",
 "It refuses, because their partial pressures would exceed the total pressure. Two fractions each inside their own range can still add to more than one.",
 ["It accepts them and clamps the larger of the two down until the sum reaches one, recording the move in the clamps field in the way it records every clamp.",
  "It accepts them, because each fraction passes its own range guard on the way in.",
  "It refuses, because a CO2 mole fraction above one is outside the range guard."],
 "The engine checks the sum against the total and not just each fraction against its own range. A sum of exactly one is accepted: two fractions of 0.600000 and 0.400000 give a partial pressure sum of 51.000427 bar against a total of 51.000427 bar and the screening runs.")
q(0, "Which set is made up entirely of range guards this module enforces on what a caller types?",
 "Nought to one on every fraction, nought to fourteen on pH, a temperature above absolute zero, and the partial-pressure sum against the total pressure.",
 ["Nought to one on every fraction, nought to fourteen on pH, the 250.000000000000 bar fugacity cap, and the film-stripping threshold of 100.000000000000 Pa.",
  "A temperature above absolute zero, a positive total pressure, the published validity band of the reaction term, and the pH reference of 4.000000000000.",
  "Nought to fourteen on pH, a temperature above absolute zero, the Reynolds 4000.000000 branch switch, and the two H2S to CO2 transition ratios."],
 "Every published validity band of every correlation is held rather than enforced. The cap and the thresholds are held numbers that change an answer or a word, and neither is a range guard on an input.")

# ---- m01 ----
q(1, "A reader wants to know whether this engine actually uses the value it exports for a constant. What answers that, and what does not?",
 "A measurement of the behaviour answers it. Reading the export answers only what the module declares about itself.",
 ["Reading the export answers it, because an exported name is the value the functions close over and there is no second copy anywhere in a module that imports nothing.",
  "Comparing the export against the golden's `heldConstants` block answers it, because the golden was generated by running the engine rather than by reading it.",
  "Neither answers it, which is why the course prints both columns."],
 "The two can differ through a second copy inside a function, a branch that never reaches the exported name, or a value transformed on the way in. Nothing in this module currently separates, and that is a result with a size attached.")
q(3, "Sixteen of the thirty pinned constants have no export at all. What is the practical consequence?",
 "For those sixteen the measurement is the only column there is, which is the case the technique was built for.",
 ["For those sixteen the pin compares the golden against the course's literals instead, so the engine is out of the comparison and the pin is weaker by one copy.",
  "For those sixteen no pin is possible, so they are carried by the constant-free invariants and by the route independence the golden's own file describes.",
  "For those sixteen the course reads the literals out of the source."],
 "The two reaction constants, the reaction fugacity exponent, the two fugacity coefficient constants, the mass-transfer coefficient and both of its exponents, the three scale constants, the pH slope, the Blasius pair, the laminar constant and the mass-transfer fugacity exponent are all reached by measurement alone.")
q(0, "The route table gives four of its eight routes an empty cannot-check column, and the course grades four families of field. What connects the two lists?",
 "Neither lets a fitted constant reach its answer, so the two lists are one property seen twice.",
 ["Both were chosen from the golden's seventeen whole cases, which is the block the course compares route by route and the block the graded fields are taken from.",
  "Both are pinned in the course against a literal in a third file, and a pinned quantity is one a route can check and a graded field is permitted to reach through.",
  "Both are exported by the engine under their own names, and an exported quantity has been declared in a way that a route and a graded field can each rely on."],
 "The series combination, the corrosion inhibitor time average, the remaining life and the allowance shortfall are the four clear routes. The stream bookkeeping, the flow definition, the corrosion inhibitor arithmetic and the allowance arithmetic are the four graded families.")
q(2, "What does a constant-free invariant test that a pin does not?",
 "The form of an expression rather than the value of its coefficients.",
 ["The value of a coefficient against a source, which is the one thing a pin cannot reach because a pin compares only against another copy of the number.",
  "The agreement between the engine and the golden, which a pin cannot reach because it compares the engine against a literal in a third file instead.",
  "The behaviour of the module at its boundaries, which a pin cannot reach because every pinned constant is measured away from the branch it governs."],
 "The series residual holds to twelve figures on every row, the scale factor is exactly one at its own computed onset, the pH correction gives one decade per two pH units measured as 0.100000000000 four times over, and the mole-fraction ratio is provably free of pressure.")

# ---- m02 ----
q(1, "What does this studio have to offer a reader asking whether a line is fit for service?",
 "Nothing at all, because producing an assessment means adopting an assessment method and no such method is in this repository.",
 ["A remaining life against the stated corrosion allowance, which is the closest the module comes and is why the word integrity appears in the app's own name.",
  "A verdict in `meetsDesignLife`, which compares what is left against the design life.",
  "A withheld block naming the assessment, which is how the engine reports the quantities it declines to issue on a screening that otherwise ran to completion."],
 "The four things a reader will look for are an inspection interval, a minimum thickness, a retirement thickness and a fitness-for-service assessment. All four are named in `NOT_PROVIDED` and the studio lists them.")
q(2, "A stream binds on wall shear on the corrosion inhibitor film, and the reader asks whether the line is simply running too fast. What can this course say?",
 "That the shear answers a chemistry question about a film. Nothing in this engine expresses a velocity limit, and the criterion that does belongs to another course entirely.",
 ["That the line is above its velocity limit, since the film-stripping threshold of 100.000000000000 Pa is where this module takes mechanical erosion to begin on the wall.",
  "That the question cannot be asked of a stream binding on shear, because the binding constraint reports the limit that governs and the velocity is an input rather than a limit.",
  "That the wall shear and an erosional velocity are the same test in different units, so the coloured risk word answers the question as it stands."],
 "This engine has no erosional-velocity criterion and the Casing and Tubing Design course at its Expert tier owns it. The shear here comes through this module's own Reynolds number and this module's own friction factor, and the line sizing course computes its own pair, which will not agree on the same pipe.")
q(1, "A screening reports a remaining life of 4.207953 yr against a corrosion allowance of 3.175000 mm. Which part of that statement did the module compute?",
 "The division alone. The allowance, the consumed depth and the design life were all typed in, and no wall thickness and no design pressure is anywhere in the module.",
 ["The allowance as well, since the module forms it from the design pressure and the pipe grade before it subtracts whatever the consumed depth has taken off it.",
  "The whole statement, since the remaining life is one of the 18 top-level fields and every one of those is derived inside the engine rather than carried through it.",
  "Neither part, since the life rests on a rate the correlation produced and a figure resting on held constants has not been computed in any useful sense."],
 "The arithmetic inside the door is exact and its inputs are assertions. The wall this studio is eating is not the wall the Pipeline and Line Sizing studio or the Storage Tank studio sized, and there is no link between the three.")
# ---- m03 ----
q(2, "The category door is handed a negative rate. What does it do, and what makes that worth noticing?",
 "It answers rather than declining, and the word it gives is the most reassuring one it has. That is the shape to look for in any function.",
 ["It returns null, in the same way it does for a blank rate and for a rate that is not a number, so all three inputs it cannot label behave alike.",
  "It refuses with a message naming the rate it was handed.",
  "It answers with the word at the top of the scale."],
 "Nothing upstream in the whole screening door will hand it a negative rate, so the shape does not reach the studio. It is still a function answering where it could decline, with the least alarming answer available to it.")
q(3, "The H2S screening threshold was left where it was, and the course says why. What argument says that tightening the category bands would not repair them either?",
 "A replacement would be just as unsourced as the original while wearing the appearance of a fix, so the screen would gain a claim of correctness it had never had.",
 ["Both numbers are pinned in the course against a literal in a third file, and a pinned number cannot be moved without the gate separating the two columns.",
  "Both numbers are exported by the engine, and an exported constant is part of the module's public interface, so moving one is a change to every caller at once.",
  "Both numbers sit on the eleven-item held list, and an item on that list is frozen until a source for it is vendored into the repository beside the engine."],
 "The threshold stays at 0.003500000000 bar, is declared held in a field and is printed in both units. The bands stay at their three edges with `categoryHeld` true beside the word.")
q(2, "The sequence that chooses a binding constraint never reads the category word. Why is that the right design?",
 "The word is three comparisons against three unsourced edges laid on top of a rate, so a summary ranking by it would be ranking by a rendering convention.",
 ["The word is not available at the point the sequence runs, because the category is computed after the binding constraint in the order the screening door walks.",
  "The word is withheld on two of the six teaching streams, and a step that could not fire on every stream would leave those two screenings with no constraint at all.",
  "The word already reflects the rate, so reading it as well as the rate would count the same evidence twice and push every stream towards the kinetics branch."],
 "The sequence reads flags and numbers the screening has already produced: the regime, the shear against its threshold, the life against the design life, and the two rate terms against each other.")
# ---- m04 ----
q(2, "Why is the binding constraint described as an answer to the question what would I change first?",
 "Because the sequence stops at the first limit that bites, and each of the four answers implies a different first move.",
 ["Because the engine ranks its limits by how much each would move the rate.",
  "Because the engine compares each limit against the value the reader typed and names the one furthest from its own threshold, which is the easiest to move.",
  "Because the constraint is chosen from the largest number on the screen, which is the figure a reader would have acted on in any case and is now named for them."],
 "Wall shear points at the line speed, the allowance against the design life points at a specification decision, mass transfer points at velocity and line size, and the model not applying points at reading the withheld block.")
q(3, "What is a binding constraint silent about?",
 "Every action a reader might take, because an action needs a standard, a cost and an operating context and the module carries none of the three.",
 ["The value it turns on, which is reported separately so the summary sentence can be rendered without a number in it wherever the studio needs it short.",
  "Which limit governs, because the constraint names the field that moved most rather than the limit and the reader supplies the limit from context.",
  "Whether the screening ran to completion, which the reader takes from a separate field because a constraint is reported whether or not the screening finished."],
 "A summary that names the governing limit reads like advice because it is written in plain English. What it actually does is rank the module's own limits against each other, and the three quantities above are all in `NOT_PROVIDED`.")

# ---- m05 ----
q(0, "A line's corrosion allowance is already fully consumed and somebody asks what allowance would reinstate the design life. What does this module do?",
 "It refuses. No bisection runs, because the door declines before any verdict exists to narrow on.",
 ["It bisects the total allowance until the design life verdict turns true, in the same way it would on any line, and returns the figure with the consumed depth included.",
  "It returns a negative remaining life, which is the signal a caller reads to tell a consumed line from one that still has allowance left on it to divide.",
  "It returns `requiredAllowanceMm` and leaves the reinstatement to the caller, since the required figure is the allowance a new line would need at that rate."],
 "Every inversion in this module narrows a bracket until a field or a flag the engine returns turns over. Where the door declines to issue that field at all, there is nothing to narrow on, and the decline is itself the answer to the question that was asked.")
q(1, "A remaining life and a rate category come off the same rate. Why can a capstone grade one of them and not the other?",
 "A life is a division over the caller's own numbers, while a category adds three unsourced edges on top of whatever the rate already carries.",
 ["A life is reported to six decimals and a category is a word, and a graded field has to be a number a tolerance can be applied to in the first place.",
  "A life is checked against the golden's own life rows and a category is not, so only one of the two has an independent derivation standing behind it.",
  "A life is exported by the engine and a category is returned only inside the whole screening, so only the life can be reached without running a screening."],
 "A capstone here states its rate from an inspection survey, so the division has no held constant anywhere in it. The category would still carry three edges the engine declares unsourced in `categoryHeld`.")
q(3, "A reader quotes a pressure in bar off the studio screen and a colleague quotes one from a direct engine call. Why might the two differ?",
 "The studio divides a psig pressure by 14.5038 and the engine's factor is 14.503773800722, so the two conversions separate in the sixth significant figure.",
 ["The studio works in bar gauge and the engine works in bar absolute, so the two differ by one atmosphere wherever the conversion has not been applied twice.",
  "The studio applies the fugacity coefficient to the pressure before it displays it, so a screen value is the fugacity and a direct call returns the partial pressure.",
  "The studio rounds every pressure to six decimals on the way out, and the engine carries the full double, so the two differ in whatever the rounding discarded."],
 "The course lists every one of the studio's conversions for exactly this reason: a learner reading a number off the app needs to know which layer produced it. Every graded condition in this course is stated in the engine's units.")
q(2, "A programme is short on effective protection. The engine's warning names a metal-loss figure. What is that figure against?",
 "The metal loss the datasheet efficiency alone would have given, which is why availability is what limits the result.",
 ["The metal loss at zero corrosion inhibition, which is the uninhibited rate.",
  "The metal loss at the shipped default programme of 90 percent efficiency and 95 percent availability, which is the reference case the warning is written against.",
  "The metal loss the allowance can absorb over the design life, which is what turns the shortfall in percentage points into a statement about the wall."],
 "A programme at 95 percent efficiency and 80 percent availability delivers 76.000000 percent effective protection, 19.000000 percentage points short, at 4.800000 times the datasheet metal loss. At the shipped 90 and 95 the shortfall is 4.500000 percentage points.")

# ---- m06 ----
q(1, "Before the repair thirteen defects planted one at a time left the validation suite entirely green. What did the repair put in place of the routes that missed them?",
 "Work split three ways with the file saying which is which: genuinely independent routes, constant-free invariants, and pins against a third copy of each constant.",
 ["A tighter tolerance on every route, which is what turns a comparison that admits a planted defect into one that separates on it and reports the size of the gap.",
  "A larger golden, from 17 whole cases to 110 rows in 17 blocks, so that every door in the module carries at least one case rather than being covered by inference.",
  "A second oracle written by a different author, so that the two oracles and the engine make three derivations and any two of them agreeing is no longer enough."],
 "The route table lists what each route cannot check, the pin table carries 30 pins measured out of the behaviour, and the invariant checks carry the invariants. Naming which is which is what makes the coverage readable.")
q(2, "A blank temperature once reached a green label on a screen. Which two of the current behaviours would stop that same input reaching a label at all?",
 "The whole screening door refuses when any of six boxes is blank and names the box, and the category door returns null rather than a word for a rate it was not given.",
 ["The fugacity door returns not-a-number below absolute zero, and the category door returns negligible only for a rate that is zero or below rather than for a small one.",
  "The transport term returns not-a-number rather than infinity, and the binding constraint reports the model as not applying wherever a screening has come back incomplete.",
  "The pH correction refuses below its reference, and the withheld block names the category and the life wherever the CO2 rate model has stopped describing the surface."],
 "A typed zero is treated differently from a blank. A typed zero CO2 mole fraction is a positive assertion of no CO2 and the module withholds its category and its life, while a blank box is a question the engine cannot answer.")
q(3, "The vendored gate asserts that a blank velocity makes the transport term not-a-number rather than merely asserting that it is wrong. Why the specific shape?",
 "Because infinity is the value that flatters the answer, and a gate that only required a wrong value would pass on a defect that is still wrong in the same direction.",
 ["Because not-a-number and infinity are the same value once the series combination has been formed, so only the raw term can tell the two of them apart.",
  "Because the golden carries a row for a blank velocity and the comparison is made against that row, which holds not-a-number as its expected value.",
  "Because the whole screening door refuses on a blank velocity, so the bare term is the only place the value can be observed before the refusal is raised."],
 "An infinite transport capacity makes the series combination exactly equal the reaction term, so the engine named reaction kinetics as controlling from an input nobody had supplied, and the rate came out several times the correct one.")

# ---- cross-module ----
q(3, "A band edge moves and a held correlation constant moves. Which of the two changes a binding constraint?",
 "The correlation constant. Moving a band edge changes words and nothing else, while moving a correlation constant moves every rate and every life.",
 ["The band edge, because the step of the sequence that tests the allowance against the design life reads the band before it reads the remaining life.",
  "Both, because the binding constraint is chosen from the seven numbers on the screening and the category is one of the seven it ranks between.",
  "Neither, because the binding constraint is chosen by a sequence of questions whose answers are all flags rather than numbers the two moves could reach."],
 "The allowance step reads the life and the design life, the transport step compares two terms of the rate, and the shear step compares the shear against a threshold. A category is not read anywhere in the sequence.")
q(1, "A stream binds on the corrosion allowance against the design life at 1.7 yr of 20 yr, short by 30.75 mm. What has the reader still not been told?",
 "What thickness to retire at and when to inspect next, because the module carries no retirement criterion and no inspection interval.",
 ["What the rate was, because the constraint reports the life and the shortfall and leaves the rate to be read off a separate field on the same screening.",
  "Whether the corrosion inhibitor film survived, because the shear step sits below the allowance step in the sequence and is therefore not yet reached.",
  "Whether the model applies, because the applicability step is the last of the sequence."],
 "The allowance step is reached only because the model applies and the film survives, so both of those have already been settled. The retirement thickness and the inspection interval are in `NOT_PROVIDED` and neither is anywhere in the module.")
q(2, "The corrosion inhibitor warning trigger is 0.100000 percentage points of shortfall today and the pre-repair guard fired above 90 percent efficiency. What did the change of quantity buy?",
 "A guard on the output the warning is about, which survives a change in which of the two inputs a programme happens to be short on.",
 ["A guard that fires more often, which is what makes the warning visible at the shipped defaults where the previous one had been silent about the availability.",
  "A guard with a pinned trigger, which is what lets the course measure it.",
  "A guard that is inclusive rather than strict, which is the whole of the repair and is why the shipped efficiency of exactly ninety now passes through it."],
 "The old guard tested an input. The same guard was equally silent at ninety percent efficiency and fifty percent availability, which is a programme in serious trouble on the other input.")
q(0, "The category bands are both pinned and held. What does each of those two words buy?",
 "Pinned means nobody moved them quietly. Held means no source for them exists in this repository, and the second is the one that decides what can be graded.",
 ["Pinned means they are validated against the golden's own copy, and held means they are validated against the engine's export, so between them the edges are checked twice.",
  "Pinned means the golden carries rows either side of each of them, and held means the engine declares them in a field.",
  "Pinned means they are measured rather than read, and held means they are enforced as a range guard."],
 "Twelve golden category rows and a measurement by bisection establish that the edges are where the course says they are. Neither establishes where the numbers came from, and `categoryHeld` comes back true beside the word.")
q(2, "A programme manager reads an effective corrosion inhibition of 85.500000 percent and a band word on the same screen. Which of the two can they take to a supplier meeting as a number?",
 "The effective figure, because it is arithmetic over two typed percentages with no correlation constant anywhere in its chain.",
 ["The band word, because it reconciles the rate against three edges the golden pins from both sides, which is more evidence than a single percentage carries.",
  "Both, because the screening returns them together and the studio prints the held list behind a disclosure so a reader can see what each one rests on.",
  "Neither, because both are computed from the same stream conditions and every chain in this engine passes through at least one unsourced constant."],
 "The shortfall on that case is 4.500000 percentage points against the datasheet figure. The word is three comparisons against three unsourced edges laid on a rate, and `categoryHeld` comes back true beside it.")
q(1, "The binding constraint is derived from what the screening has already computed. What does it add to the pin table and to the held list?",
 "Nothing to either. The held list stands at 11 items and the pin table at 30 constants.",
 ["Two entries to the held list, being the reporting margin of the comparable step and the ordering of the six questions the sequence walks through.",
  "One entry to the pin table, being the controlling reporting margin, which is measured by solving for the velocity that puts the two terms a stated ratio apart.",
  "Four entries to the held list, one for each of the constraint types."],
 "The held list carries 11 items and the pin table 30 constants either way. The reporting margin belongs to the controlling word, which the summary reads, so it is not something the summary brings with it.")
q(2, "The shipped default screen carries a rate, a word, a partial pressure, an effective protection figure and a remaining life. Which of those can a capstone in this course grade?",
 "The partial pressure and the effective protection figure, because one is a total pressure times a mole fraction and the other is arithmetic over two typed percentages.",
 ["The rate and the remaining life, because both are computed by the engine and both are reported to six decimals, which is the precision a graded field is checked at.",
  "The word and the remaining life, because the band edges are pinned and the life is a single division, so both are traceable to numbers the course measures.",
  "All five, because every figure on that screen is reproduced by the golden and the golden agrees with the engine on all seventeen of its whole cases."],
 "The rate rests on held constants and the word adds three more on top of it. The remaining life is a division that rests on a rate, which is why a capstone states its rate from an inspection survey rather than taking it from the correlation.")
q(0, "Set a screen that returns seven unreconciled numbers beside this engine's screening. What do they share, and where do they part?",
 "Both carry seven independent numbers. This engine's adds a summary naming which of its own limits governs, derived from what it had already computed.",
 ["Both print a binding constraint. This engine's derives it from the numbers rather than from the largest of them, which is what the other ranks by.",
  "Both withhold a category in the sulphide regime. This engine's adds the withheld block, which the other reports as an empty paragraph instead.",
  "Both refuse on a blank density. This engine's adds the message naming the box, which is what makes the refusal actionable rather than merely present."],
 "A screen that returns seven numbers and reconciles none of them is a screen the reader summarises by reading the largest number, and that is a property of the units rather than of the engineering.")
q(3, "This course grades no corrosion rate the correlation produced. Which single fact is the reason?",
 "Every de Waard-Milliams constant is held, so every rate built out of them inherits an unsourced chain.",
 ["The golden is synthetic, so no rate in it can be compared against a published case and the tolerance it is checked at has no meaning attached to it.",
  "The rate depends on the wall shear verdict, so a rate graded at one velocity would be graded at a different chain from a rate graded at another velocity.",
  "The studio's psig divisor is truncated, so a rate converted through the app differs from a rate converted through the engine's factor in the sixth figure."],
 "The other three statements are all true of this module and none of them is the reason. The category word inherits that chain and adds three unsourced edges of its own, which is why no graded field is a band label either.")
q(1, "Three of these fields declare their own absence and one does not. Which is the one that does not?",
 "The remaining life when the corrosion allowance box is blank, which comes back null with the screening reporting itself complete and nothing on the screen saying why.",
 ["The category in the sulphide regime, which comes back null while the withheld block names the reason and the rate is kept as a stated upper bound.",
  "The effective corrosion inhibition in the oil-wet regime, which comes back null rather than zero because there is nothing to be effective against.",
  "The severity region on every screening, which comes back with `regionProvided` false so that a caller cannot read the gap as an unset property."],
 "The other three absences are all declared, each in its own way. Ask of every field whether its absence is declared or merely missing, because a missing field is a question nobody asked and the reader supplies the answer from their own expectations.")
q(2, "A reader wants to argue with a rate rather than accept it. What does this engine give them to argue with?",
 "The factors reported separately, the controlling term, the credited rate beside the rate, the binding constraint and the held list behind all of it.",
 ["The pin table, which shows every constant the rate was built from measured out of the behaviour and compared against a literal in a third file.",
  "The seventeen whole golden cases, which show the engine agreeing with an independent derivation to the last bits of a double on almost every one.",
  "The category word and `categoryHeld`, which together say how fast the loss is and how much confidence the module is prepared to put behind the word."],
 "The whole screening door reports every factor separately rather than returning one number. The pin table and the golden are evidence about the implementation rather than about the stream in front of the reader.")
q(0, "A stream screens above the 0.003500000000 bar H2S threshold. What does this module tell the engineer about the steel for the line?",
 "That the stream is sour by the screening comparison and nothing more. Which material qualifies has to come from a sour-service assessment made outside this module.",
 ["That carbon steel is acceptable up to the first region boundary, since the threshold marks the lower edge of the mildest band the engine still classifies against.",
  "That a corrosion resistant alloy is required, because any stream above the threshold lands in the hardest recommendation the module returns for a sour regime.",
  "That the choice follows from the H2S to CO2 ratio, since the regime word the engine returns beside the sour flag names the material family to specify."],
 "The sour flag is a comparison against one held number. The severity region and its three material recommendations were withdrawn, and the engine reports that through `regionProvided` and `materialGuidanceProvided`, both false.")
q(3, "One course section describes behaviour this engine no longer has, and one describes a current absence that looks like history. How are the two told apart?",
 "The history section says so in its own title and its first line and nothing follows it. The withdrawal section says in its own second line that it is not repair history.",
 ["The history section is the only one that names the repair, and the withdrawal section is identified by the two flags it describes rather than by anything it says.",
  "The history section is the last in the course and the withdrawal section is the second, so their positions in that list are what carry the frame for each of them.",
  "Neither is told apart in the text. The frame lives in the module directory name in the course and in the lesson heading, which is where the gate looks for it."],
 "The withdrawal is current, permanent and declared: the engine returns two false flags today and will keep doing so. Writing it as something the engine might get back is a defect.")
q(1, "A capstone states its rate from an operator's inspection survey. What does that survey rate still not tell the allowance arithmetic?",
 "Where on the line the metal is going, because the arithmetic divides an allowance by an average and this module has no localised model at all.",
 ["What the design life is, since a survey rate arrives without one and the remaining-life door cannot form a verdict or a required allowance without it being stated.",
  "Whether the corrosion inhibitor film survived, since a survey rate is measured on the wall and carries no information about the shear that produced it.",
  "What the units are, since a survey reports in mils a year and the door works in millimetres a year, which is the conversion the studio applies on the way out."],
 "Stating the rate takes every held correlation constant out of the graded chain. It does not put a geometry into a number that has none, and the engine names a localised-attack rate among the things it does not provide.")
q(2, "A caller reads a screening and finds no severity region and no material guidance. What has the engine committed itself to?",
 "That both are absent by decision rather than by omission, because two fields say so and will keep saying so.",
 ["That both are held pending a source, in the same way the eleven items on the held list are, and that the studio will print them once one is vendored.",
  "That both were not computable at these conditions, which is what a caller reads from an absent field and is why the studio prints the conditions beside it.",
  "That both belong to another course named in the scope seam."],
 "A held item is waiting on a source and a scope gap is outside what the module attempts. This is neither, which is why it is off the held list, marked withdrawn on the not-provided list, and reported through two flags of its own as well.")
q(0, "What is the shortest honest description of everything this module knows about integrity?",
 "A corrosion allowance divided by a rate.",
 ["A corrosion allowance divided by a rate, checked against a minimum thickness the module forms from the design pressure it was handed for the line.",
  "A corrosion allowance divided by a rate, with an inspection interval derived from the remaining life and the risk basis the studio carries behind a disclosure.",
  "A corrosion allowance divided by a rate, set against the retirement thickness that the not-provided list names as the one integrity quantity the module holds."],
 "That is the whole arithmetic. The word invites four expectations the module cannot meet, which is why this course states the narrow reading every time the word appears.")

emit(Q, '/root/wt-fc9-nextgen/tools/course-banks/corrosion/advanced/fc9a_exam.json', expect_n=42)
finish()
