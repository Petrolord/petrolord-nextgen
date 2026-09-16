import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC3 Associate final exam, 42 questions across digest Sections 1 to 5, with
# Section 17 read again for what "held for literature" means. No key is a
# region, a percentage of best efficiency flow or a preferred flag, because
# Section 5 holds its bands for literature. The Section 16 golden figures are
# not quoted: that section sits inside the Expert span of the digest.

# --- what these engines size, and what they refuse ---

q(0, "A single units file is read by both pumps.js and compression.js. What does that arrangement buy?",
 "One definition of a horsepower serving the liquid machine and the gas machine, so a kilowatt in a pump return and a kilowatt in a compression return are the same conversion applied twice.",
 ["A single point at which a caller can override the packagings for a project working in other units.",
  "A guarantee that the two modules were written at the same time and carry the same vintage of every constant.",
  "A place for the two modules to keep the compressibility window they both have to work inside."],
 "Two modules that each need a horsepower could have written one each. They read one file instead, which is what makes their two returns comparable."),

q(2, "A junior engineer reports that a pump sizing call raised no exception, so the inputs must have been accepted. What is the flaw?",
 "Neither module throws, so a refused call comes back as an ordinary object with an error string in it and nothing is raised at all.",
 ["Exceptions are raised only for inputs that are absent, so an input that is present and out of its domain passes through the guard silently.",
  "The studio catches the exception before the caller sees it, so the absence of one at the call site proves nothing.",
  "The refusal is raised on the next call rather than this one, because the guards run one step behind the chain."],
 "A caller checks a property on the result rather than wrapping the call in a try block."),

q(3, "Why is NaN a better refusal than a plausible number for an export with nowhere to put an error string?",
 "Nothing downstream could ever detect a plausible number, and NaN fails every comparison including one with itself.",
 ["NaN is the only value the print formatting refuses to render, so it cannot reach a report at all.",
  "A plausible number would be caught by the next guard in the chain, which costs a call that NaN saves.",
  "NaN is cheaper to produce, because the export can return before doing any of the arithmetic."],
 "It poisons any arithmetic it touches, so a caller who ignores it gets a result that is visibly broken rather than quietly wrong."),

q(1, "A station study claims the selected compressor is safe across its whole turndown. Which part of that claim do these engines have nothing to say about?",
 "All of it below the point where the machine stops delivering, because there is no surge line and no surge margin anywhere in the package.",
 ["The discharge temperature at low rate, which the module computes only at the rated point.",
  "The power at low rate, which the module reports only as a total across the train.",
  "The stage count at low rate, which the module fixes at the design case and does not revisit."],
 "With the surge line go the recycle valve and the anti-surge calculation. A result that says nothing about a failure mode is not a result that clears it."),

q(2, "A pump report is asked to include the pressure drop through the discharge piping. Where does that number come from?",
 "engines/facilities/lineHydraulics.js, which is a different engine module and a different course.",
 ["The system curve, which already carries it as the friction head the caller supplied.",
  "The duty solve, which separates the static and friction parts of the duty head.",
  "The discharge pressure conversion, which turns the friction head into psi at the service gravity."],
 "These two modules size machines. The system curve takes a friction head as an input rather than working it out."),

q(0, "Two of the pump module's refusals concern the static head and the friction head of a system curve. What is the asymmetry between them?",
 "A negative static head is accepted and a negative friction head is not.",
 ["A missing static head is accepted and a missing friction head is not, because the coefficient can be formed without the lift.",
  "Negative friction is accepted and negative static is not.",
  "Both are refused when negative."],
 "The message says a static head may be negative but cannot be missing. A pump discharging into a vessel below it is an ordinary station."),

# --- two curves ---

q(3, "A catalogue of four readings is handed to the fit. How many of them does the fitted curve pass through?",
 "None, because a quadratic has three coefficients and four points leave no curve that hits all of them.",
 ["All four, which is what distinguishes a least-squares fit from an interpolation.",
  "Three, the fourth being the shutoff reading, which is used to fix c0 rather than fitted.",
  "Two, the fit being anchored at the ends of the published range and free between them."],
 "The four residuals are 0.203016, -0.593431, 0.551043 and -0.160628 ft, and the signs alternate down the column."),

q(1, "What is the scale in the OKONO fit taken from, and what is it for?",
 "The largest flow in the point set, 1900.000000 gpm, used to normalise the flow before the quadratic is solved.",
 ["The largest head in the point set, 540.000000 ft, used to normalise the head so the residuals are dimensionless.",
  "The flow at which the friction head is stated, 1100.000000 gpm, so that both curves share one reference.",
  "The shutoff head of 540.203016 ft, used to express the fall in head as a fraction of what the machine makes at no flow."],
 "The quadratic is written in q over the scale, which keeps the three coefficients within a few orders of magnitude of each other."),

