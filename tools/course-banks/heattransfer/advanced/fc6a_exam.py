import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC6 Expert final exam. 42 questions across all six Expert modules.
# Three of them reach digest ground the tier's own lessons do not: the two
# bundle refusals of section 14, the declared bounds table of section 20, and
# the hot-day refusal at a check ambient hotter than the process it cools.

# --- rating and the other question ---------------------------------------
q(0, "A rating and a sizing ask different questions of the same exchanger. What does a rating start from?",
 "A surface you already own, and it returns what fraction of the possible heat that surface moves.",
 ["A duty you have specified for two streams, and it returns the surface and the bundle that will deliver it.",
  "A driving force you have measured, and it returns the coefficient the surface must carry.",
  "A tube count you have chosen, and it returns the film coefficient that count produces."],
 "Effectiveness is that fraction, and NTU is the surface written dimensionlessly.")

q(2, "At an NTU of 8.000000 and a capacity ratio of 0.350000 the three arrangements return 0.996407, 0.740726 and 0.829902. Which of those is the parallel figure, and what is it near?",
 "0.740726, which is close to the parallel ceiling of 0.740741 at that capacity ratio.",
 ["0.829902, which is close to the parallel ceiling of 0.830054 at that capacity ratio.",
  "0.996407, which is close to a ceiling of 1.000000 that parallel flow carries at every ratio.",
  "0.740726, which is close to the 1-2 shell ceiling at that capacity ratio."],
 "The 1-2 shell figure of 0.829902 approaches its own ceiling of 0.830054, and 0.996407 is counter-current, which has no ceiling to approach.")

q(3, "A 1-2 shell unit is asked for an effectiveness of 0.820000 at a capacity ratio of 0.650000 and refuses. What comes back beside the message?",
 "The ceiling of 0.703560.",
 ["The NTU of 16.742253 the request would have needed.",
  "The parallel ceiling of 0.606061 for comparison.",
  "Nothing, since this door carries a message alone."],
 "The message itself rounds to 0.704 so that it reads. A caller showing only the message has thrown away the number a designer needs.")

q(1, "Why is a 1-2 shell ceiling higher than a parallel one at the same capacity ratio?",
 "One of its tube passes runs against the shell flow and the other runs with it, so it sits between the two arrangements.",
 ["It carries twice the surface for the same shell length, so it reaches further before it flattens.",
  "It is corrected by an F factor before the ceiling is reported, and F is at most 1.000000.",
  "Its shell flow is counter-current throughout, so only the tube turn-around costs it anything."],
 "At a capacity ratio of 0.350000 the pair is 0.740741 and 0.830054, and at 1.000000 it is 0.500000 and 0.585786.")

q(2, "A counter-current unit is asked for an effectiveness of 0.999000 at a capacity ratio of 0.650000. What does it return?",
 "An NTU of 16.742253.",
 ["An NTU of 10.210712.",
  "An NTU of 29.894634.",
  "A refusal carrying a ceiling, in the way the other two arrangements do."],
 "The figures 10.210712 and 29.894634 belong to effectivenesses of 0.990000 and 0.999990 on the same column. Each extra nine costs more surface than the one before it.")

q(0, "What does an arrangement change, and what does it leave alone?",
 "It changes the fraction and leaves the maximum alone.",
 ["It changes the maximum and leaves the fraction alone.",
  "It changes both, because the capacity ratio is taken per arrangement.",
  "It changes neither, because the capacity ratio and the NTU fix the answer."],
 "The maximum is the smaller capacity rate times the difference between the two inlet temperatures, and nothing about the arrangement enters it.")

q(3, "The published inversion rows run each direction and the recovered NTU returns the one the row started with. What does this module offer as the actual evidence instead?",
 "The oracle's marches, which never evaluate the closed form the engine uses.",
 ["The pinned constants, which make any change to the closed form a reviewed act.",
  "The published effectiveness column, which is read from a chart for each arrangement.",
  "The ceilings, which an inversion cannot reach."],
 "A march of the two-stream system, or of the three-stream shell system with the tube turn-around as a boundary condition, could have failed for a reason other than a typing error.")

# --- limits that discriminate ---------------------------------------------
q(1, "Three closed forms in three branches of this code return 0.527633 at one NTU and 0.988891 at another, with the capacity ratio held at zero throughout. What does the arrangement contribute?",
 "Nothing, because all three arrangements return the same figure on every row of that sweep.",
 ["A difference in the third decimal, which the table reports as equal after rounding.",
  "A difference only above an NTU of 2.600000, which is where the two ceilings begin to bite on the answer.",
  "A difference in the counter-current column alone, which has no ceiling to flatten it."],
 "Three separate closed forms in three separate branches produce one answer, and the engine reports the equality rather than leaving it to be seen.")

q(0, "Why is a limit where three branches must agree worth more to this module than one more ordinary case?",
 "A wrong constant in one branch breaks the row it sits on and leaves the other two untouched, so the disagreement names the branch.",
 ["A limit runs faster than a case, so it can be re-checked on every rebuild rather than at review.",
  "A limit is published and an ordinary case here is not, so only the limit carries a citation.",
  "A limit holds at every NTU, so one row of it covers the whole range of the relation."],
 "At a capacity ratio where the three legitimately differ, a wrong figure sits in a column where a different figure is expected and nothing says which of the two it should have been.")

q(2, "Which claim about this class of calculation is recorded as false, and where had it appeared?",
 "That every arrangement has a ceiling, and it had appeared in the studio help text.",
 ["That the log mean can equal the arithmetic mean, and it had appeared in the oracle.",
  "That a capacity ratio may exceed one, and it had appeared in the published file.",
  "That a 1-2 shell unit reaches the counter-current answer, and it had appeared in the engine."],
 "Counter-current flow has no ceiling below one, which is an analytic truth about the relation. A default arrangement makes a wrong general claim expensive, because counter-current is what the Rating tab opens on.")

q(3, "The published file is written by an oracle. For the bundle diameter, what does the oracle do instead of what the engine does?",
 "It bisects on the diameter until the geometry form balances.",
 ["It evaluates the same form in SI units and converts the answer back.",
  "It reads the pairs from a published table.",
  "It forms the diameter from the shell diameter less the clearance."],
 "Inverting an exponent is one of the easiest errors to make in that expression and one of the hardest to see in an answer, and a bisection cannot make it.")

q(1, "What can an independent route not catch on its own?",
 "A wrong form that both files hold.",
 ["A wrong implementation of a form the two files agree about.",
  "A slip of the hand in restating an expression in other units.",
  "An answer that fails to satisfy its own surface equation."],
 "Moving the wall factor of two the same way in the engine and in the oracle leaves every published case green. An analytic limit is what catches it.")

q(0, "What three things stand in for publication in this module, given that the file is declared synthetic?",
 "Route independence, the constant pins, and the analytic limits.",
 ["Route independence, the held register, and the declared bounds.",
  "The constant pins, the held register, and the inversion checks.",
  "The analytic limits, the inversion checks, and the measured roundings."],
 "Any figure in the file rests on at least one of the three, and a reader is entitled to ask which. The held register records what none of the three can reach.")

q(2, "One of the analytic limits this module leans on is self-consistency across the whole chain. What does that limit fix?",
 "A duty, a coefficient, a surface and a driving force that do not satisfy the equation they came from.",
 ["A wall term whose factor of two has been moved in the engine and in the oracle together.",
  "A closed form whose constant is wrong at high NTU, which shows as a ceiling never reached.",
  "Three separate branches of the code that must return one figure at a capacity ratio of zero."],
 "The three limits named in the other options are the thin wall against the flat plate, the two ceilings, and the collapse where three branches meet.")

# --- the air cooler --------------------------------------------------------
q(3, "ANTAN carries a duty of 15500000.0000 Btu an hour across an air rise of 26.000000 degF. What air mass follows?",
 "2483974.3590 lb an hour.",
 ["2777777.7778 lb an hour.",
  "36660.428319 lb an hour.",
  "186968.1844 lb an hour."],
 "The figure 2777777.7778 is the studio bay's air mass, 36660.428319 is ANTAN's bare surface in ft2, and 186968.1844 is its UA.")

q(0, "A forced-draft bay and an induced-draft bay differ in one input. Which figures move with it?",
 "The fan inlet temperature, the air density, the volume, the brake horsepower and the motor horsepower.",
 ["The bare surface, the log mean and the air mass, since the fan sits in a different stream from the bundle it serves.",
  "The duty and the design ambient, since an induced fan draws the air after it has been heated.",
  "The barometric pressure and the air heat capacity, both of which are read at the fan inlet."],
 "Nothing about the bundle changes. On the studio bay the fan inlet moves from 95.000000 to 125.000000 degF and the density from 0.071524401 to 0.067854412 lb per ft3.")