q(2, "The four OKONO residuals are 0.203016, -0.593431, 0.551043 and -0.160628 ft. What is notable about that column?",
 "The signs alternate down it, which is a fit behaving.",
 ["They fall in magnitude as the flow rises, which is the fit tracking the steepening part of the curve more closely than the flat part.",
  "They are largest at the two ends of the range, where the quadratic has least freedom to bend.",
  "They are all positive, since a least-squares fit sits above every reading it was given."],
 "Alternating signs are the pattern a least-squares curve leaves when it threads scattered readings rather than chasing any one of them."),

q(0, "Two fits come back, one with an R squared of 0.999985896 and one with an R squared of 1.000000000. Which is the better pump curve?",
 "That cannot be decided from those two figures, because R squared grades the fit against its points and says nothing about the shape.",
 ["The second, whose perfect score means the readings and the curve agree exactly at every point supplied.",
  "The first, because a perfect R squared means the fit had no freedom left and the point count must have been at the minimum.",
  "The second, provided its condition number also sits inside the range this course reports."],
 "The perfect score belongs to a rising point set, which the same return disowns with a droops flag of false and a warning in prose."),

q(3, "The engine could have answered 1 or 0 for R squared on a flat point set. What would either choice have handed the caller?",
 "A number standing where there is no number, which whatever reads the return next would take for an honest measurement.",
 ["A score that could be compared against the OKONO fit, which is the comparison the null return makes impossible for a reader to draw.",
  "A value the conditioning report would then contradict, since the two are formed from the same matrix.",
  "An answer consistent with the droop flag, which is also false on that point set."],
 "R squared is the share of the variance the fit explains, and three identical heads have no variance at all."),

q(1, "The OKONO condition number of 334.938111 is described as unremarkable. Against what?",
 "The band the reported figure occupies across all seven of the point sets this course fits without a refusal.",
 ["The sixteen decimal digits that double precision carries, of which a figure of this size costs the coefficients two or three.",
  "The 366.680892 of the first published curve golden, which is the only other figure the course reports.",
  "The conditioning note, which the engine would have filled in had the figure been anywhere near a limit."],
 "Conditioning is hard to read from one figure. Seen against its own spread, a few hundred is ordinary for this solve."),

q(0, "The engine both warns in prose and sets a boolean about a curve that climbs with flow. Which of the two can the duty solve act on?",
 "The boolean, which is the half the next function can test.",
 ["The prose, because it names the fault and the remedy, which is what the solve reports back to the caller.",
  "Both equally, since the solve parses the warning string when the boolean is absent from an older return.",
  "Neither. The solve refits the points itself rather than reading either field."],
 "A warning string can be shown on a screen and can carry advice. Only the flag can be read by the code that acts on it."),

q(1, "On the OKONO pair of curves the difference column reads 18.187407 ft at one flow and -157.467056 ft at the next. What has that pair of rows fixed?",
 "The two flows the answer must lie between, since the column changes sign there.",
 ["The residual the solve will finish on, which is bounded by the smaller of the two figures.",
  "The bracket the search starts from, which the engine takes as the two heads rather than the two flows.",
  "The static head of the station, which is what the two figures differ by."],
 "A sign change across one interval is a bracket. The bisection needs exactly that and nothing more before it can start."),

q(2, "The OKONO duty solve reports 55 halvings against a cap of 200. What does the gap between those two figures mean?",
 "The search stopped because the midpoint stopped moving rather than because it ran out of budget.",
 ["The search used a quarter of its budget and would have improved the answer had it been allowed the rest.",
  "The cap was never reached, so the convergence flag was set on the halving count alone.",
  "The remaining halvings were spent confirming the residual, which is why the bracket is so much smaller than the tolerance."],
 "The cap of 200 is a guard rather than a plan. The loop breaks exactly where a blind one was already standing still."),

q(1, "In the negative control the search finishes on a bracket of 1.1368683772161603e-13 gpm. What does that width prove?",
 "Nothing about correctness. The search collapsed exactly as it always does, and it collapsed onto the wrong flow.",
 ["That the curve returned a non-finite head at the flow the search settled on.",
  "That the search ran one halving longer than the healthy solve and therefore overshot.",
  "That the two curves agree at that flow to within the resolution of the numbers themselves."],
 "A flag made only of that bracket would have called the solve converged and would have been telling the truth about the bracket."),