q(1, "At a barometer of 13.200000 psia the bay reports a density of 0.063880487 lb per ft3 and 648078.5374 actual ft3 a minute. What fan power goes with those?",
 "94.119941 brake horsepower.",
 ["84.515865 brake horsepower.",
  "103.531935 brake horsepower.",
  "94.003933 brake horsepower."],
 "The figures 84.515865 and 103.531935 belong to 14.700000 and 12.000000 psia on the same sweep, and 94.003933 is the studio bay's forced-draft fan power.")

q(2, "What does the air cooler report in its correction factor field, and what does the note beside it say the area is?",
 "An empty field, and a counter-current-basis area that a real cross-flow unit would have to exceed.",
 ["A value of 1.000000, and an area already corrected for cross flow at that value.",
  "An empty field, and an area the hot-day rating will correct once a check ambient is given.",
  "A value taken from the held register, and an area carrying the declared 10 percent margin."],
 "A real cross-flow unit needs more metal than the figure printed, and how much more is not available in this repository at all.")

q(3, "Which of these does an air cooler answer refuse rather than compute?",
 "A process outlet above the process inlet.",
 ["A design ambient below the process outlet.",
  "A barometric pressure below the standard base of 14.700000 psia.",
  "An air rise larger than the process temperature drop."],
 "A cooler takes the process down, and the message reads the two temperatures back so the caller can see which pair it rejected.")

q(0, "The air density export returns a bare NaN below absolute zero. What happens to that?",
 "The bay that calls it turns it into a named refusal rather than passing it on.",
 ["It is returned to the caller unchanged, which is the documented exception.",
  "It is replaced by the density at the standard base of 14.700000 psia.",
  "It is recorded in the held register, since a leaf correlation cannot be validated."],
 "A leaf correlation has nowhere to put an error key, which is why that export sits outside the module's error contract. The module documents the exception rather than making it silently.")

q(1, "ANTAN reports 86.879945 brake horsepower and 94.434723 motor horsepower at its design point. What separates the two figures?",
 "The motor efficiency, which this module declares at 0.920000.",
 ["The draft type, which puts the fan inlet at two different temperatures.",
  "The barometer of 14.300000 psia, which is applied to the shaft figure alone.",
  "The fan static pressure of 0.600000 inches of water, which the motor figure adds."],
 "A motor draws more than the shaft it turns, which is why a motor efficiency above 1 is refused. The studio bay shows the same pair at 94.003933 and 102.178189.")

# --- the hot day -----------------------------------------------------------
q(2, "A hot-day sheet shows a UA that drifts with the ambient while claiming a fixed surface and a fixed air mass. What does that tell a reviewer?",
 "Something has been recomputed that should have been carried, so the answer is wrong before any duty is read.",
 ["That the coefficient was taken on the bare surface rather than on the finned one.",
  "That the sheet was produced at more than one barometer, which moves the air mass.",
  "That the rating used the counter-current log mean where it should have used the hot-day one."],
 "The surface and the air mass fix UA. On the studio bay it reads 234565.8720 Btu an hour per degF at every ambient from 86.000000 to 124.000000 degF, and on ANTAN 186968.1844.")

q(0, "ANTAN at a check ambient of 98.000000 degF returns a duty fraction of 1.000000 and a duty of 15500000.0000 Btu an hour. Why?",
 "That is its design ambient, so the rating returns the design duty.",
 ["That is the ambient at which its effectiveness of 0.562044 reaches its ceiling.",
  "That is the ambient at which its air rise of 26.000000 degF is recovered exactly.",
  "That is the studio bay's design ambient, and the two bays share a design point."],
 "The studio bay's design ambient is 95.000000 degF, and at 98.000000 degF it is already labelled hotter than design with a fraction of 0.980645.")

q(3, "On the studio bay at a check ambient of 124.000000 degF the air rise is 24.387097 degF and the air outlet 148.387097 degF. What has happened to both since the design point?",
 "The rise has fallen from 30.000000 degF and the outlet has risen from 125.000000 degF.",
 ["The rise has risen from 30.000000 degF and the outlet has risen from 125.000000 degF.",
  "The rise has fallen from 30.000000 degF and the outlet has fallen from 125.000000 degF.",
  "Both have been held, because the air mass is one of the two things the plant owns."],
 "The duty falls, so the rise across a fixed air mass falls with it, and the outlet still climbs because the ambient beneath it has risen further than the rise has fallen.")