q(0, "The negative control returns a flow, a head and a cleared flag rather than a refusal. What does the caller gain?",
 "The ability to see how far off the search went, which a refusal carrying no numbers would not give.",
 ["A result that can be fed into the power call, since the flow is still inside the searched range.",
  "A guarantee that the fields will be filled in, which a refusal object does not offer for any export.",
  "An answer that can be compared against the blind loop, which is the only other way to reach the same flow."],
 "The return is complete and every field in it prints normally. The one field that says the number is wrong is the one a hurried caller skips."),

q(2, "Which of the duty solver's refusals is a statement about the search rather than about the hardware?",
 "The one saying the curves do not cross below the stated limit.",
 ["The one saying the curve does not fall with flow, since a rising point set is a data fault rather than a machine fault.",
  "The one saying this pump cannot start this system, since the caller chose the static head.",
  "The one saying both a pump curve and a system curve are needed, since a missing object is a calling error."],
 "Nothing is wrong with the pump and nothing is wrong with the station. The message offers both readings: raise the limit, or check the system curve."),

q(3, "A selection is refused because the pump cannot start the system. What does the evidence in that refusal let an engineer work out?",
 "How much bigger the machine has to be, since the shutoff head and the static head are both handed back.",
 ["Which of the four catalogue readings was responsible, since the refusal names the point it judged on.",
  "What flow the station would run at with a larger static head, since the refusal carries the crossing it found first.",
  "Whether the fit or the system curve was at fault, since the refusal names the object it was reading when it stopped."],
 "540.203016 ft of shutoff against a static head of 700.000000 ft, a gap of 159.796984 ft. That is the difference between being told no and being told how much."),

q(1, "The same OKONO machine is put into three different stations. What does that do to the duty flow?",
 "It gives three different flows, 1234.452969 gpm, 804.694816 gpm and 1103.518695 gpm, off one set of catalogue readings.",
 ["It gives one flow with three different heads, since the machine fixes the flow and the station fixes the head.",
  "It gives three flows that differ only in the static part of the head, the friction part being a property of the pump.",
  "It gives three flows whose average is the rated flow the catalogue would print."],
 "A duty point is a property of a pump and a station together. The rating belongs to the curve and the duty belongs to the installation."),

q(0, "Why does stating a system as a friction head at a flow tell an engineer more than stating it as a coefficient?",
 "A measured pair is what a station can actually supply, and the coefficient is then the engine's own arithmetic.",
 ["A coefficient cannot be read back off the return, so a station stated that way loses the evidence for its own curve.",
  "A coefficient carries the static head inside it, so the two parts of the head cannot be separated at the duty.",
  "A coefficient is expressed in the normalised variable of the fit, so it has to be rescaled before either curve can be solved."],
 "Nobody walks a station with an instrument reading ft per gpm squared. They read a head and the flow it was read at."),

# --- power, head and pressure ---

q(3, "Three powers come out of the OKONO duty. Which one is the driver specified against?",
 "The brake power of 183.041884 hp.",
 ["The hydraulic power of 135.450994 hp, which is the work actually done on the fluid.",
  "The motor input of 198.958569 hp, which is what the electrical supply has to deliver.",
  "The motor input of 148.363379 kW, which is the same figure in the units the load list uses."],
 "Hydraulic power tells you what the duty is worth, and motor input is what the electrical load list and the running cost are built on."),

q(1, "The pump loses 47.590890 hp and the motor a further 15.916686 hp. Where did those two figures come from?",
 "From the three powers, by subtraction, each loss being the step between one figure and the next.",
 ["From the two stated efficiencies applied to the hydraulic power, each loss being the efficiency times the duty.",
  "From the engine, which reports each loss as a field of its own beside the three powers.",
  "From the default motor efficiency, which fixes the motor loss, with the pump loss taking the remainder."],
 "Two efficiencies applied in series, each taking its share. The pump efficiency acts on the hydraulic power and the motor efficiency acts on the shaft power."),

q(2, "What changes inside the machine between the lightest and the heaviest fluid in the five-row pressure table?",
 "Nothing. It raises every one of those fluids by the same height, and what each fluid weighs turns that height into a pressure.",
 ["It works harder on the heavier fluid, which is why the head column is held while the pressure column moves.",
  "It spins at a speed set by the fluid, which is what the specific gravity enters the conversion as.",
  "It delivers the same pressure and a different head, the table being printed with the two columns the other way about."],
 "It spins at the same speed and throws the fluid out at the same velocity on every row. Only the weight of what it is throwing has moved."),