q(1, "What is the engine's stated basis for a hot-day answer?",
 "Effectiveness-NTU at fixed UA and fixed air mass, with no arrangement and no F correction assumed.",
 ["The counter-current log mean at fixed UA, corrected by an F of 1.000000 for cross flow.",
  "The surface equation solved at the design log mean, with the duty scaled by the ambient span.",
  "The 1-2 shell relation at fixed UA, which is the arrangement a finned bundle most resembles."],
 "The effectiveness is taken from its definition at the design point, so the one number this module cannot source never enters the answer.")

q(2, "The duty fraction and the process outlet are the two columns that move. Which of these may be formed from them?",
 "The direction each one takes as the ambient rises.",
 ["The ratio of the duty fraction to the process outlet at each ambient.",
  "The ratio of the process outlet to the effectiveness that produced it.",
  "The rate at which the duty fraction falls per degF of ambient."],
 "The engine computes no ratio between those columns, so a figure formed by dividing them is a figure nothing here stands behind. The direction is the finding.")

q(3, "A published hot-day row gives a design duty of 8000000.0000 Btu an hour with a process inlet of 180.000000 degF, an outlet of 120.000000 degF and a design ambient of 90.000000 degF. At a check ambient of 105.000000 degF what UA does it carry?",
 "176729.1173 Btu an hour per degF.",
 ["234565.8720 Btu an hour per degF.",
  "110580.3328 Btu an hour per degF.",
  "186968.1844 Btu an hour per degF."],
 "UA is a property of the bay rather than of the check ambient. The figure 110580.3328 belongs to the published row with a design duty of 14000000.0000 Btu an hour.")

q(0, "What would taking the second-method log mean at the design outlet and the design air rise turn the check into?",
 "A restatement, since it would no longer be formed at the answer being checked.",
 ["A refusal, since the engine will not form a log mean at two different sets of terminals.",
  "A sizing, since those are the design terminals.",
  "An identity, since the design log mean and UA reproduce the design duty by construction."],
 "The hot-day log mean is formed at the rated outlet and the rated air rise. That is what holding UA fixed means, and it is what lets the product be a check.")

# --- what the method does not know -----------------------------------------
q(1, "Which of these numbers can be measured out of the engine rather than taken from its source?",
 "The specific heat behind a bay's air balance, at 0.240000.",
 ["The Dittus-Boelter coefficient of 0.023000, pinned by literal.",
  "The laminar Nusselt number of 3.660000.",
  "The declared maximum of 6 shell passes."],
 "It falls out of the duty over the air mass and the rise on a bay's own answer. A fitted coefficient and a declared bound cannot be recovered that way.")

q(2, "The fan constant implies a water density of 62.303335 lb per ft3. Where is that figure recorded, and as what?",
 "In the published file, as a measurement rather than as a citation.",
 ["In the declared constants table, as a pinned literal beside the fan constant.",
  "In the held register, as the one entry with an established source.",
  "In the engine's fan answer, beside the brake horsepower."],
 "The oracle's fan route goes through pascals with that density and carries no customary constant at all, so moving the constant in both files still fails.")

q(3, "What does the held register entry for the Dittus-Boelter band say the engine does instead?",
 "It returns the Reynolds and the Prandtl numbers on every call so a caller can check them against a source they trust.",
 ["It refuses any call whose Reynolds number falls outside 2300 to 10000.",
  "It applies the laminar limit wherever the band cannot be confirmed for the case.",
  "It reports a validity band taken from the golden file, with a note that it is synthetic."],
 "Nothing here grades them. That is the honest shape for a held item: the numbers a reader would need are handed over and nothing claims to have checked them.")

q(0, "Which of these is a declared bound this module chose rather than a limit it took from a publication?",
 "The maximum of 6 shell passes in series.",
 ["The conversion of 2.419100 from centipoise to pounds per foot per hour.",
  "The ceiling of 0.500000 on a parallel unit at a capacity ratio of 1.000000.",
  "The Prandtl exponent of 0.400000 in the heating form of the correlation."],
 "It exists because the correction factor climbs toward one as shells are added, so an unbounded box makes any duty reachable by typing a bigger number, and the refusal says it is declared.")

q(1, "The other declared bound is a margin of 10 percent. What does it govern?",
 "Whether a controlling resistance verdict stands alone or carries a note telling a reader to treat two terms as jointly controlling.",
 ["Whether a bundle diameter is reported at all, given the two layouts that are identical.",
  "Whether a duty fraction above one is labelled as a capability rather than a delivered duty.",
  "Whether a film coefficient is refused for sitting too near the edge of the transition band."],
 "A one-word verdict decided by a two percent gap is a coin toss, so below this margin the answer carries a note instead. It is a reporting threshold rather than a physical one.")