q(3, "A pump is quoted at 188.100891 psi in produced-water service. What travels unchanged if the same machine is moved to a light condensate?",
 "The head.",
 ["The discharge pressure, which is a property of the machine at its duty.",
  "The hydraulic power, since the duty flow and the duty head are both unchanged.",
  "The brake power, since the pump efficiency belongs to the machine rather than to the fluid."],
 "A curve in feet is a property of the machine alone, which is why one catalogue serves every service the machine will ever see."),

q(1, "pumps.js names almost nothing internally and exports no constants. What follows for a course that wants to state what is inside it?",
 "Every packaging has to be measured by asking the engine a question it can answer only one way.",
 ["Every packaging has to be quoted from the handbook the module was written against.",
  "Every packaging has to be taken from the published goldens, which record the constants their oracle used.",
  "Every packaging has to be read out of the module source, since an inline literal has no other definition."],
 "Choose inputs that make every other term in the expression equal to one, call the export, and read the packaging off the return."),

q(2, "Two of the four figures measured out of pumps.js are field packagings and two are not. Which two are the packagings?",
 "2.310000000 and 3960.000000.",
 ["0.745699871582 and 0.940000000000, the kilowatt conversion and the default the engine falls back on when no motor efficiency is stated.",
  "2.310000000 and 0.745699871582, the two that turn one unit of the chain into another.",
  "3960.000000 and 62.337662337662, the horsepower packaging and the density it carries."],
 "The kilowatts per horsepower is a unit conversion out of the shared units file, and 0.940000000000 is a default rather than a constant at all."),

q(0, "The motor efficiency argument is left off the power call and three complete powers come back. What has the engine done?",
 "The engine has used 0.940000000000, and nothing on screen says the figure was assumed.",
 ["The engine has used the pump efficiency in its place.",
  "The engine has returned the brake power in the motor input field, so the motor loss is absent.",
  "The engine has refused the motor input field."],
 "The power lesson stated 0.920000 and the engine used it. Leave the argument off and the answer looks exactly as complete as before."),

q(3, "Two packagings written into different functions for different purposes are each unpicked for the density they carry. What is the finding?",
 "They agree exactly, both implying 62.337662337662 lb per ft3.",
 ["They differ in the sixth decimal, which is the tolerance the power gate is written to.",
  "Only one of them carries a density.",
  "They differ by the ratio 1714.285714285714."],
 "The alternative would have been two slightly different waters living in one engine, and a pressure and a power that quietly disagreed about the same fluid."),

q(1, "What is held for literature about the water density this tier measures?",
 "What that implied density is away from real water, because the handbook figure it approximates is not in this repository.",
 ["The density itself, because it is written inline rather than exported and cannot be quoted.",
  "The difference between the two packagings, because no publication states how close they should be.",
  "The quotient that ties the two packagings together, because it is derived rather than measured."],
 "The packagings are the engine's own definitions and they are measurable, which is why the figures can be stated at all."),

# --- where the duty landed ---

q(2, "No best efficiency flow is supplied. Why is a refusal a better return here than a sensible assumption?",
 "A guessed best efficiency flow would produce a confident verdict about a pump nobody described.",
 ["A best efficiency flow can be recovered from the catalogue points, so the assumption would be redundant.",
  "The module has no default to fall back on because the figure differs between the two engine modules.",
  "The refusal is the only way to signal that the duty solve itself has not yet been run."],
 "The module has no default for this input, and the refusal is the same whether the figure is missing or negative."),

q(0, "Why can the least-squares fit not recover the best efficiency flow from the catalogue it was handed?",
 "The readings are heads and the best efficiency flow is a statement about efficiency.",
 ["The readings are too few, and a fifth point at the design flow would be enough to recover it.",
  "The readings are normalised by the scale.",
  "The readings are smoothed by least squares."],
 "A head reading and an efficiency reading are different measurements. The catalogue supplied only the first kind."),

q(1, "Four test flows, one comfortably inside each band, and the classifier passes. What has that test not exercised?",
 "The boundary values themselves, which are the only flows a wrongly written inequality misclassifies.",
 ["A band whose two ends have been written the wrong way round, which misclassifies everything inside it.",
  "A classifier that ignores the stated best efficiency flow, which misclassifies every flow it is given.",
  "A classifier that returns the label without the note, which misclassifies nothing and reports less."],
 "An implementation with the wrong inequality answers correctly at every flow except one, and that one is never in the middle of a band."),

q(3, "The boundary walk in this tier pairs each boundary with a point a tenth of a percent outside it. What does the completed table prove?",
 "That the classifier assigns those flows to those labels and that its boundaries behave consistently.",
 ["That the boundaries sit exactly where pump practice puts them, which is what makes the labels usable in a real selection.",
  "That the duty of the OKONO station is comfortably clear of every boundary in the table.",
  "That the classifier is the only part of the module whose behaviour is fully covered by the course."],
 "It says nothing at all about whether the boundaries are in the right places, which is the question held for literature."),

q(2, "One returned note tells the reader that the module producing it cannot assess the hazard it has just described. What is the limitation?",
 "The module carries the required NPSH as a single number rather than as a curve against flow.",
 ["The module carries the best efficiency flow as an input rather than deriving it from the catalogue.",
  "The module carries the operating bands as fixed percentages rather than as vendor-supplied limits.",
  "The module carries no record of whether the duty it was handed came off a converged solve."],
 "The note is about the module rather than about the pump. The pump is fine, and the figure supplied about it has stopped applying."),

q(0, "What does the module do when the required NPSH it was handed no longer applies at the flow the duty solved to?",
 "It runs the check anyway and marks the assumption, returning every field it would otherwise return.",
 ["A refusal, because the module compares the flow the figure was quoted at against the duty flow.",
  "A margin with the severity suppressed, because the module knows the figure is out of date.",
  "A margin computed on the required NPSH the module interpolates to the duty flow."],
 "It computed what it was asked for and said, in the return itself, what that computation rests on. Nothing was invented and nothing was hidden."),

q(1, "The engine's note about running well below best efficiency flow is the only place in the package where two machine parts are mentioned at all. Which two?",
 "Bearings and seals.",
 ["Impellers and wear rings, whose clearances the note says open up at low flow.",
  "Couplings and shafts, which the note says are loaded in a direction that changes.",
  "Valves and recycle lines, which the note offers as the remedy for the condition."],
 "Recirculation is unsteady, so it loads the shaft in a direction that changes. That sentence in prose is the whole of what the package knows about them."),

# --- the reading ---

q(3, "In what order should the Associate capstone be worked?",
 "Fit, then system curve, then duty, then the power and the pressure.",
 ["Duty, then fit, then system curve, then the power and the pressure, since the duty fixes which part of the curve is in use.",
  "System curve, then duty, then fit, then the power and the pressure, since the station is what the machine is chosen against.",
  "Fit, then duty, then system curve, then the power and the pressure, since the crossing is solved on the fitted curve alone."],
 "The list of six graded answers is an order of presentation. Working down it produces four correct calculations on an unchecked flow."),

q(2, "Which of the capstone answers are correct calculations on whatever duty flow they happen to be handed?",
 "All four that sit downstream of it.",
 ["Only the discharge pressure, since the three powers are taken from the catalogue rather than from the crossing.",
  "Only the two powers expressed in horsepower, the kilowatt figure being a conversion of a conversion.",
  "None of them, since each is a separate export called with inputs taken straight from the prompt."],
 "That is what makes a wrong duty so hard to spot downstream: none of the four can disagree with it, because each one was computed from it."),

q(0, "What is the single habit this tier has been teaching, made concrete by the capstone?",
 "Check every flag before using the number beside it.",
 ["Measure every packaging before quoting it, since none of them is exported or named.",
  "State every efficiency explicitly.",
  "Solve every crossing before quoting a flow."],
 "The capstone is built so that it pays. A flag with no reachable false case is decoration, and this tier ran the false case of both of its flags."),

q(1, "Two answers from the capstone are held up: the duty flow and the discharge pressure. What is each a property of?",
 "The duty flow of the pump and the station together, and the discharge pressure of the pump, the station and the fluid together.",
 ["The duty flow of the pump alone, and the discharge pressure of the pump and the fluid together.",
  "Both of the pump and the station together, the fluid entering only the power chain.",
  "The duty flow of the station alone, and the discharge pressure of the machine alone."],
 "Neither is a property of the machine by itself, which is the mistake every version of the tier's warnings comes back to."),

q(2, "What does the next tier add that this one deliberately left out?",
 "The suction survey, a change of speed or diameter, and the fact that a catalogue curve is a water curve.",
 ["The compressor, its stage count, the cooling between its stages and the fuel the driver on the end of it burns.",
  "The published golden cases and the tolerance an engine gate against them has to carry.",
  "The conditioning of the fit and the report the duty solve leaves behind."],
 "Those are the three ways a duty that works on paper fails, and the whole of that tier is built around them."),

emit(Q, '/root/wt-fc3-nextgen/tools/course-banks/rotating/beginner/fc3b_exam.json', expect_n=42)
finish()