q(2, "A course may teach what an engine used to do. What makes such a sentence a defect instead?",
 "Reading as current behaviour rather than as an account of a former state.",
 ["Naming the repair that changed it, since a repair name dates the sentence.",
  "Carrying a figure from before the repair, since every such figure is stale.",
  "Appearing anywhere outside the engine's own source comments."],
 "The framing has to come from the heading above a passage or the line immediately before it. A sentence lifted out of a source comment arrives with no frame around it.")

q(3, "Before the repair the studio passed a hard-coded tube count into the film while printing a different count beside it. What is the general lesson recorded against that former behaviour?",
 "A screen showing two numbers that disagree about the same thing is a screen where one of them was never computed.",
 ["A hard-coded input should be replaced by the value from the published file.",
  "A film coefficient should never be reported on the same screen as a tube count.",
  "A count printed beside a coefficient should carry the pass count with it."],
 "The fix is to close the loop rather than to choose a better constant. That is history and it is what the studio used to do.")

# --- the expert reading ----------------------------------------------------
q(0, "A reviewer receives a bare surface and a hot-day duty from this module with no qualifications attached. What has been lost?",
 "That the surface is on a counter-current basis, and that the rating holds effectiveness at fixed UA and fixed air mass.",
 ["That the surface was formed on the bare tube area rather than the finned one, and that the duty is a fraction.",
  "That the surface carries the declared 10 percent margin, and that the duty was checked against the published file.",
  "That the surface was sized at the design ambient, and that the duty was rated at the same ambient."],
 "Both qualifications are stated by the engine itself, one in an empty correction field with its note and one in the basis string on every rated answer.")

q(1, "Two exports in this package are called an overall coefficient. What has to travel with either one?",
 "The area it is referred to.",
 ["The fouling allowances behind it.",
  "The arrangement it was formed for.",
  "The tube count that produced its film."],
 "This module's is referred to the outside tube surface and says so on every answer. A second export in the production domain is referred to a stated bore instead.")

q(2, "This module exports 17 names in all. How many of them are frozen tables rather than functions?",
 "3, which are the declared constants, the declared bounds and the held register.",
 ["2, which are the declared constants and the held register.",
  "7, one for each entry the held register carries.",
  "12, one for each door that takes a named-argument object."],
 "Section 20 reads the held register itself rather than quoting a count from the module's header sentence, which is how the disagreement between 7 and six was found.")

q(3, "Which habit does this tier end on?",
 "Compute one number on a result sheet from the others.",
 ["Compare every number on a result sheet with the published file.",
  "Report every number on a result sheet to the precision the engine returns.",
  "Take every number on a result sheet from a single door of the engine."],
 "A result carrying several figures has to be self-consistent, and the numbers that are not independent are the ones that catch the error.")

# --- three that reach digest ground the tier's lessons do not ---------------
q(0, "A bundle is asked for at a layout of 60 degrees. What happens?",
 "It is refused, because this module carries constants for 30, 45 and 90 degree layouts only.",
 ["It is answered, because 60 degrees falls between two layouts the module carries.",
  "It is answered with a note attached, because the 45 and 90 degree constants this module carries are identical anyway.",
  "It is refused, because a layout angle is held for literature and cannot be given at all."],
 "The refusal names the layouts the module does carry rather than falling back on one of them.")

q(1, "A bundle-to-shell clearance of -2.5 inches is given. What does the engine do?",
 "It refuses, because the clearance must be zero or positive inches.",
 ["It answers, treating the sign as a bundle larger than its shell.",
  "It answers at a clearance of 2.500000 inches, which is the studio default.",
  "It refuses, because a clearance is an input the module holds for literature."],
 "A negative one would describe a shell narrower than the bundle inside it, and the message names the box rather than the geometry.")

q(2, "A bay whose process enters at 250.000000 degF is asked for a rating at a check ambient of 260.000000 degF. What comes back?",
 "A refusal, because the air is not colder than the process inlet, so the cooler has no driving force at all.",
 ["A duty fraction of zero, with the process outlet held at the process inlet.",
  "A negative duty fraction, which the engine labels hotter than design.",
  "A rating at the highest ambient the sweep carries, which is 124.000000 degF."],
 "The refusal states the two temperatures rather than returning a duty of zero and leaving a reader to interpret it.")

emit(Q, '/root/wt-fc6-nextgen/tools/course-banks/heattransfer/advanced/fc6a_exam.json', expect_n=42)
finish()
